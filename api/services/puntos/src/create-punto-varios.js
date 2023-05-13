const {poolConection} = require('../../../lib/connection-pg.js')

/** save point */
const SAVE_POINT = 'SELECT * FROM save_puntos($1, $2, $3, $4, $5, $6, $7)';

/**
 * Inserts a point into the database.
 *
 * @param {object} point - Object containing the data of the point to insert.
 * @param {string} point.observacion - Observation of the point.
 * @param {number} point.punto - Capacity of the point.
 * @param {number} point.idZona - Identifier of the zone where the point is located.
 * @param {number} point.idCliente - Identifier of the client associated with the point.
 * @param {number} point.idPadre - Identifier of the parent point, if any.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 module.exports.main = async (event) => {
    const body = JSON.parse(event.body);
    const points = Array.isArray(body) ? body : [body]; // check if body is an array or not
  
    const client = await poolConection.connect();
  
    try {
      await Promise.all(points.map(point => {
        const {
           observacion, direccion, capacidad, punto, idZona, idCliente, idPadre
        } = point;
        return client.query(SAVE_POINT, [ observacion, direccion, capacidad, punto, idZona, idCliente, idPadre]);
      }));
  
      return {
          status: true
        }
    } catch (error) {
      throw JSON.stringify(error);
    }
  };
  
