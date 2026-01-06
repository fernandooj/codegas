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
}

/**
 * Obtener última ubicación de un vehículo específico
 * 
 * @param {object} event - Evento de API Gateway con carroId
 * @returns {Promise<object>} - Última ubicación del vehículo
 */
module.exports.main = async (event) => {
    try {
        const { carroId } = event.pathParameters || {};

        if (!carroId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    mensaje: 'carroId es requerido'
                })
            };
        }

        // Si Redis está habilitado, intentar obtener de ahí primero
        if (REDIS_ENABLED && redisClient) {
            const redisKey = `vehicle:location:${carroId}`;

            return new Promise((resolve, reject) => {
                redisClient.get(redisKey, async (err, redisData) => {
                    if (err) {
                        console.error('Error en Redis:', err);
                    }

                    if (redisData) {
                        // Datos encontrados en Redis
                        const locationData = JSON.parse(redisData);
                        return resolve({
                            statusCode: 200,
                            body: JSON.stringify({
                                ok: true,
                                ubicacion: locationData,
                                source: 'redis'
                            })
                        });
                    }

                    // Si no está en Redis, buscar en PostgreSQL
                    try {
                        const client = await poolConection.connect();
                        const query = `SELECT * FROM get_ultima_ubicacion_vehiculo($1)`;
                        const result = await client.query(query, [carroId]);
                        client.release();

                        if (result.rows.length === 0) {
                            return resolve({
                                statusCode: 404,
                                body: JSON.stringify({
                                    ok: false,
                                    mensaje: 'No se encontró ubicación para este vehículo'
                                })
                            });
                        }

                        resolve({
                            statusCode: 200,
                            body: JSON.stringify({
                                ok: true,
                                ubicacion: result.rows[0],
                                source: 'postgresql'
                            })
                        });

                    } catch (dbError) {
                        console.error('❌ Error consultando PostgreSQL:', dbError);
                        reject(new DatabaseError(dbError));
                    }
                });
            });
        }

        // Redis no habilitado, ir directo a PostgreSQL
        const client = await poolConection.connect();
        const query = `SELECT * FROM get_ultima_ubicacion_vehiculo($1)`;
        const result = await client.query(query, [carroId]);
        client.release();

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    ok: false,
                    mensaje: 'No se encontró ubicación para este vehículo'
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                ubicacion: result.rows[0],
                source: 'postgresql'
            })
        };

    } catch (error) {
        console.error('❌ Error obteniendo ubicación del vehículo:', error);
        throw new DatabaseError(error);
    }
};
