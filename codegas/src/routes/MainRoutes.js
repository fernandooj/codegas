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
import PerfilComponent	 	from '../pages/perfil';
import verPerfilComponent	 	from '../pages/ver_perfil/verPerfil';
import usuariosComponent	 	from '../pages/usuarios';
import vehiculoComponent	 	from '../pages/vehiculo/vehiculo';
import zonaComponent	 	 	from '../pages/zona/zona';
import capacidadComponent 		from '../pages/capacidad/capacidad';
import editarPerfilComponent	 	from '../pages/editar_perfil/editarPerfil';
// import editarPedidoComponent	from '../pages/pedido/editar-pedido';
// import confirmarComponent 	 	from '../pages/perfil/confirmarCode';
// import registroComponent	 	from '../pages/registro/registro';
// import conversacionComponent 	from '../pages/conversacion/conversacion';
// import mensajeComponent	 	 	from '../pages/mensaje/mensaje';
import recuperarComponent	 	from '../pages/recuperar_pass/recuperar_pass';
// import cambiarComponent	 		from '../pages/recuperar_pass/cambiar_pass';
import puntosComponent	 		from '../pages/puntos/puntos';
// import calificacionComponent 	from '../pages/calificacion/calificacion';
// import verCalificacionComponent from '../pages/calificacion/verCalificacion';
// import privacidadComponent 		from '../pages/privacidad/privacidad';
import frecuenciaComponent 		from '../pages/frecuencia/frecuencia';
// import tanquesComponent 		from '../pages/tanques/tanques';
// import nuevoTanqueComponent 	from '../pages/tanques/nuevoTanques';
import revisionComponent 		from '../pages/revision/revision';
import nuevaRevisionComponent 	from '../pages/revision/nuevaRevision';
import chartComponent 			from '../pages/chart/chart';
// import cerrarRevisionComponent 	from '../pages/revision/cerrarRevision';
// import cerrarSeguridadComponent from '../pages/revision/cerrarSeguridad';
// import cerrarTanqueComponent 	from '../pages/tanques/cerrarTanque';
import reporteEmergenciaComponent from '../pages/reporteEmergencia/reporteEmergencia';
import nuevoReporteEmergenciaComponent from '../pages/reporteEmergencia/nuevoReporteEmergencia';
import pdfComponent 				from '../pages/pdf/pdf';
 
 
const AppNavigator = createStackNavigator({
	Home  		 	 	: {screen: homeComponent},
	pedido       		: {screen: pedidoComponent},
	IniciarSesion       : {screen: IniciarSesion},
	nuevo_pedido 		: {screen: nuevoPedidoComponent},
	Perfil    		: {screen: PerfilComponent},
	usuarios 	 	 	: {screen: usuariosComponent},
	vehiculo     		: {screen: vehiculoComponent},
	zona		 		: {screen: zonaComponent},
	capacidad			: {screen: capacidadComponent},
	editarPerfil	 	: {screen: editarPerfilComponent},
	verPerfil    		: {screen: verPerfilComponent},
	// registro     		: {screen: registroComponent},
	// privacidad   		: {screen: privacidadComponent},
	recuperar 	 		: {screen: recuperarComponent},
	puntos 	 	 		: {screen: puntosComponent},
	// calificacion 		: {screen: calificacionComponent},
	// verCalificacion 	: {screen: verCalificacionComponent},
	frecuencia 			: {screen: frecuenciaComponent},
	// tanques 			: {screen: tanquesComponent},
	// nuevoTanque 		: {screen: nuevoTanqueComponent},
	revision 			: {screen: revisionComponent},
	nuevaRevision 		: {screen: nuevaRevisionComponent},
	chart 				: {screen: chartComponent},
	// cambiar 			: {screen: cambiarComponent},
	// cerrarRevision 		: {screen: cerrarRevisionComponent},
	// cerrarSeguridad 	: {screen: cerrarSeguridadComponent},
	// cerrarTanque 		: {screen: cerrarTanqueComponent},
	reporteEmergencia	: {screen: reporteEmergenciaComponent},
	nuevoReporteEmergencia : {screen: nuevoReporteEmergenciaComponent},
	pdf					: {screen: pdfComponent},
  },{ headerMode: 'none'});

export default createAppContainer(AppNavigator)

 
