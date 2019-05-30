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
		console.log(_id)
		Conversacion.findOne({_id}).populate('usuarioId1').sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId1, callback){
		Conversacion.find({usuarioId1}).populate('usuarioId1').populate('usuarioId2').sort({_id: 'desc'}).exec(callback)
	}
	getByToken(tokenPhone, activo, callback){
		Conversacion.findOne({tokenPhone}).populate('usuarioId1').sort({_id: 'desc'}).exec(callback)
	}
	create(data, usuarioId1, usuarioId2, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		console.log(creado)
		let newConversacion = new Conversacion({	
			celular    : data.celular,
			nombre     : data.nombre,
			tokenPhone : data.tokenPhone,
			usuarioId1,
			usuarioId2,
			creado
		})
		newConversacion.save(callback)	
	}
}

module.exports = new mensajeServices();