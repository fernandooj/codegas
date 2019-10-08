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
		marginTop:Platform.OS==='android' ?100 :120,
		marginBottom:65
	},
	subContainerRegistro:{
		flex:1,
		alignItems: 'center',
	},
	separador:{
		height:1,
		width:"80%",
		left:"10%",
		marginTop:0,
		backgroundColor:"rgba(0,0,0,.1)"
	},
	iconAvatar:{
		fontSize:50,
		color:"#00218b"
	},
	containerRegistro2:{
		flex:1,
		width:"100%",
		marginTop:30,
		marginBottom:30
	},
	 
	//////////////////////////////////////////////////////////////////
    //////////////////////      CABEZERA
    //////////////////////////////////////////////////////////////////
	perfilContenedor:{
		flexDirection:"row",
		borderBottomColor:"rgba(0,0,0,.2)",
		borderBottomWidth:1,
		paddingVertical:15,
	},
	columna1:{
		alignItems:"center",
		justifyContent:"center",
		width:"40%"
	},
	btnLista:{
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center",
		borderBottomColor:"rgba(0,0,0,.2)",
		borderBottomWidth:1,
		padding:0
	},
	txtLista:{
		width:"77%",
		fontSize:20,
		left:20
	},
	avatar:{
		width:60,
		height:60,
		borderRadius:30
	},
	nombre:{
		fontSize:17
	},
	icon:{
		width:90,
		height:90
	},
    //////////////////////////////////////////////////////////////////
    //////////////////////      INPUTS
    //////////////////////////////////////////////////////////////////
    input:{
        width:"85%",
		paddingVertical:10,
		height:45,
		paddingLeft:10,
		borderWidth:1,
		// fontFamily:"quicksand-medium",
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		borderColor:"rgba(0,0,0,.2)",
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
        borderColor:"rgba(255, 0, 0, 0.42)"
    },
    titulo:{
		color:"#002587",
		fontSize:22,
		marginBottom:20,
	},
	btnGuardar:{
		flexDirection:"row",
		backgroundColor:"#00218b",
		padding:10,
		paddingHorizontal:20,
		borderRadius:20
	},
	textGuardar:{
		color:"#ffffff"
	},
	iconCargando:{
		color:"#ffffff"
	},
	btnOlvidar:{
		marginVertical:25
	},
	textOlvidar:{
		color:"#00218b"
	},

	tituloRegresar:{
		textAlign:"center",
		fontSize:22,
		marginTop:30,
	}
})