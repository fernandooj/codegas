//////////////////////////////////////////////////////////////////////
////////***********     llamo a las librerias        ****////////////
//////////////////////////////////////////////////////////////////////
let mongoose = require('mongoose')
let Schema   = mongoose.Schema;
 
//////////////////////////////////////////////////////////////////////////////
////////***********     creo el esquema / ciudad        ****//////////////
//////////////////////////////////////////////////////////////////////////////
let Tanque = new Schema({
	creado          : String,
	nControl        : Number,
	zonaAdicional   : String,
	sector: 	        String,
	propiedad: 	    String,
	barrio: 	    String,
	usuariosAtendidos   : String,
	ubicacion          : 	    String,
	fechaUltimaRev     : 	    String,
	m3                 : 	    String,
	placa              : 	    String,
	codigo             : 	    String,
	serie              : 	    String,
	placaMantenimiento : 	    String,
	ultimaRevisionPar: 	    String,
	fabricante: 	    String,
	nPlacaFabricante: 	    String,
	anoFabricacion: 	    String,
	lote: 	    String,
    nNMedidor: 	    String,
	nComodato: 	    String,
	fotos: 	    String,
	observaciones: 	    String,
	compromisos: 	    String,
	coordenadas: 	    String,
    
    
    
    activo:     {type:Boolean, default:true},
	eliminado:  {type:Boolean, default:false},
	puntoId:    {type: Schema.ObjectId, ref:'Punto'},
	zonaId:    {type: Schema.ObjectId, ref:'Zona'},
	usuarioId:  {type: Schema.ObjectId, ref:'User'},
	usuarioCrea:{type: Schema.ObjectId, ref:'User'},
})

module.exports = mongoose.model('Tanque', Tanque) 