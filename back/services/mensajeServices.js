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
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		creado 	   = moment(creado).format('YYYY-MM-DD h:mm:ss')
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