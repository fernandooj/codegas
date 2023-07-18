import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let Width = Dimensions.get('window').width;
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
		textAlign:"center",
		alignItems:"center",
		justifyContent:"center",
		marginVertical:10,
		width:Width-60,
		left:20,
		padding:10,
	}, 
	iconFrecuencia:{
		color:"#ffffff",
		top:1,
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
		borderWidth:1,
		borderRadius:5,
		marginVertical:5,
		borderColor:"rgba(0,0,0,.1)"
	},
	subContenedorUsuario:{
		flexDirection:"row",
		alignItems:"center",
		marginVertical:3,
		paddingHorizontal:5,
	},
	iconTrash:{

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
		width:Width-20
	},
	row1Step2:{
		fontFamily: "Comfortaa-Regular",
		width:Width/2.5,
	},
	row1Step3:{
		fontFamily: "Comfortaa-Regular",
		width:Width/1.5,
	},
	inputStep2:{
		fontFamily: "Comfortaa-Regular",
		borderWidth:1,
		width:Width/1.8,
		marginVertical:5,
		paddingVertical:Platform.OS==='android' ?4 :10,
		paddingRight:12,
		fontSize:10,
		borderColor:"rgba(20,20,20,.1)"
	},
	btnMultiple:{
		borderWidth:1,
		width:Width/1.8,
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
	
	//// STEP 3
	switchEnableBorder: {
		borderColor: '#8e0303',
		borderWidth: 1
	},
		
	switchDisableBorder: {
		borderColor: '#f2f2f2',
		borderWidth: 1,  
	},

	//// STEP 4
	inputStep4:{
		fontFamily: "Comfortaa-Regular",
		textAlignVertical: 'top',
		borderColor:"rgba(20,20,20,.1)",
		backgroundColor:"#ffffff",
		borderWidth:1,
		width:Width/1.7,
		marginVertical:5,
		paddingVertical:4,
		fontSize:10,
		height:100,
	},
	separador:{
		width:Width,
		height:1,
		marginVertical:10,
		backgroundColor:"rgba(50,50,50,.1)"
	},
 
	containerTanque:{
		flex:1,
		backgroundColor:'#ffffff',
		paddingTop:Platform.OS==='android' ?10 :35,
		alignItems:"center",
		justifyContent: 'center'
	},
	contenedorRevisiones:{
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
	//////////////////////////////////////////////////////////////////		
	///////////				MODAL ALERTA
	//////////////////////////////////////////////////////////////////
	modal:{
		position:Platform.OS==='android' ?"absolute" :"absolute",
		backgroundColor:"#ffffff",
		zIndex:100,
		width:Width,
		height:Height,
	},
	subContenedorModal:{
		backgroundColor:"#e3e3e3",
		marginHorizontal:12,
        marginTop:40,
        marginBottom:125,
		width:"92%"
	},
	btnModalClose:{
		position:"absolute",
		zIndex:100,
		right:3,
		top:3
	},	
	iconCerrar:{
		fontSize:30
	},
	inputAlerta:{
		fontFamily: "Comfortaa-Regular",
		textAlignVertical: 'top',
		borderColor:"rgba(20,20,20,.1)",
		backgroundColor:"#ffffff",
		borderWidth:1,
		width:"100%",
		marginVertical:2,
		paddingVertical:4,
		fontSize:10,
		height:140,
	},
	nuevaAlerta:{
		flexDirection:"row",
		backgroundColor:"#002587",
		textAlign:"center",
		alignItems:"center",
		justifyContent:"center",
		marginTop:10,
		width:"100%",
		padding:10,
	}, 

	//////////////////////////////////////////////////////////////////		
	///////////				CERRAR
	//////////////////////////////////////////////////////////////////
	cabezera1:{
		width:Width,
		height:110
	},  
	textCerrar:{
		fontFamily: "Comfortaa-Regular",
		marginVertical:2,
		fontSize:15,
		textAlign:"center"
	},
	loadingContain:{
		position:"absolute",
		backgroundColor:"rgba(100,100,100,.1)",
		justifyContent:"center",
		width:"100%",
		height:"100%",
		zIndex:100,
	},
	row1Step2Cerrar:{
		fontFamily: "Comfortaa-Regular",
		width:Width/1.3,
	}
})