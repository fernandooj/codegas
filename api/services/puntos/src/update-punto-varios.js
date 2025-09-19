const { poolConection } = require('../../../lib/connection-pg.js')

/** update point */
const UPDATE_POINT = 'UPDATE puntos SET observacion = $1, direccion = $2, capacidad = $3, punto = $4, coordenadas = $5, place_name = $6, idZona = $7, idCliente = $8, idPadre = $9 WHERE _id = $10';

/**
 * Updates points in the database.
 *
 * @param {object|array} points - Object or array containing the data of the points to update.
 * @param {string} points._id - ID of the point to update.
 * @param {string} points.observacion - Observation of the point.
 * @param {number} points.capacidad - Capacity of the point.
 * @param {number} points.idZona - Identifier of the zone where the point is located.
 * @param {string} points.direccion - Address of the point.
 * @param {number} points.idCliente - Identifier of the client associated with the point.
 * @param {number} points.idPadre - Identifier of the parent point, if any.
 * @param {string} points.location - Location coordinates.
 * @param {string} points.place_name - Place name.
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
                _id, observacion, direccion, capacidad, location, place_name, idZona, idCliente, idPadre
            } = point;

            // Convert location to point format if it's a string
            let coordenadas = null;
            if (location && typeof location === 'string') {
                coordenadas = location; // PostgreSQL point format
            } else if (location && location.lat && location.lng) {
                coordenadas = `${location.lng}, ${location.lat}`; // Convert to lng,lat format
            }

            return client.query(UPDATE_POINT, [
                observacion,
                direccion,
                capacidad,
                capacidad, // punto field
                coordenadas,
                place_name,
                idZona,
                idCliente,
                idPadre,
                _id
            ]);
        }));

        return {
            status: true
        }
    } catch (error) {
        console.error('Error updating points:', error);
        throw JSON.stringify(error);
    } finally {
        client.release();
    }
};