import React, { Component } from 'react'
import { Dimensions} 	  from 'react-native'
import { StackNavigator }		  from 'react-navigation'
 


//////////////////////////////////////////////////////////////////////////////////////////
//////  IMPORTO LOS COMPONENTES
//////////////////////////////////////////////////////////////////////////////////////////
import homeComponent   	   	 from '../pages/home/home';
import perfilComponent   	 from '../pages/perfil/perfil';
import verPerfilComponent	 from '../pages/ver_perfil/verPerfil';
import confirmarComponent 	 from '../pages/perfil/confirmarCode';
import registroComponent	 from '../pages/registro/registro';
import mensajeComponent	 	 from '../pages/mensaje/mensaje';
import pedidoComponent	 	 from '../pages/pedido/pedido';
import nuevoPedidoComponent	 from '../pages/nuevo_pedido/nuevo_pedido';
 
 
 
 
class MainRoutes extends Component{
	constructor(props){
		super(props)
		this.state={
			user:{},

		}
 	}
 
	render(){
		const NavigationApp = StackNavigator({
			Home  		 : {screen: homeComponent},
			perfil       : {screen: perfilComponent},
			verPerfil    : {screen: verPerfilComponent},
			confirmar    : {screen: confirmarComponent},
			registro     : {screen: registroComponent},
			mensaje      : {screen: mensajeComponent},
			pedido       : {screen: pedidoComponent},
			nuevo_pedido : {screen: nuevoPedidoComponent},
		},{ headerMode: 'none'})
	     
		return (
			<NavigationApp />
		)
	}
} 
export default MainRoutes

 