const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_REPORTE_EMERGENCIA_BY_USER = 'SELECT * FROM get_reporte_emergencia_by_user($1, $2, $3, $4)';

/**
 * GET reporte emergencias by id
 *
 * @param {object} reporte emergencia - Object containing the data of the reporte emergencia to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 module.exports.main = async (event) => {
    const {
      start,
      limit,
      id,
      search
    } = event.pathParameters;
    const newSearch = search == 'undefined' ||  search == undefined ? '' :search
  
    const client = await poolConection.connect();
 
    try {
      const {rows: reporte} = await client.query(GET_REPORTE_EMERGENCIA_BY_USER, [start, limit, id, newSearch]);
 
      return {
        status: true,
        reporte
      }
    } catch (error) {
      console.log(error);
      throw new DatabaseError(error);
    }
  };
  
