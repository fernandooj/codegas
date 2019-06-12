///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let pedido = require('./../models/pedidoModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class pedidoServices{
	constructor(){

	}
	get(callback){
		pedido.find({}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone').populate("carroId").sort({_id: 'desc'}).exec(callback)
	}
	getByPedido(_id, callback){
		pedido.find({_id}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone').populate("carroId").sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		pedido.find({usuarioId}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone').populate("carroId").sort({_id: 'desc'}).exec(callback)
	}
	create(data, usuarioId, usuarioCrea, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		let newPedido = new pedido({
			forma      : data.forma,
			cantidad   : data.cantidad,
			frecuencia : data.frecuencia,
			dia1       : data.dia1,
			dia2       : data.dia2,
			usuarioId,
			usuarioCrea,
			estado     :"espera",
			entregado  :false,
			eliminado  :false,
			creado
		})
		newPedido.save(callback)	
    }
    cambiarEstado(_id, estado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'estado':estado
		}}, callback);
    }
    finalizar(data, activo, imagen, callback){
		pedido.findByIdAndUpdate(data._id, {$set: {
			'entregado'		:activo,
			'kilos'	   		:data.kilos,
			'factura'  		:data.factura,
			'valor_unitario':data.valor_unitario,
			'imagen':imagen,
		}}, callback);
	}
	novedad(_id, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'entregado'		:true,
			'estado'	   	:"noentregado",
		}}, callback);
    }
    eliminar(_id, eliminado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarVehiculo(_id, carroId, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'carroId':carroId
		}}, callback);
	}
	asignarFechaEntrega(_id, fechaEntrega, callback){
		fechaEntrega = moment(fechaEntrega).valueOf()
		pedido.findByIdAndUpdate(_id, {$set: {
			'fechaEntrega':fechaEntrega
		}}, callback) ;
	}
	

 
}

module.exports = new pedidoServices();