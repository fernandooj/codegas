const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 

/**
 * add coordenadas
 *
 * @param {object} lat - Object containing the data of the revision to deactivate.
 * @param {object} lng - Object containing the data of the revision to deactivate.
 * @param {object} poblado - Object containing the data of the revision to deactivate.
 * @param {object} ciudad - Object containing the data of the revision to deactivate.
 * @param {object} dpto - Object containing the data of the revision to deactivate.
 * @param {number} revision._id - Identifier of the revision in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {

  const {
    _id
  } = event.pathParameters;
  
  const body = JSON.parse(event.body);
  const {
    lat, lng, poblado, ciudad, dpto
  } = body;
  const coordenadas = `${lat}, ${lng}`

  const CHANGE_STATE = 'UPDATE revisiones SET coordenadas = $1, poblado = $2, ciudad = $3, dpto = $4 WHERE _id = $5';
  const client = await poolConection.connect();

  try {
    await client.query(CHANGE_STATE, [coordenadas, poblado, ciudad, dpto, _id])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
