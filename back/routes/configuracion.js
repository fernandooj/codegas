let express = require('express')
let router = express.Router();
 
let configuracionServices = require('../services/configuracionServices.js') 
 
 
////////////////////////////////////////////////////////////
////////////        OBTENGO LA CONFIGURACION
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        configuracionServices.get((err, configuracion)=>{
            if (!err) {
                res.json({ status: true, configuracion }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})
 
///////////////////////////////////////////////////////////////
////////////       CAMBIAR PLACA
//////////////////////////////////////////////////////////////
router.put('/editarPlaca', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        configuracionServices.get((err, configuracion)=>{
            configuracionServices.editarPlaca(configuracion._id, req.body.placas, (err, pedido)=>{
                if (!err) {
                    res.json({ status:true, pedido }); 
                }else{
                    res.json({ status:false, message: err }); 
                }
            })
        })
    }
})

///////////////////////////////////////////////////////////////
////////////       CAMBIAR editarValorUnitario
//////////////////////////////////////////////////////////////
router.put('/editarValorUnitario/', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        configuracionServices.get((err, configuracion)=>{
            configuracionServices.editarValorUnitario(configuracion._id, req.body.valor_unitario, (err, pedido)=>{
                if (!err) {
                    res.json({ status:true, pedido }); 
                }else{
                    res.json({ status:false, message: err }); 
                }
            })

        })
    }
})

///////////////////////////////////////////////////////////////
////////////       GUARDO UNA CONFIGURACION
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado', code:0 }); 
	}else{
        configuracionServices.get((err, configuracions)=>{
            configuracionServices.create(req.body, (err2, configuracion)=>{
                if (!err2) {
                    res.json({ status: true, configuracion });	
                } 
            })
        })
	}
})


  

module.exports = router;