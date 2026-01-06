const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Gets pedidos delivered by a conductor on the current day
 * Filters: entregado = true, fechaEntregado = current day, forma_pago = 'credito'
 * Returns: remision, valor_total
 * 
 * @param {object} event - Lambda event object with conductorId in path
 * @returns {Promise<object>} - Promise that resolves with list of pedidos
 * @throws {DatabaseError} - Throws DatabaseError if operation fails
 */
module.exports.main = async (event) => {
    const client = await poolConection.connect();

    try {
        const { conductorId } = event.pathParameters || {};

        if (!conductorId) {
            return {
                status: false,
                message: 'conductorId es requerido'
            };
        }

        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        // Obtener inicio y fin del día actual
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const GET_PEDIDOS = `
            SELECT 
                p.remision,
                p.valor_total,
                p._id as pedido_id,
                p.fechaEntregado,
                u.razon_social,
                u.nombre as cliente_nombre
            FROM pedidos p
            LEFT JOIN users u ON p.usuarioId = u._id
            WHERE p.entregado = TRUE
            AND p.eliminado = FALSE
            AND LOWER(COALESCE(p.forma_pago, '')) = 'credito'
            AND p.conductorId = $1
            AND (
                -- Verificar formato YYYY-MM-DD
                (p.fechaEntregado LIKE $2 || '%')
                OR
                -- Verificar formato DD/MM/YYYY
                (p.fechaEntregado LIKE '%/' || $3 || '/' || $4 || '%')
                OR
                -- Verificar si fechaEntregado es una fecha/timestamp y está en el día actual
                (
                    p.fechaEntregado IS NOT NULL 
                    AND p.fechaEntregado != ''
                    AND (
                        CASE 
                            WHEN p.fechaEntregado LIKE '%/%' THEN 
                                TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY')::DATE = CURRENT_DATE
                            WHEN p.fechaEntregado LIKE '%-%' THEN 
                                p.fechaEntregado::DATE = CURRENT_DATE
                            ELSE FALSE
                        END
                    )
                )
            )
            ORDER BY p._id DESC
        `;

        const { rows: pedidos } = await client.query(GET_PEDIDOS, [
            conductorId,
            currentDate,
            month,
            year
        ]);

        return {
            status: true,
            pedidos
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

