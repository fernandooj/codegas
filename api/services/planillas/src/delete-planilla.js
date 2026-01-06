const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Soft deletes a planilla (marks as eliminado = true)
 * 
 * @param {object} event - Lambda event object with _id in path
 * @returns {Promise<object>} - Promise that resolves with success status
 * @throws {DatabaseError} - Throws DatabaseError if operation fails
 */
module.exports.main = async (event) => {
    const client = await poolConection.connect();

    try {
        const { _id } = event.pathParameters || {};

        if (!_id) {
            return {
                status: false,
                message: '_id es requerido'
            };
        }

        const DELETE_PLANILLA = `
            UPDATE planillas 
            SET eliminado = TRUE
            WHERE _id = $1
            RETURNING *
        `;

        const { rows } = await client.query(DELETE_PLANILLA, [_id]);

        if (rows.length === 0) {
            return {
                status: false,
                message: 'Planilla no encontrada'
            };
        }

        return {
            status: true,
            message: 'Planilla eliminada exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

