const { poolConection } = require('../../../lib/connection-pg.js')
const DatabaseError = require('../../../lib/errors/database-error')

const GET_USERS = 'SELECT * FROM get_users($1, $2, $3, $4, $5)';

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
    search,
    id
  } = event.pathParameters;

  // Manejar el caso donde search puede no estar presente
  const newSearch = search == 'undefined' || search == undefined || !search ? '' : search;

  try {
    const client = await poolConection.connect();
    const { rows: user } = await client.query(GET_USERS, [limit, start, acceso, newSearch, id])

    client.release(); // Liberar la conexión

    return {
      status: true,
      user: user[0].get_users.users
    }
  } catch (error) {
    throw new DatabaseError(error);
  }
}; 