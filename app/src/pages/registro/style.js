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
    //////////////////////////////////////////////////////////////////
    //////////////////////      REGISTRO
    //////////////////////////////////////////////////////////////////
    input:{
        width:"85%",
		paddingVertical:10,
		height:45,
		paddingLeft:10,
		// fontFamily:"quicksand-medium",
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
		fontSize:22,
		marginBottom:20
	},
	btnGuardar:{
		backgroundColor:"#00218b",
		padding:10,
		borderRadius:5
	},
	textGuardar:{
		color:"#ffffff"
	},
  
})