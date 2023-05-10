const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

module.exports.handle = async (event) => {
  
  const {coords = "4.662795384557246, -74.11561761785137"} = event.pathParameters
  const selectEvents = `SELECT * FROM get_nearest_events(${coords})`;
  

  try {
    const client = await poolConection.connect();
    client.query('BEGIN');

    const { rows } = await client.query(selectEvents);

    client.query('COMMIT');

    return rows;
  } catch (error) {
    throw new DatabaseError(error);
  }
};
