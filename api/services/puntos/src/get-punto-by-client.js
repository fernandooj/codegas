const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_PUNTO_BY_USER = 'SELECT * FROM get_puntos_user($1)';

/**
 * Deactivates a zona in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 module.exports.main = async (event) => {
    const {
      _id,
    } = event.pathParameters;
  
    // Convertir el ID en un número entero
    const idNum = parseInt(_id, 10);
  
    const client = await poolConection.connect();
    console.log(_id)
    try {
      const {rows: puntos} = await client.query(GET_PUNTO_BY_USER, [idNum]);
 
      return {
        status: true,
        puntos
      }
    } catch (error) {
      console.log(error);
      throw new DatabaseError(error);
    }
  };
  
