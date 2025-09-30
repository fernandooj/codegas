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
const GET_DETALLE_CONDUCTOR = 'SELECT * FROM get_detalle_pedidos_conductor($1, $2)';

module.exports.main = async (event) => {
    const {
        conductorId,
        periodo
    } = event.queryStringParameters || {};

    // Validar periodo
    const periodosValidos = ['dia', 'semana', 'mes', 'año'];
    const periodoFinal = periodosValidos.includes(periodo) ? periodo : 'dia';

    // Si conductorId es 'null' o undefined, enviamos null a la función SQL
    const conductorIdFinal = conductorId && conductorId !== 'null' ? parseInt(conductorId) : null;

    try {
        const client = await poolConection.connect();

        let estadisticas;
        let tipoVista;

        // Si es conductor, mostrar detalle de pedidos individuales
        // Si es admin, mostrar resumen por placa
        if (conductorIdFinal !== null) {
            const { rows } = await client.query(GET_DETALLE_CONDUCTOR, [conductorIdFinal, periodoFinal]);
            estadisticas = rows;
            tipoVista = 'detalle';
        } else {
            const { rows } = await client.query(GET_ESTADISTICAS_ADMIN, [conductorIdFinal, periodoFinal]);
            estadisticas = rows;
            tipoVista = 'resumen';
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
