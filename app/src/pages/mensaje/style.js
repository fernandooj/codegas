import { Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		flex:1 ,
    },
    containerSpinner:{
        alignItems: 'center',
		backgroundColor:'#ffffff',
        justifyContent:"center",
        flex:1 ,
    },
    conMensaje1:{
        alignSelf:"flex-start",
        paddingVertical:2
    },
    mensaje1:{
        backgroundColor:"rgba(56,164,264,.5)",
        marginLeft:10,
        marginVertical:1,
        padding:8,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        borderColor:"rgba(0,0,0,0)",
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 5, //IOS
        elevation: Platform.OS==='android' ?1 :7, // Android
        borderRadius:5,
    },
    conMensaje2:{
        alignSelf:"flex-end",
        marginRight:5,
        paddingVertical:2
    },
    mensaje2:{
        backgroundColor:"rgba(233,120,5,.5)",
        marginLeft:10,
        marginVertical:1,
        padding:8,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        borderColor:"rgba(0,0,0,0)",
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 5, //IOS
        elevation: Platform.OS==='android' ?1 :7, // Android
        borderRadius:5,
    },
    contenedorImagen1:{
        marginLeft:10,
        marginVertical:2,
        padding:10,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        borderColor:"rgba(0,0,0,0)",
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: .5, // IOS
        shadowRadius: 5, //IOS
        elevation: Platform.OS==='android' ?1 :7, // Android
        borderRadius:5,
    },
    contenedorMensajes:{
        flex:Platform.OS=='android' ?1 :.94
    },
    subContenedorMensajes:{
        flex:1,
        marginBottom:8,
        minHeight:size.height-161, 
    },
    textoUnirse:{
        textAlign:"center",
        fontSize:11,
        marginVertical:10
    },

    /////////////////////////////////////////////
    //////////////////     CABEZERA
    /////////////////////////////////////////////
    contenedorCabezera:{
        backgroundColor:"rgba(255,255,255,1)",
        borderBottomWidth:1,
        borderBottomColor:"rgba(90,90,90,.3)",
        paddingTop:Platform.OS=='android' ?5 :25,
        flexDirection:"row",
        paddingBottom:7,
        position:"relative",
        zIndex:100
    },
    contenedorAvatar:{
        marginHorizontal:20,
    },
    avatar:{
        width:50,
        height:50,
        borderRadius:25
    },
    titulo:{
        fontSize:22
    },
    iconCabezera:{
        color:"#0071bb",
        fontSize:21,
        left:5,
        top:15
    },
    nombre:{
        width:"55%",
        fontSize:22,
        top:10
    },
    iconUser:{
        color:"#0071bb",
        fontSize:24,
        left:5,
        top:12,
        paddingTop:0,
        paddingBottom:20,
        paddingHorizontal:0
    },
    btnCerrar:{
        flexDirection:"row",
        backgroundColor:"#0071bb",
        justifyContent:"center",
        paddingVertical:5,
        paddingHorizontal:8,
        height:30,
        top:12,
        borderRadius:5
    },
    textCerrar:{
        color:"#fff"
    },
    /////////////////////////////////////////////
    //////////////////     FOOTER
    /////////////////////////////////////////////
    contenedorFooter:{
        flexDirection:"row",
    },
    contenedorFooter2:{
        flexDirection:"row",
        position:"absolute",
        width:"100%",
        bottom:-305
    },
    input:{
        width:"75%",
        backgroundColor:"#ffffff",
        borderColor:"rgba(90,90,90,.3)",
        borderWidth:1,
        height:40,
        borderRadius:10,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        padding:0,
        bottom:5,
        left:5
    },
    btnEnviar:{
        left:2,
        top:-5,
        padding:10
    },
    icon:{
        color:"#0071bb",
        fontSize:20,
    },
    //////////////////////////////////////////////////////////////////		
    ///////////				MODAL
    //////////////////////////////////////////////////////////////////
    contenedorModal:{
		position:Platform.OS=='android' ?null :"absolute",
		alignItems:"center",
		justifyContent: 'center',
		backgroundColor:"rgba(0,0,0,.5)",
		height:size.height,
		zIndex:100,
		width:"100%",
		bottom:50,
		top:0,
		left:0,	
	},
	subContenedorModal:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:10,
        alignItems:"center",
        
	},
	btnModalClose:{
		top:0,
		zIndex:100
	},
	iconCerrar:{
        fontSize:35,
        color:"#ffffff",
	},
    
})