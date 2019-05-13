import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		backgroundColor:'#ffffff',
		flex:1,
		marginTop:15,
    },
    titulo:{
        fontSize:18,
        marginTop:8,
        marginLeft:"6%",
    },
    
	btnNacimiento:{
        alignItems:"center",
        borderColor:"rgba(0,0,0,.2)",
        borderWidth:1,
        borderRadius:7,
        padding:5,
        marginLeft:"6%",
        width:"25.3%",
    },
    btnInput:{
        alignItems:"center",
        borderColor:"rgba(0,0,0,.2)",
        borderWidth:1,
        borderRadius:7,
        padding:5,
        marginHorizontal:"6%",
        width:"88%",
        marginTop:30
    },
    inputRequired:{
		borderColor:"rgba(255, 0, 0, 0.19)",
		borderWidth:1,
		borderRadius:7
	},
    separador:{
        marginVertical:10,
        marginHorizontal:"6%",
        width:"88%",
    },
    contenedorChip:{
        flexDirection: 'row',
    	flexWrap: 'wrap',
        alignItems:"center",
        width:"86%",
        left:"4%",
        marginVertical:10
    },
    btnInfo:{
        margin:5,
        borderRadius:10,
        backgroundColor:"rgba(0,0,0,.5)",
        flexDirection:"row",
        padding:6
    },
    iconDelete:{
        fontSize:14,
        marginHorizontal:5,
        color:"#ffffff"
    },
    textInfo:{
        color:"#ffffff"
    },
    tituloContrasena:{
        marginTop:20,
        fontSize:22,
        textAlign:"center"
    },
    input:{
        borderColor:"rgba(0,0,0,.2)",
        backgroundColor:"#ffffff",
        borderWidth:1,
        marginHorizontal:"6%",
        width:"88%",
        height:50,
        marginTop:10,
        marginBottom:10,
        borderRadius:5,
        paddingLeft:10
    },
    /////////////////////////////////////////////////////////////////
    ////////////////////        PICKER
    /////////////////////////////////////////////////////////////////
    inputIOS: {
        borderColor:"rgba(0,0,0,.2)",
        backgroundColor:"#ffffff",
        color:"#000000",
        marginHorizontal:"6%",
        borderWidth:1,
        width:"88%",
        height:50,
        marginTop:10,
        marginBottom:10,
        borderRadius:5,
        paddingLeft:10
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor:"rgba(0,0,0,.2)",
        borderRadius: 8,
        width:"88%",
        paddingRight: 30, // to ensure the text is never behind the icon
    },
})