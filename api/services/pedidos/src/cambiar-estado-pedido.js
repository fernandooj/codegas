const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const CHANGE_STATUS = 'SELECT change_multiple_status($1::jsonb)';

/**
 * change status in the database.
 *
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    seleccionados
  } = body;

  try {
    const client = await poolConection.connect();
    await client.query(CHANGE_STATUS, [JSON.stringify(seleccionados)])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
