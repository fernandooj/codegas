'use strict';

/////////////////////////////////////////////////////////////////////////
/***** importo mongoose para el modelado de la base de datos  **********/
/***** importo bcrypt  para la encriptacion de la contraseña  **********/
/////////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose');
let bcrypt   = require('bcrypt-nodejs');
let moment   = require('moment');
let Schema = mongoose.Schema
/////////////////////////////////////////////////////////////////////////
/********** genero la base la coleccion llamada users   ****************/
/////////////////////////////////////////////////////////////////////////
let UserSchema = mongoose.Schema({
	created: 	 String,
	razon_social:String,
	cedula:    	 String,
	direccion_factura:String,
	email:       String,
	nombre:      String,
	password:    String,
	celular:     String,
	tipo:    	 String,
	descuento  : String,
	acceso	   : String,
	tokenPhone :  String,
	token	   :  String,
	avatar	   : String,
	codt	   : String,
	activo     : Boolean,     //// cuando se crea el usuario es innactivo, se activa al darle clikc al email
	eliminado  : {type: Boolean, default:false},   //// cuando se crea el usuario es innactivo, se activa al darle clikc al email
	idPadre    : {type: Schema.ObjectId, ref:'User'},
});

 
/////////////////////////////////////////////////////////////////////////
/********** genero el flash para encriptar la contraseña  **************/
/////////////////////////////////////////////////////////////////////////
UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
UserSchema.methods.validPassword = function(password) {
  if(this.password != null) {
		return bcrypt.compareSync(password, this.password);
	} else {
		return false; 
	}
};


module.exports =  mongoose.model('User', UserSchema) 


/////////////////////////// 		ACCESOS
// admin
// solucion
// despacho
// conductor
// cliente
// chat
// pedidos
