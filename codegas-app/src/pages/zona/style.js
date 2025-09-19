import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingTop: Platform.OS === 'android' ? 10 : 45,
		alignItems: "center",
		justifyContent: 'center'
	},
	subContenedor: {
		marginBottom: 50,
		width: "95%",
	},

	//////////////////////////////////////////////////////////////////		
	///////////				CABEZERA
	//////////////////////////////////////////////////////////////////
	contenedorCabezera: {
		width: "90%",
		flexDirection: "row",
		marginTop: 10
	},
	subContenedorCabezera: {
	},
	inputCabezera: {
		fontFamily: "Comfortaa-Regular",
		position: "relative",
		zIndex: 0,
		width: "90%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor: "rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		paddingLeft: 10,
		marginBottom: 20,
		borderRadius: 5,
		height: 40
	},
	btnIconNuevo: {
		top: 10,
		left: 15
	},
	iconNuevo: {
		fontSize: 22
	},
	//////////////////////////////////////////////////////////////////		
	///////////				VEHICULOS
	//////////////////////////////////////////////////////////////////
	vehiculo: {
		flexDirection: "row",
		position: "relative",
		zIndex: 0,
		width: "97%",
		shadowColor: 'rgba(0,0,0, .8)', // IOS
		borderColor: "rgba(0,0,0,1)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .3, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 0, // Android
		paddingLeft: 10,
		marginBottom: 20,
		left: 5,
		borderRadius: 5,
	},
	vehiculoTexto: {
		fontFamily: "Comfortaa-Regular",
		flex: 1,
		justifyContent: "center",
		paddingRight: 10
	},
	btnVehiculo: {
		padding: 10
	},
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal: {
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
	subContenedorModal: {
		backgroundColor: "#ffffff",
		borderRadius: 7,
		padding: 10,
		alignItems: "center"
	},
	btnModalClose: {
		position: "absolute",
		right: 8,
		top: 8,
		zIndex: 100,
		backgroundColor: '#f8f9fa',
		borderRadius: 15,
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#e9ecef'
	},
	iconCerrar: {
		fontSize: 16,
		color: '#6c757d'
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	contenedorConductor: {
		flexDirection: "row",
		marginBottom: 5,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,.1)",
		padding: 5
	},
	conductor: {
		fontSize: 18,
		width: 200,
		top: 5
	},
	titulo: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 21,
		marginVertical: 15
	},

	//////////////////////////////////////////////////////////////////		
	///////////				NEW HEADER STYLES
	//////////////////////////////////////////////////////////////////
	headerContainer: {
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 0,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
		width: '100%',
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
		paddingHorizontal: 20
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4
	},
	headerSubtitle: {
		fontSize: 16,
		color: '#666',
		fontWeight: '500'
	},
	sortContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	sortButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginLeft: 8,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#e9ecef',
		backgroundColor: '#fff'
	},
	sortButtonActive: {
		backgroundColor: '#007bff',
		borderColor: '#007bff'
	},
	sortButtonText: {
		fontSize: 12,
		color: '#6c757d',
		fontWeight: '500'
	},
	sortButtonTextActive: {
		color: '#fff'
	},
	sortIcon: {
		fontSize: 10,
		color: '#fff',
		marginLeft: 4
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 10
	},
	inputField: {
		flex: 1,
		fontFamily: "Comfortaa-Regular",
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#e9ecef',
		fontSize: 16
	},
	addButton: {
		backgroundColor: '#007bff',
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center'
	},
	addButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16
	},
	addButtonIcon: {
		color: '#fff',
		fontSize: 16,
		marginRight: 5
	},
	zonaItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 5
	},
	zonaItemText: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 16
	},
	editButton: {
		padding: 8,
		marginRight: 3,
		backgroundColor: '#f8f9fa',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#e9ecef',
		minWidth: 35,
		height: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	editButtonIcon: {
		fontSize: 16,
		color: '#007bff'
	},
	deleteButton: {
		padding: 8,
		backgroundColor: '#f8f9fa',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#e9ecef',
		minWidth: 35,
		height: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	deleteButtonIcon: {
		fontSize: 16,
		color: '#dc3545'
	},
	modalInputField: {
		fontFamily: "Comfortaa-Regular",
		width: "90%",
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#e9ecef',
		fontSize: 16
	},
	modalButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%'
	},
	modalCancelButton: {
		backgroundColor: '#6c757d',
		borderRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 10
	},
	modalSaveButton: {
		backgroundColor: '#007bff',
		borderRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 10
	},
	modalButtonText: {
		color: '#fff',
		fontWeight: '600'
	},

})