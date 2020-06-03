let express = require('express')
let router = express.Router();
let fs 		   = require('fs');
let Jimp       = require("jimp");
let {promisify} = require('util');
let tanqueServices  = require('../services/tanqueServices.js') 
let userServices    = require('./../services/userServices.js') 
let  moment         = require('moment-timezone');
let sizeOf    	    = promisify(require('image-size'));
let fechaImagen     = moment().tz("America/Bogota").format('YYYY_MM_DD_h:mm:ss')
const htmlTemplate     = require('../notificaciones/template-email.js')
////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS TANQUES
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado', tanque:[] }); 
    }else{
        req.session.usuario.acceso=="admin" || req.session.usuario.acceso=="adminTanque"
        ?tanqueServices.get((err, tanque)=>{
            if (!err) {
                res.json({ status: true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
        :tanqueServices.getAlerta((err, tanque)=>{
            if (!err) {
                res.json({ status: true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
        
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS ACTIVOS
////////////////////////////////////////////////////////////
router.get('/no_eliminados', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado',  tanque:[] }); 
    }else{
        tanqueServices.getNoEliminados((err, tanque)=>{
            if (!err) {
                res.json({ status: true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UN tanque POR SU ID
////////////////////////////////////////////////////////////
router.get('/byId/:revisionId', (req,res)=>{
	tanqueServices.getById(req.params.revisionId, (err, tanque)=>{
		if (err) {
			res.json({ status:false, message: err, tanque:[] }); 
		}else{
			res.json({ status:true, tanque });
		}
	})
})



///////////////////////////////////////////////////////////////
////////////        OBTENGO UN tanque POR UN Usuario
//////////////////////////////////////////////////////////////
router.get('/byUsuario/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.getByUsuario(req.params.idCliente, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err, tanque:[] }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////        OBTENGO LOS TANQUES POR SU PUNTO
//////////////////////////////////////////////////////////////
router.get('/byPunto/:idPunto', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.getByPunto(req.params.idPunto, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err, tanque:[] }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UN Usuario
//////////////////////////////////////////////////////////////
router.get('/asignarUsuario/:idtanque/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.asignarUsuario(req.params.idtanque, req.params.idCliente, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////      LO REASIGNO A UN NUEVO PUNTO Y USUARIO
//////////////////////////////////////////////////////////////
router.get('/asignarPunto/:idtanque/:idCliente/:idPunto', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.asignarPunto(req.params.idtanque, req.params.idCliente, req.params.idPunto, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////      ENVIAR NOTIFICACION DE QUE EL TANQUE NO ESTA PARA 
//////////////////////////////////////////////////////////////
router.get('/notificacionDesvincularUsuario/:placaText/:codtCliente/:razon_socialCliente/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        userServices.getByAcceso("adminTanque", (err, usuarios)=>{
            usuarios.map(e=>{
                let titulo = `<font size="5">El tanque con codigo activo :<b>${req.params.placaText}</b> no se encontro </font>`
                let text1  = `Cliente asignado actualmente :<b>codt:${req.params.codtCliente}, razon social: ${req.params.razon_socialCliente} </b>`
                let text2  = `Usuario que genero información: ${req.session.usuario.nombre}`
                let asunto =  "Tanque no se encontro en el cliente"  
                htmlTemplate(req, e, titulo, text1, text2,  asunto)
            })
        })
        userServices.getByAcceso("admin", (err, usuarios)=>{
            usuarios.map(e=>{
                let titulo = `<font size="5">El tanque con codigo activo :<b>${req.params.placaText}</b> no se encontro </font>`
                let text1  = `Cliente asignado actualmente :<b>codt:${req.params.codtCliente}, razon social: ${req.params.razon_socialCliente} </b>`
                let text2  = `Usuario que genero información: ${req.session.usuario.nombre}`
                let asunto =  "Tanque no se encontro en el cliente"  
                htmlTemplate(req, e, titulo, text1, text2,  asunto)
            })
        })
        res.json({ status:true }); 
    }
})


///////////////////////////////////////////////////////////////
////////////      DESVINCULA UN Usuario
//////////////////////////////////////////////////////////////
router.get('/desvincularUsuario/:idTanque/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.desvincularUsuario(req.params.idTanque,  (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})



///////////////////////////////////////////////////////////////
////////////       CAMBIAR ESTADO
//////////////////////////////////////////////////////////////
router.get('/cambiarEstado/:idPedido/:estado', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.cambiarEstado(req.params.idPedido, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      ELIMINAR
//////////////////////////////////////////////////////////////
router.get('/eliminar/:idVehiculo/:estado', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.eliminar(req.params.idVehiculo, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////       GUARDO UN tanque
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado', code:0 }); 
	}else{
        tanqueServices.create(req.body, req.session.usuario._id, (err2, tanque)=>{
            if (!err2) {
                res.json({ status: true, tanque });	
            } 
        })   
	}
})


///////////////////////////////////////////////////////////////
////////////      EDITAR
//////////////////////////////////////////////////////////////
router.put('/:idTanque/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.editar(req.params.idTanque, req.body, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////      GUARDAR COORDENADAS
//////////////////////////////////////////////////////////////
router.put('/coordenadas/:idVehiculo/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.geo(req.params.idVehiculo, req.body, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})



///////////////////////////////////////////////////////////////
////////////      GUARDAR IMAGEN
//////////////////////////////////////////////////////////////
router.put('/guardarImagen/:idTanque/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgPlaca              = [];
        let rutaImgPlacaMantenimiento = [];
        let rutaImgPlacaFabricante    = [];
        let rutaImgVisual             = [] 
 
        
        if(req.files.imgPlaca){
            let esArrayInstalacion = Array.isArray(req.files.imgPlaca)
            if(esArrayInstalacion){
                req.files.imgPlaca.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgPlaca.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgPlaca  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgPlaca.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
           
        }

        if(req.files.imgPlacaMantenimiento){
            let esArrayInstalacion = Array.isArray(req.files.imgPlacaMantenimiento)
            if(esArrayInstalacion){
                req.files.imgPlacaMantenimiento.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgPlacaMantenimiento.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgPlacaMantenimiento  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgPlacaMantenimiento.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

        if(req.files.imgPlacaFabricante){
            let esArrayInstalacion = Array.isArray(req.files.imgPlacaFabricante)
            if(esArrayInstalacion){
                req.files.imgPlacaFabricante.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgPlacaFabricante.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgPlacaFabricante  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgPlacaFabricante.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

        if(req.files.imgVisual){
            let esArrayVisual = Array.isArray(req.files.imgVisual)
            if(esArrayVisual){
                req.files.imgVisual.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgVisual.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgVisual  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgVisual.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgPlaca              = rutaImgPlaca.length==0              ?req.body.imgPlaca              :rutaImgPlaca;
        rutaImgPlacaMantenimiento = rutaImgPlacaMantenimiento.length==0 ?req.body.imgPlacaMantenimiento :rutaImgPlacaMantenimiento;
        rutaImgVisual             = rutaImgVisual.length==0             ?req.body.rutaImgVisual         :rutaImgVisual;
        tanqueServices.editarImagen(req.params.idTanque,  rutaImgPlaca, rutaImgPlacaMantenimiento, rutaImgPlacaFabricante, rutaImgVisual, (err, tanque)=>{
            if (!err) {
               
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

router.put('/uploadPdf/:idTanque/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgDossier            = []
        let rutaImgCerFabricante      = []
        let rutaImgCerOnac            = [] 
   
        let {imgDossier} = req.files
        if(imgDossier){
            let esArrayimgDossier = Array.isArray(imgDossier)
            if(esArrayimgDossier){
                imgDossier.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/'+fechaImagen+'--'+e.name
                    rutaImgDossier.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/'+fechaImagen+'--'+imgDossier.name
                let rutas = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/'+fechaImagen+'--'+imgDossier.name
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgDossier.push(rutas)
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgDossier.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }
        let {imgCerFabricante} = req.files
        if(imgCerFabricante){
            let esArrayimgCerFabricante = Array.isArray(imgCerFabricante)
            if(esArrayimgCerFabricante){
                imgCerFabricante.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/'+fechaImagen+'--'+e.name
                    rutaImgCerFabricante.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/'+fechaImagen+'--'+imgCerFabricante.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                let ruta =req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/'+fechaImagen+'--'+imgCerFabricante.name 
                rutaImgCerFabricante.push(ruta)
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgCerFabricante.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }

        let {imgCerOnac} = req.files
        if(imgCerOnac){
            let esArrayimgCerOnac = Array.isArray(imgCerOnac)
            if(esArrayimgCerOnac){
                imgCerOnac.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/'+fechaImagen+'--'+e.name
                    rutaImgCerOnac.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/tanques/'+fechaImagen+'--'+imgCerOnac.name
                let rutas =  req.protocol+'://'+req.get('Host') + '/public/uploads/tanques/'+fechaImagen+'--'+imgCerOnac.name
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgCerOnac.push(rutas)
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgCerOnac.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }
        let dossier          = req.body.dossier        ?JSON.parse(req.body.dossier)       :[]
        let cerFabricante    = req.body.cerFabricante  ?JSON.parse(req.body.cerFabricante) :[]
        let cerOnac          = req.body.cerOnac        ?JSON.parse(req.body.cerOnac)       :[]     
       
        rutaImgDossier            = rutaImgDossier.length==0        ?dossier        :rutaImgDossier.concat(dossier);
        rutaImgCerFabricante      = rutaImgCerFabricante.length==0  ?cerFabricante  :rutaImgCerFabricante.concat(cerFabricante);
        rutaImgCerOnac            = rutaImgCerOnac.length==0        ?cerOnac        :rutaImgCerOnac.concat(cerOnac);
  
       
        tanqueServices.subirPdf(req.params.idTanque,   rutaImgDossier, rutaImgCerFabricante, rutaImgCerOnac, (err, tanque)=>{
            if (!err) {
               
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CAMBIO LOS TAMAÑOS DE LAS IMAGENES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ubicacionJimp =  '../front/docs/public/uploads/tanques/'
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