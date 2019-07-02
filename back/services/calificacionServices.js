///////////////////////////////////////////////////////////////////////
///////////***********     llamo al esquema        ****///////////////
//////////////////////////////////////////////////////////////////////
let calificacion = require('./../models/calificacionModel.js');
let Conversacion = require('./../models/conversacionModel.js');
let moment 		 = require('moment-timezone');

//////////////////////////////////////////////////////////////////////////////
////////******     creo la clase que hace los servicios        ****//////////
/////////////////////////////////////////////////////////////////////////////

class calificacionServices{
	constructor(){

	}
	getAll(callback){
		Conversacion.aggregate([
			{
				$lookup:{
					from:"users",
					localField:"usuarioId1",
					foreignField:"_id",
					as:"UserData"
				}
			},
			{
				$unwind:{
					path:'$UserData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"users",
					localField:"usuarioId2",
					foreignField:"_id",
					as:"UserData1"
				}
			},
			{
				$unwind:{
					path:'$UserData1',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$lookup:{
					from:"calificacions",
					localField:"_id",
					foreignField:"idConversacion",
					as:"CalificacionData"
				}
			},
			{
				$unwind:{
					path:'$CalificacionData',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$project:{
					nombreEmpleado:'$UserData.nombre',
					nombreCliente:'$UserData1.nombre',
					calificacionId:'$CalificacionData._id',
					calificacion:'$CalificacionData.calificacion',
					sugerencia:"$CalificacionData.sugerencia",
					fecha:"$CalificacionData.creado",
				},
			},
			{
			    $group:{
						_id: "$calificacionId",
			      		data: { $addToSet:  {nombreEmpleado:"$nombreEmpleado", nombreCliente:"$nombreCliente", calificacion:"$calificacion", sugerencia:"$sugerencia", fecha:"$fecha"}
                    },
			    }
			},
		], callback)
	}
 
	create(data, callback){
		let fecha = moment.tz(moment(), 'America/Bogota|COT|50|0|').format('YYYY/MM/DD h:mm:ss a')
		let creado = moment(fecha).valueOf()
		let newCalificacion = new calificacion({
			sugerencia	   :data.sugerencia,
			calificacion	 :data.calificacion,
			idConversacion :data.idConversacion,
			creado
		})
		newCalificacion.save(callback)	
	}
}

module.exports = new calificacionServices();