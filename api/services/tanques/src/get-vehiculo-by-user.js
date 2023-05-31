const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const GET_CAR_BY_USER = 'SELECT * FROM get_data_carro_user($1)';

module.exports.main = async (event) => {
  const {
    _id
  } = event.pathParameters;
 
 
  const client = await poolConection.connect();

  try {
    const  { rows: carro } = await client.query(GET_CAR_BY_USER, [_id])
  
    return {
      status: true,
      carro: carro[0]
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
