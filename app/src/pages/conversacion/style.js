import { Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		flex:1 ,
        marginTop: Platform.OS=='android' ?5 :45,
        alignItems:"center"
    },
    subContainer:{
        marginBottom:55
    },
    titulo:{
        fontSize:28,
        marginBottom:8
    },
    containerSpinner:{
        alignItems: 'center',
		backgroundColor:'#ffffff',
        justifyContent:"center",
        flex:1 ,
    },
    subContenedorActivo:{
        backgroundColor:"rgba(61, 180, 17, 0.3)",
        flexDirection:"row",
        marginTop:10,
        padding:10,
        borderRadius:7,
    },
    subContenedorInActivo:{
        backgroundColor:"rgba(236, 19, 10, 0.2)",
        flexDirection:"row",
        marginTop:10,
        padding:10,
        borderRadius:7,
    },
    subContenedorConversacion:{
        flexDirection:"row",
    },
    contenedorTexto:{
        width:"90%"
    },
    btnRight:{
        justifyContent:"center"
    },
    iconRight:{
        fontSize:20
    }
})