module.exports = function(server){

let io = require('socket.io')(server)
let redis = require('redis');
let cliente = redis.createClient()

cliente.subscribe('nuevoChat')
cliente.subscribe('chatConversacion')
cliente.subscribe('cerrarConversacion')
 
io.on('connection', (socket)=>{
	socket.on('chatConversacion', (mensaje)=>{
		console.log('---------')
		console.log(mensaje)
	   io.emit('chatConversacion', JSON.parse(mensaje))
   })
})

	///////////////////// CADA VEZ QUE UN USUARIO INGRESA
	cliente.on('message', (canal, info)=>{
		if (canal=='nuevoChat') {
			console.log('+++++++++++++++')
			let newInfo = JSON.parse(info)
			console.log(newInfo.tokenPhone)
			io.emit('nuevoChat', JSON.parse(info))
		}	
		if (canal=='cerrarConversacion') {
			console.log('****************')
			 
			console.log(info)
			io.emit(`cerrarConversacion${info}`, true)
		}	
		
	})
}