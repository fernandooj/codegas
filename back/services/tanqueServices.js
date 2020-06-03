///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let tanque = require('./../models/tanqueModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class tanqueServices{
	constructor(){

	}
	get(callback){
		tanque.find({})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getById(_id, callback){
		tanque.findOne({_id})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioCrea, callback){
		tanque.findOne({usuarioCrea})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getByPunto(puntoId, callback){
		tanque.find({puntoId})
		.populate("usuarioId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getAlerta(callback){
		tanque.aggregate([
			{
				$lookup:{
					from:"alertatanques",
					localField:"_id",
					foreignField:"tanqueId",
					as:"TanqueData"
				}
			},
			{
				$unwind:{
					path:'$TanqueData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"usuarioId",
					foreignField:"_id",
					as:"UserData"
				}
			},
			{
				$unwind:{
					path:'$UserData',
					preserveNullAndEmptyArrays: false
				}
			},
		 
			{
				$project:{
					_id:1,
					placaText:1,
					capacidad:1,
					usuario:'$UserData.nombre',
					texto:'$TanqueData.alertaText',
				},
			},
			{
			    $group:{
			 
						_id:{
							_id:'$_id',
							capacidad:'$capacidad',
							placaText:'$placaText',
							usuario:'$usuario',
						},
						data: { $addToSet: {texto:"$texto"}},
						total:{ $sum :1},
			    }
			},
		], callback)
	}  

	
	create(data, usuarioCrea, callback){
    let creado = moment().subtract(5, 'hours');
    creado = moment(creado).format('YYYY-MM-DD h:mm');
		let newTanque = new tanque({
			placaText       	: data.placaText,
			capacidad         : data.capacidad,
			fabricante        : data.fabricante,
			registroOnac 		  : data.registroOnac,
			fechaUltimaRev    : data.fechaUltimaRev,
			ultimRevTotal    : data.ultimRevTotal,

			nPlaca         	  : data.nPlaca,
			codigoActivo      : data.codigoActivo,
			serie       		  : data.serie,
			anoFabricacion    : data.anoFabricacion,
			existeTanque    	: data.existeTanque,
		
			puntoId           : data.puntoId,
			zonaId            : data.zonaId,
			usuarioId         : data.usuarioId,
      usuarioCrea,
			creado
		})
		newTanque.save(callback)	
	}
	editar(_id, data, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			placaText       	: data.placaText,
			capacidad         : data.capacidad,
			fabricante        : data.fabricante,
			registroOnac 		  : data.registroOnac,
			fechaUltimaRev    : data.fechaUltimaRev,
			ultimRevTotal    	: data.ultimRevTotal,
			nPlaca         		: data.nPlaca,
			codigoActivo      : data.codigoActivo,
			serie       		  : data.serie,
			anoFabricacion    : data.anoFabricacion,
			existeTanque    	: data.existeTanque,
			puntoId           : data.puntoId,
			zonaId            : data.zonaId,
			usuarioId         : data.usuarioId,
		}}, callback);
  }
	editarImagen(_id, placa, placaMantenimiento, placaFabricante,  visual, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			placa  				     : placa   						?placa   					  : [],
			placaMantenimiento : placaMantenimiento ?placaMantenimiento : [],
			placaFabricante    : placaFabricante   	?placaFabricante    : [],
 
			visual    			   : visual   			    ?visual   					: [],
		}}, callback);
	}

	subirPdf(_id, dossier, cerFabricante, cerOnac, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			dossier    			   : dossier   					?dossier   					: [],
			cerFabricante      : cerFabricante   		?cerFabricante   		: [],
			cerOnac    			   : cerOnac   			    ?cerOnac   					: [],
		}}, callback);
	}
	
	cambiarEstado(_id, activo, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			'activo':activo
		}}, callback);
  }
  eliminar(_id, eliminado, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarUsuario(_id, usuarioId, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			'usuarioId':usuarioId
		}}, callback);
	}

	asignarPunto(_id, usuarioId, puntoId, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			'usuarioId':usuarioId,
			'puntoId':puntoId
		}}, callback);
	}

	desvincularUsuario(_id, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			'puntoId':null,
			'usuarioId':null
		}}, callback);
	}
	geo(_id, data, callback){
		let coordenadas = {'type':'Point', "coordinates": [parseFloat(data.lng), parseFloat(data.lat)] }
		tanque.findByIdAndUpdate(_id, {$set: {
			'coordenadas':coordenadas
		}}, callback);
	}


}

module.exports = new tanqueServices();