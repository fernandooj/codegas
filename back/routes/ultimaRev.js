let express = require('express')
let router = express.Router();
let fs 		   = require('fs');
let Jimp       = require("jimp");
let {promisify} = require('util');
let ultimaRevServices = require('../services/ultimaRevServices.js') 
let  moment = require('moment-timezone');
let sizeOf    	   = promisify(require('image-size'));
let fechaImagen = moment().tz("America/Bogota").format('YYYY_MM_DD_h:mm:ss')
const htmlTemplate     = require('../notificaciones/template-email.js')
////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS revisionS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        ultimaRevServices.get((err, revision)=>{
            if (!err) {
                res.json({ status: true, revision }); 
            }else{
                res.json({ status:false, message: err,  revision:[] }); 
            }
        })
    }
})
 

////////////////////////////////////////////////////////////
////////////        OBTENGO UN revision POR TANQUE 
////////////////////////////////////////////////////////////
router.get('/byTanque/:tanqueId', (req,res)=>{
	ultimaRevServices.getByTanque(req.params.tanqueId, (err, revision)=>{
		if (err) {
			res.json({ status:false, message: err, revision:[] }); 
		}else{
			res.json({ status:true, revision });
		}
	})
})

///////////////////////////////////////////////////////////////
////////////        OBTENGO UN revision POR UN Usuario
//////////////////////////////////////////////////////////////
router.get('/byUsuario/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        ultimaRevServices.getByUsuario(req.params.idCliente, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err, revision:[] }); 
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
        ultimaRevServices.eliminar(req.params.idRev, req.params.estado, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})
  
///////////////////////////////////////////////////////////////
////////////      CREO LA REVISION 
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgUltimaRev  = [];
        if(req.files.imgUltimaRev){
            let esArrayUltimaRev = Array.isArray(req.files.imgUltimaRev)
            if(esArrayUltimaRev){
                req.files.imgUltimaRev.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/ultimaRev/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/ultimaRev/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgUltimaRev.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/ultimaRev/Original'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/ultimaRev/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgUltimaRev  = req.protocol+'://'+req.get('Host') + '/public/uploads/ultimaRev/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/ultimaRev/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgUltimaRev.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgUltimaRev  = rutaImgUltimaRev.length==0   ?req.body.imgUltimaRev :rutaImgUltimaRev;
        ultimaRevServices.create(req.body, rutaImgUltimaRev, req.session.usuario._id, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

 
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CAMBIO LOS TAMAÑOS DE LAS IMAGENES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ubicacionJimp =  '../front/docs/public/uploads/ultimaRev/'
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