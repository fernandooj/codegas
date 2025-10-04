import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	// Container principal
	safeContainer: {
		flex: 1,
		backgroundColor: '#f8f9fa'
	},
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa'
	},
	scrollContent: {
		paddingBottom: 20
	},

	// Header
	header: {
		alignItems: 'center',
		paddingTop: 0,
		paddingBottom: 10,
		backgroundColor: '#fff',
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	logo: {
		width: '100%',
		height: 80,
		marginBottom: 10
	},
	welcomeText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#002587',
		textAlign: 'center'
	},

	// Botones modernos
	botonesContainer: {
		paddingHorizontal: 20,
		marginBottom: 10
	},
	btnModerno: {
		backgroundColor: '#fff',
		marginBottom: 15,
		borderRadius: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 5
	},
	btnContent: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 20
	},
	iconContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 15
	},
	iconModerno: {
		fontSize: 24,
		textAlign: 'center'
	},
	textContainer: {
		flex: 1
	},
	titleModerno: {
		fontSize: 18,
		fontWeight: '700',
		color: '#fff',
		marginBottom: 4
	},
	subtitleModerno: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.8)',
		fontWeight: '400'
	},
	chevron: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.7)',
		textAlign: 'center'
	},

	// Leyenda de estados
	leyendaContainer: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		borderRadius: 15,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	leyendaHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef'
	},
	leyendaHeaderIcon: {
		fontSize: 20,
		marginRight: 10
	},
	leyendaTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#002587'
	},
	estadosGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	estadoItem: {
		width: '48%',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		padding: 12,
		backgroundColor: '#f8f9fa',
		borderRadius: 10
	},
	estadoIndicator: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)'
	},
	estadoIcon: {
		fontSize: 12,
		textAlign: 'center'
	},
	estadoTexto: {
		fontSize: 13,
		fontWeight: '500',
		color: '#495057',
		flex: 1
	},

	// Estilos legacy (mantenidos para compatibilidad)
	fondoOnline: {
		width: 340,
		paddingLeft: 70
	},
	btnUsuariosOnline: {
		padding: 20,
		borderRadius: 10,
		marginBottom: 20,
	},
	textUsuariosOnline: {
		fontFamily: "Comfortaa-Light",
		color: "#ffffff",
		fontSize: 16,
		top: 8,
		left: 10
	},
	contenedorColores: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	subContenedorColor: {
		flexDirection: 'row',
		width: "45%",
		marginBottom: 10,
		left: 5
	},
	color: {
		width: 10,
		height: 10,
		top: 9,
	},
	textColor: {
		fontFamily: "Comfortaa-Light",
		fontSize: 14,
		left: 5
	},
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal: {
		position: Platform.OS == 'android' ? null : "absolute",
		alignItems: "center",
		// justifyContent: 'center',
		backgroundColor: "rgba(0,0,0,.5)",
		height: size.height,
		zIndex: 100,
		width: "100%",
		bottom: 50,
		top: 0,
		left: 0,
	},
	subContenedorModal: {
		backgroundColor: "#ffffff",
		borderRadius: 7,
		padding: 10,
		top: 100,
		width: size.width - 80,
		alignItems: "center"
	},
	btnModalClose: {
		position: "absolute",
		right: Platform.OS == 'android' ? 1 : 3,
		top: Platform.OS == 'android' ? -1 : 2,
		zIndex: 100
	},
	iconCerrar: {
		fontSize: 30
	},
	tituloModal: {
		fontFamily: "Comfortaa-Bold",
		textAlign: "center",
		marginVertical: 5,
		fontWeight: "bold"
	},
	tituloModal2: {
		fontFamily: "Comfortaa-Regular",
		textAlign: "center",
		marginBottom: 10
	},
	btnGuardar: {
		backgroundColor: "#00218b",
		alignItems: "center",
		padding: 10,
		borderRadius: 5,
		marginTop: 25
	},
	btnGuardarDisable: {
		backgroundColor: "grey",
		alignItems: "center",
		padding: 10,
		borderRadius: 5,
		marginTop: 25
	},
	textGuardar: {
		fontFamily: "Comfortaa-Bold",
		color: "#ffffff"
	},
	input: {
		fontFamily: "Comfortaa-Regular",
		width: size.width - 100,
		backgroundColor: "#ffffff",
		borderColor: "rgba(90,90,90,.3)",
		borderWidth: 1,
		height: 40,
		borderRadius: 5,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		padding: 10,
		margin: 8
	},
}, {
	"@media (max-device-width: 410)": {
		icon: {
			width: 65,
			height: 65,
			marginRight: 15,
			marginLeft: 30
		},
		text: {
			fontSize: 24
		},
	}
})