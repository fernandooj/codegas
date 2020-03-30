let express = require('express')
let router = express.Router();
let fs 		   = require('fs');
let Jimp       = require("jimp");
let {promisify} = require('util');
let revisionServices = require('../services/revisionServices.js') 
let  moment = require('moment-timezone');
let sizeOf    	   = promisify(require('image-size'));
let fechaImagen = moment().tz("America/Bogota").format('YYYY_MM_DD_h:mm:ss')
////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS revisionS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        req.session.usuario.acceso=="admin"
        ?revisionServices.get((err, revision)=>{
            if (!err) {
                res.json({ status: true, revision }); 
            }else{
                res.json({ status:false, message: err,  revision:[] }); 
            }
        })
        :revisionServices.getByUser((err, revision)=>{
            if (!err) {
                res.json({ status: true, revision }); 
            }else{
                res.json({ status:false, message: err,  revision:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS ACTIVOS
////////////////////////////////////////////////////////////
router.get('/no_eliminados', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado',  revision:[] }); 
    }else{
        revisionServices.getNoEliminados((err, revision)=>{
            if (!err) {
                res.json({ status: true, revision }); 
            }else{
                res.json({ status:false, message: err,  revision:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UN revision POR SU ID
////////////////////////////////////////////////////////////
router.get('/byId/:revisionId', (req,res)=>{
	revisionServices.getById(req.params.revisionId, (err, revision)=>{
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
        revisionServices.getByUsuario(req.params.idCliente, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err, revision:[] }); 
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
        revisionServices.cambiarEstado(req.params.idPedido, req.params.estado, (err, pedido)=>{
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
        revisionServices.eliminar(req.params.idVehiculo, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////       GUARDO UN revision
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado', code:0 }); 
	}else{
        revisionServices.get((err, revisions)=>{
            revisionServices.create(revisions.length+1, req.body, req.session.usuario._id, (err2, revision)=>{
                if (!err2) {
                    res.json({ status: true, revision });	
                } 
            })
        })
	}
})


///////////////////////////////////////////////////////////////
////////////      EDITAR
//////////////////////////////////////////////////////////////
router.put('/:idRevision/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        revisionServices.editar(req.params.idRevision, req.body, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
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
        revisionServices.geo(req.params.idVehiculo, req.body, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})



///////////////////////////////////////////////////////////////
////////////      GUARDAR IMAGEN
//////////////////////////////////////////////////////////////
router.put('/guardarImagen/:idRevision/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgNMedidor  = [];
        let rutaImgNComodato = [];
        let rutaImgOtrosSi   = [];
        let imgRetiroTanques = [];
        
       
        if(req.files.imgNMedidor){
            let esArrayNMedidor = Array.isArray(req.files.imgNMedidor)
            if(esArrayNMedidor){
                req.files.imgNMedidor.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgNMedidor.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgNMedidor  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgNMedidor.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

        if(req.files.imgRetiroTanques){
            let esArrayRetiroTanque = Array.isArray(req.files.imgRetiroTanques)
            if(esArrayRetiroTanque){
                req.files.imgRetiroTanques.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgRetiroTanque.push(rutas)
                    ///////////////////     envio la imagen al nuevo path
                    
                    let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgRetiroTanque  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgRetiroTanques.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

 
        if(req.files.imgNComodato){
            let esArrayComodato = Array.isArray(req.files.imgNComodato)
            if(esArrayComodato){
                req.files.imgNComodato.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    rutaImgNComodato.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+req.files.imgNComodato.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgNComodato  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+req.files.imgNComodato.name
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(req.files.imgNComodato.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }  
        }
        
        if(req.files.imgOtrosSi){
            let esArrayimgOtrosSi = Array.isArray(req.files.imgOtrosSi)
            if(esArrayimgOtrosSi){
                req.files.imgOtrosSi.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    rutaImgOtrosSi.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+req.files.imgOtrosSi.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgOtrosSi  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+req.files.imgOtrosSi.name
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(req.files.imgOtrosSi.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }
        rutaImgNMedidor  = rutaImgNMedidor.length==0  ?req.body.imgNMedidor :rutaImgNMedidor;
        rutaImgNComodato = rutaImgNComodato.length==0 ?req.body.imgNComodato :rutaImgNComodato;
        rutaImgOtrosSi   = rutaImgOtrosSi.length==0   ?req.body.imgOtrosSi :rutaImgOtrosSi;
        rutaImgRetiroTanque   = rutaImgRetiroTanque.length==0   ?req.body.imgOtrosSi :rutaImgRetiroTanque;
        

        revisionServices.editarImagen(req.params.idRevision, rutaImgNMedidor, rutaImgNComodato, rutaImgOtrosSi, rutaImgRetiroTanque, (err, revision)=>{
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
const ubicacionJimp =  '../front/docs/public/uploads/revisions/'
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