let express = require('express')
let router = express.Router();
const {Parser} = require('json2csv');
let pedidoServices     = require('../services/pedidoServices.js') 
let userServices       = require('./../services/userServices.js') 
let conversacionServices = require('../services/conversacionServices.js')
let puntoServices = require('../services/puntoServices.js') 
let carroServices = require('../services/carroServices.js') 

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
            const opts = {fields};
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
    userServices.get((err, pedidos)=>{
        if(!err){
            pedidos = pedidos.filter(e=>{
                return e.acceso=="despacho" || e.acceso=="conductor" || e.acceso=="admin" || e.acceso=="solucion"
            })
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
            }];
            const opts = {fields};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(pedidos);
                res.attachment('usuariosCorporativos.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})

///////////////////////////////////////////////////   2.	CLIENTES
router.get('/users/clientes/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    puntoServices.getUsers((err, puntos)=>{
        if(!err){
            
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
                label: 'Direccion',
                value: 'direccion'
            },{
                label: 'Observacion',
                value: 'observacion'
            }];

            const opts = {fields};
 
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(puntos);
                res.attachment('clientes.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})

///////////////////////////////////////////////////   3.	Vehículos
router.get('/vehiculos/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    carroServices.get((err, carro)=>{
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
            const opts = {fields};
             
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

////////////////////////////////////////////  5.	PEDIDOS NO ENTREGADOS
router.get('/pedidos/no_entregados/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    pedidoServices.get((err, pedido)=>{
        if(!err){
            pedido = pedido.filter(e=>{
                return e.estado=="noentregado" && e.entregado
            })
            // res.json({pedido})
            const fields = [{   
                label: 'N Pedido',
                value: '_id'
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
                value: 'carroId.placa'
            },{
                label: 'Vehiculo asignado', // aun no esta
                value: 'carroId.placa'
            },{
                label: 'Conductor asignado',
                value: 'conductorId.nombre'
            },{
                label: 'Motivo no entrega',
                value: 'motivo_no_cierre'
            }];
            const opts = {fields};
             
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


////////////////////////////////////////////  6.	PEDIDOS ENTREGADOS
router.get('/pedidos/cerrados/:email/:fechaInicio/:fechaFinal', (req,res)=>{
    pedidoServices.get((err, carro)=>{
        if(!err){
            carro = carro.filter(e=>{
                return e.estado=="activo" && e.entregado
            })
            // res.json({carro})
            const fields = [{   
                label: 'N Pedido',
                value: '_id'
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
                label: 'Fecha factura',
                value: 'fechaEntrega'
            },{
                label: 'Kilos',
                value: 'kilos'
            },{
                label: 'Valor Unitario',
                value: 'valor_unitario'
            },{
                label: 'Valor Total', /// aun no esta
                value: 'valor_total'
            },{
                label: 'Forma de pago', /// aun no esta
                value: 'forma_pago'
            }];
            const opts = {fields};
             
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(carro);
                res.attachment('pedidosEntregados.csv');
                res.status(200).send(csv);
              } catch (err) {
                console.error(err);
              }
        }
    })
})



module.exports = router;