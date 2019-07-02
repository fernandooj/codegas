import React, { Component } from 'react'
import { createStackNavigator, createAppContainer }   from 'react-navigation'
 


//////////////////////////////////////////////////////////////////////////////////////////
//////  IMPORTO LOS COMPONENTES
//////////////////////////////////////////////////////////////////////////////////////////
import homeComponent   	   	 from '../pages/home/home';
import perfilComponent   	 from '../pages/perfil/perfil';
import verPerfilComponent	 from '../pages/ver_perfil/verPerfil';
import confirmarComponent 	 from '../pages/perfil/confirmarCode';
import registroComponent	 from '../pages/registro/registro';
import pedidoComponent	 	 from '../pages/pedido/pedido';
import conversacionComponent from '../pages/conversacion/conversacion';
import mensajeComponent	 	 from '../pages/mensaje/mensaje';
import vehiculoComponent	 from '../pages/vehiculo/vehiculo';
import zonaComponent	 	 from '../pages/zona/zona';
import nuevoPedidoComponent	 from '../pages/nuevo_pedido/nuevo_pedido';
import recuperarComponent	 from '../pages/recuperar_pass/recuperar_pass';
import usuariosComponent	 from '../pages/usuarios/usuarios';
import calificacionComponent from '../pages/calificacion/calificacion';
import verCalificacionComponent from '../pages/calificacion/verCalificacion';
 
 
 
 
// class MainRoutes extends Component{
// 	constructor(props){
// 		super(props)
// 		this.state={
// 			user:{},

// 		}
//  	}
 
// 	render(){
// 		const NavigationApp = createStackNavigator({
// 			Home  		 : {screen: homeComponent},
// 			inicio  	 : {screen: homeComponent},
// 			perfil       : {screen: perfilComponent},
// 			verPerfil    : {screen: verPerfilComponent},
// 			confirmar    : {screen: confirmarComponent},
// 			registro     : {screen: registroComponent},
// 			mensaje      : {screen: mensajeComponent},
// 			pedido       : {screen: pedidoComponent},
// 			nuevo_pedido : {screen: nuevoPedidoComponent},
// 			conversacion : {screen: conversacionComponent},
// 		},{ headerMode: 'none'})
	     
// 		return (
// 			<NavigationApp />
// 		)
// 	}
// }
const AppNavigator = createStackNavigator({
	Home  		 : {screen: homeComponent},
	inicio 		 : {screen: homeComponent},
	perfil       : {screen: perfilComponent},
	verPerfil    : {screen: verPerfilComponent},
	confirmar    : {screen: confirmarComponent},
	registro     : {screen: registroComponent},
	mensaje      : {screen: mensajeComponent},
	pedido       : {screen: pedidoComponent},
	vehiculo     : {screen: vehiculoComponent},
	zona		 : {screen: zonaComponent},
	nuevo_pedido : {screen: nuevoPedidoComponent},
	conversacion : {screen: conversacionComponent},
	recuperar 	 : {screen: recuperarComponent},
	usuarios 	 : {screen: usuariosComponent},
	calificacion : {screen: calificacionComponent},
	verCalificacion : {screen: verCalificacionComponent},
  },{ headerMode: 'none'});

export default createAppContainer(AppNavigator)

 