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
		marginBottom:Platform.OS==='android' ?50 :70,
		width:"95%",
	},
	pedidoBtn:{
		borderColor:"rgba(255,255,255,.5)",
		marginVertical:5,
		borderRadius:10,
		borderWidth:1,
		padding:10
	},
	hidePedido:{
		height: 0, 
		width: 0, 
		opacity: 0, 
		margin:0, 
		padding:0,
		borderWidth:0
	},
	icon:{
		color:"#ffffff",
	},
	text:{
		fontFamily: "Comfortaa-Regular",
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
	containerPedidos:{
		flexDirection:"row"
	},
	textPedido:{
		fontFamily: "Comfortaa-Regular",
		width:"48%"
	},	
	imagen:{
		width:size.width-40,
		height:300
	},
	sinPedidos:{
		fontFamily: "Comfortaa-Regular",
		textAlign:"center",
		fontSize:22
	},
	pedido:{
		flexDirection:"row",
		padding:6
	},
	txtPedidoFinalizado:{
		fontFamily: "Comfortaa-Regular",
	},
	//////////////////////////////////////////////////////////////////		
	///////////				CABEZERA
	//////////////////////////////////////////////////////////////////
	contenedorCabezera:{
		width:"90%",
		marginTop:Platform.OS==='android' ?0 :10,
	},
	subContenedorCabezera:{
		flexDirection:"row"
	},
	inputCabezera:{
		fontFamily: "Comfortaa-Bold",
		position:"relative",
		zIndex:0,
		width:"90%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor: "rgba(150,150,150, .5)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		paddingLeft:10,
		marginBottom:20,
		borderRadius:5,
		paddingTop:9,
		borderWidth:1,
		height:Platform.OS==="ios" ?30 :35
	},
	imgFiltro:{
		width:28,
		height:28,
		marginLeft:10
	},	
	titulo:{
		fontFamily: "Comfortaa-Regular",
		width:"58%",
		fontSize:22,
		marginVertical:10,
	},
	btnZonas:{
		padding:5,
		top:5,
		// borderWidth:1
	},
	textZonas:{
		fontFamily: "Comfortaa-Regular",
		fontSize:20
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
	},
	subContenedorFiltro:{
		backgroundColor:"#e3e3e3",
		marginHorizontal:12,
		marginTop:12,
		width:"90%"
	},
	titulo1:{
		fontFamily: "Comfortaa-Bold",
		fontSize:17,
		padding:10
	},
	cabezera:{
		flexDirection:"row",
		backgroundColor:"#ffffff",
		paddingTop:Platform.OS==='android' ?5 :30,
		paddingBottom:10,
		top:5
	},
	btnRegresar:{
		fontFamily: "Comfortaa-Bold",
		paddingVertical:4,
		paddingHorizontal:8,
		marginRight:8,
		top:5
	},	
	btnFiltro:{
		flexDirection:"row",
		paddingTop:5,
		paddingVertical:0,
		paddingHorizontal:10
	},
	iconFiltro:{
		fontSize:15
	},
	textoFiltro:{
		fontFamily: "Comfortaa-Regular",
		width:100
	},
	btnLimpiar:{
		flexDirection:"row",
		position:"absolute",
		right:10,
		top:Platform.OS=='android' ?10 :35
	},
	textoLimpiar:{
		fontFamily: "Comfortaa-Regular",
		width:80
	},

	//////////////////////////////////////////////////////////////////		
	///////////				MODAL  ZONA
	//////////////////////////////////////////////////////////////////
	modalZona:{
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
	subModalZona:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:10,
		height:size.height-120,
		alignItems:"center"
	},
	btnZona:{
		flexDirection:"row",
		padding:10
	},
	textZona:{
		fontFamily: "Comfortaa-Regular",
		textAlign:"center",
		width:100
	},

	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal:{
		position:Platform.OS=='android' ?"absolute" :"absolute",
		alignItems:"center",
		justifyContent: 'center',
		backgroundColor:"rgba(0,0,0,.5)",
		width:"100%",
		height:size.height,
		zIndex:100,
		bottom:50,
		top:0,
		left:0,	
		flex:1,

	},

	contenedorModal2:{
		position:Platform.OS=='android' ?"absolute" :"absolute",
		alignItems:"center",
		justifyContent: 'center',
		backgroundColor:"rgba(0,0,0,.5)",
		height:size.height,
		zIndex:200,
		width:"100%",
		top:0,
		left:0,	
	},
	contenedorCerrarPedido:{
		left:5
	},
	subContenedorModal:{
		backgroundColor:"#ffffff",
		height:size.height-100,
		borderRadius:7,
		padding:8,
		alignItems:"center",
		minWidth:size.width/1.5,
	},
	containerTituloModal:{
		minWidth:size.width/1.5
	},
	subContenedorModal2:{
		backgroundColor:"#ffffff",
		height:220,
		borderRadius:7,
		padding:10,
		alignItems:"center"
	},
	listadoPerfil:{
		padding:10,
		borderWidth:1,
		borderColor:"rgba(0,0,0,.5)"
	},
	listadoPerfil2:{
		padding:10,
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
		fontSize:31
	},
	separador:{
		width:size.width-50,
		backgroundColor:"rgba(0,0,0,.5)",
		height:2,
		marginTop:15
	},
	tituloModal:{
		fontFamily: "Comfortaa-Regular",
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
		fontFamily: "Comfortaa-Regular",
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
		width:"80%",
		marginVertical:20,
		left:"10%",
		justifyContent:"center"
	},
	btnDisable2:{
		backgroundColor:"grey",
		paddingVertical:8,
		width:size.width-150,
		marginVertical:20,
		left:size.width/10,
		justifyContent:"center"
	},
	btnGuardar3:{
		backgroundColor: "#00218b",
		paddingVertical:4,
		width:size.width/2.5,
		borderRadius:10,
		padding:4,
		marginVertical:10,
		left:0,
		marginHorizontal:10,
		justifyContent:"center"
	},
	btnDisable3:{
		backgroundColor:"grey",
		padding:4,
		width:size.width/2.5,
		marginVertical:20,
		left:0,
		marginHorizontal:10,
		justifyContent:"center"
	},
	textGuardar:{
		fontFamily: "Comfortaa-Regular",
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
		textAlignVertical: 'top',
		alignItems:"flex-start",
		borderRadius:5,
		marginTop:15,
		borderWidth:1,
		height:100,
		paddingHorizontal:10,
		width:size.width-30
	},
	inputTerminarPedido:{
		width:size.width-30,
		borderColor:"rgba(0,0,0,.2)",
		borderRadius:5,
		borderWidth:1,
		marginBottom:10,
		paddingVertical:8,
		paddingHorizontal:5,
	},
	btnNovedad:{
		backgroundColor:"rgba(255, 204, 0, 1)",
		alignItems:"center",
		width:110,
		padding:5,
		borderRadius:8
	},
	btnEmergencia:{
		backgroundColor:"rgba(255, 204, 0, 1)",
		alignItems:"center",
		width:220,
		padding:5,
		marginBottom:10,
		borderRadius:8
	},	
	textNovedad:{
		color:"#ffffff",
		fontFamily: "Comfortaa-Regular",
	},
	contenedorNovedad:{
		width:size.width/1.7,
		borderTopWidth:1,
		borderTopColor:"rgba(0,0,0,.2)"
	},
	textNovedad:{
		fontFamily: "Comfortaa-Regular",
		fontSize:14
	},
	textNovedad2:{
		fontFamily: "Comfortaa-Regular",
		fontSize:12
	},
	tituloNovedades:{
		fontFamily: "Comfortaa-Bold",
		fontSize:18
	},
	////////////////////////////////////////////////////////////
	//////////////////		MODAL CONDUCTOR
	////////////////////////////////////////////////////////////
	contenedorConductor:{
		flexDirection:"row",
		padding:10
	},
	conductor:{
		fontFamily: "Comfortaa-Regular",
		fontSize:14,
		width:120,
		top:5,
		 
	},
	avatar:{
		width:38,
		height:38,
		borderRadius:19
	},
	btnModalConductorClose:{
		position:"absolute",
		right:Platform.OS=='android' ?-10 :6,
		top:Platform.OS=='android' ?-8 :2,
		zIndex:100
	},
	calendar:{
		// height:100
	},
	preload:{
		position:"absolute",
		zIndex:100,
		bottom:55,
		left:(size.width/2)-5
	},
	preload1:{
		position:"absolute",
		zIndex:100,
		top:0,
		left:(size.width/2)-5
	},

	/////////////////////////////////////////////////////////////////
	////////////////////        PICKER
	/////////////////////////////////////////////////////////////////
	contenedorSelect:{
		borderColor:"rgba(0,0,0,.2)",
		backgroundColor:"#ffffff",
		color:"#000000",
		width:"99.5%",
		borderWidth:1,
		height:50,
		marginTop:5,
		marginBottom:0,
		borderRadius:5,
		paddingLeft:0,
		paddingTop:Platform.OS==='android' ?0 :15,
	},
  // inputIOS: {
	// },
	// inputAndroid: {
	// 	fontSize: 16,
	// 	paddingHorizontal: 10,
	// 	paddingVertical: 8,
	// 	borderWidth: 1,
	// 	borderColor:"red",
	// 	borderRadius: 8,
	// 	width:"95.5%",
	// 	// paddingRight: 30, // to ensure the text is never behind the icon
	// },
})