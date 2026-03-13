const moment = require('moment');
const {Parser}  = require('@json2csv/plainjs');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const GET_PEDIDOS = 'SELECT * FROM informe_get_pedidos($1, $2, $3)';
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
    COALESCE(padre_cli.razon_social, padre_cli.nombre, ua.nombre) AS comercial_id_despacho,
    COALESCE(abuelo_cli.razon_social, abuelo_cli.nombre, padre_cli.razon_social, padre_cli.nombre) AS vendedor_id_padre_id,
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
  LEFT JOIN users cli ON cli._id = p.usuarioid
  LEFT JOIN users uc ON uc._id = p.usuariocrea
  LEFT JOIN users ua ON ua._id = p.usuarioasigna
  LEFT JOIN users cond ON cond._id = p.conductorid
  LEFT JOIN users padre_cli ON padre_cli._id = cli.idpadre
  LEFT JOIN users abuelo_cli ON abuelo_cli._id = padre_cli.idpadre
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND p.creado >= $1::timestamp
    AND p.creado < ($2::timestamp + INTERVAL '1 day')
  ORDER BY p._id DESC
`;
const GET_NO_ENTREGADOS = `
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
    COALESCE(padre_cli.razon_social, padre_cli.nombre, ua.nombre) AS comercial_id_despacho,
    COALESCE(abuelo_cli.razon_social, abuelo_cli.nombre, padre_cli.razon_social, padre_cli.nombre) AS vendedor_id_padre,
    p.perfil_novedad AS perfil_novedad,
    p.motivo_no_cierre AS motivo_no_entrega,
    pt.observacion AS observacion_punto,
    p.observacion AS observaciones_pedido
  FROM pedidos p
  LEFT JOIN users cli ON cli._id = p.usuarioid
  LEFT JOIN users ua ON ua._id = p.usuarioasigna
  LEFT JOIN users cond ON cond._id = p.conductorid
  LEFT JOIN users padre_cli ON padre_cli._id = cli.idpadre
  LEFT JOIN users abuelo_cli ON abuelo_cli._id = padre_cli.idpadre
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND p.creado >= $1::timestamp
    AND p.creado < ($2::timestamp + INTERVAL '1 day')
    AND p.estado = 'noentregado'
  ORDER BY p._id DESC
`;
const GET_FACTURACION = `
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
    COALESCE(abuelo_cli.razon_social, abuelo_cli.nombre, padre_cli.razon_social, padre_cli.nombre) AS vendedor_id_padre,
    p.fechaentregado AS f_entregado,
    p.forma_pago AS forma_pago,
    p.kilos AS kilos,
    p.valorunitario AS valor_kg,
    p.valor_total AS valor_total,
    p.factura AS n_consecutivo_factura,
    p.remision AS remision,
    p.imagencerrar AS imagen_remision
  FROM pedidos p
  LEFT JOIN users cli ON cli._id = p.usuarioid
  LEFT JOIN users cond ON cond._id = p.conductorid
  LEFT JOIN users padre_cli ON padre_cli._id = cli.idpadre
  LEFT JOIN users abuelo_cli ON abuelo_cli._id = padre_cli.idpadre
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND p.creado >= $1::timestamp
    AND p.creado < ($2::timestamp + INTERVAL '1 day')
    AND p.estado = 'activo'
    AND p.entregado = true
  ORDER BY p._id DESC
`;
const GET_PROGRAMACION = `
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
    p.kilos AS cant_promedio_kg,
    pt.observacion AS observacion_punto,
    p.observacion AS observaciones_pedido
  FROM pedidos p
  LEFT JOIN users cli ON cli._id = p.usuarioid
  LEFT JOIN users cond ON cond._id = p.conductorid
  LEFT JOIN carros c ON c._id = p.carroid
  LEFT JOIN puntos pt ON pt._id = p.puntoid
  LEFT JOIN zonas z ON z._id = pt.idzona
  WHERE COALESCE(p.eliminado, false) = false
    AND p.creado >= $1::timestamp
    AND p.creado < ($2::timestamp + INTERVAL '1 day')
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
      { label: 'Punto suministro', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Vr Unitario', value: 'vr_unitario' },
      { label: 'Forma', value: 'forma' },
      { label: 'Solicita', value: 'solicita' },
      { label: 'Cant. Kilo', value: 'cant_kilo' },
      { label: 'Comercial - id despacho', value: 'comercial_id_despacho' },
      { label: 'Vendedor - Id Padre - Id', value: 'vendedor_id_padre_id' },
      { label: 'F. Entregado', value: 'f_entregado' },
      { label: 'Forma pago', value: 'forma_pago' },
      { label: 'Estado', value: 'estado' },
      { label: 'Kilos', value: 'kilos' },
      { label: 'Valor $/kg', value: 'valor_kg' },
      { label: 'Valor Total', value: 'valor_total' },
      { label: 'N° consecutivo / Factura', value: 'n_consecutivo_factura' },
      { label: 'Remisión', value: 'remision' },
      { label: 'Placa', value: 'placa_2' },
      { label: 'Conductor', value: 'conductor_2' },
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
      { label: 'Punto suministro', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Comercial - id despacho', value: 'comercial_id_despacho' },
      { label: 'Vendedor - Id Padre', value: 'vendedor_id_padre' },
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
      { label: 'Punto suministro', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Vendedor - Id Padre', value: 'vendedor_id_padre' },
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
      { label: 'Punto suministro', value: 'punto_suministro' },
      { label: 'Zona', value: 'zona' },
      { label: 'Vr Unitario', value: 'vr_unitario' },
      { label: 'Forma', value: 'forma' },
      { label: 'Cant. Solicitada', value: 'cant_solicitada' },
      { label: 'Cant. Promedio Kg', value: 'cant_promedio_kg' },
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
      label: 'Punto Consumo',
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
    placa_2: sanitizeText(row.placa),
    conductor_2: sanitizeText(row.conductor),
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
    cant_promedio_kg: row.cant_promedio_kg ?? '',
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

  const fields = HandleFields(type)
  try {
    const client = await poolConection.connect();
    const { rows: users } = type === 'all'
      ? await client.query(GET_TRAZABILIDAD, [start, end])
      : type === 'noentregado'
        ? await client.query(GET_NO_ENTREGADOS, [start, end])
        : type === 'entregado'
          ? await client.query(GET_FACTURACION, [start, end])
        : type === 'programacion'
          ? await client.query(GET_PROGRAMACION, [start, end])
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

    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(data);

 
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Pedidos-${fecha}-${type}-${nombre}.csv"`
      },
      body: csv
    };

    return response;

    // return users

  } catch (error) {
    throw new DatabaseError(error);
  }
};