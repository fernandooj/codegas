const { poolConection } = require('../../../lib/connection-pg.js');
const { successResponse, errorResponse } = require('../../../lib/responses.js');

const UPDATE_FCM_TOKEN = `
  UPDATE users 
  SET tokenPhone = $1 
  WHERE _id = $2 
  AND eliminado = false
  RETURNING _id, nombre, email, tokenPhone;
`;

const main = async (event) => {
    const client = await poolConection.connect();

    try {
        console.log('Event received:', JSON.stringify(event, null, 2));

        let body;
        try {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } catch (parseError) {
            console.error('Error parsing body:', parseError);
            return errorResponse(400, 'Invalid JSON in request body');
        }

        const { userId, fcmToken } = body;

        // Validar parámetros requeridos
        if (!userId) {
            return errorResponse(400, 'userId is required');
        }

        if (!fcmToken) {
            return errorResponse(400, 'fcmToken is required');
        }

        console.log(`Updating FCM token for user ID: ${userId}`);

        // Ejecutar la consulta
        const { rows } = await client.query(UPDATE_FCM_TOKEN, [fcmToken, userId]);

        if (rows.length === 0) {
            return errorResponse(404, 'User not found or is deleted');
        }

        const updatedUser = rows[0];
        console.log(`FCM token updated successfully for user: ${updatedUser.nombre}`);

        return successResponse({
            message: 'FCM token updated successfully',
            user: {
                id: updatedUser._id,
                nombre: updatedUser.nombre,
                email: updatedUser.email,
                tokenUpdated: true
            }
        });

    } catch (error) {
        console.error('Error updating FCM token:', error);
        return errorResponse(500, 'Internal server error', error.message);
    } finally {
        client.release();
    }
};

module.exports = { main };