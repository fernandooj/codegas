const AWS = require('aws-sdk');
const ses = new AWS.SES();

 
const SOURCE = 'app@codegascolombia.com';

/** update user info
 *  save user in the table
 * @param {string} email - email
 
 * @returns {response} Response contains the data
 */
module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
 
  const {
    email,
    pass
  } = body;

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Data: `tu nueva contraseña es:<br/><br/> ${pass}`,
        },
      },
      Subject: {
        Data: 'Contraseña actualizada',
      },
    },
    Source: SOURCE,
  };
  
  try {
    await ses.sendEmail(params).promise();  
    return true
  } catch (error) {
    console.error(error);
  }
}