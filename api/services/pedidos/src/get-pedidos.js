const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a car in the database.
 *
 * @param {object} car - Object containing the data of the zona to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const GET_PEDIDOS = 'SELECT * FROM get_pedidos($1, $2, $3, $4, $5)';

module.exports.main = async (event) => {
  const {
    usuarioId,
    limit,
    start,
    acceso,
    search
  } = event.pathParameters;
  const newSearch = search == 'undefined' ||  search == undefined ? '' :search
  try {
    const client = await poolConection.connect();
    const  { rows: pedido } = await client.query(GET_PEDIDOS, [usuarioId, limit, inicio = start, acceso, newSearch])
    
    return {
      status: true,
      total: pedido.length,
      pedido
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
