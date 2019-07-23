module.exports = function(server){

let io = require('socket.io')(server)
let redis = require('redis');
let cliente = redis.createClient()

cliente.subscribe('nuevoChat')
cliente.subscribe('chatConversacion')
cliente.subscribe('cerrarConversacion')
cliente.subscribe('badgeCuenta')
cliente.subscribe('badgeMensaje')
cliente.subscribe('badgeConversacion')
cliente.subscribe('pedido')
cliente.subscribe('pedidoConductor')
cliente.subscribe('actualizaPedidos')
 
io.on('connection', (socket)=>{

})

	///////////////////// CADA VEZ QUE UN USUARIO INGRESA
	cliente.on('message', (canal, info)=>{
		////////	AVISA A ADMIN Y SOLUCION QUE HAY UN NUEVO CHAT ENTRANTE
		if (canal=='nuevoChat') {
			console.log('+++++++++++++++')
			let newInfo = JSON.parse(info)
			console.log(newInfo.tokenPhone)
			io.emit('nuevoChat', JSON.parse(info))
		}	
		////////	CUANDO CIERRA LA CONVERSACION SACA DEL CHAT A LOS DOS USUARIOS
		if (canal=='cerrarConversacion') {
			console.log('****************')
			 
			console.log(info)
			io.emit(`cerrarConversacion${info}`, true)
		}	
		////////	ENVIA EL MENSAJE DE LA CONVERSACION
		if (canal=='chatConversacion') {
			console.log('---------')
			console.log(info)
		   	io.emit('chatConversacion', JSON.parse(info))
		}
		////////	BADGE CUANDO SE ENVIO UN MENSAJE
		if (canal=='badgeMensaje') {
			let newInfo = JSON.parse(info)
			console.log('+++++++++++++++')
			console.log(newInfo)
			io.emit(`badgeMensaje${newInfo.userId}`, JSON.parse(newInfo.badge))
		}	
		////////	BADGE CUANDO SE CREO LA CONVERSACION
		if (canal=='badgeConversacion') {
			let newInfo = JSON.parse(info)
			console.log('+++++++++++++++')
			console.log(newInfo)
			io.emit(`badgeConversacion`, JSON.parse(newInfo.badge))
		}	
		////////	NOTIFICA DEL NUEVO PEDIDO CON BADGE PARA ADMIN Y SOLUCIONES, ESTO EN FOOTER  
		if (canal=='pedido') {
			let newInfo = JSON.parse(info)
			console.log('***************')
			console.log(newInfo)
			io.emit(`pedido`, JSON.parse(newInfo.badge))
		}	
		////////	ENVIA AL CONDUCTOR EL BADGE QUE TIENE NUEVA NOTIFICACION
		if (canal=='pedidoConductor') {
			let newInfo = JSON.parse(info)
			console.log('.............')
			console.log(newInfo)
			io.emit(`PedidoConductor${newInfo.idConductor}`, JSON.parse(newInfo.badge))
		}	
		////////	ACTUALIZA LOS PEDIDOS CADA VEZ QUE SE CAMBIE LA INFORMACION DE ALGUNO, COMO SI SE CIERRAN, O SE ACTUALIZAN
		////////	ESTO POR SI CAMBIAN EL ORDEN DE PEDIDOS, LOS DEMAS SEPAN, PERO FUNCIONA EN CUALQUIER CASO
		if (canal=='actualizaPedidos') {
			// let newInfo = JSON.parse(info)
			// console.log('***************')
			// console.log(newInfo)
			io.emit(`actualizaPedidos`, true)
		}		
		////////	BADGE CUANDO SE ENVIO UN MENSAJE
		   // if (canal=='badgeCuenta') {
		// 	let newInfo = JSON.parse(info)
		// 	console.log('_____________')
		// 	console.log(newInfo)
		// 	io.emit(`badgeCuenta${newInfo.userId}`, JSON.parse(newInfo.badge))
		// }
	})
}