const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
/** create user update*/
const GET_USER_BY_UID = 'SELECT * FROM get_user_by_uid($1)';


/** get user
 *  save user active in the table
 * @param {string} uid - username user
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  const {
    uid
  } = event.pathParameters;
  
  try {
    const client  = await poolConection.connect();
    const {rows} = await client.query(GET_USER_BY_UID, [uid])

    return  rows[0]
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 