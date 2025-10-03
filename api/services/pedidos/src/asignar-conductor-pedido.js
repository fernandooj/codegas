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
    // Convertir la fecha ISO a formato que PostgreSQL pueda entender mejor
    let fechaFormateada = fechaEntrega;
    if (fechaEntrega && fechaEntrega.includes('T')) {
      // Si viene en formato ISO (2025-09-22T05:00:00.000Z), convertir a formato estándar
      fechaFormateada = fechaEntrega.replace('T', ' ').replace('Z', '');
      // Remover los milisegundos si están presentes
      fechaFormateada = fechaFormateada.replace(/\.\d{3}/, '');
    }

    console.log('🔧 [AsignarConductor] Parámetros recibidos:');
    console.log('📋 pedidoId:', pedidoId);
    console.log('🚗 carroId:', carroId);
    console.log('📅 fechaEntrega original:', fechaEntrega);
    console.log('📅 fechaEntrega formateada:', fechaFormateada);
    console.log('👤 nPedido (usuarioAsigna):', nPedido);

    const result = await client.query(ASIGNAR_CONDUCTOR_PEDIDO, [pedidoId, carroId, fechaFormateada, nPedido]);

    console.log('✅ [AsignarConductor] Resultado de la función SQL:', result.rows[0]);

    client.release();

    return {
      status: true
    }
  } catch (error) {
    console.log(error)
    client.release();
    throw new DatabaseError(error);
  }
};
