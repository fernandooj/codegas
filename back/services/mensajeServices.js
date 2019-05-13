///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let Mensaje = require('./../models/mensajeModel.js');
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
	getByConversacionId(id, callback){
		Mensaje.find({conversacionId:id}).populate('usuarioId').sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		Mensaje.find({usuarioId}).populate('usuarioId').sort({_id: 'desc'}).exec(callback)
	}
	create(data, usuarioId, notificacion, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		console.log(creado)
		let newMensaje = new Mensaje({
			mensaje  : data.mensaje,
			usuarioId,
			conversacionId : notificacion,
			creado
		})
		newMensaje.save(callback)	
	}
 
}

module.exports = new mensajeServices();