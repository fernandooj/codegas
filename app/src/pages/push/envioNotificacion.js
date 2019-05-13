import {Platform, AsyncStorage} from 'react-native'
import firebaseClient from  "./FirebaseClient";
import axios from 'axios'
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////	ENVIO LA NOTIFICACION						
//////////////	tipo 1 ==> tienes un nuevo mensaje
//////////////	tipo 2 ==> quieren comprar/intercambiar tu libro
//////////////	tipo 3 ==> aceptaron comprar/intercambiar tu libro
//////////////	tipo 4 ==> activaron tu titulo
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sendRemoteNotification = (tipo, token, targetScreen, titulo, mensaje, imagen, parameter)=> {
	
	axios.get('user/profile') 
	.then((res)=>{
		console.log(res.data)
	    let body;
	    let nombre = tipo==4 ?'' :res.data.user.nombre
	    let avatar  = res.data.user.avatar
	    imagen = imagen==null ? avatar :imagen
	   	
	    if(Platform.OS === 'android'){
	    	console.log("android")
	    	bodyIos = {
		        to: token,
		        notification: {
		         	title: titulo,
					body : `${nombre} ${mensaje}`,
					priority:"high",
					icon:"ic_notif",
					targetScreen:targetScreen,
					color:"#00ACD4",
					big_picture:imagen,
					picture:imagen,
					image:imagen,
					large_icon: imagen,
					sound: "default",
					parameter,
					// group: "GROUP",
					// badge:33,
					show_in_foreground: true
		        },
		        data: {
					targetScreen:targetScreen,
					parameter,
					// group: "GROUP",
					// badge:54,
		        },
		        priority: 10
		    };
		    firebaseClient.send(JSON.stringify(bodyIos), "notification");
	    }else{
			console.log("ios")
			console.log(token)
			bodyIos = {
		        to: token,
		        notification: {
		         	title: titulo,
					body : `${nombre} ${mensaje}`,
					priority:"high",
					icon:"ic_notif",
					targetScreen:targetScreen,
					color:"#00ACD4",
					big_picture:imagen,
					picture:imagen,
					image:imagen,
					large_icon: imagen,
					sound: "default",
					parameter,
					group: "GROUP",
					show_in_foreground: true
		        },
		        data: {
					targetScreen:targetScreen,
					parameter,
					group: "GROUP",
		        },
		        priority: 10
		    };
		    firebaseClient.send(JSON.stringify(bodyIos), "notification");
	    }
    })
}