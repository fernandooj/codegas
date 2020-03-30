///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let configuracion = require('./../models/configuracionModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class configuracionServices{
	constructor(){

	}
	get(callback){
		configuracion.findOne({}).exec(callback)
	}
 
	create(data, callback){
        let newConfiguracion = new configuracion({
			placas  : data.placas,
            valor_unitario:data.valor_unitario
		})
		newConfiguracion.save(callback)	
	}
	editarPlaca(_id, placas, callback){
		configuracion.findByIdAndUpdate(_id, {$set: {
			placas : placas
		}}, callback);
    }
    editarValorUnitario(_id, valor_unitario, callback){
		configuracion.findByIdAndUpdate(_id, {$set: {
			valor_unitario : valor_unitario
		}}, callback);
    }
 


}

module.exports = new configuracionServices();