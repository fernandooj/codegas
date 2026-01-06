const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const CHANGE_ORDER_FECHA = 'SELECT change_orden_fecha_entrega($1::jsonb)';

/**
 * Update order and delivery date for multiple pedidos in the database.
 *
 * @param {object} event - Lambda event object
 * @param {object} event.body - Request body containing pedidos array
 * @param {Array} event.body.pedidos - Array of objects with {_id, orden, fechaEntrega}
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const { pedidos } = body;

  if (!pedidos || !Array.isArray(pedidos)) {
    throw new DatabaseError('pedidos debe ser un array');
  }

  const client = await poolConection.connect();
  try {
    await client.query(CHANGE_ORDER_FECHA, [JSON.stringify(pedidos)]);
    return {
      status: true
    };
  } catch (error) {
    console.log(error);
    throw new DatabaseError(error);
  } finally {
    client.release();
  }
};



