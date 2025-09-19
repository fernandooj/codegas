const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_PUNTO_BY_USER = 'SELECT * FROM get_puntos_user($1)';

/**
 * Deactivates a zona in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const {
    _id,
  } = event.pathParameters;

  // Validar que _id existe y no es undefined
  if (!_id || _id === 'undefined' || _id === 'null') {
    console.log('❌ ID inválido recibido:', _id);
    return {
      status: false,
      error: 'ID de usuario requerido',
      puntos: []
    };
  }

  // Convertir el ID en un número entero
  const idNum = parseInt(_id, 10);

  // Validar que el parseInt fue exitoso
  if (isNaN(idNum)) {
    console.log('❌ ID no es un número válido:', _id);
    return {
      status: false,
      error: 'ID debe ser un número válido',
      puntos: []
    };
  }

  const client = await poolConection.connect();
  console.log('✅ Obteniendo puntos para ID válido:', idNum)
  try {
    const { rows: puntos } = await client.query(GET_PUNTO_BY_USER, [idNum]);

    return {
      status: true,
      puntos
    }
  } catch (error) {
    console.log(error);
    throw new DatabaseError(error);
  } finally {
    client.release();
  }
};

