import {StyleSheet, Dimensions, Platform} from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
let size = Dimensions.get('window');

export const style = MediaQueryStyleSheet.create({
    container:{
			flex:1,
			backgroundColor:'#ffffff',
			paddingTop:Platform.OS==='android' ?10 :35,
		},	 
		titulo:{
			fontFamily: "Comfortaa-Bold",
			textAlign:"center"
		}
})