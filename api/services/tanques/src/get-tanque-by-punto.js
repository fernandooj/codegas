const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a tanque by punto in the database.
 *
 * @param {object} tanque - Object containing the data of the tanque to deactivate.
 * @param {number} tanque.puntoId - Identifier of the tanque in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const GET_TANQUE_BY_PUNTO = 'SELECT * FROM get_tanque_by_punto($1)';

module.exports.main = async (event) => {
  const {
    _id
  } = event.pathParameters;
 
 
  
  try {
    const client = await poolConection.connect();
    const  { rows: tanque } = await client.query(GET_TANQUE_BY_PUNTO, [_id])
  
    return {
      status: true,
      tanque: tanque
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
