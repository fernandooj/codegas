const {poolConection} = require('../../../lib/connection-pg.js')

/** Save Alerta */
const SAVE_ALERTA_TANQUE = 'SELECT * FROM save_alerta_tanques($1, $2, $3)';

/**
 * Inserts a vehiculo into the database.
 *
 * @param {object} alertaTanque - Object containing the data of the alertaTanque to insert.
 * @param {string} alertaTanque.alertaText - Identifier of the alertaTanque in MongoDB.
 * @param {string} alertaTanque.tanqueId - Observation of the alertaTanque.
 * @param {string} alertaTanque.usuarioCrea - Observation of the alertaTanque.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    alertaText, tanqueId, usuarioCrea  
  } = body;

  try {  
    const client = await poolConection.connect();
    const {rows} = await client.query(SAVE_ALERTA_TANQUE, [alertaText, tanqueId, usuarioCrea ])
 
    return {
        status: true,
        code: rows[0].save_alerta_tanques
      }
  } catch (error) {
    throw JSON.stringify(error);
  }
};
