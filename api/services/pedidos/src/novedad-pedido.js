const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const NOVEDAD_PEDIDO = 'SELECT * FROM novedad_pedidos($1, $2, $3, $4, $5)';
/**
 * add drivers car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 module.exports.main = async (event) => {
 
    const body = JSON.parse(event.body);
    const {
      _id, novedad, perfil_novedad, fechaEntrega, conductorId
    } = body;
    
    try {
      const client = await poolConection.connect();
   
      await client.query(NOVEDAD_PEDIDO, [
        _id, novedad, perfil_novedad, fechaEntrega, conductorId
      ])
      return {
          status: true
        }
    } catch (error) {
      console.error(error)
      throw new DatabaseError(error);
    }
  };