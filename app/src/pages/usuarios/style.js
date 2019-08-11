import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		backgroundColor:'#ffffff',
		flex:1,
        marginTop:15,
		alignItems:"center"
    },
    titulo:{
        textAlign:"center",
        marginTop:10,
        marginBottom:5,
        fontSize:22
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
		elevation: 7, // Android
		marginLeft:5,
		marginBottom:15,
		borderRadius:5,
		textAlignVertical:"center",
		width:"97%"
    },
    textUsers:{
        width:"100%",
        fontSize:17
	},
	inputCabezera:{
		position:"relative",
		zIndex:0,
		width:"90%",
		shadowColor: 'rgba(0,0,0, .4)', // IOS
		borderColor:"rgba(0,0,0,0)",
		shadowOffset: { height: 2, width: 2 }, // IOS
		shadowOpacity: .5, // IOS
		shadowRadius: 5, //IOS
		backgroundColor: '#fff',
		paddingLeft:10,
		marginBottom:20,
		borderRadius:5,
		paddingVertical:2,
		height:Platform.OS==="ios" ?30 :30
	},
	iconCerrar:{
		fontSize:25
	}
})