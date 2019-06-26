let express = require('express')
let router = express.Router();
let calificacionServices = require('../services/calificacionServices.js') 
 
///////////////////////////////////////////////////////////////
////////////       GUARDO UN ORDEN PEDIDO
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    calificacionServices.create(req.body, (err2, pedido)=>{
        if (!err2) {
            res.json({ status: true, pedido });	
        }else{
            res.json({ status: false });	    
        }
    })
})
 


module.exports = router;