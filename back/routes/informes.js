let express              = require('express')
let router               = express.Router();
const {Parser}           = require('json2csv');
const PDFDocument        = require('pdfkit');
let  moment              = require('moment-timezone');
let pedidoServices       = require('../services/pedidoServices.js') 
let userServices         = require('./../services/userServices.js') 
let conversacionServices = require('../services/conversacionServices.js')
let puntoServices        = require('../services/puntoServices.js') 
let carroServices        = require('../services/carroServices.js') 
let novedadServices      = require('../services/novedadServices.js') 
let calificacionServices = require('../services/calificacionServices.js') 

let fs = require('fs');
///////////////////////////////////////////////////   1.    CONVERSACIONES
router.get('/conversacion/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    conversacionServices.get((err, pedidos)=>{
        if(!err){
            const fields = [{
                    label: 'Creado',
                    value: 'creado'
                },{
                    label: 'Cliente',
                    value: 'usuarioId2.nombre'
                },{
                    label: 'Celular',
                    value: 'usuarioId2.celular'
                },{
                    label: 'Cerrado',
                    value: 'update'
                },{
                    label: 'Duracion',
                    value: 'duracion'
                },{
                    label: 'Funcionario',
                    value: 'usuarioId1.nombre'
                }];
                const opts = {fields, withBOM:true};
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(pedidos);
                res.attachment('conversacion.csv');
                res.status(200).send(csv);
            } catch (err) {
                console.error(err);
            }
        }
    })
})

///////////////////////////////////////////////////   2.	USUARIOS CORPORATIVOS
router.get('/users/corporativos/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    userServices.get((err, usuarios)=>{
        if(!err){
            usuarios = usuarios.filter(e=>{
                return e.acceso=="despacho" || e.acceso=="conductor" || e.acceso=="admin" || e.acceso=="solucion"
            })
            usuarios = usuarios.filter(e=>{
                return e.created>fechaInicio && e.created<fechaFinal
            })
            console.log(usuarios.length)
            let usuario = req.session.usuario.nombre
            let fecha = moment().subtract(5, 'hours');
            fecha     = moment(fecha).format('YYYY-MM-DD_h:mm');

            const fields = [{
                label: 'Correo',
                value: 'email'
            },{
                label: 'Cedula',
                value: 'cedula'
            },{
                label: 'Nombre',
                value: 'nombre'
            },{
                label: 'Telefono',
                value: 'celular'
            },{
                label: 'Creación',
                value: 'created'
            },{
                label: 'Avatar',
                value: 'avatar'
            },{
                label: usuario,
                value: ''
            }
            ,{
                label: fecha,
                value: ''
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(usuarios);
                res.attachment('usuariosCorporativos.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})

///////////////////////////////////////////////////   2.	USUARIOS CORPORATIVOS
router.get('/users/clientesVeos/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    userServices.getByCliente((err, usuarios)=>{
        if(!err){
            usuarios = usuarios.filter(e=>{
                return e.idPadre==null
            })
             
            const fields = [{
                label: 'Codt',
                value: 'codt'
            },{
                label: 'Nit',
                value: 'cedula'
            },{
                label: 'Razon Social',
                value: 'razon_social'
            },{
                label: 'Nombre',
                value: 'nombre'
            },{
                label: 'Veo',
                value: 'comercialAsignado.nombre'
            },{
                label: 'Telefono',
                value: 'celular'
            },{
                label: 'Avatar',
                value: 'avatar'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(usuarios);
                res.attachment('usuariosCorporativos.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }else{
            console.log(err)
        }
    })
})

///////////////////////////////////////////////////   3.	CLIENTES
router.get('/users/clientes/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    puntoServices.getUsers((err, clientes)=>{
        if(!err){
            // clientes = clientes.filter(e=>{
            //     return e.created>fechaInicio && e.created<fechaFinal
            // })
            const fields = [{
                label: 'Correo',
                value: 'UserData.email'
            },{
                label: 'Razon Social',
                value: 'UserData.razon_social'
            },{
                label: 'Cedula',
                value: 'UserData.cedula'
            },{
                label: 'Direccion Factura',
                value: 'UserData.direccion_factura'
            },{
                label: 'CODT',
                value: 'UserData.codt'
            },{
                label: 'Nombre',
                value: 'UserData.nombre'
            },{
                label: 'Email',
                value: 'UserData.email'
            },{
                label: 'Celular',
                value: 'UserData.celular'
            },{
                label: 'Creado',
                value: 'UserData.created'
            },{
                label: 'Zona',
                value: 'ZonaData.nombre'
            },{
                label: 'Valor Unitario',
                value: 'UserData.valorUnitario'
            },{
                label: 'Direccion',
                value: 'direccion'
            },{
                label: 'Observacion',
                value: 'observacion'
            },{
                label: 'Veo',
                value: 'UserData.comercialAsignado'
            },{
                label: 'Codigo Registro',
                value: 'UserData.codigoRegistro'
            }];

            const opts = {fields};
 
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(clientes);
                res.attachment('clientes.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})

///////////////////////////////////////////////////   4.	VEHICULOS
router.get('/vehiculos/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    let {fechaInicio, fechaFinal} = req.params
    fechaInicio = fechaInicio.valueOf()
    fechaFinal  = fechaFinal.valueOf()
    carroServices.get((err, carro)=>{
        carro = carro.filter(e=>{
            return e.creado>fechaInicio && e.creado<fechaFinal
        })
        if(!err){
            const fields = [{
                label: 'Placa',
                value: 'placa'
            },{
                label: 'Conductor',
                value: 'conductor.nombre'
            },{
                label: 'Usuario Crea ',
                value: 'usuarioCrea.nombre'
            },{
                label: 'Creado',
                value: 'creado'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(carro);
                res.attachment('vehiculos.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})

////////////////////////////////////////////  5.	PEDIDOS TRAZABILIDAD DE PEDIDO
router.get('/pedidos/trazabilidad/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    pedidoServices.get((err, pedido)=>{
        if(!err){
            pedido = pedido.filter(e=>{
                return e.estado!=="noentregado"  
            })
            pedido["CV"]=""
            pedido = pedido.filter(e=>{
                let data=e.usuarioId.cedula.split('-')
                e.usuarioId.cedula=data[0]
                e.CV=data[1]
                return e
            })
            pedido = pedido.filter(e=>{
                e.usuarioId.cedula=e.usuarioId.cedula.replace('.', '')
                e.usuarioId.cedula=e.usuarioId.cedula.replace(',', '')
                return e
            })
            
            pedido = pedido.filter(e=>{
                return e.creado>fechaInicio && e.creado<fechaFinal
            })
            
            const fields = [{   
                label: 'N Pedido',
                value: 'nPedido'
            },{
                label: 'CODT',
                value: 'usuarioId.codt'
            },{
                label: 'Cedula ',
                value: 'usuarioId.cedula'
            },{
                label: 'CV',
                value: 'CV'
            },{
                label: 'Razon Social',
                value: 'usuarioId.razon_social'
            },{
                label: 'Punto Consumo',
                value: 'puntoId.direccion'
            },{
                label: 'Zona',   // aun no esta
                value: 'zonaId.nombre'
            },{
                label: 'Fecha Ingreso',
                value: 'creado'
            },{
                label: 'Fecha Solicitud',
                value: 'fechaSolicitud'
            },{
                label: 'Estado Pedido',
                value: 'estado'
            },{
                label: 'Fecha Entrega',
                value: 'fechaEntrega'
            },{
                label: 'Kilos',
                value: 'kilos'
            },{
                label: 'Usuario Asigna',
                value: 'usuarioAsigna.nombre'
            },{
                label: 'Usuario Asigna Vehiculo',
                value: 'usuarioAsignaVehiculo.nombre'
            },{
                label: 'Vehiculo asignado', // aun no esta
                value: 'carroId.placa'
            },{
                label: 'Vehiculo Centro', // aun no esta
                value: 'carroId.centro'
            },{
                label: 'Vehiculo Bodega', // aun no esta
                value: 'carroId.bodega'
            },{
                label: 'Conductor asignado',
                value: 'conductorId.nombre'
            },{
                label: 'Imagen',
                value: 'imagen'
            },{
                label: 'Imagen de cierre',
                value: 'imagenCerrar'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(pedido);
                res.attachment('trazabilidadPedidos.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})


////////////////////////////////////////////  6.	PEDIDOS NO ENTREGADOS
router.get('/pedidos/no_entregados/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    pedidoServices.get((err, pedido)=>{
        if(!err){
            pedido = pedido.filter(e=>{
                return e.estado=="noentregado" && e.entregado
            })
            pedido = pedido.filter(e=>{
                return e.creado>fechaInicio && e.creado<fechaFinal
            })
            pedido["CV"]=""
            pedido = pedido.filter(e=>{
                let data=e.usuarioId.cedula.split('-')
                e.usuarioId.cedula=data[0]
                e.CV=data[1]
                return e
            })
            pedido = pedido.filter(e=>{
                e.usuarioId.cedula=e.usuarioId.cedula.replace('.', '')
                e.usuarioId.cedula=e.usuarioId.cedula.replace(',', '')
                return e
            })
            pedido = pedido.filter(e=>{
                let imagenPedido1 = e.imagen ?e.imagen.split("-") :""
                e.imagen = `${imagenPedido1[0]}Miniatura${imagenPedido1[1]}`
                return e
            })
            const fields = [{   
                label: 'N Pedido',
                value: 'nPedido'
            },{
                label: 'CODT',
                value: 'usuarioId.codt'
            },{
                label: 'Cedula ',
                value: 'usuarioId.cedula'
            },{
                label: 'Razon Social',
                value: 'usuarioId.razon_social'
            },{
                label: 'Punto Consumo',
                value: 'puntoId.direccion'
            },{
                label: 'Zona',   // aun no esta
                value: 'factura'
            },{
                label: 'Fecha asignación',
                value: 'fechaEntrega'
            },{
                label: 'Vehiculo asignado', // aun no esta
                value: 'carroId.placa'
            },{
                label: 'Conductor asignado',
                value: 'conductorId.nombre'
            },{
                label: 'Motivo no entrega',
                value: 'motivo_no_cierre'
            },{
                label: 'Imagen de cierre',
                value: 'imagenCerrar'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(pedido);
                res.attachment('pedidosNoEntregados.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})


////////////////////////////////////////////  7.	PEDIDOS ENTREGADOS / FACTURACION
router.get('/pedidos/cerrados/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    pedidoServices.get((err, pedido)=>{
        if(!err){
            pedido = pedido.filter(e=>{
                return e.estado=="activo" && e.entregado
            })
            pedido = pedido.filter(e=>{
                return e.creado>fechaInicio && e.creado<fechaFinal
            })
            pedido["CV"]=""
            pedido = pedido.filter(e=>{
                let data=e.usuarioId.cedula.split('-')
                e.usuarioId.cedula=data[0]
                e.CV=data[1]
                return e
            })
            pedido = pedido.filter(e=>{
                e.usuarioId.cedula=e.usuarioId.cedula.replace('.', '')
                e.usuarioId.cedula=e.usuarioId.cedula.replace(',', '')
                return e
            })
            /////// remplaza las comas de los kilos por punto
            pedido = pedido.filter(e=>{
                return e.kilos=e.kilos.replace(',', '.')
            })
            /////// remplaza las comas por punto en valor unitario
            pedido = pedido.filter(e=>{
                if(e.valor_total&&e.kilos){
                    e.valorUnitario=e.valor_total/e.kilos
                }else{
                    e.valorUnitario=e.usuarioId.valorUnitario
                }
                return e
            })
            
            /////// da el valor total
            // pedido.push({valor_total:0})
            // pedido = pedido.filter(e=>{
            //     return e.valor_total = e.kilos*e.valor_unitario
            // })
            
            const fields = [{   
                label: 'N Pedido',
                value: 'nPedido'
            },{
                label: 'CODT',
                value: 'usuarioId.codt'
            },{
                label: 'Cedula ',
                value: 'usuarioId.cedula'
            },{
                label: 'Razon Social',
                value: 'usuarioId.razon_social'
            },{
                label: 'Punto Consumo',
                value: 'puntoId.direccion'
            },{
                label: 'N Factura',
                value: 'factura'
            },{
                label: 'Placa',
                value: 'carroId.placa'
            },{
                label: 'Conductor',
                value: 'conductorId.nombre'
            },{
                label: 'Vehiculo Centro', // aun no esta
                value: 'carroId.centro'
            },{
                label: 'Vehiculo Bodega', // aun no esta
                value: 'carroId.bodega'
            },{
                label: 'Fecha Asignación',
                value: 'fechaEntrega'
            },{
                label: 'Fecha Entrega',
                value: 'fechaEntrega'
            },{
                label: 'Kilos',
                value: 'kilos'
            },{
                label: 'Estado',
                value: 'estado'
            },{
                label: 'Remision',
                value: 'remision'
            },{
                label: 'Valor Unitario Usuario',
                value: 'usuarioId.valorUnitario'
            },{
                label: 'Valor Unitario',
                value: 'valorUnitario'
            },{
                label: 'Valor Total', /// aun no esta
                value: 'valor_total'
            },{
                label: 'Forma de pago', /// aun no esta
                value: 'forma_pago'
            },{
                label: 'Imagen', /// aun no esta
                value: 'imagenCerrar'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(pedido);
                res.attachment('pedidosEntregados.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})


///////////////////////////////////////////  8.	PEDIDOS TRAZABILIDAD DE PEDIDO
router.get('/pedidos/programacion/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    console.log({fechaInicio, fechaFinal})
    pedidoServices.get((err, pedido)=>{
        if(!err){
             
            pedido["CV"]=""
            pedido = pedido.filter(e=>{
                let data=e.usuarioId.cedula.split('-')
                e.usuarioId.cedula=data[0]
                e.CV=data[1]
                return e
            })
            pedido = pedido.filter(e=>{
                e.usuarioId.cedula=e.usuarioId.cedula.replace('.', '')
                e.usuarioId.cedula=e.usuarioId.cedula.replace(',', '')
                return e
            })
            
            pedido = pedido.filter(e=>{
                return e.creado>=fechaInicio && e.creado<=fechaFinal
            })
            
            const fields = [{   
                label: 'N Pedido',
                value: 'nPedido'
            },{
                label: 'CODT',
                value: 'usuarioId.codt'
            },{
                label: 'Cedula ',
                value: 'usuarioId.cedula'
            },{
                label: 'Razon Social',
                value: 'usuarioId.razon_social'
            },{
                label: 'Punto Consumo',
                value: 'puntoId.direccion'
            },{
                label: 'N Factura',
                value: 'factura'
            },{
                label: 'Placa',
                value: 'carroId.placa'
            },{
                label: 'Estado',
                value: 'estado'
            },{
                label: 'Entregado',
                value: 'entregado'
            },{
                label: 'Conductor',
                value: 'conductorId.nombre'
            },{
                label: 'Fecha Solicitud',
                value: 'fechaSolicitud'
            },{
                label: 'Kilos',
                value: 'kilos'
            },{
                label: 'Remision',
                value: 'remision'
            },{
                label: 'Valor Unitario Usuario',
                value: 'usuarioId.valorUnitario'
            },{
                label: 'Valor Unitario',
                value: 'valorUnitario'
            },{
                label: 'Valor Total', /// aun no esta
                value: 'valor_total'
            },{
                label: 'Forma de pago', /// aun no esta
                value: 'forma_pago'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(pedido);
                res.attachment('programacion.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})


////////////////////////////////////////////  9.	OBSERVACIONES
router.get('/novedades/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    novedadServices.get((err, novedad)=>{
        if(!err){
            novedad = novedad.filter(e=>{
                return e.creado>fechaInicio && e.creado<fechaFinal
            })
            const fields = [{   
                label: 'N Pedido',
                value: 'pedidoId.nPedido'
            },{
                label: 'Usuario',
                value: 'usuarioId.nombre'
            },{
                label: 'Observacion',
                value: 'novedad'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(novedad);
                res.attachment('novedades.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})


////////////////////////////////////////////  9.	CALIFICACIONES
router.get('/calificaciones/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    let {fechaInicio, fechaFinal} = req.params
    calificacionServices.getAll((err, calificacion)=>{
        if(!err){
            
            calificacion = calificacion.map(e=>{
                return {
                    nombreEmpleado:e.data[0].nombreEmpleado,
                    nombreCliente:e.data[0].nombreCliente,
                    calificacion:e.data[0].calificacion,
                    sugerencia:e.data[0].sugerencia,
                    creado:e.data[0].fecha,
                }
            })
            calificacion = calificacion.filter(e=>{
                return e.creado>fechaInicio && e.creado<fechaFinal
            })
            
            const fields = [{   
                label: 'Fecha',
                value: 'creado'
            },{
                label: 'Cliente',
                value: 'nombreCliente'
            },{
                label: 'Operador',
                value: 'nombreEmpleado'
            },{
                label: 'Sugerencia',
                value: 'sugerencia'
            },{
                label: 'Calificación',
                value: 'calificacion'
            }];
            const opts = {fields, withBOM:true};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(calificacion);
                res.attachment('calificaciones.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})



////////////////////////////////////////////  8.	conversaciones
router.get('/pdf/chats/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    const {fechaInicio, fechaFinal} = req.params
    conversacionServices.groupoByConversacion((err, mensajes)=>{
        if(!err){
            mensajes = mensajes.filter(e=>{
                return e.creado>fechaInicio && e.creado<fechaFinal
            })
            
            let doc = new PDFDocument;
            doc.pipe(fs.createWriteStream('chats.pdf'));
             
            mensajes = mensajes.map(e=>{
                doc.moveDown()
                doc.moveDown()
                doc.text(`conversacion entre el corporativo: ${e._id.nombre1} y el cliente: ${e._id.nombre2}, inicio el: ${e._id.creado}, Finalizo: ${e._id.update}`, {
                    stroke:1
                })
                doc.moveDown()
                doc.moveDown()
                return e.data.map(data=>{
                    let imagen = data.tipo===2 &&data.imagen.split("-")
                    doc.moveDown()
                    data.tipo==1
                    ?doc.text(`Mensaje: ${data.mensaje}`, {
                       
                    })
                    :doc.image(`../front/docs/public/uploads/mensaje/${imagen[2]}`,  {width: 100})
                    
                   
                    doc.text(`Usuario: ${data.nombreMensaje}`)
                    doc.text(`Creado: ${data.creado}`)
                })
            })
            doc.pipe(res)
            doc.end();

        }
    })
})




module.exports = router;