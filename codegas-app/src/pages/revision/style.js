import { Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";

export const style = MediaQueryStyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f1f3f5'
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: Platform.OS === 'ios' ? 12 : 20,
		marginBottom: 18
	},
	headerCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 16,
		gap: 12,
		marginHorizontal: 20,
		shadowColor: 'rgba(0,0,0,0.05)',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 3
	},
	headerIcon: {
		fontSize: 28,
		color: '#002587'
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1c335f'
	},
	headerSubtitle: {
		fontSize: 13,
		color: '#6c757d',
		marginTop: 2
	},
	stepContent: {
		paddingHorizontal: 20,
		paddingBottom: 32,
		gap: 16
	},
	stepsWrapper: {
		flex: 1
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 18,
		gap: 16,
		shadowColor: 'rgba(0,0,0,0.05)',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 3
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1c335f'
	},
	cardDescription: {
		fontSize: 13,
		color: '#6c757d',
		lineHeight: 18
	},
	fieldsGrid: {
		gap: 12
	},
	inputGroup: {
		gap: 6
	},
	inputLabel: {
		fontSize: 13,
		fontWeight: '600',
		color: '#495057'
	},
	inputWrapper: {
		borderWidth: 1,
		borderColor: '#dee2e6',
		backgroundColor: '#fff',
		borderRadius: 12,
		marginBottom: 12,
		alignSelf: 'stretch',
		overflow: 'hidden'
	},
	input: {
		fontSize: 14,
		color: '#212529',
		paddingVertical: Platform.OS === 'ios' ? 12 : 10,
		paddingHorizontal: 16,
		backgroundColor: 'transparent',
		borderWidth: 0
	},
	selectorButton: {
		borderWidth: 1,
		borderColor: '#dee2e6',
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingVertical: Platform.OS === 'ios' ? 12 : 10,
		paddingHorizontal: 16,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	selectorValue: {
		fontSize: 14,
		color: '#1c335f',
		fontWeight: '600'
	},
	selectorPlaceholder: {
		fontSize: 14,
		color: '#adb5bd'
	},
	selectorIcon: {
		fontSize: 14,
		color: '#6c757d'
	},
	stepButton: {
		backgroundColor: '#002587',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center'
	},
	stepButtonText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '700'
	},
	stepButtonDisabled: {
		opacity: 0.4
	},
	stepButtonAlt: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ced4da',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12
	},
	stepButtonAltText: {
		color: '#495057',
		fontSize: 15,
		fontWeight: '600'
	},
	hiddenButton: {
		display: 'none'
	},
	fullWidth: {
		width: '100%'
	},
	selectedClientCard: {
		backgroundColor: '#f1f3ff',
		borderRadius: 16,
		padding: 16,
		gap: 12
	},
	selectedClientHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#002587',
		alignItems: 'center',
		justifyContent: 'center'
	},
	avatarIcon: {
		fontSize: 20,
		color: '#fff'
	},
	selectedClientName: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1c335f'
	},
	selectedClientSub: {
		fontSize: 13,
		color: '#495057'
	},
	changeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 12,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: '#ced4da',
		gap: 6
	},
	changeButtonIcon: {
		color: '#002587',
		fontSize: 16
	},
	changeButtonText: {
		color: '#002587',
		fontWeight: '700'
	},
	loading: {
		alignItems: 'center',
		gap: 8,
		paddingVertical: 16
	},
	loadingText: {
		color: '#495057',
		fontSize: 13
	},
	emptyState: {
		backgroundColor: '#f8f9fa',
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		gap: 8
	},
	emptyStateIcon: {
		fontSize: 28,
		color: '#adb5bd'
	},
	emptyStateTitle: {
		fontSize: 15,
		fontWeight: '700',
		color: '#495057'
	},
	emptyStateText: {
		fontSize: 13,
		color: '#6c757d',
		textAlign: 'center'
	},
	pointCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		gap: 12,
		marginBottom: 12,
		shadowColor: 'rgba(0,0,0,0.03)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 1,
		shadowRadius: 6,
		elevation: 2
	},
	pointCardSelected: {
		borderWidth: 2,
		borderColor: '#51cf66',
		backgroundColor: '#f1faf3'
	},
	pointHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12
	},
	pointIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#e7f5ff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	pointIconSymbol: {
		fontSize: 18,
		color: '#1c7ed6'
	},
	pointTitle: {
		fontSize: 15,
		fontWeight: '700',
		color: '#1c335f'
	},
	pointMeta: {
		fontSize: 13,
		color: '#495057'
	},
	pointSelectedIcon: {
		fontSize: 20,
		color: '#2b8a3e'
	},
	pointObservation: {
		fontSize: 12,
		color: '#6c757d'
	},
	modalContainer: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: Platform.OS === 'ios' ? 24 : 16,
		paddingHorizontal: 24,
		paddingBottom: Platform.OS === 'ios' ? 32 : 24
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1c335f'
	},
	modalCloseIcon: {
		fontSize: 22,
		color: '#adb5bd'
	},
	modalInput: {
		borderWidth: 1,
		borderColor: '#dee2e6',
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 14,
		backgroundColor: '#f8f9fa',
		color: '#212529',
		marginBottom: 16
	},
	modalItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f3f5'
	},
	modalAvatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#eef2ff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalAvatarIcon: {
		color: '#002587',
		fontSize: 16
	},
	modalItemTitle: {
		fontSize: 15,
		fontWeight: '700',
		color: '#1c335f'
	},
	modalItemSub: {
		fontSize: 13,
		color: '#495057'
	},
	pickerModalContainer: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: Platform.OS === 'ios' ? 24 : 16,
		paddingHorizontal: 24,
		paddingBottom: Platform.OS === 'ios' ? 32 : 24
	},
	pickerOption: {
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f3f5',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	pickerOptionSelected: {
		backgroundColor: '#e7f5ff'
	},
	pickerOptionText: {
		fontSize: 15,
		color: '#1c335f'
	},
	pickerOptionTextSelected: {
		fontWeight: '700'
	},
	pickerOptionIconSelected: {
		fontSize: 16,
		color: '#002587'
	},
	pickerCancelButton: {
		marginTop: 16,
		alignItems: 'center'
	},
	pickerCancelText: {
		fontSize: 15,
		fontWeight: '600',
		color: '#002587'
	}
})