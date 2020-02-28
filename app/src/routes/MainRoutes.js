import React, { Component } from 'react'
import { createStackNavigator, createAppContainer, NetInfo }   from 'react-navigation'
 


//////////////////////////////////////////////////////////////////////////////////////////
//////  IMPORTO LOS COMPONENTES
//////////////////////////////////////////////////////////////////////////////////////////
import homeComponent   	   	 		from '../pages/home/home';
import perfilComponent   	 			from '../pages/perfil/perfil';
import verPerfilComponent	 			from '../pages/ver_perfil/verPerfil';
import confirmarComponent 	 		from '../pages/perfil/confirmarCode';
import registroComponent	 			from '../pages/registro/registro';
import pedidoComponent	 	 			from '../pages/pedido/pedido';
import conversacionComponent 		from '../pages/conversacion/conversacion';
import mensajeComponent	 	 			from '../pages/mensaje/mensaje';
import vehiculoComponent	 			from '../pages/vehiculo/vehiculo';
import zonaComponent	 	 				from '../pages/zona/zona';
import nuevoPedidoComponent	 		from '../pages/nuevo_pedido/nuevo_pedido';
import recuperarComponent	 		  from '../pages/recuperar_pass/recuperar_pass';
import usuariosComponent	 			from '../pages/usuarios/usuarios';
import calificacionComponent 		from '../pages/calificacion/calificacion';
import verCalificacionComponent from '../pages/calificacion/verCalificacion';
import privacidadComponent 			from '../pages/privacidad/privacidad';
import frecuenciaComponent 			from '../pages/frecuencia/frecuencia';
 
 
const AppNavigator = createStackNavigator({
	Home  		 	 : {screen: homeComponent},
	inicio 		 	 : {screen: homeComponent},
	perfil       : {screen: perfilComponent},
	verPerfil    : {screen: verPerfilComponent},
	confirmar    : {screen: confirmarComponent},
	registro     : {screen: registroComponent},
	privacidad   : {screen: privacidadComponent},
	mensaje      : {screen: mensajeComponent, navigationOptions: {
        gesturesEnabled: false,
    },},
	pedido       : 		{screen: pedidoComponent},
	vehiculo     : 		{screen: vehiculoComponent},
	zona		 		 : 		{screen: zonaComponent},
	nuevo_pedido : 		{screen: nuevoPedidoComponent},
	conversacion : 		{screen: conversacionComponent},
	recuperar 	 : 		{screen: recuperarComponent},
	usuarios 	 	 : 		{screen: usuariosComponent},
	calificacion : 		{screen: calificacionComponent},
	verCalificacion : {screen: verCalificacionComponent},
	frecuencia : {screen: frecuenciaComponent},
  },{ headerMode: 'none'});

export default createAppContainer(AppNavigator)

 