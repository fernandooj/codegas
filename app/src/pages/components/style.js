import { Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
const size = Dimensions.get('window');
console.log(size)
export const style = MediaQueryStyleSheet.create({
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			CABEZERA
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			FOOTER
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	contenedorFooter:{
		backgroundColor: "#00218b",
		alignItems:"center",
		flexDirection:"row",
		position:"absolute",
		bottom:0,
		width:"100%",
		left:0,
		height:50,
		paddingVertical:10,
	},
	subContenedorFooter:{
		width:"25.0%"
	},
	// subContenedorFooter2:{
	// 	width:"24.5%"
	// },
	icon:{
		color:"#ffffff",
		textAlign:"center",
		fontSize:22,
	},
	textFooter:{
		textAlign:"center",
		color:"#ffffff",
		fontSize:14
	},
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			LOGIN
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			TOMAR FOTO
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	contenedorPortada:{
		alignItems:"center"
	},
	contenedorUploadPortada:{
		backgroundColor:"#0071bb",
		alignItems:"center",
		paddingVertical:15,
		borderRadius:10,
		marginTop:10,
		width:"80%"
	},
	iconPortada:{
		color:"#ffffff",
		fontSize:40,
	},
	textPortada:{
		color:"#ffffff",
		fontSize:15,
		marginVertical:5
	},
	textPortada2:{
		color:"#ffffff",
		fontSize:12,
		marginVertical:0
	},
	imagenesFotos:{
		width:100, 
		height:100,
		marginHorizontal:5,
		marginVertical:15,
		borderRadius:10
	},
	iconTrash:{
		backgroundColor:"rgba(255,255,255,.5)",
		width:27,
		borderRadius:15,
		fontSize:20,
		padding:5,
		left:46,
		top:-75
	},
	btnModal:{
		backgroundColor:"rgba(0,0,0,.1)",
		flex: 1,
	},
	contenedorModal:{
		position:"absolute",
		alignItems:"center",
		width:"100%",
		bottom:50,
	},
	btnOpcionModal:{
		borderRadius:10,
		marginBottom:10,
		backgroundColor:"#ffffff",
		width:"90%",
		alignItems:"center",
		padding:12
	},
	textModal:{
		fontSize:19
	},
	avatarPerfil:{
		width:100,
		height:100,
		borderRadius:50
	},
},{
	"@media (min-device-height: 812)": {
		contenedorFooter:{
			height:70
		},
	}
})