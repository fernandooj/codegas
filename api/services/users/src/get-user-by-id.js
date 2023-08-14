const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
 
const GET_USER_BY_ID = 'SELECT * FROM get_user_by_id($1)';


/** get user
 *  save user active in the table
 * @param {string} id - username user
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  const {
    _id
  } = event.pathParameters;
  
  try {
    const client  = await poolConection.connect();
    const {rows} = await client.query(GET_USER_BY_ID, [_id])

    return {
      status: true,
      user: rows[0]
    }
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 