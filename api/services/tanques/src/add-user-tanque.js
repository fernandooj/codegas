const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * add user.
 *
 * @param {object} user - Object containing the data of the zona to deactivate.
 * @param {number} user._id - Identifier of the user in the database.
 * @param {number} user.puntoid - Identifier of the point in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

const ADD_USER = 'UPDATE tanques SET usuarioId = $1, puntoId = $2 WHERE _id = $3';
module.exports.main = async (event) => {
  
  const body = JSON.parse(event.body);
  const {
    usuarioId,
    puntoId,
    tanqueId
  } = body;

  const client = await poolConection.connect();

  try {
    await client.query(ADD_USER, [usuarioId, puntoId, tanqueId])
    return {
      status: true
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
