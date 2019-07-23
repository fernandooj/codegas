import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Platform, Dimensions, Modal, TextInput} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import FCM, { NotificationActionType } from "react-native-fcm";
import moment 			       from 'moment-timezone'
import { registerAppListener } from "../push/Listeners";
import Footer   from '../components/footer'
import { connect } from "react-redux";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import SocketIOClient from 'socket.io-client';
import {URL} from "../../../App" 
import {style} from './style'
import axios from 'axios';
import Toast from 'react-native-simple-toast';

 
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
			usuariosEntrando:[],
			nombre:"",
			email:"",
			celular:"",
			modal:false
	  }
	}
	 
	async componentWillMount(){
		try{
			const userId    			 = await AsyncStorage.getItem('userId') //// id del usuario si estas logueado
			const nombre    			 = await AsyncStorage.getItem('nombre') //// nombre del usuario si estas logueado
			const email 					 = await AsyncStorage.getItem('email')  //// email del usuario si estas logueado
			const avatar    			 = await AsyncStorage.getItem('avatar') //// avatar del usuario si estas logueado
			const acceso    			 = await AsyncStorage.getItem('acceso') //// acceso del usuario si estas logueado
			const formularioChat	 = await AsyncStorage.getItem('formularioChat') //// Muestra el formulario al usuario para entrar al chat, si no lo ha llenado
			let usuariosEntrando   = await AsyncStorage.getItem('usuariosEntrando') ///// array de los usuarios que estan llamando en el chat
			usuariosEntrando = usuariosEntrando ?usuariosEntrando :"[]"
			usuariosEntrando = JSON.parse(usuariosEntrando)
			this.setState({formularioChat})
			console.log({formularioChat})
			if(acceso=="solucion" || acceso=="admin"){
				this.socket = SocketIOClient(URL);
				this.socket.on(`nuevoChat`, 	this.reciveMensanje.bind(this));
			}else{
				this.setState({formularioChat, nombre:"", email:"", celular:""})
			}
			userId ?this.setState({userId, nombre, email, avatar, acceso, usuariosEntrando}) :null
		}catch(e){
				console.log(e)
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////		FUNCIONES PARA LAS NOTIFICACIONES
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
		  this.setState({ initNotif: notif });
			console.log(notif)
		  if (notif && notif.targetScreen === "Home") {
			setTimeout(() => {
			  this.props.navigation.navigate("Detail");
			}, 500);
		  }
		});
	
		try {
		  let result = await FCM.requestPermissions({
				badge: true,
				sound: true,
				alert: true
		  });
		} catch (e) {
		  console.error(e);
		}
	
		FCM.getFCMToken().then(token => {
			console.log(token)
			this.setState({ tokenPhone: token || "" });
			AsyncStorage.setItem('tokenPhone', JSON.stringify(token))
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
		console.log("mensaje")
		console.log(mensaje)
 
		let {usuariosEntrando} = this.state
		console.log("usuariosEntrando1")
		console.log(usuariosEntrando)
		let estaUsuario = usuariosEntrando.filter(e=>{
			return e.tokenPhone==mensaje.tokenPhone
		})
		estaUsuario.length===0 ?usuariosEntrando.push(mensaje) :null
		console.log("usuariosEntrando2")
		console.log(estaUsuario)
		console.log("----------------------------")
		this.setState({usuariosEntrando})
		AsyncStorage.setItem('usuariosEntrando', JSON.stringify(usuariosEntrando))
	 
	} 	 

	renderBotones(){
		const {navigation} = this.props
		const {acceso, tokenPhone, formularioChat} = this.state
		console.log({formularioChat, acceso})
		return(
			<View>
				<TouchableOpacity style={style.btn} onPress={()=>navigation.navigate("nuevo_pedido")}>
					<Icon name="plus-square" style={style.icon} />
					<Text style={style.text}>NUEVO PEDIDO</Text>
				</TouchableOpacity>
				<TouchableOpacity style={style.btn} onPress={()=>acceso=="admin" || acceso=="solucion" ?navigation.navigate("conversacion", {tokenPhone, acceso}) :formularioChat ?navigation.navigate("conversacion", {tokenPhone, acceso}) :this.setState({modal:true})}>
					<Icon name="comments" style={style.icon} />
					<Text style={style.text}>CHAT</Text>
				</TouchableOpacity>
			</View>	
		)
	}
	renderBtnUsuarios(){ 
		console.log(this.state.usuariosEntrando.length)
		return(
			<TouchableOpacity style={style.btnUsuariosOnline} onPress={this.state.usuariosEntrando.length==0?null :()=>this.crearConversacion()}>
				<Text style={style.textUsuariosOnline}>Hay {this.state.usuariosEntrando.length} Usuarios en espera </Text>
			</TouchableOpacity>
		)
	}
	renderFormulario(){
		const {navigation} = this.props
		const {modal, email, nombre, celular} = this.state
		let dia = moment().format('dddd');
		var today = new Date().getHours();
		let horaLaboral;
		if (today >= 8 && today <= 17) {
			horaLaboral=true
		} else {
			horaLaboral=false
		}
	 
		return(
			<Modal transparent visible={modal} animationType="fade" >
				<TouchableOpacity activeOpacity={1}>   
						<View style={style.contenedorModal}>
								<View style={style.subContenedorModal}>
									<TouchableOpacity activeOpacity={1} onPress={() => this.setState({modal:false})} style={style.btnModalClose}>
											<Icon name={'times-circle'} style={style.iconCerrar} />
									</TouchableOpacity>
									<Text style={style.tituloModal}>Bienvenido a nuestro chat </Text>
									<Text>Horario de atención es lunes a viernes 8:00AM - 5:00PM. </Text>
									{
										(dia=="Saturday" || dia=="Sunday") || !horaLaboral
										?null
										:<View>
										<Text>Ingresa tus datos para iniciar </Text>
										<TextInput
											value={nombre}
											onChangeText={nombre => this.setState({ nombre })}
											style={style.input}
											placeholder='Nombre' 
										/>
										<TextInput
											value={email}
											onChangeText={email => this.setState({ email })}
											style={style.input}
											placeholder='Email' 
											keyboardType="email-address"
										/>
										<TextInput
											value={celular}
											onChangeText={celular => this.setState({ celular })}
											style={style.input}
											placeholder='celular' 
											keyboardType="numeric"
										/>
										<TouchableOpacity style={nombre.length<3 || celular.length<2 || email.length<2 ?style.btnGuardarDisable :style.btnGuardar} 
											onPress={()=>nombre.length<3 || celular.length<2 || email.length<2 ?alert("todos los campos son obligatorios") :this.redireccionarConversacion()}>
												<Text style={style.textGuardar}>Iniciar</Text>
										</TouchableOpacity>
									</View>
									}
									
								</View>
						</View>
				</TouchableOpacity>
			</Modal>
		)
	}
	render(){
		const {navigation} = this.props
		const {acceso, usuariosEntrando} = this.state
	 
	    return (
				<View style={style.container}>
					{this.renderFormulario()}
					{(acceso=="solucion" || acceso=="admin") &&this.renderBtnUsuarios()}
					{this.renderBotones()}
					<Footer navigation={navigation} />
				</View>
		)
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////		GUARDO LA INFO DEL USUARIO, PARA QUE NO MUESTRE MAS EL FORMULARIO, HASTA QUE CIERRE LA SESION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	redireccionarConversacion(){
		const {navigation} = this.props
		const {email, nombre, celular, acceso, tokenPhone} = this.state
		this.setState({modal:false})
		let minuto = moment().format('mm');
		navigation.navigate("conversacion", {tokenPhone, acceso, nombre, email, celular})
		AsyncStorage.setItem('formularioChat', "true")
		AsyncStorage.setItem('minutoInicio',   minuto)
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////		CREA LA CONVERSACION, ESTO SOLO LO HACE EL ADMIN O SOLUCION,
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	crearConversacion(){
		const {usuariosEntrando, tokenPhone}  = this.state
		console.log({usuariosEntrando, tokenPhone} )
		axios.post(`con/conversacion/`, {...usuariosEntrando[0]})
		.then(res=>{
			console.log(res.data)
			if(res.data.status){
				this.eliminaUsuarioEntrando(usuariosEntrando.slice(1, usuariosEntrando.length), res.data.conversacion._id, tokenPhone)
			}else{
				Toast.show("Tenemos un problema, intentelo mas tarde")
			}
		})
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////		ELIMINO EL PRIMER USUARIO DEL ARRAY, UNA VEZ LE DE CLICK AL BOTON DE NUEVO CONVERSACION
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	async eliminaUsuarioEntrando(usuariosEntrando, id, tokenPhone){
		AsyncStorage.setItem('usuariosEntrando', JSON.stringify(usuariosEntrando))
		this.setState({usuariosEntrando})
		this.props.navigation.navigate("mensaje", {id, tokenPhone})
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
  