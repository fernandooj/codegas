let express = require('express')
let router = express.Router();
let fs 		   = require('fs');
let Jimp       = require("jimp");
let {promisify} = require('util');
let  moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD_h:mm:ss')
let fechaImagen = moment().tz("America/Bogota").format('YYYY_MM_DD_h:mm:ss')
let redis        	= require('redis')
let cliente      	= redis.createClient()
let pedidoServices     = require('../services/pedidoServices.js')
let userServices       = require('./../services/userServices.js')
let carroServices      = require('../services/carroServices.js')
const htmlTemplate     = require('../notificaciones/template-email.js')
const notificacionPush = require('../notificaciones/notificacionPush.js')
let sizeOf    	   = promisify(require('image-size'));
////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS PEDIDOS SI ES CLIENTE, TRAE SUS RESPECTIVOS PEDIDOS
////////////////////////////////////////////////////////////
router.get('/todos/app/:fechaEntrega/:limit', (req,res)=>{
    let limit = req.params.limit
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
        :req.session.usuario.acceso=="veo"
        ?pedidoServices.getByFechaEntrega(req.params.fechaEntrega, limit, (err, pedido)=>{
            if (!err) {
                let pedido1 = pedido.filter(e=>{
                    return e.kilos=="undefined" || e.kilos==undefined
                })

                let pedido2 = pedido.filter(e=>{
                    return e.entregado==true && e.estado=="activo"
                })
                pedido = pedido1.concat(pedido2)
                pedido = pedido.filter(e=>{
                    return e.usuarioId.comercialAsignado==req.session.usuario._id
                })
                res.json({ status:true, pedido });
            }else{
                res.json({ status:false, message: err, pedido:[] });
            }
        })
        :pedidoServices.getByFechaEntrega(req.params.fechaEntrega, limit, (err, pedido)=>{
            if (!err) {
                let pedido1 = pedido.filter(e=>{
                    return e.kilos=="undefined" || e.kilos==undefined
                })
                pedido1 = pedido1.filter(e=>{
                    return e.estado!=="innactivo"
                })
                let pedido2 = pedido.filter(e=>{
                    return e.entregado==true && e.estado=="activo"
                })

                pedido2 = pedido2.filter((e, index)=>{
                    return index<80
                })

                pedido = pedido1.concat(pedido2)

                res.json({ status:true, pedido });
            }else{
                res.json({ status:false, message: err, pedido:[] });
            }
        })
    }
})

router.get('/todos/web/:fechaEntrega/', (req,res)=>{
    console.log("req.query")
    console.log(req.query)
    let limit = req.query.page ?(req.query.page*20) :40
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' });
    }else{
        pedidoServices.getByFechaEntrega(req.params.fechaEntrega, limit, (err, pedido)=>{
            if (!err) {
                
                res.json({ status:true, pedido });
            }else{
                res.json({ status:false, message: err, pedido:[] });
            }
        })
    }
})

//////////////////////////////////////////////////////////////////////////
////////////        OBTENGO LOS PEDIDOS QUE TIENEN ASIGNADO UN USUARIO, PARA VERIFICAR QUE NO SE REPITAN EN EL MISMO DIA
//////////////////////////////////////////////////////////////////////////
router.get('/listadoDia/:usuarioId/:puntoId/', (req,res)=>{
	pedidoServices.getByUserPuntoDate(req.params.usuarioId, req.params.puntoId, (err, pedidos)=>{
		if (err) {
			res.json({ status:false, message: err });
		}else{
            let fechaHoy = moment().subtract(5, 'hours');
            fechaHoy     = moment(fechaHoy).format('YYYY-MM-DD')
            console.log({fechaHoy})
            let pedido = pedidos.filter(e=>{
                e.creado = moment(e.creado).format("YYYY-MM-DD")
                return e.creado==fechaHoy
            })

			res.json({ status:true,   pedido });
		}
	})
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

const ubicacionJimp =  '../front/docs/public/uploads/pedido/'
///////////////////////////////////////////////////////////////
////////////       GUARDO UN PEDIDO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado' });
	}else{
        let id = req.session.usuario.acceso=="cliente" ?req.session.usuario._id : req.body.idCliente
        userServices.getById(id, (err, clientes)=>{
            if(!err){
                pedidoServices.totalPedidos((err3, totalPedidos)=>{
                    let ruta = [];
                    if(req.files.imagen){
                        let esArray = Array.isArray(req.files.imagen)
                        if(esArray){
                            req.files.imagen.map(e=>{
                                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                let randonNumber = Math.floor(90000000 + Math.random() * 1000000)

                                ////////////////////    ruta que se va a guardar en el folder
                                let fullUrlimagenOriginal = '../front/docs/public/uploads/pedido/Original'+fechaImagen+'_'+randonNumber+'.jpg'

                                ////////////////////    ruta que se va a guardar en la base de datos
                                let rutas  = req.protocol+'://'+req.get('Host') + '/public/uploads/pedido/--'+fechaImagen+'_'+randonNumber+'.jpg'
                                ruta.push(rutas)
                                ///////////////////     envio la imagen al nuevo path

                                let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/pedido/Original'+fechaImagen+'_'+randonNumber+'.jpg'
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
                            let fullUrlimagenOriginal = '../front/docs/public/uploads/pedido/Original'+fechaImagen+'_'+randonNumber+'.jpg'

                            ////////////////////    ruta que se va a guardar en la base de datos
                            ruta  = req.protocol+'://'+req.get('Host') + '/public/uploads/pedido/--'+fechaImagen+'_'+randonNumber+'.jpg'

                            ///////////////////     envio la imagen al nuevo path

                            let rutaJim  = req.protocol+'://'+req.get('Host') + '/public/uploads/pedido/Original'+fechaImagen+'_'+randonNumber+'.jpg'
                            fs.rename(req.files.imagen.path, fullUrlimagenOriginal, (err)=>{console.log(err)})
                            resizeImagenes(rutaJim, randonNumber, "jpg", res)
                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        }
                    }

                    pedidoServices.create(req.body, id, req.session.usuario._id, totalPedidos+1, ruta, clientes.valorUnitario, (err2, pedido)=>{
                        if (!err2) {
                            ////////////////////////        ENVIO EL CORREO AL USUARIO CLIENTE AVISANDOLE DEL NUEVO PEDIDO
                            const dia1       = req.body.dia1!=="undefined" ?`Dia 1: ${req.body.dia1}<br/>` :""
                            const dia2       = req.body.dia2=="undefined" || req.body.dia2=="null" ?"" :`Dia 2: ${req.body.dia2}<br/>`
                            const cantidad   = req.body.cantidad!=="" ?`Cantidad: ${req.body.cantidad}<br/>` :""
                            // const frecuencia = req.body.frecuencia!=="undefined" ?`Frecuencia: ${req.body.frecuencia}<br/>` :""
                            const frecuencia = req.body.frecuencia ?`Frecuencia: ${req.body.frecuencia}<br/>` :""
                            const fechaSolicitud = req.body.fechaSolicitud ?`Fecha Solicitud: ${req.body.fechaSolicitud}<br/>` :""
                            const codt           = clientes.codt  ?`CODT:  ${clientes.codt}<br/>`  :"Sin Codt <br/>"
                            const valor_unitario = clientes.valorUnitario  ?`Valor Unitario: ${clientes.valorUnitario}<br/>` :"Sin valor unitario <br/>"
                            let titulo = `<font size="5">Pedido guardado con exito</font>`;
                            let text1  = `Hola Estimado/a: su pedido ha sido guardado con exito, y esta en proceso de ser entregado`;
                            let text2  = `Forma: <b>${req.body.forma}</b><br/> ${cantidad} ${frecuencia} ${fechaSolicitud} ${dia1} ${dia2} ${codt} ${valor_unitario} `

                            htmlTemplate(req, req.body, titulo, text1, text2,  "Pedido guardado")
                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //////////////////////      ENVIO UN CORREO A CODEGAS AVINSANDOLE DEL NUEVO PEDIDO CREADO
                            let userRegistrado = {email:"directora.comercial@codegascolombia.com, servicioalcliente@codegascolombia.com"}
                            // let userRegistrado = {email:"fernandooj@ymail.com"}
                            let email = req.body.email ?req.body.email :req.session.usuario.email
                            htmlTemplate(req, userRegistrado, email, text2, "",  "Nuevo pedido")
                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            let mensajeJson={
                                badge:1
                            }
                            cliente.publish('pedido', JSON.stringify(mensajeJson))
                            cliente.publish('actualizaPedidos', true)
                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            res.json({ status: true, pedido });
                        }else{
                            let titulo = `<font size="5">error en el pedido</font>`
                            let text1  = err2
                            let text2  = req.session.usuario.email+" / "+err3
                            let asunto = err
                            let user   = {email:"fernandooj@ymail.com"}
                            htmlTemplate(req, user, titulo, text1, text2,  asunto)
                            if(err2){
                                htmlTemplate(req, user, titulo, err2, "text2",  asunto)
                                res.json({ status: false, code:2, pedido:err2 });
                            }
                            res.json({ status: false, err3 });
                            console.log(err3)
                        }
                    })
                })
            }
        })
	}
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UN VEHICULO
//////////////////////////////////////////////////////////////
router.get('/asignarConductor/:pedidoId/:carroId/:fechaEntrega/:nPedido', (req,res)=>{
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
                        pedidoServices.asignarVehiculo(req.session.usuario._id, req.params.pedidoId, req.params.carroId, conductor.conductor._id, orden,  (err3, pedido)=>{
                            if (!err3) {
                                let fechaHoy = moment().subtract(1, 'hours');
                                fechaHoy     = moment(fechaHoy).add(1, 'hours').format('YYYY-MM-DD');
                                console.log({fechaHoy,fechaEntrega:req.params.fechaEntrega })
                                fechaHoy===req.params.fechaEntrega
                                ?notificacionPush(conductor.conductor.tokenPhone, "Nuevo pedido asignado", `el pedido ${req.params.nPedido} le ha sido asignado`)
                                :null
                                let mensajeJson={
                                    badge:1,
                                    idConductor:conductor.conductor._id
                                }
                                cliente.publish('actualizaPedidos', true)
                                cliente.publish('pedidoConductor', JSON.stringify(mensajeJson))
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
                cliente.publish('actualizaPedidos', true)
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
        pedidoServices.cambiarEstado(req.session.usuario._id, req.params.idPedido, req.params.estado, (err, pedido)=>{
            console.log({estado:req.params.estado})
            if (!err) {

                req.params.estado=="activo"
                ?enviaNotificacion(res, "despacho", "Nuevo pedido activado", `${pedido.nPedido} se ha hactivado`)
                :enviaNotificacion(res, "admin",    "Nuevo pedido Innactivo", `${pedido.nPedido} se desactivo`)
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
                        let text2  = `Kilos: ${kilos} <br/> factura: ${factura} <br/> Valor: ${valor_unitario} <br/> SI QUIERES CONSULTAR TU FACTURA TE INVITAMOS A QUE LO CONSULTES EN LA APP`
                        let asunto = "Estado pedido Codegas, entregado"
                        htmlTemplate(req, req.body, titulo, text1, text2,  asunto)
                        enviaNotificacion(res, "despacho", req.session.usuario.nombre, `Ha cerrado el pedido: ${pedido.nPedido}`)
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

            pedidoServices.novedad(req.body._id, orden_cerrado, req.body.novedad, req.body.perfil_novedad, (err, pedido)=>{
                if (!err) {
                    enviaNotificacion(res, "despacho", req.session.usuario.nombre, `Ha cerrado el pedido ${pedido.nPedido} NO exitosamente, ${req.body.novedad}`)
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
            cliente.publish('actualizaPedidos', true)
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
        let mensajeJson={
            badge:1,
            idConductor:req.body.conductorId
        }

        cliente.publish('pedidoConductor', JSON.stringify(mensajeJson))
        cliente.publish('actualizaPedidos', true)
        res.json({ status:true });
    }
})


///////////////////////////////////////////////////////////////////////////////////
////////////////////////            CREAR PEDIDOS CON FRECUENCIAS
///////////////////////////////////////////////////////////////////////////////////
let fechaFrecuencia = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
fechaFrecuencia = fechaFrecuencia.valueOf()
router.get('/crear_frecuencia/mensual', (req,res)=>{
    pedidoServices.get((err, pedidos)=>{
        if (!err) {
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERTA LAS FECHAS MENSUAL
            let fechaMensual = moment(fechaFrecuencia).format("D")
            fechaMensual = parseInt(fechaMensual)
            let mensual = pedidos.filter(e=>{
                return e.frecuencia=="mensual"
            })
            mensual = mensual.filter(e=>{
                if(parseInt(e.dia1)==(fechaMensual+1)) return e
            })
            mensual.map((e, key)=>{
                let data = {
                    forma:e.forma,
                    cantidad:e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :0,
                    puntoId:e.puntoId._id,
                    pedidoPadre:e._id,
                    fechaSolicitud:moment(fechaFrecuencia).format("YYYY-MM-"+e.dia1),
                    creado:        moment(fechaFrecuencia).format("YYYY-MM-"+e.dia1),
                }
                let letNpedido = pedidos.length+(key+1)
                pedidoServices.create(data, e.usuarioId._id, e.usuarioId._id,  letNpedido, null,  (err2, pedido)=>{
                })
            })
            res.json({fechaMensual, total:mensual.length, status:true, mensual });
        }else{
            res.json({ status:false, messagess: err });
        }
    })
})
router.get('/crear_frecuencia/quincenal', (req,res)=>{
    pedidoServices.get((err, pedidos)=>{
        if (!err) {
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERTA LAS FECHAS QUINCENAL
            let fechaQuincenal = moment(fechaFrecuencia).format("D")
            fechaQuincenal = parseInt(fechaQuincenal)
            let quincenal = pedidos.filter(e=>{
                return e.frecuencia=="quincenal"
            })
            quincenal = quincenal.filter(e=>{
                if(parseInt(e.dia1)==(fechaQuincenal+1) || parseInt(e.dia2)==(fechaQuincenal+1) ) return e
            })

            quincenal.map((e, key)=>{
                let data = {
                    forma:e.forma,
                    cantidad:e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :0,
                    puntoId:e.puntoId._id,
                    pedidoPadre:e._id,
                    fechaSolicitud:moment(fechaFrecuencia).format("YYYY-MM-"+(parseInt(fechaQuincenal))),
                    creado:        moment(fechaFrecuencia).format("YYYY-MM-"+(parseInt(fechaQuincenal))),
                }
                let letNpedido = pedidos2.length+(key+1)
                pedidoServices.create(data, e.usuarioId._id, e.usuarioId._id,  letNpedido, null,  (err2, pedido)=>{
                })
            })
            res.json({fechaQuincenal, total:quincenal.length, status:true, quincenal });
        }else{
            res.json({ status:false, messagess: err });
        }
    })
})
router.get('/crear_frecuencia/semanal', (req,res)=>{
    pedidoServices.get((err, pedidos)=>{
        if (!err) {
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERTALAS FECHAS SEMANALES
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
                if(dia===(fechaSemanal+1)) return e
            })
            semanal.map((e, key)=>{
                let data = {
                    forma:e.forma,
                    cantidad:e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :0,
                    puntoId:e.puntoId._id,
                    pedidoPadre:e._id,
                    zonaId:e.zonaId._id,
                    fechaSolicitud:moment(fechaFrecuencia).format("YYYY-MM-"+(parseInt(fechaSemanal))),
                    creado:moment(fechaFrecuencia).format("YYYY-MM-"+(parseInt(fechaSemanal))),
                }
                let letNpedido = pedidos.length+(key+1) ///////////////// esta variable me permite crear el n0 pedido
                pedidoServices.create(data, e.usuarioId._id, e.usuarioId._id, letNpedido, null, (err2, pedido)=>{

                })
            })
            res.json({fechaSemanal, total:semanal.length, status:true, semanal });
        }else{
            res.json({ status:false, messagess: err });
        }
    })
})
router.get('/crear_frecuencia/todos', (req,res)=>{
    pedidoServices.get((err, pedidos)=>{
        if (!err) {
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERTA LAS FECHAS MENSUAL
            let fechaMensual = moment(fechaFrecuencia).format("D")
            fechaMensual = parseInt(fechaMensual)
            let mensual = pedidos.filter(e=>{
                return e.frecuencia=="mensual"
            })
            mensual = mensual.filter(e=>{
                if(parseInt(e.dia1)==(fechaMensual+1)) return e
            })



            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERTA LAS FECHAS QUINCENAL
            let fechaQuincenal = moment(fechaFrecuencia).format("D")
            fechaQuincenal = parseInt(fechaQuincenal)
            let quincenal = pedidos.filter(e=>{
                return e.frecuencia=="quincenal"
            })
            quincenal = quincenal.filter(e=>{
                if(parseInt(e.dia1)==(fechaQuincenal+1) || parseInt(e.dia2)==(fechaQuincenal+1) ) return e
            })

            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            INSERTALAS FECHAS SEMANALES
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
                if(dia===(fechaSemanal+1)) return e
            })


            let mensajeJson={
                badge:mensual.length+quincenal.length+semanal.length
            }
            cliente.publish('pedido', JSON.stringify(mensajeJson))

            let titulo = `<font size="5">Hoy se han creado los siguientes pedidos</font>`
            let text1  = `Frecuencia Mensual: ${mensual.length}<br/>Frecuencia Quincenal: ${quincenal.length}<br/>Frecuencia Semanal: ${semanal.length}<br/>`
            let text2  = `Total pedidos Dia:  ${mensajeJson.badge}`
            let asunto = "Nuevos pedidos por frecuencia"
            let user   = {email:"fernandooj@ymail.com"}
            htmlTemplate(req, user, titulo, text1, text2,  asunto)
            enviaNotificacion(res, "admin", "Nuevos pedidos Frecuencia", `total ${mensajeJson.badge} `)
        }else{
            res.json({ status:false, messagess: err });
        }
    })
})



///////////////////////////////////////////////////////////////////////////////////
////////////////////////            OBTIENE PEDIDOS CON FRECUENCIAS
///////////////////////////////////////////////////////////////////////////////////
router.get('/ver_frecuencia/todos', (req,res)=>{


    pedidoServices.get((err, pedidos)=>{
        if (!err) {
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            OBTIENE LAS FECHAS MENSUAL

            // let mensual = pedidos.filter(e=>{
            //     return e.frecuencia=="mensual"
            // })

            pedidos = pedidos.filter(e=>{
                return e.frecuencia=="mensual" || e.frecuencia=="quincenal" || e.frecuencia=="semanal"
            })
            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            OBTIENE LAS FECHAS QUINCENAL
            // let quincenal = pedidos.filter(e=>{
            //     return e.frecuencia=="quincenal"
            // })

            ////////////////////////////////////////////////////////////////////////
            ////////////////////////            OBTIENE LAS FECHAS SEMANALES

            // let semanal = pedidos.filter(e=>{
            //     return e.frecuencia=="semanal"
            // })


            res.json({ status:true, pedidos });
        }else{
            res.json({ status:false, messagess: err });
        }
    })
})




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CAMBIO LOS TAMAÑOS DE LAS IMAGENES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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