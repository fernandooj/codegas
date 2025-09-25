import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	// Container principal
	container: {
		backgroundColor: '#f8f9fa',
		flex: 1,
		marginTop: Platform.OS === "ios" ? 32 : 0,
	},

	// Header mejorado
	header: {
		backgroundColor: '#fff',
		paddingTop: 20,
		paddingBottom: 20,
		paddingHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef'
	},
	headerContent: {
		flexDirection: 'column',
		alignItems: 'center'
	},
	headerTextContainer: {
		marginBottom: 15,
		alignItems: 'center'
	},
	titulo: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#002587',
		textAlign: 'center',
		marginBottom: 5,
		fontFamily: 'Comfortaa-Bold'
	},
	subtitulo: {
		fontSize: 14,
		color: '#6c757d',
		textAlign: 'center',
		fontFamily: 'Comfortaa-Regular'
	},
	headerStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 10
	},
	statItem: {
		alignItems: 'center',
		flex: 1
	},
	statNumber: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#002587',
		fontFamily: 'Comfortaa-Bold'
	},
	statLabel: {
		fontSize: 12,
		color: '#6c757d',
		marginTop: 2,
		fontFamily: 'Comfortaa-Regular'
	},

	// Buscador mejorado
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		marginHorizontal: 15,
		marginVertical: 15,
		paddingHorizontal: 15,
		borderRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		borderColor: '#e9ecef'
	},
	searchIcon: {
		fontSize: 16,
		color: '#6c757d',
		marginRight: 10
	},
	searchInput: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#212529',
		fontFamily: 'Comfortaa-Regular'
	},
	clearButton: {
		padding: 5,
		marginLeft: 10
	},
	clearIcon: {
		fontSize: 14,
		color: '#6c757d'
	},

	// Lista mejorada
	scrollContainer: {
		flex: 1,
		paddingHorizontal: 15,
		marginBottom: 85
	},

	// Cards modernas
	cardContainer: {
		backgroundColor: '#fff',
		borderRadius: 12,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
		borderWidth: 1,
		borderColor: '#e9ecef',
		overflow: 'hidden'
	},
	cardContent: {
		padding: 20,
		flex: 1
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10
	},
	clienteName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#002587',
		flex: 1,
		fontFamily: 'Comfortaa-Bold'
	},
	codigoText: {
		fontSize: 14,
		color: '#6c757d',
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		fontFamily: 'Comfortaa-Regular'
	},
	razonSocial: {
		fontSize: 14,
		color: '#495057',
		fontStyle: 'italic',
		marginBottom: 15,
		fontFamily: 'Comfortaa-Regular'
	},
	cardDetails: {
		marginTop: 5
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	},
	detailIcon: {
		fontSize: 14,
		color: '#002587',
		width: 20,
		marginRight: 10
	},
	detailText: {
		fontSize: 14,
		color: '#495057',
		flex: 1,
		fontFamily: 'Comfortaa-Regular'
	},

	// Acciones de la card
	cardActions: {
		flexDirection: 'row',
		borderTopWidth: 1,
		borderTopColor: '#e9ecef',
		backgroundColor: '#f8f9fa'
	},
	actionButton: {
		flex: 1,
		paddingVertical: 15,
		alignItems: 'center',
		justifyContent: 'center',
		borderRightWidth: 1,
		borderRightColor: '#e9ecef'
	},
	deleteButton: {
		backgroundColor: '#fff5f5'
	},
	actionIcon: {
		fontSize: 18,
		color: '#002587'
	},
	deleteIcon: {
		color: '#dc3545'
	},

	// Estados vacíos
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
		paddingHorizontal: 40
	},
	emptyIcon: {
		fontSize: 48,
		color: '#dee2e6',
		marginBottom: 20
	},
	emptyText: {
		fontSize: 18,
		color: '#6c757d',
		textAlign: 'center',
		marginBottom: 10,
		fontFamily: 'Comfortaa-Regular'
	},
	emptySubtext: {
		fontSize: 14,
		color: '#adb5bd',
		textAlign: 'center',
		fontFamily: 'Comfortaa-Regular'
	},

	// Loading
	loadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20
	},
	loadingText: {
		marginLeft: 10,
		color: '#6c757d',
		fontFamily: 'Comfortaa-Regular'
	},

	// Modal styles
	modalContainer: {
		flex: 1,
		backgroundColor: '#f8f9fa'
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: 24,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#002587',
		fontFamily: 'Comfortaa-Bold'
	},
	closeButton: {
		padding: 12,
		borderRadius: 25,
		backgroundColor: '#f8f9fa',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2
	},
	closeIcon: {
		fontSize: 20,
		color: '#6c757d'
	},
	modalContent: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 20
	},

	// Client info
	clientInfoContainer: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 20,
		marginTop: 20,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	clientInfoTitle: {
		fontSize: 14,
		color: '#6c757d',
		marginBottom: 8,
		fontFamily: 'Comfortaa-Regular'
	},
	clientInfoName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#002587',
		marginBottom: 5,
		fontFamily: 'Comfortaa-Bold'
	},
	clientInfoRazon: {
		fontSize: 14,
		color: '#495057',
		fontStyle: 'italic',
		marginBottom: 5,
		fontFamily: 'Comfortaa-Regular'
	},
	clientInfoCodigo: {
		fontSize: 12,
		color: '#6c757d',
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		alignSelf: 'flex-start',
		fontFamily: 'Comfortaa-Regular'
	},

	// Form fields
	fieldContainer: {
		marginBottom: 25
	},
	fieldLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#002587',
		marginBottom: 12,
		fontFamily: 'Comfortaa-Bold'
	},
	fieldSubLabel: {
		fontSize: 14,
		color: '#6c757d',
		marginBottom: 15,
		fontFamily: 'Comfortaa-Regular'
	},
	textInput: {
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#e9ecef',
		fontFamily: 'Comfortaa-Regular'
	},

	// Radio buttons
	radioContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8
	},
	radioButton: {
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: '#e9ecef',
		marginBottom: 8,
		flex: 1,
		minWidth: 100
	},
	radioButtonSelected: {
		backgroundColor: '#e3f2fd',
		borderColor: '#2196f3'
	},
	radioText: {
		fontSize: 12,
		color: '#495057',
		textAlign: 'center',
		fontFamily: 'Comfortaa-Regular'
	},
	radioTextSelected: {
		color: '#2196f3',
		fontWeight: '600'
	},

	// Days selection
	daysContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 15
	},
	dayButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#e9ecef',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10
	},
	dayButtonSelected: {
		backgroundColor: '#2196f3',
		borderColor: '#2196f3'
	},
	dayText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#495057',
		fontFamily: 'Comfortaa-Bold'
	},
	dayTextSelected: {
		color: '#fff'
	},
	daySelectedText: {
		fontSize: 14,
		color: '#6c757d',
		fontStyle: 'italic',
		textAlign: 'center',
		fontFamily: 'Comfortaa-Regular'
	},
	quincenaContainer: {
		marginBottom: 20
	},
	quincenaLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#002587',
		marginBottom: 10,
		fontFamily: 'Comfortaa-Bold'
	},

	// Modal buttons
	modalButtons: {
		flexDirection: 'row',
		paddingVertical: 20,
		gap: 15
	},
	modalButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 15,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	cancelButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#e9ecef'
	},
	cancelButtonText: {
		fontSize: 16,
		color: '#6c757d',
		fontWeight: '600',
		fontFamily: 'Comfortaa-Bold'
	},
	saveButton: {
		backgroundColor: '#002587'
	},
	saveButtonText: {
		fontSize: 16,
		color: '#fff',
		fontWeight: '600',
		marginLeft: 8,
		fontFamily: 'Comfortaa-Bold'
	},
	saveButtonIcon: {
		fontSize: 16,
		color: '#fff'
	},

	// Preloading styles
	preloadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40
	},
	preloadingText: {
		fontSize: 18,
		color: '#002587',
		marginTop: 20,
		textAlign: 'center',
		fontWeight: '600',
		fontFamily: 'Comfortaa-Bold'
	},
	preloadingSubtext: {
		fontSize: 14,
		color: '#6c757d',
		marginTop: 10,
		textAlign: 'center',
		fontFamily: 'Comfortaa-Regular'
	}
})