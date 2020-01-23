import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		backgroundColor:'#ffffff',
		flex:1,
    },
    titulo:{
        fontFamily: "Comfortaa-Bold",
        textAlign:"center",
        fontSize:20,
        marginTop:12,
        marginBottom:5,
        marginLeft:"6%",
    },
	btnNacimiento:{
        alignItems:"center",
        borderColor:"rgba(0,0,0,.2)",
        borderWidth:1,
        borderRadius:7,
        padding:5,
        marginLeft:"6%",
        width:"25.3%",
    },
    btnInput:{
        fontFamily: "Comfortaa-Regular",
        alignItems:"center",
        borderColor:"rgba(0,0,0,.2)",
        borderWidth:1,
        borderRadius:7,
        padding:5,
        marginHorizontal:"6%",
        width:"88%",
        marginTop:30
    },
    inputRequired:{
		borderColor:"rgba(255, 0, 0, 0.19)",
		borderWidth:1,
		borderRadius:7
	},
    separador:{
        marginVertical:10,
        marginHorizontal:"6%",
        width:"88%",
    },
    contenedorChip:{
        flexDirection: 'row',
    	flexWrap: 'wrap',
        alignItems:"center",
        width:"86%",
        left:"4%",
        marginVertical:10
    },
    btnInfo:{
        margin:5,
        borderRadius:10,
        backgroundColor:"rgba(0,0,0,.5)",
        flexDirection:"row",
        padding:6
    },
    iconDelete:{
        fontSize:14,
        marginHorizontal:5,
        color:"#ffffff"
    },
    textInfo:{
        fontFamily: "Comfortaa-Regular",
        color:"#ffffff"
    },
    tituloContrasena:{
        fontFamily: "Comfortaa-Regular",
        marginTop:20,
        fontSize:22,
        textAlign:"center"
    },
    input:{
        fontFamily: "Comfortaa-Regular",
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
    btnGuardar:{
        flexDirection:"row",
        justifyContent:"center",
        backgroundColor:"#00218b",
		padding:10,
        borderRadius:5,
        width:size.width/2,
        left:size.width/3.5,
        marginBottom:70,
        marginTop:20
	},
	textGuardar:{
		color:"#ffffff"
	},
	iconCargando:{
		color:"#ffffff"
    },
    btnUbicacion:{
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
    contenedorPerfil:{
        marginTop:100,
        marginBottom:20
    },
    /////////////////////////////////////////////////////////////////
    ////////////////////        PICKER
    /////////////////////////////////////////////////////////////////
    tipo: {
        borderColor:"rgba(0,0,0,.2)",
        backgroundColor:"#ffffff",
        color:"#000000",
        marginHorizontal:"6%",
        borderWidth:1,
        width:"88%",
        height:50,
        paddingTop:Platform.OS==='android' ?0 :15,
        marginTop:10,
        marginBottom:10,
        borderRadius:5,
        paddingLeft:10
    },
 
    //////////////////////////////////////////////////////////////////		
    ///////////				MODAL UBICACION
    //////////////////////////////////////////////////////////////////
	modal:{
		position:Platform.OS==='android' ?"relative" :"relative",
		backgroundColor:"#ffffff",
		zIndex:100,
		width:size.width,
		height:size.height,
	},
	subContenedorModal:{
		backgroundColor:"#e3e3e3",
		marginHorizontal:12,
        marginTop:40,
        marginBottom:125,
		width:"90%"
    },
    tituloModal:{
        fontFamily: "Comfortaa-Regular",
        margin:10
    },
	titulo1:{
        fontFamily: "Comfortaa-Regular",
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
    asterisco:{
        color:"red",
        position:"absolute",
        right:10,
        top:30
    },  
    btnEliminar:{
        position:"absolute",
        left:"44%",    
        bottom:2,
        padding:10
    },
    iconEliminar:{
        fontSize:20,
        color:"red"
    },
    //////////////////////////////////////////////////////////////////		
	///////////				MODAL  ZONA
	//////////////////////////////////////////////////////////////////
	modalZona:{
		position:Platform.OS=='android' ?null :"relative",
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
        height:size.height-150,
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
        fontFamily: "Comfortaa-Regular",
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
    },

})