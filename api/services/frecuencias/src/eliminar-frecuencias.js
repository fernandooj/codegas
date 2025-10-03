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
      
  const DELETE_FRECUENCIA = 'UPDATE pedidos SET frecuencia = null WHERE _id = $1';
  const {
    id
  } = event.pathParameters;
  try {
    
    const client = await poolConection.connect();
    
     await client.query(DELETE_FRECUENCIA, [id])

    return {
      status: true,
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
