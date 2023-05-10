const { Pool } = require('pg');

/** RDS Pool */
const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
});

/** create user update*/
const UPDATE_USER_ACTIVE = 'SELECT * FROM update_user_active($1, $2)';


/** update user active info
 *  save user active in the table
 * @param {boolean} active - username user
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  // context.callbackWaitsForEmptyEventLoop = false;
  const {
    active
  } = event;
  const client  = await pool.connect();

  try {
    await client.query(UPDATE_USER, [id, active])
    return {status:true}
  } catch (error) { 
    throw JSON.stringify(error);
  }
}; 