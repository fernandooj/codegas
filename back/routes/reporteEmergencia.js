let express        = require('express')
let router         = express.Router();
let fs 		       = require('fs');
let Jimp           = require("jimp");
let {promisify}    = require('util');
let moment         = require('moment-timezone');
let sizeOf    	   = promisify(require('image-size'));
let fechaImagen    = moment().tz("America/Bogota").format('YYYY_MM_DD_h:mm:ss')
const htmlTemplate = require('../notificaciones/template-email.js')
let reporteEmergenciaServices = require('../services/reporteEmergenciaServices.js') 
let userServices              = require('./../services/userServices.js') 

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS reporteS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        (req.session.usuario.acceso=="admin" || req.session.usuario.acceso=="depTecnico")
        ?reporteEmergenciaServices.get((err, reporte)=>{
            if (!err) {
                res.json({ status: true, reporte }); 
            }else{
                res.json({ status:false, message: err,  reporte:[] }); 
            }
        })
        :reporteEmergenciaServices.getByUser((err, reporte)=>{
            if (!err) {
                res.json({ status: true, reporte }); 
            }else{
                res.json({ status:false, message: err,  reporte:[] }); 
            }
        })
    }
})
 

////////////////////////////////////////////////////////////
////////////        OBTENGO UN reporteS POR TANQUE 
////////////////////////////////////////////////////////////
router.get('/byId/:tanqueId', (req,res)=>{
	reporteEmergenciaServices.getById(req.params.tanqueId, (err, reporte)=>{
		if (err) {
			res.json({ status:false, message: err, reporte:[] }); 
		}else{
			res.json({ status:true, reporte });
		}
	})
})

///////////////////////////////////////////////////////////////
////////////        OBTENGO UN reporteS POR UN Usuario
//////////////////////////////////////////////////////////////
router.get('/byUsuario/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        reporteEmergenciaServices.getByUsuario(req.params.idCliente, (err, reporte)=>{
            if (!err) {
                res.json({ status:true, reporte }); 
            }else{
                res.json({ status:false, message: err, reporte:[] }); 
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
        reporteEmergenciaServices.eliminar(req.params.idRev, req.params.estado, (err, reporte)=>{
            if (!err) {
                res.json({ status:true, reporte }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////       CREAR reporte
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgRuta  = [];
        if(req.files.imgRuta){
            let esArrayRuta = Array.isArray(req.files.imgRuta)
            if(esArrayRuta){
                req.files.imgRuta.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgRuta.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgRuta  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgRuta.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgRuta  = rutaImgRuta.length==0   ?req.body.imgRuta :rutaImgRuta;
         
        reporteEmergenciaServices.get((err, reportes)=>{
            reporteEmergenciaServices.create(req.body, req.session.usuario._id, rutaImgRuta, reportes.length+1, (err, reporte)=>{
                if (!err) {
                    res.json({ status:true, reporte }); 
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //////////////////////      ENVIO UN CORREO A DEPARTAMENTO TECNICO
                    userServices.getByAcceso("admin", (err, usuarios)=>{
                        usuarios.map(e=>{
                            let titulo = `<font size="5">Nuevo reporte de emergencia </font>`
                            let text1  = req.session.usuario.acceso=="cliente"
                                         ?`Cliente reporta <br/>codt:${req.session.usuario.codt}<br/> razon social: ${req.session.usuario.razon_social} </b>`
                                         :`Usuario reporta:<br/>Nombre:${req.session.usuario.nombre}<br/>Cedula: ${req.session.usuario.cedula} </b>`
                            let text2  = `N Reporte: ${reportes.length+1}`
                            let asunto =  "Nuevo reporte de emergencia"  
                            htmlTemplate(req, e, titulo, text1, text2,  asunto)
                        })
                    })
                    userServices.getByAcceso("depTecnico", (err, usuarios)=>{
                        usuarios.map(e=>{
                            let titulo = `<font size="5">Nuevo reporte de emergencia </font>`
                            let text1  = req.session.usuario.acceso=="cliente"
                                         ?`Cliente reporta <br/>codt:${req.session.usuario.codt}<br/> razon social: ${req.session.usuario.razon_social} </b>`
                                         :`Usuario reporta:<br/>Nombre:${req.session.usuario.nombre}<br/>Cedula: ${req.session.usuario.cedula} </b>`
                            let text2  = `N Reporte: ${reportes.length+1}`
                            let asunto =  "Nuevo reporte de emergencia"  
                            htmlTemplate(req, e, titulo, text1, text2,  asunto)
                        })
                    })                    
                }else{
                    res.json({ status:false, message: err }); 
                }
            })
        })
    }
})
  


///////////////////////////////////////////////////////////////
////////////      CERRAR reporte
//////////////////////////////////////////////////////////////
router.put('/cerrar/:reporteId', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgRutaCerrar  = [];
        if(req.files.imgRutaCerrar){
            let esArrayRuta = Array.isArray(req.files.imgRutaCerrar)
            if(esArrayRuta){
                req.files.imgRutaCerrar.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgRutaCerrar.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgRutaCerrar  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/reporteEmergencia/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgRutaCerrar.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgRutaCerrar  = rutaImgRutaCerrar.length==0   ?req.body.imgRutaCerrar :rutaImgRutaCerrar;
        reporteEmergenciaServices.cerrar(req.params.reporteId, req.body, rutaImgRutaCerrar, req.session.usuario._id, (err, reporte)=>{
            if (!err) {
                res.json({ status:true, reporte }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

 
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CAMBIO LOS TAMAÑOS DE LAS IMAGENES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ubicacionJimp =  '../front/docs/public/uploads/reporteEmergencia/'
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