const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener vehículos no eliminados con límite
 *
 * @param {object} event - Evento de API Gateway con limit en pathParameters
 * @returns {Promise<object>} - Promise que resuelve con la lista de vehículos
 * @throws {DatabaseError} - Lanza un error si la operación falla
 */
const GET_CAR_S = 'SELECT * FROM get_data_carro_user($1)';

module.exports.main = async (event) => {
  let client;
  try {
    client = await poolConection.connect();
    const { limit } = event.pathParameters || {};
    const _id = null; // null para obtener todos los vehículos

    const { rows: carro } = await client.query(GET_CAR_S, [_id]);

    // Aplicar límite si se proporciona
    let resultado = carro;
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        resultado = carro.slice(0, limitNum);
      }
    }

    return {
      status: true,
      carro: resultado
    };
  } catch (error) {
    console.error('Error obteniendo vehículos activos:', error);
    throw new DatabaseError(error);
  } finally {
    // Asegurar que la conexión se libere siempre, incluso si hay un error
    if (client) {
      client.release();
    }
  }
};
