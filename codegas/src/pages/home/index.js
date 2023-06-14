import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Platform, Dimensions, Modal, TextInput, ImageBackground, Image} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
// import FCM, { NotificationActionType } from "react-native-fcm";
import moment 			       from 'moment'
// import { registerAppListener } from "../push/Listeners";
import Footer   from '../components/footer'
import { connect } from "react-redux";
 
import {URL} from "../../utils/url" 
import {style} from './style'
import axios from 'axios';
// import Toast from 'react-native-simple-toast';
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import {getPedidos, getZonasPedidos} from '../../redux/actions/pedidoActions' 
  
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
		this.props.getVehiculos(30)
		this.props.getPedidos(undefined, 160)
 
  
		 
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////		FUNCIONES PARA LAS NOTIFICACIONES
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	async componentDidMount() {
		//FCM.createNotificationChannel is mandatory for Android targeting >=8. Otherwise you won't see any notification
		// console.log({nav:this.props.navigation})
		// FCM.createNotificationChannel({
		//   id: 'default',
		//   name: 'Default',
		//   description: 'used for example',
		//   priority: 'high'
		// })
		// registerAppListener(this.props.navigation);
		// FCM.getInitialNotification().then(notif => {
		//   this.setState({ initNotif: notif });
		// 	console.log(notif)
		//   if (notif && notif.targetScreen === "Home") {
		// 	setTimeout(() => {
		// 	  this.props.navigation.navigate("Detail");
		// 	}, 500);
		//   }
		// });
	
		// try {
		//   let result = await FCM.requestPermissions({
		// 		badge: true,
		// 		sound: true,
		// 		alert: true
		//   });
		// } catch (e) {
		//   console.error(e);
		// }
	
		// FCM.getFCMToken().then(token => {
		// 	console.log(token)
		// 	this.setState({ tokenPhone: token || "" });
		// 	AsyncStorage.setItem('tokenPhone', token ?JSON.stringify(token) :"")
		// });
	
		// if (Platform.OS === "ios") {
		//   FCM.getAPNSToken().then(token => {
		// 	// console.log("APNS TOKEN (getFCMToken)", token);
		//   });
		// }
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
				<TouchableOpacity style={[style.btn, {marginTop:10}]} onPress={()=>navigation.navigate(userId ?'nuevo_pedido' :"perfil")}>
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
											<Icon name='times-circle' style={style.iconCerrar} />
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
		const {acceso} = this.state
	    return (
				<ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo.jpg')} >
					{this.renderFormulario()}
					{(acceso=="solucion" || acceso=="admin") &&this.renderBtnUsuarios()}
					{this.renderBotones()}
					<View style={style.contenedorColores}>
						<View style={style.subContenedorColor}>	
							<View style={[style.color, {backgroundColor:"rgba(91, 192, 222, 0.79)"}]}></View>
							<Text style={style.textColor}>Pedido en espera</Text>
						</View>
						<View style={style.subContenedorColor}>
							<View style={[style.color, {backgroundColor:"rgba(255, 235, 0, 0.79)"}]}></View>
							<Text style={style.textColor}>Pedido activo</Text>
						</View>
						<View style={style.subContenedorColor}>
							<View style={[style.color, {backgroundColor:"rgba(240, 173, 78, 0.79)"}]}></View>
							<Text style={style.textColor}>Pedido asignado</Text>
						</View>
						<View style={style.subContenedorColor}>
							<View style={[style.color, {backgroundColor:"rgba(92, 184, 92, 0.79)"}]}></View>
							<Text style={style.textColor}>Pedido entregado</Text>
						</View>
						<View style={style.subContenedorColor}>
							<View style={[style.color, {backgroundColor:"#ffffff"}]}></View>
							<Text style={style.textColor}>Pedido no entregado</Text>
						</View>
						<View style={style.subContenedorColor}>
							<View style={[style.color, {backgroundColor:"rgba(217, 83, 79, 0.79)"}]}></View>
							<Text style={style.textColor}>Pedido inactivo</Text>
						</View>
					</View>
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
				// Toast.show("Tenemos un problema, intentelo mas tarde")
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
		getVehiculos: (limit) => {
			dispatch(getVehiculos(limit));
		},
		getPedidos: (date, limit) => {
			dispatch(getPedidos(date, limit));
		},
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
  