const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Actualizar campo tanques (JSONB) de un pedido
 * PUT /ped/pedido/{id}/tanques
 * 
 * Este endpoint actualiza el campo tanques JSONB en la tabla pedidos.
 * El campo tanques es un array de objetos con información de cada tanque.
 * 
 * Body:
 * {
 *   "tanque_id": 1,
 *   "tipo_suministro": "1",
 *   "presion_inicial": 100,
 *   "presion_final": 100,
 *   "porcentaje_inicial": 100,
 *   "porcentaje_final": 100,
 *   "observacion": "observacion",
 *   "checklist": [{"pregunta": "pregunta", "respuesta": "respuesta"}],
 *   "estado": "Funciona" // o "No Funciona" o "No Aplica"
 * }
 */
module.exports.updateTanques = async (event) => {
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
        const {
            tanque_id,
            tipo_suministro,
            presion_inicial,
            presion_final,
            porcentaje_inicial,
            porcentaje_final,
            observacion,
            checklist,
            estado
        } = body;

        const tanqueIdNum = parseInt(tanque_id, 10);
        if (!Number.isFinite(tanqueIdNum) || tanqueIdNum <= 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'tanque_id es requerido y debe ser un entero positivo'
                })
            };
        }

        // Validar estado si está presente
        if (estado && !['Funciona', 'No Funciona', 'No Aplica'].includes(estado)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'estado debe ser uno de: Funciona, No Funciona, No Aplica'
                })
            };
        }

        // Obtener el array actual de tanques del pedido
        const getTanquesQuery = `
            SELECT tanques 
            FROM pedidos 
            WHERE _id = $1;
        `;
        const getResult = await client.query(getTanquesQuery, [pedidoId]);

        if (getResult.rows.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'Pedido no encontrado'
                })
            };
        }

        // Obtener el array actual de tanques (puede ser null o un array)
        let tanquesArray = getResult.rows[0].tanques;
        if (!tanquesArray || !Array.isArray(tanquesArray)) {
            tanquesArray = [];
        }

        // Buscar si ya existe un tanque con ese tanque_id (JSON puede traer número o string)
        const existingIndex = tanquesArray.findIndex(
            (t) => Number(t.tanque_id) === tanqueIdNum
        );

        if (existingIndex >= 0) {
            // Actualizar el tanque existente - hacer merge con los datos existentes
            const existingTanque = tanquesArray[existingIndex];

            // Construir el objeto del tanque actualizado, preservando los datos existentes
            const updatedTanque = {
                ...existingTanque, // Preservar todos los datos existentes
                tanque_id: tanqueIdNum // Asegurar que el ID esté correcto
            };

            // Solo actualizar los campos que se envían (no son undefined)
            if (tipo_suministro !== undefined) {
                updatedTanque.tipo_suministro = tipo_suministro || null;
            }
            if (presion_inicial !== undefined) {
                updatedTanque.presion_inicial = presion_inicial !== null ? parseFloat(presion_inicial) : null;
            }
            if (presion_final !== undefined) {
                updatedTanque.presion_final = presion_final !== null ? parseFloat(presion_final) : null;
            }
            if (porcentaje_inicial !== undefined) {
                updatedTanque.porcentaje_inicial = porcentaje_inicial !== null ? parseFloat(porcentaje_inicial) : null;
            }
            if (porcentaje_final !== undefined) {
                updatedTanque.porcentaje_final = porcentaje_final !== null ? parseFloat(porcentaje_final) : null;
            }
            if (observacion !== undefined) {
                updatedTanque.observacion = observacion || null;
            }
            if (checklist !== undefined) {
                updatedTanque.checklist = checklist && Array.isArray(checklist) ? checklist : [];
            }
            if (estado !== undefined) {
                updatedTanque.estado = estado || null;
            }

            tanquesArray[existingIndex] = updatedTanque;
        } else {
            // Agregar nuevo tanque - construir objeto completo
            const tanqueData = {
                tanque_id: tanqueIdNum,
                tipo_suministro: tipo_suministro || null,
                presion_inicial: presion_inicial !== undefined && presion_inicial !== null ? parseFloat(presion_inicial) : null,
                presion_final: presion_final !== undefined && presion_final !== null ? parseFloat(presion_final) : null,
                porcentaje_inicial: porcentaje_inicial !== undefined && porcentaje_inicial !== null ? parseFloat(porcentaje_inicial) : null,
                porcentaje_final: porcentaje_final !== undefined && porcentaje_final !== null ? parseFloat(porcentaje_final) : null,
                observacion: observacion || null,
                checklist: checklist && Array.isArray(checklist) ? checklist : [],
                estado: estado || null
            };
            tanquesArray.push(tanqueData);
        }

        // Actualizar el campo tanques en la base de datos
        const updateQuery = `
            UPDATE pedidos 
            SET tanques = $1::jsonb
            WHERE _id = $2
            RETURNING _id, tanques;
        `;

        const updateResult = await client.query(updateQuery, [JSON.stringify(tanquesArray), pedidoId]);

        console.log('✅ Campo tanques actualizado para pedido:', pedidoId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: true,
                message: 'Campo tanques actualizado correctamente',
                data: {
                    pedidoId: updateResult.rows[0]._id,
                    tanques: updateResult.rows[0].tanques
                }
            })
        };

    } catch (error) {
        console.error('❌ Error actualizando campo tanques:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

/**
 * Obtener tanques de un pedido
 * GET /ped/pedido/{id}/tanques
 */
module.exports.getTanques = async (event) => {
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
            SELECT _id, tanques 
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
                    tanques: result.rows[0].tanques || []
                }
            })
        };

    } catch (error) {
        console.error('❌ Error obteniendo tanques:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

