const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_REPORTE_EMERGENCIA_BY_ID = 'SELECT * FROM get_reporte_emergencia_by_id($1)';

/**
 * GET reporte emergencias by user
 *
 * @param {object} reporte emergencia - Object containing the data of the reporte emergencia to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 module.exports.main = async (event) => {
    const {
      id,
    } = event.pathParameters;
 
  
    const client = await poolConection.connect();
 
    try {
      const {rows: reporte} = await client.query(GET_REPORTE_EMERGENCIA_BY_ID, [id]);
 
      return {
        status: true,
        reporte: reporte[0]
      }
    } catch (error) {
      console.log(error);
      throw new DatabaseError(error);
    }
  };
  
