import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container:{
		flex:1,
		backgroundColor:'#ffffff',
		paddingTop:Platform.OS==='android' ?10 :35,
		alignItems:"center",
		justifyContent: 'center'
	},	 
	subContenedor:{
		marginBottom:50,
		width:"95%",
	},
	 
	//////////////////////////////////////////////////////////////////		
	///////////				CABEZERA
	//////////////////////////////////////////////////////////////////
	contenedorCabezera:{
		width:"90%",
        flexDirection:"row"
	},
	subContenedorCabezera:{
	},
	inputCabezera:{
		position:"relative",
		zIndex:0,
		width:"30%",
		marginRight:5,
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
		height:40
	},
    btnIconNuevo:{
        top:10,
        left:15  
    },
	iconNuevo:{
		fontSize:22
    },	
    //////////////////////////////////////////////////////////////////		
    ///////////				VEHICULOS
    //////////////////////////////////////////////////////////////////
    vehiculo:{
        flexDirection:"row",
        position:"relative",
		zIndex:0,
		width:"97%",
		shadowColor: 'rgba(0,0,0, .8)', // IOS
		borderColor:"rgba(0,0,0,1)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .3, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 0, // Android
		paddingLeft:10,
        marginBottom:20,
        left:5,
		borderRadius:5,
		paddingTop:5,
		paddingBottom:5
    },
    vehiculoTexto:{
        width:"60%"
    },
    btnVehiculo:{
        padding:10
	},
	iconVehiculo:{
		fontSize:18
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
	subContenedorModal:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:10,
		alignItems:"center",
		height:size.height-50
	},
	btnModalClose:{
		position:"absolute",
		right:Platform.OS=='android' ?-0 :0,
		top:Platform.OS=='android' ?-0 :0,
		zIndex:100
    },
    iconCerrar:{
        fontSize:25
    },
	avatar:{
        width:40,
        height:40,
        borderRadius:20,
    },
    contenedorConductor:{
        flexDirection:"row",
        marginBottom:5,
        borderWidth:1,
        borderColor:"rgba(0,0,0,.1)",
        padding:5
    },
    conductor:{
		fontFamily: "Comfortaa-Regular",
        fontSize:18,
        width:200,
        top:5
    },
    titulo:{
		fontFamily: "Comfortaa-Regular",
        fontSize:21,
        marginVertical:15
    },
	input:{
		position:"relative",
		fontFamily: "Comfortaa-Regular",
		zIndex:0,
		width:190,
		marginHorizontal:20,
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
		height:40
	},
	text:{
		fontFamily: "Comfortaa-Regular",
		fontSize:15,
		marginHorizontal:22
	},
	subContenedorModalEditar:{
		backgroundColor:"#ffffff",
		borderRadius:7,
		padding:10,
		paddingVertical:30,
	},
	btnGuardar:{
        flexDirection:"row",
        justifyContent:"center",
        backgroundColor:"#00218b",
		padding:10,
		borderRadius:5,
		marginHorizontal:20,
		width:190,
        marginBottom:70,
        marginTop:20
	},
	textGuardar:{
		fontFamily: "Comfortaa-Regular",
		color:"#ffffff"
	}
})