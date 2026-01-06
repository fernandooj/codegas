const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')

const GET_USERS_ZONAS = 'SELECT * FROM get_user_with_zonas($1, $2, $3, $4, $5)';
/** get user
 *  get user by email
 * @param {email} active - email
 * @returns {response} Response contains the data of cognito
 */

module.exports.main = async (event) => {
  const {
    limit,
    start,
    idZona,
    type,
    search,
  } = event.pathParameters;
  // Convertir 'empty', 'undefined' o valores undefined a cadena vacía
  const newSearch = (search == 'undefined' || search == undefined || search == 'empty') ? '' : search

  console.log('📥 [get-user-with-zonas] Parámetros recibidos:', { limit, start, idZona, type, search, newSearch });

  try {
    const client  = await poolConection.connect();
    const {rows} = await client.query(GET_USERS_ZONAS, [limit, start, idZona, type, newSearch])
    client.release(); // Liberar la conexión
    console.log('✅ [get-user-with-zonas] Resultados obtenidos:', rows.length, 'filas');
    return rows
  } catch (error) { 
    console.error('❌ [get-user-with-zonas] Error:', error);
    throw new DatabaseError(error);
  }
}; 