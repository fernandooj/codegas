let express = require('express')
let router = express.Router();
let puntoServices = require('../services/puntoServices.js') 


router.get('/', (req,res)=>{
    puntoServices.getAll((err2, punto)=>{
        if (!err2) {
            res.json({ status: true, punto });	
        }else{
            res.json({ status: false });	    
        }
    })
})




router.get('/zonas', (req,res)=>{
    puntoServices.getActivos((err2, punto)=>{
        if (!err2) {
            res.json({ status: true, punto });	
        }else{
            res.json({ status: false });	    
        }
    })
})


router.get('/byCliente/:idCliente', (req,res)=>{
    puntoServices.getCliente(req.params.idCliente, (err2, puntos)=>{
        if (!err2) {
            res.json({ status: true, puntos });	
        }else{
            res.json({ status: false });	    
        }
    })
})



///////////////////////////////////////////////////////////////
////////////       GUARDO UN PUNTO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    puntoServices.create(req.body.nombre, (err2, puntos)=>{
        if (!err2) {
            res.json({ status: true, puntos });	
        }else{
            res.json({ status: false });	    
        }
    })
})

///////////////////////////////////////////////////////////////
////////////       GUARDO VARIOS PUNTOS
//////////////////////////////////////////////////////////////
router.post('/varios', (req,res)=>{
    req.body.puntos.map(e=>{
        puntoServices.create(e, req.body.idCliente, req.body.idPadre, (err2, puntos)=>{
            console.log({test:req.body.idPadre})
        })
    })
    res.json({ status: true });	
})


///////////////////////////////////////////////////////////////
////////////       ELIMINO UN PUNTO
//////////////////////////////////////////////////////////////
router.delete('/', (req,res)=>{
    puntoServices.eliminar(req.body._id, (err2, puntos)=>{
        if (!err2) {
            res.json({ status: true, puntos });	
        }else{
            res.json({ status: false });	    
        }
    })
})
 
///////////////////////////////////////////////////////////////
////////////       EDITO VARIOS PUNTOS
//////////////////////////////////////////////////////////////
router.put('/varios', (req,res)=>{
    req.body.puntos.map(e=>{
        puntoServices.editar(e, e._id, (err2, puntos)=>{
            // console.log(puntos)
        })
    })
    res.json({ status: true });	
})



module.exports = router;