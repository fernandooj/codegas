const moment = require('moment');
const { Parser } = require('@json2csv/plainjs');
const { poolConection } = require('../../../lib/connection-pg.js')
const DatabaseError = require('../../../lib/errors/database-error')
const GET_USERS = 'SELECT * FROM informe_get_users($1, $2, $3)';
const GET_CONDUCTOR_PLACAS = `
  SELECT
    c.conductor,
    string_agg(c.placa::text, ' | ' ORDER BY c.placa) AS placa_asignada
  FROM carros c
  WHERE c.conductor IS NOT NULL
    AND COALESCE(c.eliminado, false) = false
    AND COALESCE(c.activo, true) = true
  GROUP BY c.conductor
`;
const GET_CLIENTES_WITH_PUNTOS = `
  SELECT
    u._id AS id_use,
    u.activo,
    u.eliminado,
    u.codt,
    u.cedula AS cedula_nit,
    u.razon_social,
    u.nombre AS nombre_comercial,
    u.celular AS telefono,
    u.email,
    u.tipo,
    up.cedula AS ced_veo_padre,
    u.valorunitario AS valor_kg,
    u.valor_unitario_2 AS valor_sig_kg,
    u.fecha_expiracion,
    p.punto AS punto_suministro,
    p.activo AS punto_activo,
    p.capacidad,
    p.email AS email_punto,
    p.celular AS celular_punto,
    p.nombre AS nombre_punto,
    z.nombre AS zona,
    p.coordenadas::text AS coordenadas
  FROM users u
  LEFT JOIN users up ON up._id = u.idpadre
  INNER JOIN puntos p ON p.idcliente = u._id
  LEFT JOIN zonas z ON z._id = p.idzona
  WHERE u.acceso = 'cliente'
    AND u.created >= $1::timestamp
    AND u.created < ($2::timestamp + INTERVAL '1 day')
  ORDER BY u._id DESC, p._id ASC
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
      {
        label: 'ID',
        value: 'id'
      },
      {
        label: 'Estado',
        value: 'estado'
      },
      {
        label: 'Cédula',
        value: 'cedula'
      },
      {
        label: 'Nombre',
        value: 'nombre'
      },
      {
        label: 'Correo',
        value: 'correo'
      },
      {
        label: 'Teléfono',
        value: 'telefono'
      },
      {
        label: 'Rol / Acceso',
        value: 'rol_acceso'
      },
      {
        label: 'Nombre IDPadre',
        value: 'nombre_idpadre'
      }
    ];
  }

  if (!type || type === 'conductores' || type === 'conductor') {
    return [
      {
        label: 'ID',
        value: 'id'
      },
      {
        label: 'Estado',
        value: 'estado'
      },
      {
        label: 'Cédula',
        value: 'cedula'
      },
      {
        label: 'Nombre',
        value: 'nombre'
      },
      {
        label: 'Correo',
        value: 'correo'
      },
      {
        label: 'Teléfono',
        value: 'telefono'
      },
      {
        label: 'Placa Asignada',
        value: 'placa_asignada'
      }
    ];
  }

  if (type === 'clientes') {
    return [
      { label: 'ID_use', value: 'id_use' },
      { label: 'Estado', value: 'estado' },
      { label: 'CODT', value: 'codt' },
      { label: 'Cedula / Nit', value: 'cedula_nit' },
      { label: 'Razón Social', value: 'razon_social' },
      { label: 'Nombre Comercial', value: 'nombre_comercial' },
      { label: 'Teléfono', value: 'telefono' },
      { label: 'Email', value: 'email' },
      { label: 'Tipo', value: 'tipo' },
      { label: 'Ced. Veo/Padre', value: 'ced_veo_padre' },
      { label: 'Valor $/Kg', value: 'valor_kg' },
      { label: 'Valor Sig/Kg', value: 'valor_sig_kg' },
      { label: 'Expiración', value: 'fecha_expiracion' },
      { label: 'Punto Suministro', value: 'punto_suministro' },
      { label: 'Estado Punto', value: 'estado_punto' },
      { label: 'Capacidad', value: 'capacidad' },
      { label: 'Email - Punto', value: 'email_punto' },
      { label: 'Celular - Punto', value: 'celular_punto' },
      { label: 'Nombre - Punto', value: 'nombre_punto' },
      { label: 'Zona', value: 'zona' },
      { label: 'Coordenadas', value: 'coordenadas' }
    ];
  }

  const fields = [
    {
      label: 'Id',
      value: '_id'
    },
    {
      label: 'Correo',
      value: 'email'
    },
    {
      label: 'Cedula',
      value: 'cedula'
    },
    {
      label: 'Nombre',
      value: 'nombre'
    },
    {
      label: 'Telefono',
      value: 'celular'
    },
    {
      label: 'Creación',
      value: 'created'
    },
    {
      label: 'Veo/Padre',
      value: 'nombrepadre'
    },
    {
      label: 'Ced. Veo/Padre',
      value: 'cedulapadre'
    },
    {
      label: 'Acceso',
      value: 'acceso'
    }
  ];

  return fields
}

const sanitizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim();
};

const normalizeRolAcceso = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[{}]/g, '')
    .replace(/[\r\n]+/g, ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join(' | ');
};

const getEstado = (row) => {
  if (row.eliminado) return 'Inactivo';
  return row.activo ? 'Activo' : 'Inactivo';
};

const buildConductoresRows = (rows, placasByConductor) =>
  rows.map((row) => ({
    id: row._id ?? '',
    estado: getEstado(row),
    cedula: sanitizeText(row.cedula),
    nombre: sanitizeText(row.nombre || row.razon_social),
    correo: sanitizeText(row.email),
    telefono: sanitizeText(row.celular),
    placa_asignada: sanitizeText(placasByConductor.get(row._id) || '')
  }));

const buildAllUsersRows = (rows) =>
  rows.map((row) => ({
    id: row._id ?? '',
    estado: getEstado(row),
    cedula: sanitizeText(row.cedula),
    nombre: sanitizeText(row.nombre || row.razon_social),
    correo: sanitizeText(row.email),
    telefono: sanitizeText(row.celular),
    rol_acceso: normalizeRolAcceso(row.acceso),
    nombre_idpadre: sanitizeText(row.nombrepadre)
  }));

const formatDate = (value) => {
  if (!value) return '';
  const formatted = moment(value).format('YYYY-MM-DD');
  return formatted === 'Invalid date' ? '' : formatted;
};

const buildClientesRows = (rows) =>
  rows.map((row) => ({
    id_use: row.id_use ?? '',
    estado: getEstado(row),
    codt: sanitizeText(row.codt),
    cedula_nit: sanitizeText(row.cedula_nit),
    razon_social: sanitizeText(row.razon_social),
    nombre_comercial: sanitizeText(row.nombre_comercial),
    telefono: sanitizeText(row.telefono),
    email: sanitizeText(row.email),
    tipo: sanitizeText(row.tipo),
    ced_veo_padre: sanitizeText(row.ced_veo_padre),
    valor_kg: row.valor_kg ?? '',
    valor_sig_kg: row.valor_sig_kg ?? '',
    fecha_expiracion: formatDate(row.fecha_expiracion),
    punto_suministro: sanitizeText(row.punto_suministro),
    estado_punto: row.punto_activo ? 'Activo' : 'Inactivo',
    capacidad: sanitizeText(row.capacidad),
    email_punto: sanitizeText(row.email_punto),
    celular_punto: sanitizeText(row.celular_punto),
    nombre_punto: sanitizeText(row.nombre_punto),
    zona: sanitizeText(row.zona),
    coordenadas: sanitizeText(row.coordenadas)
  }));

module.exports.main = async (event) => {
  const {
    end,
    start,
    acceso,
    nombre
  } = event.pathParameters;


  const fields = HandleFields(acceso)
  try {
    const client = await poolConection.connect();
    const isClientes = acceso === 'clientes';
    const { rows: users } = isClientes
      ? await client.query(GET_CLIENTES_WITH_PUNTOS, [start, end])
      : await client.query(GET_USERS, [acceso, start, end]);
    const isConductores = !acceso || acceso === 'conductores' || acceso === 'conductor';
    let placasByConductor = new Map();

    if (isConductores) {
      const { rows: placasRows } = await client.query(GET_CONDUCTOR_PLACAS);
      placasByConductor = new Map(
        placasRows.map((row) => [Number(row.conductor), row.placa_asignada || ''])
      );
    }

    let data = users;
    if (acceso === 'all') {
      data = buildAllUsersRows(users);
    } else if (isClientes) {
      data = buildClientesRows(users);
    } else if (isConductores) {
      data = buildConductoresRows(users, placasByConductor);
    }
    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(data);


    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Usuarios-${fecha}-${acceso}-${nombre}.csv"`
      },
      body: csv
    };

    return response;

    // return {
    //   users
    // }
  } catch (error) {
    throw new DatabaseError(error);
  }
};