import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, ScrollView, Button} from 'react-native'
 
 
import {style} from './style'
import {connect}   from 'react-redux' 
 
import Icon from 'react-native-fa-icons'; 
import axios from 'axios'

import CodeInput from 'react-native-confirmation-code-input';
 
 
const {
	GraphRequest, GraphRequestManager,
	LoginManager,
	AccessToken
  } = FBSDK;

  class Login extends Component{
	constructor(props) {
	  super(props);
	  this.state={
		userInfo:{},
		username:"",
		password:"",
		email:"",
		token:"0000"
	  }
	}
	async componentWillMount(){
		GoogleSignin.configure()
		
	}
	 
	 
	 
	renderLogin(){
		const {usuarioNoExiste, email, password, showPassword, showLoading, alertErrorLogin} = this.state
		return(
			<View>
				<Text style={style.titulo}>PERFIL</Text>
				<TextInput
					style={style.input}
					onChangeText={(email) => this.setState({email})}
					value={email}
					placeholder="Razón social"
					autoCapitalize = 'none'
				/>
				<TextInput 
					style={style.input}
					onChangeText={(password) => this.setState({password})}
					value={password}
					placeholder="Contraseña"
					autoCapitalize = 'none'
				/>
				<TextInput 
					style={style.input}
					onChangeText={(password) => this.setState({password})}
					value={password}
					placeholder="Contraseña"
					autoCapitalize = 'none'
					keyboardType='email-address'
				/>
				<TextInput 
					style={style.input}
					onChangeText={(password) => this.setState({password})}
					value={password}
					placeholder="Contraseña"
					autoCapitalize = 'none'
				/>
				<TouchableOpacity onPress={()=>this.setState({showPassword:!showPassword})} style={style.btnIconPass}> 
					<Icon name={showPassword ?'eye-slash' :'eye'} allowFontScaling style={style.iconPass} />
				</TouchableOpacity>
				 
				<Button 
					 title="INGRESAR"
					color="#0071bb" 
					loading={showLoading} disabled={email.length==0 || password.length==0 } onPress={() => this.login()}>
					
				</Button>
				{
					usuarioNoExiste
					&&<Button 
						title="EMAIL NO EXISTE, REGISTRARME!"
						color="#0071bb"  loading={showLoading} disabled={email.length==0 || password.length==0 } onPress={()=>this.setState({showCrearCuenta:true})}>
						
					</Button>
				}
				{
					alertErrorLogin
					?<Button 
						title="DATOS INCORRECTOS, RECUPERAR CONTRASEÑA"
						color="#0071bb"  loading={showLoading} disabled={email.length==0 || password.length==0 } onPress={() => this.login()}>
						
					</Button>
					:<Button 
						title="OLVIDE MI CONTRASEÑA"
						color="#0071bb"  loading={showLoading} onPress={() => this.setState({recuperarContrasena:true})}>
						
					</Button>
				}
				
				
				
			</View>
		)
	}
	renderCrearCuenta(){
		const {showLoading, email, emailVerify, correoExiste} = this.state
		return(
			<View>
				<View style={style.regresarContenedor}>
					<TouchableOpacity onPress={()=>this.setState({showCrearCuenta:false})}>
						<Icon name={'arrow-left'} allowFontScaling style={style.iconRegresar} />
					</TouchableOpacity>
					<Text style={style.tituloRegresar}>Unete a Releo</Text>
				</View>
				<View style={style.contenedorEmailRegistro}>
					<TextInput 
						style={emailVerify ?[style.input] : [style.input, style.inputRequired]}
						onChangeText={(email) => this.verifyEmail(email)}
						value={email}
						underlineColorAndroid='transparent'
						placeholder="Email"
						placeholderTextColor="#8F9093" 
						autoCapitalize = 'none'
						error = {true}
					/>
				</View>
				<Button 
					title="REGISTRARSE"
					color="#0071bb" disabled={emailVerify ?false :true} loading={showLoading} 
					onPress={() => this.handleSubmit()}
				/>
				{
					correoExiste
					&&<Button 
						title="ESTE CORREO YA EXISTE, INICIAR SESIÓN"
						color="#0071bb"  loading={showLoading} onPress={() => this.setState({showCrearCuenta:false})}
						/>
				}
				
			</View>
		)
	}
	renderRecuperarContrasena(){
		const {showLoading, email, emailVerify} = this.state
		return(
			<View>
				<View style={style.regresarContenedor}>
					<TouchableOpacity onPress={()=>this.setState({recuperarContrasena:false, email:""})}>
						<Icon name={'arrow-left'} allowFontScaling style={style.iconRegresar} />
					</TouchableOpacity>
					<Text style={style.tituloRegresar}>Recuperar Contraseña</Text>
				</View>
				<View style={style.contenedorEmailRegistro}>
					<TextInput 
						style={emailVerify ?[style.input] : [style.input, style.inputRequired]}
						onChangeText={(email) => this.verifyEmail(email)}
						value={email}
						underlineColorAndroid='transparent'
						placeholder="Email"
						placeholderTextColor="#8F9093" 
						autoCapitalize = 'none'
					/>
				</View>
				<Button 
					title="RECUPERAR"
					color="#0071bb"
					disabled={emailVerify ?false :true} loading={showLoading} onPress={() => this.olvidoContrasena()}>
					
				</Button>
				{/* <Snackbar
					visible={tokenEnviado}
					onDismiss={() => this.setState({ tokenEnviado: false })}
					action={{
						label: 'Cerrar',
						onPress: () => {
							this.setState({ tokenEnviado: false })
						},
					}}
					>
				  hemos enviado un codigo a este email
        		</Snackbar> */}
			</View>
		)
	}
	renderInsertarCodigo(){
		return(
			<View>
				<View style={style.regresarContenedor}>
					<TouchableOpacity onPress={()=>this.setState({showCrearCuenta:false, email:""})}>
						<Icon name={'arrow-left'} allowFontScaling style={style.iconRegresar} />
					</TouchableOpacity>
					<Text style={style.tituloRegresar}>Inserta el codigo que te hemos enviado</Text>
				</View>
				<View style={style.contenedorEmailRegistro}>
					<CodeInput
						ref="codeInputRef2"
						keyboardType="numeric"
						codeLength={4}
						className={'border-b'}
						compareWithCode={this.state.token}
						autoFocus={true}
						activeColor='#0071bb'
						inactiveColor='rgba(49, 180, 4, 1.3)'
						codeInputStyle={{ fontWeight: '800' }}
						onFulfill={(isValid, code) => this.onFinish(isValid, code)}
					/>
				</View>
				{/* <Snackbar
					visible={this.state.showError}
					onDismiss={() => this.setState({ showError: false })}
					action={{
						label: 'Cerrar',
						onPress: () => {
							this.setState({ showError: false })
						},
					}}
					>
				  Opss!! codigo incorrecto
        		</Snackbar> */}
			</View>
		)
	}
	onFinish(isValid, token){
		const {tokenEnviado, email} = this.state
		const {navigation} = this.props	
		console.log({isValid, token})
		if(isValid){
			if(tokenEnviado){
				axios.post('user/CambiarPassword', {username:email, token})
				.then(e=>{
					console.log(e.data)
					e.data.code==1 
					?navigation("verPerfil")
					:this.setState({showError:true})
				})
				.catch(err=>{
					console.log(err)
				})
			}else{
				axios.post('user/verificaToken', {username:email, token})
				.then(e=>{
					console.log(e.data)
					e.data.code==1 
					?navigation("verPerfil")
					:this.setState({showError:true})
				})
				.catch(err=>{
					console.log(err)
				})
			}
		}else{
			this.setState({showError:true})
		}
	}
	verifyEmail(email){
		let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		let emailVerify = re.test(String(email).toLowerCase());
		this.setState({email, emailVerify})
		console.log(emailVerify)
	}
 
	render(){
		const {showCrearCuenta, showInsertarCodigo, recuperarContrasena, keyboardOpen}  = this.state
		console.log(showInsertarCodigo)
		return (
			<View style={!showCrearCuenta ?style.contenedorLogin :style.contenedorRegistro}>
				<KeyboardListener
					onWillShow={() => { this.setState({ keyboardOpen: true }); }}
					onWillHide={() => { this.setState({ keyboardOpen: false }); }}
				/>
				{
					recuperarContrasena
					?this.renderRecuperarContrasena()					
					:!showCrearCuenta
					?<ScrollView 
						style={keyboardOpen ?[style.subContenedorLogin,{ marginBottom:250}] :[style.subContenedorLogin, {marginBottom:10}]} 
						ref={(view) => { this.scrollView = view }}
						showsHorizontalScrollIndicator={false}
					>
						{this.renderLogin()}
						</ScrollView>
					:!showInsertarCodigo
					?this.renderCrearCuenta()
					:this.renderInsertarCodigo()
				}
			</View>	 
	    )
	}
	login(){
		const { email, password, tokenPhone } = this.state;
		axios.post("user/login", { username:email, password, tokenPhone })
        .then(e => {
			console.log(e.data)
        	e.data.code==1 ?this.props.login() :e.data.code==0 ?this.setState({alertErrorLogin:true}) :this.setState({usuarioNoExiste:true})
		})
	}
	olvidoContrasena(){
		const { email, password } = this.state;
		axios.post("user/recover/", { username:email })
        .then(e => {
			console.log(e.data)
        	e.data.code==1 ?this.setState({tokenEnviado:true, showInsertarCodigo:true, recuperarContrasena:false, showCrearCuenta:true, token:e.data.token.toString() }) :this.setState({usuarioNoExiste:true})
		})
	}
	handleSubmit(e){
		this.setState({loading:true})
		const {email} = this.state
		axios.post('user/sign_up', {username:email, email})
		.then(e=>{
			e.data.code==1 || e.data.code==2
			?this.setState({showInsertarCodigo:true, token:e.data.token.toString()})
			:this.setState({correoExiste:true})
		})
		.catch(err=>{
		  console.log(err)
		})
	}
}

const mapStatetoPros =(state) =>{
	return{
		carrito:state.carrito,
		loginFailure: state.usuario.loginFailure,
		loginSuccess: state.usuario.loginSuccess,
	}
}
const mapDispatch = dispatch => {
	return {
	  loginRequest: (email, password) => {
		dispatch(loginRequest(email, password));
	  }
	};
  };
	   
export default connect(mapStatetoPros, mapDispatch)(Login) 
