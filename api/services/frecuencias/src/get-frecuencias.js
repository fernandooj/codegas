const AWS = require('aws-sdk');
const ses = new AWS.SES();
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_FRECUENCIAL_SEMANAL = 'SELECT * FROM get_frecuencias_semanal($1)';
const GET_FRECUENCIAL_QUINCENAL = 'SELECT * FROM get_frecuencias_quincenal($1)';
const GET_FRECUENCIAL_MENSUAL = 'SELECT * FROM get_frecuencias_mensual($1)';
/**
 * add drivers car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

const TYPE_SEMANAL = 'semanal'
const TYPE_QUINCENAL = 'quincenal'
const TYPE_MENSUAL = 'mensual'
const email1 = 'gestioncalidad@codegascolombia.com'
const email2 = 'coord.logistica@codegascolombia.com'
const email3 = 'gerencia@codegascolombia.com'
const email4 = 'fernandooj@ymail.com'
const SOURCE = 'app@codegascolombia.com';
module.exports.main = async (event) => {  
    
  
  try {
    const client = await poolConection.connect();
    
    const {rows: semanal} = await client.query(GET_FRECUENCIAL_SEMANAL, [TYPE_SEMANAL])
    const {rows: quincenal} = await client.query(GET_FRECUENCIAL_QUINCENAL, [TYPE_QUINCENAL])
    const {rows: mensual} = await client.query(GET_FRECUENCIAL_MENSUAL, [TYPE_MENSUAL])
    const params = {
      Destination: {
        ToAddresses: [email1, email2, email3, email4],
      },
      Message: {
        Body: {
          Html: {
            Data: `
            Pedidos Frecuencias:  <br/> 
            <br/> Total Semanal: ${semanal.length} 
            <br/><pre>${JSON.stringify(semanal, null, 2)}</pre>,
            <br/> Total Quincenal: ${quincenal.length} 
            <br/><pre>${JSON.stringify(quincenal, null, 2)}</pre>,
            <br/> Total Mensual: ${mensual.length}<br/> 
            <br/><pre>${JSON.stringify(mensual, null, 2)}</pre>`,
          },
        },
        Subject: {
          Data: 'nuevos pedidos frecuencias',
        },
      },
      Source: SOURCE,
    };
    await ses.sendEmail(params).promise();
    return {
      status: true,
      totalSemanal: semanal.length,
      totalQuincenal: quincenal.length,
      totalMensual: mensual.length,
      semanal,
      quincenal,
      mensual
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
