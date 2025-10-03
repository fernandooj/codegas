const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

module.exports.handle = async (event) => {
  
  const selectCategories = `SELECT * FROM categories`;
  

  try {
    const client = await poolConection.connect();
    client.query('BEGIN');

    const { rows } = await client.query(selectCategories);

    client.query('COMMIT');

    return rows;
  } catch (error) {
    throw new DatabaseError(error);
  }
};
