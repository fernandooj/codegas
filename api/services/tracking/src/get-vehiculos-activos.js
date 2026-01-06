const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener ubicaciones de todos los vehículos activos
 * 
 * @param {object} event - Evento de API Gateway
 * @returns {Promise<object>} - Lista de vehículos con sus ubicaciones
 */
module.exports.main = async (event) => {
    try {
        const client = await poolConection.connect();

        const query = `SELECT * FROM get_ubicaciones_vehiculos_activos()`;
        const result = await client.query(query);

        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                vehiculos: result.rows,
                total: result.rows.length
            })
        };

    } catch (error) {
        console.error('❌ Error obteniendo vehículos activos:', error);
        throw new DatabaseError(error);
    }
};

