const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const CHANGE_VALOR_UNITARIO_TODOS = 'SELECT change_valor_unitario_todos($1::jsonb)';

/**
 * Deactivates a zona in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
    const body = JSON.parse(event.body);

    const {
      seleccionados
    } = body;
  console.log(seleccionados)

  const client = await poolConection.connect();

  try {
    await client.query(CHANGE_VALOR_UNITARIO_TODOS, [JSON.stringify(seleccionados)])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
