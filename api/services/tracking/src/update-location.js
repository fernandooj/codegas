const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const redis = require('redis');

// Conexión a Redis (opcional)
let redisClient = null;
const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true';

if (REDIS_ENABLED) {
    redisClient = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    });
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    redisClient.on('connect', () => console.log('✅ Redis conectado'));
} else {
    console.log('⚠️  Redis deshabilitado - Solo PostgreSQL');
}

/**
 * Actualizar ubicación de un vehículo
 * 
 * @param {object} event - Evento de API Gateway con datos de ubicación
 * @returns {Promise<object>} - Resultado de la operación
 */
module.exports.main = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');

        const {
            carroId,
            conductorId,
            latitud,
            longitud,
            velocidad = 0,
            precision,
            heading = 0,
            timestamp,
            enPedido = false
        } = body;

        // Validaciones
        if (!carroId || !conductorId || !latitud || !longitud) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    mensaje: 'Faltan campos requeridos: carroId, conductorId, latitud, longitud'
                })
            };
        }

        // Guardar en PostgreSQL
        let client;
        let result;
        try {
            client = await poolConection.connect();

            console.log('💾 Guardando tracking en BD:', {
                carroId,
                conductorId,
                latitud,
                longitud,
                velocidad,
                precision,
                heading,
                enPedido
            });

            const query = `
                INSERT INTO tracking_vehiculos 
                    (carro_id, conductor_id, latitud, longitud, velocidad, precision_metros, heading, en_pedido)
                VALUES 
                    ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING _id, "timestamp", conductor_id
            `;

            const values = [
                carroId,
                conductorId,
                latitud,
                longitud,
                velocidad,
                precision,
                heading,
                enPedido
            ];

            result = await client.query(query, values);

            console.log('✅ Tracking guardado en BD:', {
                id: result.rows[0]._id,
                conductorId: result.rows[0].conductor_id,
                timestamp: result.rows[0].timestamp
            });
        } catch (dbError) {
            console.error('❌ Error guardando tracking en BD:', dbError);
            throw dbError;
        } finally {
            if (client) {
                client.release();
            }
        }

        // Preparar datos para Redis y Socket.IO
        const locationData = {
            carroId,
            conductorId,
            latitud,
            longitud,
            velocidad,
            precision,
            heading,
            timestamp: result.rows[0].timestamp,
            enPedido
        };

        // Guardar en Redis con TTL de 10 minutos (si está habilitado)
        if (REDIS_ENABLED && redisClient) {
            const redisKey = `vehicle:location:${carroId}`;
            redisClient.setex(redisKey, 600, JSON.stringify(locationData));

            // Publicar en Redis para Socket.IO (si back/ está corriendo)
            redisClient.publish('vehicleLocationUpdate', JSON.stringify(locationData));
            console.log('✅ Ubicación guardada en Redis y publicada');
        }

        console.log('✅ Ubicación actualizada para vehículo:', carroId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                mensaje: 'Ubicación actualizada correctamente',
                data: locationData
            })
        };

    } catch (error) {
        console.error('❌ Error actualizando ubicación:', error);
        throw new DatabaseError(error);
    }
};

