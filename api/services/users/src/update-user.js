const { Pool } = require('pg');

/** RDS Pool */
const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
});

/** create user */
const UPDATE_USER = 'SELECT * FROM update_user($1, $2, $3, $4, $5, $6)';


/** update user info
 *  save user in the table
 * @param {string} name - username user
 * @param {string} email - zona info user
 * @param {Number} id - zona info user
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event, context) => {
  // context.callbackWaitsForEmptyEventLoop = false;
  const {
    id, name, identification, phone, license_type, email,  
  } = event;
  const client = await pool.connect();

  try {
    await client.query(UPDATE_USER, [id, name, identification, phone, license_type, email])
    return {status:true}
  } catch (error) {
    throw JSON.stringify(error);
  }
};