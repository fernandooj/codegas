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
router.get('/byTokenPhone/:tokenPhone/:activo/:nombre/:email/:celular', (req,res)=>{
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
})


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////		CIERRO LA CONVERSACION
////////////////////////////////////////////////////////////////////////////////////////////////	
router.post('/cerrar/:idConversacion', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: 'FAIL', message: 'No hay un usuario logueado' }); 
	}else{
		conversacionServices.cerrar(req.params.idConversacion, (err2, conversacion)=>{
			if(err2){
				res.json({ err, status:false })
			}else{
				cliente.publish('cerrarConversacion', req.params.idConversacion) 
				res.json({ status:true, conversacion })
			}
		})  
	}
})
 

module.exports = router;