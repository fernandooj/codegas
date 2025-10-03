let express = require('express')
let router = express.Router();
let puntoServices = require('../services/puntoServices.js') 
let zonaServices = require('../services/zonaServices.js') 


router.get('/', (req,res)=>{
    zonaServices.getAll((err2, zona)=>{
        if (!err2) {
            res.json({ status: true, zona });	
        }else{
            res.json({ status: false });	    
        }
    })
})

router.get('/activos', (req,res)=>{
    zonaServices.getActivos((err2, zona)=>{
        if (!err2) {
            res.json({ status: true, zona });	
        }else{
            res.json({ status: false });	    
        }
    })
})
/////////////////////////////////////////////////////////////////////////
////////////       OBTENGO LAS ZONAS CON MAS PEDIDOS EN UNA FECHA
/////////////////////////////////////////////////////////////////////////
router.get('/pedido/:fechaEntrega', (req,res)=>{
    puntoServices.getZonas(req.params.fechaEntrega, (err2, zona)=>{
        if (!err2) {
            res.json({ status: true, zona });	
        }else{
            res.json({ status: false });	    
        }
    })
})

/////////////////////////////////////////////////////////////////////////
////////////       OBTENGO LAS ZONAS CON MAS PEDIDOS EN UNA FECHA
/////////////////////////////////////////////////////////////////////////
router.get('/pedidoSolicitud/:fechaSolicitud', (req,res)=>{
    puntoServices.getZonasFechaSolicitud(req.params.fechaSolicitud, (err2, zona)=>{
        if (!err2) {
            res.json({ status: true, zona });	
        }else{
            res.json({ status: false });	    
        }
    })
})



///////////////////////////////////////////////////////////////
////////////       GUARDO UNA ZONA
//////////////////////////////////////////////////////////////
router.post('/', (req,res)=>{
    zonaServices.create(req.body.nombre, (err2, zonas)=>{
        if (!err2) {
            res.json({ status: true, zonas });	
        }else{
            res.json({ status: false });	    
        }
    })
})


///////////////////////////////////////////////////////////////
////////////       GUARDO UNA ZONA
//////////////////////////////////////////////////////////////
router.put('/', (req,res)=>{
    zonaServices.eliminar(req.body._id, (err2, zonas)=>{
        if (!err2) {
            res.json({ status: true, zonas });	
        }else{
            res.json({ status: false });	    
        }
    })
})
 


module.exports = router;