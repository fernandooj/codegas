const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a car in the database.
 *
 * @param {object} pedidos - get pedidos just from today by userid and puntoId
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const GET_PEDIDOS_TODAY = 'SELECT * FROM get_pedido_today($1, $2)';

module.exports.main = async (event) => {
  const {
    usuarioId,
    puntoId
  } = event.pathParameters;

  try {
    const client = await poolConection.connect();
    const  { rows: pedido } = await client.query(GET_PEDIDOS_TODAY, [usuarioId, puntoId])
    
    return {
      status: true,
      pedido: pedido[0].get_pedido_today
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
