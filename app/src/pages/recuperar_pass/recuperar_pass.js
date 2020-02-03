import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Dimensions, ImageBackground, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import axios    from 'axios'
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-fa-icons';
import CodeInput from 'react-native-confirmation-code-input'; 
import Footer   from '../components/footer'
import {style} from './style'

 
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        email:"",
        password:"",
        confirmarPassword:"",
        code:"0000"
	  }
	}
	 
	async componentWillMount(){
	  
			
	}
	renderEmail(){
        const {email} = this.state
        return(
            <View style={style.subContainerRegistro}>
                <Text style={style.titulo}>Recuperar Contraseña</Text>
                <TextInput
                    style={email.length<2 ?[style.input, style.inputInvalid] :style.input}
                    placeholder="Email"
                    onChangeText={(email) => this.setState({email})}
                    value={email}
                    keyboardType='email-address'
                    autoCapitalize="none"
                    placeholderTextColor="#aaa" 
                />
                <TouchableOpacity style={style.btnGuardar} 
                    onPress={()=> email.length<5 ?alert("Email es obligatorio") :this.recuperar()}>
                    <Text style={style.textGuardar}>Recuperar</Text>
                </TouchableOpacity>
            </View>
        )
    }
    renderCode(){
        return (
            <View>
                <Text style={style.tituloRegresar}>Hemos enviado un correo con un codigo de verificación</Text>
                <CodeInput
                ref="codeInputRef2"
                keyboardType="numeric"
                codeLength={4}
                className={'border-b'}
                compareWithCode={this.state.code}
                autoFocus={true}
                activeColor='#0071bb'
                inactiveColor='rgba(49, 180, 4, 1.3)'
                codeInputStyle={{ fontWeight: '800' }}
                onFulfill={(isValid, code) => this.onFinish(isValid, code)}
            />
            </View>
            
        )
    }
    onFinish(isValid){
        if(isValid){
            this.setState({showModulo:"password"}) 
        }else{
            Toast.show("Codigo Incorrecto")
        }
    }
    renderConfirmarPass(){
        const {password, confirmarPassword, showcontrasena, showConfirmcontrasena} = this.state
        return(
            <View style={style.subContainerRegistro}>
                <Text style={style.titulo}>Nueva Contraseña</Text>
                <View style={{flexDirection:"row"}}>
                    <TextInput
                        style={password.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Contraseña"
                        onChangeText={(password) => this.setState({password})}
                        secureTextEntry
                        value={password}
                        secureTextEntry={showcontrasena ?false :true}
                    />
                    <TouchableOpacity style={style.btnIconPassLogin} onPress={()=>this.setState({showcontrasena:!showcontrasena})}>
                        <Icon name={showcontrasena ?'eye-slash' :'eye'} allowFontScaling style={style.iconPass} />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row"}}>
                    <TextInput
                        style={confirmarPassword.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Contraseña"
                        onChangeText={(confirmarPassword) => this.setState({confirmarPassword})}
                        secureTextEntry
                        value={confirmarPassword}
                        secureTextEntry={showConfirmcontrasena ?false :true}
                    />
                    <TouchableOpacity style={style.btnIconPassLogin} onPress={()=>this.setState({showConfirmcontrasena:!showConfirmcontrasena})}>
                        <Icon name={showConfirmcontrasena ?'eye-slash' :'eye'} allowFontScaling style={style.iconPass} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={style.btnGuardar} 
                    onPress={()=>this.cambiarPass()}>
                    <Text style={style.textGuardar}>Guardar</Text>
                </TouchableOpacity>
            </View>
        )
    }
	render(){
        const {navigation} = this.props
        const {showModulo} = this.state
	    return (
            <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo.jpg')} >
                <KeyboardAwareScrollView style={style.containerRegistro}>
                    {
                        !showModulo
                        ?this.renderEmail()
                        :showModulo=="code"
                        ?this.renderCode()
                        :this.renderConfirmarPass()
                    }
                </KeyboardAwareScrollView>
                <Footer navigation={navigation} />
            </ImageBackground>
		)
    }
    cambiarPass(){
        const {email, password, confirmarPassword} = this.state
        if(password.length<3 || confirmarPassword.length<3){
            alert("Inserte ambos campos")
        }
        else if(password!=confirmarPassword){
            alert("Las contraseñas no coinciden")
        }else{
            axios.post("user/CambiarPassword", {email,password})
            .then(e=>{
                console.log(e.data)
                if(e.data.status) {
                    this.cambioExitoso(e.data.user)
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde")
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
        
    }
    async cambioExitoso(user){
        console.log(user)
        AsyncStorage.setItem('userId', user._id)
        AsyncStorage.setItem('nombre', user.nombre ?user.nombre :"")
        AsyncStorage.setItem('email',  user.email)
        AsyncStorage.setItem('acceso', user.acceso)
        AsyncStorage.setItem('avatar', user.avatar ?user.avatar :"null")
        AsyncStorage.setItem('tokenPhone', user.tokenPhone ?user.tokenPhone :"")

        Toast.show("Contraseña cambiada")
        this.props.navigation.navigate("inicio")   
    }
    recuperar(){
        const {email} = this.state
        console.log({email})
        axios.post("user/recover", {email})
        .then(e=>{
            console.log(e.data)
            if(e.data.status) {

                this.setState({showModulo:"code", code:e.data.token.toString()})
            }else{
                Toast.show("Este email no existe")
            }
        })
        .catch(err=>{
            console.log(err)
        })
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
  