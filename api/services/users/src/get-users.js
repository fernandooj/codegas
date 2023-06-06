const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
 
const GET_USERS = 'SELECT * FROM get_users($1, $2, $3, $4)';

/** get user
 *  save user active in the table
 * @param {string} uid - username user
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  const {
    limit, 
    start,
    acceso,
    search
  } = event.pathParameters;
  const newSearch = search == 'undefined' ||  search == undefined ? '' :search
  try {
    const client  = await poolConection.connect();
    const {rows: user} = await client.query(GET_USERS, [limit, start, acceso, newSearch])
  
    return {
      status: true,
      user
    }
  } catch (error) { 
    throw new DatabaseError(error);
  }
}; 