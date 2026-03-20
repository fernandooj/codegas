const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * get a car in the database.
 *
 * @param {object} car - Object containing the data of the zona to deactivate.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */
const GET_PEDIDOS = 'SELECT * FROM get_pedidos_search_optimized($1, $2, $3, $4, $5, $6, $7, $8)';
const GET_APROBADOS_MAGISTER = `
  SELECT
    _id,
    COALESCE(aprobado_magister, false) AS aprobado_magister
  FROM pedidos
  WHERE _id = ANY($1::int[])
`;

module.exports.main = async (event) => {
  const {
    usuarioId,
    limit,
    start,
    acceso,
    search,
    estado,
    ordenPor,
    tipoOrden
  } = event.pathParameters;
  const newSearch = search == 'undefined' || search == undefined || search == 'all' ? '' : search;
  const newEstado = estado == 'undefined' || estado == undefined ? 'todos' : estado;
  const newOrdenPor = ordenPor == 'undefined' || ordenPor == undefined ? 'fecha_creacion' : ordenPor;
  const newTipoOrden = tipoOrden == 'undefined' || tipoOrden == undefined ? 'DESC' : tipoOrden;
  const client = await poolConection.connect();
  try {
    const { rows: pedido } = await client.query(GET_PEDIDOS, [usuarioId, limit, start, acceso, newSearch, newEstado, newOrdenPor, newTipoOrden])

    // Enriquecer pedidos con flag de aprobación MaGister
    if (pedido.length > 0) {
      const ids = pedido
        .map((item) => Number(item._id))
        .filter((id) => Number.isFinite(id));

      if (ids.length > 0) {
        try {
          const { rows: aprobados } = await client.query(GET_APROBADOS_MAGISTER, [ids]);
          const aprobadosMap = new Map(
            aprobados.map((row) => [Number(row._id), !!row.aprobado_magister])
          );
          pedido.forEach((item) => {
            item.aprobado_magister = aprobadosMap.get(Number(item._id)) || false;
          });
        } catch (aprobadosError) {
          // Compatibilidad hacia atrás: si la columna no existe aún, continuar sin romper
          console.warn('[get-pedidos] No se pudo consultar aprobado_magister:', aprobadosError.message);
          pedido.forEach((item) => {
            item.aprobado_magister = false;
          });
        }
      }
    }

    // El total viene en cada fila de la función SQL, extraerlo de la primera fila
    // Si no hay resultados, el total es 0
    // Si hay resultados pero total es undefined/null, usar el conteo de resultados como fallback
    let total = 0;
    if (pedido.length > 0) {
      // El campo total viene de la función SQL y está disponible en cada fila
      total = pedido[0].total !== undefined && pedido[0].total !== null ? pedido[0].total : pedido.length;
    }

    return {
      status: true,
      total: total,
      pedido
    }
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  } finally {
    client.release();
  }
};
