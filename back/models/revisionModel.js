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


let Revision = new Schema({
	creado            : String,
	nControl          : Number,
	usuarioId		  :	{type: Schema.ObjectId, ref:'User'},
	zonaId			  : {type: Schema.ObjectId, ref:'Zona'},
	puntoId           : {type: Schema.ObjectId, ref:'Punto'},
	estado	   		  : {type:Number, default:1},
	
	sector            : String,
	barrio            : String,
	propiedad         : String,
	lote			  : String,
	usuariosAtendidos : String,
	m3                : String,
	nMedidorText      : String,     
	ubicacion      	  : String,     
	nComodatoText     : String,     
	isometrico        : [],
    otrosComodat	  : [],
	soporteEntrega	  : [],
	puntoConsumo	  : [],
	visual	  		  : [],

	protocoloLlenado  : [],
	hojaSeguridad  	  : [],
	nComodato		  : [],
	otrosSi	   		  : [],
	   
	////////////////////////////////	INSTALACION
	observaciones	  : String,
	solicitudServicio : String,	
	usuarioSolicita	  : {type: Schema.ObjectId, ref:'User'},
	avisos			  : Boolean,
	extintores		  : Boolean,
	distancias 		  : Boolean,
	electricas		  : Boolean, 
	accesorios		  : Boolean, 
	////////////////////////////////	CERRAR ALERTA	
	alerta        	  : [],
	alertaText		  : String,
	alertaFecha 	  : String,
	nActa 	  		  : String,
	coordenadas		  : geoSchema,
    activo 			  : {type:Boolean, default:true},
	eliminado		  : {type:Boolean, default:false},
	usuarioCrea		  : {type: Schema.ObjectId, ref:'User'},
	tanqueId		  :	[{type: Schema.ObjectId, ref:'Tanque'}],
	documento	  : [], 

	////////////////////////////////	CERRAR DEP TECNICO	
	depTecnico		  :[],
	depTecnicoText    :String,
	depTecnicoEstado  : {type:Boolean, default:false},
})

module.exports = mongoose.model('Revision', Revision) 

// estado 1--> no hay alerta
// estado 2-->hay una alerta abierta
// estado 3 --> la alerta se cerro

// depTecnicoEstado --> si es true es por que ya se cerraron
 