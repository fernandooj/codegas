let express = require('express')
let router = express.Router();
let redis        = require('redis')
let cliente      = redis.createClient()

let mensajeServices = require('../services/mensajeServices.js') 
let conversacionServices = require('../services/conversacionServices.js')
let userServices = require('../services/userServices.js') 
const htmlTemplate = require('../template-email.js')

 
router.get('/', (req,res)=>{
	mensajeServices.get((err, titulo)=>{
		if (!err) {
			res.json({ status: 'SUCCESS', titulo }); 
		}else{
			res.json({ status: 'FAIL', message: err }); 
		}
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////		OBTIENE LAS CONVERSACIONES DE UN USUARIO POR SU ID
////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/byUser', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: 'FAIL', message: 'No hay un usuario logueado' }); 
	}else{
		let id =  req.session.usuario._id
		conversacionServices.getByUser(id, (err, conversaciones)=>{
			if (!err) {
				res.json({ status: 'SUCCESS', conversaciones }); 
			}else{
				res.json({ status: 'FAIL', message: err }); 
			}
		})
	}
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////		OBTIENE LAS CONVERSACIONES DE UN USUARIO POR SU TOKEN
////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/byTokenPhone/:tokenPhone/:activo/:nombre/:celular', (req,res)=>{
	conversacionServices.getByToken(req.params.tokenPhone, req.params.activo, (err, mensaje)=>{
		if (mensaje) {
			res.json({ status: true, mensaje }); 
		}else{
			let mensajeJson={
				tokenPhone:req.params.tokenPhone, 
				nombre:req.params.nombre,
				celular:req.params.celular
			}
			cliente.publish('nuevoChat', JSON.stringify(mensajeJson)) 
			res.json({ status:false }); 
		}
	})
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////		OBTIENE UNA CONVERSACION POR SU ID
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
router.get('/:conversacionId', (req,res)=>{
	conversacionServices.getById(req.params.conversacionId, (err, conversacion)=>{
		if(err){
			res.json({ status: 'FAIL', message: err }); 
		}else{
			res.json({ status: 'SUCCESS', conversacion });
		}
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////		CREA UNA NUEVA CONVERSACION
////////////////////////////////////////////////////////////////////////////////////////////////	
router.post('/', function(req,res){
	if (!req.session.usuario) {
		res.json({ status: 'FAIL', message: 'No hay un usuario logueado' }); 
	}else{
		userServices.create(req.body, 1010, (err, user)=>{
			if(err){
				res.json({ err, status:false })
			}else{
				conversacionServices.create(req.body, req.session.usuario._id, user._id, (err2, conversacion)=>{
					if(err2){
						res.json({ err, status:false })
					}else{
						res.json({ status:true, conversacion })
					}
				})  
			}
		})  
	}
		// conversacionServices.getById(req.params.conversacionId, function(err, conversacion){
		// 	if (err) {
		// 		res.json({ status: 'FAIL', message: err }); 
		// 	}else{
		// 		// let text1 = `<font size="5">tienes un nuevo mensaje de ${req.session.usuario.nombre}, contestale lo más pronto posible <br/>${req.body.mensaje}</font>`;
		// 		// let boton = `ver_mensaje`;
		// 		// let text2 = `Héchale una ojeada a los libros que <font size=6 color="#000000">${req.session.usuario.nombre}</font> ha publicado <a href="${req.protocol+'://'+req.get('Host')}/#/usuario/${req.session.usuario._id}">Aqui</a>`
		// 		// let url1  = `#/conversacion/${req.params.conversacionId}`
				
		// 		// htmlTemplate(req, req.body, text1, boton, text2, url1, "Tienes un nuevo mensaje")
				
		// 		//////// envio el badge
		// 		let data={username:req.body.email}
					
		// 		userServices.getEmail(data, (err3, users)=>{
		// 			if(!err3){
		// 				let mensajeJson={
		// 					userId:users._id, 
		// 					badge:1
		// 				}
		// 				cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
		// 				res.json({ status: 'SUCCESS', conversacion });	
		// 			}
		// 		})
		// 	}
		// })
})
 

module.exports = router;