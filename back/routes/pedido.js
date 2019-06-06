let express = require('express')
let router = express.Router();
let fs = require('fs');
let  moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD_h:mm:ss')

let pedidoServices = require('../services/pedidoServices.js') 
 
const htmlTemplate = require('../template-email.js')

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS PEDIDOS SI ES CLIENTE, TRAE SUS RESPECTIVOS PEDIDOS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        req.session.usuario.acceso=="cliente"
        ?pedidoServices.getByUser(req.session.usuario._id, (err, pedido)=>{
            if (!err) {
                res.json({ status: true, pedido }); 
            }else{
                res.json({ status:false, message: err,  pedido:[] }); 
            }
        })
        :req.session.usuario.acceso=="conductor"
        ?pedidoServices.get( (err, pedido)=>{
            if (!err) {
                pedido = pedido.filter(e=>{
                    return e.conductorId
                })
                pedido = pedido.filter(e=>{
                    return e.conductorId._id==req.session.usuario._id
                })
                console.log(req.session.usuario._id)
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err, pedido:[] }); 
            }
        })
        :pedidoServices.get( (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err, pedido:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UN PEDIDO POR SU ID
////////////////////////////////////////////////////////////
router.get('/:pedidoId', (req,res)=>{
	pedidoServices.getByPedido(req.params.pedidoId, (err, pedido)=>{
		if (err) {
			res.json({ status:false, message: err }); 
		}else{
			res.json({ status:true,   pedido });
		}
	})
})

///////////////////////////////////////////////////////////////
////////////        OBTENGO UN PEDIDO POR UN USUARIO
//////////////////////////////////////////////////////////////
router.get('/byUser/:idUser', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        pedidoServices.getByUser(req.params.idUser, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////       GUARDO UN PEDIDO
//////////////////////////////////////////////////////////////
router.post('/', function(req,res){
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado' }); 
	}else{
        let id = req.session.usuario.acceso=="cliente" ?req.session.usuario._id : req.body.idCliente 
		pedidoServices.create(req.body, id, req.session.usuario._id, (err, pedido)=>{
			if (!err) {
                let titulo = `<font size="5">Pedido guardado con exito</font>`;
                let text1  = `Hola Estimado/a: el pedido ha sido guardado con exito, y esta en proceso de ser entregado`;
                let text2  = `Forma: <b>${req.body.forma}</b><br/>${req.body.cantidad &&"Cantidad: <b>"+req.body.cantidad+"</b>"}<br/>${req.body.frecuencia &&"Frecuencia: <b>"+req.body.frecuencia+"<b><br/> Dia:"+req.body.dia+"<b><br/>" + req.body.dia2 &&"Dia2:<b>"+req.body.dia+"</b>" } `
                        
                htmlTemplate(req, req.body, titulo, text1, text2,  "Pedido guardado")
                res.json({ status: true, pedido });	
            }else{
                console.log(err)
            }
		})
	}
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UN CONDUCTOR
//////////////////////////////////////////////////////////////
router.get('/asignarConductor/:idPedido/:idConductor', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        pedidoServices.asignarConductor(req.params.idPedido, req.params.idConductor, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UNA FECHA
//////////////////////////////////////////////////////////////
router.get('/asignarFechaEntrega/:idPedido/:fecha', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        pedidoServices.asignarFechaEntrega(req.params.idPedido, req.params.fecha, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
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
        pedidoServices.cambiarEstado(req.params.idPedido, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////       FINALIZAR
//////////////////////////////////////////////////////////////
router.post('/finalizar/:estado', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        let randonNumber = Math.floor(90000000 + Math.random() * 1000000)

        ////////////////////    ruta que se va a guardar en el folder
        let fullUrl = '../front/docs/uploads/pedido/'+fecha+'_'+randonNumber+'.jpg'
        console.log(req.files)
        ////////////////////    ruta que se va a guardar en la base de datos
        let ruta = req.protocol+'://'+req.get('Host') + '/uploads/pedido/'+fecha+'_'+randonNumber+'.jpg'
    
        ///////////////////     envio la imagen al nuevo path
        fs.rename(req.files.imagen.path, fullUrl, (err)=>{console.log(err)})

        pedidoServices.finalizar(req.body, req.params.estado, ruta, (err, pedido)=>{
            const {kilos, factura, valor_unitario} = req.body
            if (!err) {
                let titulo = `<font size="5">Pedido entregado</font>`
                let text1  = `Su pedido ha sido entregado con exito`
                let text2  = `Kilos: ${kilos} <br/> factura: ${factura} <br/> Valor: ${valor_unitario} <br/><img src="${ruta}" width="500"/>` 
                let asunto = "Estado pedido Codegas, entregado"
                htmlTemplate(req, req.body, titulo, text1, text2,  asunto)
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
router.get('/eliminar/:idPedido/:estado', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        pedidoServices.eliminar(req.params.idPedido, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

module.exports = router;