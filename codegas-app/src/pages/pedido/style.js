import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingTop: Platform.OS === 'android' ? 0 : 10,
		alignItems: "center",
		justifyContent: 'center'
	},
	subContenedor: {
		marginBottom: Platform.OS === 'android' ? 50 : 70,
		width: "100%", // Cambiado de 95% a 100% para más cercanía a los bordes
	},
	pedidoBtn: {
		borderColor: "rgba(255,255,255,.5)",
		marginVertical: 5,
		borderRadius: 10,
		borderWidth: 1,
		padding: 10
	},
	hidePedido: {
		height: 0,
		width: 0,
		opacity: 0,
		margin: 0,
		padding: 0,
		borderWidth: 0
	},
	icon: {
		color: "#ffffff",
	},
	text: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 15
	},
	columna1: {
		width: "30%"
	},
	columna2: {
		justifyContent: 'center'
	},
	fechas: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#ffffff",
		marginBottom: 5,
		paddingBottom: 5
	},
	containerPedidos: {
		flexDirection: "row"
	},
	textPedido: {
		fontFamily: "Comfortaa-Regular",
		width: "48%"
	},
	imagen: {
		width: size.width - 40,
		height: 300
	},
	sinPedidos: {
		fontFamily: "Comfortaa-Regular",
		textAlign: "center",
		fontSize: 22
	},
	emptyStateContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
		paddingVertical: 60,
		backgroundColor: '#f8f9fa',
		marginHorizontal: 20,
		marginVertical: 20,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	emptyStateIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#6c757d',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	emptyStateIcon: {
		color: '#ffffff',
	},
	emptyStateTitle: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 24,
		color: '#495057',
		textAlign: 'center',
		marginBottom: 8,
		lineHeight: 30,
	},
	emptyStateSubtitle: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 16,
		color: '#6c757d',
		textAlign: 'center',
		marginBottom: 20,
		lineHeight: 22,
	},
	emptyStateDivider: {
		width: 60,
		height: 2,
		backgroundColor: '#dee2e6',
		marginBottom: 16,
		borderRadius: 1,
	},
	emptyStateHint: {
		fontFamily: "Comfortaa-Light",
		fontSize: 14,
		color: '#adb5bd',
		textAlign: 'center',
		fontStyle: 'italic',
		lineHeight: 20,
	},
	pedido: {
		flexDirection: "row",
		padding: 6
	},
	txtPedidoFinalizado: {
		fontFamily: "Comfortaa-Regular",
	},
	//////////////////////////////////////////////////////////////////		
	///////////				CABEZERA
	//////////////////////////////////////////////////////////////////
	contenedorCabezera: {
		width: "90%",
		marginTop: Platform.OS === 'android' ? 0 : 15,
	},
	subContenedorCabezera: {
		flexDirection: "row"
	},
	inputCabezera: {
		fontFamily: "Comfortaa-Bold",
		position: "relative",
		zIndex: 0,
		width: "93%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor: "rgba(150,150,150, .5)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		paddingLeft: 10,
		marginBottom: 20,
		borderTopLeftRadius: 7,
		borderBottomLeftRadius: 7,
		paddingTop: 2,
		borderWidth: 1,
		height: Platform.OS === "ios" ? 35 : 35
	},
	buscarCliente: {
		backgroundColor: "#002587",
		alignItems: "center",
		width: 30,
		height: 35,
		top: -1,
		borderTopRightRadius: 7,
		borderBottomRightRadius: 7,
		paddingVertical: 9
	},
	iconSearch: {
		color: "#ffffff",
		fontSize: 15
	},
	imgFiltro: {
		width: 28,
		height: 28,
		marginLeft: 20
	},
	titulo: {
		fontFamily: "Comfortaa-Regular",
		width: "58%",
		fontSize: 22,
		marginVertical: 10,
	},
	btnZonas: {
		padding: 5,
		top: 5,
		// borderWidth:1
	},
	textZonas: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 20
	},
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL FILTRO
	//////////////////////////////////////////////////////////////////
	modal: {
		position: "absolute",
		backgroundColor: "#f0f0f0",
		zIndex: 100,
		width: size.width,
		height: size.height,
	},
	subContenedorFiltro: {
		backgroundColor: "#e3e3e3",
		marginHorizontal: 12,
		marginTop: 12,
		width: "90%"
	},
	titulo1: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 17,
		padding: 10
	},
	cabezera: {
		flexDirection: "row",
		backgroundColor: "#ffffff",
		paddingTop: Platform.OS === 'android' ? 5 : 30,
		paddingBottom: 10,
		top: 5
	},
	btnRegresar: {
		fontFamily: "Comfortaa-Bold",
		paddingVertical: 4,
		paddingHorizontal: 8,
		marginRight: 8,
		top: 5
	},
	btnFiltro: {
		flexDirection: "row",
		paddingTop: 5,
		paddingVertical: 0,
		paddingHorizontal: 10
	},
	btnReload: {
		flexDirection: "row",
		paddingTop: 5,
		paddingVertical: 0,
		marginHorizontal: 0,

	},
	iconReload: {
		fontSize: 23,
		marginHorizontal: 5
	},
	iconFiltro: {
		fontSize: 15
	},
	textoFiltro: {
		fontFamily: "Comfortaa-Regular",
		width: 100
	},
	btnLimpiar: {
		flexDirection: "row",
		position: "absolute",
		right: 10,
		top: Platform.OS == 'android' ? 10 : 35
	},
	textoLimpiar: {
		fontFamily: "Comfortaa-Regular",
		width: 80
	},

	//////////////////////////////////////////////////////////////////		
	///////////				MODAL  ZONA
	//////////////////////////////////////////////////////////////////
	modalZona: {
		position: Platform.OS == 'android' ? null : "absolute",
		alignItems: "center",
		justifyContent: 'center',
		backgroundColor: "rgba(0,0,0,.5)",
		height: size.height,
		zIndex: 100,
		width: "100%",
		bottom: 50,
		top: 0,
		left: 0,
	},
	subModalZona: {
		backgroundColor: "#ffffff",
		borderRadius: 7,
		padding: 10,
		height: size.height - 120,
		alignItems: "center"
	},
	btnZona: {
		flexDirection: "row",
		padding: 10
	},
	textZona: {
		fontFamily: "Comfortaa-Regular",
		textAlign: "center",
		width: 100
	},

	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal: {
		position: Platform.OS == 'android' ? "absolute" : "absolute",
		alignItems: "center",
		justifyContent: 'center',
		backgroundColor: "rgba(0,0,0,.5)",
		width: "100%",
		height: size.height,
		zIndex: 100,
		bottom: 50,
		top: 0,
		left: 0,
		flex: 1,

	},

	contenedorModal2: {
		position: Platform.OS == 'android' ? "absolute" : "absolute",
		alignItems: "center",
		justifyContent: 'center',
		backgroundColor: "rgba(0,0,0,.5)",
		height: size.height,
		zIndex: 200,
		width: "100%",
		top: 0,
		left: 0,
	},
	contenedorCerrarPedido: {
		left: 5
	},
	subContenedorModal: {
		backgroundColor: "#ffffff",
		height: size.height - 100,
		borderRadius: 7,
		padding: 8,
		alignItems: "center",
		minWidth: size.width / 1.5,
	},
	containerTituloModal: {
		minWidth: size.width / 1.5,
	},
	subContenedorModal2: {
		backgroundColor: "#ffffff",
		height: 220,
		borderRadius: 7,
		padding: 10,

	},
	listadoPerfil: {
		padding: 10,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,.5)"
	},
	listadoPerfil2: {
		padding: 10,
	},
	btnModalClose: {
		position: "absolute",
		right: -8,
		top: -8,
		zIndex: 100
	},
	btnModalClose2: {
		position: "absolute",
		right: 8,
		top: 0,
		zIndex: 100
	},

	iconCerrar: {
		fontSize: 31
	},
	separador: {
		width: size.width - 90,
		backgroundColor: "rgba(0,0,0,.5)",
		height: 2,
		marginTop: 12
	},
	tituloModal: {
		fontFamily: "Comfortaa-Regular",
		textAlign: "center",
		fontSize: 22,
		marginVertical: 0
	},
	contenedorEspera: {
		padding: 8
	},
	subContenedorEditar: {
		flexDirection: "row",
		padding: 6
	},
	textoEspera: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 18,
		width: "80%",
	},
	activo: {
		backgroundColor: "#5cb85c"
	},
	iconEditar: {
		color: "#ffffff",
		fontSize: 20,
		top: 2
	},
	btnGuardar: {
		backgroundColor: "#00218b",
		padding: 8,
		width: "70%",
		marginVertical: 20
	},
	btnDisable: {
		backgroundColor: "grey",
		padding: 8,
		width: "70%",
		marginVertical: 20
	},
	btnGuardar2: {
		backgroundColor: "#00218b",
		paddingVertical: 8,
		width: "80%",
		marginVertical: 20,
		left: "10%",
		justifyContent: "center"
	},
	btnDisable2: {
		backgroundColor: "grey",
		paddingVertical: 8,
		width: size.width - 150,
		marginVertical: 20,
		left: size.width / 10,
		justifyContent: "center"
	},
	btnGuardar3: {
		backgroundColor: "#00218b",
		paddingVertical: 4,
		width: size.width / 2.5,
		borderRadius: 10,
		padding: 4,
		marginVertical: 10,
		left: 0,
		marginHorizontal: 10,
		justifyContent: "center"
	},
	btnDisable3: {
		backgroundColor: "grey",
		padding: 4,
		width: size.width / 2.5,
		marginVertical: 20,
		left: 0,
		marginHorizontal: 10,
		justifyContent: "center"
	},
	textGuardar: {
		fontFamily: "Comfortaa-Regular",
		color: "white",
		fontSize: 15,
		textAlign: "center"
	},
	iconBtnGuardar: {
		color: "#ffffff",
		fontSize: 20,
		marginLeft: 12
	},
	inputNovedad: {
		borderColor: "#rgba(0,0,0,.2)",
		textAlignVertical: 'top',
		alignItems: "flex-start",
		borderRadius: 5,
		marginTop: 15,
		borderWidth: 1,
		height: 100,
		paddingHorizontal: 10,
		width: size.width - 30
	},
	inputTerminarPedido: {
		width: size.width - 30,
		borderColor: "rgba(0,0,0,.2)",
		borderRadius: 5,
		borderWidth: 1,
		marginBottom: 10,
		paddingVertical: 8,
		paddingHorizontal: 5,
	},
	btnNovedad: {
		backgroundColor: "rgba(255, 204, 0, 1)",
		alignItems: "center",
		width: 110,
		padding: 5,
		borderRadius: 8
	},
	btnEmergencia: {
		backgroundColor: "rgba(255, 204, 0, 1)",
		alignItems: "center",
		width: 220,
		padding: 5,
		marginBottom: 10,
		borderRadius: 8
	},
	textNovedad: {
		color: "#ffffff",
		fontFamily: "Comfortaa-Regular",
	},
	contenedorNovedad: {
		width: size.width / 1.7,
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,.2)"
	},
	textNovedad: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 14
	},
	textNovedad2: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 12
	},
	tituloNovedades: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 18
	},
	////////////////////////////////////////////////////////////
	//////////////////		MODAL CONDUCTOR
	////////////////////////////////////////////////////////////
	contenedorConductor: {
		flexDirection: "row",
		padding: 10
	},
	conductor: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 14,
		width: 120,
		top: 5,

	},
	avatar: {
		width: 38,
		height: 38,
		borderRadius: 19
	},
	btnModalConductorClose: {
		position: "absolute",
		right: Platform.OS == 'android' ? -10 : 6,
		top: Platform.OS == 'android' ? -8 : 2,
		zIndex: 100
	},
	calendar: {
		// height:100
	},
	preload: {
		position: "absolute",
		zIndex: 100,
		bottom: 55,
		left: (size.width / 2) - 5
	},
	preload1: {
		position: "absolute",
		zIndex: 100,
		top: 0,
		left: (size.width / 2) - 5
	},



	/////////////////////////////////////////////////////////////////
	////////////////////        PICKER
	/////////////////////////////////////////////////////////////////
	contenedorSelect: {
		borderColor: "rgba(0,0,0,.2)",
		backgroundColor: "#ffffff",
		color: "#000000",
		width: "96.5%",
		borderWidth: 1,
		height: 50,
		marginTop: 5,
		marginBottom: 0,
		borderRadius: 5,
		paddingLeft: 0,
		paddingTop: Platform.OS === 'android' ? 0 : 15,
	},
	containerEditar: {
		padding: 10,
		marginBottom: 40
	},

	// New organized styles for pedido page
	headerContainer: {
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 0,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
		width: '100%',
	},
	headerButton: {
		borderRadius: 8,
		width: 36,
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	headerIcon: {
		fontSize: 14,
		color: '#fff'
	},

	//////////////////////////////////////////////////////////////////		
	///////////				LOADING AND PAGINATION STYLES
	//////////////////////////////////////////////////////////////////
	loadingContainerMain: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		marginHorizontal: 10,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	loadingPaginationContainer: {
		position: 'absolute',
		bottom: 80,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 15,
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		marginHorizontal: 20,
		borderRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6
	},
	loadingIndicatorLarge: {
		marginBottom: 15
	},
	loadingIndicatorSmall: {
		marginBottom: 8
	},
	loadingTextLarge: {
		fontSize: 18,
		color: '#0071bb',
		fontWeight: '600',
		textAlign: 'center'
	},
	loadingTextSmall: {
		fontSize: 16,
		color: '#0071bb',
		fontWeight: '600',
		textAlign: 'center'
	},
	loadingTextPagination: {
		fontSize: 14,
		color: '#0071bb',
		fontWeight: '600',
		textAlign: 'center'
	},
	loadingSubtextContainer: {
		fontSize: 14,
		color: '#666',
		marginTop: 4,
		textAlign: 'center',
		paddingHorizontal: 20
	},
	loadingSubtextSmall: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
		textAlign: 'center',
		paddingHorizontal: 20
	},

	//////////////////////////////////////////////////////////////////		
	///////////				TOAST NOTIFICATION STYLES
	//////////////////////////////////////////////////////////////////
	toastSuccessContainer: {
		height: 60,
		width: '90%',
		backgroundColor: '#28a745',
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 20,
		zIndex: 99999
	},
	toastErrorContainer: {
		height: 60,
		width: '90%',
		backgroundColor: '#dc3545',
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 20,
		zIndex: 99999
	},
	toastTextPrimary: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	toastTextSecondary: {
		color: 'white',
		fontSize: 14,
		marginLeft: 8
	},

	//////////////////////////////////////////////////////////////////		
	///////////				SEARCH BAR STYLES
	//////////////////////////////////////////////////////////////////
	searchBarContainer: {
		marginHorizontal: 20,
	},
	searchBar: {
		backgroundColor: '#fff',
		borderRadius: 10,
		flexDirection: "row",
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 2,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		height: 40,
	},
	searchBarActive: {
		borderColor: '#007bff',
	},
	searchBarInactive: {
		borderColor: '#e9ecef',
	},
	searchIconStyle: {
		fontSize: 16,
		color: '#6c757d',
		marginRight: 12
	},
	searchInputStyle: {
		flex: 1,
		fontSize: 15,
		color: '#333',
		paddingVertical: 8,
	},
	searchClearButton: {
		backgroundColor: '#dc3545',
		borderRadius: 6,
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchClearIcon: {
		fontSize: 14,
		color: '#fff'
	},
	searchLoadingContainer: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},

	//////////////////////////////////////////////////////////////////		
	///////////				FILTER BUTTONS STYLES
	//////////////////////////////////////////////////////////////////
	filterContainer: {
		marginHorizontal: 10,
		marginTop: 10,
	},
	filterScrollContent: {
		paddingHorizontal: 4,
		gap: 8
	},
	filterButtonBase: {
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	filterButtonText: {
		fontSize: 12,
		fontWeight: '600',
	},
	// Todos button
	filterTodos: {
		backgroundColor: '#007bff',
		borderWidth: 1,
		borderColor: 'rgba(0, 123, 255, 0.3)',
	},
	filterTodosActive: {
		borderWidth: 4,
		borderColor: '#fff',
		shadowColor: '#007bff',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
		transform: [{ scale: 1.05 }],
	},
	filterTodosText: {
		color: '#fff'
	},
	// Espera button
	filterEspera: {
		backgroundColor: 'rgba(91, 192, 222, 1)',
		borderWidth: 1,
		borderColor: 'rgba(91, 192, 222, 0.3)',
	},
	filterEsperaActive: {
		borderWidth: 4,
		borderColor: '#fff',
		shadowColor: 'rgba(91, 192, 222, 1)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
		transform: [{ scale: 1.05 }],
	},
	filterEsperaText: {
		color: '#fff'
	},
	// Activo button
	filterActivo: {
		backgroundColor: 'rgba(255, 235, 0, 1)',
		borderWidth: 1,
		borderColor: 'rgba(255, 235, 0, 0.3)',
	},
	filterActivoActive: {
		borderWidth: 4,
		borderColor: '#333',
		shadowColor: 'rgba(255, 235, 0, 1)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
		transform: [{ scale: 1.05 }],
	},
	filterActivoText: {
		color: '#333'
	},
	// Asignado button
	filterAsignado: {
		backgroundColor: 'rgba(240, 173, 78, 1)',
		borderWidth: 1,
		borderColor: 'rgba(240, 173, 78, 0.3)',
	},
	filterAsignadoActive: {
		borderWidth: 4,
		borderColor: '#fff',
		shadowColor: 'rgba(240, 173, 78, 1)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
		transform: [{ scale: 1.05 }],
	},
	filterAsignadoInactive: {
		borderWidth: 3,
	},
	filterAsignadoText: {
		color: '#fff'
	},
	// Inactivo button
	filterInnactivo: {
		backgroundColor: 'rgba(217, 83, 79, 1)',
		borderWidth: 1,
		borderColor: 'rgba(217, 83, 79, 0.3)',
	},
	filterInnactivoActive: {
		borderWidth: 3,
		borderColor: '#fff',
	},
	filterInnactivoText: {
		color: '#fff'
	},
	// No Entregado button
	filterNoEntregado: {
		backgroundColor: '#6c757d',
		borderWidth: 1,
		borderColor: 'rgba(108, 117, 125, 0.3)',
	},
	filterNoEntregadoActive: {
		borderWidth: 4,
		borderColor: '#fff',
		shadowColor: '#6c757d',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
		transform: [{ scale: 1.05 }],
	},
	filterNoEntregadoText: {
		color: '#fff'
	},
	// Otro/Cerrados button
	filterOtro: {
		backgroundColor: 'rgba(92, 184, 92, 1)',
		borderWidth: 1,
		borderColor: 'rgba(92, 184, 92, 0.3)',
	},
	filterOtroActive: {
		borderWidth: 4,
		borderColor: '#fff',
		shadowColor: 'rgba(92, 184, 92, 1)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 8,
		transform: [{ scale: 1.05 }],
	},
	filterOtroInactive: {
		borderWidth: 3,
	},
	filterOtroText: {
		color: '#fff'
	},
	filterTextActive: {
		fontWeight: '700',
	},

	//////////////////////////////////////////////////////////////////		
	///////////				PEDIDO CARD STYLES
	//////////////////////////////////////////////////////////////////
	pedidoCard: {
		borderRadius: 12,
		marginHorizontal: 8,
		marginVertical: 8,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderLeftWidth: 4,
	},
	pedidoCardHeader: {
		marginBottom: 6,
		paddingBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
	},
	pedidoCardHeaderRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 8
	},
	pedidoCardBuildingIcon: {
		fontSize: 14,
		color: '#007bff',
		marginRight: 6,
		marginTop: 2
	},
	pedidoCardCompanyText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#333',
		flex: 1,
		lineHeight: 18
	},
	pedidoCardInfoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	pedidoCardInfoLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	pedidoCardIdIcon: {
		fontSize: 12,
		color: '#6c757d',
		marginRight: 6
	},
	pedidoCardCedulaText: {
		fontSize: 13,
		color: '#6c757d'
	},
	pedidoCardEstadoBadge: {
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		minWidth: 60,
		justifyContent: 'center',
	},
	pedidoCardEstadoIcon: {
		fontSize: 9,
		color: 'white',
		marginRight: 3
	},
	pedidoCardEstadoText: {
		fontSize: 10,
		color: 'white',
		fontWeight: '600'
	},
	pedidoCardBody: {
		gap: 12
	},
	pedidoCardRow: {
  		flexDirection: 'row',
  		alignItems: 'center',
	},
	pedidoCardFieldSmall: {
		flex: 0.4,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	pedidoCardFieldSmallStart: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	pedidoCardFieldLarge: {
		flex: 0.6,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	pedidoCardFieldLargeStart: {
		flex: 3,
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	pedidoCardFieldContent: {
		flexShrink: 1,
		flexDirection: 'column',
        justifyContent: 'center',
	},
	pedidoCardFieldSpacer: {
		flex: 1
	},
	pedidoCardIconHashtag: {
		fontSize: 12,
		color: '#007bff',
		marginRight: 6
	},
	pedidoCardIconMarker: {
		fontSize: 12,
		color: '#dc3545',
		marginRight: 6
	},
	pedidoCardIconCode: {
		fontSize: 12,
		color: '#6f42c1',
		marginRight: 4,
		marginTop: 2
	},
	pedidoCardIconHome: {
		fontSize: 12,
		color: '#28a745',
		marginRight: 6,
		marginTop: 2
	},
	pedidoCardLabelText: {
		fontSize: 11,
		color: '#666',
		marginBottom: 2
	},
	pedidoCardValueSmall: {
		fontSize: 12,
		fontWeight: '600',
		color: '#333',
	},
	pedidoCardValue: {
		fontSize: 12,
		fontWeight: '600',
		color: '#6f42c1'
	},
	pedidoCardValueAddress: {
		fontSize: 12,
		color: '#333'
	},
	pedidoCardInfoPanel: {
		backgroundColor: '#ffffff',
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginTop: 12,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	pedidoCardInfoItem: {
		flex: 1,
		alignItems: 'center'
	},
	pedidoCardInfoItemLabel: {
		fontSize: 10,
		color: '#666',
		marginBottom: 2
	},
	pedidoCardInfoItemValue: {
		fontSize: 11,
		fontWeight: '600',
		color: '#333'
	},
	pedidoCardInfoItemValueEntrega: {
		fontSize: 11,
		fontWeight: '600',
		color: '#007bff'
	},
	pedidoCardInfoItemValuePrecio: {
		fontSize: 11,
		fontWeight: '600',
		color: '#28a745'
	},
	pedidoCardInfoItemValueFactura: {
		fontSize: 11,
		fontWeight: '600',
		color: '#6f42c1'
	},
	pedidoCardVehicleBox: {
		backgroundColor: '#e8f5e8',
		padding: 6,
		borderRadius: 6,
		marginTop: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	pedidoCardVehicleIcon: {
		fontSize: 12,
		color: '#28a745',
		marginRight: 8
	},
	pedidoCardVehicleContent: {
		flex: 1
	},
	pedidoCardVehicleLabel: {
		fontSize: 11,
		color: '#666',
		marginBottom: 2
	},
	pedidoCardVehicleValue: {
		fontSize: 12,
		fontWeight: '600',
		color: '#333'
	},

	//////////////////////////////////////////////////////////////////		
	///////////				HEADER TITLE STYLES
	//////////////////////////////////////////////////////////////////
	headerTitleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
		paddingHorizontal: 10
	},
	headerTitleLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	headerTitleWrapper: {
		flex: 1
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4
	},
	headerSubtitle: {
		fontSize: 12,
		color: '#666',
		fontWeight: '500'
	},
	headerButtonGroup: {
		flexDirection: 'row',
		gap: 8
	},

	//////////////////////////////////////////////////////////////////		
	///////////				EDITAR PEDIDO MODAL STYLES
	//////////////////////////////////////////////////////////////////
	editarModalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	editarModalContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		width: '100%',
		maxHeight: '90%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 10,
	},
	editarModalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
		backgroundColor: '#f8f9fa',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	editarModalHeaderContent: {
		flex: 1
	},
	editarModalHeaderTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	editarModalHeaderSubtitle: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalHashtagIcon: {
		fontSize: 12,
		color: '#007bff',
		marginRight: 4
	},
	editarModalPedidoId: {
		fontSize: 14,
		color: '#6c757d'
	},
	editarModalResetButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#ffc107',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	editarModalResetIcon: {
		fontSize: 16,
		color: '#fff'
	},
	editarModalCloseButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	editarModalCloseIcon: {
		fontSize: 18,
		color: '#666'
	},
	editarModalBody: {
		padding: 18
	},
	editarModalInfoCard: {
		backgroundColor: '#f8f9fa',
		padding: 14,
		borderRadius: 8,
		marginBottom: 14,
	},
	editarModalInfoCardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	editarModalInfoCardContent: {
		gap: 8
	},
	editarModalInfoRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalInfoIcon: {
		fontSize: 14,
		marginRight: 8,
		width: 20
	},
	editarModalInfoIconBlue: {
		color: '#007bff'
	},
	editarModalInfoIconGreen: {
		color: '#28a745'
	},
	editarModalInfoIconPurple: {
		color: '#6f42c1'
	},
	editarModalInfoIconRed: {
		color: '#dc3545'
	},
	editarModalInfoText: {
		fontSize: 14,
		color: '#333'
	},
	editarModalInfoTextBold: {
		fontWeight: '600'
	},
	editarModalAdditionalInfo: {
		gap: 6
	},
	editarModalAdditionalInfoText: {
		fontSize: 13,
		color: '#666'
	},
	editarModalAdditionalInfoIcon: {
		fontSize: 12,
		marginRight: 6
	},
	editarModalNavigateButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#007bff',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 6,
		marginTop: 8,
		alignSelf: 'flex-start'
	},
	editarModalNavigateIcon: {
		fontSize: 12,
		color: '#fff',
		marginRight: 6
	},
	editarModalNavigateText: {
		fontSize: 13,
		color: '#fff',
		fontWeight: '600'
	},
	editarModalEmergencyButton: {
		backgroundColor: '#dc3545',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		marginTop: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	editarModalEmergencyIcon: {
		fontSize: 12,
		color: '#fff',
		marginRight: 6
	},
	editarModalEmergencyText: {
		fontSize: 13,
		color: '#fff',
		fontWeight: '600'
	},
	editarModalEstadoSection: {
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		padding: 14,

		borderLeftWidth: 4,
		borderLeftColor: '#007bff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	editarModalEstadoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 14,
		textAlign: 'center'
	},
	editarModalEstadoActual: {
		backgroundColor: 'white',
		padding: 14,
		borderRadius: 10,
		marginBottom: 8,
		borderWidth: 1,
	},
	editarModalEstadoLabel: {
		fontSize: 14,
		color: '#666',
		marginBottom: 4
	},
	editarModalEstadoRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalEstadoIcon: {
		fontSize: 16,
		marginRight: 8
	},
	editarModalEstadoText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333'
	},
	editarModalEstadoLocked: {
		backgroundColor: '#e9ecef',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center'
	},
	editarModalEstadoLockedIcon: {
		fontSize: 20,
		color: '#6c757d',
		marginBottom: 8
	},
	editarModalEstadoLockedText: {
		color: '#6c757d',
		textAlign: 'center'
	},
	editarModalEstadoChangeButton: {
		backgroundColor: '#007bff',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	editarModalEstadoChangeIcon: {
		fontSize: 14,
		color: 'white',
		marginRight: 6
	},
	editarModalEstadoChangeText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600'
	},
	editarModalVehiculoSection: {
		marginBottom: 15
	},
	editarModalVehiculoAsignado: {
		backgroundColor: '#e8f5e8',
		padding: 12,
		borderRadius: 8,
		marginBottom: 15,
		borderLeftWidth: 4,
	},
	editarModalVehiculoNoAsignado: {
		backgroundColor: '#fff3cd',
		padding: 12,
		borderRadius: 8,
		marginBottom: 15,
		borderLeftWidth: 4,
	},
	editarModalVehiculoLabel: {
		fontSize: 10,
		color: '#666',
		marginBottom: 4
	},
	editarModalVehiculoRowAsignado: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalVehiculoIconAsignado: {
		fontSize: 14,
		marginRight: 8
	},
	editarModalVehiculoTextAsignado: {
		fontSize: 14,
		fontWeight: '500',
		color: '#333'
	},
	editarModalVehiculoRowNoAsignado: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalVehiculoIconNoAsignado: {
		fontSize: 16,
		color: '#856404',
		marginRight: 8
	},
	editarModalVehiculoTextNoAsignado: {
		fontSize: 14,
		color: '#856404'
	},
	editarModalVehiculoButton: {
		backgroundColor: '#28a745',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	editarModalVehiculoButtonIcon: {
		fontSize: 16,
		color: 'white',
		marginRight: 10
	},
	editarModalVehiculoButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	editarModalCancelarSection: {
		marginBottom: 20
	},
	editarModalCancelarWarning: {
		backgroundColor: '#f8d7da',
		padding: 12,
		borderRadius: 8,
		marginBottom: 15,
		borderLeftWidth: 4,
		borderLeftColor: '#dc3545'
	},
	editarModalCancelarWarningRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalCancelarWarningIcon: {
		fontSize: 16,
		color: '#721c24',
		marginRight: 8
	},
	editarModalCancelarWarningText: {
		fontSize: 14,
		color: '#721c24',
		flex: 1
	},
	editarModalCancelarButton: {
		backgroundColor: '#dc3545',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	editarModalCancelarButtonIcon: {
		fontSize: 16,
		color: 'white',
		marginRight: 10
	},
	editarModalCancelarButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	editarModalEntregadoContainer: {
		marginBottom: 20
	},
	editarModalEntregadoHeader: {
		alignItems: 'center',
		marginBottom: 12,
		paddingVertical: 12,
		backgroundColor: '#f8f9fa',
		borderRadius: 16,
		marginHorizontal: 12
	},
	editarModalEntregadoIconContainer: {
		backgroundColor: '#d4edda',
		borderRadius: 40,
		width: 45,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 12,
		shadowColor: '#28a745',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 4
	},
	editarModalEntregadoIcon: {
		fontSize: 28,
		color: '#28a745'
	},
	editarModalEntregadoTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#28a745',
		marginBottom: 6
	},
	editarModalEntregadoSubtitle: {
		fontSize: 13,
		color: '#666',
		textAlign: 'center'
	},
	editarModalImageSection: {
		marginBottom: 16,
		marginHorizontal: 16,
		alignItems: 'center'
	},
	editarModalImageTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 12,
		textAlign: 'center'
	},
	editarModalImageWrapper: {
		borderRadius: 12,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5,
		backgroundColor: '#fff'
	},
	editarModalImage: {
		width: 320,
		height: 200,
		borderRadius: 12
	},
	editarModalImageBadge: {
		backgroundColor: '#e8f5e8',
		borderRadius: 8,
		padding: 8,
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalImageBadgeIcon: {
		fontSize: 12,
		color: '#28a745',
		marginRight: 6
	},
	editarModalImageBadgeText: {
		color: '#28a745',
		fontSize: 12,
		fontWeight: '500'
	},
	editarModalCardsContainer: {
		marginHorizontal: 20,
		gap: 12
	},
	editarModalMainCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: '#28a745',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	editarModalMainCardRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12
	},
	editarModalMainCardTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333'
	},
	editarModalMainCardValue: {
		fontSize: 20,
		color: '#28a745',
		fontWeight: 'bold'
	},
	editarModalMainCardDivider: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#e9ecef'
	},
	editarModalMainCardLabel: {
		fontSize: 14,
		color: '#666'
	},
	editarModalFormaPagoBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 16
	},
	editarModalFormaPagoBadgeContado: {
		backgroundColor: '#e3f2fd'
	},
	editarModalFormaPagoBadgeCredito: {
		backgroundColor: '#e8f5e8'
	},
	editarModalFormaPagoText: {
		fontSize: 12,
		fontWeight: '600'
	},
	editarModalFormaPagoTextContado: {
		color: '#2196f3'
	},
	editarModalFormaPagoTextCredito: {
		color: '#4caf50'
	},
	editarModalDetailsCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	editarModalDetailsCardTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		marginBottom: 12,
		textAlign: 'center'
	},
	editarModalDetailsCardContent: {
		gap: 8
	},
	editarModalDetailsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 6
	},
	editarModalDetailsRowLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	editarModalDetailsIcon: {
		fontSize: 14,
		color: '#666',
		marginRight: 8
	},
	editarModalDetailsLabel: {
		fontSize: 13,
		color: '#666'
	},
	editarModalDetailsValue: {
		fontSize: 13,
		color: '#333',
		fontWeight: '600'
	},
	editarModalWarningCard: {
		backgroundColor: '#fff3cd',
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: '#ffc107'
	},
	editarModalWarningCardTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#856404',
		marginBottom: 8,
		textAlign: 'center'
	},
	editarModalWarningRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6
	},
	editarModalWarningLabel: {
		fontSize: 12,
		color: '#856404',
		flex: 1
	},
	editarModalWarningValue: {
		fontSize: 12,
		color: '#856404',
		fontWeight: '600',
		flex: 2,
		textAlign: 'right'
	},
	editarModalCerrarSection: {
		backgroundColor: '#f8f9fa',
		borderRadius: 10,
		padding: 16,
		marginTop: 20,
		borderLeftWidth: 4,
		borderLeftColor: '#28a745'
	},
	editarModalCerrarHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12
	},
	editarModalCerrarIcon: {
		fontSize: 18,
		color: '#28a745',
		marginRight: 10
	},
	editarModalCerrarTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333'
	},
	editarModalCerrarDescription: {
		fontSize: 14,
		color: '#666',
		marginBottom: 16,
		lineHeight: 20
	},
	editarModalCerrarButton: {
		backgroundColor: '#28a745',
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	editarModalCerrarButtonIcon: {
		fontSize: 16,
		color: 'white',
		marginRight: 10
	},
	editarModalCerrarButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},

	//////////////////////////////////////////////////////////////////		
	///////////				NAVIGATION MODAL STYLES
	//////////////////////////////////////////////////////////////////
	navModalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	navModalContainer: {
		backgroundColor: '#fff',
		borderRadius: 15,
		padding: 20,
		width: '90%',
		maxWidth: 350,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8
	},
	navModalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20
	},
	navModalTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#333'
	},
	navModalCloseButton: {
		backgroundColor: '#f8f9fa',
		borderRadius: 15,
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	navModalCloseIcon: {
		fontSize: 14,
		color: '#666'
	},
	navModalCoordBox: {
		backgroundColor: '#f8f9fa',
		padding: 12,
		borderRadius: 8,
		marginBottom: 20
	},
	navModalCoordText: {
		fontSize: 13,
		color: '#666',
		textAlign: 'center'
	},
	navModalCoordIcon: {
		marginRight: 6
	},
	navModalCoordNote: {
		fontSize: 11,
		color: '#999',
		fontStyle: 'italic'
	},
	navModalOptions: {
		gap: 12
	},
	navModalWazeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#00d4ff',
		padding: 15,
		borderRadius: 12,
		shadowColor: '#00d4ff',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 3
	},
	navModalGoogleButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#4285f4',
		padding: 15,
		borderRadius: 12,
		shadowColor: '#4285f4',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 3
	},
	navModalAppleButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#007aff',
		padding: 15,
		borderRadius: 12,
		shadowColor: '#007aff',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 3
	},
	navModalButtonIconBox: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 8,
		padding: 8,
		marginRight: 12
	},
	navModalButtonIcon: {
		fontSize: 20,
		color: '#fff'
	},
	navModalButtonContent: {
		flex: 1
	},
	navModalButtonTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff'
	},
	navModalButtonSubtitle: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.8)'
	},
	navModalButtonChevron: {
		fontSize: 14,
		color: 'rgba(255,255,255,0.7)'
	},
	navModalCancelButton: {
		backgroundColor: '#6c757d',
		padding: 15,
		borderRadius: 12,
		marginTop: 15,
		alignItems: 'center'
	},
	navModalCancelText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff'
	},

	//////////////////////////////////////////////////////////////////		
	///////////				MODAL ESTADISTICAS STYLES
	//////////////////////////////////////////////////////////////////
	modalEstadisticasOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalEstadisticasContainer: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		width: size.width * 0.95,
		maxHeight: '80%',
	},
	modalEstadisticasHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	modalEstadisticasTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
	},
	modalEstadisticasCloseButton: {
		padding: 5,
	},
	modalEstadisticasCloseIcon: {
		fontSize: 24,
		color: '#666',
	},
	modalEstadisticasFiltrosContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 15,
		gap: 8,
	},
	modalEstadisticasFiltroButton: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: '#f0f0f0',
		alignItems: 'center',
	},
	modalEstadisticasFiltroButtonActive: {
		backgroundColor: '#007bff',
	},
	modalEstadisticasFiltroText: {
		fontSize: 14,
		color: '#666',
		fontWeight: '500',
	},
	modalEstadisticasFiltroTextActive: {
		color: 'white',
		fontWeight: 'bold',
	},
	modalEstadisticasPeriodoLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#007bff',
		textAlign: 'center',
		marginBottom: 15,
	},
	modalEstadisticasTableWrapper: {
		maxHeight: 420,
	},
	modalEstadisticasScrollContainer: {
		maxHeight: 320,
	},
	modalEstadisticasHeaderRow: {
		flexDirection: 'row',
		backgroundColor: '#007bff',
		paddingVertical: 10,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		overflow: 'hidden',
	},
	modalEstadisticasSubHeaderRow: {
		flexDirection: 'row',
		backgroundColor: '#0056b3',
		paddingVertical: 8,
		overflow: 'hidden',
	},
	modalEstadisticasTablaHeaderCell: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 13,
		textAlign: 'center',
	},
	modalEstadisticasSubHeaderText: {
		color: 'white',
		fontSize: 11,
		textAlign: 'center',
		flex: 1,
	},
	modalEstadisticasTableBody: {
		flexDirection: 'row',
	},
	modalEstadisticasPlacaColumn: {
		width: 90,
	},
	modalEstadisticasHeaderScrollContainer: {
		flex: 1,
	},
	modalEstadisticasDataScrollContainer: {
		flex: 1,
	},
	modalEstadisticasPlacaRow: {
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		justifyContent: 'center',
		borderRightWidth: 2,
		borderRightColor: '#e0e0e0',
	},
	modalEstadisticasPlacaRowTotal: {
		backgroundColor: '#f8f9fa',
		borderTopWidth: 2,
		borderTopColor: '#007bff',
	},
	modalEstadisticasDataRow: {
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	modalEstadisticasDataRowTotal: {
		backgroundColor: '#f8f9fa',
		borderTopWidth: 2,
		borderTopColor: '#007bff',
	},
	modalEstadisticasTablaCell: {
		fontSize: 12,
		color: '#333',
		textAlign: 'center',
	},
	modalEstadisticasPlacaFixedContainer: {
		width: 90,
		backgroundColor: '#007bff',
		justifyContent: 'center',
		paddingVertical: 8,
		paddingHorizontal: 8,
		borderRightWidth: 2,
		borderRightColor: 'white',
	},
	modalEstadisticasPlacaFixed: {
		width: '100%',
		fontWeight: '600',
		color: '#333',
	},
	modalEstadisticasScrollableContent: {
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	modalEstadisticasTablaSectionWide: {
		width: 180,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	modalEstadisticasDataText: {
		fontSize: 10,
		flex: 1,
		flexWrap: 'nowrap',
	},
	modalEstadisticasCantidadCellWide: {
		width: 60,
	},
	modalEstadisticasTotalText: {
		fontWeight: 'bold',
		color: '#007bff',
	},
	modalEstadisticasLoadingContainer: {
		padding: 40,
		alignItems: 'center',
	},
	modalEstadisticasLoadingText: {
		marginTop: 10,
		color: '#666',
	},
	modalEstadisticasEmptyContainer: {
		padding: 40,
		alignItems: 'center',
	},
	modalEstadisticasEmptyIcon: {
		fontSize: 48,
		color: '#ccc',
		marginBottom: 10,
	},
	modalEstadisticasEmptyText: {
		color: '#666',
		textAlign: 'center',
	},
	// Estilos para vista de detalle de conductor
	modalEstadisticasDetalleHeaderRow: {
		flexDirection: 'row',
		backgroundColor: '#007bff',
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomWidth: 2,
		borderBottomColor: '#0056b3',
	},
	modalEstadisticasDetalleHeaderCell: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 12,
		textAlign: 'center',
	},
	modalEstadisticasDetalleScrollContainer: {
		maxHeight: 360,
	},
	modalEstadisticasDetalleRow: {
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	modalEstadisticasDetalleRowTotal: {
		backgroundColor: '#f8f9fa',
		borderTopWidth: 2,
		borderTopColor: '#007bff',
	},
	modalEstadisticasDetalleCell: {
		fontSize: 11,
		color: '#333',
		textAlign: 'center',
	},
	modalEstadisticasRemisionCell: {
		width: 60,
	},
	modalEstadisticasPedidoCell: {
		width: 60,
	},
	modalEstadisticasCodtCell: {
		width: 40,
	},
	modalEstadisticasKilosCell: {
		width: 70,
	},
	modalEstadisticasContadoCell: {
		width: 90,
	},
	modalEstadisticasValorCell: {
		width: 90,
	},
	// Estilos para vista por día
	modalEstadisticasPorDiaHeaderRow: {
		flexDirection: 'row',
		backgroundColor: '#007bff',
		paddingVertical: 6,
		paddingHorizontal: 4,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		borderBottomWidth: 2,
		borderBottomColor: '#0056b3',
	},
	modalEstadisticasPorDiaHeaderCell: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 11,
		textAlign: 'center',
	},
	modalEstadisticasPorDiaScrollContainer: {
		maxHeight: 360,
	},
	modalEstadisticasPorDiaRow: {
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 8,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	modalEstadisticasPorDiaCell: {
		fontSize: 11,
		color: '#333',
		textAlign: 'right',
	},
	modalEstadisticasFechaCell: {
		width: 100,
		fontWeight: '500',
		textAlign: 'center'
	},
	modalEstadisticasCantidadCell: {
		width: 80,
	},
	modalEstadisticasCreditoCell: {
		width: 110,
	},
})