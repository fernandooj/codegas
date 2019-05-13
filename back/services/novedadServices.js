///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let Novedad = require('./../models/novedadModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class novedadServices{
	constructor(){

	}
	get(callback){
		Novedad.find({}, callback)
	}
	getByNovedad(_id, callback){
		Novedad.find({_id}).populate('usuarioId').sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		Novedad.find({usuarioId}).populate('usuarioId').sort({_id: 'desc'}).exec(callback)
	}
	create(novedad, usuarioId, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		console.log(novedad.novedad)
		let newNovedad = new Novedad({
			novedad  : novedad.novedad,
			pedidoId : novedad.pedidoId,
			usuarioId,
			creado
		})
		newNovedad.save(callback)	
	}
 
}

module.exports = new novedadServices();