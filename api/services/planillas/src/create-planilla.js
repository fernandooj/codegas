const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Creates a new planilla in the database
 * 
 * @param {object} event - Lambda event object containing planilla data in body
 * @returns {Promise<object>} - Promise that resolves with created planilla
 * @throws {DatabaseError} - Throws DatabaseError if operation fails
 */
module.exports.main = async (event) => {
    const client = await poolConection.connect();

    try {
        const body = JSON.parse(event.body || '{}');
        const {
            ruta,
            guia,
            no_planilla: _noPlanillaCliente, // ignorado: consecutivo automático en servidor
            placa_vehiculo,
            fecha,
            kilometraje_inicial,
            kilometraje_final,
            remision_inicial,
            remision_final,
            inventario_inicial_porcentaje,
            inventario_final_porcentaje,
            inventario_inicial_kl,
            inventario_final_kl,
            novedades,
            gastos,
            user_id
        } = body;

        // Validación básica
        if (!user_id) {
            return {
                status: false,
                message: 'user_id es requerido'
            };
        }

        // Consecutivo global automático (no reutiliza números de planillas eliminadas)
        const { rows: seqRows } = await client.query(`
            SELECT COALESCE(MAX(no_planilla), 0) + 1 AS next_no
            FROM planillas
            WHERE COALESCE(eliminado, FALSE) = FALSE
        `);
        const no_planilla = parseInt(seqRows[0]?.next_no, 10) || 1;

        const INSERT_PLANILLA = `
            INSERT INTO planillas (
                ruta,
                guia,
                no_planilla,
                placa_vehiculo,
                fecha,
                kilometraje_inicial,
                kilometraje_final,
                remision_inicial,
                remision_final,
                inventario_inicial_porcentaje,
                inventario_final_porcentaje,
                inventario_inicial_kl,
                inventario_final_kl,
                novedades,
                gastos,
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16)
            RETURNING *
        `;

        const gastosJson = Array.isArray(gastos) ? JSON.stringify(gastos) : '[]';

        const { rows } = await client.query(INSERT_PLANILLA, [
            ruta || null,
            guia || null,
            no_planilla,
            placa_vehiculo || null,
            fecha || null,
            kilometraje_inicial || null,
            kilometraje_final || null,
            remision_inicial || null,
            remision_final || null,
            inventario_inicial_porcentaje || null,
            inventario_final_porcentaje || null,
            inventario_inicial_kl || null,
            inventario_final_kl || null,
            novedades || null,
            gastosJson,
            user_id
        ]);

        return {
            status: true,
            planilla: rows[0],
            message: 'Planilla creada exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

