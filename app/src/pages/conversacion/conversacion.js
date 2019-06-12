import React, {Component} from 'react'
import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios     from 'axios' 
import moment 			   from 'moment-timezone'
import Spinner   from 'react-native-spinkit' 
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import { getConversaciones } from "../../redux/actions/mensajeActions";
import Footer   from '../components/footer'
 
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
	 
	async componentDidMount(){
		const {nombre, email, celular} = this.props.navigation.state.params
		try {
			const acceso   = await AsyncStorage.getItem('acceso') //// acceso del usuario si estas logueado
			const tokenPhone   = await AsyncStorage.getItem('tokenPhone') //// acceso del usuario si estas logueado
			if(acceso){
				this.props.getConversaciones()
				this.setState({showSpin:false})
			}else{			
				axios.get(`con/conversacion/byTokenPhone/${JSON.parse(tokenPhone)}/true/${nombre}/${email}/${celular}`)
				.then(res=>{
 
					if(res.data.status){
						clearInterval(this.myInterval);
						this.props.navigation.navigate("mensaje", {id:res.data.mensaje._id})
					}else{
						this.myInterval = setInterval(()=>this.conversacion(), 2000)
					}
				})
			}
			
		} catch (error) {
			
		}
	}  
	conversacion(){
		const {acceso, tokenPhone, nombre, email, celular} = this.props.navigation.state.params
		console.log({acceso, tokenPhone})		 
		axios.get(`con/conversacion/byTokenPhone/${tokenPhone}/true/${nombre}/${email}/${celular}`)
		.then(res=>{
			console.log(res.data)
			if(res.data.status){
				clearInterval(this.myInterval);
				this.props.navigation.navigate("mensaje", {id:res.data.mensaje._id})
			}else{
				
			}
		})
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
