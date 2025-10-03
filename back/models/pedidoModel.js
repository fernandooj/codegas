let mongoose = require('mongoose')
let Schema   = mongoose.Schema;

const Pedido = new Schema({
	forma         :String,
	cantidadKl    :Number,
	nPedido       :Number,
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
    fechaEntregado:String,
    kilos         :String,
    factura       :String,
    valor_total   :String,
    remision      :String,
    valorUnitario : Number,
    orden         :Number,
    orden_cerrado :Number,
    motivo_no_cierre:String,
    perfil_novedad:String,
    forma_pago:String,
    imagenCerrar  : [{ type : String }],
    pedidoPadre   :{type: Schema.ObjectId, ref:'Pedido'},
    puntoId       :{type: Schema.ObjectId, ref:'Punto'},
    zonaId        :{type: Schema.ObjectId, ref:'Zona'},
    conductorId   :{type: Schema.ObjectId, ref:'User'},
	carroId       :{type: Schema.ObjectId, ref:'Carro'},
	usuarioId     :{type: Schema.ObjectId, ref:'User'},
	usuarioCrea   :{type: Schema.ObjectId, ref:'User'},
	usuarioAsigna         :{type: Schema.ObjectId, ref:'User'},
	usuarioAsignaVehiculo :{type: Schema.ObjectId, ref:'User'},
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
//orden es el numero de orden para la entrega de los pedidos por parte de los conductores por cada dia


///////////////////////////     ORDEN ENTREGADO   ///////////////////
// orden_cerrado ES EL ORDEN EN EL QUE SE VAN TERMINANDO LOS PEDIDOS

///////////////////////////     ORDEN ENTREGADO   ///////////////////
// pedidoPadre, cuando el pedido se crea a partir de frecuencia, le guardo el pedido padre

///////////////////////// motivo_no_cierre ///////////////////////////
// SI NO LO PUDO CERRAR PONE ACA EL MOTIVO


///////////////////////// PERFIL NOVEDAD ///////////////////////////
// muestra el perfil del usuario que tiene la culpa por la novedad
