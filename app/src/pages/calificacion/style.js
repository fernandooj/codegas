import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		backgroundColor:'#ffffff',
		flex:1,
        marginTop:15,
        justifyContent:"center"
    },
    subContenedor:{
        flex:1,
    },
    contenedorCalificacion:{
        flexDirection:"row",
        justifyContent:"center"
    },
    titulo:{
        textAlign:"center",
        marginTop:25,
        marginBottom:20,
        fontSize:22
    },
    btnCalificacion:{
        backgroundColor:"#d9e008",
        borderRadius:20,
        width:10,
        paddingVertical:10,
        paddingHorizontal:15,
        marginHorizontal:7
    },
    textCalificacion:{
        color:"#ffffff"
    },  
    inputCabezera:{
		paddingVertical:10,
		paddingLeft:10,
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		marginBottom:15,
		borderRadius:5,
        textAlignVertical:"center",
        marginLeft:35,
        marginVertical:40,
        width:size.width-70,
        height:200
    },
    textUsers:{
        width:"100%",
        fontSize:17
    },
    btnGuardar:{
		backgroundColor:"#00218b",
		padding:10,
        borderRadius:5,
        marginTop:25,
        width:"50%",
        left:"25%",
        alignItems:"center"
    },
    btnGuardarDisable:{
		backgroundColor:"grey",
		padding:10,
		borderRadius:5,
		marginTop:25
	},
	textGuardar:{
		color:"#ffffff"
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            VER CALIFICACIONES
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    textCalificacion:{
        width:"50%"
    },
    contenedorCalificacion:{
		paddingVertical:10,
        paddingLeft:10,
        width:size.width-30,
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
        marginLeft:15,
        marginTop:7,
		marginBottom:10,
		borderRadius:5,
		textAlignVertical:"center",
    },
})