const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

module.exports.updateChecklist = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    const client = await poolConection.connect();

    try {
        // Obtener ID del pedido desde path parameters
        const pedidoId = event.pathParameters?.id;

        if (!pedidoId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'ID del pedido es requerido'
                })
            };
        }

        // Parse body
        const body = JSON.parse(event.body || '{}');
        const { checklist } = body;

        if (!checklist || !Array.isArray(checklist)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'Checklist debe ser un array'
                })
            };
        }

        // Validar estructura del checklist
        const isValid = checklist.every(item =>
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.status === 'boolean'
        );

        if (!isValid) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'Checklist debe contener objetos con {id: number, status: boolean}'
                })
            };
        }

        // Construir query dinámicamente según qué campos se van a actualizar
        const updates = ['checklist = $1::jsonb'];
        const values = [JSON.stringify(checklist)];
        let paramIndex = 2;


        values.push(pedidoId); // ID del pedido siempre es el último parámetro
        const pedidoIdParamIndex = paramIndex;

        // Actualizar pedido con el checklist y firmas (si existen)
        const query = `
            UPDATE pedidos 
            SET ${updates.join(', ')}
            WHERE _id = $${pedidoIdParamIndex}
            RETURNING _id, checklist;
        `;

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'Pedido no encontrado'
                })
            };
        }

        console.log('✅ Checklist actualizado para pedido:', pedidoId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: true,
                message: 'Checklist actualizado correctamente',
                data: {
                    pedidoId: result.rows[0]._id,
                    checklist: result.rows[0].checklist
                }
            })
        };

    } catch (error) {
        console.error('❌ Error actualizando checklist:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

/**
 * Obtener checklist de un pedido
 * GET /pedidos/:id/checklist
 */
module.exports.getChecklist = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    const client = await poolConection.connect();

    try {
        const pedidoId = event.pathParameters?.id;

        if (!pedidoId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'ID del pedido es requerido'
                })
            };
        }

        const query = `
            SELECT _id, checklist 
            FROM pedidos 
            WHERE _id = $1;
        `;

        const result = await client.query(query, [pedidoId]);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'Pedido no encontrado'
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: true,
                data: {
                    pedidoId: result.rows[0]._id,
                    checklist: result.rows[0].checklist || []
                }
            })
        };

    } catch (error) {
        console.error('❌ Error obteniendo checklist:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

