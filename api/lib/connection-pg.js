const { Pool } = require('pg');
 
const {RDS_HOSTNAME, RDS_DB, RDS_PORT, RDS_USERNAME, RDS_PASSWORD} = process.env;

const poolConection = new Pool({
  host: RDS_HOSTNAME,
  database: RDS_DB,
  port: RDS_PORT,
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
});


module.exports = {poolConection}