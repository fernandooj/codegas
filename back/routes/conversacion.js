let express = require('express')
let router = express.Router();
let redis        = require('redis')
let cliente      = redis.createClient()

let mensajeServices = require('../services/mensajeServices.js') 
let conversacionServices = require('../services/conversacionServices.js')
let userServices = require('../services/userServices.js') 
const htmlTemplate = require('../template-email.js')
const notificacionPush = require('../notificacionPush.js')
 
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
router.get('/byTokenPhone/:tokenPhone/:activo/:nombre/:email/:celular/:enviaNotificacion', (req,res)=>{
	conversacionServices.getByToken(req.params.tokenPhone, req.params.activo, (err, mensaje)=>{
		if (mensaje) {
			res.json({ status: true, mensaje }); 
		}else{
			let mensajeJson={
				tokenPhone:req.params.tokenPhone, 
				nombre:req.params.nombre,
				celular:req.params.celular
			}
			let mensajeBadge={
				badge:1
			}
			cliente.publish('nuevoChat', JSON.stringify(mensajeJson)) 
			cliente.publish('badgeConversacion', JSON.stringify(mensajeBadge)) 
			if(req.params.enviaNotificacion=="true"){
				enviaNotificacion(res, "admin", "Nuevo Chat entrante", `${req.params.nombre}, ha entrado `)
			}
			res.json({ status:false }); 
		}
	})
})

const enviaNotificacion=(res, acceso, titulo, body)=>{
    userServices.getByAcceso(acceso, (err, usuarios)=>{
        if(!err){
            usuarios.map(e=>{
                notificacionPush(e.tokenPhone, titulo, body)
            })
            
        }else{
            res.json({ status:false, usuarios:[], err}) 
        }
    })
}

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
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: 'FAIL', message: 'No hay un usuario logueado' }); 
	}else{
		userServices.create(req.body, 1010, null, (err, user)=>{
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
		conversacionServices.getById(req.params.idConversacion, (err, conversacion1)=>{
			if(!err){
				conversacionServices.cerrar(req.params.idConversacion, conversacion1.creado, (err2, conversacion)=>{
					if(err2){
						res.json({ err, status:false })
					}else{
						cliente.publish('cerrarConversacion', req.params.idConversacion) 
						res.json({ status:true, conversacion })
					}
				})  
			}
		})
	}
})
 

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////		CREA UNA NUEVA CONVERSACION
////////////////////////////////////////////////////////////////////////////////////////////////	
router.get('/actualizaBadge/:conversacionId', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: 'FAIL', message: 'No hay un usuario logueado' }); 
	}else{
		userServices.create(req.body, 1010, null, (err, user)=>{
			if(err){
				res.json({ err, status:false })
			}else{
				conversacionServices.actualizaBagde(req.params.conversacionId, 0, (err2, conversacion)=>{
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

module.exports = router;