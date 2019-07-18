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
		pedido.find({}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone direccion').populate("carroId").populate("puntoId").populate("conductorId").sort({orden: 'desc'}).exec(callback)
	}
	getByPedido(_id, callback){
		pedido.find({_id}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion').populate("carroId").populate("puntoId").populate("conductorId").sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		pedido.find({usuarioId}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion').populate("carroId").populate("puntoId").populate("conductorId").sort({_id: 'desc'}).exec(callback)
	}
	getByConductor(conductorId, fecha, callback){
		// fechaEntrega = 	fechaEntrega!="undefined" ?moment().format("YYYY-MM-DD") :fechaEntrega
		let fechaEntrega = fecha==="undefined" ?"2019-07-03" :fecha
		console.log({fechaEntrega, conductorId})
		pedido.find({conductorId, fechaEntrega}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion').populate("carroId").populate("puntoId").sort({orden: 'asc'}).exec(callback)
	}
	getByFechaEntrega(fechaEntrega,  callback){
		fechaEntrega!="undefined"
		?pedido.find({fechaEntrega}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion').populate("carroId").populate("puntoId").sort({orden: 'asc'}).exec(callback)
		:pedido.find({}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion').populate("carroId").populate("puntoId").populate("conductorId").sort({orden: 'asc'}).exec(callback)
	}
	getLastRowConductor(conductorId, fechaEntrega, callback){
		pedido.findOne({conductorId, fechaEntrega:fechaEntrega}).sort({orden: 'desc'}).exec(callback)
	}
	getLastRowConductorEntregados(conductorId, fechaEntrega, callback){
		pedido.findOne({conductorId, fechaEntrega:fechaEntrega, entregado:true}).sort({orden: 'desc'}).exec(callback)
	}
	create(data, usuarioId, usuarioCrea, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		creado = moment(creado).format("YYYY-MM-DD")
		let newPedido = new pedido({
			forma      	   : data.forma,
			cantidadKl     : data.forma=="cantidad" ?data.cantidad :0,
			cantidadPrecio : data.forma=="monto" 	?data.cantidad :0,
			frecuencia 		 : data.frecuencia,
			dia1       		 : data.dia1,
			dia2       		 : data.dia2,
			puntoId    		 : data.puntoId,
			fechaSolicitud : data.fechaSolicitud,
			pedidoPadre 	 : data.pedidoPadre,
			estado     	   :"espera",
			entregado  	   :false,
			eliminado  	   :false,
			usuarioId,
			usuarioCrea,
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
					orden_cerrado:1,
					fechaEntrega:1,
					placa:'$CarroData.placa',
					idPlaca:'$CarroData._id',
					conductor:'$ConductorData.nombre',
					cliente:'$ClienteData.nombre',
					direccion:"$ClienteData.direccion",
					// monto:'$PagoData.monto'
				},
			},
			{
				$match:{
					fechaEntrega:fecha
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
						entregado:'$entregado', eliminado:'$eliminado', fechaEntrega:'$fechaEntrega', conductor:'$conductor', cliente:'$cliente', orden:'$orden', orden_cerrado:'$orden_cerrado', direccion:'$direccion'}]}
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
  finalizar(data, activo, imagen, orden_cerrado, callback){
		console.log({orden_cerrado})
		pedido.findByIdAndUpdate(data._id, {$set: {
			'entregado'		:activo,
			'kilos'	   		:data.kilos,
			'factura'  		:data.factura,
			'valor_unitario':data.valor_unitario,
			'imagen':imagen,
			'orden_cerrado':orden_cerrado,
		}}, callback);
	}
	novedad(_id, orden_cerrado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'entregado'		:true,
			'estado'	   	:"noentregado",
			'orden_cerrado':orden_cerrado,
		}}, callback);
    }
  eliminar(_id, eliminado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarVehiculo(_id, carroId, conductorId, orden, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'carroId':carroId,
			"conductorId":conductorId,
			"orden":orden
		}}, callback);
	}
	asignarFechaEntrega(_id, fechaEntrega, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'fechaEntrega':fechaEntrega
		}}, callback) ;
	}
	editarOrden(_id, orden, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'orden':orden
		}}, callback) ;
	}
}

module.exports = new pedidoServices();