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
	puntoId           :{type: Schema.ObjectId, ref:'Punto'},
	//codigoInterno	   : String,
	sector            : String,
	barrio            : String,
	// zonaAdicional      : String,
	propiedad         : String,
	lote			  : String,
	usuariosAtendidos : String,
	m3                : String,
	nMedidorText      : String,     
    nMedidor		  : [],
	nComodato		  : [],
	otrosSi	   		  : [],
	retiroTanques	  : [],
	coordenadas		  : geoSchema,
	
    activo:     {type:Boolean, default:true},
	eliminado:  {type:Boolean, default:false},
	usuarioCrea:{type: Schema.ObjectId, ref:'User'},
	tanqueId:	[{type: Schema.ObjectId, ref:'Tanque'}],
})

module.exports = mongoose.model('Revision', Revision) 