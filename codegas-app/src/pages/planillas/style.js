import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";

let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container: {
        backgroundColor: '#f8f9fa',
        flex: 1,
        marginTop: Platform.OS === "ios" ? 32 : 0,
    },
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
        borderBottomColor: '#e9ecef',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#002587',
        fontFamily: 'Comfortaa-Bold'
    },
    addButton: {
        backgroundColor: '#002587',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8
    },
    addIcon: {
        fontSize: 16,
        color: '#fff'
    },
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
        paddingVertical: 10,
        fontSize: 14,
        color: '#333'
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 15
    },
    loader: {
        marginTop: 50
    },
    emptyText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 16,
        marginTop: 50
    },
    errorText: {
        textAlign: 'center',
        color: '#dc3545',
        fontSize: 16,
        marginTop: 50
    },
    // Planilla item styles
    planillaItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    planillaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    planillaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#002587',
        flex: 1
    },
    planillaActions: {
        flexDirection: 'row',
        gap: 10
    },
    actionButton: {
        padding: 5
    },
    actionIcon: {
        fontSize: 18,
        color: '#6c757d'
    },
    planillaContent: {
        marginTop: 10
    },
    planillaText: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 5
    },
    // Pedidos section
    pedidosSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#002587',
        marginBottom: 10
    },
    pedidoItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    pedidoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        flex: 0,
        flexShrink: 1
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#002587'
    },
    closeIcon: {
        fontSize: 24,
        color: '#6c757d'
    },
    modalBody: {
        padding: 20
    },
    // Form styles
    formContainer: {
        padding: 20
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    saveButton: {
        backgroundColor: '#002587',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    // Gastos styles
    gastosSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    gastosHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    gastosButton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    gastosIcon: {
        fontSize: 14,
        color: '#fff',
        marginRight: 5
    },
    gastosButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    gastosTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#002587',
        marginTop: 10
    },
    gastosFormContainer: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef'
    },
    gastoForm: {
        marginBottom: 20
    },
    gastoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    gastoInfo: {
        flex: 1
    },
    gastoConcepto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5
    },
    gastoValor: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: '600'
    },
    gastoActions: {
        flexDirection: 'row',
        gap: 10
    },
    gastoActionButton: {
        padding: 5
    },
    gastoActionIcon: {
        fontSize: 16,
        color: '#6c757d'
    }
});

