import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		backgroundColor:'#ffffff',
		flex:1,
        marginTop:15,
       
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
		marginLeft:10,
		marginBottom:15,
		borderRadius:5,
		textAlignVertical:"center",
    },
    textUsers:{
        width:"100%",
        fontSize:17
    }
})