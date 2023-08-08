const {poolConection} = require('../../../lib/connection-pg.js')

const AWS = require('aws-sdk');
const ses = new AWS.SES();
 

const CREATE_REPORT = 'select * from save_reporte_emergencia($1, $2, $3, $4, $5, $6, $7, $8, $9)'
const GET_USER_BY_ID = 'SELECT * FROM users WHERE _id = $1';
const SOURCE = 'app@codegascolombia.com';

/**
 * Inserts reporte emergencia into the database.
 *
 * @param {object} point - Object containing the data of the point to insert.
 * @param {string} point.id_mongo_punto - Identifier of the point in MongoDB.
 * @param {string} point.observacion - Observation of the point.
 * @param {number} point.punto - Capacity of the point.
 * @param {number} point.idZona - Identifier of the zone where the point is located.
 * @param {number} point.idCliente - Identifier of the client associated with the point.
 * @param {number} point.idPadre - Identifier of the parent point, if any.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  let {
    tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea
  } = body;

 
  let asunto =  "Nuevo reporte de emergencia"  
  let titulo = `<font size="5">Nuevo reporte de emergencia </font>`
  tanque  ?"Tanque en mal estado" :""
  red     ?"Red en mal estado" :""
  puntos  ?"Puntos de ignición cerca" :""
  fuga    ?"Fuga" :""
  pqr     ?"PQR"  :""
  
  try {
    const client = await poolConection.connect();
       
    const {rows: user} = await client.query(CREATE_REPORT, [tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea])
    const _id = user[0].save_reporte_emergencia
     
    const {rows} =  await client.query(GET_USER_BY_ID, [usuarioId])
    const {rows: userReporta} =  await client.query(GET_USER_BY_ID, [usuarioCrea])
    
    const {codt, razon_social} = rows[0] 
    const {nombre} = userReporta[0] 
 
    let text2  = `N Reporte: ${_id} <br/> ${tanque} <br/> ${red} <br/> ${puntos} <br/> ${fuga} <br/> ${pqr}<br/> ${otrosText}<br/> codt: ${codt}<br/> Usuario: ${razon_social} / ${rows[0].nombre} `
    let text3  = `Usuario Reporta: ${nombre}`
    let email1 = "fernandooj@ymail.com"
    let email2 = "dptotecnico@codegascolombia.com"
     
  
    const params = {
      Destination: {
        ToAddresses: [email1, email2],
      },
      Message: {
        Body: {
          Html: {
            Data: `${titulo} <br/> ${text2}<br/> ${text3}`,
          },
        },
        Subject: {
          Data: asunto,
        },
      },
      Source: SOURCE,
    };
    await ses.sendEmail(params).promise();

    return {
        status: true,
        reporte: _id
      }
  } catch (error) {
    console.error(error)
    throw JSON.stringify(error);
  }
};
