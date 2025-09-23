import { StyleSheet, Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let { width, height } = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    containerNuevo: {
        marginBottom: 70,
        flex: 1,
    },
    cabezera: {
        width: '70%',
        height: 130,
        alignSelf: 'center'
    },
    subContainerNuevo: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    //////////////////////////////////////////////////////////////////
    //////////////////////      FORMA DE LLENAR
    //////////////////////////////////////////////////////////////////
    contenedorMonto: {
        borderColor: "#ffcc00",
        borderWidth: 3,
        borderTopWidth: 0,
        width: "90%",
        borderRadius: 30,
        padding: 20,
        marginTop: 25,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 4,
    },
    tituloForm: {
        fontFamily: "Comfortaa-Bold",
        textAlign: "center",
        color: "#00218b",
        backgroundColor: "#fff",
        width: 280,
        fontSize: 22,
        top: -35,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2,
    },
    btnFormaLlenar: {
        flexDirection: "row",
        padding: 5,
    },
    textForma: {
        fontFamily: "Comfortaa-Bold",
        color: "#00218b",
        fontSize: 19,
        width: "70%",
    },
    icon: {
        width: 50,
        height: 31,
        marginRight: 15
    },
    iconCheck: {
        color: "#00218b",
        fontSize: 22
    },
    input: {
        width: "90%",
        paddingVertical: 10,
        height: 45,
        paddingLeft: 10,
        fontFamily: "Comfortaa-Light",
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        borderColor: "rgba(0,0,0,0)",
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 5, //IOS
        backgroundColor: '#fff',
        elevation: 7, // Android
        marginLeft: 10,
        marginVertical: 15,
        borderRadius: 5,
        textAlignVertical: "center",
    },
    inputInvalid: {
        fontFamily: "Comfortaa-Light",
        borderColor: "red"
    },
    titulo: {
        fontFamily: "Comfortaa-Bold",
        fontSize: 22
    },
    btnEnviar: {
        marginVertical: 25,
        width: 120,
        height: 60,
        borderRadius: 12,
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 4,
    },
    btnGuardar: {
        flexDirection: "row",
        backgroundColor: "#00218b",
        padding: 15,
        borderRadius: 12,
        marginTop: 25,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: 'rgba(0,33,139, .3)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .4,
        shadowRadius: 4,
        elevation: 4,
        minHeight: 48,
    },
    btnGuardarDisable: {
        backgroundColor: "#6c757d",
        flexDirection: "row",
        padding: 15,
        borderRadius: 12,
        marginTop: 25,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: 'rgba(108,117,125, .3)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .4,
        shadowRadius: 4,
        elevation: 4,
        minHeight: 48,
    },
    textGuardar: {
        fontFamily: "Comfortaa-Light",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: '600'
    },
    textGuardarDisable: {
        fontFamily: "Comfortaa-Light",
        color: "#999",
        fontSize: 16,
        fontWeight: '600'
    },
    iconGuardar: {
        marginRight: 8,
        color: "white",
        fontSize: 18
    },
    iconGuardarDisable: {
        marginRight: 8,
        color: "#999",
        fontSize: 18
    },
    //////////////////////////////////////////////////////////////////
    //////////////////////      FRECUENCIA
    ////////////////////////////////////////////////////////////////// 
    nuevaFrecuencia: {
        flexDirection: "row",
        backgroundColor: "#ffcc00",
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(255,204,0, .3)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .4,
        shadowRadius: 4,
        elevation: 4,
        minHeight: 48,
    },
    eliminarFrecuencia: {
        flexDirection: "row",
        backgroundColor: "#dc3545",
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(220,53,69, .3)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .4,
        shadowRadius: 4,
        elevation: 4,
        minHeight: 48,
    },
    iconFrecuencia: {
        color: "#00218b",
        marginRight: 8,
        fontSize: 16
    },
    contenedorFrecuencia: {
        flexDirection: "row",
    },
    btnFrecuencia: {
        marginHorizontal: 5,
        width: 120,
        height: 50,
    },
    modalSelectorStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00218b',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    modalSelectorText: {
        fontFamily: "Comfortaa-Regular",
        fontSize: 16,
        color: '#00218b',
        textAlign: 'center',
    },
    modalSelectorList: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00218b',
        maxHeight: 200,
    },
    modalSelectorItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalSelectorItemText: {
        fontFamily: "Comfortaa-Regular",
        fontSize: 16,
        color: '#00218b',
        textAlign: 'center',
    },
    inputNovedades: {
        width: "88%",
        paddingVertical: 10,
        height: 80,
        paddingLeft: 10,
        borderWidth: 1,
        fontFamily: "Comfortaa-Light",
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        borderColor: "rgba(0,0,0,.5)",
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 5, //IOS
        backgroundColor: '#fff',
        elevation: 7, // Android
        marginLeft: 10,
        marginVertical: 15,
        borderRadius: 5,
        textAlignVertical: "center",
    },

    btnZona: {
        flexDirection: "row",
        width: width - 20,
        borderColor: 'rgba(0,0,0, .2)',
        padding: 10,
        borderWidth: 1,
        marginBottom: 2,
        borderRadius: 5
    },
    textZona: {
        fontFamily: "Comfortaa-Light",
        width: width - 150,
        fontSize: 12,
        alignItems: "flex-start",
    },


    //////////////////////////////////////////////////////////////////		
    ///////////				MODAL
    //////////////////////////////////////////////////////////////////
    contenedorModal: {
        position: Platform.OS == 'android' ? null : "absolute",
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "rgba(0,0,0,.5)",
        height: height,
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
        right: Platform.OS == 'android' ? 0 : -8,
        top: Platform.OS == 'android' ? 0 : -8,
        zIndex: 100
    },
    iconCerrar: {
        fontSize: 22
    },

    //////////////////////////////////////////////////////////////////		
    ///////////				MODAL 
    //////////////////////////////////////////////////////////////////
    contenedorModalCliente: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "rgba(0,0,0,.5)",
        height,
        zIndex: 100,
        width: "100%",
        bottom: 50,
        top: 0,
        left: 0,
        padding: 40,
    },
    subContenedorModalCliente: {
        backgroundColor: "#ffffff",
        borderRadius: 7,
        padding: 20,
        alignItems: "center"
    },

    btnModalClose: {
        position: "absolute",
        right: Platform.OS == 'android' ? 3 : -10,
        top: Platform.OS == 'android' ? 0 : -10,
        zIndex: 100
    },
    iconCerrar: {
        fontSize: 30
    },
    buscarCliente: {
        backgroundColor: "#002587",
        alignItems: "center",
        width: 45,
        height: 50,
        top: 5,
        paddingVertical: 11
    },
    inputStep2: {
        fontFamily: "Comfortaa-Regular",
        borderColor: "rgba(20,20,20,.1)",
        textAlign: "left",
        borderWidth: 1,
        width: width / 1.7,
        marginVertical: 5,
        paddingVertical: 10,
        fontSize: 10,
    },
    iconSearch: {
        color: "#ffffff",
        fontSize: 22
    },
    contenedorUsers: {
        borderColor: "rgba(0,0,0,.1)",
        padding: 10,
        borderWidth: 1,
        marginVertical: 5
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        MODAL STYLES
    /////////////////////////////////////////////////////////////////
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: '80%',
        width: '95%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00218b',
        fontFamily: "Comfortaa-Bold",
    },
    modalCloseButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2,
    },
    modalCloseIcon: {
        color: "#6c757d"
    },
    modalSearchContainer: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#f8f9fa',
    },
    modalSearchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2,
    },
    modalSearchInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        fontFamily: "Comfortaa-Regular",
    },
    modalSearchButton: {
        backgroundColor: '#00218b',
        borderRadius: 10,
        margin: 4,
        paddingHorizontal: 15,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalSearchIcon: {
        color: '#fff',
        fontSize: 16
    },
    modalContent: {
        flex: 1,
        minHeight: 200,
        backgroundColor: '#ffffff',
    },
    modalScrollView: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    modalEmptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        backgroundColor: '#ffffff',
    },
    modalEmptyIcon: {
        color: '#e9ecef',
        marginBottom: 16,
    },
    modalEmptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        fontFamily: "Comfortaa-Bold",
        marginBottom: 8,
    },
    modalEmptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        fontFamily: "Comfortaa-Regular",
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        backgroundColor: '#f8f9fa',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    modalCancelButton: {
        backgroundColor: '#6c757d',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: "Comfortaa-Bold",
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        CLIENTE CARD STYLES
    /////////////////////////////////////////////////////////////////
    clienteCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 6,
        marginHorizontal: 4,
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    clienteCardInactive: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
    },
    clienteCardContent: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
    },
    clienteAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#00218b',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    clienteAvatarInactive: {
        backgroundColor: '#dc3545',
    },
    clienteAvatarIcon: {
        color: '#fff',
    },
    clienteAvatarIconInactive: {
        color: '#fff',
    },
    clienteInfo: {
        flex: 1,
    },
    clienteRazonSocial: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00218b',
        marginBottom: 4,
        fontFamily: "Comfortaa-Bold",
    },
    clienteNombre: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
        fontFamily: "Comfortaa-Regular",
    },
    clienteCodt: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
        fontFamily: "Comfortaa-Light",
    },
    clienteTextInactive: {
        color: '#721c24',
    },
    clienteStatusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    clienteStatusBadgeActive: {
        backgroundColor: '#d4edda',
    },
    clienteStatusBadgeInactive: {
        backgroundColor: '#f8d7da',
    },
    clienteStatusText: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: "Comfortaa-Bold",
    },
    clienteStatusTextActive: {
        color: '#155724',
    },
    clienteStatusTextInactive: {
        color: '#721c24',
    },
    clienteArrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    clienteArrowIcon: {
        color: '#00218b',
    },
    clienteArrowIconInactive: {
        color: '#dc3545',
    },

    /////////////////////////////////////////////////////////////////
    ////////////////////        PUNTOS ENTREGA STYLES
    /////////////////////////////////////////////////////////////////
    puntosEntregaContainer: {
        width: '90%',
        marginTop: 20,
    },
    puntosEntregaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00218b',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: "Comfortaa-Bold",
    },
    puntoEntregaCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginVertical: 8,
        padding: 15,
        shadowColor: 'rgba(0,0,0, .1)',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: .3,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#e9ecef',
    },
    puntoEntregaCardSelected: {
        borderColor: '#00218b',
        backgroundColor: '#f0f4ff',
    },
    puntoEntregaCardSingle: {
        borderColor: '#28a745',
        backgroundColor: '#f8fff9',
    },
    puntoEntregaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    puntoEntregaIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00218b',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    puntoEntregaIconSelected: {
        backgroundColor: '#28a745',
    },
    puntoEntregaIconImage: {
        color: '#fff',
        fontSize: 18,
    },
    puntoEntregaInfo: {
        flex: 1,
    },
    puntoEntregaDireccion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        fontFamily: "Comfortaa-Bold",
    },
    puntoEntregaCapacidad: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
        fontFamily: "Comfortaa-Regular",
    },
    puntoEntregaObservacion: {
        fontSize: 13,
        color: '#999',
        fontStyle: 'italic',
        fontFamily: "Comfortaa-Light",
    },
    puntoEntregaCheckContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    puntoEntregaCheckIcon: {
        color: '#28a745',
        fontSize: 24,
    },
    puntoEntregaBadge: {
        backgroundColor: '#28a745',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    puntoEntregaBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: "Comfortaa-Bold",
    }

})