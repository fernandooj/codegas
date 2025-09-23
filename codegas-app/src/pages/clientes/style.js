import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
		flex: 1,
		marginTop: Platform.OS === "ios" ? 50 : 0,
		alignItems: "center",
		paddingTop: Platform.OS === "ios" ? 20 : 0
	},
	titulo: {
		textAlign: "center",
		marginTop: Platform.OS === "ios" ? 1 : 8,
		marginBottom: 15,
		fontSize: 20,
		fontFamily: "Comfortaa-Regular",
		color: "#00218b",
		fontWeight: "bold",
		paddingHorizontal: 20
	},
	contenedorUsers: {
		paddingVertical: 10,
		paddingLeft: 10,
		backgroundColor: '#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		borderColor: "rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 5, // Android
		marginLeft: 5,
		marginTop: 10,
		borderRadius: 5,
		textAlignVertical: "center",
		width: "97%"
	},
	textUsers: {
		fontFamily: "Comfortaa-Regular",
		width: "100%",
		fontSize: 13,
		margin: 0,
		lineHeight: 16
	},
	textAccesoPadre: {
		fontWeight: 'bold',
		fontSize: 14,
		color: '#007bff'
	},
	textAccesoHijo: {
		fontSize: 13,
		color: '#333'
	},
	inputCabezera: {
		position: "relative",
		zIndex: 0,
		width: "80%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor: "rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		paddingLeft: 10,
		elevation: 4,
		marginBottom: 10,
		borderTopLeftRadius: 7,
		borderBottomLeftRadius: 7,
		paddingVertical: 2,
		height: Platform.OS === "ios" ? 35 : 35
	},
	iconCerrar: {
		fontSize: 25
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
	// Header styles
	headerContainer: {
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 0,
		paddingTop: Platform.OS === 'ios' ? 10 : 5,
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
	headerTitleContainer: {
		flex: 1
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
	revisionButton: {
		backgroundColor: '#00218b',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		shadowColor: 'rgba(0,0,0, .4)',
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: .5,
		shadowRadius: 5,
		elevation: 4,
	},
	revisionButtonText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600'
	},
	// Search bar styles
	searchContainer: {
		flexDirection: "row",
		paddingHorizontal: 20,
		alignItems: 'center'
	},
	searchInputContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: '#fff',
		borderRadius: 8,
		shadowColor: 'rgba(0,0,0, .4)',
		shadowOffset: { height: 2, width: 2 },
		shadowOpacity: .5,
		shadowRadius: 5,
		elevation: 4,
		borderWidth: 1,
		borderColor: '#e9ecef'
	},
	searchInput: {
		flex: 1,
		paddingLeft: 12,
		paddingVertical: 10,
		fontSize: 16,
		color: '#333'
	},
	clearButton: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	clearIcon: {
		color: '#666',
		fontSize: 16
	},
	searchButton: {
		backgroundColor: "#002587",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	searchIcon: {
		color: 'white',
		fontSize: 16,
	},
	// User card styles
	userCardInactive: {
		backgroundColor: "#fff5f5",
		borderLeftColor: "#dc3545",
		borderLeftWidth: 4,
		opacity: 0.8,
		borderWidth: 1,
		borderColor: "#ffcdd2"
	},
	userCardActive: {
		backgroundColor: "white",
		borderLeftColor: "transparent",
		borderLeftWidth: 0,
		opacity: 1,
		borderWidth: 0,
		borderColor: "transparent"
	},
	userTouchable: {
		flexDirection: "row"
	},
	userContentContainer: {
		width: "85%"
	},
	inactiveIndicator: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4
	},
	inactiveIcon: {
		fontSize: 12,
		color: '#dc3545',
		marginRight: 4
	},
	inactiveText: {
		fontSize: 10,
		color: '#dc3545',
		fontWeight: 'bold',
		fontFamily: "Comfortaa-Regular"
	},
	userNameInactive: {
		color: '#6c757d',
		textDecorationLine: 'line-through'
	},
	userEmail: {
		fontSize: 14,
		color: '#666'
	},
	userEmailInactive: {
		color: '#adb5bd'
	},
	badgeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
		flexWrap: 'wrap'
	},
	badgeAccess: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
		marginRight: 8,
		marginBottom: 4
	},
	badgeAccessActive: {
		backgroundColor: '#007bff'
	},
	badgeAccessInactive: {
		backgroundColor: '#adb5bd'
	},
	badgeAccessText: {
		color: 'white',
		fontSize: 10,
		fontWeight: 'bold',
		fontFamily: "Comfortaa-Regular"
	},
	badgeStatus: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 4
	},
	badgeStatusActive: {
		backgroundColor: '#d4edda'
	},
	badgeStatusInactive: {
		backgroundColor: '#f8d7da'
	},
	badgeStatusTextActive: {
		color: '#155724',
		fontSize: 9,
		fontWeight: 'bold',
		fontFamily: "Comfortaa-Regular"
	},
	badgeStatusTextInactive: {
		color: '#721c24',
		fontSize: 9,
		fontWeight: 'bold',
		fontFamily: "Comfortaa-Regular"
	},
	badgePrice: {
		backgroundColor: '#28a745',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 4
	},
	badgePriceText: {
		color: 'white',
		fontSize: 9,
		fontWeight: 'bold',
		fontFamily: "Comfortaa-Regular"
	},
	userPhone: {
		fontSize: 12,
		marginTop: 2
	},
	userPhoneInactive: {
		color: '#adb5bd'
	},
	userParent: {
		fontSize: 12,
		color: '#666',
		marginTop: 2
	},
	userParentInactive: {
		color: '#adb5bd'
	},
	userActionContainer: {
		justifyContent: "center",
		alignItems: 'center',
		width: '15%'
	},
	childrenBadge: {
		backgroundColor: '#007bff',
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 4
	},
	childrenBadgeText: {
		color: 'white',
		fontSize: 10,
		fontWeight: 'bold'
	},
	arrowIcon: {
		fontSize: 20
	},
	arrowIconInactive: {
		color: '#adb5bd'
	},
	// Loading and empty states
	loadingContainer: {
		padding: 20,
		alignItems: 'center'
	},
	emptyStateContainer: {
		padding: 20,
		alignItems: 'center'
	},
	emptyStateText: {
		fontSize: 16,
		color: '#666'
	},
	scrollView: {
		marginBottom: 85
	},
	// Floating button styles
	floatingButton: {
		position: 'absolute',
		bottom: 100,
		right: 20,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#00218b',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	floatingButtonIcon: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
}, {
	"@media (min-device-height: 812)": {
		floatingButton: {
			bottom: 110,
		},
	},
})