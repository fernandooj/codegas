const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
 
/**
 * get a revision in the database.
 *
 * @param {object} revision - Object containing the data of the revision to deactivate.
 * @param {number} revision.id_revision - Identifier of the revision in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const GET_REVISION_BY_PUNTO = 'SELECT * FROM get_revision_by_punto($1)';

module.exports.main = async (event) => {
  const {
    _id
  } = event.pathParameters;
 
 
  const client = await poolConection.connect();

  try {
    const  { rows: revision } = await client.query(GET_REVISION_BY_PUNTO, [_id])
  
    return {
      status: true,
      revision
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
