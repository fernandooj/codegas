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
		pedido.find({}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social').populate("conductorId").sort({_id: 'desc'}).exec(callback)
	}
	getByPedido(_id, callback){
		pedido.find({_id}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social').populate("conductorId").sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		pedido.find({usuarioId}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social').populate("conductorId").sort({_id: 'desc'}).exec(callback)
	}
	create(data, usuarioId, usuarioCrea, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
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
    eliminar(_id, eliminado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarConductor(_id, conductorId, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'conductorId':conductorId
		}}, callback);
	}
	asignarFechaEntrega(_id, fechaEntrega, callback){
		fechaEntrega = moment(fechaEntrega).valueOf()
		pedido.findByIdAndUpdate(_id, {$set: {
			'fechaEntrega':fechaEntrega
		}}, callback);
	}
	

 
}

module.exports = new pedidoServices();