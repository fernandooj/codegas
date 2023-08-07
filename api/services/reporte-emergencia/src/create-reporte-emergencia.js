const {poolConection} = require('../../../lib/connection-pg.js')

/**
 * Inserts reporte emergencia into the database.
 *
 * @param {object} point - Object containing the data of the point to insert.
 * @param {string} point.id_mongo_punto - Identifier of the point in MongoDB.
 * @param {string} point.observacion - Observation of the point.
 * @param {number} point.punto - Capacity of the point.
 * @param {number} point.idZona - Identifier of the zone where the point is located.
 * @param {number} point.idCliente - Identifier of the client associated with the point.
 * @param {number} point.idPadre - Identifier of the parent point, if any.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, ruta, usuarioCrea
  } = body;
  const client = await poolConection.connect();
  const CREATE_REPORT = 'INSERT INTO reporte_emergencia(tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, ruta, usuarioCrea) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
  
  try {
    
    await client.query(CREATE_REPORT, [tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, ruta, usuarioCrea])
    return {
        status: true
      }
  } catch (error) {
    throw JSON.stringify(error);
  }
};
