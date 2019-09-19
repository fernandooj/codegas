let express = require('express')
let router = express.Router();
let moment = require('moment-timezone');

let carroServices = require('../services/carroServices.js') 

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS CARROS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        carroServices.get((err, carro)=>{
            if (!err) {
                res.json({ status: true, carro }); 
            }else{
                res.json({ status:false, message: err,  carro:[] }); 
            }
        })
    }
})


////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS ACTIVOS
////////////////////////////////////////////////////////////
router.get('/no_eliminados', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado',  carro:[] }); 
    }else{
        carroServices.getNoEliminados((err, carro)=>{
            if (!err) {
                res.json({ status: true, carro }); 
            }else{
                res.json({ status:false, message: err,  carro:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UN CARRO POR SU ID
////////////////////////////////////////////////////////////
router.get(':carroId', (req,res)=>{
	carroServices.getByCarro(req.params.carroId, (err, carro)=>{
		if (err) {
			res.json({ status:false, message: err, carro:[] }); 
		}else{
			res.json({ status:true, carro });
		}
	})
})



///////////////////////////////////////////////////////////////
////////////        OBTENGO UN CARRO POR UN CONDUCTOR
//////////////////////////////////////////////////////////////
router.get('/byConductor/:idConductor', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        carroServices.getByConductor(req.params.idConductor, (err, carro)=>{
            if (!err) {
                res.json({ status:true, carro }); 
            }else{
                res.json({ status:false, message: err, carro:[] }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UN CONDUCTOR
//////////////////////////////////////////////////////////////
router.get('/asignarConductor/:idCarro/:idConductor', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        carroServices.asignarConductor(req.params.idCarro, req.params.idConductor, (err, carro)=>{
            if (!err) {
                res.json({ status:true, carro }); 
            }else{
                res.json({ status:false, message: err,  carro:[] }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////      DESVINCULA UN CONDUCTOR
//////////////////////////////////////////////////////////////
router.get('/desvincularConductor/:idCarro/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        carroServices.desvincularConductor(req.params.idCarro,  (err, carro)=>{
            if (!err) {
                res.json({ status:true, carro }); 
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
        carroServices.cambiarEstado(req.params.idPedido, req.params.estado, (err, pedido)=>{
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
        carroServices.eliminar(req.params.idVehiculo, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////       GUARDO UN CARRO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado', code:0 }); 
	}else{
        carroServices.getByPlaca(req.body.placa, (err, carro)=>{
         console.log(carro)   
         if(!carro){
             carroServices.create(req.body, req.session.usuario._id, (err, pedido)=>{
                 if (!err) {
                     res.json({ status: true, pedido });	
                 } 
             })
         }else{
            res.json({ status: false, message: 'ya existe esta placa', code:1 }); 
         }
        })
	}
})



module.exports = router;