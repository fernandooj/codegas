import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container:{
		flex:1,
		backgroundColor:'#ffffff',
	},	 
	containerNuevo:{
		flex:1,
		width:"100%",
		marginTop:Platform.OS==='android' ?10 :20
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
        borderWidth:1,
        width:"90%",
        borderRadius:5,
        padding:20,
        marginTop:25
    },
    tituloForm:{
        textAlign:"center",
        backgroundColor:"#ffffff",
        width:280,
        fontSize:22,
        top:-30
    },
    btnFormaLlenar:{
        flexDirection:"row",
        padding:5,
    },
    textForma:{
        fontSize:19,
        width:"80%"
    },
    icon:{
        color:"#5cb85c",
        fontSize:19,
        top:2,
    },
    input:{
        width:"90%",
		paddingVertical:10,
		height:45,
		paddingLeft:10,
		// fontFamily:"quicksand-medium",
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
        borderColor:"red"
    },
    titulo:{
        fontSize:22
    },
    btnGuardar:{
		backgroundColor:"#00218b",
		padding:10,
        borderRadius:5,
        marginTop:25
    },
    btnGuardarDisable:{
		backgroundColor:"grey",
		padding:10,
        borderRadius:5,
        marginTop:25
    },
    textGuardar:{
		color:"#ffffff"
    },
    //////////////////////////////////////////////////////////////////
    //////////////////////      FRECUENCIA
    ////////////////////////////////////////////////////////////////// 
    nuevaFrecuencia:{
        flexDirection:"row",
        backgroundColor:"#5cb85c",
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
        color:"#ffffff",
        marginHorizontal:10,
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
		// fontFamily:"quicksand-medium",
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

    btnZona:{
        flexDirection:"row",
        borderColor:'rgba(0,0,0, .2)',
        padding:10,
        borderWidth:1,
        marginBottom:2,
        borderRadius:5
    },
    textZona:{
        width:"70%"
    },
    iconZona:{
        color:"#5cb85c",
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
		right:-8,
		top:-8,
		zIndex:100
	},

	// iconCerrar:{
	// 	fontSize:22
	// },
})