/* eslint-disable */
import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image, ImageBackground} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import Footer   from '../components/footer'
import axios    from 'axios'
import Icon from 'react-native-fa-icons';
// import FCM from "react-native-fcm";
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import {style} from './style'

class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        email:"",
        email2:"",
        password2:""
	  }
	}
	 
	async componentWillMount() {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const nombre = await AsyncStorage.getItem('nombre');
      const email = await AsyncStorage.getItem('email');
      const avatar = await AsyncStorage.getItem('avatar');
      const acceso = await AsyncStorage.getItem('acceso');
      console.log({userId});
      userId ?this.setState({userId, nombre, email, avatar, acceso}) :null
    } catch(e) {
        console.log(e)
    }
	}
  componentDidMount() {
      // FCM.getFCMToken().then(token => {
  // 	this.setState({ tokenPhone: token || "" });
  // });
  }
  renderEmail() {
    const {email} = this.state
    return(
      <ScrollView style={style.containerRegistro2}>
        <View style={style.subContainerRegistro}>
          <Text style={style.titulo}>Crear Nueva Cuenta</Text>
          <TextInput
            style={
              email.length < 2 ? [style.input, style.inputInvalid] : style.input
            }
            placeholder="Email / Codigo registro"
            onChangeText={(email) => this.setState({email})}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={style.btnGuardar}
            onPress={() =>
              email.length < 2
                ? Toast.show('Inserte su email o codigo de registro')
                : this.handleSubmit()
            }>
            <Text style={style.textGuardar}>Registrarme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
	iniciarSesion(){
        const {email2, password2, cargando} = this.state
        return (
            <ScrollView style={style.containerRegistro2}>
                <View style={style.subContainerRegistro}>
                    <Text style={style.titulo}>Iniciar sesión</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Email"
                        onChangeText={(email2) => this.setState({email2})}
                        value={email2}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#aaa" 
                    />
                    <TextInput
                        style={style.input}
                        placeholder="Contraseña"
                        onChangeText={(password2) => this.setState({password2})}
                        secureTextEntry
                        value={password2}
                        placeholderTextColor="#aaa" 
                    />
                    <TouchableOpacity style={style.btnGuardar} onPress={()=>(email2.length<3 || password2.length<2) ?Toast.show("Inserte un email y una contraseña") :this.login()}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Cargando" :"Iniciar Sesión"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.btnOlvidar} onPress={()=>this.props.navigation.navigate("recuperar")}>
                        <Text style={style.textOlvidar}>Olvide mi contraseña</Text>
                        <Text style={[style.txtLista, {fontSize:11}]}>Ver 11.4.30-1</Text> 
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
    renderPerfil(){
        const {navigation} = this.props
        const {nombre, idUsuario, avatar, email, err, acceso} = this.state
        console.log({acceso})
        return (
            <ScrollView style={style.containerRegistro}> 
                <View style={style.perfilContenedor}>
                    <View style={style.columna4}>
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
                        <Image source={require('../../assets/img/pg1/icon2.png')} style={style.icon} />
                    </TouchableOpacity>
                    
                    {
                        (acceso=="admin" || acceso=="despacho")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"admin"})} >
                            <Text style={style.txtLista}>Crear Usuario</Text> 
                            <Image source={require('../../assets/img/pg1/icon1.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        (acceso=="admin" || acceso=="solucion" || acceso=="comercial" || acceso=="veo" || acceso=="despacho")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("usuarios")} >
                            <Text style={style.txtLista}>Usuarios</Text> 
                            <Image source={require('../../assets/img/pg1/icon3.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        (acceso=="admin" || acceso=="solucion")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("frecuencia")} >
                            <Text style={style.txtLista}>Frecuencias</Text> 
                            <Image source={require('../../assets/img/pg1/icon6.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        acceso=="solucion"
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"solucion"})} >
                            <Text style={style.txtLista}>Crear Cliente</Text> 
                            <Image source={require('../../assets/img/pg1/icon1.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        (acceso=="admin" || acceso=="despacho")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("vehiculo", {tipoAcceso:"admin"})} >
                            <Text style={style.txtLista}>Vehiculos</Text> 
                            <Image source={require('../../assets/img/pg1/icon4.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        (acceso=="admin" || acceso=="despacho")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("zona")} >
                            <Text style={style.txtLista}>Zonas</Text> 
                            <Image source={require('../../assets/img/pg1/icon5.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        acceso=="admin"
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("verCalificacion")} >
                            <Text style={style.txtLista}>Calificaciones</Text> 
                            <Image source={require('../../assets/img/pg1/icon6.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                         (acceso=="admin" || acceso=="comercial" || acceso=="depTecnico" || acceso=="adminTanque")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("tanques")} >
                            <Text style={style.txtLista}>Tanques</Text> 
                            <Image source={require('../../assets/img/pg1/icon6.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                         (acceso=="admin" || acceso=="comercial" || acceso=="depTecnico" || acceso=="insSeguridad" || acceso=="adminTanque")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("usuarios", {revision:true})} >
                            <Text style={style.txtLista}>Revision y control tanques</Text> 
                            <Image source={require('../../assets/img/pg1/icon6.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        (acceso=="admin" || acceso=="comercial" || acceso=="depTecnico" || acceso=="insSeguridad" || acceso=="veo" || acceso=="cliente")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("reporteEmergencia", {revision:true})} >
                            <Text style={style.txtLista}>Reporte de emergencia</Text> 
                            <Image source={require('../../assets/img/pg1/icon6.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    {
                        (acceso=="admin")
                        &&<TouchableOpacity style={style.btnLista} onPress={()=>navigation.navigate("capacidad")} >
                            <Text style={style.txtLista}>Capacidades</Text> 
                            <Image source={require('../../assets/img/pg1/icon6.png')} style={style.icon} />
                        </TouchableOpacity>
                    }
                    
                    {
                        (acceso=="admin" && email=="fernandooj@ymail.com")
                        &&<View style={style.btnLista}  >
                            <TextInput style={style.txtLista} onChangeText={(idUsuario)=>this.setState({idUsuario})} placeholder="id" /> 
                            <TouchableOpacity  style={style.btnLista} onPress={()=>{this.searchUser()}}>
                                <Icon name={'star'} style={style.icon} />
                            </TouchableOpacity>
                        </View>
                    }
                    <TouchableOpacity  style={style.btnLista} onPress={()=>{this.cerrarSesion()}}>
                        <Text style={style.txtLista}>Cerrar Sesion</Text> 
                        <Image source={require('../../assets/img/pg1/icon7.png')} style={style.icon} />
                    </TouchableOpacity> 
                    <TouchableOpacity  style={style.btnLista}>
                        <Text style={[style.txtLista, {fontSize:11}]}>Ver 11.4.30-1</Text> 
                    </TouchableOpacity> 
                    {
                        err
                        &&<Text>{err}</Text>
                    }
                </View>
            </ScrollView>  
        )
    }
 
    searchUser(){
        const {idUsuario} = this.state
        axios.get(`users/by/asefsfxf323-dxc/${idUsuario}`)
        .then(res=>{
            console.log(res.data)
            if(res.data){
                this.cambioPerfil(res.data.users)
               
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde")
            }
        })
        .catch(err=>{
            console.log(err)
            Toast.show("Tenemos un problema, intentelo mas tarde")
        })
    }
    async cambioPerfil(user){
        console.log(user)
 
        AsyncStorage.setItem('userId', user._id)
        AsyncStorage.setItem('nombre', user.nombre)
        AsyncStorage.setItem('email',  user.email)
        AsyncStorage.setItem('acceso', user.acceso)
        AsyncStorage.setItem('avatar', user.avatar ?user.avatar :"null")
        AsyncStorage.setItem('tokenPhone', this.state.tokenPhone)
        this.props.navigation.navigate("Home")
    }
	render(){
        const {navigation} = this.props
        const {userId} = this.state
	    return (
            <View style={style.container}>
                <Image source={require('../../assets/img/pg1/fondo1.jpg')} style={style.cabezera1} />
                <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
                    <KeyboardAwareScrollView  style={style.container}>
                        {
                            userId
                            ?this.renderPerfil()
                            :<KeyboardAwareScrollView style={style.containerRegistro}>
                                {this.renderEmail()}
                                <View style={style.separador} />
                                {this.iniciarSesion()}
                            </KeyboardAwareScrollView>
                        }
                    </KeyboardAwareScrollView>
                        <View style={style.footer}>
                            <Footer navigation={navigation} />
                        </View>
                </ImageBackground>
            </View>
		)
	}
    handleSubmit(){
        const {email} = this.state
        let tipoEmail = email.includes("@")
        tipoEmail ?this.enviarEmailRegistro() :this.enviaCodigoRegistro()
    }
    enviaCodigoRegistro(){
        const {email} = this.state
        let acceso = "cliente";
        axios.post("user/sign_up", {email, acceso})
        .then(e=>{
            console.log(e.data)
            if(e.data.code==0){
                Toast.show("Este codigo ya esta activo")
            }else if(e.data.code==2){
                this.registroExitoso(email, e.data.token, e.data.user._id)
            }else if(e.data.code==3){
                this.props.navigation.navigate("verPerfil", {tipoAcceso:null})
                AsyncStorage.setItem('idPerfilregistro', e.data.users._id)
            }   
            // e.data.status ?this.registroExitoso(email, e.data.token, e.data.user._id) :Toast.show("Este email ya existe en el sistema")
        })
        .catch(err=>{
            console.log(err)
            Toast.show("Tenemos un problema, intentelo mas tarde")
        })
    }
    enviarEmailRegistro(){
        let {email} = this.state
        email = email.toLowerCase()
        console.log({email})
        let acceso = "cliente";
        axios.post("user/sign_up", {email, acceso})
        .then(e=>{
            console.log(e.data.user)
            e.data.status ?this.registroExitoso(email, e.data.token, e.data.user._id) :Toast.show("Este email ya existe en el sistema")
        })
        .catch(err=>{
            console.log(err)
            Toast.show("Tenemos un problema, intentelo mas tarde")
        })
    }
    async registroExitoso(email, code, id){
        
        AsyncStorage.setItem('idPerfilregistro', id) //// por que pongo este codigo aca?=>se coloca para que al editar el perfil, tenga el id Guardado, y se pueda editar, para nada mas sirve
        this.props.navigation.navigate("confirmar", {code, email})
    }
    async login(){
        this.setState({cargando:true})
        const {email2, password2, tokenPhone} = this.state
       
        axios.post("user/login", {email:email2, password:password2, tokenPhone})
        .then(res=>{
            console.log(res.data)
            if(res.data.status){
                this.loginExitoso(res.data.user)
            }else{
                this.setState({cargando:false})
                Toast.show("Datos Incorrectos")
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({cargando:false})
        })
    }
    async loginExitoso(user){
        
        AsyncStorage.setItem('userId', user._id)
        AsyncStorage.setItem('nombre', user.nombre)
        AsyncStorage.setItem('email',  user.email)
        AsyncStorage.setItem('acceso', user.acceso)
        AsyncStorage.setItem('avatar', user.avatar ?user.avatar :"null")
        AsyncStorage.setItem('tokenPhone', this.state.tokenPhone)
        this.setState({userId:user._id, cargando:false, nombre:user.nombre, email:user.email, acceso:user.acceso, avatar:user.avatar ?user.avatar :"null"})
        user.nombre ?this.props.navigation.navigate("inicio") :this.props.navigation.navigate("verPerfil", {tipoAcceso:null}) 
    }
    cerrarSesion(){
        axios.get(`user/logout`)
        .then(res => {
            AsyncStorage.removeItem('userId')
            AsyncStorage.removeItem('idPerfilregistro')
            AsyncStorage.removeItem('acceso')
            AsyncStorage.removeItem('nombre')
            AsyncStorage.removeItem('email')
            AsyncStorage.removeItem('tokenPhone')
            AsyncStorage.removeItem('avatar')
            AsyncStorage.removeItem('formularioChat')
            AsyncStorage.removeItem('usuariosEntrando')
            // this.setState({userId:null, email:"", password:"", email2:"", password2:""})
            this.props.navigation.navigate("Home")
        })
        .catch(err => {
            console.log(err)
            this.setState({err})
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
  