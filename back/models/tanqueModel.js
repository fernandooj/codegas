//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
const geoSchema = mongoose.Schema({
	type:{
		type:String,
		default:"Point"
	},
	coordinates:{
		type:[Number],
		index:'2dsphere'
	}
})


let Tanque = new Schema({
	creado             : String,
	capacidad          : String,
	placaText          : String,
	fabricante		   : String,
	registroOnac  	   : String,
	fechaUltimaRev     : String,
	nPlaca         	   : String,
	codigoActivo       : String,
	serie              : String,
	anoFabricacion	   : String,
	existeTanque	   : String,
	activo			   : {type:Boolean, default:true},
	eliminado		   : {type:Boolean, default:false},
	usuarioId		   : {type: Schema.ObjectId, ref:'User'},
	zonaId			   : {type: Schema.ObjectId, ref:'Zona'},
	puntoId			   : {type: Schema.ObjectId, ref:'Punto'},
	
	///////////		IMAGENES
	placa              : [],
	placaMantenimiento : [],
	placaFabricante    : [],
	dossier			   : [],
	cerFabricante	   : [],
	cerOnac	   		   : [],
	visual	   		   : []    
})

module.exports = mongoose.model('Tanque', Tanque) 