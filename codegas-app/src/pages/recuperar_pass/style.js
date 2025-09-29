import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";

let size = Dimensions.get('window').width;

export const style = MediaQueryStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	backgroundImage: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	headerContainer: {
		paddingTop: Platform.OS === 'ios' ? 20 : 10,
		paddingHorizontal: 20,
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	formContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 40,
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 40,
	},
	titleIcon: {
		fontSize: 48,
		color: '#00218b',
		marginBottom: 16,
	},
	title: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 28,
		color: '#00218b',
		textAlign: 'center',
		marginBottom: 12,
	},
	subtitle: {
		fontFamily: "Comfortaa-Light",
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		lineHeight: 22,
		paddingHorizontal: 20,
	},
	inputContainer: {
		width: '100%',
		marginBottom: 30,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: '#e0e0e0',
	},
	inputIcon: {
		fontSize: 18,
		color: '#666',
		marginRight: 12,
	},
	input: {
		flex: 1,
		height: 56,
		fontFamily: "Comfortaa-Regular",
		fontSize: 16,
		color: '#333',
		paddingVertical: 0,
	},
	inputInvalid: {
		borderColor: '#ff4444',
		backgroundColor: '#fff5f5',
	},
	errorText: {
		fontFamily: "Comfortaa-Light",
		fontSize: 14,
		color: '#ff4444',
		marginTop: 8,
		marginLeft: 4,
	},
	submitButton: {
		backgroundColor: '#00218b',
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 24,
		width: '100%',
		shadowColor: '#00218b',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
		marginBottom: 20,
	},
	submitButtonDisabled: {
		backgroundColor: '#ccc',
		shadowOpacity: 0,
		elevation: 0,
	},
	submitButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	submitButtonIcon: {
		fontSize: 18,
		color: '#ffffff',
		marginRight: 8,
	},
	submitButtonText: {
		fontFamily: "Comfortaa-Bold",
		fontSize: 16,
		color: '#ffffff',
		textAlign: 'center',
	},
	loadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingIcon: {
		fontSize: 18,
		color: '#ffffff',
		marginRight: 8,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
	},
	backButtonIcon: {
		fontSize: 16,
		color: '#666',
		marginRight: 8,
	},
	backButtonText: {
		fontFamily: "Comfortaa-Regular",
		fontSize: 16,
		color: '#666',
	},
})