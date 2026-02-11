const { ping: pingApi } = require('../../../lib/magister-api');
const { queryMagister } = require('../../../lib/magister-db');

/**
 * Handler para probar la conexión a Magister
 * Soporta dos modos:
 * - 'api': Conecta vía API REST intermedia (recomendado)
 * - 'direct': Conecta directamente a Firebird (requiere port forwarding)
 */
module.exports.main = async () => {
    const connectionMode = process.env.MAGISTER_CONNECTION_MODE || 'api';

    try {
        if (connectionMode === 'direct') {
            console.log('🔍 [magister-ping] Modo: Conexión DIRECTA a Firebird');
            console.log(`🔍 [magister-ping] Host: ${process.env.MAGISTER_DB_HOST}:${process.env.MAGISTER_DB_PORT}`);

            // Conexión directa a Firebird
            const result = await queryMagister('SELECT 1 AS ok FROM RDB$DATABASE');

            return {
                status: true,
                mode: 'direct',
                data: result,
            };
        } else {
            console.log('🔍 [magister-ping] Modo: API REST intermedia');
            console.log(`🔍 [magister-ping] URL: ${process.env.MAGISTER_API_URL}`);

            // Conexión vía API REST
            const result = await pingApi();

            return {
                status: true,
                mode: 'api',
                data: result,
            };
        }
    } catch (error) {
        console.error(`❌ [magister-ping] Error (modo: ${connectionMode}):`, error.message);
        console.error('❌ [magister-ping] Stack:', error.stack);

        return {
            status: false,
            mode: connectionMode,
            error: {
                message: error.message,
                name: error.name,
                code: error.code,
                errno: error.errno,
                syscall: error.syscall,
                stack: error.stack
            },
        };
    }
};

