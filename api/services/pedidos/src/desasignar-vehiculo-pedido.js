const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Desasigna un vehículo de un pedido (pone en NULL conductorId y carroId)
 *
 * @param {number} pedidoId - ID del pedido a desasignar
 * @returns {Promise<object>} - Promise que resuelve con un objeto indicando si la operación fue exitosa
 * @throws {DatabaseError} - Lanza un error si la operación falla
 */

module.exports.main = async (event) => {
  let client;
  try {
    const { pedidoId } = event.pathParameters;

    if (!pedidoId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          status: false,
          message: 'pedidoId es requerido'
        })
      };
    }

    client = await poolConection.connect();

    console.log('🔧 [DesasignarVehiculoPedido] Desasignando vehículo del pedido:', pedidoId);

    // Query para desasignar el vehículo (poner en NULL conductorId y carroId)
    const desasignarQuery = `
      UPDATE pedidos 
      SET 
        conductorId = NULL,
        carroId = NULL,
        usuarioAsignaVehiculo = NULL,
        orden = NULL
      WHERE _id = $1
      RETURNING _id
    `;

    const result = await client.query(desasignarQuery, [pedidoId]);

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          status: false,
          message: 'Pedido no encontrado'
        })
      };
    }

    console.log('✅ [DesasignarVehiculoPedido] Pedido desasignado correctamente:', pedidoId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        status: true,
        message: 'Pedido desasignado correctamente'
      })
    };
  } catch (error) {
    console.error('❌ [DesasignarVehiculoPedido] Error:', error);
    throw new DatabaseError(error);
  } finally {
    if (client) {
      client.release();
    }
  }
};

