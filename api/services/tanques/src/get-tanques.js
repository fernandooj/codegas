const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a car in the database.
 *
 * @param {object} car - Object containing the data of the zona to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const GET_TANQUES = 'SELECT * FROM get_tanques($1, $2, $3)';

module.exports.main = async (event) => {
  const {
    limit,
    start,
    busqueda
  } = event.pathParameters;
  const newSearch = busqueda == 'undefined' ||  busqueda == undefined ? '' :busqueda
  try {
    const client = await poolConection.connect();
    const  { rows: tanque } = await client.query(GET_TANQUES, [limit, start, newSearch])
    
    return {
      status: true,
      tanque
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
