///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let calificacion = require('./../models/calificacionModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class calificacionServices{
	constructor(){

	}
	get(callback){
		calificacion.find({}).populate('idConversacion').sort({_id: 'desc'}).exec(callback)
	}
 
	create(data, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		let newCalificacion = new calificacion({
			sugerencia	   :data.sugerencia,
			calificacion	 :data.calificacion,
			idConversacion :data.idConversacion,
			creado
		})
		newCalificacion.save(callback)	
	}
}

module.exports = new calificacionServices();