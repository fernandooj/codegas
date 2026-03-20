const moment = require('moment');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const { getExportFormat, buildInformeResponse } = require('../../../lib/informe-response.js');
const GET_REVISIONES = `
  WITH revisiones_json AS (
    SELECT
      r.*,
      to_jsonb(r) AS j
    FROM revisiones r
  )
  SELECT
    r._id,
    r.creado,
    COALESCE(r.j->>'solicitudservicio', r.j->>'solicitudServicio', '') AS tipo_revision,
    COALESCE(r.j->>'deptecnicotext', r.j->>'depTecnicoText', u_crea.nombre, '') AS tecnico,
    COALESCE(
      NULLIF(r.j->>'deptecnicoestado', '')::boolean,
      NULLIF(r.j->>'depTecnicoEstado', '')::boolean,
      false
    ) AS deptecnicoestado,
    COALESCE(r.j->>'observaciones', '') AS observaciones,
    COALESCE(placas.placa_tk, '') AS placa_tk
  FROM revisiones_json r
  LEFT JOIN users u_crea ON u_crea._id = COALESCE(
    NULLIF(r.j->>'usuariocrea', '')::int,
    NULLIF(r.j->>'usuarioCrea', '')::int,
    NULLIF(r.j->>'usuario_crea', '')::int
  )
  LEFT JOIN LATERAL (
    SELECT string_agg(DISTINCT COALESCE(t.j->>'placatext', t.j->>'placaText', t.j->>'nplaca', t.j->>'nPlaca', t.j->>'n_placa', ''), ' | ') AS placa_tk
    FROM (
      SELECT
        tk.*,
        to_jsonb(tk) AS j
      FROM tanques tk
      WHERE tk._id IN (
        SELECT value::int
        FROM jsonb_array_elements_text(
          COALESCE(r.j->'tanqueid', r.j->'tanqueId', r.j->'tanque_id', '[]'::jsonb)
        )
      )
    ) t
  ) placas ON true
  WHERE COALESCE(r.eliminado, false) = false
    AND r.creado >= $1::timestamp
    AND r.creado < ($2::timestamp + INTERVAL '1 day')
  ORDER BY r._id ASC
`;

/** get cars
 *  get cars active in the table
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = () => ([
  { label: 'ID', value: 'id' },
  { label: 'Placa TK', value: 'placa_tk' },
  { label: 'Tipo Revisión', value: 'tipo_revision' },
  { label: 'Fecha', value: 'fecha' },
  { label: 'Técnico', value: 'tecnico' },
  { label: 'Resultado', value: 'resultado' },
  { label: 'Próxima Rev.', value: 'proxima_revision' },
  { label: 'Observaciones', value: 'observaciones' }
]);

const sanitizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim();
};

const normalizeDate = (value) => {
  if (!value) return '';
  const d = moment(value);
  return d.isValid() ? d.format('YYYY-MM-DD') : '';
};

const buildRevisionesRows = (rows) =>
  rows.map((row) => {
    const fecha = normalizeDate(row.creado);
    const proxima = fecha ? moment(fecha).add(1, 'year').format('YYYY-MM-DD') : '';
    return {
      id: row._id ?? '',
      placa_tk: sanitizeText(row.placa_tk),
      tipo_revision: sanitizeText(row.tipo_revision) || 'Revisión',
      fecha,
      tecnico: sanitizeText(row.tecnico),
      resultado: row.deptecnicoestado ? 'Aprobado' : 'Condicionado',
      proxima_revision: proxima,
      observaciones: sanitizeText(row.observaciones)
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
    const { rows: revisiones } = await client.query(GET_REVISIONES, [start, end]);
    const data = buildRevisionesRows(revisiones);

    const format = getExportFormat(event);
    return buildInformeResponse({
      fields,
      data,
      format,
      filenameBase: `Revision-${fecha}-${nombre}`,
    });

    // return tanques

  } catch (error) {
    throw new DatabaseError(error);
  }
};