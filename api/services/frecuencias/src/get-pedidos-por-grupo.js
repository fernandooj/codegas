const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtiene todos los pedidos asignados a un grupo de frecuencia específico
 * 
 * @param {object} event - Event object con pathParameters.grupoId
 * @returns {Promise<object>} - Promise que resuelve con los pedidos del grupo
 * @throws {DatabaseError} - Lanza error si la operación falla
 */
module.exports.main = async (event) => {
    let client;
    
    try {
        // Obtener grupo_id de los parámetros de la ruta
        const grupoId = event.pathParameters?.grupoId;
        
        if (!grupoId) {
            return {
                status: false,
                message: 'El ID del grupo es requerido'
            };
        }

        client = await poolConection.connect();

        // Query para obtener pedidos del grupo con información completa
        const GET_PEDIDOS_POR_GRUPO = `
            SELECT 
                p._id as pedido_id,
                p.forma,
                p.cantidadKl,
                p.cantidadPrecio,
                p.frecuencia,
                p.dia1,
                p.dia2,
                p.usuarioId as usuarioid,
                p.puntoId as puntoId,
                p.grupo_id,
                p.creado as fecha_creacion,
                u.nombre,
                u.razon_social,
                u.codt,
                pt.direccion as punto_direccion,
                pt.capacidad as punto_capacidad
            FROM pedidos p
            JOIN users u ON u._id = p.usuarioId
            LEFT JOIN puntos pt ON pt._id = p.puntoId
            WHERE p.grupo_id = $1
                AND p.eliminado = FALSE
            ORDER BY u.razon_social ASC, u.nombre ASC
        `;

        const { rows: pedidos } = await client.query(GET_PEDIDOS_POR_GRUPO, [grupoId]);

        return {
            status: true,
            grupo_id: parseInt(grupoId),
            total: pedidos.length,
            pedidos: pedidos
        };
    } catch (error) {
        console.error('Error obteniendo pedidos por grupo:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};

