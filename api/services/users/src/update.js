const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error.js');

/**
 * Updates a user in the database using the update_user SQL function.
 *
 * @param {object} event - The event object containing path parameters and body.
 * @param {string} event.pathParameters.userId - Identifier of the user to update.
 * @param {object} event.body - Object containing the user data to update.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails.
 */

module.exports.main = async (event) => {
    const { userId } = event.pathParameters;
    const userData = JSON.parse(event.body || '{}');

    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                status: false,
                message: 'User ID is required'
            })
        };
    }

    if (!userData || Object.keys(userData).length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                status: false,
                message: 'User data is required'
            })
        };
    }

    const client = await poolConection.connect();

    try {
        // Map the userData fields to function parameters
        const {
            razon_social,
            cedula,
            direccion_factura,
            email,
            nombre,
            celular,
            tipo,
            acceso,
            codMagister,
            codt,
            valorUnitario,
            editado,
            idpadre
        } = userData;

        // Call the update_user SQL function
        const UPDATE_USER_FUNCTION = `
      SELECT update_user(
        $1::INT,                    -- p_id
        NULL,                       -- p_uid
        $2,                         -- p_razon_social
        $3,                         -- p_cedula
        $4,                         -- p_direccion_factura
        $5,                         -- p_email
        $6,                         -- p_nombre
        $7,                         -- p_celular
        $8,                         -- p_tipo
        NULL,                       -- p_descuento
        $9,                         -- p_acceso
        NULL,                       -- p_tokenPhone
        NULL,                       -- p_token
        $10,                        -- p_codMagister
        NULL,                       -- p_avatar
        $11,                        -- p_codt
        NULL,                       -- p_codigoRegistro
        $12::INT,                   -- p_valorUnitario
        $13::INT                    -- p_idpadre
      )
    `;

        const result = await client.query(UPDATE_USER_FUNCTION, [
            userId,
            razon_social || null,
            cedula || null,
            direccion_factura || null,
            email || null,
            nombre || null,
            celular || null,
            tipo || null,
            acceso || null,
            codMagister || null,
            codt || null,
            valorUnitario || null,
            idpadre || null
        ]);

        // Get the updated user data
        const GET_USER = `
      SELECT *
      FROM users 
      WHERE _id = $1
    `;

        const userResult = await client.query(GET_USER, [userId]);

        if (userResult.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    status: false,
                    message: 'User not found'
                })
            };
        }

        const updatedUser = userResult.rows[0];

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: true,
                message: 'User updated successfully',
                user: updatedUser
            })
        };

    } catch (error) {
        console.error('Error updating user:', error);
        // Fix DatabaseError constructor call
        const dbError = new DatabaseError({
            error: error.message || 'Failed to update user',
            message: error.message || 'Failed to update user',
            routine: error.routine || 'update_user',
            code: error.code || 'UPDATE_ERROR',
            statusCode: 500,
            stack: error.stack
        });
        throw dbError;
    } finally {
        client.release();
    }
};
