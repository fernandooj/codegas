const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Valida que un punto de entrega pertenezca a un cliente específico.
 * Previene errores de asignación incorrecta de puntos entre clientes.
 *
 * @param {object} event - Event object containing queryStringParameters.
 * @param {string} event.queryStringParameters.puntoId - ID del punto de entrega.
 * @param {string} event.queryStringParameters.clienteId - ID del cliente.
 * @returns {Promise<object>} - Promise que resuelve con la validación.
 * @throws {DatabaseError} - Lanza error si la operación falla.
 */

module.exports.main = async (event) => {
    const { puntoId, clienteId } = event.queryStringParameters;

    if (!puntoId || !clienteId) {
        return {
            status: false,
            message: 'Se requieren puntoId y clienteId para la validación',
            error: 'MISSING_PARAMETERS'
        };
    }

    const VALIDATE_QUERY = 'SELECT * FROM validate_punto_belongs_to_cliente($1, $2)';
    const client = await poolConection.connect();

    try {
        const { rows } = await client.query(VALIDATE_QUERY, [puntoId, clienteId]);

        if (rows.length === 0) {
            return {
                status: false,
                message: 'No se pudo realizar la validación',
                error: 'VALIDATION_ERROR'
            };
        }

        const validationResult = rows[0];

        return {
            status: validationResult.is_valid,
            message: validationResult.mensaje,
            data: {
                isValid: validationResult.is_valid,
                puntoDireccion: validationResult.punto_direccion,
                clienteNombre: validationResult.cliente_nombre
            }
        };
    } catch (error) {
        console.error('Error validating punto-cliente:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

