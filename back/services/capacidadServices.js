///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let capacidadModel = require('./../models/capacidadModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class capacidadServices{
	constructor(){

	}
	get(callback){
		capacidadModel.find({eliminado:false}).sort({_id: 'desc'}).exec(callback)
	}
 
	create(capacidad, callback){
        let creado = moment().subtract(5, 'hours');
            creado = moment(creado).format('YYYY-MM-DD h:mm');
        let newCapacidad = new capacidadModel({
			capacidad  : capacidad,
            creado
		})
		newCapacidad.save(callback)	
	}
	eliminar(_id, callback){
		capacidadModel.findByIdAndUpdate(_id, {$set: {
			eliminado : true
		}}, callback);
    }
}

module.exports = new capacidadServices();