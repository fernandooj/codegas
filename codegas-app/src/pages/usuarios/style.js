import { Dimensions, Platform } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";

const size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        marginTop: Platform.OS === "ios" ? 5 : 0,
        alignItems: "center"
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00218b',
        textAlign: 'center',
        marginTop: Platform.OS === "ios" ? 5 : 0,
        marginBottom: 10,
        fontFamily: "Comfortaa-Regular",
        paddingHorizontal: 20
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
        height: Platform.OS === "ios" ? 35 : 35,
        fontFamily: "Comfortaa-Regular",
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
        color: 'white',
        fontSize: 16,
    },
    contenedorUsers: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0,0,0, 0.1)',
        borderColor: "rgba(0,0,0,0)",
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginLeft: 5,
        marginTop: 8,
        borderRadius: 12,
        textAlignVertical: "center",
        width: "97%",
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    textUsers: {
        fontFamily: "Comfortaa-Regular",
        width: "100%",
        fontSize: 13,
        margin: 0,
        lineHeight: 16
    },
    iconCerrar: {
        fontSize: 25
    },
    textAccesoPadre: {
        fontFamily: "Comfortaa-Bold",
        fontSize: 14,
        color: "#00218b",
        fontWeight: 'bold'
    },
    textAccesoHijo: {
        fontFamily: "Comfortaa-Regular",
        fontSize: 13,
        color: "#333"
    },
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
});
