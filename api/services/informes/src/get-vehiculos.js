const moment = require('moment');
const {Parser}  = require('@json2csv/plainjs');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const GET_VEHICULOS = `
  SELECT
    c._id,
    c.activo,
    c.eliminado,
    c.placa,
    c.centro,
    c.bodega,
    c.capacidad,
    u.nombre AS conductor
  FROM carros c
  LEFT JOIN users u ON u._id = c.conductor
  WHERE c.eliminado = FALSE
    AND c.creado >= $1::timestamp
    AND c.creado < ($2::timestamp + INTERVAL '1 day')
  ORDER BY c._id ASC
`;

/** get cars
 *  get cars active in the table
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = () => [
  { label: 'ID', value: 'id' },
  { label: 'Estado', value: 'estado' },
  { label: 'Placa', value: 'placa' },
  { label: 'Conductor', value: 'conductor' },
  { label: 'Centro', value: 'centro' },
  { label: 'Bodega', value: 'bodega' },
  { label: 'Cap. (kg)', value: 'capacidad_kg' }
];

const sanitizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\r\n]+/g, ' ').trim();
};

const buildVehiculosRows = (rows) =>
  rows.map((row) => ({
    id: row._id ?? '',
    estado: row.activo ? 'Activo' : 'Inactivo',
    placa: sanitizeText(row.placa),
    conductor: sanitizeText(row.conductor),
    centro: row.centro ?? '',
    bodega: row.bodega ?? '',
    capacidad_kg: row.capacidad ?? ''
  }));

module.exports.main = async (event) => {
  const {
    end,
    start,
    nombre
  } = event.pathParameters;

  const fields = HandleFields()
  try {
    const client = await poolConection.connect();
    const { rows: vehiculos } = await client.query(GET_VEHICULOS, [start, end]);
    const data = buildVehiculosRows(vehiculos);

    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(data);

 
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Vehiculos-${fecha}-${nombre}.csv"`
      },
      body: csv
    };

    return response;

    // return vehiculos

  } catch (error) {
    throw new DatabaseError(error);
  }
};