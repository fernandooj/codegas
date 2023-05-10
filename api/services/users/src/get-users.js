const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
/** create user update*/
const GET_USERS = 'SELECT * FROM users order by id_user desc';


/** get user
 *  save user active in the table
 * @param {boolean} active - username user
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  const {
    email
  } = event;
  const client  = await poolConection.connect();

  try {
    const data = await client.query(GET_USERS)
    const total = data.rowCount;
    return {
      total,
      rows:data.rows
    }
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 