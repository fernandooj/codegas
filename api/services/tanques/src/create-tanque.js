const {poolConection} = require('../../../lib/connection-pg.js')

/** save CAR */
const SAVE_CAR = 'SELECT * FROM save_tanques($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';

/**
 * Inserts a vehiculo into the database.
 *
 * @param {object} vehiculo - Object containing the data of the vehiculo to insert.
 * @param {string} vehiculo.centro - Identifier of the vehiculo in MongoDB.
 * @param {string} vehiculo.bodega - Observation of the vehiculo.
 * @param {number} vehiculo.placa - Capacity of the vehiculo.
 * @param {number} vehiculo.conductor - Identifier of the zone where the vehiculo is located.
 * @param {number} vehiculo.usuarioCrea - Identifier of the client associated with the vehiculo.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    capacidad, placaText, fabricante, registroOnac, fechaUltimaRev, nPlaca, 
    codigoActivo, serie, anoFabricacion, existeTanque, ultimRevTotal, propiedad, usuarioCrea 
  } = body;
  const client = await poolConection.connect();
  try {
    
    const {rows} = await client.query(SAVE_CAR, [capacidad, placaText, fabricante, registroOnac, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, ultimRevTotal, propiedad, usuarioCrea ])
 
    return {
        status: true,
        code: rows[0].save_tanques
      }
  } catch (error) {
    throw JSON.stringify(error);
  }
};
