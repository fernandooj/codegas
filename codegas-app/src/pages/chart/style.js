import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";

let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
		paddingTop: Platform.OS === 'android' ? 10 : 35,
	},

	// Header styles
	header: {
		backgroundColor: '#ffffff',
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e9ecef',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},

	title: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 24,
		color: '#2c3e50',
		textAlign: 'center',
		marginBottom: 8,
	},

	subtitle: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 16,
		color: '#6c757d',
		textAlign: 'center',
	},

	// Content styles
	content: {
		flex: 1,
		paddingHorizontal: 10,
		paddingTop: 10,
	},

	// Chart styles
	chartContainer: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
		marginBottom: 10,
	},

	chartContent: {
		padding: 8,
		alignItems: 'center',
	},

	chartStyle: {
		marginVertical: 4,
		borderRadius: 16,
		paddingRight: 8,
	},

	// Loading styles
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		paddingVertical: 40,
	},

	loadingText: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 16,
		color: '#6c757d',
		marginTop: 16,
		textAlign: 'center',
	},

	// Error styles
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		paddingVertical: 40,
		paddingHorizontal: 20,
	},

	errorIcon: {
		fontSize: 48,
		marginBottom: 16,
	},

	errorTitle: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 20,
		color: '#dc3545',
		textAlign: 'center',
		marginBottom: 8,
	},

	errorMessage: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 14,
		color: '#6c757d',
		textAlign: 'center',
		lineHeight: 20,
	},

	// Empty state styles
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		paddingVertical: 40,
		paddingHorizontal: 20,
	},

	emptyIcon: {
		fontSize: 64,
		marginBottom: 20,
	},

	emptyTitle: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 20,
		color: '#495057',
		textAlign: 'center',
		marginBottom: 12,
	},

	emptyMessage: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 16,
		color: '#6c757d',
		textAlign: 'center',
		lineHeight: 24,
	},

	// Legacy styles for compatibility
	titulo: {
		fontFamily: "Comfortaa-Bold",
		textAlign: "center"
	},

	textNoEntregados: {
		fontFamily: "Comfortaa-Light",
		textAlign: "center",
		fontSize: 20,
		marginVertical: 20
	}
});