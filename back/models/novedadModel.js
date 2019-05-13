'use strict';

/////////////////////////////////////////////////////////////////////////
/***** importo mongoose para el modelado de la base de datos  **********/
/***** importo bcrypt  para la encriptacion de la contraseña  **********/
/////////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose');
let Schema   = mongoose.Schema;
/////////////////////////////////////////////////////////////////////////
/********** genero la base la coleccion llamada users   ****************/
/////////////////////////////////////////////////////////////////////////
let NovedadSchema = mongoose.Schema({
	created: Number,
    novedad :String,
    pedidoId : {type: Schema.ObjectId, ref:'Pedido'},
    usuarioId: {type: Schema.ObjectId, ref:'User'},
});

 

module.exports =  mongoose.model('Novedad', NovedadSchema) 


/////////////////////////// 		ACCESOS
// admin
// solucion
// despacho
// conductor
// cliente

