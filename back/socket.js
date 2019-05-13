module.exports = function(server){

let io = require('socket.io')(server)
let redis = require('redis');
let cliente = redis.createClient()

cliente.subscribe('conversacion')

 
io.on('connection', (socket)=>{
 	socket.on('chatConversacion', (mensaje)=>{
		console.log('mensaje: ' + mensaje)
		io.emit('chatConversacion', JSON.parse(mensaje))
	})

})

	///////////////////// CADA VEZ QUE UN USUARIO INGRESA
	cliente.on('message', (canal, info)=>{
		console.log(info)
		if (canal=='conversacion') {
			console.log('+++++++++++++++')
			let newInfo = JSON.parse(info)
			console.log(newInfo)
		io.emit('message'+newInfo.idUsuario, JSON.parse(info))
		}	
	})
}