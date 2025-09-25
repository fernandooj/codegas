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
		marginBottom: 80,
		width: "100%",
		backgroundColor: '#f8f9fa',
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
	iconAvatar: {
		fontSize: 60,
		color: "#002587"
	},
	containerRegistro2: {
		flex: 1,
		width: "100%",
		marginTop: 45,
		marginBottom: 45
	},
	cabezera: {
		width: '85%',
		height: 120,
		alignSelf: 'center',
		marginBottom: 20
	},

	//////////////////////////////////////////////////////////////////
	//////////////////////      CABEZERA
	//////////////////////////////////////////////////////////////////
	perfilContenedor: {
		flexDirection: "row",
		backgroundColor: '#ffffff',
		marginHorizontal: 20,
		marginTop: 15,
		padding: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 6,
		borderBottomWidth: 0,
	},
	columna1: {
		alignItems: "center",
		justifyContent: "center",
		width: "25%"
	},
	columna2: {
		justifyContent: "center",
		paddingLeft: 20,
		width: "75%"
	},
	columna4: {
		alignItems: "center",
		justifyContent: "center",
		width: "25%"
	},
	btnLista: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: '#ffffff',
		marginHorizontal: 20,
		marginVertical: 6,
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
		borderBottomWidth: 0,
	},
	txtLista: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 12,
		color: '#2c3e50',
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: '#002587'
	},
	nombre: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 16,
		color: '#2c3e50',
		marginBottom: 3
	},
	email: {
		fontFamily: "Comfortaa-Light",
		fontSize: 13,
		color: '#7f8c8d',
		marginBottom: 0
	},
	icon: {
		width: 12,
		height: 12,
		backgroundColor: '#007bff',
		borderRadius: 9,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		position: "absolute",
		bottom: 0,
		width: "100%"
	},
	//////////////////////////////////////////////////////////////////
	//////////////////////      INPUTS
	//////////////////////////////////////////////////////////////////
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
	inputInvalid: {
		borderWidth: 1,
		borderColor: "rgba(255, 0, 0, 0.42)"
	},
	titulo: {
		fontFamily: "Comfortaa-Regular",
		color: "#002587",
		fontSize: 22,
		marginBottom: 20,
	},
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
	},
	btnCerrarSesion: {
		backgroundColor: '#e74c3c',
		marginTop: 6,
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	txtCerrarSesion: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 14,
	},
	btnVersion: {
		backgroundColor: '#95a5a6',
		marginTop: 3,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	txtVersion: {
		color: '#ffffff',
		fontSize: 10,
		textAlign: 'center',
		fontWeight: '500',
	}
}, {
	"@media (max-device-width: 410)": {
		columna1: {
			width: "30%"
		},
		txtLista: {
			fontSize: 18,
			left: 15
		},
		icon: {
			width: 55,
			height: 55
		},
	}
})