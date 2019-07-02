///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let punto = require('./../models/puntoModel.js');
let moment 		 = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class puntoServices{
	constructor(){

	} 
	get(callback){
		punto.find({}).exec(callback)
	}
	getCliente(idCliente, callback){
		punto.find({ $or: [ {idCliente}, {idPadre:idCliente}]}).exec(callback)
	}
	getZonas(fecha, callback){
		punto.aggregate([
			{
				$lookup:{
					from:"zonas",
					localField:"idZona",
					foreignField:"_id",
					as:"ZonaData"
				}
			},
			{
				$unwind:{
					path:'$ZonaData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"pedidos",
					localField:"_id",
					foreignField:"puntoId",
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
				$project:{
					_id:1,
					direccion:1,
					observacion:1,
					activo:1,
					idZona:'$ZonaData._id',
					nombre:'$ZonaData.nombre',
					idPedido:'$PedidoData._id',
					estado:'$PedidoData.estado',
					entregado:'$PedidoData.entregado',
					fechaEntrega:"$PedidoData.fechaEntrega",
					fechaSolicitud:"$PedidoData.fechaSolicitud",
				},
			},
			{
				$match:{
					fechaEntrega:fecha
				},
			},
			{
			    $group:{	 
					_id:'$nombre', 
					data: { $addToSet: {_id:"$_id", direccion:"$direccion", observacion:"$observacion", activo:'$activo', nombre:'$nombre', idPedido:'$idPedido', estado:'$estado', entregado:'$entregado', fechaEntrega:'$fechaEntrega'},	
					},
					total:{ $sum :1},
			    }
			},
		], callback)
	} 

	getZonasFechaSolicitud(fecha, callback){
		punto.aggregate([
			{
				$lookup:{
					from:"zonas",
					localField:"idZona",
					foreignField:"_id",
					as:"ZonaData"
				}
			},
			{
				$unwind:{
					path:'$ZonaData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"pedidos",
					localField:"_id",
					foreignField:"puntoId",
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
				$project:{
					_id:1,
					direccion:1,
					observacion:1,
					activo:1,
					idZona:'$ZonaData._id',
					nombre:'$ZonaData.nombre',
					idPedido:'$PedidoData._id',
					estado:'$PedidoData.estado',
					entregado:'$PedidoData.entregado',
					fechaEntrega:"$PedidoData.fechaEntrega",
					fechaSolicitud:"$PedidoData.fechaSolicitud",
				},
			},
			{
				$match:{
					fechaSolicitud:fecha
				},
			},
			{
			    $group:{	 
					_id:'$nombre', 
					data: { $addToSet: {_id:"$_id", direccion:"$direccion", observacion:"$observacion", activo:'$activo', nombre:'$nombre', idPedido:'$idPedido', estado:'$estado', entregado:'$entregado', fechaEntrega:'$fechaEntrega'},	
					},
					total:{ $sum :1},
			    }
			},
		], callback)
	}  

	create(data, idCliente, idPadre, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		let newPunto = new punto({
			direccion : data.direccion,
			observacion : data.observacion,
			idZona : data.idZona,
			idCliente : idCliente,
			idPadre : idPadre,
			creado     
		})
		newPunto.save(callback)	
	}
}

module.exports = new puntoServices();