let express = require('express')
let router = express.Router();

let novedadServices = require('../services/novedadServices.js')  
 

////////////////////////////////////////////////////////////
////////////        OBTENGO TODOS LOS PEDIDOS SI ES CLIENTE, TRAE SUS RESPECTIVOS PEDIDOS
////////////////////////////////////////////////////////////
router.get('/', (req,res)=>{
    if (!req.session.usuario) {
        res.json({ status:false, message: 'No hay un usuario logueado' }); 
    }else{
        pedidoServices.get( (err, pedido)=>{
            if (!err) {
                res.json({ status:true, pedido }); 
            }else{
                res.json({ status:false, message: err, pedido:[] }); 
            }
        })
    }
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UNA NOVEDAD POR SU ID
////////////////////////////////////////////////////////////
router.get('/byNovedad/:novedadId', (req,res)=>{
	novedadServices.getByNovedad(req.params.novedadId, (err, novedad)=>{
		if (err) {
			res.json({ status:false, message: err }); 
		}else{
            
			res.json({ status:true, novedad });
		}
	})
})

////////////////////////////////////////////////////////////
////////////        OBTENGO UNA NOVEDAD POR SU ID
////////////////////////////////////////////////////////////
router.get('/byPedido/:pedidoId', (req,res)=>{
	novedadServices.getByPedido(req.params.pedidoId, (err, novedad)=>{
		if (err) {
			res.json({ status:false, message: err, novedad:[] }); 
		}else{
            novedad = novedad.filter(e=>{
                return e.novedad
            })
			res.json({ status:true, novedad });
		}
	})
})


///////////////////////////////////////////////////////////////
////////////        OBTENGO UNA NOVEDAD POR UN USUARIO
//////////////////////////////////////////////////////////////
router.get('/byUser/:idUser', (req,res)=>{
    if (!req.session.usuario) {
		res.json({ status:false, message: 'No hay un usuario logueado' }); 
	}else{
        novedadServices.getByUser(req.params.idUser, (err, novedad)=>{
            if (!err) {
                res.json({ status:true, novedad }); 
            }else{
                res.json({ status:false, message: err }); 
            }
        })
    }
})

///////////////////////////////////////////////////////////////
////////////       GUARDO LAS NOVEDADES
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
	if (!req.session.usuario) {
		res.json({ status: false, message: 'No hay un usuario logueado' }); 
	}else{
		novedadServices.create(req.body, req.session.usuario._id, (err, novedad)=>{
			if (!err) {
                
                res.json({ status: true, novedad });	
            } 
		})
	}
})
     

module.exports = router;