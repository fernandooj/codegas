const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Gets planillas based on user access level
 * - Admin: sees all planillas
 * - Conductor: only sees planillas where user_id = logged user id
 * 
 * @param {object} event - Lambda event object with userId and acceso in path
 * @returns {Promise<object>} - Promise that resolves with list of planillas
 * @throws {DatabaseError} - Throws DatabaseError if operation fails
 */
module.exports.main = async (event) => {
    const client = await poolConection.connect();

    try {
        const { userId, acceso } = event.pathParameters || {};

        if (!userId || !acceso) {
            return {
                status: false,
                message: 'userId y acceso son requeridos'
            };
        }

        let GET_PLANILLAS;

        if (acceso === 'admin') {
            // Admin ve todas las planillas
            GET_PLANILLAS = `
                SELECT 
                    p.*,
                    u.nombre as usuario_nombre,
                    u.email as usuario_email
                FROM planillas p
                LEFT JOIN users u ON p.user_id = u._id
                WHERE p.eliminado = FALSE
                ORDER BY p.creado DESC
            `;
        } else if (acceso === 'conductor') {
            // Conductor solo ve sus propias planillas
            GET_PLANILLAS = `
                SELECT 
                    p.*,
                    u.nombre as usuario_nombre,
                    u.email as usuario_email
                FROM planillas p
                LEFT JOIN users u ON p.user_id = u._id
                WHERE p.eliminado = FALSE
                AND p.user_id = $1
                ORDER BY p.creado DESC
            `;
        } else {
            return {
                status: false,
                message: 'Acceso no válido para ver planillas'
            };
        }

        const params = acceso === 'admin' ? [] : [userId];
        const { rows: planillas } = await client.query(GET_PLANILLAS, params);

        return {
            status: true,
            planillas
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

