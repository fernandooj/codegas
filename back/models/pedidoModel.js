let mongoose = require('mongoose')
let Schema   = mongoose.Schema;

const Pedido = new Schema({
	forma         :String,
	cantidadKl    :String,
	cantidadPrecio:String,
	frecuencia    :String,
	imagen        :String,
	dia1          :String,
    dia2          :String,
    creado        :Number,
    estado        :String,
    entregado     :Boolean,
    eliminado     :Boolean,
    novedades     :Boolean,
    fechaEntrega  :Number,
    kilos         :Number,
    factura       :String,
    valor_unitario:Number,
    conductorId   :{type: Schema.ObjectId, ref:'User'},
	carroId       :{type: Schema.ObjectId, ref:'Carro'},
	usuarioId     :{type: Schema.ObjectId, ref:'User'},
	usuarioCrea   :{type: Schema.ObjectId, ref:'User'},
})


//////////////////////////////////////////////////////////////////////////////
////////***********    exporto el esquema        ****/////////////////////////
//////////////////////////////////////////////////////////////////////////////


module.exports = mongoose.model('Pedido', Pedido)


/////////////////////////// 	ESTADOS   //////////////////
// activo
// espera
// innactivo
// noentregado

/////////////////////////// 	FORMA   //////////////////
// monto
// cantidad
// lleno
