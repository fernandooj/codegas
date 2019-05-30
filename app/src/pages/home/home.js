import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Platform, Dimensions, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import FCM, { NotificationActionType } from "react-native-fcm";
import { registerKilledListener, registerAppListener } from "../push/Listeners";
import Footer   from '../components/footer'
import { connect } from "react-redux";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import SocketIOClient from 'socket.io-client';
import {URL} from "../../../App" 
import {style} from './style'
import axios from 'axios';
import Toast from 'react-native-simple-toast';

registerKilledListener();
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
			usuariosEntrando:[]
	  }
	}
	 
	async componentWillMount(){
		try{
			const userId    			 = await AsyncStorage.getItem('userId')
			const nombre    			 = await AsyncStorage.getItem('nombre')
			const email 					 = await AsyncStorage.getItem('email')
			const avatar    			 = await AsyncStorage.getItem('avatar')
			const acceso    			 = await AsyncStorage.getItem('acceso')
			let usuariosEntrando   = await AsyncStorage.getItem('usuariosEntrando')
			usuariosEntrando = usuariosEntrando ?usuariosEntrando :"[]"
			usuariosEntrando = JSON.parse(usuariosEntrando)
			if(acceso=="solucion" || acceso=="admin"){
				this.socket = SocketIOClient(URL);
				this.socket.on(`nuevoChat`, 	this.reciveMensanje.bind(this));
			}
			userId ?this.setState({userId, nombre, email, avatar, acceso, usuariosEntrando}) :null
		}catch(e){
				console.log(e)
		}

			
		 
		// this.setState({status})
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
		  // console.log("TOKEN (getFCMToken)", token);
		  this.setState({ token: token || "" });
		});
	
		if (Platform.OS === "ios") {
		  FCM.getAPNSToken().then(token => {
			// console.log("APNS TOKEN (getFCMToken)", token);
		  });
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////		RECIBE LA LLAMADA ENTRANTE DEL CHAT, ESTO SOLO PARA LOS USUARIOS ADMIN Y SOLUCION, SI EL USUARIO EXISTE NO LO INSERTO EN EL ARRAY
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	async reciveMensanje(mensaje){
		let {usuariosEntrando} = this.state
		let estaUsuario = usuariosEntrando.filter(e=>{
			return e.tokenPhone==mensaje.tokenPhone
		})
		estaUsuario.length==0 &&usuariosEntrando.push(mensaje)
		this.setState({usuariosEntrando})
		
		AsyncStorage.setItem('usuariosEntrando', JSON.stringify(usuariosEntrando))
	 
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
				<TouchableOpacity style={style.btn} onPress={()=>navigation.navigate("conversacion")}>
					<Icon name="comments" style={style.icon} />
					<Text style={style.text}>CHAT</Text>
				</TouchableOpacity>
			</View>	
		)
	}
	renderBtnUsuarios(){ 
		return(
			<TouchableOpacity style={style.btnUsuariosOnline} onPress={()=>this.crearConversacion()}>
				<Text style={style.textUsuariosOnline}>Hay {this.state.usuariosEntrando.length} Usuarios en espera </Text>
			</TouchableOpacity>
		)
	}

	render(){
		const {navigation} = this.props
		const {acceso} = this.state
	    return (
				<View style={style.container}>
					{(acceso=="solucion" || acceso=="admin") &&this.renderBtnUsuarios()}
					{this.renderBotones()}
					<Footer navigation={navigation} />
				</View>
		)
	}
	crearConversacion(){
		const {usuariosEntrando}  = this.state
		axios.post(`con/conversacion/`, {...usuariosEntrando[0]})
		.then(res=>{
			console.log(res.data)
			if(res.data.status){
				this.eliminaUsuarioEntrando(usuariosEntrando.slice(1, usuariosEntrando.length), res.data.conversacion._id)
			}else{
				Toast.show("Tenemos un problema, intentelo mas tarde")
			}
		})
	}
	async eliminaUsuarioEntrando(usuariosEntrando, id){
		AsyncStorage.setItem('usuariosEntrando', JSON.stringify(usuariosEntrando))
		this.setState({usuariosEntrando})
		this.props.navigation.navigate("mensaje", {id})
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
  