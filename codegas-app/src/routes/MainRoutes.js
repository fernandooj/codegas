import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//////////////////////////////////////////////////////////////////////////////////////////
//////  IMPORTO LOS COMPONENTES
//////////////////////////////////////////////////////////////////////////////////////////
import homeComponent from '../pages/home';
import pedidoComponent from '../pages/pedido';
import IniciarSesion from '../pages/iniciar_sesion';
import nuevoPedidoComponent from '../pages/nuevo_pedido';
import PerfilComponent from '../pages/perfil';
import verPerfilComponent from '../pages/ver_perfil/verPerfil';
import usuariosComponent from '../pages/usuarios';
import vehiculoComponent from '../pages/vehiculo/vehiculo';
import zonaComponent from '../pages/zona/zona';
import capacidadComponent from '../pages/capacidad/capacidad';
import editarPerfilComponent from '../pages/editar_perfil/editarPerfil';
// import editarPedidoComponent	from '../pages/pedido/editar-pedido';
// import confirmarComponent 	 	from '../pages/perfil/confirmarCode';
// import registroComponent	 	from '../pages/registro/registro';
// import conversacionComponent 	from '../pages/conversacion/conversacion';
// import mensajeComponent	 	 	from '../pages/mensaje/mensaje';
import recuperarComponent from '../pages/recuperar_pass/recuperar_pass';
// import cambiarComponent	 		from '../pages/recuperar_pass/cambiar_pass';
import puntosComponent from '../pages/puntos/puntos';
// import calificacionComponent 	from '../pages/calificacion/calificacion';
// import verCalificacionComponent from '../pages/calificacion/verCalificacion';
// import privacidadComponent 		from '../pages/privacidad/privacidad';
import frecuenciaComponent from '../pages/frecuencia/frecuencia';
// import tanquesComponent 		from '../pages/tanques/tanques';
// import nuevoTanqueComponent 	from '../pages/tanques/nuevoTanques';
import revisionComponent from '../pages/revision/revision';
import nuevaRevisionComponent from '../pages/revision/nuevaRevision';
import chartComponent from '../pages/chart/chart';
// import cerrarRevisionComponent 	from '../pages/revision/cerrarRevision';
// import cerrarSeguridadComponent from '../pages/revision/cerrarSeguridad';
// import cerrarTanqueComponent 	from '../pages/tanques/cerrarTanque';
import reporteEmergenciaComponent from '../pages/reporteEmergencia/reporteEmergencia';
import nuevoReporteEmergenciaComponent from '../pages/reporteEmergencia/nuevoReporteEmergencia';
import pdfComponent from '../pages/pdf/pdf';

const Stack = createNativeStackNavigator();

function AppNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false, // Equivalente a headerMode: 'none'
				}}
				initialRouteName="Home"
			>
				<Stack.Screen name="Home" component={homeComponent} />
				<Stack.Screen name="pedido" component={pedidoComponent} />
				<Stack.Screen name="IniciarSesion" component={IniciarSesion} />
				<Stack.Screen name="nuevo_pedido" component={nuevoPedidoComponent} />
				<Stack.Screen name="Perfil" component={PerfilComponent} />
				<Stack.Screen name="usuarios" component={usuariosComponent} />
				<Stack.Screen name="vehiculo" component={vehiculoComponent} />
				<Stack.Screen name="zona" component={zonaComponent} />
				<Stack.Screen name="capacidad" component={capacidadComponent} />
				<Stack.Screen name="editarPerfil" component={editarPerfilComponent} />
				<Stack.Screen name="verPerfil" component={verPerfilComponent} />
				{/* 
        <Stack.Screen name="registro" component={registroComponent} />
        <Stack.Screen name="privacidad" component={privacidadComponent} />
        */}
				<Stack.Screen name="recuperar" component={recuperarComponent} />
				<Stack.Screen name="puntos" component={puntosComponent} />
				{/* 
        <Stack.Screen name="calificacion" component={calificacionComponent} />
        <Stack.Screen name="verCalificacion" component={verCalificacionComponent} />
        */}
				<Stack.Screen name="frecuencia" component={frecuenciaComponent} />
				{/* 
        <Stack.Screen name="tanques" component={tanquesComponent} />
        <Stack.Screen name="nuevoTanque" component={nuevoTanqueComponent} />
        */}
				<Stack.Screen name="revision" component={revisionComponent} />
				<Stack.Screen name="nuevaRevision" component={nuevaRevisionComponent} />
				<Stack.Screen name="chart" component={chartComponent} />
				{/* 
        <Stack.Screen name="cambiar" component={cambiarComponent} />
        <Stack.Screen name="cerrarRevision" component={cerrarRevisionComponent} />
        <Stack.Screen name="cerrarSeguridad" component={cerrarSeguridadComponent} />
        <Stack.Screen name="cerrarTanque" component={cerrarTanqueComponent} />
        */}
				<Stack.Screen name="reporteEmergencia" component={reporteEmergenciaComponent} />
				<Stack.Screen name="nuevoReporteEmergencia" component={nuevoReporteEmergenciaComponent} />
				<Stack.Screen name="pdf" component={pdfComponent} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default AppNavigator;