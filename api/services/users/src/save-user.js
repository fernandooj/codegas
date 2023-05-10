const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

/** create user */
const SAVE_USER = 'SELECT * FROM save_users($1, $2, $3, $4)';


/** update user info
 *  save user in the table
 * @param {string} name - username user
 * @param {string} email - zona info user
 * @param {string} id_social - zona info user
 * @param {string} photo - zona info user
 * @returns {response} Response contains the data
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    id_social, name, photo, email,  
  } = body;
  const client = await poolConection.connect();

  try {
    await client.query(SAVE_USER, [name, id_social, photo,  email])
    return {status:true}
  } catch (error) {
    throw JSON.stringify(error);
  }
};