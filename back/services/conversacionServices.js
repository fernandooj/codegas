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
	groupoByConversacion(callback){
		Conversacion.aggregate([
			{
				$lookup:{
					from:"mensajes",
					localField:"_id",
					foreignField:"conversacionId",
					as:"MensajeData"
				}
			},
			{
				$unwind:{
					path:'$MensajeData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"usuarioId1",
					foreignField:"_id",
					as:"UserData1"
				}
			},
			{
				$unwind:{
					path:'$UserData1',
					preserveNullAndEmptyArrays: true
				}
			}, 
			{
				$lookup:{
					from:"users",
					localField:"usuarioId2",
					foreignField:"_id",
					as:"UserData2"
				}
			},
			{
				$unwind:{
					path:'$UserData2',
					preserveNullAndEmptyArrays: true
				}
			}, 

			{
				$project:{
					_id:1,
					creado:1,
					update:1,
					mensaje:'$MensajeData.mensaje',
					mensajeCreado:'$MensajeData.creado',
					tipo:'$MensajeData.tipo',
					imagen:'$MensajeData.imagen',
					idMensaje:'$MensajeData._id',
					nombreMensaje:'$MensajeData.nombre',
					nombre1:'$UserData1.nombre',
					nombre2:'$UserData2.nombre',
				},
			},
			{
			    $group:{
					_id:{
						_id:'$_id',
						nombre1:'$nombre1',
						nombre2:'$nombre2',
						creado:'$creado',
						update:'$update',
					},
					 
			    	data: { $addToSet: {_id:"$idMensaje", mensaje:"$mensaje", creado:"$creado",  tipo:"$tipo", imagen:'$imagen',  mensajeCreado:'$mensajeCreado', nombreMensaje:'$nombreMensaje'}},
			    }
			},
		], callback)
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
	actualizaBagde(_id, badge, callback){
		Conversacion.findByIdAndUpdate(_id, {$set: {
			'badge':badge,
		}}, callback);
	}
}

module.exports = new mensajeServices();