const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError = require('../../../lib/errors/database-error');
const {uploadImage}   = require('../../../lib/image')
/** FINALIZAR PEDIDO */
const FINALIZAR_PEDIDO = 'SELECT * FROM finalizar_pedidos($1, $2, $3, $4, $5, $6, $7, $8, $9)';

/**
 * Inserts a pedido into the database.
 *
 * @param {object} pedido - Object containing the data of the pedido to insert.
 * @param {string} pedido._id - Identifier of the pedido in SQL.
 * @param {string} pedido.kilos - Observation of the pedido.
 * @param {number} pedido.factura - Capacity of the pedido.
 * @param {number} pedido.valor_total - Identifier of the zone where the pedido is located.
 * @param {number} pedido.forma_pago - Identifier of the client associated with the pedido.
 * @param {number} pedido.remision - Identifier of the client associated with the pedido.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
    const {
        idConductor,
    } = event.pathParameters;
  const body = JSON.parse(event.body);
  const {
    _id, kilos, factura, valor_total, forma_pago, remision, fechaEntrega
  } = body;
  
  try {
    const client = await poolConection.connect();
    const image_url = await uploadImage(body);
 
    await client.query(FINALIZAR_PEDIDO, [
      _id, kilos, factura, valor_total, forma_pago, remision, fechaEntrega, image_url, idConductor
    ])
    return {
        status: true
      }
  } catch (error) {
    console.error(error)
    throw new DatabaseError(error);
  }
};
