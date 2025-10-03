///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let zona = require('./../models/zonaModel.js');
let moment 		 = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class zonaServices{
	constructor(){

  } 
  getAll(callback){
		zona.find({}).exec(callback)
	}
  getActivos(callback){
		zona.find({activo:true}).sort({nombre: 'asc'}).exec(callback)
	}
	create(nombre, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		let newZona = new zona({
            nombre : nombre,
            activo : true,
			creado     
		})
		newZona.save(callback)	
	}
	eliminar(_id,  callback){
		console.log({_id})
		zona.findByIdAndUpdate(_id, {$set: {
			'activo':false
		}}, callback);
	}
}

module.exports = new zonaServices();