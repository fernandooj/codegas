/**
 * Script de migración: Agregar campo checklist a tabla pedidos
 * Fecha: 2025-11-05
 * 
 * Este script agrega el campo 'checklist' (JSONB) a la tabla pedidos
 * para almacenar la lista de chequeo de seguridad
 * 
 * Uso:
 * - Ejecutar manualmente: node update-checklist-field.js
 * - O integrar en el proceso de despliegue
 */

const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Ejecuta la migración
 */
async function runMigration() {
    const client = await poolConection.connect();

    try {
        console.log('🚀 Iniciando migración: Agregar campo checklist...');

        // Iniciar transacción
        await client.query('BEGIN');

        // 1. Verificar si el campo ya existe
        const checkColumnQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name = 'checklist';
        `;

        const columnExists = await client.query(checkColumnQuery);

        if (columnExists.rows.length > 0) {
            console.log('⚠️  El campo "checklist" ya existe. Saltando migración...');
            await client.query('ROLLBACK');
            return { success: true, message: 'Campo ya existe' };
        }

        // 2. Agregar columna checklist
        console.log('📝 Agregando columna checklist...');
        await client.query(`
            ALTER TABLE pedidos 
            ADD COLUMN checklist JSONB DEFAULT '[]'::jsonb;
        `);

        // 3. Crear índice GIN para búsquedas eficientes en JSONB
        console.log('🔍 Creando índice para checklist...');
        await client.query(`
            CREATE INDEX idx_pedidos_checklist 
            ON pedidos USING GIN (checklist);
        `);

        // 4. Agregar comentario al campo
        console.log('💬 Agregando comentario al campo...');
        await client.query(`
            COMMENT ON COLUMN pedidos.checklist IS 
            'Lista de chequeo de seguridad - Array de objetos {id: number, status: boolean}';
        `);

        // 5. Inicializar el campo con array vacío para registros existentes
        console.log('🔄 Inicializando checklist en registros existentes...');
        const updateResult = await client.query(`
            UPDATE pedidos 
            SET checklist = '[]'::jsonb 
            WHERE checklist IS NULL;
        `);

        console.log(`✅ ${updateResult.rowCount} registros actualizados`);

        // Confirmar transacción
        await client.query('COMMIT');

        console.log('✨ ¡Migración completada exitosamente!');

        return {
            success: true,
            message: 'Campo checklist agregado correctamente',
            recordsUpdated: updateResult.rowCount
        };

    } catch (error) {
        // Revertir transacción en caso de error
        await client.query('ROLLBACK');
        console.error('❌ Error en la migración:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Verificar el estado de la migración
 */
async function checkMigrationStatus() {
    const client = await poolConection.connect();

    try {
        const query = `
            SELECT 
                column_name, 
                data_type, 
                column_default,
                is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'pedidos' 
            AND column_name = 'checklist';
        `;

        const result = await client.query(query);

        if (result.rows.length > 0) {
            console.log('📊 Estado del campo checklist:');
            console.table(result.rows);
            return result.rows[0];
        } else {
            console.log('⚠️  El campo checklist no existe');
            return null;
        }
    } finally {
        client.release();
    }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
    (async () => {
        try {
            // Verificar estado antes
            console.log('\n=== VERIFICACIÓN PREVIA ===');
            await checkMigrationStatus();

            // Ejecutar migración
            console.log('\n=== EJECUTANDO MIGRACIÓN ===');
            const result = await runMigration();
            console.log(result);

            // Verificar estado después
            console.log('\n=== VERIFICACIÓN POSTERIOR ===');
            await checkMigrationStatus();

            console.log('\n✅ Proceso completado');
            process.exit(0);
        } catch (error) {
            console.error('\n❌ Error fatal:', error);
            process.exit(1);
        }
    })();
}

// Exportar funciones para uso programático
module.exports = {
    runMigration,
    checkMigrationStatus
};

