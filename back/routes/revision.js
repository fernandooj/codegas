let express = require('express')
let router = express.Router();
let fs 		   = require('fs');
let Jimp       = require("jimp");
let {promisify} = require('util');
let revisionServices = require('../services/revisionServices.js') 
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
        (req.session.usuario.acceso=="admin" || req.session.usuario.acceso=="adminTanque")
        ?revisionServices.get((err, revision)=>{
            if (!err) {
                res.json({ status: true, revision }); 
            }else{
                res.json({ status:false, message: err,  revision:[] }); 
            }
        })
        :req.session.usuario.acceso=="depTecnico"
        ?revisionServices.getWithAlerta((err, revision)=>{
            if (!err) {
                res.json({ status: true, revision }); 
            }else{
                res.json({ status:false, message: err,  revision:[] }); 
            }
        })
        :req.session.usuario.acceso=="insSeguridad"
        ?revisionServices.getDepTecnico((err, revision)=>{
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
////////////        OBTENGO UN revision POR UN PUNTO
//////////////////////////////////////////////////////////////
router.get('/byPunto/:idPunto', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        revisionServices.getByPunto(req.params.idPunto, (err, revision)=>{
            console.log(revision)
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
////////////      EDITAR INSTALACION
//////////////////////////////////////////////////////////////
router.put('/instalacion/:idVehiculo/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgIsometrico  = [];
        if(req.files.imgIsometrico){
            let esArrayIsometrico = Array.isArray(req.files.imgIsometrico)
            if(esArrayIsometrico){
                req.files.imgIsometrico.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgIsometrico.push(rutas)
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
                rutaImgIsometrico  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgIsometrico.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgIsometrico   = rutaImgIsometrico.length==0   ?req.body.imgIsometrico :rutaImgIsometrico;
        revisionServices.editarInstalacion(req.params.idVehiculo, rutaImgIsometrico, req.body, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      SOLICITUD DE SERVICIO
//////////////////////////////////////////////////////////////
router.post('/solicitudServicio/:idVehiculo/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        revisionServices.solicitudServicio(req.params.idVehiculo, req.session.usuario._id,  req.body.solicitudServicio, (err, revision)=>{
            if (!err) {
                let userRegistrado = {email:"fernandooj@ymail.com, dpto@codegascolombia.com, gerencia@codegascolombia.com, directa.comercial@codegascolombia.com "}
                let userEnvia = `N Control:${req.body.nControl} <br />Cliente:${req.body.codtCliente} <br />Punto:${req.body.direccion} <br />Enviado por: " ${req.session.usuario.nombre}<br />`
                htmlTemplate(req, userRegistrado, "Nueva solicitud de servicio", req.body.solicitudServicio, userEnvia,  "Solicitud de servicio codegas")

                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      CERRAR ALERTA
//////////////////////////////////////////////////////////////
router.put('/cerrarRevision/:revisionId/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaImgAlerta  = [];
        if(req.files.imgAlerta){
            let esArrayIsometrico = Array.isArray(req.files.imgAlerta)
            if(esArrayIsometrico){
                req.files.imgAlerta.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgAlerta.push(rutas)
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
                rutaImgAlerta  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgAlerta.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        rutaImgAlerta   = rutaImgAlerta.length==0   ?req.body.rutaImgAlerta :rutaImgAlerta;
        revisionServices.cerrarAlerta(req.params.revisionId, rutaImgAlerta, req.body, (err, revision)=>{
            if (!err) {
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      CERRAR DEPARTAMENTO TECNICO
//////////////////////////////////////////////////////////////
router.put('/cerrarDepTecnico/:revisionId/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let rutaDepTecnico  = [];
        if(req.files.imgDepTecnico){
            let esArrayIsometrico = Array.isArray(req.files.imgDepTecnico)
            if(esArrayIsometrico){
                req.files.imgDepTecnico.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaDepTecnico.push(rutas)
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
                rutaDepTecnico  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgDepTecnico.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

        let rutaImgDocumento = []
        let {imgDocumento} = req.files
        if(imgDocumento){
            let esArrayImgDocumento = Array.isArray(imgDocumento)
            if(esArrayImgDocumento){
                imgDocumento.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    rutaImgDocumento.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+imgDocumento.name
                let rutas = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+imgDocumento.name
                ////////////////////    ruta que se va a guardar en la base de datos
                rutaImgDocumento.push(rutas)
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgDocumento.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }
    
        
        rutaImgDocumento  = rutaImgDocumento.length==0  ?documento :rutaImgDocumento.concat(documento);
        rutaImgDocumento = rutaImgDocumento.split(" ").join("")
        rutaDepTecnico   = rutaDepTecnico.length==0   ?req.body.rutaDepTecnico :rutaDepTecnico;
        revisionServices.cerrarDepTecnico(req.params.revisionId, rutaDepTecnico, req.body, rutaImgDocumento, (err, revision)=>{
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
        let rutaImgIsometrico     = [];
        let rutaImgOtrosComodato  = [];
        let rutaImgSoporteEntrega = [];
        let rutaImgPuntoConsumo   = [];
        let rutaImgVisual         = [];

        let {imgIsometrico} = req.files
        if(imgIsometrico){
            let esArrayNMedidor = Array.isArray(imgIsometrico)
            if(esArrayNMedidor){
                imgIsometrico.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgIsometrico.push(rutas)
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
                rutaImgIsometrico  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(imgIsometrico.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }        
        
        if(req.files.imgOtrosComodato){
            let esArrayNMedidor = Array.isArray(req.files.imgOtrosComodato)
            if(esArrayNMedidor){
                req.files.imgOtrosComodato.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgOtrosComodato.push(rutas)
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
                rutaImgOtrosComodato  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgOtrosComodato.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        let {imgSoporteEntrega} = req.files
        if(imgSoporteEntrega){
            let esArrayRetiroTanque = Array.isArray(imgSoporteEntrega)
            if(esArrayRetiroTanque){
                imgSoporteEntrega.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgSoporteEntrega.push(rutas)
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
                rutaImgSoporteEntrega  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(imgSoporteEntrega.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        let {imgPuntoConsumo} = req.files
        if(imgPuntoConsumo){
            let esArrayPuntoConsumo = Array.isArray(imgPuntoConsumo)
            if(esArrayPuntoConsumo){
                imgPuntoConsumo.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgPuntoConsumo.push(rutas)
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
                rutaImgPuntoConsumo  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(imgPuntoConsumo.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        let imgVisual = req.files
         
        if(req.files.imgVisual){
            let esArrayVisual = Array.isArray(imgVisual)
            if(esArrayVisual){
                imgVisual.map(e=>{
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let randonNumber = Math.floor(90000000 + Math.random() * 1000000)
                    
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                    rutaImgVisual.push(rutas)
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
                rutaImgVisual  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                
                ///////////////////     envio la imagen al nuevo path
                
                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/--'+fechaImagen+'_'+randonNumber+'.jpg'
                fs.rename(req.files.imgVisual.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                resizeImagenes(rutaJim, randonNumber, "jpg", res) 
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

 
        let isometrico     = req.body.isometrico     ?JSON.parse(req.body.isometrico)    :[]
        let otrosComodato  = req.body.otrosComodato  ?JSON.parse(req.body.otrosComodato) :[]
        let soporteEntrega = req.body.soporteEntrega ?JSON.parse(req.body.soporteEntrega):[]   
        let puntoConsumo   = req.body.puntoConsumo   ?JSON.parse(req.body.puntoConsumo)  :[]   
        let visual         = req.body.visual         ?JSON.parse(req.body.visual)        :[]   
    
        rutaImgIsometrico      = rutaImgIsometrico.length==0     ?isometrico     :isometrico.concat(rutaImgIsometrico);
        rutaImgOtrosComodato   = rutaImgOtrosComodato.length==0  ?otrosComodato  :otrosComodato.concat(rutaImgOtrosComodato);
        rutaImgSoporteEntrega  = rutaImgSoporteEntrega.length==0 ?soporteEntrega :soporteEntrega.concat(rutaImgSoporteEntrega);
        rutaImgPuntoConsumo    = rutaImgPuntoConsumo.length==0   ?puntoConsumo   :puntoConsumo.concat(rutaImgPuntoConsumo);
        rutaImgVisual          = rutaImgVisual.length==0         ?visual         :visual.concat(rutaImgVisual);     

        revisionServices.editarImagen(req.params.idRevision, rutaImgIsometrico, rutaImgOtrosComodato, rutaImgSoporteEntrega, rutaImgPuntoConsumo, rutaImgVisual, (err, revision)=>{
            if (!err) {
               
                res.json({ status:true, revision }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      GUARDAR PDF
//////////////////////////////////////////////////////////////
router.put('/uploadPdf/:idRevision/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        
        let rutaImgProtocoloLlenado = [];
        let rutaImgHojaSeguridad = [];
        let rutaImgNComodato = [];
        let rutaImgOtrosSi   = [];

        let {imgProtocoloLlenado} = req.files
        if(imgProtocoloLlenado){
            let esArrayProtocoloLlenado = Array.isArray(imgProtocoloLlenado)
            if(esArrayProtocoloLlenado){
                imgProtocoloLlenado.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    rutaImgProtocoloLlenado.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+imgProtocoloLlenado.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                let rutas = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+imgProtocoloLlenado.name
                rutaImgProtocoloLlenado.push(rutas)
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgProtocoloLlenado.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }

        let {imgHojaSeguridad} = req.files
        if(imgHojaSeguridad){
            let esArrayimgHojaSeguridad = Array.isArray(imgHojaSeguridad)
            if(esArrayimgHojaSeguridad){
                imgHojaSeguridad.map(e=>{
                    ////////////////////    ruta que se va a guardar en el folder
                    let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    
                    ////////////////////    ruta que se va a guardar en la base de datos
                    let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+e.name
                    rutaImgHojaSeguridad.push(rutas)
                    
                    ///////////////////     envio la imagen al nuevo path
                    fs.rename(e.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                })
            }else{
                ////////////////////    ruta que se va a guardar en el folder
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+imgHojaSeguridad.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+imgHojaSeguridad.name
                rutaImgHojaSeguridad.push(rutas) 
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgHojaSeguridad.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }

        let {imgNComodato} = req.files
        if(imgNComodato){
            let esArrayComodato = Array.isArray(imgNComodato)
            if(esArrayComodato){
                imgNComodato.map(e=>{
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+imgNComodato.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                let rutas = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+imgNComodato.name
                rutaImgNComodato.push(rutas) 
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgNComodato.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }  
        }     

        let {imgOtrosSi} = req.files
        console.log("hojaseguridad")
        console.log(req.files)
        if(imgOtrosSi){
            let esArrayimgOtrosSi = Array.isArray(imgOtrosSi)
            if(esArrayimgOtrosSi){
                imgOtrosSi.map(e=>{
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
                let fullUrlimagenOriginal = '../front/docs/public/uploads/revisions/'+fechaImagen+'--'+imgOtrosSi.name
                
                ////////////////////    ruta que se va a guardar en la base de datos
                let rutas = req.protocol+'://'+req.get('Host') + '/public/uploads/revisions/'+fechaImagen+'--'+imgOtrosSi.name
                rutaImgOtrosSi.push(rutas)
               
                ///////////////////     envio la imagen al nuevo path                
                fs.rename(imgOtrosSi.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
            }
        }

        let protocoloLlenado = req.body.protocoloLlenado ?JSON.parse(req.body.protocoloLlenado) :[]
        let hojaSeguridad    = req.body.hojaSeguridad    ?JSON.parse(req.body.hojaSeguridad)    :[]
        let nComodato        = req.body.nComodato        ?JSON.parse(req.body.nComodato)        :[]   
        let otrosSi          = req.body.otrosSi          ?JSON.parse(req.body.otrosSi)          :[]   

     
        rutaImgProtocoloLlenado = rutaImgProtocoloLlenado.length==0 ?protocoloLlenado :rutaImgProtocoloLlenado.concat(protocoloLlenado);
        rutaImgHojaSeguridad    = rutaImgHojaSeguridad.length==0    ?hojaSeguridad    :rutaImgHojaSeguridad.concat(hojaSeguridad);
        rutaImgNComodato        = rutaImgNComodato.length==0        ?nComodato        :rutaImgNComodato.concat(nComodato);
        rutaImgOtrosSi          = rutaImgOtrosSi.length==0          ?otrosSi          :rutaImgOtrosSi.concat(otrosSi);
        rutaImgProtocoloLlenado = rutaImgProtocoloLlenado.filter(e=>{return e.split(" ").join("")})
        rutaImgHojaSeguridad = rutaImgHojaSeguridad.filter(e=>{return e.split(" ").join("")})
        rutaImgNComodato = rutaImgNComodato.filter(e=>{return e.split(" ").join("")})
        rutaImgOtrosSi = rutaImgOtrosSi.filter(e=>{return e.split(" ").join("")})
        console.log({rutaImgProtocoloLlenado})

        revisionServices.subirPdf(req.params.idRevision, rutaImgProtocoloLlenado, rutaImgHojaSeguridad, rutaImgNComodato, rutaImgOtrosSi, (err, revision)=>{
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