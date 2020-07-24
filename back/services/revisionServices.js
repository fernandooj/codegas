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
	getWithAlerta(callback){
		revision.find({estado:2})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.populate("usuarioSolicita")
		.sort({_id: 'desc'}).exec(callback)
	}
	getDepTecnico(callback){
		revision.find({ $or: [ {avisos:true}, {extintores:true}, {distancias:true}, {electricas:true}, {accesorios:true}]})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.populate("usuarioSolicita")
		.sort({_id: 'desc'}).exec(callback)
	}
	getById(_id, callback){
		revision.findOne({_id})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.populate("usuarioSolicita")
		.sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioCrea, callback){
		revision.find({usuarioCrea})
		.populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social')
		.populate("zonaId")
		.populate("puntoId")
		.populate("usuarioId")
		.populate("tanqueId")
		.sort({_id: 'desc'}).exec(callback)
	}
	getByPunto(puntoId, callback){
		revision.find({puntoId})
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
			nComodatoText     : data.nComodatoText,
			ubicacion         : data.ubicacion,
		 
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
			nComodatoText     : data.nComodatoText,
			ubicacion         : data.ubicacion,
		 
		}}, callback);
  }
	editarImagen(_id,  isometrico, otrosComodato, soporteEntrega, puntoConsumo, visual, callback){
		console.log({isometrico, otrosComodato, soporteEntrega, puntoConsumo, visual})
		revision.findByIdAndUpdate(_id, {$set: {
			isometrico     : isometrico  		?isometrico  		:[],
			otrosComodato  : otrosComodato  ?otrosComodato  :[],
			soporteEntrega : soporteEntrega ?soporteEntrega :[],
			puntoConsumo   : puntoConsumo   ?puntoConsumo   :[],
			visual    		 : visual   		  ?visual   			:[],
		}}, callback);
	}

	subirPdf(_id, protocoloLlenado, hojaSeguridad, nComodato, otrosSi, callback){
		console.log({protocoloLlenado, _id})
		revision.findByIdAndUpdate(_id, {$set: {
			protocoloLlenado : protocoloLlenado ?protocoloLlenado : [],
			hojaSeguridad    : hojaSeguridad    ?hojaSeguridad    : [],
			nComodato        : nComodato   		  ?nComodato   		  : [],
			otrosSi    			 : otrosSi   			  ?otrosSi   				: [],
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
			accesorios 				: data.accesorios,
		}}, callback);
	}
	
	solicitudServicio(_id, usuarioSolicita, solicitudServicio, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			solicitudServicio : solicitudServicio,
			usuarioSolicita : usuarioSolicita,
			estado:2
		}}, callback);
	}
	
	
	cerrarAlerta(_id, alerta, data, callback){
		revision.findByIdAndUpdate(_id, {$set: {
			alerta      : alerta    ?alerta  :[],
			alertaText  : data.alertaText,
			alertaFecha : data.alertaFecha,
			nActa       : data.nActa,
			estado:3
		}}, callback);
	}

	cerrarDepTecnico(_id, depTecnico, data, documento, callback){
		console.log(documento)
		revision.findByIdAndUpdate(_id, {$set: {
			depTecnico     : depTecnico    ?depTecnico  :[],
			depTecnicoText : data.depTecnicoText,
			avisos         : data.avisos,
			extintores 	   : data.extintores,
			distancias     : data.distancias,
			electricas     : data.electricas,
			accesorios     : data.accesorios,
			documento      : documento ?documento :[],
			depTecnicoEstado:true
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
		let lng=parseFloat(data.lng)
		let lat=parseFloat(data.lat)
		let coordenadas = {'type':'Point', "coordinates": [lng, lat] }
		console.log({_id, data})
		revision.findByIdAndUpdate(_id, {$set: {
		'coordenadas':coordenadas,
			'poblado':data.poblado,
			// 'poblado':data.poblado,
			// 'poblado':data.poblado
		}}, callback);
	}
}

module.exports = new revisionServices();