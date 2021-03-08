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
		pedido.find({})
		.populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone direccion codt valorUnitario')
		.populate("carroId")
		.populate("puntoId")
		.populate("conductorId")
		.populate("usuarioAsigna")
		.populate("usuarioAsignaVehiculo")
		.populate("zonaId")
		.sort({orden: 'desc'}).exec(callback)
	}
	totalPedidos(callback){
		pedido.count({}, callback)
	}
	getByPedido(_id, callback){
		pedido.find({_id}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion valorUnitario').populate("carroId").populate("puntoId").populate("conductorId").limit(1000).sort({_id: 'desc'}).exec(callback)
	}
	getByUser(usuarioId, callback){
		pedido.find({usuarioId, eliminado:false}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion, valorUnitario').populate("carroId").populate("puntoId").populate("conductorId").limit(1000).populate("zonaId").populate("usuarioCrea").sort({_id: 'desc'}).exec(callback)
	}
	getByUserPuntoDate(usuarioId, puntoId, callback){
		pedido.find({usuarioId, puntoId, eliminado:false}).exec(callback)
	}
	getByConductor(conductorId, fecha, callback){
		let fechaHoy = moment().subtract(5, 'hours');
		let fechaEntrega = 	fecha==="undefined" ?moment(fechaHoy).format('YYYY-MM-DD') :fecha
		pedido.find({conductorId, fechaEntrega, eliminado:false}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion, valorUnitario').populate("carroId").populate("puntoId").sort({orden: 'asc'}).populate("zonaId").populate("usuarioCrea").exec(callback)
	}
	getByFechaEntrega(fechaEntrega, limit, callback){
		limit = parseInt(limit)
		console.log({limit})
		// limit = limit*20
		fechaEntrega!="undefined"
		?pedido.find({fechaEntrega, eliminado:false}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion valorUnitario comercialAsignado').populate("carroId").populate("puntoId").populate("usuarioCrea").limit(limit).sort({orden: 'asc'}).exec(callback)
		:pedido.find({eliminado:false}).populate('usuarioId', 'email _id acceso nombre cedula celular razon_social tokenPhone codt direccion valorUnitario comercialAsignado').populate("carroId").populate("puntoId").populate("zonaId").populate("usuarioCrea").populate("conductorId").limit(limit).sort({_id: 'desc'}).exec(callback)
	}
	getLastRowConductor(conductorId, fechaEntrega, callback){
		pedido.findOne({conductorId, fechaEntrega:fechaEntrega}).sort({orden: 'desc'}).exec(callback)
	}
	getLastRowConductorEntregados(conductorId, fechaEntrega, callback){
		pedido.findOne({conductorId, fechaEntrega:fechaEntrega, entregado:true}).sort({orden: 'desc'}).exec(callback)
	}
	create(data, usuarioId, usuarioCrea, nPedido, imagen, valorUnitario, callback){
		// let fechaHoy = moment().subtract(5, 'hours');
		// fechaHoy     = moment(fechaHoy).format('YYYY-MM-DD')
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss')
 
		let creado = moment(fecha).valueOf()
		creado = moment(creado).format("YYYY-MM-DD h:mm")
		let newPedido = new pedido({
			forma      	   : data.forma,
			cantidadKl     : data.forma=="cantidad" ?data.cantidad :0,
			cantidadPrecio : data.forma=="monto" 	?data.cantidad :0,
			frecuencia 		 : data.frecuencia,
			dia1       		 : data.dia1,
			dia2       		 : data.dia2,
			puntoId    		 : data.puntoId,
			zonaId    		 : data.idZona,
			creado			 	 : data.creado,
			fechaSolicitud : data.fechaSolicitud,
			pedidoPadre    : data.pedidoPadre,
			estado     	   :"espera",
			entregado  	   :false,
			eliminado  	   :false,
			usuarioId,
			usuarioCrea,
			nPedido,
			imagen,
			valorUnitario
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
				$lookup:{
					from:"puntos",
					localField:"puntoId",
					foreignField:"_id",
					as:"PuntoData"
				}
			},
			{
				$unwind:{
					path:'$PuntoData',
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
					nPedido:1,
					placa:'$CarroData.placa',
					idPlaca:'$CarroData._id',
					conductor:'$ConductorData.nombre',
					conductorId:'$ConductorData._id',
					cliente:'$ClienteData.nombre',
					direccion:"$PuntoData.direccion",
					razon_social:"$ClienteData.razon_social",
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
						entregado:'$entregado', eliminado:'$eliminado', nPedido:'$nPedido', fechaEntrega:'$fechaEntrega', razon_social:'$razon_social', conductor:'$conductor', cliente:'$cliente', orden:'$orden', orden_cerrado:'$orden_cerrado', direccion:'$direccion', conductorId:"$conductorId"}]}
                    },
			    }
			},
		], callback)
	}  

  cambiarEstado(idUsuario, _id, estado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'estado':estado,
			'entregado':false,
			'usuarioAsigna':idUsuario,
			'kilos':null,
		}}, callback);
  }
  finalizar(data, activo, imagen, orden_cerrado, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let valor_total = data.valor_total.split('.').join("").split(',').join("") 
		pedido.findByIdAndUpdate(data._id, {$set: {
			'entregado'			: activo,
			'kilos'	   			: data.kilos,
			'factura'  			: data.factura,
			'valor_total'	  : valor_total,
			'forma_pago'		: data.forma_pago,
			'remision'			: data.remision,
			'imagenCerrar'	: imagen,
			'orden_cerrado'	: orden_cerrado,
			'fechaEntregado': fecha
		}}, callback);
	}
	novedad(_id, orden_cerrado, motivo_no_cierre, perfil_novedad, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		pedido.findByIdAndUpdate(_id, {$set: {
			'entregado'		:true,
			'estado'	   	:"noentregado",
			'orden_cerrado':orden_cerrado,
			'motivo_no_cierre':motivo_no_cierre,
			'perfil_novedad':perfil_novedad,
			'fechaEntregado':fecha
		}}, callback);
  }
  eliminar(_id, eliminado, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'eliminado':eliminado
		}}, callback);
	}
	asignarVehiculo(idUsuario, _id, carroId, conductorId, orden, callback){
		pedido.findByIdAndUpdate(_id, {$set: {
			'carroId':carroId,
			"conductorId":conductorId,
			"orden":orden,
			"usuarioAsignaVehiculo":idUsuario,
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
	editarValorUnitario(_id, valorUnitario, callback){
		console.log({_id, valorUnitario})
		pedido.findByIdAndUpdate(_id, {$set: {
			'valorUnitario':valorUnitario
		}}, callback) ;
	}
}

module.exports = new pedidoServices();