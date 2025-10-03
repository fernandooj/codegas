const moment = require('moment');
const {Parser}  = require('@json2csv/plainjs');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const GET_TANQUES = 'SELECT * FROM informe_tanques($1, $2)';

/** get cars
 *  get cars active in the table
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = () => {
    const fields = [{   
        label: 'Id',
        value: '_id'
    },{   
        label: 'Placa Text',
        value: 'placatext'
    },{
        label: 'Capacidad',
        value: 'capacidad'
    },{
        label: 'Fabricante',
        value: 'fabricante'
    },{
        label: 'Fecha Mto',
        value: 'fechaultimarev'
    },{
        label: 'Propiedad',
        value: 'propiedad'
    },{
        label: 'N Placa',
        value: 'nplaca'
    },{
        label: 'Serie',
        value: 'serie'
    },{
        label: 'Año Fab.',
        value: 'anofabricacion'
    },{
        label: 'Ubicación',
        value: 'existetanque'
    },{
        label: 'Fecha Creación',
        value: 'creado'
    },{
        label: 'Visual',
        value: 'visual'
    },{
        label: 'Cer. Onac',
        value: 'ceronac'
    },{
        label: 'Cliente',
        value: 'razon_social'
    },{
        label: 'CODT',
        value: 'codt'
    },{
        label: 'dirección',
        value: 'direccion'
    },{
        label: 'Cer. Fabricante',
        value: 'cerfabricante'
    },{
        label: 'Dossier',
        value: 'dossier'
    },{
        label: 'Placa Fabricante',
        value: 'placafabricante'
    },{
        label: 'Placa Mantenimiento',
        value: 'placamantenimiento'
    },{
        label: 'Placa',
        value: 'placa'
    }]
   

  return fields
}

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

    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(tanques);

 
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="tanques-${fecha}-${nombre}.csv"`
      },
      body: csv
    };

    return response;

    // return tanques

  } catch (error) {
    throw new DatabaseError(error);
  }
};