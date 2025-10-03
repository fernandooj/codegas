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
    const body = JSON.parse(event.body);
 
    const {
      email,
      uid
    } = body;
  
  const UPDATE_UID = 'UPDATE users SET uid = $1 WHERE email = $2';
  
  try {
    const client = await poolConection.connect();
    await client.query(UPDATE_UID, [uid, email])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
