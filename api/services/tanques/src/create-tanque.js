const { poolConection } = require('../../../lib/connection-pg.js')

/** Persist a tanque record */
const SAVE_TANQUE = 'SELECT * FROM save_tanques($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

/**
 * Inserts a tanque into the database.
 *
 * @param {object} tanque - Body payload with tanque data.
 * @param {string} tanque.capacidad - Capacidad en kilogramos.
 * @param {string} tanque.fabricante - Fabricante del tanque.
 * @param {string} tanque.registro_onac - Registro ONAC del tanque. 
 * @param {string} tanque.fecha_mantenimiento - Fecha del último mantenimiento (ISO).
 * @param {string} tanque.fecha_ultima_rev - Fecha de la última revisión total (ISO).
 * @param {string} tanque.n_placa - Número de placa de mantenimiento.
 * @param {string} tanque.codigo_activo - Código interno del activo.
 * @param {string} tanque.serie - Número de serie.
 * @param {string} tanque.ano_fabricacion - Año de fabricación.
 * @param {string} tanque.existe_tanque - Estado/ubicación del tanque.
 * @param {string} tanque.propiedad - Propietario del tanque.
 * @param {number} tanque.usuario_crea - Usuario que crea el registro.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    capacidad,
    fabricante,
    registro_onac,
    fecha_mantenimiento,
    fecha_ultima_rev,
    n_placa,
    codigo_activo,
    serie,
    ano_fabricacion,
    existe_tanque,
    propiedad,
    usuario_crea
  } = body;
  const client = await poolConection.connect();
  try {
    console.log({
      capacidad,
      fabricante,
      registro_onac,
      fecha_mantenimiento,
      fecha_ultima_rev,
      n_placa,
      codigo_activo,
      serie,
      ano_fabricacion,
      existe_tanque,
      propiedad,
      usuario_crea
    });
    const { rows } = await client.query(SAVE_TANQUE, [
      capacidad,
      fabricante,
      registro_onac,
      fecha_mantenimiento,
      fecha_ultima_rev,
      n_placa,
      codigo_activo,
      serie,
      ano_fabricacion,
      existe_tanque,
      propiedad,
      usuario_crea
    ])

    return {
      status: true,
      code: rows[0].save_tanques
    }
  } catch (error) {
    throw JSON.stringify(error);
  }
};
