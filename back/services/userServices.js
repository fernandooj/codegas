'use strict';

let User   = require('./../models/userModel.js');
let moment = require('moment-timezone');
let fecha = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
class userServices {
	get(callback){
		User.find({}).sort({_id: 'desc'}).exec(callback)
	}
	getEmail(user, callback){
		let email = user.email.toLowerCase()
		User.findOne({'email':email}).populate('categoria').exec(callback)
	}
	getByAcceso(acceso, callback){
		User.find({'acceso':acceso, activo:true}).populate('categoria').exec(callback)
	}
	sinVehiculo(acceso, callback){
		User.find({'acceso':acceso, activo:true}).populate('categoria').exec(callback)
	}
	getAdminSolucion(callback){
		User.find({ $or: [ {acceso: "admin"}, {acceso: "solucion"}]}).exec(callback)
	}
	getById(_id, callback){
		User.findOne({_id}).populate('categoria').exec(callback)
	}
	create(user, token, callback){ 
		let fecha2 = moment().tz("America/Bogota").format('YYYY-MM-DD h:mm:ss')
		var newUsuario = new User() 
		newUsuario.razon_social	=  user.razon_social,
		newUsuario.cedula		=  user.cedula,
		newUsuario.direccion	=  user.direccion,
		newUsuario.tipo			=  user.tipo,		
		newUsuario.cedula		=  user.cedula,
		newUsuario.celular		=  user.celular,
		newUsuario.codt		    =  user.codt,
		newUsuario.nombre		=  user.nombre,
		newUsuario.password		=  user.acceso!=="cliente" &&newUsuario.generateHash(token),
		newUsuario.email		=  user.email ?user.email.toLowerCase() :"",
		newUsuario.acceso		=  user.acceso,
		newUsuario.tokenPhone	=  user.tokenPhone,
		newUsuario.token  		=  token,
		// newUsuario.activo 		=  user.acceso=="cliente" ?false :true,
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
	edit(user, id, callback){
		let newUsuario = new User() 
		User.findByIdAndUpdate(id, {$set: {
			'razon_social': user.razon_social,
			'cedula':       user.cedula,
			'direccion':   	user.direccion,
			'nombre':     	user.nombre,
			'codt':     	user.codt,
			'celular':  	user.celular,
			'password':  	newUsuario.generateHash(user.password),
			'tipo':   	    user.tipo,
			'updatedAt':     moment(fecha).valueOf()
		}}, callback);
	}

	////// cada vez ue el usuario hace login edito la informacion que me devuelve facebook o google
	modificaUsuarioRedes(_id, data, callback){
		User.findByIdAndUpdate(_id, {$set:{
			'tokenPhone':data.tokenPhone,
			'nombre':data.nombre,
			'avatar':data.avatar,
			'token':data.token,
		}}, callback );	
	}
	modificaTokenPhone(idUser, tokenPhone, callback){
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
		User.findOne({ 'email' :  user.email.toLowerCase() }).populate('categoria').exec(callback)
	}
	verificaToken(data, callback){
		console.log(data)
		User.findOne({'email':data.email, 'token': data.token}, callback)
	}

	estadoUsuario(user, activo, callback){
		User.findByIdAndUpdate(user._id, {$set: {
			'activo':activo
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