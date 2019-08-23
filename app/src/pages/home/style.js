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
		backgroundColor: "#00218b",
		alignItems: 'center',
		width:size.width-20,
		marginBottom:20,
		borderRadius:10,
		paddingVertical:Platform.OS=='android' ?20 :50
	},
	icon:{
		color:"#ffffff",
		fontSize:45,
		paddingVertical:25
	},
	text:{
		color:"#ffffff",
		fontSize:30
	},
	btnUsuariosOnline:{
		backgroundColor:"#5cb85c",
		padding:20,
		borderRadius:10,
		marginBottom:20
	},
	textUsuariosOnline:{
		color:"#ffffff",
		fontSize:22
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
		alignItems:"center"
	},
	btnModalClose:{
		position:"absolute",
		right:Platform.OS=='android' ?-8 :3,
		top:Platform.OS=='android' ?-8 :2,
		zIndex:100
    },
    iconCerrar:{
        fontSize:22
	},
	tituloModal:{
		textAlign:"center",
		marginVertical:5,
		fontWeight: "bold"
	},	
	btnGuardar:{
		backgroundColor:"#00218b",
		padding:10,
			borderRadius:5,
			marginTop:25
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
	input:{
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