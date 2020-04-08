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
					capacidad:1,
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
					data: { $addToSet: {_id:"$_id", direccion:"$direccion", observacion:"$observacion", capacidad:"$capacidad",  activo:'$activo', nombre:'$nombre', idPedido:'$idPedido', estado:'$estado', entregado:'$entregado', fechaEntrega:'$fechaEntrega'},	
					},
					total:{ $sum :1},
			    }
			},
		], callback)
	} 

	getByUser(idUser, callback){
		idUser = mongoose.Types.ObjectId(idUser);	
		console.log({id:idUser})
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
					capacidad:1,
					direccion:1,
					idZona:1,
					idCliente:1,
					idPadre:1,
					activo:1,
					nombre:'$UserData.nombre',
					email:'$UserData.email',
					celular:'$UserData.celular',
					nombreZona:'$ZonaData.nombre',
				},
			},
		 
			{
			$match: { $or: [
						{ idCliente:idUser, activo:true }, 
						{ idPadre: idUser,  activo:true	 }
					] 
				}
			},
			{
			    $group:{
						_id:'$_id',
						data: { $addToSet: {_id:"$_id", observacion:"$observacion", direccion:"$direccion",  capacidad:"$capacidad", idZona:'$idZona',  activo:'$activo',  idCliente:'$idCliente', nombre:'$nombre', email:'$email', celular:'$celular', nombreZona:'$nombreZona' }},
			    }
			},
		], callback)
	}

	usariosConZonas(callback){
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
					capacidad:1,
					direccion:1,
					idZona:1,
					idCliente:1,
					idPadre:1,
					activo:1,
					codt:'$UserData.codt',
					idPadre:'$UserData.idPadre',
					nombre:'$UserData.nombre',
					valorUnitario:'$UserData.valorUnitario',
					razon_social:'$UserData.razon_social',
					email:'$UserData.email',
					celular:'$UserData.celular',
					nombreZona:'$ZonaData.nombre',
				},
			},
			{
			    $group:{
						_id:'$_id',
						data: { $addToSet: { observacion:"$observacion", direccion:"$direccion", codt:'$codt', idPadre:'$idPadre', razon_social:'$razon_social', capacidad:"$capacidad",  activo:'$activo',  idCliente:'$idCliente', nombre:'$nombre', email:'$email', celular:'$celular', valorUnitario:'$valorUnitario', nombreZona:'$nombreZona', idZona:'$idZona'}},
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
					capacidad:1,
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
					data: { $addToSet: {_id:"$_id", direccion:"$direccion", observacion:"$observacion", capacidad:"$capacidad",  activo:'$activo', nombre:'$nombre', idPedido:'$idPedido', estado:'$estado', entregado:'$entregado', fechaEntrega:'$fechaEntrega'},	
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
		let creado = moment().subtract(5, 'hours');
    creado     = moment(creado).format('YYYY-MM-DD h:mm');
		console.log(data)
		let newPunto = new punto({
			direccion   : data.direccion,
			observacion : data.observacion,
			capacidad 	: data.capacidad,
			idZona 		  : data.idZona,
			idCliente   : idCliente ?idCliente :idPadre,
			idPadre 	  : idPadre,
			activo:true,
			creado     
		})
		newPunto.save(callback)	
	}
	editar(data, _id, callback){
		let creado = moment().subtract(5, 'hours');
    creado     = moment(creado).format('YYYY-MM-DD h:mm');
	 
		punto.findByIdAndUpdate(_id, {$set: {
			'direccion'  : data.direccion,
			'capacidad'  : data.capacidad,
			'observacion': data.observacion,
			'idZona'		 : data.idZona,
			'updated':   creado
		}}, callback);
	}
	desactivar(id, callback){
		let creado = moment().subtract(5, 'hours');
    creado     = moment(creado).format('YYYY-MM-DD h:mm');
	 
		punto.findByIdAndUpdate(id, {$set: {
			'activo'  	 : false,
			'updated':  creado
		}}, callback);
	}
}

module.exports = new puntoServices();