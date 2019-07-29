import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
 
let size = Dimensions.get('window');
 
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
	btnIconPassLogin:{
		padding:22,
		position:"absolute",
		right:-10,
		top:-12
	},
	iconPass:{
		fontSize:25
	},
    input:{
        width:"90%",
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
		marginLeft:0,
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
	btnUbicacion:{
        width:"90%",
		paddingVertical:15,
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
		
		marginBottom:15,
		borderRadius:5,
		textAlignVertical:"center",
	},
	/////////////////////////////////////////////////////////////////
	////////////////////        PICKER
	/////////////////////////////////////////////////////////////////
    inputIOS: {
        width:"90%",
		paddingVertical:12,
		
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
		marginLeft:"5%",
		marginBottom:15,
		borderRadius:5,
		textAlignVertical:"center",
    },
    inputAndroid: {
        width:"85%",
		paddingVertical:12,
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
		marginLeft:"5%",
		marginBottom:15,
		borderRadius:5,
		textAlignVertical:"center",
	},
	//////////////////////////////////////////////////////////////////		
    ///////////				MODAL UBICACION
    //////////////////////////////////////////////////////////////////
	modal:{
		position:Platform.OS==='android' ?"relative" :"absolute",
		backgroundColor:"#ffffff",
		zIndex:100,
		width:size.width,
		height:size.height,
	},
	subContenedorModal:{
		backgroundColor:"#e3e3e3",
		marginHorizontal:12,
		marginTop:40,
		width:"90%"
    },
    tituloModal:{
        margin:10
    },
	titulo1:{
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
	btnModalClose:{
		position:"absolute",
		right:3,
		top:3
	},	
	iconCerrar:{
		fontSize:30
	},
	textoFiltro:{
		width:100
	},
	btnLimpiar:{
		flexDirection:"row",
		position:"absolute",
		right:10,
		top:Platform.OS=='android' ?10 :35
	},
	textoLimpiar:{
		width:50
    },
    contenedorAdd:{
        alignItems:"center",
        marginVertical:10
    },
    btnAdd:{
        backgroundColor:"#00218b",
        padding:8,
        width:28,
        height:28,
        borderRadius:14,
    },
    iconAdd:{
        color:"#ffffff"
    },
    separador:{
        width:"100%",
        backgroundColor:"rgba(0,0,0,.05)",
        height:2,
	},
	inputUbicacion:{
        borderColor:"rgba(0,0,0,.2)",
        backgroundColor:"#ffffff",
        borderWidth:1,
        marginHorizontal:"6%",
        width:"88%",
        height:50,
        marginTop:10,
        marginBottom:10,
        borderRadius:5,
        paddingLeft:10
	},
	btnOpenZona:{
		justifyContent:"center",
        borderColor:"rgba(0,0,0,.2)",
        backgroundColor:"#ffffff",
        borderWidth:1,
        marginHorizontal:"6%",
        width:"88%",
        height:50,
        marginTop:10,
        marginBottom:10,
        borderRadius:5,
        paddingLeft:10
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
	btnModalClose:{
		position:"absolute",
		right:-8,
		top:-8,
		zIndex:100
    },
    btnZona:{
        flexDirection:"row",
        borderColor:"rgba(0,0,0,.2)",
        backgroundColor:"#ffffff",
        borderWidth:1,
        marginHorizontal:"6%",
        width:180,
        marginVertical:5,
        borderRadius:5,
        paddingLeft:10,
        paddingVertical:10
    },
    textZona:{
        fontSize:14,
        width:130
    },
    btnGuardarUbicacion:{
        flexDirection:"row",
        justifyContent:"center",
        backgroundColor:"#00218b",
		padding:10,
        borderRadius:5,
        width:size.width-85,
        left:20,
        marginBottom:50,
        marginTop:20
    }
})