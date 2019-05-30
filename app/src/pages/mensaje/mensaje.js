import React, {Component} from 'react'
import {View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Platform, Image} from 'react-native'
import {connect} 						from 'react-redux' 
import axios     						from 'axios' 
import Icon 		   					from 'react-native-fa-icons' 
import { getMensajes, getConversacion }	from "../../redux/actions/mensajeActions";
import {sendRemoteNotification} 		from '../push/envioNotificacion';
import SocketIOClient 					from 'socket.io-client';
import {style}   						from './style'
import {URL} 							from "../../../App"
class Conversacion extends Component{
	constructor(props) {
	  super(props);
	  this.state={
		top:0,
		bottom:0
	  }
	}
	componentWillMount(){
		const {id} = this.props.navigation.state.params
		// const id = "5ce23cbffb113a1bd5e0dd2e"
		console.log({id})
		this.props.getMensajes(id)
		this.props.getConversacion(id)
		// this.socket = SocketIOClient(URL);
		// this.socket.on(`chatConversacion`, 	this.reciveMensanje.bind(this));
	}  
	// reciveMensanje(mensaje){
	// 	this.props.getMensaje(this.props.navigation.state.params.id)
	// } 
	renderMensajes(){
		const {usuario, mensaje} = this.props
		console.log(mensaje)
		return mensaje.map((e, key)=>{
			return(
				<View style={usuario==e.username ?style.conMensaje1 :style.conMensaje2} key={key}>
					<Text style={usuario==e.username ?style.mensaje1 :style.mensaje2}>{e.mensaje}</Text>	
				</View>
			)
		})
	}
	renderCabezera(){
		const {usuarioId1} = this.props.conversacion
		console.log(usuarioId1)
		return(
			<View style={style.contenedorCabezera}>
				<TouchableOpacity onPress={()=>this.props.navigation.navigate("conversacion")}>
					<Icon name={'chevron-left'} style={style.iconCabezera} />
				</TouchableOpacity>
				<TouchableOpacity style={style.contenedorAvatar} >
					<Image source={{uri:usuarioId1.avatar}} style={style.avatar} />
				</TouchableOpacity>	
				<View>
					 
					<Text>{usuarioId1.nombre}</Text>
				</View>
			</View>
		)
	}
	renderFooter(){
		const {bottom} = this.state
		return(
			<View style={style.contenedorFooter}>
				<TextInput
					 
                    value={this.state.mensaje}
                    onChangeText={mensaje => this.setState({ mensaje })}
					style={style.input}
					ref='username' 
                />
				<TouchableOpacity onPress={()=>this.handleSubmit()} style={style.btnEnviar}>
					<Icon name={'paper-plane'} style={style.icon} />
				</TouchableOpacity>
			</View>
		)
	}
	render(){
		const {keyboardOpen} = this.state
        return (
            <View style={style.container}>
				 
				{this.renderCabezera()}
				{
					Platform.OS=='android'
						?<View style={{flex:1}}>
							<KeyboardAvoidingView style={style.contenedorMensajes} keyboardVerticalOffset={0} >
								<ScrollView  ref={(view) => { this.scrollView = view }} style={style.subContenedorMensajes}
									onContentSizeChange={(width,height) => this.scrollView.scrollTo({y:height})} 
								>
								{ this.renderMensajes()}
								</ScrollView> 
							</KeyboardAvoidingView>
							<View>
								{this.renderFooter()}
							</View>
						</View>
					:<KeyboardAvoidingView style={style.contenedorMensajes} keyboardVerticalOffset={32}  behavior={"position"} >
					<ScrollView  ref={(view) => { this.scrollView = view }} style={style.subContenedorMensajes}
						onContentSizeChange={(width,height) => this.scrollView.scrollTo({y:height})} 
						>
						{
							this.renderMensajes()
						}
					</ScrollView> 
					<View>
						{this.renderFooter()}
					</View>
						
					</KeyboardAvoidingView>
				}
					
            </View>
            
        )
	}
	handleSubmit(){
		this.setState({showSpin:true})
		const {tokenPhone, match, usuario} = this.props
		const {id, titulo, nombre, username, avatar} = this.props.navigation.state.params
		const {mensaje} = this.state
		const Fullmensaje = {
			mensaje: mensaje, 
			username:username,
			nombre:nombre,
			conversacionId:id
		}
		this.socket = SocketIOClient(URL);
		this.socket.emit('chatConversacion', JSON.stringify(Fullmensaje))
		
		console.log(id)
		axios.post('men/mensaje/'+id, {mensaje, email:usuario})
		.then(e=>{
			if(e.data.status){
				this.setState({mensaje:"", showSpin:false}) 
				sendRemoteNotification(1, tokenPhone, "conversacion", "nuevo mensaje", `: ${mensaje}`, null, null )
			}else{
				alert("Opss!! tuvimos un error intentalo nuevamente")
			}
		})
		.catch(err=>{
			console.log(err)
		})
	}
}
const mapState = state => {
	console.log(state)
	return {
		conversacion:state.mensaje.conversacion,
		mensaje:state.mensaje.mensaje,
		// tokenPhone
	};
};
  
const mapDispatch = dispatch => {
	return {
		getMensajes: (id) => {
			dispatch(getMensajes(id));
		},
		getConversacion: (id) => {
			dispatch(getConversacion(id));
		},
	};
};
Conversacion.defaultProps = {
	mensaje: [],
};
 
 
 
	   
export default connect(mapState, mapDispatch)(Conversacion) 
