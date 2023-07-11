const moment = require('moment');
const {Parser}  = require('@json2csv/plainjs');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const GET_PEDIDOS = 'SELECT * FROM informe_get_vehiculos($1, $2)';

/** get cars
 *  get cars active in the table
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = (type) => {
    const fields = [{
        label: 'Id',
        value: '_id'
    },{
        label: 'Placa',
        value: 'placa'
    },{
        label: 'Centro',
        value: 'centro'
    },{
        label: 'Bodega',
        value: 'bodega'
    },{
        label: 'Conductor',
        value: 'conductor'
    },{
        label: 'Usuario Crea ',
        value: 'usuariocrea'
    },{
        label: 'Creado',
        value: 'creado'
    }]
   

  return fields
}

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
    const { rows: vehiculos } = await client.query(GET_PEDIDOS, [start, end]);

    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(vehiculos);

 
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