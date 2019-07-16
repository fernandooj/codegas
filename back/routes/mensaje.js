let express 	 	= require('express')
let router 		 	= express.Router();
let redis        	= require('redis')
let cliente      	= redis.createClient()
let fs 			 	= require('fs');
let moment 		 	= require('moment-timezone');
let Jimp       		= require("jimp");
let {promisify} 	= require('util');
let sizeOf    		= promisify(require('image-size'));
// let fecha 	   		= moment().format('YYYY_MM_DD_h_mm')
let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY_MM_DD_h_mm_ss a')
let mensajeServices = require('../services/mensajeServices.js') 
let conversacionServices = require('../services/conversacionServices.js')
 
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
					res.json({ status: 'SUCCESS', mensaje });
				}
			})
		}
	})
})

router.post('/', function(req,res){
	let ruta;
	let rutaJim;
	if(req.body.tipo==2){
		let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
		////////////////////    ruta que se va a guardar en el folder
		let fullUrl = '../front/docs/public/uploads/mensaje/'+fecha+'_'+randonNumber+'.jpg'
	
		////////////////////    ruta que se va a guardar en la base de datos
		ruta = req.protocol+'://'+req.get('Host') + '/public/uploads/mensaje/--'+fecha+'_'+randonNumber+'.jpg'
		rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/mensaje/'+fecha+'_'+randonNumber+'.jpg'
		///////////////////     envio la imagen al nuevo path
		fs.rename(req.files.imagen.path, fullUrl, (err)=>{console.log(err)})
		resizeImagenes(rutaJim, randonNumber, "jpg")
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
						// 		cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
						// 		res.json({ status: 'SUCCESS', conversacion });	
						// 	}
						// })
						// cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
					if(req.body.tipo==2){
						req.body["imagen"] = ruta
						req.body["usuarioId"] = {
							usuarioId:req.body.userId,
							tokenPhone:req.body.tokenPhone,
						}
					}
					let mensajeJson={
						userId:req.body.userId2, 
						badge:1
					}
					cliente.publish('chatConversacion', JSON.stringify(req.body)) 
					cliente.publish('badgeMensaje', JSON.stringify(mensajeJson)) 
					res.json({ status: 'SUCCESS', conversacion });	
				}
			})
		}
	})
})
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CAMBIO LOS TAMAÑOS DE LAS IMAGENES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ubicacionJimp =  '../front/docs/public/uploads/mensaje/'
const resizeImagenes = (ruta, randonNumber, extension) =>{
	Jimp.read(ruta, (err, imagen)=> {
		if(err){
			console.log(err)
		}else{
			imagen.resize(800, Jimp.AUTO)             
			.quality(90)                          
			.write(`${ubicacionJimp}Resize${fecha}_${randonNumber}.${extension}`);
		}
	});	

	setTimeout(function(){
		sizeOf(`${ubicacionJimp}Resize${fecha}_${randonNumber}.${extension}`)
	    .then(dimensions => { 
		  	let width  = dimensions.width
		  	let height = dimensions.height
		  	let x; 
		  	let y; 
		  	let w; 
		  	let h; 

		  	if (width>height) {
		  		console.log(1)
		  		x = (width*10)/100
			  	y = (width*10)/100
			  	w = (((height*100)/100)-y)
			  	h = (((height*100)/100)-y)
		  	}else{
				x = (height*10)/100
			  	y = (height*10)/100
			  	w = (width*90)/100
			  	h = (width*90)/100
		  	}
		  	
			Jimp.read(ruta, function (err, imagen) {
			    if (err) throw err;
			    imagen.resize(800, Jimp.AUTO)             
				.quality(90)                 
				.crop(x,y,w,h)                
				.write(`${ubicacionJimp}Miniatura${fecha}_${randonNumber}.${extension}`);
			});	
		})
	.catch(err => console.error(err));
	},2000)
}

module.exports = router;