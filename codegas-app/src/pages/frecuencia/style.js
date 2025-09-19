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
		paddingBottom: 15,
		paddingHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef'
	},
	titulo: {
		fontSize: 24,
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
	}
})