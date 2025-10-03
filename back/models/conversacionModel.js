//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
let Conversacion = new Schema({
	creado: 	String,
	update: 	String,
	duracion :  String, 
	celular: 	String,
	nombre: 	String,
	email: 		String,
	tokenPhone: String,
	badge	  : {type:Number, default:0},
	activo:     {type:Boolean, default:true},
	usuarioId1: {type: Schema.ObjectId, ref:'User'},
	usuarioId2: {type: Schema.ObjectId, ref:'User'},
})

module.exports = mongoose.model('Conversacion', Conversacion)