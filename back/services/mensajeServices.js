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
		Mensaje.find({conversacionId:id}).populate('usuarioId').sort({_id: 'asc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		Mensaje.find({usuarioId}).populate('usuarioId').sort({_id: 'desc'}).exec(callback)
	}
	create(data, imagen, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		let newMensaje = new Mensaje({
			mensaje    : data.mensaje,
			usuarioId  : data.tipo==1 ?data.usuarioId.usuarioId :data.userId,
			conversacionId :data.conversacionId,
			tipo :data.tipo,
			imagen,
			creado
		})
		newMensaje.save(callback)	
	}
 
}

module.exports = new mensajeServices();