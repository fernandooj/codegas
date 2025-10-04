import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";

let size = Dimensions.get('window').width;

export const style = MediaQueryStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	containerRegistro: {
		flex: 1,
		width: "100%",
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 100,
	},
	subContainerRegistro: {
		flex: 1,
		alignItems: 'center',
	},
	separador: {
		height: 1,
		width: "80%",
		left: "10%",
		marginTop: 0,
		backgroundColor: "rgba(0,0,0,.1)"
	},
	// Nuevos estilos modernos
	registerSection: {
		marginHorizontal: 20,
		marginTop: 30,
		marginBottom: 20,
	},
	loginSection: {
		marginHorizontal: 20,
		marginTop: 20,
		marginBottom: 30,
	},
	registerCard: {
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderRadius: 20,
		padding: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	loginCard: {
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderRadius: 20,
		padding: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	iconContainer: {
		alignSelf: 'center',
		backgroundColor: 'rgba(0, 33, 139, 0.1)',
		borderRadius: 50,
		width: 80,
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	sectionTitle: {
		fontFamily: "Comfortaa-Regular",
		color: "#00218b",
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 8,
		fontWeight: '600',
	},
	sectionSubtitle: {
		fontFamily: "Comfortaa-Light",
		color: "#666",
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 25,
		lineHeight: 20,
	},
	elegantSeparator: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 30,
		marginHorizontal: 20,
	},
	separatorLine: {
		flex: 1,
		height: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
	},
	separatorText: {
		marginHorizontal: 15,
		color: '#fff',
		fontSize: 16,
		fontWeight: '500',
		backgroundColor: 'rgba(0, 33, 139, 0.8)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 15,
		overflow: 'hidden',
	},
	iconAvatar: {
		fontSize: 50,
		color: "#00218b"
	},
	containerRegistro2: {
		flex: 1,
		width: "100%",
		marginTop: 45,
		marginBottom: 45
	},
	cabezera1: {
		width: '70%',
		height: 100,
		alignSelf: 'center'
	},

	//////////////////////////////////////////////////////////////////
	//////////////////////      CABEZERA
	//////////////////////////////////////////////////////////////////
	perfilContenedor: {
		flexDirection: "row",
		borderBottomColor: "rgba(0,0,0,.2)",
		borderBottomWidth: 1,
		paddingVertical: 15,
	},
	columna1: {
		alignItems: "center",
		justifyContent: "center",
		width: "25%"
	},
	btnLista: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderBottomColor: "rgba(0,0,0,.2)",
		borderBottomWidth: 1,
		padding: 0
	},
	txtLista: {
		fontFamily: "Comfortaa-Light",
		width: "80%",
		fontSize: 20,
		left: 20
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30
	},
	nombre: {
		fontFamily: "Comfortaa-Light",
		fontSize: 17
	},
	icon: {
		width: 80,
		height: 80
	},
	footer: {
		position: "absolute",
		bottom: 0,
		width: "100%"
	},
	//////////////////////////////////////////////////////////////////
	//////////////////////      INPUTS MODERNOS
	//////////////////////////////////////////////////////////////////
	inputContainer: {
		marginBottom: 20,
		position: 'relative',
	},
	inputIcon: {
		position: 'absolute',
		left: 15,
		top: 16,
		zIndex: 1,
	},
	modernInput: {
		backgroundColor: '#ffffff',
		borderWidth: 2,
		borderColor: 'rgba(0, 33, 139, 0.1)',
		borderRadius: 12,
		paddingVertical: 15,
		paddingLeft: 45,
		paddingRight: 15,
		fontSize: 16,
		fontFamily: "Comfortaa-Light",
		color: '#333',
		shadowColor: 'rgba(0, 33, 139, 0.1)',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	passwordInput: {
		paddingRight: 50,
	},
	eyeButton: {
		position: 'absolute',
		right: 15,
		top: 15,
		padding: 5,
		zIndex: 1,
	},
	inputInvalid: {
		borderColor: '#e74c3c',
		borderWidth: 2,
	},
	// Estilos antiguos (mantener compatibilidad)
	input: {
		width: "85%",
		paddingVertical: 10,
		height: 45,
		paddingLeft: 10,
		borderWidth: 1,
		fontFamily: "Comfortaa-Light",
		backgroundColor: '#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		borderColor: "rgba(0,0,0,.2)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		marginLeft: 10,
		marginBottom: 15,
		borderRadius: 5,
		textAlignVertical: "center",
	},
	passwordContainer: {
		width: "85%",
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: "rgba(0,0,0,.2)",
		backgroundColor: '#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		elevation: 7, // Android
		marginLeft: 10,
		marginBottom: 15,
		borderRadius: 5,
		height: 45,
	},
	titulo: {
		fontFamily: "Comfortaa-Regular",
		color: "#002587",
		fontSize: 22,
		marginBottom: 20,
	},
	// Botones modernos
	modernButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginTop: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	registerButton: {
		backgroundColor: '#00218b',
	},
	loginButton: {
		backgroundColor: '#27ae60',
	},
	disabledButton: {
		backgroundColor: '#bdc3c7',
		opacity: 0.6,
	},
	buttonText: {
		fontFamily: "Comfortaa-Regular",
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	forgotPasswordButton: {
		alignItems: 'center',
		marginTop: 20,
	},
	forgotPasswordText: {
		fontFamily: "Comfortaa-Light",
		color: "#00218b",
		fontSize: 14,
		textDecorationLine: 'underline',
	},
	versionText: {
		fontFamily: "Comfortaa-Light",
		color: "#666",
		fontSize: 11,
		marginTop: 5,
	},
	// Estilos antiguos (mantener compatibilidad)
	btnGuardar: {
		flexDirection: "row",
		backgroundColor: "#00218b",
		paddingTop: Platform.OS === 'android' ? 5 : 10,
		paddingBottom: 10,
		paddingHorizontal: 20,
		borderRadius: 20
	},
	textGuardar: {
		fontFamily: "Comfortaa-Light",
		color: "#ffffff"
	},
	iconCargando: {
		color: "#ffffff"
	},
	btnOlvidar: {
		marginVertical: 25
	},
	textOlvidar: {
		fontFamily: "Comfortaa-Light",
		color: "#00218b"
	},

	tituloRegresar: {
		fontFamily: "Comfortaa-Light",
		textAlign: "center",
		fontSize: 22,
		marginTop: 30,
	}
}, {
	"@media (max-device-width: 410)": {
		columna1: {
			width: "30%"
		},
		txtLista: {
			fontSize: 18,
			left: 20
		},
		icon: {
			width: 80,
			height: 80
		},
	}
})