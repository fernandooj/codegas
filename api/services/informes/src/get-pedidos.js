const moment = require('moment');
const {Parser}  = require('@json2csv/plainjs');
const {poolConection} = require('../../../lib/connection-pg.js')
const DatabaseError  = require('../../../lib/errors/database-error')
const GET_PEDIDOS = 'SELECT * FROM informe_get_pedidos($1, $2, $3)';

/** get user
 *  save user active in the table
 * @param {string} uid - username user
 * @returns {response} Response contains the data of cognito
 */


let fecha = moment().subtract(5, 'hours');
fecha = moment(fecha).format('YYYY-MM-DD_h:mm');

const HandleFields = (type) => {
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
  if(type==="entregado"){
    fields.push(
      {
        label: 'Estado',
        value: 'estado'
      },{
        label: 'Entregado',
        value: 'entregado'
      },{
        label: 'Estado Pedido',
        value: 'estado'
      },{
        label: 'Fecha Solicitud',
        value: 'fechasolicitud'
      },{
        label: 'Kilos',
        value: 'cantidadkl'
      },{
        label: 'Precio',
        value: 'cantidadprecio'
      },{
        label: 'Remision',   //todo
        value: 'remision'  //todo
      },{
        label: 'Valor Unitario usuario', //todo 
        value: 'valorunitario'  //todo
      },{
        label: 'Valor Unitario ', //todo 
        value: 'valorunitario'  //todo
      },{
        label: 'Valor Total', 
        value: 'valor_total'
      },{
        label: 'Forma de pago', 
        value: 'forma_pago'
      }
    )
  }
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

  if(type==="all"){
    fields.push(
      {
        label: 'Fecha Ingreso',
        value: 'creado'
      },{
        label: 'Fecha Solicitud',
        value: 'fechasolicitud'
      },{
        label: 'Estado Pedido',
        value: 'estado'
      },{
        label: 'Fecha Entrega',
        value: 'fechaentrega'
      },{
        label: 'Kilos',
        value: 'cantidadkl'
      },{
        label: 'Precio',
        value: 'cantidadprecio'
      },{
        label: 'Usuario Crea',  
        value: 'usuariocrea'
      },{
        label: 'Usuario Asigna',// todo
        value: 'usuarioasigna'// todo
      },{
        label: 'Usuario Asigna Vehiculo',// todo
        value: 'usuarioasignavehiculo'// todo
      },{
        label: 'Vehiculo Centro', // aun no esta
        value: 'centro'
      },{
        label: 'Vehiculo Bodega', // aun no esta
        value: 'bodega'
      } ,{
        label: 'Imagen de cierre',
        value: 'motivo_no_cierre'
      }
    )
  }

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
    const { rows: users } = await client.query(GET_PEDIDOS, [start, end, type]);

    const opts = { fields, withBOM: true };
    const parser = new Parser(opts);
    const csv = parser.parse(users);

 
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Pedidos-${type}-${nombre}.csv"`
      },
      body: csv
    };

    return response;

    // return users

  } catch (error) {
    throw new DatabaseError(error);
  }
};