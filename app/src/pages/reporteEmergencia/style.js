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
	
	nuevoBtn:{
		flexDirection:"row",
		backgroundColor:"#002587",
		width:"50%",
        padding:10,
        justifyContent:"center",
        marginVertical:10
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
		width:"50%",
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

    iconAdd:{
		fontSize:20,
		top:5,
		color:"#002587",
	},
 
 
	inputStep4:{
		fontFamily: "Comfortaa-Regular",
		textAlignVertical: 'top',
		borderColor:"rgba(20,20,20,.1)",
		borderWidth:1,
		width:"50%",
		marginVertical:5,
		paddingVertical:4,
		fontSize:10,
		height:140,
	},
	separador:{
		width:"100%",
		height:1,
		marginVertical:10,
		backgroundColor:"rgba(50,50,50,.1)"
	},

	/////////// LISTADO TANQUES
	containerTanque:{
		flex:1,
		backgroundColor:'#ffffff',
		paddingTop:Platform.OS==='android' ?10 :35,
		alignItems:"center",
		justifyContent: 'center'
	},
	contenedorReportes:{
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
    cabezera1:{
		width:Width,
		height:100
	},  
})