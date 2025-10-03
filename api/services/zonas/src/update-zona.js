const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/** update zona */

/**
 * Updates a zona in the database.
 *
 * @param {object} zona - Object containing the data of the zona to update.
 * @param {number} zona._id - Identifier of the zona in the database.
 * @param {string} zona.nombre - New name for the zona.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
    const body = JSON.parse(event.body);

    const {
        _id: id_zona,
        nombre,
    } = body;

    const UPDATE_ZONA = 'UPDATE zonas SET nombre = $1 WHERE _id = $2 AND activo = $3';
    const client = await poolConection.connect();

    try {
        const result = await client.query(UPDATE_ZONA, [nombre, id_zona, true]);

        if (result.rowCount === 0) {
            return {
                status: false,
                message: 'Zona no encontrada o inactiva'
            };
        }

        return {
            status: true,
            message: 'Zona actualizada exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    }
};
