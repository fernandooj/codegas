module.exports = function(server){

let io = require('socket.io')(server)
let redis = require('redis');
let cliente = redis.createClient()

cliente.subscribe('nuevoChat')

 
// io.on('connection', (socket)=>{
//  	socket.on('nuevoChat', (mensaje)=>{
// 		console.log('mensaje: ' + mensaje)
// 		io.emit('nuevoChat', JSON.parse(mensaje))
// 	})

// })

	///////////////////// CADA VEZ QUE UN USUARIO INGRESA
	cliente.on('message', (canal, info)=>{
		console.log("info")
		if (canal=='nuevoChat') {
			console.log('+++++++++++++++')
			let newInfo = JSON.parse(info)
			console.log(newInfo)
			io.emit('nuevoChat', JSON.parse(info))
		}	
	})
}