///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let carro = require('./../models/carroModel.js');
let moment = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class carroServices{
	constructor(){

	}
	get(callback){
		carro.find({}).populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social').populate("conductor").sort({_id: 'desc'}).exec(callback)
	}
	getNoEliminados(callback){
		carro.find({eliminado:false}).populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social').populate("conductor").sort({_id: 'desc'}).exec(callback)
	}
	getByCarro(_id, callback){
		carro.findOne({_id}).populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social').populate("conductor").exec(callback)
	}
	getByConductor(conductor, callback){
		carro.findOne({conductor}).populate('usuarioCrea', 'email _id acceso nombre cedula celular razon_social').populate("conductor").exec(callback)
	}
	create(data, usuarioCrea, callback){
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		let creado = moment(fecha).valueOf()
		let newCarro = new carro({
			placa      : data.placa,
			usuarioCrea,
      		activo    :true,
			eliminado :false,
			creado
		})
		newCarro.save(callback)	
	}
	vehiculosConPedidos(fecha, callback){
		fecha = moment(fecha).valueOf()
		console.log({fecha})
		carro.aggregate([
			{
				$lookup:{
					from:"pedidos",
					localField:"_id",
					foreignField:"carroId",
					as:"PedidoData"
				}
			},
			{
				$unwind:{
					path:'$PedidoData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"conductor",
					foreignField:"_id",
					as:"UserData"
				}
			},
			{
				$project:{
					placa:1,
					activo:1,
					eliminado:1,
					forma:'$PedidoData.forma',
					cantidad:'$PedidoData.cantidad',
					estado:'$PedidoData.estado',
					entregado:'$PedidoData.entregado',
					eliminado:'$PedidoData.eliminado',
					fechaEntrega:'$PedidoData.fechaEntrega',
					conductor:"$UserData.nombre"
					// monto:'$PagoData.monto'
				},
			},
			{
				$match:{
					fechaEntrega:fecha
				},
			}
		], callback)
	}  
    cambiarEstado(_id, activo, callback){
		carro.findByIdAndUpdate(_id, {$set: {
			'activo':activo
		}}, callback);
    }
    eliminar(_id, eliminado, callback){
		carro.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarConductor(_id, conductor, callback){
		carro.findByIdAndUpdate(_id, {$set: {
			'conductor':conductor
		}}, callback);
	}
	desvincularConductor(_id, callback){
		carro.findByIdAndUpdate(_id, {$set: {
			'conductor':null
		}}, callback);
	}
 
}

module.exports = new carroServices();