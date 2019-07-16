//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
let Punto = new Schema({
	direccion   : String,
	observacion : String,
	activo      : {type: Boolean, default:true},
	creado      : String,
	updated     : String,
    idZona      : {type: Schema.ObjectId, ref:'Zona'},
    idCliente   : {type: Schema.ObjectId, ref:'User'},
    idPadre     : {type: Schema.ObjectId, ref:'User'},
})

module.exports = mongoose.model('Punto', Punto)