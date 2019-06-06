let express = require('express')
let router = express.Router();
let redis        = require('redis')
let cliente      = redis.createClient()
let fs = require('fs');
let  moment = require('moment-timezone');
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

router.get('/:conversacionId', (req,res)=>{
	mensajeServices.getByConversacionId(req.params.conversacionId, (err, mensaje)=>{
		if (err) {	
			res.json({ status: 'FAIL', message: err }); 
		}else{
			conversacionServices.getById(req.params.conversacionId, (err, conversacion)=>{
				if(err){
					res.json({ status: 'FAIL', message: err }); 
				}else{				 
					res.json({ status: 'SUCCESS',   mensaje });
				}
			})
		}
	})
})

router.post('/', function(req,res){
	let ruta;
	if(req.body.tipo==2){
		let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
		let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD_h:mm:ss')
		////////////////////    ruta que se va a guardar en el folder
		let fullUrl = '../front/docs/uploads/mensaje/'+fecha+'_'+randonNumber+'.jpg'
	
		////////////////////    ruta que se va a guardar en la base de datos
		ruta = req.protocol+'://'+req.get('Host') + '/uploads/mensaje/'+fecha+'_'+randonNumber+'.jpg'
	
		///////////////////     envio la imagen al nuevo path
		fs.rename(req.files.imagen.path, fullUrl, (err)=>{console.log(err)})
	}


	mensajeServices.create(req.body, ruta, (err, titulo)=>{
		if (err) {
			res.json({ status: 'FAIL', message: err }); 
		}else{
			conversacionServices.getById(req.body.conversacionId, (err2, conversacion)=>{
				if (err2) {
					res.json({ status: 'FAIL', message: err }); 
				}else{
					
					//////// envio el badge
					let data={username:req.body.email}
						
					// userServices.getEmail(data, (err3, users)=>{
					// 	if(!err3){
					// 		let mensajeJson={
					// 			userId:users._id, 
					// 			badge:1
					// 		}
					// 		cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
					// 		res.json({ status: 'SUCCESS', conversacion });	
					// 	}
					// })
					// cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
					req.body["imagen"] = ruta
					cliente.publish('chatConversacion', JSON.stringify(req.body)) 
					res.json({ status: 'SUCCESS', conversacion });	
				}
			})
		}
	})
})
 

module.exports = router;