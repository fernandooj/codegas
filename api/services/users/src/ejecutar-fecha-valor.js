const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Cron job que se ejecuta diariamente para aplicar los cambios de valorUnitario
 * con valorUnitario2 para las fechas programadas que coincidan con el día actual.
 * 
 * Este cron job debe ejecutarse una vez al día (recomendado: temprano en la mañana)
 * 
 * @param {object} event - Lambda event object (desde EventBridge/CloudWatch Events).
 * @returns {Promise<object>} - Promise que resuelve con un objeto indicando el resultado.
 * @throws {DatabaseError} - Lanza DatabaseError si la operación falla.
 */

module.exports.main = async (event) => {
    const client = await poolConection.connect();

    try {
        // Configurar zona horaria
        await client.query("SET TIME ZONE 'America/Bogota'");

        // Obtener la fecha actual
        const { rows: fechaActual } = await client.query("SELECT CURRENT_DATE as fecha");
        const fechaHoy = fechaActual[0].fecha;

        // Convertir a string en formato YYYY-MM-DD
        const fechaHoyString = fechaHoy instanceof Date
            ? fechaHoy.toISOString().split('T')[0]
            : String(fechaHoy).split('T')[0];

        console.log(`🔍 Verificando fechas programadas para: ${fechaHoyString}`);

        // Buscar fechas programadas para hoy que no hayan sido ejecutadas
        const GET_FECHAS_PROGRAMADAS = `
      SELECT _id, fecha_aplicar, fecha_creacion
      FROM fechas_programadas_valor
      WHERE fecha_aplicar = $1 
        AND ejecutado = FALSE
      ORDER BY fecha_creacion ASC
    `;

        const fechasProgramadas = await client.query(GET_FECHAS_PROGRAMADAS, [fechaHoyString]);

        if (fechasProgramadas.rows.length === 0) {
            console.log(`✅ No hay fechas programadas para hoy (${fechaHoyString})`);
            return {
                status: true,
                message: `No hay fechas programadas para hoy (${fechaHoyString})`,
                fechaVerificada: fechaHoyString,
                fechasProcesadas: 0
            };
        }

        console.log(`📅 Encontradas ${fechasProgramadas.rows.length} fecha(s) programada(s) para hoy`);

        // Query para actualizar valorUnitario con valorUnitario2 donde:
        // 1. valorUnitario2 no sea null y sea mayor a 0
        // 2. fecha_expiracion sea NULL (sin fecha de expiración) O fecha_expiracion sea anterior o igual a hoy
        // (Solo se actualiza si la fecha de expiración ya pasó o no tiene fecha de expiración)
        const APLICAR_CAMBIO_VALOR = `
      UPDATE users 
      SET valorunitario = valor_unitario_2 
      WHERE valor_unitario_2 IS NOT NULL 
        AND valor_unitario_2 > 0
        AND (fecha_expiracion IS NULL OR fecha_expiracion <= CURRENT_DATE)
    `;

        // Ejecutar el cambio
        const resultadoUpdate = await client.query(APLICAR_CAMBIO_VALOR);
        const usuariosActualizados = resultadoUpdate.rowCount;

        console.log(`✅ Cambio aplicado: ${usuariosActualizados} usuarios actualizados`);
        console.log(`ℹ️ Solo se actualizaron usuarios con fecha_expiracion NULL o anterior/igual a ${fechaHoyString}`);

        // Marcar todas las fechas programadas para hoy como ejecutadas
        const MARCAR_COMO_EJECUTADAS = `
      UPDATE fechas_programadas_valor
      SET ejecutado = TRUE,
          fecha_ejecucion = NOW() AT TIME ZONE 'America/Bogota',
          usuarios_actualizados = $1
      WHERE fecha_aplicar = $2 
        AND ejecutado = FALSE
    `;

        await client.query(MARCAR_COMO_EJECUTADAS, [usuariosActualizados, fechaHoyString]);

        console.log(`✅ ${fechasProgramadas.rows.length} fecha(s) marcada(s) como ejecutada(s)`);

        return {
            status: true,
            message: `Cambio aplicado exitosamente. ${usuariosActualizados} usuarios actualizados.`,
            fechaAplicada: fechaHoyString,
            usuariosActualizados: usuariosActualizados,
            fechasProcesadas: fechasProgramadas.rows.length
        };

    } catch (error) {
        console.error('❌ Error al ejecutar fecha valor:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

