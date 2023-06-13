const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
// const AWS = require('aws-sdk');
// const ses = new AWS.SES();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'app@codegascolombia.com',
        pass: 'C0D3G@S-2020-4PP'
    }
});




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
  const client = await poolConection.connect();

  // const params = {
  //   Destination: {
  //     ToAddresses: [SOURCE],
  //   },
  //   Message: {
  //     Body: {
  //       Text: {
  //         Data: `Hola ${nombre} ya puede ingresar a su cuenta en la app de Codegas, sus datos de acceso son: <br>usuario: ${email}<br/>Contraseña: ${pass}`,
  //       },
  //     },
  //     Subject: {
  //       Data: 'de parte de codegas',
  //     },
  //   },
  //   Source: email,
  // };


  const titulo = "Nueva cuenta en codegas"
  const text1 = `Hola ${nombre} ya puede ingresar a su cuenta en la app de Codegas, sus datos de acceso son:`
  const text2 = `usuario: ${email}<br/>Contraseña: ${pass}`
  const htmlTemplate=(titulo, text1, text2)=>{
    return `
        <h1>${titulo}</h1> 
        <p>${text1}</p>
        <p>${text2}</p>
    `
  };
  let options = {
    from: '<app@codegascolombia.com>',         
    to: email,                       
    subject: "nueva cuenta creada",                          
    html:  htmlTemplate(titulo, text1, text2)
  };
  transporter.sendMail(options, (error, info) => {
      if (error) {
          return console.log(error);
      }
  });


  try {
    await client.query('BEGIN');
    await client.query(SAVE_USER, [razon_social, uid, cedula, direccion_factura, email, nombre, celular, tipo, descuento, acceso, tokenPhone, token, codMagister, codt, codigoRegistro, valorUnitario, idPadre]);
    // await ses.sendEmail(params).promise();
    await client.query('COMMIT');
    return { status: true };
  } catch (error) {
    console.error(error);
    await client.query('ROLLBACK');
    throw new DatabaseError(error);
  }
}