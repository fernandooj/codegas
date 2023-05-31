const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * EDIT a car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    _id
  } = event.pathParameters;
  const {
    centro, bodega, placa
  } = body;
  
  const EDIT_CAR = 'UPDATE carros SET centro = $1, bodega = $2, placa = $3 WHERE _id = $4';
  const client = await poolConection.connect();

  try {
    await client.query(EDIT_CAR, [centro, bodega, placa, _id])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
