const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

module.exports.main = async (event) => {
  
  const {coords = "4.662795384557246, -74.11561761785137", order} = event.pathParameters
  const selectEvents = `SELECT * FROM get_date_events(${coords}, '${order}')`;
  
  console.log(selectEvents)
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
