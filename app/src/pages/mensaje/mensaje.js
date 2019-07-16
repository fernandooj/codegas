import React, {Component} from 'react'
import {View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Platform, Image, Dimensions, Modal, ActivityIndicator, Alert} from 'react-native'
import AsyncStorage   from '@react-native-community/async-storage';
import {style}   	    from './style'
import {connect} 	    from 'react-redux' 
import axios     		  from 'axios' 
import Icon 			    from 'react-native-fa-icons' 
import update 			  from 'react-addons-update';
import Lightbox 		  from 'react-native-lightbox';
import ImageEscalable from 'react-native-scalable-image';
import SocketIOClient from 'socket.io-client';
import FastImage 		  from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import {sendRemoteNotification} from '../push/envioNotificacion';
import TomarFoto 						   from "../components/tomarFoto";
import { getMensajes, getConversacion } from "../../redux/actions/mensajeActions";
import {URL} from "../../../App"
let size = Dimensions.get('window');
const ImageProgress = createImageProgress(FastImage);
class Conversacion extends Component{
	constructor(props) {
	  super(props);
	  this.state={
		top:0,
		bottom:0,
		mensaje:"",
		mensajes:[]
	  }
	  this.cerrarConversacionSocket = this.cerrarConversacionSocket.bind(this)
	}
	async componentWillMount(){
		try {
			let idUsuario = await AsyncStorage.getItem('userId')
			const acceso  = await AsyncStorage.getItem('acceso')
			let tokenPhone   = await AsyncStorage.getItem('tokenPhone') //// acceso del usuario si estas logueado
			tokenPhone = JSON.parse(tokenPhone)
			idUsuario = idUsuario ?idUsuario :123
			this.setState({idUsuario, acceso, tokenPhone})
			// let tokenPhone ="dSX6avjLBQo:APA91bFhrGvki63yKSSKG3up0YxaDlX9U856ZKQb-c-ZAafiV6_uwk0Mr3kE-9cmlSfQhJ_YAytBhvYlBNvqn9ZU0E3Zc7gzbbmDkPVSFxW_C1dPjfRwZft7U46hBYa3DtT_XXrVf-Zm"
			// let  id = "5cf0a17eeb2fa0220b12e38d"
			console.log({tokenPhone})
			
		} catch (error) {
			alert(error)
		}
		const {id} = this.props.navigation.state.params
		this.setState({id})
		this.props.getMensajes(id)
		this.props.getConversacion(id)
		this.socket = SocketIOClient(URL);
		this.socket.on(`chatConversacion`, 	 	  this.reciveMensanje.bind(this));
		this.socket.on(`cerrarConversacion${id}`, this.cerrarConversacionSocket.bind(this));
	}  
	componentWillReceiveProps(props){
		this.setState({mensajes:props.mensajes})
	}
	cerrarConversacionSocket(navigation){
		const {acceso, id}=this.state
		Alert.alert(
				`Chat Finalizado`,
				``,
				[
					{text: 'Cerrar', onPress: () => confirmar()},
				],
				{cancelable: false},
		)
		const confirmar = ()=>{
			AsyncStorage.removeItem('formularioChat')
			acceso=="admin" || acceso=="solucion"
			?this.props.navigation.navigate("Home") 
			:this.props.navigation.navigate("calificacion", {id}) 
		}
	}
 
	reciveMensanje(messages) {
		console.log({messages})
		this.setState({
			mensajes: update(this.state.mensajes, {$push: [messages]})
	 	})
	}
	renderMensajes(){
		const {usuario, navigator} = this.props
		const {tokenPhone, mensajes} = this.state
		console.log(mensajes)
		return mensajes.map((e, key)=>{
			let imagen = e.tipo==2 ?e.imagen.split("-") :null
			return(
				<View style={tokenPhone==e.usuarioId.tokenPhone ?style.conMensaje2 :style.conMensaje1} key={key}>
					{
						e.tipo==1
						?<View style={tokenPhone==e.usuarioId.tokenPhone ?style.mensaje2 :style.mensaje1}>
							<Text>{e.mensaje}</Text>	
						</View>
						:<View style={tokenPhone==e.usuarioId.tokenPhone ?style.contenedorImagen2 :style.contenedorImagen1}>
							<Lightbox 
								renderContent={() => (
									<ImageEscalable 
										source={{ uri: imagen[0]+"Resize"+imagen[2] }}
										width={size.width}
									/>
								)}
							>
								<ImageProgress 
									source={{uri:imagen[0]+imagen[2]}}
									style={{width:size.width/2, height:140}}
								/>
							</Lightbox>	
						</View>
					}			
				</View>
			)
		})
	}
	renderCabezera(){
		const {usuarioId1, usuarioId2} = this.props.conversacion
		const {idUsuario, acceso} = this.state
		let avatar = acceso=="admin" || acceso=="solucion" ?null :usuarioId1.avatar
		let nombre = acceso=="admin" || acceso=="solucion" ?usuarioId2.nombre :usuarioId1.nombre
		return(
			<View style={style.contenedorCabezera}>
				<TouchableOpacity onPress={()=>this.props.navigation.navigate("Home")}>
					<Icon name={'chevron-left'} style={style.iconCabezera} />
				</TouchableOpacity>
				<TouchableOpacity style={style.contenedorAvatar} >
					{
						avatar
						?<Image source={{uri:avatar}} style={style.avatar} />
						:<Icon name={'user-circle'} style={style.iconUser} />
					}
			 
				</TouchableOpacity>	
				<Text style={style.nombre}>{nombre}</Text>
				{
					(acceso=="admin" || acceso=="solucion")
					&&<TouchableOpacity style={style.btnCerrar} onPress={()=>this.cerrarConversacion()}>
							<Text  style={style.textCerrar}>Cerrar </Text>
					</TouchableOpacity>
				}
			</View>
		)
	}
	renderFooter(){
		const {mensaje, subirImagen, previewImagen, height} = this.state
		return(
			<View style={style.contenedorFooter}>
				{
					subirImagen
					&&<TomarFoto 
							tipoMensaje
							limiteImagenes={1}
							cerrar = {()=>this.setState({subirImagen:false})}
							imagenes={(imagen) => this.setState({imagen:imagen[0], previewImagen:true}) }
					/> 
				}
				{ previewImagen
					&&this.avatar()
				}
				<TouchableOpacity onPress={()=> this.setState({subirImagen:true})} style={style.btnEnviar}>
					<Icon name={'camera'} style={style.icon} />
				</TouchableOpacity>
				<TextInput
					value={mensaje}
					onChangeText={mensaje => this.setState({ mensaje })}
					style={style.input}
					ref='username' 
				/>
				<TouchableOpacity onPress={mensaje.length==0 ?null :()=>this.handleSubmit()} style={style.btnEnviar}>
					<Icon name={'paper-plane'} style={style.icon} />
				</TouchableOpacity>
			</View>
		)
	}
	render(){
		const {activo, usuarioId1, usuarioId2} = this.props.conversacion
		const {acceso, height, mensajes} = this.state
		return (
			<View style={style.container}>
				{this.renderCabezera()}
				<Text style={style.textoUnirse}>{acceso=="admin" || acceso=="solucion" ?usuarioId2.nombre :usuarioId1.nombre} se ha unido a esta conversación</Text>
				{mensajes.length<=6 ?<View style={style.contenedorMensajes}>{this.renderMensajes()}</View> :null}
			{
				Platform.OS=='android'
				?<View style={{flex:1}}>
					<KeyboardAvoidingView style={style.contenedorMensajes} keyboardVerticalOffset={0} behavior={"position"} >
						<ScrollView  ref={(view) => { this.scrollView = view }} style={style.subContenedorMensajes}
							onContentSizeChange={(width,height) => this.scrollView.scrollTo({y:height})}
						>
						{mensajes.length>6 &&this.renderMensajes()}
						</ScrollView>
					</KeyboardAvoidingView>
					<View style={mensajes.length<=6 ?style.contenedorFooter2 :null}>
						{activo &&this.renderFooter()}
					</View>
				</View>
				:<KeyboardAvoidingView style={style.contenedorMensajes} keyboardVerticalOffset={mensajes.length<=6 ?0 :32} behavior={"position"} >
					<ScrollView  ref={(view) => { this.scrollView = view }} style={style.subContenedorMensajes}
						onContentSizeChange={(width,height) => {this.scrollView.scrollTo({y:height}); this.setState({height}) }} > 
						{mensajes.length>6 &&this.renderMensajes()}
					</ScrollView> 
					<View style={mensajes.length<=6 ?style.contenedorFooter2 :null}>
						{activo &&this.renderFooter()}
					</View>
				</KeyboardAvoidingView>
			}
			</View>
		)
	}


	///////////////////////////////////////////////////////////////
	//////////////         MUESTRO EL MODAL PREVISUALIZANDO LA IMAGEN
	///////////////////////////////////////////////////////////////
	avatar(){
		const {imagen, previewImagen, loadingImage} = this.state
		return(
			<Modal
				transparent
				visible={previewImagen}
				animationType="fade"
				onRequestClose={() => {}}
			>
				<TouchableOpacity
						activeOpacity={1}
						onPress={() => { this.setState({  previewImagen: false });   }}
						style={style.btnModal}
				>
					<View style={style.contenedorModal}>
						<TouchableOpacity
								activeOpacity={1}
								onPress={() => {this.setState({previewImagen:false})}}
								style={style.btnModalClose}
						>
								<Icon name={'times-circle'} style={style.iconCerrar} />
						</TouchableOpacity>
						<ImageEscalable
							width={size.width-120}
							source={{uri: imagen.uri}}
						/>

						<TouchableOpacity style={style.btnCerrar} onPress={()=>{!loadingImage &&this.subirImagen(imagen)}}>
							{loadingImage &&<ActivityIndicator color="#ffffff" style={{marginHorizontal:10}}/>}
							<Text style={style.textCerrar}>{loadingImage ?"Subiendo..." :"Enviar Imagen"}</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		)
	}
	///////////////////////////////////////////////////////////////
	//////////////          ENVIO LA IMAGEN
	///////////////////////////////////////////////////////////////
	subirImagen(imagen){
		this.setState({loadingImage:true})
		const {usuarioId1, usuarioId2, _id} = this.props.conversacion
		const {acceso} = this.state
		let data = new FormData();
		let userId 		=  acceso=="admin" || acceso=="solucion" ?usuarioId2._id :usuarioId1._id
		let tokenPhone  = acceso=="admin" || acceso=="solucion" ?usuarioId2.tokenPhone :usuarioId1.tokenPhone
		const Fullmensaje = {
			usuarioId:userId,
			conversacionId:_id,
			tokenPhone:this.state.tokenPhone,
			tipo:2
		}
		this.socket = SocketIOClient(URL);
		this.socket.emit('chatConversacion', JSON.stringify(Fullmensaje))
		//////////////////////////////////////////////////////////////////////
		data.append('imagen', imagen);
		data.append('userId', userId);
		data.append('tokenPhone', tokenPhone);
		data.append('conversacionId', _id);
		data.append('tipo', 2);
		axios({
				method: 'post',  
				url: 'men/mensaje',
				data: data,
		})
		.then((res)=>{
			console.log(res.data)
			if(res.data.status){
				this.setState({previewImagen:false})
				this.setState({loadingImage:false})
				this.props.getMensajes(this.state.id)
				sendRemoteNotification(2, tokenPhone, "conversacion", "nuevo mensaje", `: ${imagen.uri}`, null, null )
			}
		})
		.catch(err=>{
				this.setState({cargando:false, loadingImage:false})
		})
	}
	///////////////////////////////////////////////////////////////
	//////////////         ENVIO EL MENSAJE
	///////////////////////////////////////////////////////////////
	handleSubmit(){
		this.setState({showSpin:true})
		const {usuarioId1, usuarioId2, _id} = this.props.conversacion
		const {id, acceso} = this.state
		let userId 	   =  acceso=="admin" || acceso=="solucion" ?usuarioId1._id :usuarioId2._id
		let userId2    =  acceso=="admin" || acceso=="solucion" ?usuarioId2._id :usuarioId1._id
		let tokenPhone = acceso=="admin" || acceso=="solucion" ?usuarioId2.tokenPhone :usuarioId1.tokenPhone
		const {mensaje} = this.state
		const Fullmensaje = {
			mensaje: mensaje, 
			userId2: userId2, 
			usuarioId:{
				usuarioId:userId,
				tokenPhone:this.state.tokenPhone,
			},
			conversacionId:_id,
			tipo:1
		}
		this.socket = SocketIOClient(URL);
		this.socket.emit('chatConversacion', JSON.stringify(Fullmensaje))
	
		axios.post('men/mensaje/', {...Fullmensaje})
		.then(e=>{
			console.log(e.data)
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
	cerrarConversacion(){
		const {usuarioId1, usuarioId2, _id} = this.props.conversacion
		axios.post(`con/conversacion/cerrar/${_id}`)
		.then(e=>{
			if(e.data.status){
				this.props.navigation.navigate("Home") 
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
	return {
		conversacion :state.mensaje.conversacion,
		mensajes:state.mensaje.mensaje,
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
	conversacion: [{usuarioid1:{}, usuarioid2:{}}],
};
 
 
 
	   
export default connect(mapState, mapDispatch)(Conversacion) 
