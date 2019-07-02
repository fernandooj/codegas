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

router.get('/activos', (req,res)=>{
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
        puntoServices.create(e, req.body.id, req.body.id, (err2, puntos)=>{
            console.log(puntos)
        })
    })
    res.json({ status: true });	
})


///////////////////////////////////////////////////////////////
////////////       EDITO UN PUNTO
//////////////////////////////////////////////////////////////
router.put('/', (req,res)=>{
    puntoServices.eliminar(req.body._id, (err2, puntos)=>{
        if (!err2) {
            res.json({ status: true, puntos });	
        }else{
            res.json({ status: false });	    
        }
    })
})
 


module.exports = router;