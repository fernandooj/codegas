import React, { Component } from 'react'
import { createAppContainer}   from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack"

//////////////////////////////////////////////////////////////////////////////////////////
//////  IMPORTO LOS COMPONENTES
//////////////////////////////////////////////////////////////////////////////////////////
import homeComponent   	   	 	from '../pages/home';
import pedidoComponent	 	 	from '../pages/pedido';
import IniciarSesion   	 	from '../pages/iniciar_sesion';
import nuevoPedidoComponent	 	from '../pages/nuevo_pedido';
import verPerfilComponent	 	from '../pages/perfil';
import usuariosComponent	 	from '../pages/usuarios';
// import editarPedidoComponent	from '../pages/pedido/editar-pedido';
// import confirmarComponent 	 	from '../pages/perfil/confirmarCode';
// import registroComponent	 	from '../pages/registro/registro';
// import conversacionComponent 	from '../pages/conversacion/conversacion';
// import mensajeComponent	 	 	from '../pages/mensaje/mensaje';
// import vehiculoComponent	 	from '../pages/vehiculo/vehiculo';
// import zonaComponent	 	 	from '../pages/zona/zona';
// import recuperarComponent	 	from '../pages/recuperar_pass/recuperar_pass';
// import cambiarComponent	 		from '../pages/recuperar_pass/cambiar_pass';
// import puntosComponent	 		from '../pages/puntos/puntos';
// import calificacionComponent 	from '../pages/calificacion/calificacion';
// import verCalificacionComponent from '../pages/calificacion/verCalificacion';
// import privacidadComponent 		from '../pages/privacidad/privacidad';
// import frecuenciaComponent 		from '../pages/frecuencia/frecuencia';
// import tanquesComponent 		from '../pages/tanques/tanques';
// import nuevoTanqueComponent 	from '../pages/tanques/nuevoTanques';
// import revisionComponent 		from '../pages/revision/revision';
// import nuevaRevisionComponent 	from '../pages/revision/nuevaRevision';
// import chartComponent 			from '../pages/chart/chart';
// import cerrarRevisionComponent 	from '../pages/revision/cerrarRevision';
// import cerrarSeguridadComponent from '../pages/revision/cerrarSeguridad';
// import cerrarTanqueComponent 	from '../pages/tanques/cerrarTanque';
// import capacidadComponent 		from '../pages/capacidad/capacidad';
// import reporteEmergenciaComponent from '../pages/reporteEmergencia/reporteEmergencia';
// import nuevoReporteEmergenciaComponent from '../pages/reporteEmergencia/nuevoReporteEmergencia';
// import pdfComponent 				from '../pages/pdf/pdf';
 
 
const AppNavigator = createStackNavigator({
	Home  		 	 	: {screen: usuariosComponent},
	pedido       		: {screen: pedidoComponent},
	IniciarSesion       : {screen: IniciarSesion},
	nuevo_pedido 		: {screen: nuevoPedidoComponent},
	Perfil    		: {screen: verPerfilComponent},
	usuarios 	 	 	: {screen: usuariosComponent},
	// inicio 		 	 	: {screen: homeComponent},
	// confirmar    		: {screen: confirmarComponent},
	// registro     		: {screen: registroComponent},
	// privacidad   		: {screen: privacidadComponent},
	// mensaje      		: {screen: mensajeComponent, navigationOptions: { gesturesEnabled: false }},
	// editarPedido 		: {screen: editarPedidoComponent},
	// vehiculo     		: {screen: vehiculoComponent},
	// zona		 		: {screen: zonaComponent},
	// conversacion 		: {screen: conversacionComponent},
	// recuperar 	 		: {screen: recuperarComponent},
	// puntos 	 	 		: {screen: puntosComponent},
	// calificacion 		: {screen: calificacionComponent},
	// verCalificacion 	: {screen: verCalificacionComponent},
	// frecuencia 			: {screen: frecuenciaComponent},
	// tanques 			: {screen: tanquesComponent},
	// nuevoTanque 		: {screen: nuevoTanqueComponent},
	// revision 			: {screen: revisionComponent},
	// nuevaRevision 		: {screen: nuevaRevisionComponent},
	// chart 				: {screen: chartComponent},
	// cambiar 			: {screen: cambiarComponent},
	// cerrarRevision 		: {screen: cerrarRevisionComponent},
	// cerrarSeguridad 	: {screen: cerrarSeguridadComponent},
	// cerrarTanque 		: {screen: cerrarTanqueComponent},
	// reporteEmergencia	: {screen: reporteEmergenciaComponent},
	// capacidad			: {screen: capacidadComponent},
	// pdf					: {screen: pdfComponent},
	// nuevoReporteEmergencia : {screen: nuevoReporteEmergenciaComponent},
  },{ headerMode: 'none'});

export default createAppContainer(AppNavigator)

 
