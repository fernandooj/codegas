const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * EDIT a car in the database using the edit_carros function.
 *
 * @param {object} event - Event object containing pathParameters and body.
 * @param {string} event.pathParameters._id - Identifier of the car in the database.
 * @param {object} event.body - Object containing the car data to update.
 * @param {number} event.body.centro - Centro de costos.
 * @param {number} event.body.bodega - Bodega.
 * @param {string} event.body.placa - Placa del vehículo.
 * @param {number} event.body.capacidad - Capacidad del vehículo.
 * @param {boolean} event.body.activo - Estado activo del vehículo.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const { _id } = event.pathParameters;
  const { centro, bodega, placa, capacidad = 0, activo = true } = body;

  const EDIT_CAR = 'SELECT edit_carros($1, $2, $3, $4, $5, $6) as result';
  let client;
  try {
    client = await poolConection.connect();
    const { rows } = await client.query(EDIT_CAR, [_id, centro, bodega, placa, capacidad, activo]);

    if (rows[0].result === null) {
      return {
        status: false,
        message: 'Esta placa ya existe'
      };
    }

    return {
      status: true,
      message: 'Vehículo editado exitosamente'
    };
  } catch (error) {
    console.log(error);
    throw new DatabaseError(error);
  } finally {
    if (client) {
      client.release();
    }
  }
};
