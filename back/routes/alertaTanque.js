let express = require('express')
let router = express.Router();
let fs 		   = require('fs');
let Jimp       = require("jimp");
let {promisify} = require('util');
let alertaTanqueServices = require('../services/alertaTanqueServices.js') 
let  moment = require('moment-timezone');
let sizeOf    	   = promisify(require('image-size'));
let fechaImagen = moment().tz("America/Bogota").format('YYYY_MM_DD_h:mm:ss')
const htmlTemplate     = require('../notificaciones/template-email.js')
////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS ALERTAS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        alertaTanqueServices.get((err, alerta)=>{
            if (!err) {
                res.json({ status: true, alerta }); 
            }else{
                res.json({ status:false, message: err,  alerta:[] }); 
            }
        })
    }
})
 

////////////////////////////////////////////////////////////
////////////        OBTENGO UN ALERTAS POR TANQUE 
////////////////////////////////////////////////////////////
router.get('/byTanque/:tanqueId', (req,res)=>{
	alertaTanqueServices.getByTanque(req.params.tanqueId, (err, alerta)=>{
		if (err) {
			res.json({ status:false, message: err, alerta:[] }); 
		}else{
			res.json({ status:true, alerta });
		}
	})
})

///////////////////////////////////////////////////////////////
////////////        OBTENGO UN ALERTAS POR UN Usuario
//////////////////////////////////////////////////////////////
router.get('/byUsuario/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        alertaTanqueServices.getByUsuario(req.params.idCliente, (err, alerta)=>{
            if (!err) {
                res.json({ status:true, alerta }); 
            }else{
                res.json({ status:false, message: err, alerta:[] }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      ELIMINAR
//////////////////////////////////////////////////////////////
router.get('/eliminar/:idRev/:estado', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        alertaTanqueServices.eliminar(req.params.idRev, req.params.estado, (err, alerta)=>{
            if (!err) {
                res.json({ status:true, alerta }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////       CREAR ALERTA
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        alertaTanqueServices.create(req.body, req.session.usuario._id, (err, alerta)=>{
            if (!err) {
                res.json({ status:true, alerta }); 
                 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////      ENVIO UN CORREO A CODEGAS AVINSANDOLE DEL NUEVO PEDIDO CREADO
                let userRegistrado = {email:"fernandooj@ymail.com, dpto@codegascolombia.com, gerencia@codegascolombia.com"}
                let userEnvia = "Enviado por:"+req.session.usuario.nombre
                htmlTemplate(req, userRegistrado, "Nueva alerta de tanque", req.body.alertaText, userEnvia,  "Nueva alerta de tanque")
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})
  


///////////////////////////////////////////////////////////////
////////////      CERRAR ALERTA
//////////////////////////////////////////////////////////////
router.put('/cerrar/:alertaTanqueId', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgAlertaTanque  = [];
        if(req.files.imgAlertaTanque){
            let esArrayalertaTanque = Array.isArray(req.files.imgAlertaTanque)
            if(esArrayalertaTanque){
                req.files.imgAlertaTanque.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/alertaTanque/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/alertaTanque/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgAlertaTanque.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/alertaTanque/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                    resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                })
            }else{
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/alertaTanque/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgAlertaTanque  = req.protocol+'://'+req.get('Host') + '/public/uploads/alertaTanque/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/alertaTanque/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgAlertaTanque.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgAlertaTanque  = rutaImgAlertaTanque.length==0   ?req.body.imgAlertaTanque :rutaImgAlertaTanque;
        alertaTanqueServices.cerrar(req.params.alertaTanqueId, req.body.cerradoText, rutaImgAlertaTanque, req.session.usuario._id, (err, alerta)=>{
            if (!err) {
                res.json({ status:true, alerta }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

 
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CAMBIO LOS TAMAÑOS DE LAS IMAGENES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ubicacionJimp =  '../front/docs/public/uploads/alertaTanque/'
const resizeImagenes = (ruta, randonNumber, extension, res) =>{
	Jimp.read(ruta, (err, imagen)=> {
		if(err){
			return err
		}else{
			imagen.resize(800, Jimp.AUTO)             
			.quality(90)                          
			.write(`${ubicacionJimp}Resize${fechaImagen}_${randonNumber}.${extension}`);
			// res.json({status:true,  code:1})    
		}
	});	

	setTimeout(function(){
		sizeOf(`${ubicacionJimp}Resize${fechaImagen}_${randonNumber}.${extension}`)
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
				.write(`${ubicacionJimp}Miniatura${fechaImagen}_${randonNumber}.${extension}`);
			});	
		})
	.catch(err => console.error(err));
	},2000)
}


module.exports = router;