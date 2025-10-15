const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Get statistics of pedidos by period and conductor
 *
 * @param {object} event - Event object containing query parameters
 * @returns {Promise<object>} - Promise that resolves with statistics data
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails
 */
const GET_ESTADISTICAS_ADMIN = 'SELECT * FROM get_estadisticas_pedido($1, $2)';
const GET_ESTADISTICAS_POR_DIA = 'SELECT * FROM get_estadisticas_por_dia($1, $2)';
const GET_DETALLE_CONDUCTOR = 'SELECT * FROM get_detalle_pedidos_conductor($1, $2)';
const GET_PEDIDOS_CONDUCTOR_DIA = 'SELECT * FROM get_pedidos_conductor_dia($1, $2)';

module.exports.main = async (event) => {
    const {
        conductorId,
        periodo,
        acceso
    } = event.queryStringParameters || {};

    // Validar periodo
    const periodosValidos = ['dia', 'semana', 'mes', 'año'];
    const periodoFinal = periodosValidos.includes(periodo) ? periodo : 'dia';

    // Si conductorId es 'null' o undefined, enviamos null a la función SQL
    // Si acceso es admin, forzamos vista de resumen (conductorId = null)
    const conductorIdFinal = acceso === 'admin'
        ? null
        : (conductorId && conductorId !== 'null' ? parseInt(conductorId) : null);

    try {
        const client = await poolConection.connect();

        let estadisticas;
        let tipoVista;

        // Determinar el tipo de vista según el período y el conductor
        if (periodoFinal === 'dia') {
            // Para el día actual
            if (conductorIdFinal !== null) {
                // Conductor: mostrar listado de pedidos individuales
                const { rows } = await client.query(GET_PEDIDOS_CONDUCTOR_DIA, [conductorIdFinal, periodoFinal]);
                estadisticas = rows;
                tipoVista = 'listado_pedidos';
            } else {
                // Admin: mostrar resumen por placa
                const { rows } = await client.query(GET_ESTADISTICAS_ADMIN, [conductorIdFinal, periodoFinal]);
                estadisticas = rows;
                tipoVista = 'resumen';
            }
        } else {
            // Para períodos largos (semana, mes, año)
            if (conductorIdFinal !== null) {
                // Conductor: mostrar estadísticas agrupadas por día
                const { rows } = await client.query(GET_DETALLE_CONDUCTOR, [conductorIdFinal, periodoFinal]);
                estadisticas = rows;
                tipoVista = 'detalle';
            } else {
                // Admin: mostrar estadísticas agrupadas por placa (igual que para día)
                const { rows } = await client.query(GET_ESTADISTICAS_ADMIN, [conductorIdFinal, periodoFinal]);
                estadisticas = rows;
                tipoVista = 'resumen';
            }
        }

        client.release();

        return {
            status: true,
            estadisticas: estadisticas,
            periodo: periodoFinal,
            conductorId: conductorIdFinal,
            tipoVista: tipoVista
        };
    } catch (error) {
        console.log(error)
        throw new DatabaseError(error);
    }
};
