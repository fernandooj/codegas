const moment = require('moment');
const {Parser}  = require('@json2csv/plainjs');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const GET_USERS = 'SELECT * FROM informe_get_users($1, $2, $3)';

/** get user
 *  save user active in the table
 * @param {string} uid - username user
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = (type) => {
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

  if(type==="clientes"){
    fields.push(
      {
        label: 'Razon Social',
        value: 'razon_social'
    },{
        label: 'Direccion Factura',
        value: 'direccion_factura'
    },{
        label: 'CODT',
        value: 'codt'
    },{
        label: 'Zona',
        value: 'nombrezona'
    },{
        label: 'Valor Unitario',
        value: 'valorunitario'
    },{
        label: 'Direccion',
        value: 'direccion'
    },{
        label: 'Observacion',
        value: 'observacion'
    },{
        label: 'Veo/Padre',
        value: 'nombrepadre'
    },{
        label: 'Ced. Veo/Padre',
        value: 'cedulapadre'
    },{
        label: 'Codigo Registro',
        value: 'codigoregistro'
    }
    )
  }

  return fields
}

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
    const { rows: users } = await client.query(GET_USERS, [acceso, start, end]);

    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(users);

 
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