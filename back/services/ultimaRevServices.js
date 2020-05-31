///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let ultimaRev = require('./../models/ultimaRevModel.js');
let moment    = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class ultimaRevServices{
	constructor(){

	}
	get(callback){
		ultimaRev.find({})
		.populate("usuarioId")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
	} 
	getByTanque(tanqueId, callback){
		ultimaRev.find({tanqueId})
		.populate("usuarioId")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
  }
    
	create(data, ruta, usuarioId, callback){
    let creado = moment().subtract(5, 'hours');
    creado = moment(creado).format('YYYY-MM-DD h:mm');
		let newUltimaRev = new ultimaRev({
			fecha     : data.fecha,
			tanqueId  : data.tanqueId,
			ruta      : ruta ?ruta :[],
			usuarioId : usuarioId,
			creado
		})
		newUltimaRev.save(callback)	
	}       
    eliminar(_id, eliminado, callback){
		ultimaRev.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
}

module.exports = new ultimaRevServices();