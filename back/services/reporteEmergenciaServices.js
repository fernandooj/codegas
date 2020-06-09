///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let reporteEmergencia = require('./../models/reporteEmergenciaModel.js');
let moment       = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class reporteEmergenciaServices{
	constructor(){

	}
	get(callback){
		reporteEmergencia.find({})
		.populate("usuarioCrea")
		.populate("usuarioCierra")
		.populate("tanqueId")
		.populate("usuarioId")
		.populate("puntoId")
		.sort({_id: 'desc'}).exec(callback)
    } 
    getByUser(usuarioCrea, usuarioId, callback){
		reporteEmergencia.find({usuarioCrea, usuarioId})
		.populate("usuarioCrea")
		.populate("usuarioCierra")
		.populate("tanqueId")
		.populate("usuarioId")
		.populate("puntoId")
		.sort({_id: 'desc'}).exec(callback)
	} 
	getById(_id, callback){
		reporteEmergencia.findOne({_id})
		.populate("usuarioCrea")
		.populate("usuarioCierra")
		.populate("tanqueId")
		.populate("usuarioId")
		.populate("puntoId")
		.sort({_id: 'desc'}).exec(callback)
  }
    
	create(data, usuarioCrea, ruta, nReporte, callback){
    let creado = moment().subtract(5, 'hours');
    creado = moment(creado).format('YYYY-MM-DD h:mm');
		let reporteEmergenciaRev = new reporteEmergencia({
			nReporte    : nReporte,			
			tanque      : data.tanque,			
			red         : data.red,
			puntos      : data.puntos,
			fuga        : data.fuga,
			pqr         : data.pqr,
			otrosText   : data.otrosText,
			tanqueId 	  : data.tanqueId,
			usuarioId   : data.usuarioId ?data.usuarioId :usuarioCrea,
			puntoId   	: data.puntoId,
			ruta        : ruta ?ruta :[],
			usuarioCrea,
			creado
		})
		reporteEmergenciaRev.save(callback)	
    }   
    cerrar(_id, data, rutaCerrar, documento, usuarioCierra, callback){
			reporteEmergencia.findByIdAndUpdate(_id, {$set: {
				tanque      : data.tanque,			
				red         : data.red,
				puntos      : data.puntos,
				fuga        : data.fuga,
				pqr         : data.pqr,
				cerradoText : data.cerradoText ?data.cerradoText :null,
				usuarioId   : data.usuarioId,
				puntoId   	: data.puntoId,
				rutaCerrar  : rutaCerrar ?rutaCerrar :[],
				documento   : documento ?documento :[],
				usuarioCierra,
		}}, callback);
	}    
    eliminar(_id, eliminado, callback){
		reporteEmergencia.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
}

module.exports = new reporteEmergenciaServices();