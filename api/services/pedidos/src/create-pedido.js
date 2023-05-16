const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError = require('../../../lib/errors/database-error');

/** save PEDIDO */
const SAVE_PEDIDOS = 'SELECT * FROM save_pedidos($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)';

/**
 * Inserts a vehiculo into the database.
 *
 * @param {object} vehiculo - Object containing the data of the vehiculo to insert.
 * @param {string} vehiculo.centro - Identifier of the vehiculo in MongoDB.
 * @param {string} vehiculo.bodega - Observation of the vehiculo.
 * @param {number} vehiculo.placa - Capacity of the vehiculo.
 * @param {number} vehiculo.conductor - Identifier of the zone where the vehiculo is located.
 * @param {number} vehiculo.usuarioCrea - Identifier of the client associated with the vehiculo.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    forma, cantidadKl, cantidadPrecio, frecuencia, dia1, dia2, fechaSolicitud, pedidoPadre, 
    puntoId, zonaId, conductorId, carroId, usuarioAsigna, usuarioAsignaVehiculo, usuarioCrea, usuarioId
  } = body;
  
  try {
    const client = await poolConection.connect();

 
    await client.query(SAVE_PEDIDOS, [
      forma, cantidadKl, cantidadPrecio, frecuencia, dia1, dia2, fechaSolicitud, pedidoPadre, 
      puntoId, zonaId, conductorId, carroId, usuarioAsigna, usuarioAsignaVehiculo, usuarioCrea, usuarioId
    ])
    return {
        status: true
      }
  } catch (error) {
    console.error(error)
    throw new DatabaseError(error);
  }
};

// 1 - inicio sesion logistica
// 2 - 

//1 - inicio sesion cliente 