const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener estadísticas detalladas de vehículos con pedidos del día actual
 * Incluye información completa de cada pedido con estados y horas de entrega
 * 
 * @param {object} event - Evento de API Gateway
 * @returns {Promise<object>} - Estadísticas de vehículos
 */
module.exports.main = async (event) => {
    let client;
    try {
        console.log('🔍 [get-estadisticas-vehiculos-dia] Obteniendo estadísticas de vehículos del día...');

        client = await poolConection.connect();
        console.log('✅ [get-estadisticas-vehiculos-dia] Conexión a BD establecida');

        // Llamar a la función SQL para obtener las estadísticas
        const query = 'SELECT * FROM get_estadisticas_vehiculos_dia()';
        
        console.log('📝 [get-estadisticas-vehiculos-dia] Ejecutando query...');
        const result = await client.query(query);
        
        console.log('✅ [get-estadisticas-vehiculos-dia] Resultados obtenidos:', result.rows.length, 'vehículos');

        // Log de primeros resultados para debug
        if (result.rows.length > 0) {
            console.log('📊 [get-estadisticas-vehiculos-dia] Primer vehículo:', {
                placa: result.rows[0].placa,
                total_pedidos: result.rows[0].total_pedidos,
                pedidos_entregados: result.rows[0].pedidos_entregados,
                pedidos_en_ruta: result.rows[0].pedidos_en_ruta,
                pedidos_no_entregados: result.rows[0].pedidos_no_entregados
            });
        }

        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                vehiculos: result.rows,
                total: result.rows.length,
                fecha: new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
            })
        };

    } catch (error) {
        console.error('❌ [get-estadisticas-vehiculos-dia] Error obteniendo estadísticas:', error);
        console.error('❌ [get-estadisticas-vehiculos-dia] Stack:', error.stack);
        if (client) {
            client.release();
        }
        throw new DatabaseError(error);
    }
};

