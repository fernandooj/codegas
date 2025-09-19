import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    titulo: {
        fontFamily: "Comfortaa-Bold",
        textAlign: "center",
        fontSize: 20,
        marginTop: 12,
        marginBottom: 5,
        marginLeft: "6%",
    },
    btnNacimiento: {
        alignItems: "center",
        borderColor: "rgba(0,0,0,.2)",
        borderWidth: 1,
        borderRadius: 7,
        padding: 5,
        marginLeft: "6%",
        width: "25.3%",
    },
    btnInput: {
        fontFamily: "Comfortaa-Regular",
        alignItems: "center",
        borderColor: "rgba(0,0,0,.2)",
        borderWidth: 1,
        borderRadius: 7,
        padding: 5,
        marginHorizontal: "6%",
        width: "88%",
        marginTop: 30
    },
    inputRequired: {
        borderColor: "rgba(255, 0, 0, 0.19)",
        borderWidth: 1,
        borderRadius: 7
    },
    separador: {
        marginVertical: 10,
        marginHorizontal: "6%",
        width: "88%",
    },
    contenedorChip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center",
        width: "86%",
        left: "4%",
        marginVertical: 10
    },
    btnInfo: {
        margin: 5,
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,.5)",
        flexDirection: "row",
        padding: 6
    },
    iconDelete: {
        fontSize: 14,
        marginHorizontal: 5,
        color: "#ffffff"
    },
    textInfo: {
        fontFamily: "Comfortaa-Regular",
        color: "rgba(80,80,80,.9)",
        left: 26,
        top: 10
    },
    tituloContrasena: {
        fontFamily: "Comfortaa-Regular",
        marginTop: 20,
        fontSize: 22,
        textAlign: "center"
    },
    input: {
        fontFamily: "Comfortaa-Regular",
        borderColor: "rgba(0,0,0,.2)",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        marginHorizontal: "6%",
        width: "88%",
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10
    },
    inputVeo: {
        fontFamily: "Comfortaa-Regular",
        borderColor: "rgba(0,0,0,.2)",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        marginHorizontal: "6%",
        width: "88%",
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10
    },
    inputZona: {
        fontFamily: "Comfortaa-Regular",
        borderColor: "rgba(0,0,0,.2)",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        marginHorizontal: "6%",
        width: size.width / 2,
        height: 40,
        padding: 0,

        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10
    },
    textVeo: {
        fontFamily: "Comfortaa-Regular",
        top: 15,
        color: "#000"
    },
    btnGuardar: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#00218b",
        padding: 10,
        borderRadius: 5,
        width: size.width / 2,
        left: size.width / 3.5,
        marginBottom: 5,
        marginTop: 20
    },
    textGuardar: {
        fontFamily: "Comfortaa-Regular",
        color: "#ffffff"
    },
    iconCargando: {
        color: "#ffffff"
    },
    btnUbicacion: {
        justifyContent: "center",
        borderColor: "rgba(0,0,0,.2)",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        marginHorizontal: "6%",
        width: "88%",
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10
    },
    contenedorPerfil: {
        //marginTop:Platform.OS==='android' ?100 :110,
        marginBottom: 70
    },
    /////////////////////////////////////////////////////////////////
    ////////////////////        PICKER
    /////////////////////////////////////////////////////////////////
    tipo: {
        borderColor: "rgba(0,0,0,.2)",
        backgroundColor: "#ffffff",
        color: "#000000",
        marginHorizontal: "6%",
        borderWidth: 1,
        width: "88%",
        height: 50,
        paddingTop: Platform.OS === 'android' ? 0 : 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10
    },

    //////////////////////////////////////////////////////////////////		
    ///////////				MODAL UBICACION
    //////////////////////////////////////////////////////////////////
    modal: {
        position: Platform.OS === 'android' ? "relative" : "relative",
        backgroundColor: "#ffffff",
        top: -150,
        zIndex: 100,
        width: size.width,
        height: size.height,
    },
    subContenedorModal: {
        backgroundColor: "#e3e3e3",
        marginHorizontal: 12,
        marginTop: 40,
        marginBottom: 125,
        width: "90%"
    },
    tituloModal: {
        fontFamily: "Comfortaa-Regular",
        margin: 10
    },
    titulo1: {
        fontFamily: "Comfortaa-Regular",
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
    btnModalClose: {
        position: "absolute",
        right: 3,
        top: 3
    },
    iconCerrar: {
        fontSize: 30
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
        width: 50
    },
    contenedorAdd: {
        alignItems: "center",
        marginVertical: 10
    },
    btnAdd: {
        backgroundColor: "#00218b",
        padding: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    iconAdd: {
        color: "#ffffff"
    },
    separador: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,.05)",
        height: 2,
    },
    asterisco: {
        color: "red",
        position: "absolute",
        right: 10,
        top: 30
    },
    btnEliminar: {
        position: "absolute",
        left: "44%",
        bottom: 2,
        padding: 10
    },
    iconEliminar: {
        fontSize: 20,
        color: "red"
    },
    //////////////////////////////////////////////////////////////////		
    ///////////				MODAL  ZONA
    //////////////////////////////////////////////////////////////////
    modalZona: {
        position: Platform.OS == 'android' ? null : "relative",
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
        height: size.height - 150,
        alignItems: "center"
    },
    btnModalClose: {
        position: "absolute",
        right: -8,
        top: -8,
        zIndex: 100
    },
    btnZona: {
        flexDirection: "row",
        borderColor: "rgba(0,0,0,.2)",
        backgroundColor: "#ffffff",
        borderWidth: 1,

        width: size.width / 2,
        marginVertical: 5,
        borderRadius: 5,
        paddingLeft: 10,
        paddingVertical: 10
    },
    textZona: {
        fontFamily: "Comfortaa-Regular",
        fontSize: 14,
        width: 130
    },
    btnGuardarUbicacion: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#00218b",
        padding: 10,
        borderRadius: 5,
        width: size.width - 85,
        left: 20,
        marginBottom: 50,
        marginTop: 20
    },
    inputIOS: {
        fontFamily: "Comfortaa-Regular",
        color: 'black',
    },
    inputAndroid: {
        fontFamily: "Comfortaa-Regular",
        color: 'black',
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        HEADER MODERNO
    /////////////////////////////////////////////////////////////////
    headerContainer: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        FORM CONTAINER
    /////////////////////////////////////////////////////////////////
    formContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 100
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        FIELD STYLES
    /////////////////////////////////////////////////////////////////
    fieldContainer: {
        marginBottom: 20
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    fieldInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2,
    },
    fieldInputError: {
        borderColor: '#dc3545'
    },
    fieldInputRequired: {
        borderColor: '#dc3545'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        SELECTOR STYLES
    /////////////////////////////////////////////////////////////////
    selectorContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    selectorText: {
        fontSize: 16,
        color: '#333',
        flex: 1
    },
    selectorIcon: {
        marginLeft: 8
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODERN SELECTOR STYLES
    /////////////////////////////////////////////////////////////////
    modernSelectorContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e9ecef',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 3,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 56,
    },
    modernSelectorSelected: {
        borderColor: '#007bff',
        shadowColor: 'rgba(0,123,255, .15)',
    },
    modernSelectorSelectedGreen: {
        borderColor: '#28a745',
        shadowColor: 'rgba(40,167,69, .15)',
    },
    modernSelectorText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '400',
        flex: 1
    },
    modernSelectorTextSelected: {
        color: '#007bff',
        fontWeight: '600'
    },
    modernSelectorTextSelectedGreen: {
        color: '#28a745',
        fontWeight: '600'
    },
    modernSelectorSecondaryText: {
        fontSize: 12,
        color: '#007bff',
        marginTop: 2
    },
    modernSelectorSecondaryTextGreen: {
        fontSize: 12,
        color: '#28a745',
        marginTop: 2
    },
    modernSelectorIconContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    modernSelectorIconContainerSelected: {
        backgroundColor: '#007bff',
        borderColor: '#007bff'
    },
    modernSelectorIconContainerSelectedGreen: {
        backgroundColor: '#28a745',
        borderColor: '#28a745'
    },
    modernSelectorIcon: {
        color: '#666'
    },
    modernSelectorIconSelected: {
        color: '#fff'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        ACTION BUTTONS
    /////////////////////////////////////////////////////////////////
    actionButtonsContainer: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .4,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonDeactivate: {
        backgroundColor: "#dc3545",
        shadowColor: 'rgba(220,53,69, .3)',
    },
    actionButtonActivate: {
        backgroundColor: "#28a745",
        shadowColor: 'rgba(40,167,69, .3)',
    },
    actionButtonDelete: {
        backgroundColor: "#dc3545",
        shadowColor: 'rgba(220,53,69, .3)',
    },
    actionButtonIcon: {
        marginRight: 8
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MAIN BUTTONS
    /////////////////////////////////////////////////////////////////
    mainButtonsContainer: {
        marginTop: 30,
        marginBottom: 20
    },
    primaryButton: {
        backgroundColor: '#00218b',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 4,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    primaryButtonLoading: {
        marginRight: 8
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        SECONDARY BUTTONS
    /////////////////////////////////////////////////////////////////
    secondaryButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 12
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .4,
        shadowRadius: 4,
        elevation: 4,
    },
    secondaryButtonCharts: {
        backgroundColor: '#fd7e14',
        shadowColor: 'rgba(253,126,20, .3)',
    },
    secondaryButtonReview: {
        backgroundColor: '#007bff',
        shadowColor: 'rgba(0,123,255, .3)',
    },
    secondaryButtonIcon: {
        marginRight: 8
    },
    secondaryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODAL STYLES
    /////////////////////////////////////////////////////////////////
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalOverlayZona: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 2000
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        maxHeight: '90%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    modalCloseButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    modalCloseIcon: {
        color: "#6c757d"
    },
    modalContent: {
        maxHeight: 400
    },
    modalContentPadding: {
        padding: 20
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODAL ZONAS
    /////////////////////////////////////////////////////////////////
    zonaSearchContainer: {
        padding: 20,
        paddingBottom: 10
    },
    zonaSearchInput: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333'
    },
    zonaListContainer: {
        maxHeight: 300
    },
    zonaItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    zonaItemSelected: {
        backgroundColor: '#e3f2fd'
    },
    zonaItemText: {
        fontSize: 16,
        color: '#333',
        flex: 1
    },
    zonaItemCheck: {
        color: "#2196f3"
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef'
    },
    modalFooterRow: {
        flexDirection: 'row'
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        borderRadius: 8,
        padding: 15,
        marginRight: 10
    },
    modalSaveButton: {
        flex: 1,
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 15
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        UBICACION MODAL
    /////////////////////////////////////////////////////////////////
    ubicacionCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    ubicacionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10
    },
    ubicacionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1
    },
    ubicacionDeleteButton: {
        backgroundColor: '#dc3545',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ubicacionDeleteIcon: {
        color: "#fff"
    },
    ubicacionFieldContainer: {
        marginBottom: 15
    },
    ubicacionFieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5
    },
    ubicacionFieldInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333'
    },
    ubicacionSelector: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ubicacionSelectorText: {
        fontSize: 14,
        color: '#333',
        flex: 1
    },
    ubicacionSelectorIcon: {
        color: "#666"
    },
    addUbicacionButton: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    addUbicacionIcon: {
        marginRight: 8
    },
    addUbicacionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        FORM PASS
    /////////////////////////////////////////////////////////////////
    formPassContainer: {
        marginBottom: 70
    },
    passwordMismatchButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    passwordMismatchText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        VEO SELECTOR STYLES
    /////////////////////////////////////////////////////////////////
    veoContainer: {
        marginBottom: 20
    },
    veoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    veoSelector: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e9ecef',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 3,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 56,
    },
    veoSelectorSelected: {
        borderColor: '#28a745',
        shadowColor: 'rgba(40,167,69, .15)',
    },
    veoSelectorContent: {
        flex: 1
    },
    veoSelectorText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '400'
    },
    veoSelectorTextSelected: {
        color: '#28a745',
        fontWeight: '600'
    },
    veoSelectorSecondaryText: {
        fontSize: 12,
        color: '#28a745',
        marginTop: 2
    },
    veoSelectorIconContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    veoSelectorIconContainerSelected: {
        backgroundColor: '#28a745',
        borderColor: '#28a745'
    },
    veoSelectorIcon: {
        color: '#666'
    },
    veoSelectorIconSelected: {
        color: '#fff'
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODAL VEO STYLES
    /////////////////////////////////////////////////////////////////
    modalVeoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalVeoContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        maxHeight: '90%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    modalVeoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    modalVeoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    modalVeoSearchContainer: {
        padding: 20,
        paddingBottom: 10
    },
    modalVeoSearchInput: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333'
    },
    modalVeoList: {
        maxHeight: 400
    },
    modalVeoEmptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalVeoEmptyIcon: {
        marginBottom: 16
    },
    modalVeoEmptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    modalVeoEmptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8
    },
    veoItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    veoItemSelected: {
        backgroundColor: '#e3f2fd'
    },
    veoItemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    veoItemPrefix: {
        color: '#2196f3',
        marginRight: 8
    },
    veoItemTextContainer: {
        flex: 1
    },
    veoItemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'normal'
    },
    veoItemTextSelected: {
        fontWeight: 'bold'
    },
    veoItemSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
    },
    veoItemActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    veoItemUsersIcon: {
        marginRight: 8
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        UPDATE BUTTON STYLES
    /////////////////////////////////////////////////////////////////
    updateUserContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    updateUserButton: {
        backgroundColor: '#00218b',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 4,
    },
    updateUserButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    updateUserButtonLoading: {
        marginRight: 8
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        SCROLL VIEW STYLES
    /////////////////////////////////////////////////////////////////
    scrollViewContainer: {
        flex: 1
    },
    scrollViewContentContainer: {
        paddingBottom: 20
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODAL ZONA OVERLAY STYLES
    /////////////////////////////////////////////////////////////////
    modalZonaOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
    },
    modalZonaContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        maxHeight: '80%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    modalZonaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    modalZonaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    modalZonaCloseButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    modalZonaCloseIcon: {
        color: "#6c757d"
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODAL UBICACION OVERLAY STYLES
    /////////////////////////////////////////////////////////////////
    modalUbicacionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalUbicacionContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        maxHeight: '90%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    modalUbicacionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    modalUbicacionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    modalUbicacionCloseButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    modalUbicacionCloseIcon: {
        color: "#6c757d"
    },
    modalUbicacionContent: {
        maxHeight: 400
    },
    modalUbicacionScrollView: {
        maxHeight: 400
    },
    modalUbicacionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        LAT/LNG CONTAINER STYLES
    /////////////////////////////////////////////////////////////////
    latLngContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10
    },
    latLngFieldContainer: {
        flex: 1
    }

})