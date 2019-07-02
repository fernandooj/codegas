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
		marginTop:Platform.OS==='android' ?10 :20
	},
	subContainerRegistro:{
		flex:1,
		alignItems: 'center',
	},
	separador:{
		height:1,
		width:"80%",
		left:"10%",
		marginTop:20,
		backgroundColor:"rgba(0,0,0,.1)"
	},
	iconAvatar:{
		fontSize:50,
		color:"#00218b"
	},
	//////////////////////////////////////////////////////////////////
    //////////////////////      CABEZERA
    //////////////////////////////////////////////////////////////////
	perfilContenedor:{
		flexDirection:"row",
		borderBottomColor:"rgba(0,0,0,.5)",
		borderBottomWidth:1,
		paddingVertical:15,
		marginBottom:10
	},
	columna1:{
		alignItems:"center",
		justifyContent:"center",
		width:"40%"
	},
	btnLista:{
		flexDirection:"row",
		borderBottomColor:"rgba(0,0,0,.2)",
		borderBottomWidth:1,
		padding:15
	},
	txtLista:{
		width:"90%",
		fontSize:20
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
		fontSize:20
	},
    //////////////////////////////////////////////////////////////////
    //////////////////////      INPUTS
    //////////////////////////////////////////////////////////////////
    input:{
        width:"85%",
		paddingVertical:10,
		height:45,
		paddingLeft:10,
		// fontFamily:"quicksand-medium",
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
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
        borderColor:"rgba(255, 0, 0, 0.42)"
    },
    titulo:{
		fontSize:22,
		marginBottom:20
	},
	btnGuardar:{
		flexDirection:"row",
		backgroundColor:"#00218b",
		padding:10,
		borderRadius:5
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