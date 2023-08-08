const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const AWS = require('aws-sdk');
const ses = new AWS.SES();
 



/** create user */
const SAVE_USER = 'SELECT * FROM save_users($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)';
const SOURCE = 'app@codegascolombia.com';

/** update user info
 *  save user in the table
 * @param {string} razon_social - username user
 * @param {string} cedula - zona info user
 * @param {string} direccion_factura - zona info user
 * @param {string} email - zona info user
 * @param {string} nombre - zona info user
 * @param {string} celular - zona info user
 * @param {string} tipo - zona info user
 * @param {string} descuento - zona info user
 * @param {string} acceso - zona info user
 * @param {string} tokenPhone - zona info user
 * @param {string} token - zona info user
 * @param {string} codMagister - zona info user
 * @param {string} codt - zona info user
 * @param {string} codigoRegistro - zona info user
 * @param {string} valorUnitario - zona info user
 * @param {string} idPadre - zona info user
 * @param {string} uid - zona info user
 * @returns {response} Response contains the data
 */
module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const token = Math.floor(1000 + Math.random() * 9000);
  const {
    razon_social, uid, cedula, direccion_factura, email, nombre, celular, tipo, descuento, acceso, tokenPhone, codMagister, codt, codigoRegistro, valorUnitario, idPadre,
    pass
  } = body;
  
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Data: `Hola ${nombre}, ya puede ingresar a su cuenta en la app de Codegas. Sus datos de acceso son:<br/>Usuario: <strong>${email}</strong> <br/>Contraseña: <strong>${pass}</strong>`,
        },
      },
      Subject: {
        Data: 'Nueva Cuenta codegas',
      },
    },
    Source: SOURCE,
  };
  
  
  
  
  try {
    const client = await poolConection.connect();
    //await client.query('BEGIN');
    const {rows} = await client.query(SAVE_USER, [razon_social, uid, cedula, direccion_factura, email, nombre, celular, tipo, descuento, acceso, tokenPhone, token, codMagister, codt, codigoRegistro, valorUnitario, idPadre]);
    await ses.sendEmail(params).promise();
 
    //await client.query('COMMIT');
    return { 
      status: !!rows[0].save_users,
      code: rows[0].save_users || "email exist"
    };
  } catch (error) {
    console.error(error);
    //await client.query('ROLLBACK');
    throw new DatabaseError(error);
  }
}