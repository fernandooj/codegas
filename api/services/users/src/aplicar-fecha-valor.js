const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Programa el cambio de valorUnitario con valorUnitario2 para todos los usuarios
 * que tengan valorUnitario2 definido, en la fecha especificada.
 * 
 * @param {object} event - Lambda event object.
 * @param {string} event.body.fecha - Fecha en formato YYYY-MM-DD cuando se aplicará el cambio.
 * @returns {Promise<object>} - Promise que resuelve con un objeto indicando si la operación fue exitosa.
 * @throws {DatabaseError} - Lanza DatabaseError si la operación falla.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const { fecha } = body;

  if (!fecha) {
    throw new Error('Fecha es requerida');
  }

  // Validar formato de fecha
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new Error('Formato de fecha inválido. Debe ser YYYY-MM-DD');
  }

  // Validar que la fecha no sea en el pasado
  const fechaProgramada = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaProgramada.setHours(0, 0, 0, 0);

  if (fechaProgramada < hoy) {
    throw new Error('La fecha no puede ser en el pasado');
  }

  // Verificar si ya existe una fecha programada para ese día
  const VERIFICAR_FECHA_EXISTENTE = `
    SELECT _id FROM fechas_programadas_valor 
    WHERE fecha_aplicar = $1 AND ejecutado = FALSE
  `;

  // Insertar la fecha programada en la tabla
  const INSERTAR_FECHA_PROGRAMADA = `
    INSERT INTO fechas_programadas_valor (fecha_aplicar, fecha_creacion)
    VALUES ($1, NOW() AT TIME ZONE 'America/Bogota')
    RETURNING _id, fecha_aplicar
  `;

  const client = await poolConection.connect();

  try {
    // Configurar zona horaria
    await client.query("SET TIME ZONE 'America/Bogota'");

    // Verificar si ya existe una fecha programada para ese día
    const fechaExistente = await client.query(VERIFICAR_FECHA_EXISTENTE, [fecha]);

    if (fechaExistente.rows.length > 0) {
      return {
        status: true,
        message: `Ya existe una fecha programada para el ${fecha}. El cambio se aplicará automáticamente ese día.`,
        fechaAplicada: fecha,
        yaExistia: true
      };
    }

    // Insertar la nueva fecha programada
    const result = await client.query(INSERTAR_FECHA_PROGRAMADA, [fecha]);

    return {
      status: true,
      message: `Fecha programada exitosamente. El cambio se aplicará automáticamente el ${fecha}.`,
      fechaAplicada: fecha,
      idProgramacion: result.rows[0]._id,
      yaExistia: false
    };
  } catch (error) {
    console.log('Error al programar fecha valor:', error);
    throw new DatabaseError(error);
  } finally {
    client.release();
  }
};

