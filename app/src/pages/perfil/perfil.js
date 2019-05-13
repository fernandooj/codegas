import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, ScrollView, Image} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import Footer   from '../components/footer'
import axios    from 'axios'
import Icon from 'react-native-fa-icons';
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
 
 
import {style} from './style'

 
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        email:""
	  }
	}
	 
	async componentWillMount(){
        try{
            const userId = await AsyncStorage.getItem('userId')
            const nombre    = await AsyncStorage.getItem('nombre')
            const email 	= await AsyncStorage.getItem('email')
            const avatar    = await AsyncStorage.getItem('avatar')
            const acceso    = await AsyncStorage.getItem('acceso')
          
            userId ?this.setState({userId, nombre, email, avatar, acceso}) :null
        }catch(e){
            console.log(e)
        }
        
	}
	 
	iniciarSesion(){
        const {email2, password2} = this.state
        return (
            <ScrollView style={style.containerRegistro}>
                <View style={style.subContainerRegistro}>
                    <Text style={style.titulo}>Iniciar sesión</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Email"
                        onChangeText={(email2) => this.setState({email2})}
                        value={email2}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={style.input}
                        placeholder="Contraseña"
                        onChangeText={(password2) => this.setState({password2})}
                        secureTextEntry
                        value={password2}
                    />
                     <TouchableOpacity style={style.btnGuardar} onPress={()=>this.login()}>
                        <Text style={style.textGuardar}>Iniciar Sesion</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    renderEmail(){
        const {email} = this.state
        return(
            <ScrollView style={style.containerRegistro}>
                <View style={style.subContainerRegistro}>
                    <Text style={style.titulo}>Email</Text>
                    <TextInput
                        style={email.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Email"
                        onChangeText={(email) => this.setState({email})}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                     <TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit()}>
                        <Text style={style.textGuardar}>Registrarme</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    renderPerfil(){
        const {navigation} = this.props
        const {nombre, idUsuario, avatar, email, tipo, acceso} = this.state
        console.log(avatar)
        return (
            <View style={style.containerRegistro}>
                <View style={style.perfilContenedor}>
                    <View style={style.columna1}>
                        {
                            avatar=="null"
                            ?<Icon name={'user-circle'} style={style.iconAvatar} />
                            :<Image source={{uri:avatar}} style={style.avatar} />
                        } 
                    </View>
                    <View style={style.columna2}>
                        <Text style={style.nombre}>{nombre}</Text>
                        <Text style={style.nombre}>{email}</Text>
                    </View>
                </View>	 
                <View>
                    <TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:null})} >
                        <Text style={style.txtLista}>Editar perfil</Text> 
                        <Icon name={'user-o'} style={style.icon} />
                    </TouchableOpacity>
                    
                    {
                        acceso=="admin"
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"admin"})} >
                            <Text style={style.txtLista}>Crear Usuario</Text> 
                            <Icon name={'plus'} style={style.icon} />
                        </TouchableOpacity>
                    }
                     {
                        acceso=="solucion"
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"solucion"})} >
                            <Text style={style.txtLista}>Crear Cliente</Text> 
                            <Icon name={'plus'} style={style.icon} />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity  style={style.btnLista} onPress={()=>{this.cerrarSesion()}}>
                        <Text style={style.txtLista}>Cerrar Sesion</Text> 
                        <Icon name={'sign-out'} style={style.icon} />
                    </TouchableOpacity> 

                </View>
            </View>  
            
        )
    }
	render(){
        const {navigation} = this.props
        const {userId} = this.state
	    return (
				<View style={style.container}>
                    {
                        userId
                        ?this.renderPerfil()
                        :<KeyboardAwareScrollView style={style.containerRegistro}>
                            {this.renderEmail()}
                            <View style={style.separador}></View>
                            {this.iniciarSesion()}
                        </KeyboardAwareScrollView>
                    }
					
					<Footer navigation={navigation} />
				</View>
		)
	}
    handleSubmit(){
        const {email} = this.state
        let acceso = "cliente";
        axios.post("user/sign_up", {email, acceso})
        .then(e=>{
            e.data.status ?this.props.navigation.navigate("confirmar", {code:e.data.token, email}) :Toast.show("Tenemos un problema, intentelo mas tarde")
        })
        .catch(err=>{
            console.log(err)
        })
    }
    async login(){
        const {email2, password2} = this.state
        axios.post("user/login", {email:email2, password:password2})
        .then(res=>{
            res.data.status ?this.loginExitoso(res.data.user) :Toast.show("Datos Incorrectos")
        })
        .catch(err=>{
            console.log(err)
        })
    }
    async loginExitoso(user){
        console.log(user)
        AsyncStorage.setItem('userId', user._id)
        AsyncStorage.setItem('nombre', user.nombre)
        AsyncStorage.setItem('email',  user.email)
        AsyncStorage.setItem('acceso', user.acceso)
        AsyncStorage.setItem('avatar', user.avatar ?user.avatar :"null")
        this.setState({userId:user._id, nombre:user.nombre, email:user.email, acceso:user.acceso, avatar:user.avatar ?user.avatar :"null"})
        // this.props.navigation.navigate("Home")
    }
    cerrarSesion(){
        axios.get(`user/logout`)
        .then(res => {
            this.setState({userId:null, email:"", password:"", email2:"", password2:""})
            AsyncStorage.removeItem('userId')
            AsyncStorage.removeItem('avatar')
        })
        .catch(err => {
            loginFailure(err);
        });
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
  