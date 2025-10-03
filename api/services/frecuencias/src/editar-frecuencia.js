const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Edita una frecuencia de pedido en la base de datos.
 *
 * @param {object} event - Evento de AWS Lambda.
 * @param {object} event.pathParameters - Parámetros de la ruta.
 * @param {string} event.pathParameters.id - ID del pedido a editar.
 * @param {object} event.body - Cuerpo de la petición con los datos a actualizar.
 * @returns {Promise<object>} - Promise que resuelve con un objeto indicando si la operación fue exitosa.
 * @throws {DatabaseError} - Lanza un error de base de datos si la operación falla.
 */

module.exports.main = async (event) => {
    const { id } = event.pathParameters;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                status: false,
                message: 'ID del pedido es requerido'
            })
        };
    }

    try {
        const requestBody = JSON.parse(event.body || '{}');
        const { forma, cantidadKl, cantidadPrecio, frecuencia, dia1, dia2 } = requestBody;
        console.log(requestBody);
        console.log(id);
        // Validaciones básicas
        if (!forma || !frecuencia) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: false,
                    message: 'Forma y frecuencia son campos requeridos'
                })
            };
        }

        // Validaciones específicas según el tipo de forma
        if (forma === 'cantidad' && (!cantidadKl || cantidadKl <= 0)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: false,
                    message: 'Cantidad en KL es requerida y debe ser mayor a 0'
                })
            };
        }

        if (forma === 'monto' && (!cantidadPrecio || cantidadPrecio <= 0)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: false,
                    message: 'Cantidad en precio es requerida y debe ser mayor a 0'
                })
            };
        }

        // Para "lleno" no se requiere cantidad ni monto
        if (forma === 'lleno') {
            // No hay validaciones adicionales para lleno
        }

        // Validaciones para frecuencia semanal
        if (frecuencia === 'semanal' && !dia1) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: false,
                    message: 'Día 1 es requerido para frecuencia semanal'
                })
            };
        }

        // Validaciones para frecuencia quincenal
        if (frecuencia === 'quincenal' && (!dia1 || !dia2)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: false,
                    message: 'Día 1 y día 2 son requeridos para frecuencia quincenal'
                })
            };
        }

        const client = await poolConection.connect();

        // Construir la query de actualización dinámicamente
        let updateFields = [];
        let values = [];
        let paramIndex = 1;

        updateFields.push(`forma = $${paramIndex++}`);
        values.push(forma);

        if (forma === 'cantidad' && cantidadKl) {
            updateFields.push(`cantidadkl = $${paramIndex++}`);
            values.push(cantidadKl);
            updateFields.push(`cantidadprecio = null`);
        } else if (forma === 'monto' && cantidadPrecio) {
            updateFields.push(`cantidadprecio = $${paramIndex++}`);
            values.push(cantidadPrecio);
            updateFields.push(`cantidadkl = null`);
        }

        updateFields.push(`frecuencia = $${paramIndex++}`);
        values.push(frecuencia);

        if (dia1) {
            updateFields.push(`dia1 = $${paramIndex++}`);
            values.push(dia1);
        } else {
            updateFields.push(`dia1 = null`);
        }

        if (dia2) {
            updateFields.push(`dia2 = $${paramIndex++}`);
            values.push(dia2);
        } else {
            updateFields.push(`dia2 = null`);
        }

        values.push(id); // ID al final para la condición WHERE

        const UPDATE_FRECUENCIA = `
      UPDATE pedidos 
      SET ${updateFields.join(', ')} 
      WHERE _id = $${paramIndex}
      RETURNING _id, forma, cantidadkl, cantidadprecio, frecuencia, dia1, dia2
    `;

        const { rows } = await client.query(UPDATE_FRECUENCIA, values);

        if (rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    status: false,
                    message: 'Pedido no encontrado'
                })
            };
        }

        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: true,
                message: 'Frecuencia actualizada correctamente',
                data: rows[0]
            })
        };

    } catch (error) {
        console.log('Error editing frequency:', error);
        throw new DatabaseError(error);
    }
};
