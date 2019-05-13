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
		Mensaje.find({conversacionId:id}).populate('usuarioId1').sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId1, callback){
		Mensaje.find({usuarioId1}).populate('usuarioId1').sort({_id: 'desc'}).exec(callback)
	}
	create(data, usuarioId1, usuarioId2, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		console.log(creado)
		let newMensaje = new Mensaje({
			email     : data.email,
			nombre    : data.nombre,
			mensaje   : data.email,
			usuarioId1,
			usuarioId2,
			creado
		})
		newMensaje.save(callback)	
	}
 
}

module.exports = new mensajeServices();