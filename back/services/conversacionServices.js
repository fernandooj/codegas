///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let Mensaje = require('./../models/mensajeModel.js');
let Conversacion = require('./../models/conversacionModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////
class mensajeServices{
	constructor(){

	}
	get(callback){
		Mensaje.find({}, callback)
	}
	getById(_id, callback){
		Conversacion.findOne({_id}).populate('usuarioId1').populate('usuarioId2').sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId1, callback){
		Conversacion.find({usuarioId1}).populate('usuarioId1').populate('usuarioId2').sort({_id: 'desc'}).exec(callback)
	}
	getByToken(tokenPhone, activo, callback){
		console.log({tokenPhone, activo})
		Conversacion.findOne({tokenPhone, activo:true}).populate('usuarioId1').exec(callback)
	}
	create(data, usuarioId1, usuarioId2, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		 
		let newConversacion = new Conversacion({	
			celular    : data.celular,
			nombre     : data.nombre,
			email     : data.email,
			tokenPhone : data.tokenPhone,
			usuarioId1,
			usuarioId2,
			creado
		})
		newConversacion.save(callback)	
	}
	cerrar(_id, callback){
		console.log({_id})
		Conversacion.findByIdAndUpdate(_id, {$set: {
			'activo':false
		}}, callback);
	}
}

module.exports = new mensajeServices();