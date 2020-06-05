let express = require('express')
let router = express.Router();
 
let capacidadServices = require('../services/capacidadServices.js') 
 
 
////////////////////////////////////////////////////////////
////////////        OBTENGO LA capacidad
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        capacidadServices.get((err, capacidad)=>{
            if (!err) {
                res.json({ status: true, capacidad }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})
 
///////////////////////////////////////////////////////////////
////////////       GUARDO UNA CAPACIDAD
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado', code:0 }); 
	}else{
        capacidadServices.create(req.body.capacidad, (err2, capacidad)=>{
            if (!err2) {
                res.json({ status: true, capacidad });	
            } 
        })
	}
})

///////////////////////////////////////////////////////////////
////////////       CAMBIAR CAPACIDAD
//////////////////////////////////////////////////////////////
router.put('/eliminar/:capacidadId', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        capacidadServices.eliminar(req.params.capacidadId, (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})



module.exports = router;



