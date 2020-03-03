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
		tanque.find({}).populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social').populate("conductor").sort({_id: 'desc'}).exec(callback)
	}
	 
	create(data, usuarioCrea, callback){
        let creado = moment().subtract(5, 'hours');
        creado = moment(fecha2).format('YYYY-MM-DD h:mm');
		let newTanque = new tanque({
			nControl              : data.placa,
			zonaAdicional         : data.zonaAdicional,
			sector                : data.sector,
			propiedad             : data.propiedad,
			barrio                : data.barrio,
			usuariosAtendidos     : data.usuariosAtendidos,
			ubicacion             : data.ubicacion,
			fechaUltimaRev        : data.fechaUltimaRev,
			m3                    : data.m3,
			placa                 : data.placa,
			codigo                : data.codigo,
			serie                 : data.serie,
			placaMantenimiento    : data.placaMantenimiento,
			ultimaRevisionPar     : data.ultimaRevisionPar,
			fabricante            : data.fabricante,
			nPlacaFabricante      : data.nPlacaFabricante,
			anoFabricacion        : data.anoFabricacion,
			lote                  : data.lote,
			nNMedidor             : data.nNMedidor,
			nComodato             : data.nComodato,
			fotos                 : data.fotos,
			observaciones         : data.observaciones,
			compromisos           : data.compromisos,
			coordenadas           : data.coordenadas,
			puntoId               : data.puntoId,
			zonaId                : data.zonaId,
			usuarioId             : data.usuarioId,
            usuarioCrea,
			creado
		})
		newTanque.save(callback)	
	}
	editar(_id, data, callback){
		tanque.findByIdAndUpdate(_id, {$set: {
			nControl              : data.placa,
			zonaAdicional         : data.zonaAdicional,
			sector                : data.sector,
			propiedad             : data.propiedad,
			barrio                : data.barrio,
			usuariosAtendidos     : data.usuariosAtendidos,
			ubicacion             : data.ubicacion,
			fechaUltimaRev        : data.fechaUltimaRev,
			m3                    : data.m3,
			placa                 : data.placa,
			codigo                : data.codigo,
			serie                 : data.serie,
			placaMantenimiento    : data.placaMantenimiento,
			ultimaRevisionPar     : data.ultimaRevisionPar,
			fabricante            : data.fabricante,
			nPlacaFabricante      : data.nPlacaFabricante,
			anoFabricacion        : data.anoFabricacion,
			lote                  : data.lote,
			nNMedidor             : data.nNMedidor,
			nComodato             : data.nComodato,
			fotos                 : data.fotos,
			observaciones         : data.observaciones,
			compromisos           : data.compromisos,
			coordenadas           : data.coordenadas,
			puntoId               : data.puntoId,
			zonaId                : data.zonaId,
			usuarioId             : data.usuarioId,
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
 
}

module.exports = new tanqueServices();