const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

const GET_USER_BY_EMAIL = 'SELECT * FROM get_user_by_email($1)';
/** get user
 *  get user by email
 * @param {email} active - email
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  const {email} = event.pathParameters
  
  try {
    const client  = await poolConection.connect();
    const {rows} = await client.query(GET_USER_BY_EMAIL, [email])
    return rows[0]
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 