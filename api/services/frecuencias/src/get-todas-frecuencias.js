const AWS = require('aws-sdk');
const ses = new AWS.SES();
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_FRECUENCIAS = 'SELECT * FROM get_todas_frecuencias()';
/**
 * add drivers car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 
module.exports.main = async (event) => {  
    
  
  try {
    const client = await poolConection.connect();
    
    const {rows: frecuencias} = await client.query(GET_FRECUENCIAS, [])

    return {
      status: true,
      frecuencias
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
