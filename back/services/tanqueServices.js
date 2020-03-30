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
	 
	create(data, usuarioCrea, callback){
    let creado = moment().subtract(5, 'hours');
    creado = moment(creado).format('YYYY-MM-DD h:mm');
		let newTanque = new tanque({
		 
			placaText       	: data.placaText,
			capacidad         : data.capacidad,
			fabricante        : data.fabricante,
			ultimaRevisionPar : data.ultimaRevisionPar,
			fechaUltimaRev    : data.fechaUltimaRev,
		
			ubicacion         : data.ubicacion,
			codigoActivo      : data.codigoActivo,
			serie       		  : data.serie,
			anoFabricacion    : data.anoFabricacion,
		
		
			puntoId           : data.puntoId,
			zonaId            : data.zonaId,
			usuarioId         : data.usuarioId,
      usuarioCrea,
			creado
		})
		newTanque.save(callback)	
	}
	editar(_id, data, callback){
		console.log(data)
		tanque.findByIdAndUpdate(_id, {$set: {
			placaText       	: data.placaText,
			capacidad         : data.capacidad,
			fabricante        : data.fabricante,
			ultimaRevisionPar : data.ultimaRevisionPar,
			fechaUltimaRev    : data.fechaUltimaRev,
		
			ubicacion         : data.ubicacion,
			codigoActivo      : data.codigoActivo,
			serie       		  : data.serie,
			anoFabricacion    : data.anoFabricacion,
		
		
			puntoId           : data.puntoId,
			zonaId            : data.zonaId,
			usuarioId         : data.usuarioId,
		}}, callback);
  }
	editarImagen(_id, placa, placaMantenimiento, placaFabricante, callback){
		console.log({placa, placaMantenimiento, placaFabricante})
		tanque.findByIdAndUpdate(_id, {$set: {
			'placa': placa,
			'placaMantenimiento': placaMantenimiento,
			'placaFabricante' : placaFabricante,
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
	desvincularUsuario(_id, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
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