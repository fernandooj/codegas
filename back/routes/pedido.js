let express = require('express')
let router = express.Router();
let fs = require('fs');
let  moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD_h:mm:ss')
let redis        	= require('redis')
let cliente      	= redis.createClient()
let pedidoServices     = require('../services/pedidoServices.js') 
let userServices       = require('./../services/userServices.js') 
let carroServices      = require('../services/carroServices.js') 
const htmlTemplate     = require('../template-email.js')
const notificacionPush = require('../notificacionPush.js')

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS PEDIDOS SI ES CLIENTE, TRAE SUS RESPECTIVOS PEDIDOS
////////////////////////////////////////////////////////////
router.get('/todos/:fechaEntrega', (req,res)=>{
   
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
        ?pedidoServices.getByConductor(req.session.usuario._id, req.params.fechaEntrega, (err, pedido)=>{
            if (!err) {
                pedido = pedido.filter(e=>{
                    return e.carroId
                })
                pedido = pedido.filter(e=>{
                    return e.carroId.conductor==req.session.usuario._id
                })
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err, pedido:[] }); 
                console.log(err)
            }
        })
        :pedidoServices.getByFechaEntrega(req.params.fechaEntrega, (err, pedido)=>{
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

//////////////////////////////////////////////////////////////////
////////////      OBTENGO TODOS LOS VEHICULOS CON SUS PEDIDOS
//////////////////////////////////////////////////////////////////
router.get('/vehiculosConPedidos/:fecha', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        pedidoServices.vehiculosConPedidos(req.params.fecha, (err, carro)=>{
            if (!err) {
                res.json({ status:true, carro }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////       GUARDO UN PEDIDO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
        console.log("sin sesion")
		res.json({ status: false, message: 'No hay un usuario logueado' }); 
	}else{
        let id = req.session.usuario.acceso=="cliente" ?req.session.usuario._id : req.body.idCliente 
        console.log("id")
        console.log(id)
        userServices.getById(id, (err, clientes)=>{
            if(!err){
                pedidoServices.create(req.body, id, req.session.usuario._id, (err2, pedido)=>{
                    if (!err2) {
                        let titulo = `<font size="5">Pedido guardado con exito</font>`;
                        let text1  = `Hola Estimado/a: el pedido ha sido guardado con exito, y esta en proceso de ser entregado`;
                        let text2  = `Forma: <b>${req.body.forma}</b><br/>${req.body.cantidad &&"Cantidad: <b>"+req.body.cantidad+"</b>"}<br/>${req.body.frecuencia &&"Frecuencia: <b>"+req.body.frecuencia+"<b><br/> Dia:"+req.body.dia+"<b><br/>" + req.body.dia2 &&"Dia2:<b>"+req.body.dia+"</b>" } `
                                
                        htmlTemplate(req, req.body, titulo, text1, text2,  "Pedido guardado")
                        let mensajeJson={
                            badge:1
                        }
                        cliente.publish('pedido', JSON.stringify(mensajeJson)) 
                        
                        res.json({ status: true, pedido });	
                    }else{
                        console.log(err2)
                    }
                })
            }
        })
	}
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UN VEHICULO
//////////////////////////////////////////////////////////////
router.get('/asignarConductor/:pedidoId/:carroId/:fechaEntrega', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        carroServices.getByCarro(req.params.carroId, (err, conductor)=>{
            if(!err){
                pedidoServices.getLastRowConductor(conductor.conductor._id, req.params.fechaEntrega, (err2, pedido)=>{
                    if(err2){
                        res.json({ status:false, message: err }); 
                    }else{
                       
                        orden = pedido ?pedido.orden+1 :1
                        pedidoServices.asignarVehiculo(req.params.pedidoId, req.params.carroId, conductor.conductor._id, orden,  (err3, pedido)=>{
                            if (!err3) {
                                let fechaHoy = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY-MM-DD')
                                fechaHoy===req.params.fechaEntrega 
                                ?notificacionPush(conductor.conductor.tokenPhone, "Nuevo pedido asignado", `el pedido ${req.params.pedidoId} le ha sido asignado`)
                                :null
                                res.json({ status:true, pedido }); 
                            }else{
                                res.json({ status:false, message: err }); 
                            }
                        })
                    }
                })
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
                console.log(err)
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
                enviaNotificacion(res, "despacho", "Nuevo pedido activado", `${pedido._id} se ha hactivado`)
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
        let fullUrl = '../front/docs/public/uploads/pedido/'+fecha+'_'+randonNumber+'.jpg'
        console.log(req.files)
        ////////////////////    ruta que se va a guardar en la base de datos
        let ruta = req.protocol+'://'+req.get('Host') + '/public/uploads/pedido/'+fecha+'_'+randonNumber+'.jpg'
    
        ///////////////////     envio la imagen al nuevo path
        fs.rename(req.files.imagen.path, fullUrl, (err)=>{console.log(err)})

        /////////////////////////////////////////////       ANTES DE CERRAR SACO EL ULTIMO NUMERO DE ORDEN GUARDADO, ESTO PARA VERIFICAR SI ESTA CAMBIANDO O NO EL ORDEN DE GUARDADO
        pedidoServices.getLastRowConductorEntregados(req.session.usuario._id, req.body.fechaEntrega, (err, pedido)=>{
            if(err){
                res.json({ status:false, message: err }); 
            }else{
               let orden_cerrado = pedido ?pedido.orden_cerrado+1 :1
               
                pedidoServices.finalizar(req.body, req.params.estado, ruta, orden_cerrado, (err2, pedido)=>{
                     
                    const {kilos, factura, valor_unitario} = req.body
                    if (!err2) {
                        let titulo = `<font size="5">Pedido entregado</font>`
                        let text1  = `Su pedido ha sido entregado con exito`
                        let text2  = `Kilos: ${kilos} <br/> factura: ${factura} <br/> Valor: ${valor_unitario} <br/><img src="${ruta}" width="500"/>` 
                        let asunto = "Estado pedido Codegas, entregado"
                        htmlTemplate(req, req.body, titulo, text1, text2,  asunto)
                        enviaNotificacion(res, "despacho", req.session.usuario.nombre, "Ha cerrado un nuevo pedido exitosamente")
                    }else{
                        res.json({ status:false, message: err2 }); 
                    }
                })
            }
        })        
    }
})

////////////////////////////////////////////////////////////////////////////
////////////       GUARDAR NOVEDAD --> LO CIERRA PERO NO SE PUDO ENTREGAR
////////////////////////////////////////////////////////////////////////////
router.post('/novedad/', (req,res)=>{
    pedidoServices.getLastRowConductorEntregados(req.session.usuario._id, req.body.fechaEntrega, (err, pedido)=>{
        if(err){
            res.json({ status:false, message: err }); 
        }else{
            let orden_cerrado = pedido ?pedido.orden_cerrado+1 :1
            
            pedidoServices.novedad(req.body._id, orden_cerrado, req.body.novedad, (err, pedido)=>{
                if (!err) {
                    enviaNotificacion(res, "despacho", req.session.usuario.nombre, `Ha cerrado un nuevo pedido NO exitosamente, ${req.body.novedad}`)
                }else{
                    res.json({ status:false, message: err });
                }
            })
        }
    })
})

const enviaNotificacion=(res, acceso, titulo, body)=>{
    userServices.getByAcceso(acceso, (err, usuarios)=>{
        if(!err){
            usuarios.map(e=>{
                notificacionPush(e.tokenPhone, titulo, body)
            })
            res.json({status:true, usuarios})
        }else{
            res.json({ status:false, usuarios:[], err}) 
        }
    })
}

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


///////////////////////////////////////////////////////////////
////////////      EDITAR ORDEN PEDIDOS
//////////////////////////////////////////////////////////////
router.put('/editarOrden/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        req.body.pedidos.map((e, index)=>{
            pedidoServices.editarOrden(e.info[0]._id, index+1, (err, pedido)=>{
                
            })
        })
        res.json({ status:true }); 
    }
})
 

///////////////////////////////////////////////////////////////////////////////////
////////////////////////            CREAR PEDIDOS CON FRECUENCIAS 
///////////////////////////////////////////////////////////////////////////////////
router.get('/crear_frecuencia/todos', (req,res)=>{
    let fechaFrecuencia = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
    fechaFrecuencia = fechaFrecuencia.valueOf()
   
    pedidoServices.get((err, pedidos)=>{
        if (!err) {
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERT LAS FECHAS MENSUAL
            let fechaMensual = moment(fechaFrecuencia).format("D")
            let mensual = pedidos.filter(e=>{
                return e.frecuencia=="mensual"
            })
            mensual = mensual.filter(e=>{
                if((e.dia1-fechaMensual)==2) return e
            })
            mensual.map(e=>{
                let data = {
                    forma:e.forma, 
                    cantidad:e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :0,
                    puntoId:e.puntoId._id,
                    pedidoPadre:e._id,
                    fechaSolicitud:moment(fechaFrecuencia).format("YYYY-MM-"+e.dia1),
                }
                pedidoServices.create(data, e.usuarioId._id, e.usuarioId._id, (err2, pedido)=>{
                })
            })

            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERT LAS FECHAS QUINCENAL
            let quincenal = pedidos.filter(e=>{
                return e.frecuencia=="quincenal"
            })
            let fechaQuincenal = moment(fechaFrecuencia).format("D")
            
            quincenal = quincenal.filter(e=>{
                if((e.dia1-fechaQuincenal)==2 || (e.dia2-fechaQuincenal)==2 ) return e
            })
            quincenal.map(e=>{
                let data = {
                    forma:e.forma, 
                    cantidad:e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :0,
                    puntoId:e.puntoId._id,
                    pedidoPadre:e._id,
                    fechaSolicitud:moment(fechaFrecuencia).format("YYYY-MM-"+(parseInt(fechaQuincenal)+2)),
                }
                pedidoServices.create(data, e.usuarioId._id, e.usuarioId._id, (err2, pedido)=>{
                })
            })

            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERT LAS FECHAS SEMANALES
            let fechaSemanal = moment(fechaFrecuencia).lang("es").format("dddd")
            fechaSemanal = fechaSemanal=="lunes"     ?1 
                           :fechaSemanal=="martes"   ?2
                           :fechaSemanal=="miercoles"?3
                           :fechaSemanal=="jueves"   ?4
                           :fechaSemanal=="viernes"  ?5
                           :fechaSemanal=="sabado"   ?6
                           :7
            let semanal = pedidos.filter(e=>{
                return e.frecuencia=="semanal"
            })
            semanal = semanal.filter(e=>{
                let dia = e.dia1=="lunes"   ?1 
                        :e.dia1=="martes"   ?2
                        :e.dia1=="miercoles"?3
                        :e.dia1=="jueves"   ?4
                        :e.dia1=="viernes"  ?5
                        :e.dia1=="sabado"   ?6
                        :7
                if((dia-fechaSemanal)==2) return e
            })
            semanal.map(e=>{
                let data = {
                    forma:e.forma, 
                    cantidad:e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :0,
                    puntoId:e.puntoId._id,
                    pedidoPadre:e._id,
                    fechaSolicitud:moment(fechaFrecuencia).format("YYYY-MM-"+(parseInt(fechaQuincenal)+2)),
                }
                pedidoServices.create(data, e.usuarioId._id, e.usuarioId._id, (err2, pedido)=>{
                })
            })

            let mensajeJson={
                badge:mensual.length+quincenal.length+semanal.length
            }
            cliente.publish('pedido', JSON.stringify(mensajeJson)) 
            
            let titulo = `<font size="5">Hoy se han creado los siguientes pedidos</font>`
            let text1  = `Frecuencia Mensual: ${mensual.length}<br/>Frecuencia Quincenal: ${quincenal.length}<br/>Frecuencia Semanal: ${semanal.length}<br/>`
            let text2  = `Total pedidos Dia:  ${mensajeJson.badge}` 
            let asunto = "Nuevos pedidos por frecuencia"
            let user   = {email:"fernandooj@ymail.com, gestioncalidad@codegascolombia.com"} 
            htmlTemplate(req, user, titulo, text1, text2,  asunto)

            enviaNotificacion(res, "admin", "Nuevos pedidos Frecuencia", `total ${mensajeJson.badge} `)
        }else{
            res.json({ status:false, messagess: err }); 
        }
    })
})

module.exports = router;