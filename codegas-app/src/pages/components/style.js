import { Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
const size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			FOOTER DISEÑO MODERNO CON GLASSMORPHISM
	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Wrapper principal del footer
	footerWrapper: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: Platform.OS === 'ios' ? 100 : 90,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},

	// Contenedor principal del footer
	contenedorFooter: {
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		width: "100%",
		height: Platform.OS === 'ios' ? 75 : 70,
		paddingHorizontal: 15,
		paddingTop: 15,
		paddingBottom: Platform.OS === 'ios' ? 35 : 25, // Extra padding for safe area
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: -8 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 20,
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		marginBottom: 0, // Remove bottom margin
		position: 'relative',
		overflow: 'visible',
		borderTopWidth: 1,
		borderTopColor: "rgba(0, 0, 0, 0.1)",
	},

	// Contenedores de tabs
	subContenedorFooter: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingVertical: 0,
		flex: 1,
	},

	subContenedorFooter2: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingVertical: 8,
		flex: 1,
	},

	subContenedorFooter3: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingVertical: 8,
		flex: 1,
	},

	// Contenedores específicos para cada tab
	firstTabContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingVertical: 8,
		flex: 1,
	},

	tabContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		paddingVertical: 0,
		flex: 1,
		height: '100%',
	},

	// Ícono activo elevado
	activeTabWrapper: {
		position: 'absolute',
		left: '25%', // Moved left to avoid overlapping with Pedidos tab
		marginLeft: -40,
		top: -35,
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#ffffff",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.6,
		shadowRadius: 20,
		elevation: 20,
		zIndex: 100,
		borderWidth: 4,
		borderColor: "#002587",
		// Efecto de iluminación
		shadowColor: "#002587",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 25,
	},

	elevatedIconContainer: {
		width: 70,
		height: 70,
		borderRadius: 35,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 37, 135, 0.1)",
	},

	// Contenedor de íconos
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(0, 37, 135, 0.1)",
		marginBottom: 0,
	},

	// Estilos de íconos
	icon: {
		width: 24,
		height: 24,
		tintColor: "#002587",
	},

	// Iconos FontAwesome
	iconFont: {
		fontSize: 24,
		color: "#002587",
		fontWeight: "400",
	},

	// Ícono activo
	activeIcon: {
		width: 32,
		height: 32,
		tintColor: "#002587",
	},

	// Ícono activo FontAwesome
	activeIconFont: {
		fontSize: 32,
		color: "#002587",
		fontWeight: "600",
	},

	// Texto del footer
	textFooter: {
		fontFamily: "Comfortaa-Medium",
		textAlign: "center",
		color: "#002587",
		fontSize: 11,
		fontWeight: "500",
		marginTop: 4,
		lineHeight: 13,
	},

	// Badge para notificaciones
	badge: {
		backgroundColor: "#ef4444",
		position: "absolute",
		top: -8,
		right: 8,
		minWidth: 20,
		height: 20,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
		borderWidth: 3,
		borderColor: "#ffffff",
		zIndex: 50,
		shadowColor: "#ef4444",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
	},

	// Badge para ícono elevado
	badgeElevated: {
		top: -10,
		right: -10,
		zIndex: 150,
	},

	textBadge: {
		fontFamily: "Comfortaa-Bold",
		textAlign: "center",
		color: "#ffffff",
		fontSize: 10,
		fontWeight: "bold",
		lineHeight: 11,
	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			OTROS ESTILOS ORIGINALES
	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	contenedorPortada: {
		alignItems: "center"
	},
	contenedorUploadPortada: {
		alignItems: "center",
		marginTop: 10,
		width: "80%"
	},
	iconPortada: {
		backgroundColor: "#00218b",
		color: "#ffffff",
		paddingVertical: 22,
		paddingHorizontal: 22,
		borderRadius: 15,
		fontSize: 22,
	},
	textPortada: {
		fontFamily: "Comfortaa-Regular",
		color: "#ffffff",
		fontSize: 15,
		marginVertical: 5
	},
	textPortada2: {
		fontFamily: "Comfortaa-Regular",
		color: "#00218b",
		fontSize: 15,
		marginVertical: 0
	},
	imagenesFotos: {
		width: 100,
		height: 100,
		marginHorizontal: 5,
		marginVertical: 15,
		borderRadius: 10
	},
	iconTrash: {
		backgroundColor: "rgba(255,255,255,.5)",
		width: 27,
		borderRadius: 15,
		fontSize: 20,
		padding: 5,
		left: 46,
		top: -75
	},
	btnModal: {
		backgroundColor: "rgba(0,0,0,.1)",
		flex: 1,
	},
	contenedorModal: {
		position: "absolute",
		alignItems: "center",
		width: "100%",
		bottom: 50,
	},
	btnOpcionModal: {
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: "#ffffff",
		width: "90%",
		alignItems: "center",
		padding: 12
	},
	textModal: {
		fontFamily: "Comfortaa-Light",
		fontSize: 19
	},
	avatarPerfil: {
		width: 100,
		height: 100,
		borderRadius: 50
	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			SUBIR PDF
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	contenedorPdf: {
		width: "100%",
		paddingVertical: 10,
		paddingLeft: 10,
		fontFamily: "Comfortaa-Light",
		backgroundColor: '#ffffff',
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor: "rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		marginLeft: 0,
		marginVertical: 11,
		borderRadius: 5,
		textAlignVertical: "center",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	iconTrashPdf: {
		flexWrap: 'wrap',
		paddingHorizontal: 10,
		fontSize: 17
	},
	textPdf: {
		fontFamily: "Comfortaa-Light",
	}

}, {
	"@media (min-device-height: 812)": {
		footerWrapper: {
			height: 110,
		},
		contenedorFooter: {
			height: 80,
			marginBottom: 0,
			paddingBottom: 40,
			borderTopLeftRadius: 40,
			borderTopRightRadius: 40,
		},
		activeTabWrapper: {
			width: 85,
			height: 85,
			borderRadius: 42.5,
			top: -40,
			left: '25%', // Moved left to avoid overlapping with Pedidos tab
			marginLeft: -42.5,
		},
		elevatedIconContainer: {
			width: 75,
			height: 75,
			borderRadius: 37.5,
		},
		icon: {
			width: 26,
			height: 26,
		},
		iconFont: {
			fontSize: 26,
		},
		activeIcon: {
			width: 34,
			height: 34,
		},
		activeIconFont: {
			fontSize: 34,
		},
		textFooter: {
			fontSize: 12,
			marginTop: 5,
		},
		badge: {
			minWidth: 22,
			height: 22,
			borderRadius: 11,
			top: -10,
			right: 10,
		},
		badgeElevated: {
			top: -12,
			right: -12,
		},
		textBadge: {
			fontSize: 11,
			lineHeight: 12,
		},
	}
})