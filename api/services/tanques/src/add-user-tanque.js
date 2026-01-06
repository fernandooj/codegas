const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * add user.
 *
 * @param {object} user - Object containing the data of the tanque assignment.
 * @param {number} user.usuarioId - Identifier of the user in the database.
 * @param {number} user.puntoId - Identifier of the point in the database.
 * @param {number} user.tanqueId - Identifier of the tanque in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

const ADD_USER = 'UPDATE tanques SET usuario_id = $1, punto_id = $2 WHERE _id = $3';
module.exports.main = async (event) => {
  console.log('[add-user-tanque] Event received:', {
    method: event.requestContext?.http?.method || event.httpMethod,
    path: event.requestContext?.http?.path || event.path,
    hasBody: !!event.body
  });

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS request for CORS
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
  } catch (parseError) {
    console.error('[add-user-tanque] Error parsing body:', parseError);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: false,
        message: 'Invalid JSON in request body'
      })
    };
  }

  const {
    usuarioId,
    puntoId,
    tanqueId
  } = body;

  console.log('[add-user-tanque] Parsed data:', {
    usuarioId,
    puntoId,
    tanqueId,
    tipos: {
      usuarioId: typeof usuarioId,
      puntoId: typeof puntoId,
      tanqueId: typeof tanqueId
    }
  });

  if (!usuarioId || !puntoId || !tanqueId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: false,
        message: 'usuarioId, puntoId y tanqueId son requeridos'
      })
    };
  }

  // Asegurarse de que todos los IDs sean números
  const usuarioIdNum = Number(usuarioId);
  const puntoIdNum = Number(puntoId);
  const tanqueIdNum = Number(tanqueId);

  if (isNaN(usuarioIdNum) || isNaN(puntoIdNum) || isNaN(tanqueIdNum)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: false,
        message: 'usuarioId, puntoId y tanqueId deben ser números válidos'
      })
    };
  }

  const client = await poolConection.connect();

  try {
    console.log('[add-user-tanque] Updating tanque:', {
      tanqueId: tanqueIdNum,
      usuarioId: usuarioIdNum,
      puntoId: puntoIdNum
    });

    await client.query(ADD_USER, [usuarioIdNum, puntoIdNum, tanqueIdNum]);

    console.log('[add-user-tanque] Successfully updated tanque');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: true,
        message: 'Tanque asignado correctamente'
      })
    };
  } catch (error) {
    console.error('[add-user-tanque] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: false,
        message: error.message || 'Error asignando tanque al cliente',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  } finally {
    client.release();
  }
};
