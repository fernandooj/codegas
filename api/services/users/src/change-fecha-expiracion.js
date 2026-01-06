const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/** change fecha expiracion */

/**
 * Updates fecha_expiracion for a user in the database.
 *
 * @param {object} event - Lambda event object.
 * @param {number} event.pathParameters._id - User identifier in the database.
 * @param {string} event.pathParameters.fecha_expiracion - New fecha expiracion (YYYY-MM-DD).
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails.
 */

module.exports.main = async (event) => {
    const {
        _id,
        fecha_expiracion
      } = event.pathParameters;
  
  const CHANGE_FECHA_EXPIRACION = 'UPDATE users SET fecha_expiracion = $1 WHERE _id = $2';
  
  try {
    const client = await poolConection.connect();
    await client.query(CHANGE_FECHA_EXPIRACION, [fecha_expiracion, _id])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};

