const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener total de pedidos en gestión (fechaEntrega = hoy y carroId = NULL)
 * 
 * @param {object} event - Evento de API Gateway
 * @returns {Promise<object>} - Total de pedidos en gestión
 */
module.exports.main = async (event) => {
    let client;
    try {
        console.log('🔍 [get-pedidos-en-gestion] Obteniendo pedidos en gestión...');

        client = await poolConection.connect();
        console.log('✅ [get-pedidos-en-gestion] Conexión a BD establecida');

        // Llamar a la función SQL
        const query = 'SELECT * FROM get_pedidos_en_gestion()';

        console.log('📝 [get-pedidos-en-gestion] Ejecutando query...');
        const result = await client.query(query);

        console.log('✅ [get-pedidos-en-gestion] Resultado obtenido:', result.rows[0]);

        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                total: result.rows[0]?.total_pedidos || 0
            })
        };

    } catch (error) {
        console.error('❌ [get-pedidos-en-gestion] Error:', error);
        console.error('❌ [get-pedidos-en-gestion] Stack:', error.stack);
        if (client) {
            client.release();
        }
        throw new DatabaseError(error);
    }
};

