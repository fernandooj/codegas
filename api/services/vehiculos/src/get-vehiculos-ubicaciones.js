const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener ubicaciones de todos los vehículos activos
 * 
 * @param {object} event - Evento de API Gateway
 * @returns {Promise<object>} - Lista de vehículos con sus ubicaciones
 */
module.exports.main = async (event) => {
    let client;
    try {
        client = await poolConection.connect();

        console.log('🔍 Obteniendo ubicaciones de vehículos activos...');

        // Primero, verificar cuántos registros hay en tracking_vehiculos
        const countQuery = `SELECT COUNT(*) as total FROM tracking_vehiculos`;
        const countResult = await client.query(countQuery);
        console.log(`📊 Total de registros en tracking_vehiculos: ${countResult.rows[0].total}`);

        // Verificar registros por activo
        const activoQuery = `SELECT activo, COUNT(*) as total FROM tracking_vehiculos GROUP BY activo`;
        const activoResult = await client.query(activoQuery);
        console.log(`📊 Registros por estado activo:`, activoResult.rows);

        // Obtener la última ubicación de cada vehículo (sin filtros)
        const lastLocationQuery = `
            SELECT DISTINCT ON (t.carro_id)
                t.carro_id,
                t.activo,
                t."timestamp",
                EXTRACT(EPOCH FROM (NOW() - t."timestamp"))::INT / 60 as minutos
            FROM tracking_vehiculos t
            ORDER BY t.carro_id, t."timestamp" DESC
            LIMIT 5
        `;
        const lastLocationResult = await client.query(lastLocationQuery);
        console.log(`📊 Últimas 5 ubicaciones por vehículo:`, JSON.stringify(lastLocationResult.rows, null, 2));

        // Ahora ejecutar la función principal
        let query = `SELECT * FROM get_ubicaciones_vehiculos_activos()`;
        let result = await client.query(query);

        console.log(`✅ Función SQL devolvió ${result.rows.length} vehículos`);

        // Si no hay resultados, usar una consulta directa menos restrictiva
        if (result.rows.length === 0) {
            console.log('⚠️ La función SQL no devolvió resultados, usando consulta directa...');
            query = `
                WITH ultima_ubicacion AS (
                    SELECT DISTINCT ON (t.carro_id)
                        t.carro_id,
                        t.conductor_id,
                        t.latitud,
                        t.longitud,
                        t.velocidad,
                        t.heading,
                        t."timestamp",
                        COALESCE(t.en_pedido, false) as en_pedido,
                        EXTRACT(EPOCH FROM (NOW() - t."timestamp"))::INT / 60 as minutos
                    FROM tracking_vehiculos t
                    WHERE COALESCE(t.activo, true) = true
                    ORDER BY t.carro_id, t."timestamp" DESC
                )
                SELECT 
                    u.carro_id,
                    c.placa,
                    u.conductor_id,
                    COALESCE(us.nombre, us.email) as nombre_conductor,
                    u.latitud,
                    u.longitud,
                    u.velocidad,
                    u.heading,
                    u."timestamp",
                    u.minutos as minutos_desde_actualizacion,
                    u.en_pedido
                FROM ultima_ubicacion u
                INNER JOIN carros c ON c._id = u.carro_id
                LEFT JOIN users us ON us._id = u.conductor_id
                WHERE COALESCE(c.activo, true) = true
                    AND COALESCE(c.eliminado, false) = false
                    AND u.minutos <= 1440
                ORDER BY u."timestamp" DESC
            `;
            result = await client.query(query);
            console.log(`✅ Consulta directa devolvió ${result.rows.length} vehículos`);
        }

        // Transformar los datos para compatibilidad con el frontend
        const vehiculos = result.rows.map((vehiculo, index) => {
            // Parsear coordenadas con validación robusta
            const latRaw = vehiculo.latitud;
            const lngRaw = vehiculo.longitud;

            let lat = null;
            let lng = null;

            if (latRaw !== null && latRaw !== undefined && latRaw !== '') {
                const parsedLat = typeof latRaw === 'string' ? parseFloat(latRaw) : Number(latRaw);
                if (!isNaN(parsedLat) && parsedLat !== 0) {
                    lat = parsedLat;
                }
            }

            if (lngRaw !== null && lngRaw !== undefined && lngRaw !== '') {
                const parsedLng = typeof lngRaw === 'string' ? parseFloat(lngRaw) : Number(lngRaw);
                if (!isNaN(parsedLng) && parsedLng !== 0) {
                    lng = parsedLng;
                }
            }

            // Log del primer vehículo para debug
            if (index === 0) {
                console.log('🔍 [get-vehiculos-ubicaciones] Procesando primer vehículo:', {
                    carro_id: vehiculo.carro_id,
                    placa: vehiculo.placa,
                    latitud_raw: latRaw,
                    longitud_raw: lngRaw,
                    lat_parsed: lat,
                    lng_parsed: lng,
                    lat_isValid: lat !== null && !isNaN(lat),
                    lng_isValid: lng !== null && !isNaN(lng)
                });
            }

            return {
                // ID del vehículo (renombrar carro_id a _id)
                _id: vehiculo.carro_id,
                carro_id: vehiculo.carro_id,
                // Información del vehículo
                placa: vehiculo.placa || null,
                // Información del conductor
                conductor_id: vehiculo.conductor_id || null,
                conductor: vehiculo.nombre_conductor ? {
                    nombre: vehiculo.nombre_conductor,
                    _id: vehiculo.conductor_id
                } : null,
                nombre_conductor: vehiculo.nombre_conductor || null,
                // Coordenadas en múltiples formatos para compatibilidad
                latitud: lat,
                longitud: lng,
                lat: lat,
                lng: lng,
                latitude: lat,
                longitude: lng,
                // Formato coordenadas como objeto
                coordenadas: lat && lng ? {
                    lat: lat,
                    lng: lng,
                    x: lat,
                    y: lng
                } : null,
                // Formato ubicacion
                ubicacion: lat && lng ? {
                    lat: lat,
                    lng: lng
                } : null,
                // Información adicional del tracking
                velocidad: vehiculo.velocidad || null,
                heading: vehiculo.heading || null,
                timestamp: vehiculo.timestamp || null,
                minutos_desde_actualizacion: vehiculo.minutos_desde_actualizacion || null,
                en_pedido: vehiculo.en_pedido || false
            };
        });

        console.log(`📦 Devolviendo ${vehiculos.length} vehículos procesados`);

        // Formato consistente con otros endpoints (serverless-offline maneja el formato HTTP)
        return {
            status: true,
            ok: true,
            vehiculos: vehiculos,
            carro: vehiculos, // También incluir 'carro' para compatibilidad
            total: vehiculos.length
        };

    } catch (error) {
        console.error('❌ Error obteniendo ubicaciones de vehículos:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};

