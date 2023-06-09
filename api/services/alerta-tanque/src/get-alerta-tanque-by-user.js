const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a car in the database.
 *
 * @param {object} car - Object containing the data of the zona to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
const GET_ALERTA_TANQUE = 'SELECT * FROM get_alerta_tanque($1, $2, $3, $4)';
const type = "usuarioId";

module.exports.main = async (event) => {
  const {
    usuarioId,
  } = event.pathParameters;
  try {
    const client = await poolConection.connect();
    const  { rows: alerta } = await client.query(GET_ALERTA_TANQUE, [type, usuarioId, null, null])
    
    return {
      status: true,
      alerta
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
