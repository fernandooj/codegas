const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const CREAR_FRECUENCIAL_QUINCENAL = 'SELECT * FROM create_frecuencias_quincenal($1)';
/**
 * add drivers car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

const TYPE = 'quincenal'
module.exports.main = async (event) => {  
  const client = await poolConection.connect();

  try {
    const {rows: pedidos} = await client.query(CREAR_FRECUENCIAL_QUINCENAL, [TYPE])
    return {
      status: true,
      pedidos
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
