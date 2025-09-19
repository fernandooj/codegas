const { poolConection } = require('../../../lib/connection-pg.js')

/** update user active */
const UPDATE_USER_ACTIVE = 'SELECT * FROM update_user_active($1, $2)';

/**
 * Updates user active status in the database.
 *
 * @param {string} userId - ID of the user to update.
 * @param {boolean} isActive - Active status (true/false).
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const { userId, isActive } = event.pathParameters;

  const client = await poolConection.connect();

  try {
    await client.query(UPDATE_USER_ACTIVE, [userId, isActive]);

    return {
      status: true,
      message: `Usuario ${isActive === 'true' ? 'activado' : 'desactivado'} correctamente`
    };
  } catch (error) {
    console.error('Error updating user active status:', error);
    throw JSON.stringify(error);
  } finally {
    client.release();
  }
};