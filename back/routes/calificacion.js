let express = require('express')
let router = express.Router();
let calificacionServices = require('../services/calificacionServices.js') 


router.get('/', (req,res)=>{
    calificacionServices.getAll((err2, calificacion)=>{
        if (!err2) {
            res.json({ status: true, calificacion });	
        }else{
            res.json({ status: false });	    
        }
    })
})

///////////////////////////////////////////////////////////////
////////////       GUARDO UN ORDEN PEDIDO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    calificacionServices.create(req.body, (err2, calificacion)=>{
        console.log(err2)
        if (!err2) {
            
            res.json({ status: true, calificacion });	
        }else{
            res.json({ status: false });	    
        }
    })
})
 


module.exports = router;