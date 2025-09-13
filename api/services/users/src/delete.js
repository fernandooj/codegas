const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error.js');

/**
 * Deletes a user from the database (soft delete).
 *
 * @param {object} event - Event object containing path parameters.
 * @param {string} event.pathParameters.userId - Identifier of the user to delete.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {DatabaseError} - Throws a DatabaseError if the operation fails.
 */

module.exports.main = async (event) => {
  const {
    userId
  } = event.pathParameters;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: false,
        message: 'User ID is required'
      })
    };
  }

  const DELETE_USER = 'UPDATE users SET eliminado = $1 WHERE _id = $2';

  let client;
  try {
    client = await poolConection.connect();
    const result = await client.query(DELETE_USER, [true, userId]);

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: false,
          message: 'User not found'
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: true,
        message: 'User deleted successfully'
      })
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: false,
        message: 'Internal server error'
      })
    };
  } finally {
    if (client) {
      client.release();
    }
  }
};
