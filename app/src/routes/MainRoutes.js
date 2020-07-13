import React, { Component } from 'react'
import { createStackNavigator, createAppContainer}   from 'react-navigation'
 


//////////////////////////////////////////////////////////////////////////////////////////
//////  IMPORTO LOS COMPONENTES
//////////////////////////////////////////////////////////////////////////////////////////
import homeComponent   	   	 	from '../pages/home/home';
import perfilComponent   	 	from '../pages/perfil/perfil';
import verPerfilComponent	 	from '../pages/ver_perfil/verPerfil';
import confirmarComponent 	 	from '../pages/perfil/confirmarCode';
import registroComponent	 	from '../pages/registro/registro';
import pedidoComponent	 	 	from '../pages/pedido/pedido';
import conversacionComponent 	from '../pages/conversacion/conversacion';
import mensajeComponent	 	 	from '../pages/mensaje/mensaje';
import vehiculoComponent	 	from '../pages/vehiculo/vehiculo';
import zonaComponent	 	 	from '../pages/zona/zona';
import nuevoPedidoComponent	 	from '../pages/nuevo_pedido/nuevo_pedido';
import recuperarComponent	 	from '../pages/recuperar_pass/recuperar_pass';
import cambiarComponent	 		from '../pages/recuperar_pass/cambiar_pass';
import usuariosComponent	 	from '../pages/usuarios/usuarios';
import puntosComponent	 		from '../pages/puntos/puntos';
import calificacionComponent 	from '../pages/calificacion/calificacion';
import verCalificacionComponent from '../pages/calificacion/verCalificacion';
import privacidadComponent 		from '../pages/privacidad/privacidad';
import frecuenciaComponent 		from '../pages/frecuencia/frecuencia';
import tanquesComponent 		from '../pages/tanques/tanques';
import nuevoTanqueComponent 	from '../pages/tanques/nuevoTanques';
import revisionComponent 		from '../pages/revision/revision';
import nuevaRevisionComponent 	from '../pages/revision/nuevaRevision';
import chartComponent 			from '../pages/chart/chart';
import cerrarRevisionComponent 	from '../pages/revision/cerrarRevision';
import cerrarSeguridadComponent from '../pages/revision/cerrarSeguridad';
import cerrarTanqueComponent 	from '../pages/tanques/cerrarTanque';
import capacidadComponent 		from '../pages/capacidad/capacidad';
import reporteEmergenciaComponent from '../pages/reporteEmergencia/reporteEmergencia';
import nuevoReporteEmergenciaComponent from '../pages/reporteEmergencia/nuevoReporteEmergencia';
import pdfComponent 				from '../pages/pdf/pdf';
 
 
const AppNavigator = createStackNavigator({
	Home  		 	 	: {screen: homeComponent},
	inicio 		 	 	: {screen: homeComponent},
	perfil       		: {screen: perfilComponent},
	verPerfil    		: {screen: verPerfilComponent},
	confirmar    		: {screen: confirmarComponent},
	registro     		: {screen: registroComponent},
	privacidad   		: {screen: privacidadComponent},
	mensaje      		: {screen: mensajeComponent, navigationOptions: { gesturesEnabled: false }},
	pedido       		: {screen: pedidoComponent},
	vehiculo     		: {screen: vehiculoComponent},
	zona		 		: {screen: zonaComponent},
	nuevo_pedido 		: {screen: nuevoPedidoComponent},
	conversacion 		: {screen: conversacionComponent},
	recuperar 	 		: {screen: recuperarComponent},
	usuarios 	 	 	: {screen: usuariosComponent},
	puntos 	 	 		: {screen: puntosComponent},
	calificacion 		: {screen: calificacionComponent},
	verCalificacion 	: {screen: verCalificacionComponent},
	frecuencia 			: {screen: frecuenciaComponent},
	tanques 			: {screen: tanquesComponent},
	nuevoTanque 		: {screen: nuevoTanqueComponent},
	revision 			: {screen: revisionComponent},
	nuevaRevision 		: {screen: nuevaRevisionComponent},
	chart 				: {screen: chartComponent},
	cambiar 			: {screen: cambiarComponent},
	cerrarRevision 		: {screen: cerrarRevisionComponent},
	cerrarSeguridad 	: {screen: cerrarSeguridadComponent},
	cerrarTanque 		: {screen: cerrarTanqueComponent},
	reporteEmergencia	: {screen: reporteEmergenciaComponent},
	capacidad			: {screen: capacidadComponent},
	pdf					: {screen: pdfComponent},
	nuevoReporteEmergencia : {screen: nuevoReporteEmergenciaComponent},
  },{ headerMode: 'none'});

export default createAppContainer(AppNavigator)

 