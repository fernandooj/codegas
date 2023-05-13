const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/** deactivate zona */

/**
 * Deactivates a zona in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  
  const GET_ALL_PUNTOS = 'SELECT * from puntos';
  const client = await poolConection.connect();

  try {
    const {rows: puntos} = await client.query(GET_ALL_PUNTOS)
    return {
      status: true,
      puntos
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
