let mongoose = require('mongoose')
let Schema   = mongoose.Schema;

const Pedido = new Schema({
	forma         :String,
	cantidadKl    :Number,
	cantidadPrecio:Number,
	frecuencia    :String,
	imagen        :String,
	dia1          :String,
    dia2          :String,
    creado        :String,
    estado        :String,
    entregado     :Boolean,
    eliminado     :Boolean,
    novedades     :Boolean,
    fechaEntrega  :String,
    fechaSolicitud:String,
    kilos         :Number,
    factura       :String,
    valor_unitario:String,
    orden         :Number,
    orden_cerrado :Number,
    puntoId       :{type: Schema.ObjectId, ref:'Punto'},
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

///////////////////////////     ORDEN   ///////////////////
//orden es el numero de orden para la entrega


///////////////////////////     ORDEN ENTREGADO   ///////////////////
// orden_cerrado ES EL ORDEN EN EL QUE SE VAN TERMINANDO LOS PEDIDOS