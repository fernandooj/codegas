//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
let reporteEmergencia = new Schema({
    creado 	          : String,
    nReporte          : Number,      
    tanque            : {type:Boolean, default:false},
    red               : {type:Boolean, default:false},  
    puntos            : {type:Boolean, default:false},  
    fuga              : {type:Boolean, default:false},  
	otrosText		  : String,
    cerradoText		  : String,
	ruta   	          : [],
	rutaCerrar        : [],

    activo 			  : {type:Boolean, default:true},
	eliminado		  : {type:Boolean, default:false},
	usuarioCrea		  : {type: Schema.ObjectId, ref:'User'},
	usuarioCierra	  : {type: Schema.ObjectId, ref:'User'},
	tanqueId		  :	{type: Schema.ObjectId, ref:'Tanque'},
})
module.exports = mongoose.model('reporteEmergencia', reporteEmergencia) 