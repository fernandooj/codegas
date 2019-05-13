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
        backgroundColor:"rgba(56,164,264,.5)",
        alignSelf:"flex-start",
        marginLeft:10,
        marginVertical:2,
        borderRadius:5,
        padding:5
    },
    mensaje1:{
        
    },
    conMensaje2:{
        backgroundColor:"rgba(233,120,5,.5)",
        alignSelf:"flex-end",
        marginRight:10,
        marginVertical:2,
        borderRadius:5,
        padding:5
    },
    mensaje2:{

    },
    contenedorMensajes:{
       
        // minHeight:size.height,
        // borderWidth:10,
        flex:Platform.OS=='android' ?1 :.94
    },
    subContenedorMensajes:{
        marginBottom:8,
        minHeight:size.height-131,
        // borderWidth:10,
         
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
    /////////////////////////////////////////////
    //////////////////     FOOTER
    /////////////////////////////////////////////
    contenedorFooter:{
        flexDirection:"row",
        // position:"absolute",
        // bottom:0,
        // width:"100%"
    },
    input:{
        width:"85%",
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
    }
    
})