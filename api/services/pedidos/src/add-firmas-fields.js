const { poolConection } = require('../../../lib/connection-pg.js');

/**
 * Script para agregar campos de firmas a la tabla pedidos
 */

const ADD_FIRMAS_FIELDS_SQL = `
ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS firma_conductor VARCHAR(255),
ADD COLUMN IF NOT EXISTS firma_usuario VARCHAR(255);
`;

const CHECK_FIRMAS_FIELDS_SQL = `
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'pedidos' 
AND column_name IN ('firma_conductor', 'firma_usuario')
ORDER BY column_name;
`;

/**
 * Ejecuta la migración para agregar campos de firmas
 */
const runMigration = async () => {
    let client;
    try {
        console.log('🔄 Iniciando migración: Agregar campos de firmas...');
        
        client = await poolConection.connect();
        
        // Ejecutar la migración
        await client.query(ADD_FIRMAS_FIELDS_SQL);
        
        // Verificar que se agregaron correctamente
        const result = await client.query(CHECK_FIRMAS_FIELDS_SQL);
        
        console.log('✅ Migración completada exitosamente');
        console.log('📊 Campos agregados:', result.rows);
        
        return {
            status: true,
            message: 'Campos de firmas agregados correctamente',
            fields: result.rows
        };
    } catch (error) {
        console.error('❌ Error ejecutando migración:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

/**
 * Verifica el estado de los campos de firmas
 */
const checkMigrationStatus = async () => {
    let client;
    try {
        client = await poolConection.connect();
        const result = await client.query(CHECK_FIRMAS_FIELDS_SQL);
        
        return {
            status: true,
            exists: result.rows.length === 2,
            fields: result.rows
        };
    } catch (error) {
        console.error('❌ Error verificando migración:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

// Si se ejecuta directamente
if (require.main === module) {
    runMigration()
        .then(() => {
            console.log('✅ Script completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script falló:', error);
            process.exit(1);
        });
}

module.exports = {
    runMigration,
    checkMigrationStatus
};

