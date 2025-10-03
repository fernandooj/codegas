//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
let ReporteEmergencia = new Schema({
    creado 	          : String,
    nReporte          : Number,      
    tanque            : {type:Boolean, default:false},
    red               : {type:Boolean, default:false},  
    puntos            : {type:Boolean, default:false},  
    fuga              : {type:Boolean, default:false},  
    pqr               : {type:Boolean, default:false},  
	otrosText		  : String,
    cerradoText		  : String,
	ruta   	          : [],
	documento         : [],
	rutaCerrar        : [],

    activo 			  : {type:Boolean, default:true},
	eliminado		  : {type:Boolean, default:false},
	usuarioCrea		  : {type: Schema.ObjectId, ref:'User'},
	usuarioCierra	  : {type: Schema.ObjectId, ref:'User'},
	tanqueId		  :	{type: Schema.ObjectId, ref:'Tanque'},
	usuarioId		  :	{type: Schema.ObjectId, ref:'User'},
	puntoId		      :	{type: Schema.ObjectId, ref:'Punto'},
})
module.exports = mongoose.model('ReporteEmergencia', ReporteEmergencia) 