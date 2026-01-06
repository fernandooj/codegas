const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Import users - updates existing users based on id
 *
 * @param {object} event - Lambda event object.
 * @param {array} event.body.users - Array of user objects to import.
 * @returns {Promise<object>} - Promise that resolves with import results.
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails.
 */

// Función para convertir números de Excel a fecha ISO
const excelDateToISO = (excelDate) => {
    if (typeof excelDate !== 'number') return excelDate;

    // Excel almacena fechas como días desde 1900-01-01
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000);

    // Formatear como YYYY-MM-DD
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

module.exports.main = async (event) => {
    // El body puede venir como string o como objeto dependiendo de la configuración
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
        return {
            status: false,
            success: false,
            message: 'No se proporcionaron usuarios para importar',
            errors: ['Array de usuarios vacío o inválido']
        };
    }

    let updated = 0;
    let errors = [];
    let client = null;

    // Procesar en lotes para evitar agotar la conexión
    const BATCH_SIZE = 100; // Procesar 100 usuarios a la vez
    
    try {
        // Dividir usuarios en lotes
        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);
            console.log(`Procesando lote ${Math.floor(i / BATCH_SIZE) + 1} de ${Math.ceil(users.length / BATCH_SIZE)} (${batch.length} usuarios)`);
            
            // Obtener nueva conexión para cada lote
            client = await poolConection.connect();
            
            try {
                // Procesar cada usuario del lote
                for (const userData of batch) {
                    try {
                        // Validar que tenga ID (requerido)
                        if (!userData.id) {
                            errors.push('Usuario sin id - se omitió');
                            continue;
                        }

                        const userId = parseInt(userData.id);
                        if (isNaN(userId)) {
                            errors.push(`Usuario con id inválido: ${userData.id} - se omitió`);
                            continue;
                        }

                        // Check if user exists by ID
                        const checkQuery = 'SELECT _id FROM users WHERE _id = $1';
                        const checkResult = await client.query(checkQuery, [userId]);

                        if (checkResult.rows.length === 0) {
                            errors.push(`Usuario con id ${userId} no encontrado - se omitió`);
                            continue;
                        }

                        // Build update query dynamically based on provided fields
                        const allowedFields = {
                            nombre: 'nombre',
                            email: 'email',
                            razon_social: 'razon_social',
                            cedula: 'cedula',
                            celular: 'celular',
                            direccion: 'direccion',
                            direccion_factura: 'direccion_factura',
                            codt: 'codt',
                            valorUnitario: 'valorunitario',
                            valorUnitario2: 'valor_unitario_2',
                            fechaExpiracion: 'fecha_expiracion',
                            tipo: 'tipo',
                            acceso: 'acceso',
                            codMagister: 'codmagister'
                        };

                        const updateFields = [];
                        const values = [];
                        let paramIndex = 1;

                        Object.keys(allowedFields).forEach(jsField => {
                            const dbField = allowedFields[jsField];
                            if (userData[jsField] !== undefined && userData[jsField] !== null && userData[jsField] !== '') {
                                let value = userData[jsField];

                                // Convertir fechas de Excel si es necesario
                                if (jsField === 'fechaExpiracion' && typeof value === 'number') {
                                    value = excelDateToISO(value);
                                }

                                updateFields.push(`${dbField} = $${paramIndex}`);
                                values.push(value);
                                paramIndex++;
                            }
                        });

                        if (updateFields.length === 0) {
                            errors.push(`Usuario con id ${userId} - no hay campos para actualizar`);
                            continue;
                        }

                        // Add user ID as last parameter
                        values.push(userId);

                        const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE _id = $${paramIndex}`;

                        const updateResult = await client.query(updateQuery, values);

                        if (updateResult.rowCount > 0) {
                            updated++;
                        }
                    } catch (error) {
                        const userId = userData.id ? userData.id : 'desconocido';
                        console.error(`Error procesando usuario con id ${userId}:`, error.message);
                        errors.push(`Error al actualizar usuario con id ${userId}: ${error.message}`);
                    }
                }
            } finally {
                // Liberar la conexión después de cada lote
                if (client) {
                    client.release();
                    client = null;
                }
            }
        }

        return {
            status: true,
            success: true,
            message: `Importación completada. ${updated} usuarios actualizados`,
            updated: updated,
            errors: errors.length > 0 ? errors.slice(0, 100) : undefined // Limitar errores a 100 para no sobrecargar la respuesta
        };

    } catch (error) {
        console.error('Error en importación masiva:', error);
        throw new DatabaseError(error);
    } finally {
        // Asegurar que la conexión se libere incluso si hay un error
        if (client) {
            client.release();
        }
    }
};

