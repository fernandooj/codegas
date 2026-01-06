const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/** change valor unitario 2 */

/**
 * Updates valor_unitario_2 for a user in the database.
 *
 * @param {object} event - Lambda event object.
 * @param {number} event.pathParameters._id - User identifier in the database.
 * @param {number} event.pathParameters.valorunitario2 - New valor unitario 2.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails.
 */

module.exports.main = async (event) => {
    const {
        _id,
        valorunitario2
      } = event.pathParameters;
  
  const CHANGE_VALOR_UNITARIO_2 = 'UPDATE users SET valor_unitario_2 = $1 WHERE _id = $2';
  
  try {
    const client = await poolConection.connect();
    await client.query(CHANGE_VALOR_UNITARIO_2, [valorunitario2, _id])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};

