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
        label: 'N Revisión',
        value: '_id'
    },{
        label: 'Usuario Crea',
        value: 'usuariocrea'
    },{
        label: 'Fecha Creación',
        value: 'creado'
    },{
        label: 'Barrio',
        value: 'barrio'
    },{
        label: 'M 3',
        value: 'm3'
    },{
        label: 'N Comodato',
        value: 'nComodatoText'
    },{
        label: 'N Medidor',
        value: 'nMedidorText'
    },{
        label: 'Direccion',
        value: 'direccion'
    },{
        label: 'Sector',
        value: 'sector'
    },{
        label: 'Ubicación',
        value: 'ubicacion'
    },{
        label: 'Cliente',
        value: 'razon_social'
    },{
        label: 'CODT',
        value: 'codt'
    },{
        label: 'Usuarios Atendidos',
        value: 'usuariosatendidos'
    },{
        label: 'Accesorios',
        value: 'accesorios'
    },{
        label: 'Avisos',
        value: 'avisos'
    },{
        label: 'Distancias',
        value: 'distancias'
    },{
        label: 'Electricas',
        value: 'electricas'
    },{
        label: 'Extintores',
        value: 'extintores'
    },{
        label: 'Lat',
        value: 'coordenadas.coordinates[1]'
    },{
        label: 'Lng',
        value: 'coordenadas.coordinates[0]'
    },{
        label: 'Poblado',
        value: 'poblado'
    },{
        label: 'Dep Tecnico Estado',
        value: 'deptecnicoestado'
    },{
        label: 'Observaciones',
        value: 'observaciones'
    },{
        label: 'Activo',
        value: 'activo'
    },{
        label: 'Dep Tecnico',
        value: 'deptecnico'
    },{
        label: 'Documento',
        value: 'documento'
    },{
        label: 'Alerta',
        value: 'alerta'
    },{
        label: 'Otros Si',
        value: 'otrossi'
    },{
        label: 'N Comodato',
        value: 'ncomodato'
    },{
        label: 'Hoja Seguridad',
        value: 'hojaSeguridad'
    },{
        label: 'Protocolo Llenado',
        value: 'protocoloLlenado'
    },{
        label: 'Visual',
        value: 'visual'
    },{
        label: 'Visual gasoequipos',
        value: 'puntoconsumo'
    },{
        label: 'Ruta y soporte de entrega',
        value: 'soporteentrega'
    },{
        label: 'Otros Comodato',
        value: 'otroscomodato'
    },{
        label: 'Isometrico',
        value: 'isometrico'
    },{
        label: 'Solicitud',
        value: 'estado'
    }];
   

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
        'Content-Disposition': `attachment; filename="Revision-${fecha}-${nombre}.csv"`
      },
      body: csv
    };

    return response;

    // return tanques

  } catch (error) {
    throw new DatabaseError(error);
  }
};