import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Platform, Dimensions, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import FCM, { NotificationActionType } from "react-native-fcm";
import { registerKilledListener, registerAppListener } from "../push/Listeners";
import Footer   from '../components/footer'
 
import { connect } from "react-redux";
 
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
 
import {style} from './style'

registerKilledListener();
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
	 
	  }
	}
	 
	async componentWillMount(){
		const status   = await AsyncStorage.getItem('status')
	
		if(status){
			const idUsuario = await AsyncStorage.getItem('userId')
			const nombre    = await AsyncStorage.getItem('nombre')
			const email 	  = await AsyncStorage.getItem('email')
			const avatar    = await AsyncStorage.getItem('avatar')
			const acceso   	= await AsyncStorage.getItem('acceso')
			this.setState({nombre, email, avatar, idUsuario, acceso})
		}
		this.setState({status})
	}
	async componentDidMount() {
		//FCM.createNotificationChannel is mandatory for Android targeting >=8. Otherwise you won't see any notification
		FCM.createNotificationChannel({
		  id: 'default',
		  name: 'Default',
		  description: 'used for example',
		  priority: 'high'
		})
		registerAppListener(this.props.navigation);
		FCM.getInitialNotification().then(notif => {
		  this.setState({
			initNotif: notif
		  });
			console.log(notif)
		  if (notif && notif.targetScreen === "Home") {
			setTimeout(() => {
			  this.props.navigation.navigate("Detail");
			}, 500);
		  }
		});
	
		try {
		  let result = await FCM.requestPermissions({
				badge: false,
				sound: true,
				alert: true
		  });
		} catch (e) {
		  console.error(e);
		}
	
		FCM.getFCMToken().then(token => {
		  console.log("TOKEN (getFCMToken)", token);
		  this.setState({ token: token || "" });
		});
	
		if (Platform.OS === "ios") {
		  FCM.getAPNSToken().then(token => {
			console.log("APNS TOKEN (getFCMToken)", token);
		  });
		}
	}
			 
	renderBotones(){
		const {navigation} = this.props
		const {nombre, email, acceso} = this.state
		return(
			<View>
				<TouchableOpacity style={style.btn} onPress={()=>navigation.navigate("nuevo_pedido")}>
					<Icon name="plus-square" style={style.icon} />
					<Text style={style.text}>NUEVO PEDIDO</Text>
				</TouchableOpacity>
				<TouchableOpacity style={style.btn} onPress={()=>navigation.navigate("mensaje")}>
					<Icon name="comments" style={style.icon} />
					<Text style={style.text}>CHAT</Text>
				</TouchableOpacity>
			</View>	
		)
	}
	render(){
		const {navigation} = this.props
	    return (
				<View style={style.container}>
					{this.renderBotones()}
					<Footer navigation={navigation} />
				</View>
		)
	}
 
}

const mapState = state => {
	return {
		 
	  };
  };
  
	const mapDispatch = dispatch => {
		return {
		
		};
	};
  
  Home.defaultProps = {
	 
  };
  
  Home.propTypes = {
	 
  };
  
  export default connect(
	mapState,
	mapDispatch
  )(Home);
  