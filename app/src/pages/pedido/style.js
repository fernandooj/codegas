import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container:{
		flex:1,
		backgroundColor:'#ffffff',
		paddingTop:Platform.OS==='android' ?10 :20,
		alignItems:"center",
		justifyContent: 'center'
	},	 
	subContenedor:{
		marginBottom:50,
		width:"95%",
	},
	titulo:{
		fontSize:22,
		marginVertical:10
	},
	pedidoBtn:{
		borderColor:"rgba(255,255,255,.5)",
		marginVertical:5,
		borderRadius:10,
		borderWidth:1,
		padding:10
	},
	pedido:{
		flexDirection:"row",
	},
	icon:{
		color:"#ffffff",
	},
	text:{
		fontSize:15
	},
	columna1:{
		width:"30%"
	},
	columna2:{
		justifyContent: 'center'
	},
	fechas:{
		flexDirection:"row",
		borderBottomWidth:1,
		borderBottomColor:"#ffffff",
		marginBottom:5,
		paddingBottom:5
	},
	fechaText:{
		alignItems:"center",
		textAlign:"center",
		width:"50%"
	},

	
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL FILTRO
	//////////////////////////////////////////////////////////////////
	modal:{
		position:"absolute",
		backgroundColor:"#f0f0f0",
		zIndex:100,
		width:size.width,
		height:size.height,
		// alignItems:"center"
	},
	subContenedorFiltro:{
		backgroundColor:"#e3e3e3",
		marginHorizontal:12,
		marginVertical:6,
		width:"90%"
	},
	titulo1:{
		fontSize:17,
		padding:10
	},
	cabezera:{
		flexDirection:"row",
		backgroundColor:"#ffffff",
		paddingTop:Platform.OS==='android' ?5 :30,
		paddingBottom:10
	},
	btnFiltro:{
		paddingVertical:0,
		paddingHorizontal:10
	},
	btnRegresar:{
		paddingVertical:2,
		paddingHorizontal:6,
		marginRight:6,
		top:-1
	},	
	iconFiltro:{
		fontSize:15
	},
	//////////////////////////////////////////////////////////////////		
	///////////				CABEZERA
	//////////////////////////////////////////////////////////////////
	contenedorCabezera:{
		width:"90%",
	},
	subContenedorCabezera:{
		flexDirection:"row"
	},
	inputCabezera:{
		position:"relative",
		zIndex:0,
		width:"90%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		paddingLeft:10,
		marginBottom:20,
		borderRadius:5,
		height:30
	},
	imgFiltro:{
		width:28,
		height:28,
		marginLeft:10
	},	
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal:{
		position:Platform.OS=='android' ?null :"absolute",
		alignItems:"center",
		justifyContent: 'center',
		backgroundColor:"rgba(0,0,0,.5)",
		height:size.height,
		zIndex:100,
		width:"100%",
		bottom:50,
		top:0,
		left:0,	
	},
	contenedorModal2:{
		position:Platform.OS=='android' ?null :"absolute",
		alignItems:"center",
		backgroundColor:"rgba(0,0,0,.5)",
		height:size.height,
		zIndex:100,
		width:"100%",
		bottom:50,
		top:0,
		left:0,	
		paddingTop:40,
	},
	subContenedorModal:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:10,
		alignItems:"center"
	},
	btnModalClose:{
		position:"absolute",
		right:-8,
		top:-8,
		zIndex:100
	},
	btnModalClose2:{
		position:"absolute",
		right:8,
		top:0,
		zIndex:100
	},

	iconCerrar:{
		fontSize:22
	},
	separador:{
		width:size.width-50,
		backgroundColor:"rgba(0,0,0,.5)",
		height:2,
		marginTop:15
	},
	tituloModal:{
		textAlign:"center",
		fontSize:22,
		marginVertical:0
	},
	contenedorEspera:{
		padding:8
	},
	subContenedorEditar:{
		flexDirection:"row",
		padding:6
	},
	textoEspera:{
		fontSize:18,
		width:"80%",
	},
	activo:{
		backgroundColor:"#5cb85c"
	},
	iconEditar:{
		color:"#ffffff",
		fontSize:20,
		top:2
	},
	btnGuardar:{
		backgroundColor: "#00218b",
		padding:8,
		width:"70%",
		marginVertical:20
	},
	btnDisable:{
		backgroundColor:"grey",
		padding:8,
		width:"70%",
		marginVertical:20
	},
	btnGuardar2:{
		backgroundColor: "#00218b",
		paddingVertical:8,
		width:"42%",
		marginVertical:20,
		marginLeft:15
	},
	btnDisable2:{
		backgroundColor:"grey",
		paddingVertical:8,
		width:"42%",
		marginVertical:20,
		marginLeft:15
	},
	textGuardar:{
		color:"white",
		fontSize:15,
		textAlign:"center"
	},
	iconBtnGuardar:{
		color:"#ffffff",
		fontSize:20,
		marginLeft:12
	},
	inputNovedad:{
		borderColor:"#rgba(0,0,0,.2)",
		borderRadius:5,
		marginTop:15,
		borderWidth:1,
		height:120,
		padding:10
	},
	inputTerminarPedido:{
		width:size.width-30,
		borderColor:"rgba(0,0,0,.2)",
		borderRadius:5,
		borderWidth:1,
		marginBottom:10,
		padding:5
	},
	////////////////////////////////////////////////////////////
	//////////////////		MODAL CONDUCTOR
	////////////////////////////////////////////////////////////
	contenedorConductor:{
		flexDirection:"row",
		padding:10
	},
	conductor:{
		fontSize:22,
		width:size.width-100,
		top:5
	},
	avatar:{
		width:38,
		height:38,
		borderRadius:19
	},
	btnModalConductorClose:{
		position:"absolute",
		right:10,
		top:-8,
		zIndex:100
	}
})