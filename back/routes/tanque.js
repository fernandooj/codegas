let express = require('express')
let router = express.Router();
let tanqueServices = require('../services/tanqueServices.js') 

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS tanqueS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        tanqueServices.get((err, tanque)=>{
            if (!err) {
                res.json({ status: true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
    }
})


////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS ACTIVOS
////////////////////////////////////////////////////////////
router.get('/no_eliminados', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado',  tanque:[] }); 
    }else{
        tanqueServices.getNoEliminados((err, tanque)=>{
            if (!err) {
                res.json({ status: true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UN tanque POR SU ID
////////////////////////////////////////////////////////////
router.get('byId/:tanqueId', (req,res)=>{
	tanqueServices.getByTanque(req.params.tanqueId, (err, tanque)=>{
		if (err) {
			res.json({ status:false, message: err, tanque:[] }); 
		}else{
			res.json({ status:true, tanque });
		}
	})
})



///////////////////////////////////////////////////////////////
////////////        OBTENGO UN tanque POR UN Usuario
//////////////////////////////////////////////////////////////
router.get('/byUsuario/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.getByUsuario(req.params.idCliente, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err, tanque:[] }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////      ASIGNA UN Usuario
//////////////////////////////////////////////////////////////
router.get('/asignarUsuario/:idtanque/:idCliente', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.asignarUsuario(req.params.idtanque, req.params.idCliente, (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
            }else{
                res.json({ status:false, message: err,  tanque:[] }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////      DESVINCULA UN Usuario
//////////////////////////////////////////////////////////////
router.get('/desvincularUsuario/:idTanque/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.desvincularUsuario(req.params.idTanque,  (err, tanque)=>{
            if (!err) {
                res.json({ status:true, tanque }); 
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
        tanqueServices.cambiarEstado(req.params.idPedido, req.params.estado, (err, pedido)=>{
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
        tanqueServices.eliminar(req.params.idVehiculo, req.params.estado, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////      EDITAR
//////////////////////////////////////////////////////////////
router.put('/editar/:idVehiculo/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        tanqueServices.editar(req.params.idVehiculo, req.body, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})


///////////////////////////////////////////////////////////////
////////////       GUARDO UN tanque
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado', code:0 }); 
	}else{
        tanqueServices.getByPlaca(req.body.placa, (err, tanque)=>{
         console.log(tanque)   
         if(!tanque){
             tanqueServices.create(req.body, req.session.usuario._id, (err, pedido)=>{
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