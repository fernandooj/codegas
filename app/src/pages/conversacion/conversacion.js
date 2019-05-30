import React, {Component} from 'react'
import {View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Platform, Image} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios     from 'axios' 
import moment 			   from 'moment-timezone'
import Spinner   from 'react-native-spinkit' 
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import {sendRemoteNotification} from '../push/envioNotificacion';
import SocketIOClient from 'socket.io-client';
import { getConversaciones } from "../../redux/actions/mensajeActions";
import Footer   from '../components/footer'
import {URL} from "../../../App"
class Mensaje extends Component{
	constructor(props) {
	  super(props);
	  this.state={
		top:0,
        bottom:0,
        showSpin:true
	  }
	}
	async componentWillMount(){
		// const {id, titulo, nombre, avatar} = this.props.navigation.state.params
		// console.log({titulo, nombre, avatar, id})
		// this.props.getMensaje(id)
		// this.socket = SocketIOClient(URL);
		// this.socket.on(`chatConversacion`, 	this.reciveMensanje.bind(this));
		try{
			const acceso 	 = await AsyncStorage.getItem('acceso')
			const tokenPhone = await AsyncStorage.getItem('tokenPhone')
			if(acceso){
				this.props.getConversaciones()
				this.setState({showSpin:false})
			}else{
				setTimeout(() => {
					setInterval(() => {
						axios.get(`con/conversacion/byTokenPhone/${tokenPhone}/true/fernando/papi@gmail.com`)
						.then(res=>{
							console.log(res.data)
							res.data.status &&this.props.navigation.navigate("mensaje", {id:res.data.mensaje._id})
						})
					}, 1000);
				}, 1000);	

			}
		}catch(e){
            console.log(e)
        }
	}  
	renderConversaciones(){
		return this.props.conversaciones.map((e,key)=>{
			return(
				<View style={e.activo ?style.subContenedorActivo :style.subContenedorInActivo} key={key}>
					<View style={style.contenedorTexto}>
						<View style={style.subContenedorConversacion}>
							<Text>Nombre: </Text>
							<Text>{e.nombre}</Text>
						</View>
						<View style={style.subContenedorConversacion}>
							<Text>Celular: </Text>
							<Text>{e.celular}</Text>
						</View>
						<View style={style.subContenedorConversacion}>
							<Text>Fecha Creado: </Text>
							<Text>{moment(e.creado).format("YYYY-MM-DD h:mm a")}</Text>
						</View>
					</View>
					<TouchableOpacity style={style.btnRight} onPress={()=>this.props.navigation.navigate("mensaje",{id:e._id})}>
						<Icon name={'chevron-right'} style={style.iconRight} />
					</TouchableOpacity>
				</View>
			) 
		})
	} 
	  
	render(){
		const {showSpin} = this.state
		const {navigation} = this.props
        if(showSpin){
            return (
                <View style={style.containerSpinner}>
                    <Spinner style={style.spinner} isVisible={true} size={100} type="Bounce" color="#00218b"/>
                    <Text>Estamos buscando un agente</Text>
                </View>
            )
        }else{
            return (
                <View style={style.container}>
					<Text style={style.titulo}>Historial chats</Text>
					<ScrollView  style={style.subContainer}>
                    	{this.renderConversaciones()}
					</ScrollView>
					<Footer navigation={navigation} />
                </View>   
            )
        }
	}
	handleSubmit(){
		  
	}
}
const mapState = state => {
	// let mensajes = state.conversacion.mensaje[0].mensaje.reverse()
	// let usuario =  state.conversacion.mensaje[0].usuario
	// let tokenPhoneFiltro = mensajes.filter(e=>{if(e.username==usuario) return e})
	// let tokenPhone = tokenPhoneFiltro[0] ?tokenPhoneFiltro[0].tokenPhone :""
	console.log(state)
	return {
		conversaciones:state.mensaje.conversaciones,
		// usuario,
		// tokenPhone
	};
};
  
const mapDispatch = dispatch => {
	return {
		getConversaciones: (id) => {
			dispatch(getConversaciones(id));
		},
	};
};
Mensaje.defaultProps = {
	mensaje: [],
};
 
 
 
	   
export default connect(mapState, mapDispatch)(Mensaje) 
