///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let alertaTanque = require('./../models/alertaTanqueModel.js');
let moment       = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class alertaTanqueServices{
	constructor(){

	}
	get(callback){
		alertaTanque.find({})
		.populate("usuarioCrea")
		.populate("usuarioCierra")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
	} 
	getByTanque(tanqueId, callback){
		alertaTanque.find({tanqueId})
		.populate("usuarioCrea")
		.populate("usuarioCierra")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
   }
    
	create(data, usuarioCrea, callback){
        let creado = moment().subtract(5, 'hours');
        creado = moment(creado).format('YYYY-MM-DD h:mm');
		let alertaTanqueRev = new alertaTanque({
			alertaText  : data.alertaText,
			tanqueId    : data.tanqueId,
			usuarioCrea : usuarioCrea,
			creado
		})
		alertaTanqueRev.save(callback)	
    }   
    cerrar(_id, cerradoText, alertaImagen, usuarioCierra, callback){
        console.log({_id, cerradoText, alertaImagen, usuarioCierra})
        alertaTanque.findByIdAndUpdate(_id, {$set: {
            cerradoText:cerradoText,
            alertaImagen: alertaImagen ?alertaImagen :[],
            usuarioCierra,
            activo:false,
		}}, callback);
	}    
    eliminar(_id, eliminado, callback){
		alertaTanque.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
}

module.exports = new alertaTanqueServices();