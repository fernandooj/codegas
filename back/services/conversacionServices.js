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
		Conversacion.find().populate('usuarioId1').populate('usuarioId2').sort({_id: 'desc'}).exec(callback)
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
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		creado 	   = moment(creado).format('YYYY-MM-DD h:mm:ss')
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
	 
	cerrar(_id, creado, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let update = moment(fecha).valueOf()
		update 	   = moment(update).format('YYYY-MM-DD h:mm:ss')
		let duracion = moment.utc(moment(update, "YYYY-MM-DD HH:mm:ss").diff(moment(creado,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss")

		Conversacion.findByIdAndUpdate(_id, {$set: {
			'activo':false,
			'duracion':duracion,
			'update':update,
		}}, callback);
	}
}

module.exports = new mensajeServices();