'use strict';

let User   = require('./../models/userModel.js');
let moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
class userServices {
	get(callback){
		User.find().sort({_id: 'desc'}).exec(callback)
	}
	getEmail(user, callback){
		let email = user.email.toLowerCase()
		User.findOne({'email':email}).exec(callback)
	}
	getByAcceso(acceso, callback){
		User.find({'acceso':acceso, activo:true, eliminado:false}).exec(callback)
	}
	getByTokenPhone(tokenPhone, callback){
		User.findOne({'tokenPhone':tokenPhone, activo:true, acceso:null}).exec(callback)
	}
	getByCliente(callback){
		User.find({'acceso':"cliente", activo:true, eliminado:false}).sort({_id: 'desc'}).exec(callback)
	}
	sinVehiculo(acceso, callback){
		User.find({'acceso':acceso, activo:true}).exec(callback)
	}
	getAdminSolucion(callback){
		User.find({ $or: [ {acceso: "admin"}, {acceso: "solucion"}]}).sort({_id: 'desc'}).exec(callback)
	}
	getById(_id, callback){
		User.findOne({_id}).exec(callback)
	}
	create(user, token, idPadre, callback){ 
		let fecha2 = moment().subtract(5, 'hours');
        fecha2 = moment(fecha2).format('YYYY-MM-DD h:mm');
		let newUsuario = new User() 
		newUsuario.razon_social	=  user.razon_social,
		newUsuario.cedula		=  user.cedula,
		newUsuario.direccion_factura	=  user.direccion_factura,
		newUsuario.tipo			=  user.tipo,		
		newUsuario.cedula		=  user.cedula,
		newUsuario.celular		=  user.celular,
		newUsuario.codt		    =  user.codt,
		newUsuario.nombre		=  user.nombre,
		newUsuario.password		=  newUsuario.generateHash(token),
		newUsuario.email		=  user.email ?user.email.toLowerCase() :"",
		newUsuario.acceso		=  user.acceso,
		newUsuario.tokenPhone	=  user.tokenPhone,
		newUsuario.idPadre  	=  idPadre,
		newUsuario.token  		=  token,
		newUsuario.activo 		=  true,
		newUsuario.created  	= fecha2;
		newUsuario.save(callback);	 
	}
 
	tipo(user,callback){
		User.findByIdAndUpdate(user.id, {$set: {
		    'tipo':       user.tipo,
		    'estado': 	  user.estado,
		    'updatedAt':  moment(fecha).valueOf()
		}}, callback);
	}
	edit(user, _id, acceso, callback){
		console.log("padresito")
		console.log(_id)
		console.log(user.nombre)
		User.findByIdAndUpdate(_id,   {
			'acceso'	  : acceso=="cliente" ?"cliente" :user.acceso,
			'razon_social': user.razon_social,
			'cedula'	  : user.cedula,
			'direccion_factura': user.direccion_factura,
			'nombre':     	user.nombre,
			'codt':     	user.codt,
			'celular':  	user.celular,
			// 'password':  	newUsuario.generateHash(user.password),
			'tipo':   	    user.tipo,
			'codt':   	    user.codt,
			'updatedAt':    fecha
		}, callback);
	}
	editVarios(user, id, callback){
		console.log({user, id})
		User.findByIdAndUpdate(id, {$set: {
			'nombre':     	user.nombre,
			'email':     	user.email,
			'updatedAt':     moment(fecha).valueOf()
		}}, callback);
	}
	// editFormularioChat(formularioChat, id, callback){
	// 	console.log({formularioChat, id})
	// 	User.findByIdAndUpdate(id, {$set: {
	// 		'activo':     formularioChat,
	// 		'updatedAt':  moment(fecha).valueOf()
	// 	}}, callback);
	// }

	 
	modificaTokenPhone(idUser, tokenPhone, callback){
		console.log({idUser, tokenPhone})
		User.findByIdAndUpdate(idUser, {$set:{
			'tokenPhone':tokenPhone,
		}}, callback );	
	}
	editPassword(id, password, callback){
		let newUsuario = new User();
		User.findByIdAndUpdate(id, {$set: {
			'password': 	 newUsuario.generateHash(password),
			'updatedAt':     moment(fecha).valueOf()
		}}, callback);
	}
	login(user, callback){
		User.findOne({ activo:true, eliminado:false, 'email' :  user.email.toLowerCase() }).populate('categoria').populate('idPadre').exec(callback)
	}
	verificaToken(data, callback){
		console.log(data)
		User.findOne({'email':data.email, 'token': data.token}, callback)
	}

	estadoUsuario(idUser, activo, callback){
		User.findByIdAndUpdate(idUser, {$set: {
			'activo':activo
		}}, callback);
	}
	eliminarUsuario(idUser, callback){
		User.findByIdAndUpdate(idUser, {$set: {
			'eliminado':true
		}}, callback);
	}
	modificaToken(user, token, callback){
		User.findByIdAndUpdate(user._id, {$set: {
			'token':token
		}}, callback);
	}
	avatar(id, avatar, callback){
		User.findByIdAndUpdate(id, {$set: {
            avatar     : avatar,
            'updatedAt': moment(fecha).valueOf()
        }}, callback)
	}

}

module.exports = new userServices()