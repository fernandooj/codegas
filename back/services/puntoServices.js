///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let punto = require('./../models/puntoModel.js');
let moment 		 = require('moment-timezone');
let mongoose = require('mongoose')
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
		punto.find({ $or: [ {idCliente, activo:true}, {idPadre:idCliente, activo:true}]}).exec(callback)
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

	getByUser(idCliente, callback){
		idCliente = mongoose.Types.ObjectId(idCliente);	
		punto.aggregate([
			{
				$lookup:{
					from:"users",
					localField:"idCliente",
					foreignField:"_id",
					as:"UserData"
				}
			},
			{
				$unwind:{
					path:'$UserData',
					preserveNullAndEmptyArrays: false
				}
			},
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
				$project:{
					_id:1,
					observacion:1,
					direccion:1,
					idZona:1,
					idCliente:1,
					idPadre:1,
					activo:1,
					nombre:'$UserData.nombre',
					email:'$UserData.email',
					nombreZona:'$ZonaData.nombre',
				},
			},
		 
			{
			$match: { $or: [
						{ idCliente, activo:true }, 
						{ idPadre: idCliente,  activo:true	 }
					] 
				}
			},
			{
			    $group:{
						_id:'$_id',
						data: { $addToSet: {_id:"$_id", observacion:"$observacion", direccion:"$direccion", idZona:'$idZona',  activo:'$activo',  idCliente:'$idCliente', nombre:'$nombre', email:'$email', nombreZona:'$nombreZona' }                  },
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

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////		OBTIENE EL PUNTO JUNTO CON LA UBICACION Y EL CLIENTE, ESTO PARA LA RUTA DE INFORMES
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	getUsers(callback){
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
					from:"users",
					localField:"idCliente",
					foreignField:"_id",
					as:"UserData"
				}
			},
			{
				$unwind:{
					path:'$UserData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"idCliente",
					foreignField:"_id",
					as:"PadreData"
				}
			},
			{
				$unwind:{
					path:'$PadreData',
					preserveNullAndEmptyArrays: false
				}
			},
		], callback)
	}  

	create(data, idCliente, idPadre, callback){
		let creado = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY-MM-DD h:mm:ss a')
	 
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
	editar(data, id, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY-MM-DD h:mm:ss a')
		punto.findByIdAndUpdate(id, {$set: {
			'direccion'  : data.direccion,
			'observacion': data.observacion,
			'idZona'		 : data.idZona,
			'updated':   moment(fecha).valueOf()
		}}, callback);
	}
	desactivar(id, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY-MM-DD h:mm:ss a')
		punto.findByIdAndUpdate(id, {$set: {
			'activo'  	 : false,
			'updated':   moment(fecha).valueOf()
		}}, callback);
	}
}

module.exports = new puntoServices();