const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Get statistics of pedidos for today (fechaentrega = today)
 * Returns:
 * - Total pedidos for today
 * - Entregados (entregado=true and estado='activo')
 * - No entregados (entregado=true and estado='noentregado')
 *
 * @param {object} event - Event object (no parameters needed)
 * @returns {Promise<object>} - Promise that resolves with statistics data
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails
 */
const GET_ESTADISTICAS_DIA = 'SELECT * FROM get_estadisticas_pedidos_dia()';

module.exports.main = async (event) => {
    let client;
    try {
        client = await poolConection.connect();

        // Consulta de debug para ver los valores reales de pedidos entregados hoy
        const debugQuery = `
            SELECT 
                _id,
                entregado,
                estado,
                fechaentregado,
                LOWER(TRIM(COALESCE(estado, ''))) as estado_normalizado
            FROM pedidos
            WHERE eliminado = false
            AND fechaentregado IS NOT NULL
            AND fechaentregado::TEXT != ''
            AND (
                (fechaentregado::TEXT ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}' 
                 AND TO_DATE(SUBSTRING(fechaentregado::TEXT FROM '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}'), 'DD/MM/YYYY') = CURRENT_DATE)
                OR
                (fechaentregado::TEXT ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' 
                 AND SUBSTRING(fechaentregado::TEXT FROM '^[0-9]{4}-[0-9]{2}-[0-9]{2}')::DATE = CURRENT_DATE)
            )
            LIMIT 20
        `;

        try {
            const debugRows = await client.query(debugQuery);
            console.log('🔍 [get-estadisticas-dia] Debug - Pedidos con fechaEntregado del día actual:', debugRows.rows);
            console.log('🔍 [get-estadisticas-dia] Debug - Resumen:', {
                total_muestreados: debugRows.rows.length,
                entregados_true: debugRows.rows.filter(p => p.entregado === true).length,
                estado_activo: debugRows.rows.filter(p => p.estado && p.estado.toLowerCase().trim() === 'activo').length,
                estado_noentregado: debugRows.rows.filter(p => p.estado && p.estado.toLowerCase().trim() === 'noentregado').length,
                estados_unicos: [...new Set(debugRows.rows.map(p => p.estado).filter(e => e))]
            });
        } catch (debugError) {
            console.warn('⚠️ [get-estadisticas-dia] Error en consulta de debug:', debugError.message);
        }

        const { rows } = await client.query(GET_ESTADISTICAS_DIA);

        const stats = rows[0] || {
            total_pedidos: 0,
            entregados_activos: 0,
            entregados_noentregados: 0
        };

        console.log('📊 [get-estadisticas-dia] Estadísticas obtenidas:', stats);

        const total = parseInt(stats.total_pedidos) || 0;
        const entregadosActivos = parseInt(stats.entregados_activos) || 0;
        const entregadosNoEntregados = parseInt(stats.entregados_noentregados) || 0;

        const porcentajeEntregadosActivos = total > 0 ? Math.round((entregadosActivos / total) * 100) : 0;
        const porcentajeEntregadosNoEntregados = total > 0 ? Math.round((entregadosNoEntregados / total) * 100) : 0;

        console.log('📊 [get-estadisticas-dia] Estadísticas procesadas:', {
            total,
            entregadosActivos,
            entregadosNoEntregados,
            porcentajeEntregadosActivos,
            porcentajeEntregadosNoEntregados
        });

        return {
            status: true,
            estadisticas: {
                total: total,
                entregadosActivos: entregadosActivos,
                entregadosNoEntregados: entregadosNoEntregados,
                porcentajeEntregadosActivos: porcentajeEntregadosActivos,
                porcentajeEntregadosNoEntregados: porcentajeEntregadosNoEntregados
            }
        };
    } catch (error) {
        console.error('❌ [get-estadisticas-dia] Error:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};

