const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
/** save zona */
const SAVE_ZONA = 'SELECT * FROM save_zonas($1)';

/**
 * Inserts a zona into the database.
 *
 * @param {object} zona - Object containing the data of the zona to insert.
 * @param {string} zona.id_mongo_zona - Identifier of the zona in MongoDB.
 * @param {string} zona.nombre - Observation of the zona.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    nombre
  } = body;
  const client = await poolConection.connect();

  try {

    await client.query(SAVE_ZONA, [nombre])
    return {
      status: true
      }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
