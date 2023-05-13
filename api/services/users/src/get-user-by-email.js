const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

const GET_USER_BY_EMAIL = 'SELECT * FROM get_user_by_email($1)';
/** get user
 *  get user by email
 * @param {email} active - email
 * @returns {response} Response contains the data of cognito
 */

module.exports.handle = async (event) => {
  const {email} = event.pathParameters
  const client  = await poolConection.connect();

  try {
    const data = await client.query(GET_USER_BY_EMAIL[email])
    return data.rows[0]
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 