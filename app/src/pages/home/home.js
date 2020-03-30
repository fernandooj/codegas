import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Platform, Dimensions, Modal, TextInput, ImageBackground, Image} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import FCM, { NotificationActionType } from "react-native-fcm";
import moment 			       from 'moment-timezone'
import { registerAppListener } from "../push/Listeners";
import Footer   from '../components/footer'
import { connect } from "react-redux";
import SocketIOClient from 'socket.io-client';
import {URL} from "../../../App" 
import {style} from './style'
import axios from 'axios';
import Toast from 'react-native-simple-toast';
 
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
		let usuariosEntrando   = await AsyncStorage.getItem('usuariosEntrando') ///// muestra la suma de usuarios que estan ingresando al chat
		let userId 						 = await AsyncStorage.getItem('userId');
		usuariosEntrando = usuariosEntrando ?usuariosEntrando :"[]"
		usuariosEntrando = JSON.parse(usuariosEntrando)
		let url = (userId===null || userId==='0') ? 'user/perfil/' :`user/perfil/${userId}`
		axios.get(url)
		.then((res)=>{
			console.log("res.data")
			console.log(res.data)
			if(res.data.status){
				const userId = res.data.user._id
				const nombre = res.data.user.nombre
				const email  = res.data.user.email
				const avatar = res.data.user.avatar
				const acceso = res.data.user.acceso
				const celular = res.data.user.celular
			
				if(!nombre &&userId){
					 
					this.props.navigation.navigate("verPerfil", {tipoAcceso:null}) ///// si se registro y no lleno los datos lo envio a editar el perfil
				}else{
					if(acceso=="solucion" || acceso=="admin"){
						this.socket = SocketIOClient(URL);
						this.socket.on(`nuevoChat`, 	this.reciveMensanje.bind(this));
					}else{
					 
						this.setState({nombre:"", email:"", celular:""})
					}
					userId ?this.setState({userId, nombre, email, celular, avatar, acceso, usuariosEntrando}) :null
				}
			}else{
				//////////////////////// para saber si muestra el formulario del chat //////////////////////////
				FCM.getFCMToken().then(token => {
					axios.get(`users/formulario_chat/${token}/${true}`)
					.then(res2=>{
					 
						res2.data.status ?this.setState({formularioChat:true}) :this.setState({formularioChat:false})
					})
				})
				////////////////////////////////////////////////////////////////////////////////////////////////
			}
		})
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////		FUNCIONES PARA LAS NOTIFICACIONES
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	async componentDidMount() {
		//FCM.createNotificationChannel is mandatory for Android targeting >=8. Otherwise you won't see any notification
		// console.log({nav:this.props.navigation})
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
			AsyncStorage.setItem('tokenPhone', token ?JSON.stringify(token) :"")
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
		let {usuariosEntrando} = this.state //////// es el array con los usuarios que estan entrando a abrir el chat
		if(mensaje.activo){
			////////////////////////////////////////////////////////////////////////
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
		}else{
		 
			console.log("usuariosEntrando1")
			console.log(usuariosEntrando)
			usuariosEntrando= usuariosEntrando.filter(e=>{
				return e.tokenPhone!==mensaje.tokenPhone
			})
			this.setState({usuariosEntrando})
			AsyncStorage.setItem('usuariosEntrando', JSON.stringify(usuariosEntrando))
		}
		
	 
	} 	 

	renderBotones(){
		const {navigation} = this.props
		const {acceso, tokenPhone, formularioChat, userId} = this.state
		return(
			<View>
				<TouchableOpacity style={[style.btn, {marginTop:50}]} onPress={()=>navigation.navigate(userId ?'nuevo_pedido' :"perfil")}>
					<Image source={require('../../assets/img/pg2/bot02.png')} style={style.icon}/>
					<Text style={style.text}>NUEVO PEDIDO</Text>
				</TouchableOpacity>
				{
					acceso=="cliente"
					&&<TouchableOpacity style={[style.btn, {marginTop:10}]} onPress={()=>navigation.navigate('chart')}>
						<Image source={require('../../assets/img/pg2/bot02.png')} style={style.icon}/>
						<Text style={style.text}>INFORMES</Text>
					</TouchableOpacity>
				}
				{
					acceso!="pedidos"
					&&<TouchableOpacity style={style.btn} onPress={()=>acceso=="admin" || acceso=="solucion" ?navigation.navigate("conversacion", {tokenPhone, acceso}) :formularioChat ?navigation.navigate("conversacion", {tokenPhone, acceso}) :this.setState({modal:true})}>
						<Image source={require('../../assets/img/pg2/bot03.png')} style={style.icon}/>
						<Text style={style.text}>CHAT</Text>
					</TouchableOpacity>
				}
			</View>	
		)
	}
	renderBtnUsuarios(){ 
		return(
			<ImageBackground style={style.fondoOnline} source={require('../../assets/img/pg2/bot01.png')}  resizeMode={'contain'} >
				<TouchableOpacity style={style.btnUsuariosOnline} onPress={this.state.usuariosEntrando.length==0?null :()=>this.crearConversacion()}>
					<Text style={style.textUsuariosOnline}>Hay {this.state.usuariosEntrando.length} Usuarios en espera </Text>
				</TouchableOpacity>
			</ImageBackground>
		)
	}
	renderFormulario(){
		const {modal, email, nombre, celular} = this.state
		var today = new Date().getHours();
		let dia = moment().format('dddd');
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
									<Text style={style.tituloModal2}>Horario de atención de lunes a viernes 7:00AM - 5:00PM. </Text>
									{
										(dia=="Saturday" || dia=="Sunday")  || !horaLaboral
										?null
										:<View>
										<Text style={style.tituloModal2}>Ingresa tus datos para iniciar </Text>
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
		const {acceso, userId, nombre} = this.state
		console.log({userId, nombre, acceso})
	    return (
				<ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo.jpg')} >
					{this.renderFormulario()}
					{(acceso=="solucion" || acceso=="admin") &&this.renderBtnUsuarios()}
					{this.renderBotones()}
					<Footer navigation={navigation} />
				</ImageBackground>
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
  