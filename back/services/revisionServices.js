///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let revision = require('./../models/revisionModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class revisionServices{
	constructor(){

	}
	get(callback){
		revision.find({})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getById(_id, callback){
		revision.findOne({_id})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioCrea, callback){
		revision.findOne({usuarioCrea})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
	}
	 
	create(nControl, data, usuarioCrea, callback){
    let creado = moment().subtract(5, 'hours');
    creado = moment(creado).format('YYYY-MM-DD h:mm');
		let newRevision = new revision({
			nControl          : nControl,
			usuarioId         : data.usuarioId,
			tanqueId          : data.tanqueId,
			zonaId            : data.zonaId,
			puntoId           : data.puntoId,
			propiedad       	: data.propiedad,
			lote       				: data.lote,
			sector            : data.sector,
			barrio            : data.barrio,
			usuariosAtendidos : data.usuariosAtendidos,
			m3                : data.m3,
			nMedidorText      : data.nMedidorText,
			nMedidor          : data.nMedidor,
			nComodato         : data.nComodato,
			coordenadas       : data.coordenadas,
			otrosSi						:data.otrosSi,
			usuarioCrea,
			creado
		})
		newRevision.save(callback)	
	}
	editar(_id, data, callback){
		let editado = moment().subtract(5, 'hours');
    editado = moment(editado).format('YYYY-MM-DD h:mm');
		revision.findByIdAndUpdate(_id, {$set: {
			usuarioId          : data.usuarioId,
			tanqueId           : data.tanqueId,
			zonaId             : data.zonaId,
			puntoId            : data.puntoId,
			propiedad      	   : data.propiedad,
			lote      	   		 : data.lote,
			sector             : data.sector,
			barrio             : data.barrio,
			usuariosAtendidos  : data.usuariosAtendidos,
			m3                 : data.m3,
			nMedidorText       : data.nMedidorText,
			coordenadas        : data.coordenadas,
		}}, callback);
  }
	editarImagen(_id, nMedidor, nComodato, otrosSi, retiroTanques, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			nMedidor         : nMedidor  ?nMedidor  :[],
			nComodato        : nComodato ?nComodato :[],
			otrosSi          : otrosSi   ?otrosSi   :[],
			retiroTanques    : retiroTanques   ?retiroTanques   :[],
		}}, callback);
	}

	editarInstalacion(_id, isometrico, data, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			isometrico        : isometrico  ?isometrico  :[],
			observaciones     : data.observaciones,
			avisos 			 			: data.avisos,
			extintores 			  : data.extintores,
			distancias 				: data.distancias,
			electricas 				: data.electricas,
		}}, callback);
	}
	
	solicitudServicio(_id, usuarioSolicita, solicitudServicio, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			solicitudServicio : solicitudServicio,
			usuarioSolicita : usuarioSolicita,
		}}, callback);
	}
	
	
	cerrarAlerta(_id, alerta, data, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			alerta      : alerta    ?alerta  :[],
			alertaText  : data.alertaText,
			alertaFecha : data.alertaFecha,
			nActa       : data.nActa
		}}, callback);
	}
	
	cambiarEstado(_id, activo, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			'activo':activo
		}}, callback);
  }
  eliminar(_id, eliminado, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarUsuario(_id, usuarioId, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			'usuarioId':usuarioId
		}}, callback);
	}
	desvincularUsuario(_id, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			'usuarioId':null
		}}, callback);
	}
	geo(_id, data, callback){
		let coordenadas = {'type':'Point', "coordinates": [parseFloat(data.lng), parseFloat(data.lat)] }
		revision.findByIdAndUpdate(_id, {$set: {
			'coordenadas':coordenadas
		}}, callback);
	}


}

module.exports = new revisionServices();