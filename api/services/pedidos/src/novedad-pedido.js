const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const AWS = require('aws-sdk');
const ses = new AWS.SES();
const NOVEDAD_PEDIDO = 'SELECT * FROM novedad_pedidos($1, $2, $3, $4, $5)';
/**
 * add drivers car in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
 const SOURCE = 'app@codegascolombia.com';
 const email1 = 'gestioncalidad@codegascolombia.com'
 const email2 = 'coord.logistica@codegascolombia.com'
 const email3 = 'gerencia@codegascolombia.com'
 const email4 = 'fernandooj@ymail.com'
 module.exports.main = async (event) => {
 
    const body = JSON.parse(event.body);
    const {
      _id, novedad, perfil_novedad, fechaEntrega, conductorId
    } = body;
    
    const params = {
      Destination: {
        ToAddresses: [email1, email2, email3, email4],
      },
      Message: {
        Body: {
          Html: {
            Data: `Ha sido cerrado y no entregado el pedido <br/> No: ${_id}<br/>Novedad: <strong>${novedad}</strong> <br/>Perfil: <strong>${perfil_novedad}</strong>`,
          },
        },
        Subject: {
          Data: 'Nuevo pedido cerrado no entregado',
        },
      },
      Source: SOURCE,
    };
  
    
    try {
      const client = await poolConection.connect();
      await ses.sendEmail(params).promise();
      await client.query(NOVEDAD_PEDIDO, [
        _id, novedad, perfil_novedad, fechaEntrega, conductorId
      ])
      return {
          status: true
        }
    } catch (error) {
      console.error(error)
      throw new DatabaseError(error);
    }
  };