import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		backgroundColor:'#ffffff',
		flex:1,
		marginTop:Platform.OS==="ios" ?20 :0,
		alignItems:"center"
	},
	titulo:{
		textAlign:"center",
		marginTop:8,
		marginBottom:5,
		fontSize:20
	},
	contenedorUsers:{
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
		borderRadius:5,
		textAlignVertical:"center",
		width:"97%"
	},
	textUsers:{
		fontFamily: "Comfortaa-Regular",
		width:"100%",
		fontSize:13,
		margin:0,
		lineHeight:16
	},
	inputCabezera:{
		position:"relative",
		zIndex:0,
		width:"80%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		paddingLeft:10,
		elevation:4,
		marginBottom:10,
		borderTopLeftRadius:7,
		borderBottomLeftRadius:7,
		paddingVertical:2,
		height:Platform.OS==="ios" ?35 :35
	},
	iconCerrar:{
		fontSize:25
	},
	buscarCliente:{
		backgroundColor:"#002587",
		alignItems:"center",
		width:30,
		height:35,
		top:-1,
		borderTopRightRadius:7,
		borderBottomRightRadius:7,
		paddingVertical: 9
    },
	iconSearch:{
		color:"#ffffff",
		fontSize:15
	},
})