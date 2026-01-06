const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Gets a single planilla by ID
 * 
 * @param {object} event - Lambda event object with _id in path
 * @returns {Promise<object>} - Promise that resolves with planilla data
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

        const GET_PLANILLA = `
            SELECT 
                p.*,
                u.nombre as usuario_nombre,
                u.email as usuario_email
            FROM planillas p
            LEFT JOIN users u ON p.user_id = u._id
            WHERE p._id = $1
            AND p.eliminado = FALSE
        `;

        const { rows } = await client.query(GET_PLANILLA, [_id]);

        if (rows.length === 0) {
            return {
                status: false,
                message: 'Planilla no encontrada'
            };
        }

        return {
            status: true,
            planilla: rows[0]
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

