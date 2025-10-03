//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
let alertaTanque = new Schema({
	creado 	          : String,
	alertaImagen   	  : [],
	alertaText		  : String,
	cerradoText		  : String,
    activo 			  : {type:Boolean, default:true},
	eliminado		  : {type:Boolean, default:false},
	usuarioCrea		  : {type: Schema.ObjectId, ref:'User'},
	usuarioCierra	  : {type: Schema.ObjectId, ref:'User'},
	tanqueId		  :	{type: Schema.ObjectId, ref:'Tanque'},
})
module.exports = mongoose.model('alertaTanque', alertaTanque) 