const { getCarteraByNit, query } = require('../../../lib/magister-api');
const { queryMagister } = require('../../../lib/magister-db');

/**
 * Handler para obtener la cartera de un cliente por NIT desde Magister.
 *
 * Soporta dos modos:
 * - 'api': Conecta vía API REST intermedia (recomendado)
 * - 'direct': Conecta directamente a Firebird (requiere port forwarding)
 *
 * Ruta HTTP API: GET /magister/cartera/{nit}
 */
module.exports.main = async (event) => {
    const connectionMode = process.env.MAGISTER_CONNECTION_MODE || 'api';

    // En httpApi, los path params vienen en event.pathParameters
    const nit = event?.pathParameters?.nit;

    if (!nit) {
        return {
            status: false,
            mode: connectionMode,
            error: {
                message: 'El parámetro NIT es obligatorio'
            }
        };
    }

    try {
        if (connectionMode === 'direct') {
            console.log('🔍 [magister-get-cartera] Modo: Conexión DIRECTA a Firebird');
            console.log(`🔍 [magister-get-cartera] Host: ${process.env.MAGISTER_DB_HOST}:${process.env.MAGISTER_DB_PORT}`);
            console.log(`🔍 [magister-get-cartera] NIT: ${nit}`);

            const sql = `
                SELECT
                    CAR_EMPRESA,
                    CAR_DOCUMENTO,
                    CAR_NUMERO,
                    CAR_FECHA,
                    CAR_NIT,
                    CAR_FECHA_VENCE,
                    CAR_SALDO
                FROM CARTERA
                WHERE CAR_NIT = ?
                ORDER BY CAR_FECHA DESC, CAR_NUMERO
            `;

            const rows = await queryMagister(sql, [nit]);

            return {
                status: true,
                mode: 'direct',
                nit,
                total: rows.length,
                data: rows
            };
        } else {
            console.log('🔍 [magister-get-cartera] Modo: API REST intermedia');
            console.log(`🔍 [magister-get-cartera] URL: ${process.env.MAGISTER_API_URL}`);
            console.log(`🔍 [magister-get-cartera] NIT: ${nit}`);

            const result = await getCarteraByNit(nit);

            return {
                status: true,
                mode: 'api',
                nit: result.nit || nit,
                total: result.count ?? (result.data ? result.data.length : 0),
                data: result.data || []
            };
        }
    } catch (error) {
        console.error(`❌ [magister-get-cartera] Error (modo: ${connectionMode}):`, error.message);
        console.error('❌ [magister-get-cartera] Stack:', error.stack);

        return {
            status: false,
            mode: connectionMode,
            nit,
            error: {
                message: error.message,
                name: error.name,
                code: error.code,
                errno: error.errno,
                syscall: error.syscall,
                stack: error.stack
            }
        };
    }
};


