const { poolConection } = require('../../../lib/connection-pg.js')
const DatabaseError = require('../../../lib/errors/database-error')

const GET_CONDUCTORES = 'SELECT * FROM get_conductores_simple($1, $2)';

/** get conductores
 *  Obtiene todos los conductores disponibles
 * @param {number} limit - límite de resultados
 * @param {number} start - offset para paginación
 * @returns {response} Response contiene los conductores
 */

module.exports.main = async (event) => {
    const {
        limit = 1000,
        start = 0
    } = event.pathParameters || {};

    try {
        const client = await poolConection.connect();
        const { rows: user } = await client.query(GET_CONDUCTORES, [limit, start])

        client.release(); // Liberar la conexión

        return {
            status: true,
            user: user[0].get_conductores_simple.users
        }
    } catch (error) {
        console.error('Error en get-conductores-simple:', error);
        throw new DatabaseError(error);
    }
};
