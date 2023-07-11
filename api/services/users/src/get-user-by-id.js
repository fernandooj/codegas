const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/** deactivate zona */

/**
 * GET uiser bi id
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const {
    _id
  } = event.pathParameters;
  
  const GET_USER_BY_ID = 'SELECT * FROM users WHERE _id = $1';
  
  try {
    const client = await poolConection.connect();
    const {rows} =  await client.query(GET_USER_BY_ID, [_id])
    return {
      status: true,
      user: rows[0]
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
