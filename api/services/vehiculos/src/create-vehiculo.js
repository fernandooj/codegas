const { poolConection } = require('../../../lib/connection-pg.js')

/** save CAR */
const SAVE_CAR = 'SELECT * FROM save_carros($1, $2, $3, $4, $5, $6)';

/**
 * Inserts a vehiculo into the database.
 *
 * @param {object} vehiculo - Object containing the data of the vehiculo to insert.
 * @param {string} vehiculo.centro - Centro de costos.
 * @param {string} vehiculo.bodega - Bodega.
 * @param {string} vehiculo.placa - Placa del vehículo.
 * @param {number} vehiculo.conductor - Conductor del vehículo.
 * @param {number} vehiculo.usuarioCrea - Usuario que crea el vehículo.
 * @param {number} vehiculo.capacidad - Capacidad del vehículo en litros.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    centro, bodega, placa, conductor, usuarioCrea, capacidad = 0
  } = body;
  const client = await poolConection.connect();

  try {

    const { rows } = await client.query(SAVE_CAR, [centro, bodega, placa, conductor, usuarioCrea, capacidad])
    return {
      status: !!rows[0].save_carros
    }
  } catch (error) {
    throw JSON.stringify(error);
  }
};
