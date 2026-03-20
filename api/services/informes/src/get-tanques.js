const moment = require('moment');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const { getExportFormat, buildInformeResponse } = require('../../../lib/informe-response.js');
const GET_TANQUES = `
  WITH tanques_json AS (
    SELECT
      t.*,
      to_jsonb(t) AS j
    FROM tanques t
  )
  SELECT
    t._id,
    t.activo,
    t.eliminado,
    COALESCE(
      t.j->>'placatext',
      t.j->>'placaText',
      t.j->>'nplaca',
      t.j->>'nPlaca',
      t.j->>'n_placa'
    ) AS placatext,
    COALESCE(t.j->>'capacidad', '') AS capacidad,
    COALESCE(t.j->>'fabricante', '') AS fabricante,
    COALESCE(t.j->>'anofabricacion', t.j->>'anoFabricacion', t.j->>'ano_fabricacion', '') AS anofabricacion,
    COALESCE(t.j->>'serie', '') AS serie,
    COALESCE(t.j->>'fechaultimarev', t.j->>'fechaUltimaRev', t.j->>'fecha_ultima_rev', '') AS fechaultimarev,
    COALESCE(t.j->>'existetanque', t.j->>'existeTanque', t.j->>'existe_tanque', '') AS existetanque,
    COALESCE(t.j->>'propiedad', '') AS propiedad,
    COALESCE(t.j->>'registroonac', t.j->>'registroOnac', t.j->>'registro_onac', '') AS registroonac,
    COALESCE(
      t.j->>'codigo_activo',
      t.j->>'codigoActivo',
      t.j->>'codigoactivo',
      ''
    ) AS codigo_activo,
    COALESCE(u_tanque.razon_social, u_punto.razon_social, '') AS razon_social,
    p.direccion AS punto_suministro
  FROM tanques_json t
  LEFT JOIN puntos p
    ON p._id = COALESCE(
      NULLIF(t.j->>'puntoid', '')::int,
      NULLIF(t.j->>'puntoId', '')::int,
      NULLIF(t.j->>'punto_id', '')::int
    )
  LEFT JOIN users u_tanque
    ON u_tanque._id = COALESCE(
      NULLIF(t.j->>'usuarioid', '')::int,
      NULLIF(t.j->>'usuarioId', '')::int,
      NULLIF(t.j->>'usuario_id', '')::int
    )
  LEFT JOIN users u_punto ON u_punto._id = p.idcliente
  WHERE COALESCE(t.eliminado, false) = false
    AND t.creado >= $1::timestamp
    AND t.creado < ($2::timestamp + INTERVAL '1 day')
  ORDER BY t._id ASC
`;

/** get cars
 *  get cars active in the table
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = () => {
  return [
    { label: 'ID', value: 'id' },
    { label: 'Estado', value: 'estado' },
    { label: 'Placa TK', value: 'placa_tk' },
    { label: 'Activo TK', value: 'activo_tk' },
    { label: 'Capacidad', value: 'capacidad' },
    { label: 'Fabricante', value: 'fabricante' },
    { label: 'Año Fabricación', value: 'ano_fabricacion' },
    { label: 'N° Serie', value: 'serie' },
    { label: 'Última Revisión', value: 'ultima_revision' },
    { label: 'Próx. Revisión', value: 'proxima_revision' },
    { label: 'Ubicación', value: 'ubicacion' },
    { label: 'Propiedad', value: 'propiedad' },
    { label: 'Registro ONAC', value: 'registro_onac' },
    { label: 'Razón Social', value: 'razon_social' },
    { label: 'Dirección', value: 'punto_suministro' }
  ];
}

const sanitizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim();
};

const normalizeDate = (value) => {
  if (!value) return '';
  const parsed = moment(value, ['YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601], true);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '';
};

const getProximaRevision = (ultimaRevision) => {
  const parsed = moment(ultimaRevision, ['YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601], true);
  if (!parsed.isValid()) return '';
  return parsed.add(1, 'year').format('YYYY-MM-DD');
};

const buildTanquesRows = (rows) =>
  rows.map((row) => {
    const ultimaRevision = normalizeDate(row.fechaultimarev);
    return {
      id: row._id ?? '',
      estado: row.activo ? 'Activo' : 'Inactivo',
      placa_tk: sanitizeText(row.placatext),
      activo_tk: sanitizeText(row.codigo_activo),
      capacidad: sanitizeText(row.capacidad),
      fabricante: sanitizeText(row.fabricante),
      ano_fabricacion: sanitizeText(row.anofabricacion),
      serie: sanitizeText(row.serie),
      ultima_revision: ultimaRevision,
      proxima_revision: getProximaRevision(ultimaRevision),
      ubicacion: sanitizeText(row.existetanque),
      propiedad: sanitizeText(row.propiedad),
      registro_onac: sanitizeText(row.registroonac),
      razon_social: sanitizeText(row.razon_social),
      punto_suministro: sanitizeText(row.punto_suministro)
    };
  });

module.exports.main = async (event) => {
  const {
    end,
    start,
    nombre
  } = event.pathParameters;

  const fields = HandleFields()
  try {
    const client = await poolConection.connect();
    const { rows: tanques } = await client.query(GET_TANQUES, [start, end]);
    const data = buildTanquesRows(tanques);

    const format = getExportFormat(event);
    return buildInformeResponse({
      fields,
      data,
      format,
      filenameBase: `tanques-${fecha}-${nombre}`,
    });

    // return tanques

  } catch (error) {
    throw new DatabaseError(error);
  }
};