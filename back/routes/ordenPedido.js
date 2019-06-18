let express = require('express')
let router = express.Router();
let moment = require('moment-timezone');

let ordenPedidoServices = require('../services/ordenPedidoServices.js') 

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS CARROS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        ordenPedidoServices.get((err, carro)=>{
            if (!err) {
                res.json({ status: true, carro }); 
            }else{
                res.json({ status:false, message: err,  carro:[] }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////       GUARDO UN ORDEN PEDIDO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado' }); 
	}else{
        // ordenPedidoServices.create(req.body, req.session.usuario._id, (err2, pedido)=>{
        //     if (!err2) {
        //         res.json({ status: true, pedido });	
        //     }else{
        //         res.json({ status: false, err2 });	
        //     }
        // })
        ordenPedidoServices.getByFechaCarro(req.body.fecha, req.body.carroId, (err, ordenPedido)=>{
            if(!err){
                if(ordenPedido){
                    ordenPedidoServices.editar(ordenPedido._id, req.body.pedidos, (err2, pedido)=>{
                        if (!err2) {
                            res.json({ status: true, pedido });	
                        } 
                    })
                }else{
                    ordenPedidoServices.create(req.body, req.session.usuario._id, (err2, pedido)=>{
                        if (!err2) {
                            res.json({ status: true, pedido });	
                        } 
                    })
                }
            }
        })
	}
})

///////////////////////////////////////////////////////////////
////////////       GUARDO UN ORDEN PEDIDO
//////////////////////////////////////////////////////////////
router.put('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado' }); 
	}else{
		ordenPedidoServices.create(req.body, req.session.usuario._id, (err, pedido)=>{
			if (!err) {
                res.json({ status: true, pedido });	
            } 
		})
	}
})




module.exports = router;