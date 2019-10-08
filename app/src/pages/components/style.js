import { Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
const size = Dimensions.get('window');
export const style = MediaQueryStyleSheet.create({
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			CABEZERA
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////			FOOTER
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	contenedorFooter:{
		backgroundColor: "rgba(255, 204, 0, 0.48)",
		alignItems:"center",
		flexDirection:"row",
		position:"absolute",
		bottom:0,
		width:"100%",
		left:0,
		height:65,
		paddingBottom:3,
	},
	subContenedorFooter:{
		width:"25.0%",
		alignItems:"center"
	},
	subContenedorFooterConductor:{
		width:"50.5%"
	},
	icon:{
		width:70,
		height:34,
		borderWidth:1
	},
	textFooter:{
		textAlign:"center",
		color:"#002587",
		fontSize:14,
		top:4
	},
	badge:{
		backgroundColor:"red",
		position:"absolute",
		bottom:20,
		right:10,
		width:16,
		height:16,
		textAlign:"center",
		justifyContent:"center",
		borderRadius:8,
		padding:0
	},
	textBadge:{
		textAlign:"center",
		color:"#ffffff",
		fontSize:9
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
		alignItems:"center",
		marginTop:10,
		width:"80%"
	},
	iconPortada:{
		backgroundColor:"#00218b",
		color:"#ffffff",
		paddingVertical:25,
		paddingHorizontal:25,
		borderRadius:50,
		fontSize:40,
	},
	textPortada:{
		color:"#ffffff",
		fontSize:15,
		marginVertical:5
	},
	textPortada2:{
		color:"#00218b",
		fontSize:15,
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