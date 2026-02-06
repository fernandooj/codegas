const { listTables: listTablesApi } = require('../../../lib/magister-api');
const { queryMagister } = require('../../../lib/magister-db');

/**
 * Handler para listar tablas de Magister
 * Soporta dos modos:
 * - 'api': Conecta vía API REST intermedia (recomendado)
 * - 'direct': Conecta directamente a Firebird (requiere port forwarding)
 */
module.exports.main = async () => {
    const connectionMode = process.env.MAGISTER_CONNECTION_MODE || 'api';
    
    try {
        if (connectionMode === 'direct') {
            console.log('🔍 [magister-list-tables] Modo: Conexión DIRECTA a Firebird');
            console.log(`🔍 [magister-list-tables] Host: ${process.env.MAGISTER_DB_HOST}:${process.env.MAGISTER_DB_PORT}`);
            
            // Conexión directa a Firebird
            const sql = `
                SELECT RDB$RELATION_NAME as table_name
                FROM RDB$RELATIONS
                WHERE RDB$SYSTEM_FLAG = 0
                ORDER BY RDB$RELATION_NAME
            `;
            const rows = await queryMagister(sql);
            
            return {
                status: true,
                mode: 'direct',
                total: rows.length,
                data: rows,
            };
        } else {
            console.log('🔍 [magister-list-tables] Modo: API REST intermedia');
            console.log(`🔍 [magister-list-tables] URL: ${process.env.MAGISTER_API_URL}`);
            
            // Conexión vía API REST
            const rows = await listTablesApi();
            
            return {
                status: true,
                mode: 'api',
                total: rows.length,
                data: rows,
            };
        }
    } catch (error) {
        console.error(`❌ [magister-list-tables] Error (modo: ${connectionMode}):`, error.message);
        console.error('❌ [magister-list-tables] Stack:', error.stack);
        
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
            }
        };
    }
};

