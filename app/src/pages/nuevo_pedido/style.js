import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
	},	 
	containerNuevo:{
        marginBottom:70,
        flex:1, 
    },
    cabezera:{
        width:size.width,
        height:110
    },  
	subContainerNuevo:{
		flex:1,
		alignItems: 'center',
	},
    //////////////////////////////////////////////////////////////////
    //////////////////////      FORMA DE LLENAR
    //////////////////////////////////////////////////////////////////
    contenedorMonto:{
        borderColor:"#00218b",
        borderWidth:3,
        borderColor:"#ffcc00",
        borderTopWidth:0,
        width:"90%",
        borderRadius:30,
        padding:20,
        marginTop:25
    },
    tituloForm:{
        fontFamily: "Comfortaa-Bold",
        textAlign:"center",
        color:"#00218b",
        backgroundColor:"rgba(255,255,255,0)",
        width:280,
        fontSize:22,
        top:-35
    },
    btnFormaLlenar:{
        flexDirection:"row",
        padding:5,
    },
    textForma:{
        fontFamily: "Comfortaa-Bold",
        color:"#00218b",
        fontSize:19,
        width:"70%",
    },
    icon:{
       width:50,
       height:31,
       marginRight:15
    },
    iconCheck:{
        color:"#00218b",
        fontSize:22
    },
    input:{
        width:"90%",
		paddingVertical:10,
		height:45,
		paddingLeft:10,
		fontFamily: "Comfortaa-Light",
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		marginLeft:10,
		marginVertical:15,
		borderRadius:5,
		textAlignVertical:"center",
    },
    inputInvalid:{
        fontFamily: "Comfortaa-Light",
        borderColor:"red"
    },
    titulo:{
        fontFamily: "Comfortaa-Bold",
        fontSize:22
    },
    btnEnviar:{
        marginVertical:25,
        width:80,
        height:80    
    },
    btnGuardar:{
        flexDirection:"row",
		backgroundColor:"#00218b",
		padding:10,
        borderRadius:5,
        marginTop:25
    },
    btnGuardarDisable:{
        backgroundColor:"grey",
        flexDirection:"row",
		padding:10,
        borderRadius:5,
        marginTop:25
    },
    textGuardar:{
        fontFamily: "Comfortaa-Light",
		color:"#00218b"
    },
    iconGuardar:{
        top: 3,
        marginRight:5,
        color:"white"
    },
    iconGuardarDisable:{
        top: 3,
        marginRight:5
    },
    textGuardar:{
        color:"white"
    },
    //////////////////////////////////////////////////////////////////
    //////////////////////      FRECUENCIA
    ////////////////////////////////////////////////////////////////// 
    nuevaFrecuencia:{
        flexDirection:"row",
        backgroundColor:"#ffcc00",
		padding:10,
        borderRadius:5,
        marginVertical:10
    },
    eliminarFrecuencia:{
        flexDirection:"row",
        backgroundColor:"#d9534f",
		padding:10,
        borderRadius:5,
        marginVertical:10
    },
    iconFrecuencia:{
        color:"#00218b",
        marginHorizontal:10,
        top:2
    },
    contenedorFrecuencia:{
        flexDirection:"row",
    },
    btnFrecuencia:{
        marginHorizontal:5,
    },
    inputNovedades:{
        width:"88%",
		paddingVertical:10,
		height:80,
		paddingLeft:10,
        borderWidth:1,
		fontFamily: "Comfortaa-Light",
		backgroundColor:'#ffffff',
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor:"rgba(0,0,0,.5)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		elevation: 7, // Android
		marginLeft:10,
		marginVertical:15,
		borderRadius:5,
		textAlignVertical:"center",
    },

    btnZona:{
        flexDirection:"row",
        width:size.width-10,
        borderColor:'rgba(0,0,0, .2)',
        padding:10,
        borderWidth:1,
        marginBottom:2,
        borderRadius:5
    },
    textZona:{
        fontFamily: "Comfortaa-Light",
        width:"100%",
        fontSize:12,
        alignItems:"flex-start",
		 
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
		alignItems:"center"
	},
	btnModalClose:{
		position:"absolute",
		right:Platform.OS=='android' ?0 :-8,
		top:Platform.OS=='android' ?0 :-8,
		zIndex:100
	},

	iconCerrar:{
		fontSize:22
	},
})