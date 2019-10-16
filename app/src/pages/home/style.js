import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		flex:1,
		alignItems: 'center',
		backgroundColor:'#ffffff',
		justifyContent:"center"
	},
	btn:{
		flexDirection:"row",
		alignItems: 'center',
		width:size.width-20,
	
		borderRadius:10,
		paddingVertical:Platform.OS=='android' ?20 :50
	},
	icon:{
		width:80,
		height:80,
		marginRight:20,
		marginLeft:30
	},
	text:{
		fontFamily: "Comfortaa-Regular",
		color:"#002587",
		fontSize:26
	},
	fondoOnline:{
		width:340,
		paddingLeft:70
	},
	btnUsuariosOnline:{
		padding:20,
		borderRadius:10,
		marginBottom:20,
	},
	textUsuariosOnline:{
		fontFamily: "Comfortaa-Light",
		color:"#ffffff",
		fontSize:16,
		top:8,
		left:10
	},
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal:{
		position:Platform.OS=='android' ?null :"absolute",
		alignItems:"center",
		// justifyContent: 'center',
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
		top:100,
		width:size.width-80,
		alignItems:"center"
	},
	btnModalClose:{
		position:"absolute",
		right:Platform.OS=='android' ?1 :3,
		top:Platform.OS=='android' ?-1 :2,
		zIndex:100
    },
	iconCerrar:{
		fontSize:30
	},
	tituloModal:{
		fontFamily: "Comfortaa-Bold",
		textAlign:"center",
		marginVertical:5,
		fontWeight: "bold"
	},	
	tituloModal2:{
		fontFamily: "Comfortaa-Regular",
		textAlign:"center",
		marginBottom:10
	},
	btnGuardar:{
		backgroundColor:"#00218b",
		alignItems:"center",
		padding:10,
		borderRadius:5,
		marginTop:25
  },
  btnGuardarDisable:{
		backgroundColor:"grey",
		alignItems:"center",	
		padding:10,
		borderRadius:5,
		marginTop:25
	},
	textGuardar:{
		fontFamily: "Comfortaa-Bold",
		color:"#ffffff"
	},
	input:{
		fontFamily: "Comfortaa-Regular",
		width:size.width-100,
		backgroundColor:"#ffffff",
		borderColor:"rgba(90,90,90,.3)",
		borderWidth:1,
		height:40,
		borderRadius:5,
		borderTopLeftRadius:5,
		borderTopRightRadius:5,
		padding:10,
		margin:8
    },
})