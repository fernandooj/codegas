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
	// getByCarroFecha(conductorId, fecha, callback){
	// 	console.log({conductorId, fecha})
	// 	pedido.find({conductorId, fecha}).sort({orden: 'asc'}).exec(callback)
	// }
	create(data, usuarioId, usuarioCrea, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		let newPedido = new pedido({
			forma      	   : data.forma,
			cantidadKl     : data.forma=="cantidad" ?data.cantidad :0,
			cantidadPrecio : data.forma=="monto" 	?data.cantidad :0,
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
	vehiculosConPedidos(fecha, callback){
		pedido.aggregate([
			{
				$lookup:{
					from:"carros",
					localField:"carroId",
					foreignField:"_id",
					as:"CarroData"
				}
			},
			{
				$unwind:{
					path:'$CarroData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"conductorId",
					foreignField:"_id",
					as:"ConductorData"
				}
			},
			{
				$unwind:{
					path:'$ConductorData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"usuarioId",
					foreignField:"_id",
					as:"ClienteData"
				}
			},
			{
				$unwind:{
					path:'$ClienteData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$project:{
					forma:1,
					_id:1,
					cantidadKl:1,
					cantidadPrecio:1,
					activo:1,
					entregado:1,
					eliminado:1,
					estado:1,
					orden:1,
					fechaEntrega:1,
					placa:'$CarroData.placa',
					idPlaca:'$CarroData._id',
					conductor:'$ConductorData.nombre',
					cliente:'$ClienteData.nombre',
					// conductor:"$UserData.nombre",
					// monto:'$PagoData.monto'
				},
			},
			{
				$match:{
					fechaEntrega:parseInt(fecha)
				},
			},
			{
				$sort:{
					orden:-1
				}
			},
			{
			    $group:{
						_id:{
							_id:'$placa',
							idPlaca:'$idPlaca',
						},
			      data: { $addToSet: {info:[{_id:"$_id", placa:"$placa", activo:"$activo", eliminado:'$eliminado', forma:'$forma', cantidadKl:'$cantidadKl', cantidadPrecio:'$cantidadPrecio', estado:'$estado',
						entregado:'$entregado', eliminado:'$eliminado', fechaEntrega:'$fechaEntrega', conductor:'$conductor', cliente:'$cliente', orden:'$orden'}]}
                    },
			    }
			},
		], callback)
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
	asignarVehiculo(_id, carroId, conductorId, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'carroId':carroId,
			"conductorId":conductorId
		}}, callback);
	}
	asignarFechaEntrega(_id, fechaEntrega, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'fechaEntrega':fechaEntrega
		}}, callback) ;
	}

	editarOrden(_id, orden, callback){
		console.log({_id, orden})
		pedido.findByIdAndUpdate(_id, {$set: {
			'orden':orden
		}}, callback) ;
	}
	

 
}

module.exports = new pedidoServices();