import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
 
let size = Dimensions.get('window').width;
 
export const style = MediaQueryStyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#ffffff',
	},	 
	containerRegistro:{
		flex:1,
		width:"100%",
		marginTop:Platform.OS==='android' ?110 :140
	},
	subContainerRegistro:{
		flex:1,
		alignItems: 'center',
	},
	tituloRegresar:{
		fontFamily: "Comfortaa-Light",
		textAlign:"center",
		fontSize:22,
		marginTop:30,
	},
    //////////////////////////////////////////////////////////////////
    //////////////////////      REGISTRO
	//////////////////////////////////////////////////////////////////
	btnIconPassLogin:{
		padding:22,
		position:"absolute",
		right:-10,
		top:-12
	},
	iconPass:{
		fontSize:25
	},
    input:{
        width:"85%",
		paddingVertical:10,
		height:45,
		paddingLeft:10,
		fontFamily: "Comfortaa-Light",
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .2)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		marginLeft:10,
		marginBottom:15,
		borderRadius:5,
		textAlignVertical:"center",
	},
	inputInvalid:{
		borderWidth:1,
        borderColor:"rgba(255, 0, 0, 0.22)"
    },
    titulo:{
		fontFamily: "Comfortaa-Light",
		fontSize:22,
		marginVertical:20
	},
	btnGuardar:{
		backgroundColor:"#00218b",
		paddingTop:Platform.OS==='android' ?6 :10,
		paddingBottom:10,
		paddingHorizontal:20,
		borderRadius:5
	},
	textGuardar:{
		fontFamily: "Comfortaa-Light",
		color:"#ffffff"
	},
  
})