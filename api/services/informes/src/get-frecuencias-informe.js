const moment = require('moment');
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const {
  getExportFormat,
  buildMultiSheetXlsxResponse,
  buildTwoBlockCsv,
} = require('../../../lib/informe-response.js');

/** Pedidos con frecuencia individual y/o asignados a grupo (sin filtro de fechas). */
const GET_PEDIDOS_FRECUENCIA = `
  SELECT
    p._id AS id_pedido,
    TRIM(COALESCE(p.frecuencia, '')) AS frecuencia,
    p.dia1,
    p.dia2,
    p.forma,
    p.fechasolicitud,
    p.fechaentrega,
    p.creado,
    u.codt,
    u.razon_social,
    COALESCE(u.nombre, '') AS nombre_cliente,
    p.grupo_id,
    g.nombre AS grupo_nombre,
    g.tipo_frecuencia AS grupo_tipo_frecuencia,
    g.dia_semana AS grupo_dia_semana,
    g.intervalo_semanas AS grupo_intervalo_semanas,
    pt.direccion AS direccion
  FROM pedidos p
  JOIN users u ON u._id = p.usuarioid
  LEFT JOIN grupos_frecuencias g ON g._id = p.grupo_id AND COALESCE(g.eliminado, false) = false
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  WHERE COALESCE(p.eliminado, false) = false
    AND (
      (p.frecuencia IS NOT NULL AND TRIM(p.frecuencia) <> '')
      OR p.grupo_id IS NOT NULL
    )
  ORDER BY p._id DESC
`;

const GET_GRUPOS_RESUMEN = `
  SELECT
    g._id AS id_grupo,
    g.nombre AS nombre_grupo,
    g.tipo_frecuencia,
    g.dia_semana,
    g.intervalo_semanas,
    g.dia_mes,
    g.dia_semana_mensual,
    g.creado,
    COUNT(p._id)::INTEGER AS total_pedidos
  FROM grupos_frecuencias g
  LEFT JOIN pedidos p ON p.grupo_id = g._id AND COALESCE(p.eliminado, false) = false
  WHERE COALESCE(g.eliminado, false) = false
  GROUP BY g._id, g.nombre, g.tipo_frecuencia, g.dia_semana, g.intervalo_semanas,
           g.dia_mes, g.dia_semana_mensual, g.creado
  ORDER BY g.nombre ASC
`;

let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const FIELDS_PEDIDOS = [
  { label: 'ID Pedido', value: 'id_pedido' },
  { label: 'Frecuencia', value: 'frecuencia' },
  { label: 'Dia1', value: 'dia1' },
  { label: 'Dia2', value: 'dia2' },
  { label: 'Forma', value: 'forma' },
  { label: 'F. Solicitud', value: 'f_solicitud' },
  { label: 'F. Entrega', value: 'f_entrega' },
  { label: 'CODT', value: 'codt' },
  { label: 'Razón Social', value: 'razon_social' },
  { label: 'Nombre Cliente', value: 'nombre_cliente' },
  { label: 'Dirección', value: 'direccion' },
  { label: 'ID Grupo', value: 'grupo_id' },
  { label: 'Nombre Grupo', value: 'grupo_nombre' },
  { label: 'Tipo frec. grupo', value: 'grupo_tipo_frecuencia' },
  { label: 'Grupo día semana', value: 'grupo_dia_semana' },
  { label: 'Grupo intervalo sem.', value: 'grupo_intervalo_semanas' },
];

const FIELDS_GRUPOS = [
  { label: 'ID Grupo', value: 'id_grupo' },
  { label: 'Nombre Grupo', value: 'nombre_grupo' },
  { label: 'Tipo frecuencia', value: 'tipo_frecuencia' },
  { label: 'Día semana', value: 'dia_semana' },
  { label: 'Intervalo semanas', value: 'intervalo_semanas' },
  { label: 'Día mes', value: 'dia_mes' },
  { label: 'Día semana mensual', value: 'dia_semana_mensual' },
  { label: 'Creado', value: 'creado' },
  { label: 'Total pedidos', value: 'total_pedidos' },
];

const sanitizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim();
};

const formatDt = (value) => {
  if (!value) return '';
  const d = moment(value);
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : sanitizeText(value);
};

const buildPedidosRows = (rows) =>
  rows.map((row) => ({
    id_pedido: row.id_pedido ?? '',
    frecuencia: sanitizeText(row.frecuencia),
    dia1: row.dia1 ?? '',
    dia2: row.dia2 ?? '',
    forma: sanitizeText(row.forma),
    f_solicitud: formatDt(row.fechasolicitud),
    f_entrega: formatDt(row.fechaentrega),
    codt: sanitizeText(row.codt),
    razon_social: sanitizeText(row.razon_social),
    nombre_cliente: sanitizeText(row.nombre_cliente),
    direccion: sanitizeText(row.direccion),
    grupo_id: row.grupo_id ?? '',
    grupo_nombre: sanitizeText(row.grupo_nombre),
    grupo_tipo_frecuencia: sanitizeText(row.grupo_tipo_frecuencia),
    grupo_dia_semana: row.grupo_dia_semana ?? '',
    grupo_intervalo_semanas: row.grupo_intervalo_semanas ?? '',
  }));

const buildGruposRows = (rows) =>
  rows.map((row) => ({
    id_grupo: row.id_grupo ?? '',
    nombre_grupo: sanitizeText(row.nombre_grupo),
    tipo_frecuencia: sanitizeText(row.tipo_frecuencia),
    dia_semana: row.dia_semana ?? '',
    intervalo_semanas: row.intervalo_semanas ?? '',
    dia_mes: row.dia_mes ?? '',
    dia_semana_mensual: row.dia_semana_mensual ?? '',
    creado: formatDt(row.creado),
    total_pedidos: row.total_pedidos ?? 0,
  }));

module.exports.main = async (event) => {
  const { nombre } = event.pathParameters || {};
  const format = getExportFormat(event);
  const filenameBase = `Frecuencias-${fecha}-${nombre || 'export'}`;

  let client;
  try {
    client = await poolConection.connect();
    const [{ rows: pedidosRows }, { rows: gruposRows }] = await Promise.all([
      client.query(GET_PEDIDOS_FRECUENCIA),
      client.query(GET_GRUPOS_RESUMEN),
    ]);

    const dataPedidos = buildPedidosRows(pedidosRows);
    const dataGrupos = buildGruposRows(gruposRows);

    if (format === 'xlsx') {
      return buildMultiSheetXlsxResponse({
        filenameBase,
        sheets: [
          { name: 'Pedidos frecuencia', fields: FIELDS_PEDIDOS, data: dataPedidos },
          { name: 'Grupos', fields: FIELDS_GRUPOS, data: dataGrupos },
        ],
      });
    }

    return buildTwoBlockCsv({
      filenameBase,
      titleA: 'PEDIDOS CON FRECUENCIA (individual y/o grupo)',
      titleB: 'GRUPOS DE FRECUENCIAS',
      fieldsA: FIELDS_PEDIDOS,
      dataA: dataPedidos,
      fieldsB: FIELDS_GRUPOS,
      dataB: dataGrupos,
    });
  } catch (error) {
    throw new DatabaseError(error);
  } finally {
    if (client) client.release();
  }
};
