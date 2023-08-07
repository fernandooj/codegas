const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const CERRAR_REPORTE_EMERGENCIA = 'SELECT * FROM cerrar_reporte_emergencia($1, $2, $3, $4, $5, $6, $7, $8)';

/**
 * cerrar reporte emergencias
 *
 * @param {object} reporte emergencia - Object containing the data of the reporte emergencia to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 module.exports.main = async (event) => {
    const body = JSON.parse(event.body);
    const { tanque, red, puntos, fuga, pqr, cerradoText, usuarioCierra, idRevision } = body;
  
    try {
      const client = await poolConection.connect();
      await client.query(CERRAR_REPORTE_EMERGENCIA, [tanque, red, puntos, fuga, pqr, cerradoText, usuarioCierra, idRevision]);
 
      return {
        status: true,
      }
    } catch (error) {
      console.log(error);
      throw new DatabaseError(error);
    }
  };
  
