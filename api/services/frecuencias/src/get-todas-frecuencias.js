const AWS = require('aws-sdk');
const ses = new AWS.SES();
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_FRECUENCIAS = 'SELECT * FROM get_todas_frecuencias()';
const GET_GRUPOS = `
    SELECT 
        _id,
        nombre,
        tipo_frecuencia,
        dia_semana,
        intervalo_semanas,
        dia_mes,
        dia_semana_mensual,
        creado,
        actualizado
    FROM grupos_frecuencias
    WHERE eliminado = FALSE
    ORDER BY nombre ASC
`;

/**
 * Obtiene todas las frecuencias y grupos de frecuencias
 * 
 * @returns {Promise<object>} - Promise that resolves with frecuencias and grupos
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 
module.exports.main = async (event) => {  
  
  try {
    const client = await poolConection.connect();
    
    // Obtener frecuencias (pedidos con frecuencia asignada)
    const {rows: frecuencias} = await client.query(GET_FRECUENCIAS, []);
    
    // Obtener grupos de frecuencias
    const {rows: grupos} = await client.query(GET_GRUPOS, []);

    return {
      status: true,
      frecuencias,
      grupos
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
