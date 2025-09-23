const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/** toggle punto status */
const TOGGLE_PUNTO_STATUS = 'UPDATE puntos SET activo = $1 WHERE _id = $2';

/**
 * Toggles the active status of a punto in the database.
 *
 * @param {object} params - Object containing the parameters.
 * @param {number} params._id - Identifier of the punto in the database.
 * @param {boolean} params.activo - New active status.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
    const {
        _id,
        activo
    } = event.pathParameters;

    const client = await poolConection.connect();

    try {
        const isActiveValue = activo === 'true';
        await client.query(TOGGLE_PUNTO_STATUS, [isActiveValue, _id]);

        return {
            status: true,
            message: `Punto ${isActiveValue ? 'activado' : 'desactivado'} exitosamente`
        }
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};
