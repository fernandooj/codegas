import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
	container:{
		flex:1,
		alignItems: 'center',
		backgroundColor:'#ffffff',
		justifyContent:"center"
	},
	btn:{
		backgroundColor: "#00218b",
		alignItems: 'center',
		width:size.width-20,
		marginBottom:20,
		borderRadius:10,
		paddingVertical:50
	},
	icon:{
		color:"#ffffff",
		fontSize:45,
		paddingVertical:25
	},
	text:{
		color:"#ffffff",
		fontSize:30
	}

	 
})