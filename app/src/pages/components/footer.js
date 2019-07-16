import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons';
import {style} from './style'
import axios from "axios"
import SocketIOClient from 'socket.io-client';
import {URL} from "../../../App"
export default class FooterComponent extends Component{
	constructor(props) {
	  super(props);
	  this.state={
		  user:{},
		  badgeMessage:true,
		  badgeCuenta:true,
		  badgeSocketMessage:0,
		  badgeSocketCuenta:0
	  }
	}
	componentWillMount = async () =>{
		const status   = await AsyncStorage.getItem('status')
		const idUsuario = await AsyncStorage.getItem('userId')
		const nombre    = await AsyncStorage.getItem('nombre')
		const email 	= await AsyncStorage.getItem('email')
		const avatar    = await AsyncStorage.getItem('avatar')
		const acceso   	= await AsyncStorage.getItem('acceso')
		this.setState({nombre, email, avatar, idUsuario, acceso})
		
		axios.get("user/perfil/").then(e=>{this.setState({status:e.data.status, user:e.data.user})})
		this.socket = SocketIOClient(URL);
		try {
			const userId = await AsyncStorage.getItem('userId')
			if(userId !== null) {
				// console.log("userId")
				// console.log(userId)
				this.socket.on(`badgeMensaje${userId}`, 	this.reciveMensanje.bind(this));
				if(acceso=="admin" || acceso=="solucion"){
					this.socket.on(`badgeConversacion`, 	this.reciveMensanjeConversacion.bind(this));
					this.socket.on(`pedido`, 					    this.recivePedido.bind(this));
				}
			}
		} catch(e) {
			console.log(e)
		}
	}
	reciveMensanje(messages) {
		console.log("messages")
		this.setState({badgeSocketMessage:this.state.badgeSocketMessage+1, badgeMessage:true })
	}
	reciveMensanjeCuenta(messages) {
		console.log(messages)
		this.setState({badgeSocketCuenta:this.state.badgeSocketCuenta+1, badgeCuenta:true })
	}
	reciveMensanjeConversacion(messages) {
		console.log(messages)
		this.setState({badgeSocketConversacion:1, badgeCuenta:true })
	}
	recivePedido(messages) {
		console.log(messages)
		this.setState({badgeSocketPedido:this.state.badgeSocketPedido+1, badgePedido:true })
	}

	///////////////////////////////////       redirecciono al usuario a la cuenta, pero primero elimino el badge
	//////////////////////////////////////////////////////////////////////
	cuenta(){
		// this.setState({badgeCuenta:false, badgeSocketCuenta:0})
		// axios.put("/not/notificacion/budge")
		// .then(e=>{this.props.navigation.navigate('notificacion')})
		// .catch(e=>{console.log(e)})
		
	}
	mensaje(){
		this.setState({badgeMessage:false, badgeSocketMessage:0})
		this.props.navigation.navigate('conversacion')
	} 

	renderFooter(){
		const {home, titulo, navigation} = this.props
		const {badgeSocketMessage, badgeMessage, badgeSocketCuenta, badgeCuenta, badgeSocketPedido, badgePedido, badgeSocketConversacion} = this.state
		return(
			<View style={style.contenedorFooter}>
				<TouchableOpacity style={style.subContenedorFooter} onPress={()=>navigation.navigate('inicio')}>
					<Icon name="home" style={style.icon} />
					<Text style={style.textFooter}>Inicio</Text>
					{
						badgeSocketConversacion>0  && badgeCuenta 
						&&<View style={style.badge}><Text style={style.textBadge}>{badgeSocketConversacion}</Text></View>
					}
					{
						badgeSocketMessage>0  && badgeMessage 
						&&<View style={style.badge}><Text style={style.textBadge}>{badgeSocketMessage}</Text></View>
					}
					
				</TouchableOpacity>
			 		{/* <TouchableOpacity style={style.subContenedorFooter} onPress={()=>this.mensaje()}>
						<Icon name="comment" style={style.icon} />
						<Text style={style.textFooter}>Chat</Text>
						{ 
							badgeSocketMessage>0  && badgeMessage 
							&&<View style={style.badge}><Text style={style.textBadge}>{badgeSocketMessage}</Text></View>
						}
					</TouchableOpacity> */}
				 
					 <TouchableOpacity style={style.subContenedorFooter} onPress={()=>navigation.navigate('nuevo_pedido')}>
						<Icon name="plus-square" style={style.icon} />
						<Text style={style.textFooter}>Nuevo pedido</Text>
					</TouchableOpacity>
				 
				
				<TouchableOpacity style={style.subContenedorFooter} onPress={()=>navigation.navigate('pedido')}>
					<Icon name="cloud-upload" style={style.icon} />
					<Text style={style.textFooter}>Pedidos</Text>
					{
						badgeSocketPedido>0  && badgePedido 
						&&<View style={style.badge}><Text style={style.textBadge}>{badgeSocketPedido}</Text></View>
					}
				</TouchableOpacity>
				<TouchableOpacity style={style.subContenedorFooter} onPress={()=>navigation.navigate('perfil')}>
					<Icon name="user" style={style.icon} />
					<Text style={style.textFooter}>Perfil</Text>
				</TouchableOpacity>
			</View>
		)
	}
	render(){
	    return (
			<View style={style.contenedorFooter}> 
				{this.renderFooter()}
			</View>
		)
	}
	 
}
