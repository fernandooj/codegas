///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let ordenPedido = require('./../models/ordenPedidoModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class ordenPedidoServices{
	constructor(){

	}
	get(callback){
		ordenPedido.find({}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone').populate("pedidos").populate("carroId").sort({_id: 'desc'}).exec(callback)
	}
	getById(_id, callback){
		ordenPedido.findOne({_id}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone').populate("carroId").sort({_id: 'desc'}).exec(callback)
	}
	getByFechaCarro(fecha, carroId, callback){
        fecha = moment(fecha).valueOf()
		ordenPedido.findOne({fecha, carroId}).exec(callback)
	}
	create(data, usuarioId, callback){
        console.log(data.pedidos)
        let fecha = moment(data.fecha).valueOf()
		let newOrdenPedido = new ordenPedido({
            fecha:fecha,
            carroId:data.carroId,
            usuarioId,
            pedidos:data.pedidos
		})
		newOrdenPedido.save(callback)	
	}
	 
    editar(_id, pedidos, callback){
		ordenPedido.findByIdAndUpdate(_id, {$set: {
			'pedidos':pedidos
		}}, callback);
    }	
}

module.exports = new ordenPedidoServices();