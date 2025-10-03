const {poolConection} = require('../../../lib/connection-pg.js')

/** save revision */
const SAVE_REVISION = 'SELECT * FROM save_revision($1, $2, $3, $4)';

/**
 * Inserts a tanques into the database.
 *
 * @param {object} tanques - Object containing the data of the tanques to insert.
 * @param {string} tanques.tanqueId - Identifier of the tanques in MongoDB.
 * @param {string} tanques.usuarioId - Observation of the tanques.
 * @param {number} tanques.puntoId - Capacity of the tanques.
 * @param {number} tanques.usuarioCrea - Identifier of the client associated with the tanques.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    tanqueId, usuarioId, puntoId, usuarioCrea
  } = body;
  const client = await poolConection.connect();

  try {
    
    const {rows} = await client.query(SAVE_REVISION, [tanqueId, usuarioId, puntoId, usuarioCrea])
    return {
        status: !!rows[0].save_revision
      }
  } catch (error) {
    throw JSON.stringify(error);
  }
};
