const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Remueve un pedido de un grupo de frecuencia (establece grupo_id a NULL)
 * 
 * @param {object} event - Event object con pathParameters.pedidoId
 * @returns {Promise<object>} - Promise que resuelve con el resultado de la operación
 * @throws {DatabaseError} - Lanza error si la operación falla
 */
module.exports.main = async (event) => {
    let client;
    
    try {
        // Obtener pedido_id de los parámetros de la ruta
        const pedidoId = event.pathParameters?.pedidoId;
        
        if (!pedidoId) {
            return {
                status: false,
                message: 'El ID del pedido es requerido'
            };
        }

        client = await poolConection.connect();

        // Verificar que el pedido existe y tiene un grupo asignado
        const { rows: pedidoCheck } = await client.query(
            'SELECT _id, grupo_id FROM pedidos WHERE _id = $1 AND eliminado = FALSE',
            [pedidoId]
        );

        if (pedidoCheck.length === 0) {
            return {
                status: false,
                message: 'Pedido no encontrado'
            };
        }

        if (!pedidoCheck[0].grupo_id) {
            return {
                status: false,
                message: 'Este pedido no está asignado a ningún grupo'
            };
        }

        // Actualizar el pedido para removerlo del grupo
        const { rows: updatedPedido } = await client.query(
            'UPDATE pedidos SET grupo_id = NULL WHERE _id = $1 AND eliminado = FALSE RETURNING _id, grupo_id',
            [pedidoId]
        );

        if (updatedPedido.length === 0) {
            return {
                status: false,
                message: 'No se pudo actualizar el pedido'
            };
        }

        return {
            status: true,
            message: 'Pedido removido del grupo correctamente',
            pedido_id: parseInt(pedidoId)
        };
    } catch (error) {
        console.error('Error removiendo pedido del grupo:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};

