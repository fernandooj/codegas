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
router.get('/byUser/:idUser', (req,res)=>{
	let id = req.params.idUser!="null" ?req.params.idUser :req.session.usuario._id 
	mensajeServices.getByUser(id, (err, mensaje)=>{
		if (!err) {
			res.json({ status: 'SUCCESS', mensaje }); 
		}else{
			res.json({ status: 'FAIL', message: err }); 
		}
	})
})

router.get('/:conversacionId', function(req,res){
	mensajeServices.getByConversacionId(req.params.conversacionId, function(err, mensaje){
		if (err) {
			res.json({ status: 'FAIL', message: err }); 
		}else{
			conversacionServices.getById(req.params.conversacionId, function(err, conversacion){
				if(err){
					res.json({ status: 'FAIL', message: err }); 
				}else{
					// let usuario = req.session.usuario.email==conversacion[0].userData.email ?conversacion[0].userData2.email :conversacion[0].userData.email
					
					 
				 
					res.json({ status: 'SUCCESS',   mensaje });
				}
			})
		}
	})
})

router.post('/:conversacionId', function(req,res){
	if (!req.session.usuario) {
		res.json({ status: 'FAIL', message: 'No hay un usuario logueado' }); 
	}else{
		mensajeServices.create(req.body, req.session.usuario._id, req.params.conversacionId, function(err, titulo){
			if (!err) {
				conversacionServices.getById(req.params.conversacionId, function(err, conversacion){
					if (err) {
						res.json({ status: 'FAIL', message: err }); 
					}else{
						let text1 = `<font size="5">tienes un nuevo mensaje de ${req.session.usuario.nombre}, contestale lo más pronto posible <br/>${req.body.mensaje}</font>`;
						let boton = `ver_mensaje`;
						let text2 = `Héchale una ojeada a los libros que <font size=6 color="#000000">${req.session.usuario.nombre}</font> ha publicado <a href="${req.protocol+'://'+req.get('Host')}/#/usuario/${req.session.usuario._id}">Aqui</a>`
						let url1  = `#/conversacion/${req.params.conversacionId}`
						
						htmlTemplate(req, req.body, text1, boton, text2, url1, "Tienes un nuevo mensaje")
						
						//////// envio el badge
						let data={username:req.body.email}
						 
						userServices.getEmail(data, (err3, users)=>{
							if(!err3){
								let mensajeJson={
									userId:users._id, 
									badge:1
								}
								cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
								res.json({ status: 'SUCCESS', conversacion });	
							}
						})
					}
				})
				
				
				 
			}else{
				res.json({ status: 'FAIL', message: err }); 
			}
		})
	}
})
 

module.exports = router;