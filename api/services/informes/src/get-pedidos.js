const moment = require('moment');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const { getExportFormat, buildInformeResponse } = require('../../../lib/informe-response.js');
const GET_PEDIDOS = 'SELECT * FROM informe_get_pedidos($1, $2, $3)';

/** Filtro de rango para No entregados, Facturación y Programación (query ?dateField=). */
function normalizePedidosDateField(raw) {
  const v = String(raw || '').toLowerCase().trim();
  return v === 'fechaentrega' ? 'fechaentrega' : 'creado';
}

function pedidosDateRangeSql(field) {
  if (field === 'fechaentrega') {
    return `p.fechaentrega IS NOT NULL
    AND p.fechaentrega::timestamp >= $1::timestamp
    AND p.fechaentrega::timestamp < ($2::timestamp + INTERVAL '1 day')`;
  }
  return `p.creado >= $1::timestamp
    AND p.creado < ($2::timestamp + INTERVAL '1 day')`;
}

/**
 * Cliente: usuarioid del pedido; si no, idcliente del punto.
 * Vendedor: users.idpadre del cliente → mostrar nombre (no razon_social).
 * Comercial: users.idpadre del vendedor → mostrar nombre.
 * Tabla explícita public.users (search_path / vistas).
 */
const GET_TRAZABILIDAD = `
  SELECT
    p._id AS id_pedido,
    p.creado AS f_creo_hora,
    uc.nombre AS creado_por,
    p.fechasolicitud AS f_solicitud,
    p.fechaentrega AS f_entrega,
    c.placa AS placa,
    cond.nombre AS conductor,
    cli.codt AS ct,
    cli.cedula AS cedula_nit,
    cli.razon_social AS razon_social,
    pt.direccion AS punto_suministro,
    z.nombre AS zona,
    cli.valorunitario AS vr_unitario,
    p.forma AS forma,
    ua.nombre AS solicita,
    p.cantidadkl AS cant_kilo,
    TRIM(BOTH FROM COALESCE(u_comercial.nombre, '')) AS comercial_id_despacho,
    TRIM(BOTH FROM COALESCE(u_vendedor.nombre, '')) AS vendedor_id_padre_id,
    p.fechaentregado AS f_entregado,
    p.forma_pago AS forma_pago,
    p.estado AS estado,
    p.kilos AS kilos,
    p.valorunitario AS valor_kg,
    p.valor_total AS valor_total,
    p.factura AS n_consecutivo_factura,
    p.remision AS remision,
    p.perfil_novedad AS perfil_novedad,
    p.motivo_no_cierre AS motivo_no_entrega,
    pt.observacion AS observacion_punto,
    p.observacion AS observaciones_pedido,
    p.imagencerrar AS imagen_remision
  FROM pedidos p
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN public.users cli ON cli._id = COALESCE(NULLIF(p.usuarioid, 0), NULLIF(pt.idcliente, 0))
  LEFT JOIN public.users uc ON uc._id = p.usuariocrea
  LEFT JOIN public.users ua ON ua._id = p.usuarioasigna
  LEFT JOIN public.users cond ON cond._id = p.conductorid
  LEFT JOIN public.users u_vendedor ON u_vendedor._id = cli.idpadre
  LEFT JOIN public.users u_comercial ON u_comercial._id = u_vendedor.idpadre
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND p.creado >= $1::timestamp
    AND p.creado < ($2::timestamp + INTERVAL '1 day')
  ORDER BY p._id DESC
`;
const buildGetNoEntregados = (dateField) => `
  SELECT
    p._id AS id_pedido,
    p.fechasolicitud AS f_solicitud,
    p.fechaentrega AS f_no_entrega,
    c.placa AS placa,
    cond.nombre AS conductor,
    cli.codt AS codt,
    cli.cedula AS cedula_nit,
    cli.razon_social AS razon_social,
    pt.direccion AS punto_suministro,
    z.nombre AS zona,
    TRIM(BOTH FROM COALESCE(u_comercial.nombre, '')) AS comercial_id_despacho,
    TRIM(BOTH FROM COALESCE(u_vendedor.nombre, '')) AS vendedor_id_padre,
    p.perfil_novedad AS perfil_novedad,
    p.motivo_no_cierre AS motivo_no_entrega,
    pt.observacion AS observacion_punto,
    p.observacion AS observaciones_pedido
  FROM pedidos p
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN public.users cli ON cli._id = COALESCE(NULLIF(p.usuarioid, 0), NULLIF(pt.idcliente, 0))
  LEFT JOIN public.users ua ON ua._id = p.usuarioasigna
  LEFT JOIN public.users cond ON cond._id = p.conductorid
  LEFT JOIN public.users u_vendedor ON u_vendedor._id = cli.idpadre
  LEFT JOIN public.users u_comercial ON u_comercial._id = u_vendedor.idpadre
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND ${pedidosDateRangeSql(dateField)}
    AND p.estado = 'noentregado'
  ORDER BY p._id DESC
`;
const buildGetFacturacion = (dateField) => `
  SELECT
    p._id AS id_pedido,
    p.creado AS f_creo_hora,
    p.fechasolicitud AS f_solicitud,
    p.fechaentrega AS f_entrega,
    c.placa AS placa,
    cond.nombre AS conductor,
    cli.codt AS codt,
    cli.cedula AS cedula_nit,
    cli.razon_social AS razon_social,
    pt.direccion AS punto_suministro,
    z.nombre AS zona,
    TRIM(BOTH FROM COALESCE(u_vendedor.nombre, '')) AS vendedor_id_padre,
    p.fechaentregado AS f_entregado,
    p.forma_pago AS forma_pago,
    p.kilos AS kilos,
    p.valorunitario AS valor_kg,
    p.valor_total AS valor_total,
    p.factura AS n_consecutivo_factura,
    p.remision AS remision,
    p.imagencerrar AS imagen_remision
  FROM pedidos p
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN public.users cli ON cli._id = COALESCE(NULLIF(p.usuarioid, 0), NULLIF(pt.idcliente, 0))
  LEFT JOIN public.users cond ON cond._id = p.conductorid
  LEFT JOIN public.users u_vendedor ON u_vendedor._id = cli.idpadre
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND ${pedidosDateRangeSql(dateField)}
    AND p.estado = 'activo'
    AND p.entregado = true
  ORDER BY p._id DESC
`;
/**
 * Cant. promedio kg: cantidadkl del pedido; si no, kilos del pedido si es numérico;
 * si no, promedio de entregas previas del mismo punto de suministro (puntoid);
 * si no hay historial en ese punto, promedio del mismo cliente (usuarioid / idcliente).
 */
const buildGetProgramacion = (dateField) => `
  SELECT
    p._id AS id_pedido,
    p.fechasolicitud AS f_solicitud,
    p.fechaentrega AS f_entrega_programada,
    c.placa AS placa,
    cond.nombre AS conductor,
    cli.codt AS codt,
    cli.cedula AS cedula_nit,
    cli.razon_social AS razon_social,
    pt.direccion AS punto_suministro,
    z.nombre AS zona,
    cli.valorunitario AS vr_unitario,
    p.forma AS forma,
    p.cantidadkl AS cant_solicitada,
    COALESCE(
      CASE WHEN p.cantidadkl IS NOT NULL AND p.cantidadkl > 0 THEN p.cantidadkl::numeric END,
      CASE
        WHEN p.kilos IS NOT NULL AND TRIM(p.kilos) != '' AND p.kilos ~ '^[0-9]+\\.?[0-9]*$'
        THEN TRIM(p.kilos)::numeric
      END,
      (
        SELECT AVG(
          CASE
            WHEN ph.kilos IS NOT NULL AND TRIM(ph.kilos) != '' AND ph.kilos ~ '^[0-9]+\\.?[0-9]*$'
            THEN TRIM(ph.kilos)::numeric
          END
        )
        FROM pedidos ph
        WHERE p.puntoid IS NOT NULL
          AND ph.puntoid = p.puntoid
          AND ph._id <> p._id
          AND COALESCE(ph.eliminado, false) = false
          AND ph.entregado = true
          AND ph.estado = 'activo'
          AND ph.fechaentregado IS NOT NULL
      ),
      (
        SELECT AVG(
          CASE
            WHEN ph.kilos IS NOT NULL AND TRIM(ph.kilos) != '' AND ph.kilos ~ '^[0-9]+\\.?[0-9]*$'
            THEN TRIM(ph.kilos)::numeric
          END
        )
        FROM pedidos ph
        WHERE ph.usuarioid = COALESCE(NULLIF(p.usuarioid, 0), NULLIF(pt.idcliente, 0))
          AND ph._id <> p._id
          AND COALESCE(ph.eliminado, false) = false
          AND ph.entregado = true
          AND ph.estado = 'activo'
          AND ph.fechaentregado IS NOT NULL
      )
    ) AS cant_promedio_kg,
    TRIM(BOTH FROM COALESCE(u_comercial.nombre, '')) AS comercial_id_despacho,
    pt.observacion AS observacion_punto,
    p.observacion AS observaciones_pedido
  FROM pedidos p
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN public.users cli ON cli._id = COALESCE(NULLIF(p.usuarioid, 0), NULLIF(pt.idcliente, 0))
  LEFT JOIN public.users u_vendedor ON u_vendedor._id = cli.idpadre
  LEFT JOIN public.users u_comercial ON u_comercial._id = u_vendedor.idpadre
  LEFT JOIN public.users cond ON cond._id = p.conductorid
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND ${pedidosDateRangeSql(dateField)}
    AND p.estado = 'activo'
    AND COALESCE(p.entregado, false) = false
    AND p.carroid IS NOT NULL
  ORDER BY p._id DESC
`;

/** get user
 *  save user active in the table
 * @param {string} uid - username user
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = (type) => {
  if (type === 'all') {
    return [
      { label: 'ID Pedido', value: 'id_pedido' },
      { label: 'F. Creó Hora', value: 'f_creo_hora' },
      { label: 'Creado por', value: 'creado_por' },
      { label: 'F. Solicitud', value: 'f_solicitud' },
      { label: 'F. Entrega', value: 'f_entrega' },
      { label: 'Placa', value: 'placa' },
      { label: 'Conductor', value: 'conductor' },
      { label: 'CT', value: 'ct' },
      { label: 'Cedula / Nit', value: 'cedula_nit' },
      { label: 'Razón Social', value: 'razon_social' },
      { label: 'Dirección', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Vr Unitario', value: 'vr_unitario' },
      { label: 'Forma', value: 'forma' },
      { label: 'Solicita', value: 'solicita' },
      { label: 'Cant. Kilo', value: 'cant_kilo' },
      { label: 'Comercial', value: 'comercial_id_despacho' },
      { label: 'Vendedor', value: 'vendedor_id_padre_id' },
      { label: 'F. Entregado', value: 'f_entregado' },
      { label: 'Forma pago', value: 'forma_pago' },
      { label: 'Estado', value: 'estado' },
      { label: 'Kilos', value: 'kilos' },
      { label: 'Valor $/kg', value: 'valor_kg' },
      { label: 'Valor Total', value: 'valor_total' },
      { label: 'N° consecutivo / Factura', value: 'n_consecutivo_factura' },
      { label: 'Remisión', value: 'remision' },
      { label: 'Perfil Novedad', value: 'perfil_novedad' },
      { label: 'Motivo No Entrega / motivo_no_cierre', value: 'motivo_no_entrega' },
      { label: 'Observación Punto', value: 'observacion_punto' },
      { label: 'Observaciones Pedido', value: 'observaciones_pedido' },
      { label: 'Imagen Remisión', value: 'imagen_remision' }
    ];
  }
  if (type === 'noentregado') {
    return [
      { label: 'ID Pedido', value: 'id_pedido' },
      { label: 'F. Solicitud', value: 'f_solicitud' },
      { label: 'F. No Entrega', value: 'f_no_entrega' },
      { label: 'Placa', value: 'placa' },
      { label: 'Conductor', value: 'conductor' },
      { label: 'CODT', value: 'codt' },
      { label: 'Cedula / Nit', value: 'cedula_nit' },
      { label: 'Razón Social', value: 'razon_social' },
      { label: 'Dirección', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Comercial', value: 'comercial_id_despacho' },
      { label: 'Vendedor', value: 'vendedor_id_padre' },
      { label: 'Perfil Novedad', value: 'perfil_novedad' },
      { label: 'Motivo No Entrega / motivo_no_cierre', value: 'motivo_no_entrega' },
      { label: 'Observación Punto', value: 'observacion_punto' },
      { label: 'Observaciones Pedido', value: 'observaciones_pedido' }
    ];
  }
  if (type === 'entregado') {
    return [
      { label: 'ID Pedido', value: 'id_pedido' },
      { label: 'F. Creó Hora', value: 'f_creo_hora' },
      { label: 'F. Solicitud', value: 'f_solicitud' },
      { label: 'F. Entrega', value: 'f_entrega' },
      { label: 'Placa', value: 'placa' },
      { label: 'Conductor', value: 'conductor' },
      { label: 'CODT', value: 'codt' },
      { label: 'Cedula / Nit', value: 'cedula_nit' },
      { label: 'Razón Social', value: 'razon_social' },
      { label: 'Dirección', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Vendedor', value: 'vendedor_id_padre' },
      { label: 'F. Entregado', value: 'f_entregado' },
      { label: 'Forma pago', value: 'forma_pago' },
      { label: 'Kilos', value: 'kilos' },
      { label: 'Valor $/kg', value: 'valor_kg' },
      { label: 'Valor Total', value: 'valor_total' },
      { label: 'N° consecutivo / Factura', value: 'n_consecutivo_factura' },
      { label: 'Remisión', value: 'remision' },
      { label: 'Imagen Remisión', value: 'imagen_remision' }
    ];
  }
  if (type === 'programacion') {
    return [
      { label: 'ID Pedido', value: 'id_pedido' },
      { label: 'F. Solicitud', value: 'f_solicitud' },
      { label: 'F. Entrega prog.', value: 'f_entrega_programada' },
      { label: 'Placa', value: 'placa' },
      { label: 'Conductor', value: 'conductor' },
      { label: 'CODT', value: 'codt' },
      { label: 'Cedula / Nit', value: 'cedula_nit' },
      { label: 'Razón Social', value: 'razon_social' },
      { label: 'Dirección', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Vr Unitario', value: 'vr_unitario' },
      { label: 'Forma', value: 'forma' },
      { label: 'Cant. Solicitada', value: 'cant_solicitada' },
      { label: 'Cant. Promedio Kg', value: 'cant_promedio_kg' },
      { label: 'Comercial', value: 'comercial_id_despacho' },
      { label: 'Observación Punto', value: 'observacion_punto' },
      { label: 'Observaciones Pedido', value: 'observaciones_pedido' }
    ];
  }

  const fields = [{   
      label: 'N Pedido',
      value: '_id'
  },{
      label: 'CODT',
      value: 'codt'
  },{
      label: 'Cedula ',
      value: 'cedula'
  },{
      label: 'Razon Social',
      value: 'razon_social'
  },{
      label: 'Dirección',
      value: 'direccion'
  },{
      label: 'N. Factura',  
      value: 'factura'
  },{
      label: 'Fecha asignación',
      value: 'fechaentrega'
  },{
      label: 'Vehiculo asignado',  
      value: 'placa'
  },{
      label: 'Conductor asignado',
      value: 'conductor'
  }];
  if(type==="noentregado"){
    fields.push(
      {
        label: 'Motivo no entrega', //todo
        value: 'motivo_no_cierre' //todo
      },{
        label: 'Imagen de cierre',
        value: 'imagencerrar'
      }
    )
  }

  return fields
}

const sanitizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim();
};

const formatDateTime = (value) => {
  if (!value) return '';
  const d = moment(value);
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : sanitizeText(value);
};

const buildTrazabilidadRows = (rows) =>
  rows.map((row) => ({
    id_pedido: row.id_pedido ?? '',
    f_creo_hora: formatDateTime(row.f_creo_hora),
    creado_por: sanitizeText(row.creado_por),
    f_solicitud: formatDateTime(row.f_solicitud),
    f_entrega: formatDateTime(row.f_entrega),
    placa: sanitizeText(row.placa),
    conductor: sanitizeText(row.conductor),
    ct: sanitizeText(row.ct),
    cedula_nit: sanitizeText(row.cedula_nit),
    razon_social: sanitizeText(row.razon_social),
    punto_suministro: sanitizeText(row.punto_suministro),
    zona: sanitizeText(row.zona),
    vr_unitario: row.vr_unitario ?? '',
    forma: sanitizeText(row.forma),
    solicita: sanitizeText(row.solicita),
    cant_kilo: row.cant_kilo ?? '',
    comercial_id_despacho: sanitizeText(row.comercial_id_despacho),
    vendedor_id_padre_id: sanitizeText(row.vendedor_id_padre_id),
    f_entregado: formatDateTime(row.f_entregado),
    forma_pago: sanitizeText(row.forma_pago),
    estado: sanitizeText(row.estado),
    kilos: row.kilos ?? '',
    valor_kg: row.valor_kg ?? '',
    valor_total: row.valor_total ?? '',
    n_consecutivo_factura: sanitizeText(row.n_consecutivo_factura),
    remision: sanitizeText(row.remision),
    perfil_novedad: sanitizeText(row.perfil_novedad),
    motivo_no_entrega: sanitizeText(row.motivo_no_entrega),
    observacion_punto: sanitizeText(row.observacion_punto),
    observaciones_pedido: sanitizeText(row.observaciones_pedido),
    imagen_remision: sanitizeText(row.imagen_remision)
  }));

const buildNoEntregadosRows = (rows) =>
  rows.map((row) => ({
    id_pedido: row.id_pedido ?? '',
    f_solicitud: formatDateTime(row.f_solicitud),
    f_no_entrega: formatDateTime(row.f_no_entrega),
    placa: sanitizeText(row.placa),
    conductor: sanitizeText(row.conductor),
    codt: sanitizeText(row.codt),
    cedula_nit: sanitizeText(row.cedula_nit),
    razon_social: sanitizeText(row.razon_social),
    punto_suministro: sanitizeText(row.punto_suministro),
    zona: sanitizeText(row.zona),
    comercial_id_despacho: sanitizeText(row.comercial_id_despacho),
    vendedor_id_padre: sanitizeText(row.vendedor_id_padre),
    perfil_novedad: sanitizeText(row.perfil_novedad),
    motivo_no_entrega: sanitizeText(row.motivo_no_entrega),
    observacion_punto: sanitizeText(row.observacion_punto),
    observaciones_pedido: sanitizeText(row.observaciones_pedido)
  }));

const buildFacturacionRows = (rows) =>
  rows.map((row) => ({
    id_pedido: row.id_pedido ?? '',
    f_creo_hora: formatDateTime(row.f_creo_hora),
    f_solicitud: formatDateTime(row.f_solicitud),
    f_entrega: formatDateTime(row.f_entrega),
    placa: sanitizeText(row.placa),
    conductor: sanitizeText(row.conductor),
    codt: sanitizeText(row.codt),
    cedula_nit: sanitizeText(row.cedula_nit),
    razon_social: sanitizeText(row.razon_social),
    punto_suministro: sanitizeText(row.punto_suministro),
    zona: sanitizeText(row.zona),
    vendedor_id_padre: sanitizeText(row.vendedor_id_padre),
    f_entregado: formatDateTime(row.f_entregado),
    forma_pago: sanitizeText(row.forma_pago),
    kilos: row.kilos ?? '',
    valor_kg: row.valor_kg ?? '',
    valor_total: row.valor_total ?? '',
    n_consecutivo_factura: sanitizeText(row.n_consecutivo_factura),
    remision: sanitizeText(row.remision),
    imagen_remision: sanitizeText(row.imagen_remision)
  }));

const buildProgramacionRows = (rows) =>
  rows.map((row) => ({
    id_pedido: row.id_pedido ?? '',
    f_solicitud: formatDateTime(row.f_solicitud),
    f_entrega_programada: formatDateTime(row.f_entrega_programada),
    placa: sanitizeText(row.placa),
    conductor: sanitizeText(row.conductor),
    codt: sanitizeText(row.codt),
    cedula_nit: sanitizeText(row.cedula_nit),
    razon_social: sanitizeText(row.razon_social),
    punto_suministro: sanitizeText(row.punto_suministro),
    zona: sanitizeText(row.zona),
    vr_unitario: row.vr_unitario ?? '',
    forma: sanitizeText(row.forma),
    cant_solicitada: row.cant_solicitada ?? '',
    cant_promedio_kg: (() => {
      const k = row.cant_promedio_kg;
      if (k === null || k === undefined || k === '') return '';
      const n = Number(k);
      return Number.isFinite(n) ? String(n) : sanitizeText(k);
    })(),
    comercial_id_despacho: sanitizeText(row.comercial_id_despacho),
    observacion_punto: sanitizeText(row.observacion_punto),
    observaciones_pedido: sanitizeText(row.observaciones_pedido)
  }));

module.exports.main = async (event) => {
  const {
    end,
    start,
    type,
    nombre
  } = event.pathParameters;

  const q = event.queryStringParameters || {};
  const pedidosDateField = normalizePedidosDateField(q.dateField);

  const fields = HandleFields(type)
  try {
    const client = await poolConection.connect();
    const { rows: users } = type === 'all'
      ? await client.query(GET_TRAZABILIDAD, [start, end])
      : type === 'noentregado'
        ? await client.query(buildGetNoEntregados(pedidosDateField), [start, end])
        : type === 'entregado'
          ? await client.query(buildGetFacturacion(pedidosDateField), [start, end])
        : type === 'programacion'
          ? await client.query(buildGetProgramacion(pedidosDateField), [start, end])
        : await client.query(GET_PEDIDOS, [start, end, type]);
    const data = type === 'all'
      ? buildTrazabilidadRows(users)
      : type === 'noentregado'
        ? buildNoEntregadosRows(users)
        : type === 'entregado'
          ? buildFacturacionRows(users)
        : type === 'programacion'
          ? buildProgramacionRows(users)
        : users;

    const format = getExportFormat(event);
    return buildInformeResponse({
      fields,
      data,
      format,
      filenameBase: `Pedidos-${fecha}-${type}-${nombre}`,
    });

    // return users

  } catch (error) {
    throw new DatabaseError(error);
  }
};