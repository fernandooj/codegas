import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let Width  = Dimensions.get('window').width;
let Height = Dimensions.get('window').height;

export const style = MediaQueryStyleSheet.create({
  container:{
		flex:.95,
		backgroundColor:'#ffffff',
		paddingTop:Platform.OS==='android' ?10 :35,
		alignItems:"center",
		justifyContent: 'center'
	},
	
	nuevaFrecuencia:{
		flexDirection:"row",
		backgroundColor:"#002587",
		width:"70%",
		padding:10
	}, 
	nuevoUsuario:{
		flexDirection:"row",
		backgroundColor:"#002587",
		width:"45%",
		marginHorizontal:5,
		padding:10
	}, 
	iconUsuario:{
		color:"#ffffff",
		top:3,
		marginRight:10
	},
	textGuardar:{
		color:"#ffffff"
	},
	input:{
		borderWidth:1,
		width:Width-30,
		marginVertical:5,
		paddingVertical:4,
		fontSize:10,
		borderColor:"rgba(20,20,20,.1)"
	},
	filterText:{
		fontFamily: "Comfortaa-Regular",
		fontSize:15
	},
	contenedorUsuario:{
		width:Width-30,
	},
	subContenedorUsuario:{
		flexDirection:"row",
		marginVertical:7
	},
	row1:{
		fontFamily: "Comfortaa-Regular",
		width:"30%",
		fontSize:13
	},
	row2:{
		fontFamily: "Comfortaa-Regular",
		alignItems:"flex-start",
		fontSize:13,
		flex: 1, 
		flexWrap: 'wrap'
	},
	btnZona:{
		marginVertical:3,
		flexDirection:"row",
		alignItems:"center",
		borderWidth:1,
		borderColor:"rgba(100,100,100,.2)"
	},
	icon:{
		width:20,
		height:20,
	},
	btnZonaActiva:{
		marginVertical:5,
		flexDirection:"row",
		alignItems:"center",
		borderWidth:1,
		backgroundColor:"rgba(100,100,100,.1)",
		borderColor:"rgba(100,100,100,.2)"
	},

	//// STEP 2
	contenedorSetp2:{
		flexDirection:"row",
		alignItems:"center",
		width:Width-20,
	},
	row1Step2:{
		fontFamily: "Comfortaa-Regular",
		width:Width/3,
	},
	inputStep2:{
		fontFamily: "Comfortaa-Regular",
		borderColor:"rgba(20,20,20,.1)",
		textAlign:"left",
		borderWidth:1,
		width:Width/1.7,
		marginVertical:5,
		paddingVertical:4,
		fontSize:10,
	},
	inputAno:{
		fontFamily: "Comfortaa-Regular",
		textAlign:"left",
		width:Width/1.7,
		marginVertical:5,
		paddingVertical:1,
		paddingHorizontal:4,
		fontSize:10,
		color:"#000000"
	},
	btnMultiple:{
		borderWidth:1,
		width:Width/1.7,
		marginVertical:5,
		paddingVertical:10,
		alignItems: 'flex-start',
		borderColor:"rgba(20,20,20,.1)"
	},
	btnDate:{
		marginVertical:5,
		alignItems: 'flex-start',
		borderColor:"rgba(20,20,20,.1)"
	},
	btnDate2:{
		width:Width/1.7,
		marginVertical:6
	},
	textBtn:{
		fontFamily: "Comfortaa-Regular",
		color:"rgba(0,0,0,.4)",
		fontSize:10,
		paddingLeft:5
	},
	textBtnActive:{
		fontFamily: "Comfortaa-Regular",
		color:"rgba(0,0,0,1)",
		fontSize:10,
		paddingLeft:5
	},

	//// STEP 3
	contenedorSetp3:{
		flexDirection:"row",
		alignItems:"center",
		marginVertical:5
	},
	btnSign:{
		backgroundColor:"rgba(100,100,100,.5)",
		paddingVertical:6,
		paddingHorizontal:8,
		borderRadius:15
		
	},
	iconSign:{
		fontSize:15,
		color:"rgba(255,255,255,.9)",
	},
	textStep3:{
		fontFamily: "Comfortaa-Regular",
		marginHorizontal:10,
		width:100,
		fontSize:13,
		textAlign:"center"
	},
	textStep3Cantidad:{
		fontFamily: "Comfortaa-Regular",
		marginHorizontal:10,
		width:100,
		fontSize:10,
		textAlign:"center"
	},
	//// STEP 4
	inputStep4:{
		fontFamily: "Comfortaa-Regular",
		textAlignVertical: 'top',
		borderColor:"rgba(20,20,20,.1)",
		borderWidth:1,
		width:"98%",
		marginVertical:5,
		paddingVertical:4,
		fontSize:10,
		height:140,
	},

	/////////// LISTADO TANQUES
	containerTanque:{
		flex:1,
		backgroundColor:'#ffffff',
		paddingTop:Platform.OS==='android' ?10 :35,
		alignItems:"center",
		justifyContent: 'center'
	},
	contenedorTanques:{
		paddingVertical:10,
		paddingLeft:10,
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .7)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 5, // Android
		marginLeft:5,
		marginTop:10,
		marginBottom:10,
		borderRadius:5,
		textAlignVertical:"center",
		width:"97%"
	},
	inputCabezera:{
		position:"relative",
		zIndex:0,
		width:"82%",
		marginRight:10,
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		paddingLeft:10,
		elevation:4,
		marginBottom:10,
		borderRadius:5,
		paddingVertical:2,
		height:Platform.OS==="ios" ?30 :30
	},
	iconAdd:{
		fontSize:20,
		top:5,
		color:"#002587",
	},
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	  },
	inputAndroid: {
		width:300,
		height:150,
		backgroundColor:"red",
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: 'purple',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	  },

	////////////////////////////
	loadingContain:{
		position:"absolute",
		backgroundColor:"rgba(100,100,100,.1)",
		justifyContent:"center",
		width:"100%",
		height:"100%",
		zIndex:100,
	},
	separador:{
		width:Width,
		height:1,
		marginVertical:10,
		backgroundColor:"rgba(50,50,50,.1)"
	},
	imagen:{
		width:80,
		height:80,
		resizeMode:"contain",
		
		marginBottom:5
	},
	contenedorRevision:{
		flexDirection:"row",
		justifyContent:"center",
		marginVertical:4
	},
	txtUltimaRevTit:{
		width:"33%",
		fontFamily: "Comfortaa-Bold",
		fontSize:17,
		textAlign:"center",
		justifyContent:"center"
	},
	txtUltimaRev:{
		width:"33%",
		fontFamily: "Comfortaa-Regular",
		fontSize:15,
		justifyContent:"center"
	},
	iconFrecuencia:{
		color:"#002587"
	},
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	alertaTit:{
		width:"25%",
		fontFamily: "Comfortaa-Bold",
		fontSize:17,
		textAlign:"center",
		justifyContent:"center"
	},
	alertaText:{
		width:"24.5%",
		fontFamily: "Comfortaa-Regular",
		fontSize:15,
		justifyContent:"center"
	},
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL
	//////////////////////////////////////////////////////////////////
	contenedorModal:{
		alignItems:"center",
		justifyContent: 'center',
		backgroundColor:"rgba(0,0,0,.5)",
		height:Height,
		zIndex:100,
		width:"100%",
		bottom:50,
		top:0,
		left:0,	
		padding:40,
	},
	subContenedorModal:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:20,
		alignItems:"center"
	},
	subContenedorModalUbicacion:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:10,
		width:Width-70
	},
	btnModalClose:{
		position:"absolute",
		right:Platform.OS=='android' ?3 :-10,
		top:Platform.OS=='android' ?0 :-10,
		zIndex:100
	},
	iconCerrar:{
		fontSize:30
	},
	btnIconPass:{
		position:"absolute",
		top:10,
		right:15
	},
	err:{
		fontFamily:"Muli-Light",
		color:'red',
		top:-2,
		left:12,
		fontSize:9
	},
	nuevaRevision:{
		backgroundColor:"#002587",
		alignItems:"center",
		width:"100%",
		padding:10
	}, 
	btnDate3:{
		marginTop:30,
		width:"100%",
	},
})