const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const ASIGNAR_CONDUCTOR_PEDIDO = 'SELECT * FROM asignar_conductor_pedido($1, $2, $3, $4)';
/**
 * add drivers car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {

  const {
    pedidoId,
    carroId,
    fechaEntrega,
    nPedido
  } = event.pathParameters;
  
  const client = await poolConection.connect();

  try {
    await client.query(ASIGNAR_CONDUCTOR_PEDIDO, [pedidoId, carroId, fechaEntrega, nPedido])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
