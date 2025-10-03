const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

exports.main = async (event) => {
    let client;
    try {
        // Obtener el ID del pedido desde los parámetros de la ruta
        const { pedidoId } = event.pathParameters;

        if (!pedidoId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    status: false,
                    message: 'ID del pedido es requerido'
                })
            };
        }

        // Verificar que el pedido existe
        const checkPedidoQuery = `
            SELECT _id, estado 
            FROM pedidos 
            WHERE _id = $1
        `;

        client = await poolConection.connect();
        const checkResult = await client.query(checkPedidoQuery, [pedidoId]);

        if (checkResult.rows.length === 0) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    status: false,
                    message: 'Pedido no encontrado'
                })
            };
        }

        // Query para resetear el pedido
        // Mantener solo los campos especificados y resetear los demás
        const resetPedidoQuery = `
            UPDATE pedidos 
            SET 
                estado = 'espera',
                entregado = false,
                eliminado = false,
                novedades = false,
                -- Limpiar campos que deben ser reseteados
                fechaentrega = NULL,
                kilos = NULL,
                factura = NULL,
                remision = NULL,
                valor_total = NULL,
                forma_pago = NULL,
                observacion = NULL,
                motivo_no_cierre = NULL,
                perfil_novedad = NULL,
                imagenCerrar = NULL,
                conductorId = NULL,
                carroId = NULL,
                usuarioAsigna = NULL,
                usuarioAsignaVehiculo = NULL
            WHERE _id = $1
            RETURNING _id, estado, entregado, eliminado, novedades
        `;

        const result = await client.query(resetPedidoQuery, [pedidoId]);

        if (result.rows.length === 0) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    status: false,
                    message: 'Error al resetear el pedido'
                })
            };
        }

        const pedidoReset = result.rows[0];

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                status: true,
                message: 'Pedido reseteado exitosamente',
                data: {
                    pedidoId: pedidoReset._id,
                    estado: pedidoReset.estado,
                    entregado: pedidoReset.entregado,
                    eliminado: pedidoReset.eliminado,
                    novedades: pedidoReset.novedades
                }
            })
        };

    } catch (error) {
        console.error('Error reseteando pedido:', error);

        if (error instanceof DatabaseError) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    status: false,
                    message: 'Error de base de datos al resetear el pedido'
                })
            };
        }

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                status: false,
                message: 'Error interno del servidor al resetear el pedido'
            })
        };
    } finally {
        // Liberar la conexión
        if (client) {
            client.release();
        }
    }
};
