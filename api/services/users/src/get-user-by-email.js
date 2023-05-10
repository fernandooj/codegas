const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')


/** get user
 *  get user by email
 * @param {email} active - email
 * @returns {response} Response contains the data of cognito
 */

module.exports.handle = async (event) => {
  const {email} = event.pathParameters
  console.log(email)
  const client  = await poolConection.connect();
  const GET_USER_BY_EMAIL = `SELECT * FROM users where email = '${email}'`;

  try {
    const data = await client.query(GET_USER_BY_EMAIL)
    return data.rows[0]
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 