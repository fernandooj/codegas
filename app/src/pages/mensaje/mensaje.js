import React, {Component} from 'react'
import {View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Platform, Image} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios     from 'axios' 
import Icon      from 'react-native-fa-icons' 
import Spinner   from 'react-native-spinkit' 
// import { getMensaje } from "../../redux/actions/conversacionActions";
import {sendRemoteNotification} from '../push/envioNotificacion';
import SocketIOClient from 'socket.io-client';
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
	componentWillMount(){
		// const {id, titulo, nombre, avatar} = this.props.navigation.state.params
		// console.log({titulo, nombre, avatar, id})
		// this.props.getMensaje(id)
		// this.socket = SocketIOClient(URL);
        // this.socket.on(`chatConversacion`, 	this.reciveMensanje.bind(this));
        setTimeout(
            function() {
                this.setState({showSpin:false});
            }
            .bind(this),
            5000
        );
	}  
	reciveMensanje(mensaje){
		this.props.getMensaje(this.props.navigation.state.params.id)
	} 
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
		// const {titulo, nombre, avatar} = this.props.navigation.state.params
		return(
			<View style={style.contenedorCabezera}>
				<TouchableOpacity onPress={()=>this.props.navigation.navigate("conversacion")}>
					<Icon name={'chevron-left'} style={style.iconCabezera} />
				</TouchableOpacity>
				<TouchableOpacity style={style.contenedorAvatar} >
					<Image source={{uri:"https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1"}} style={style.avatar} />
				</TouchableOpacity>	
				<View>
					<Text style={style.titulo}></Text>
					<Text>Fernando Ortiz</Text>
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
        const {showSpin} = this.state
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
                      
                    {this.renderCabezera()}
                    {
                        Platform.OS=='android'
                            ?<View style={{flex:1}}>
                                <KeyboardAvoidingView style={style.contenedorMensajes} keyboardVerticalOffset={0} >
                                    <ScrollView  ref={(view) => { this.scrollView = view }} style={style.subContenedorMensajes}
                                        onContentSizeChange={(width,height) => this.scrollView.scrollTo({y:height})} 
                                    >
                                    {/* { this.renderMensajes()} */}
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
                                // this.renderMensajes()
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
	}
	handleSubmit(){
		this.setState({showSpin:true})
		const {tokenPhone, match, usuario} = this.props
		const {id, titulo, nombre, username, avatar} = this.props.navigation.state.params
		const {mensaje} = this.state
		const Fullmensaje = {
			mensaje: mensaje, 
			avatar: avatar,
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
	// let mensajes = state.conversacion.mensaje[0].mensaje.reverse()
	// let usuario =  state.conversacion.mensaje[0].usuario
	// let tokenPhoneFiltro = mensajes.filter(e=>{if(e.username==usuario) return e})
	// let tokenPhone = tokenPhoneFiltro[0] ?tokenPhoneFiltro[0].tokenPhone :""
	// console.log(state)
	return {
		// mensaje:mensajes,
		// usuario,
		// tokenPhone
	};
};
  
const mapDispatch = dispatch => {
	return {
		// getMensaje: (id) => {
		// 	dispatch(getMensaje(id));
		// },
	};
};
Mensaje.defaultProps = {
	mensaje: [],
};
 
 
 
	   
export default connect(mapState, mapDispatch)(Mensaje) 
