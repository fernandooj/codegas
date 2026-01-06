const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener historial de ubicaciones de un vehículo
 * 
 * @param {object} event - Evento de API Gateway con carroId y query params
 * @returns {Promise<object>} - Historial de ubicaciones
 */
module.exports.main = async (event) => {
    let client;
    try {
        console.log('🔍 [get-historial-vehiculo] Event recibido:', JSON.stringify(event, null, 2));

        const { carroId } = event.pathParameters || {};
        const { fecha, limite = '1000' } = event.queryStringParameters || {};

        console.log('🔍 [get-historial-vehiculo] Parámetros:', { carroId, fecha, limite });

        if (!carroId) {
            console.error('❌ [get-historial-vehiculo] carroId es requerido');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    mensaje: 'carroId es requerido'
                })
            };
        }

        client = await poolConection.connect();
        console.log('✅ [get-historial-vehiculo] Conexión a BD establecida');

        // Primero verificar si hay datos en la tabla para este vehículo
        const checkQuery = `SELECT COUNT(*) as total FROM tracking_vehiculos WHERE carro_id = $1`;
        const checkResult = await client.query(checkQuery, [carroId]);
        console.log('📊 [get-historial-vehiculo] Total registros en tracking_vehiculos para carro_id', carroId, ':', checkResult.rows[0].total);

        let query = `
      SELECT 
        _id,
        carro_id,
        conductor_id,
        latitud,
        longitud,
        velocidad,
        heading,
        precision_metros,
        "timestamp",
        en_pedido,
        activo
      FROM tracking_vehiculos
      WHERE carro_id = $1
    `;

        const params = [carroId];

        // Filtrar por activo solo si es necesario (algunos registros pueden tener activo NULL)
        // query += ` AND COALESCE(activo, TRUE) = TRUE`;

        // Filtrar por fecha si se proporciona
        if (fecha) {
            console.log('📅 [get-historial-vehiculo] Filtrando por fecha:', fecha);
            // Usar comparación de fecha con zona horaria de Colombia
            query += ` AND DATE("timestamp" AT TIME ZONE 'America/Bogota') = $${params.length + 1}::DATE`;
            params.push(fecha);
        } else {
            // Si no hay fecha, traer del día actual en zona horaria de Colombia
            console.log('📅 [get-historial-vehiculo] Filtrando por fecha actual (Colombia)');
            query += ` AND DATE("timestamp" AT TIME ZONE 'America/Bogota') = (CURRENT_DATE AT TIME ZONE 'America/Bogota')::DATE`;
        }

        // Aumentar el límite para traer todos los puntos del día
        const limiteFinal = parseInt(limite) || 10000; // Límite más alto por defecto
        query += ` ORDER BY "timestamp" ASC LIMIT $${params.length + 1}`;
        params.push(limiteFinal);

        console.log('📝 [get-historial-vehiculo] Query SQL:', query);
        console.log('📝 [get-historial-vehiculo] Parámetros:', params);

        const result = await client.query(query, params);
        console.log('✅ [get-historial-vehiculo] Resultados obtenidos:', result.rows.length, 'filas');

        if (result.rows.length === 0) {
            console.warn('⚠️ [get-historial-vehiculo] No se encontraron registros con los filtros aplicados');
            // Intentar sin filtro de fecha para ver si hay datos
            const querySinFecha = `
                SELECT COUNT(*) as total 
                FROM tracking_vehiculos 
                WHERE carro_id = $1
            `;
            const resultSinFecha = await client.query(querySinFecha, [carroId]);
            console.log('📊 [get-historial-vehiculo] Total registros sin filtro de fecha:', resultSinFecha.rows[0].total);
            client.release();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    ok: true,
                    historial: [],
                    total: 0,
                    carroId: parseInt(carroId),
                    fecha: fecha || 'hoy'
                })
            };
        }

        if (result.rows.length > 0) {
            console.log('📊 [get-historial-vehiculo] Primer registro:', {
                _id: result.rows[0]._id,
                carro_id: result.rows[0].carro_id,
                timestamp: result.rows[0].timestamp,
                latitud: result.rows[0].latitud,
                longitud: result.rows[0].longitud
            });
            console.log('📊 [get-historial-vehiculo] Último registro:', {
                _id: result.rows[result.rows.length - 1]._id,
                timestamp: result.rows[result.rows.length - 1].timestamp,
                latitud: result.rows[result.rows.length - 1].latitud,
                longitud: result.rows[result.rows.length - 1].longitud
            });
        }

        client.release();

        // Devolver todos los puntos sin agrupar, ordenados cronológicamente
        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                historial: result.rows,
                total: result.rows.length,
                carroId: parseInt(carroId),
                fecha: fecha || 'hoy'
            })
        };

    } catch (error) {
        console.error('❌ [get-historial-vehiculo] Error obteniendo historial del vehículo:', error);
        console.error('❌ [get-historial-vehiculo] Stack:', error.stack);
        if (client) {
            client.release();
        }
        throw new DatabaseError(error);
    }
};

