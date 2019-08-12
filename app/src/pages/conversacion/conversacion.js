import React, {Component} from 'react'
import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios     from 'axios' 
import moment 			   from 'moment-timezone'
import Spinner   from 'react-native-spinkit' 
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
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
	  this.conversacion = this.conversacion.bind(this)
	}
	componentWillMount(){
		this.socket = SocketIOClient(URL);
		this.socket.on(`chatConversacion`, 	 this.reciveMensanje.bind(this));
	}
	async componentDidMount(){
		const {nombre, email, celular} = this.props.navigation.state.params
		try {
			const acceso       = await AsyncStorage.getItem('acceso') //// acceso del usuario si estas logueado
			const tokenPhone   = await AsyncStorage.getItem('tokenPhone') //// acceso del usuario si estas logueado
			const minutoInicio = await AsyncStorage.getItem('minutoInicio') //// acceso del usuario si estas logueado
			console.log("otro negrito")
			if(acceso=="admin" || acceso=="solucion"){
				this.props.getConversaciones()
				this.setState({showSpin:false})
			}else{			
				//el ultimo parametro avisa si le envia la notificacion a los admin de que hay un chat entrante
				console.log("negrito")
				axios.get(`con/conversacion/byTokenPhone/${JSON.parse(tokenPhone)}/true/${nombre}/${email}/${celular}/true`)
				.then(res=>{
					console.log({status:res.data})
					if(res.data.status){
						clearInterval(this.myInterval);
						this.props.navigation.navigate("mensaje", {id:res.data.mensaje._id})
					}else{

						this.myInterval = setInterval(()=>this.conversacion(minutoInicio), 2000)
					}
				})
			}
			
		} catch (error) {
			
		}
	}  
	reciveMensanje(messages) {
		this.props.getConversaciones()
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	////////// Llama al servidor cada 2 segundos, a revisar si se creo la conversacion con el tokenPhone
	///////// parametros: minutoInicio-->minuto en el que se requirio el chat, minutoFinal-->minuto actual, si se han pasado mas de 3 minutos devuelve al usuario al home
	conversacion(minutoInicio){
		let minutoActual = moment().format('mm');
		let minutoFinal  = parseInt(minutoActual) - parseInt(minutoInicio)
		console.log({minutoInicio, minutoActual, minutoFinal})
		const {acceso, tokenPhone, nombre, email, celular} = this.props.navigation.state.params
	 
		if(minutoFinal>=0 && minutoFinal<3){
			axios.get(`con/conversacion/byTokenPhone/${tokenPhone}/true/${nombre}/${email}/${celular}/false`)
			.then(res=>{
				console.log(res.data)
				if(res.data.status){
					clearInterval(this.myInterval);
					this.props.navigation.navigate("mensaje", {id:res.data.mensaje._id})
				}else{
					
				}
			})
		}else{
			alert("En este momento nuestros agentes estan ocupados intentalo mas tarde")
			AsyncStorage.removeItem('formularioChat')
			this.props.navigation.navigate("Home") 
		}
	}
	componentWillUnmount(){
		console.log(`Unmounting... clearing interval`);
    	clearInterval(this.myInterval);
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
							<Text>{e.creado}</Text>
						</View>
					</View>
					<TouchableOpacity style={style.btnRight} onPress={()=>this.actualizaBadge(e._id)}>
						<Icon name={'chevron-right'} style={style.iconRight} />
						{e.badge>0 &&<View style={style.badge}><Text style={style.textBadge}>{e.badge}</Text></View>}
					</TouchableOpacity>
				</View>
			) 
		})
	} 
	actualizaBadge(id){
		axios.get(`con/conversacion/actualizaBadge/${id}`)
		.then(res=>{
			res.data.status ?this.props.navigation.navigate("mensaje",{id}) :alert("tenemos problemas tecnicos, intentalo mas tarde")
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
					<Footer navigation={navigation} />
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
