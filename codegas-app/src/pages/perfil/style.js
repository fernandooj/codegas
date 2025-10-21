import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
import {
	getResponsiveValue,
	getResponsivePadding,
	getResponsiveFontSize,
	getResponsiveAvatarSize
} from './responsiveStyles';

export const style = MediaQueryStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
		//paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
	},
	contentBackground: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	containerRegistro: {
		flex: 1,
		width: "100%",
		backgroundColor: 'transparent',
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
		fontSize: getResponsiveValue(60, 70, 80),
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
		backgroundColor: '#f5f3f3ff',
		marginHorizontal: getResponsivePadding(),
		marginTop: 8,
		padding: getResponsiveValue(12, 16, 20),
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
		width: "20%"
	},
	columna2: {
		justifyContent: "center",
		paddingLeft: getResponsiveValue(20, 25, 30),
		width: "92%"
	},
	columna4: {
		alignItems: "center",
		justifyContent: "center",
		width: "18%"
	},
	btnLista: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: '#ffffff',
		marginHorizontal: getResponsivePadding(),
		marginVertical: 3,
		paddingVertical: getResponsiveValue(6, 12, 14),
		paddingHorizontal: getResponsiveValue(10, 16, 18),
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
		fontSize: getResponsiveFontSize(10),
		color: '#2c3e50',
	},
	avatar: {
		width: getResponsiveAvatarSize(),
		height: getResponsiveAvatarSize(),
		borderRadius: getResponsiveAvatarSize() / 2,
		borderWidth: 2,
		borderColor: '#002587'
	},
	nombre: {
		fontFamily: "Comfortaa-Bold",
		fontSize: getResponsiveFontSize(14),
		color: '#2c3e50',
		marginBottom: 3
	},
	email: {
		fontFamily: "Comfortaa-Light",
		fontSize: getResponsiveFontSize(12),
		color: '#7f8c8d',
		marginBottom: 0
	},
	icon: {
		width: getResponsiveValue(24, 28, 32),
		height: getResponsiveValue(24, 28, 32),
		backgroundColor: '#007bff',
		borderRadius: getResponsiveValue(16, 18, 20),
		justifyContent: 'center',
		alignItems: 'center',
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
		backgroundColor: 'transparent',
		marginTop: 3,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	txtVersion: {
		color: '#95a5a6',
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
			fontSize: 14,
			left: 12
		},
		icon: {
			width: 40,
			height: 40
		},
	},
	"@media (min-device-width: 414)": {
		perfilContenedor: {
			marginHorizontal: 30,
			padding: 20,
		},
		columna2: {
			paddingLeft: 25,
		},
		btnLista: {
			marginHorizontal: 30,
			marginVertical: 8,
			paddingVertical: 12,
			paddingHorizontal: 16,
		},
		txtLista: {
			fontSize: 14,
		},
		avatar: {
			width: 60,
			height: 60,
			borderRadius: 35,
		},
		nombre: {
			fontSize: 18,
		},
		email: {
			fontSize: 15,
		},
		containerRegistro: {
			marginBottom: 100,
		},
	},
	"@media (min-device-width: 428)": {
		perfilContenedor: {
			marginHorizontal: 35,
			padding: 24,
		},
		columna2: {
			paddingLeft: 30,
		},
		btnLista: {
			marginHorizontal: 35,
			marginVertical: 10,
			paddingVertical: 14,
			paddingHorizontal: 18,
		},
		txtLista: {
			fontSize: 15,
		},
		avatar: {
			width: 75,
			height: 75,
			borderRadius: 37.5,
		},
		nombre: {
			fontSize: 19,
		},
		email: {
			fontSize: 16,
		},
		containerRegistro: {
			marginBottom: 110,
		},
	}
})