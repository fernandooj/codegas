import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios from "axios"
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import Footer    from '../components/footer'
import TomarFoto from "../components/tomarFoto";
import Toast from 'react-native-simple-toast';
 

class verPerfil extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        razon_social:"",
        cedula:"",
        direccion:"",
        email:"",
        nombre:"",
        password:"",
        celular:"",
        tipo:"",
        acceso:"usuario",
        password:"",
        codt:"",
	  }
    }
 
    componentWillMount(){
        const {params} = this.props.navigation.state
        if(params.tipoAcceso){
            this.setState({tipoAcceso:params.tipoAcceso})
            params.tipoAcceso=="solucion" &&this.setState({acceso: "cliente"})
        }else{
          null
        } 
        !params.tipoAcceso
        ?axios.get("user/perfil").then(e=>{
            const {user} = e.data
            this.setState({
                razon_social: user.razon_social ?user.razon_social :"",
                cedula:       user.cedula       ?user.cedula       :"",
                direccion:    user.direccion    ?user.direccion    :"",
                email:        user.email        ?user.email        :"",
                nombre:       user.nombre       ?user.nombre       :"",
                password :    user.password     ?user.password     :"",
                celular :     user.celular      ?user.celular      :"",
                tipo :        user.tipo         ?user.tipo         :"",
                acceso:       user.acceso       ?user.acceso       :"",
                avatar:       user.avatar       ?user.avatar       :"",
            })
        })
        :null
    }
     
     
    renderPerfil(){
        const {razon_social, cedula, direccion, email, nombre, celular,  codt, acceso, tipoAcceso, avatar, cargando} = this.state
        console.log({acceso, tipoAcceso})
        return (
            <ScrollView  keyboardDismissMode="on-drag" style={{marginBottom:50}}>
            {tipoAcceso=="admin" ?<Text style={style.titulo}>Nuevo {acceso}</Text> :<Text style={style.titulo}>Editar perfil</Text> }
            {/* ACCESO */}	 
                {
                    tipoAcceso=="admin"
                    &&<RNPickerSelect
                        placeholder={{
                            label: 'Acceso',
                            value: null,
                            color: '#00218b',
                        }}
                        items={[
                            {label: 'Administrador',    value: 'admin',     key: 'administrador'},
                            {label: 'Solución Cliente', value: 'solucion',  key: 'solucion'},
                            {label: 'Despachos',        value: 'despacho',  key: 'despacho'},
                            {label: 'Conductor',        value: 'conductor', key: 'conductor'},
                            {label: 'Cliente',          value: 'cliente',   key: 'cliente'}
                        ]}
                        onValueChange={acceso => {this.setState({ acceso })}}
                        mode="dropdown"
                        style={{
                            ...style,
                            placeholder: {
                            color: 'rgba(0,0,0,.2)',
                            fontSize: 15,
                            },
                        }}
                        value={acceso}
                    />    
                }
                

            {/* RAZON SOCIAL */}	 
                {
                    acceso=="cliente"
                    &&<TextInput
                        type='outlined'
                        placeholder="Razon Social"
                        autoCapitalize = 'none'
                        value={razon_social}
                        onChangeText={razon_social => this.setState({ razon_social })}
                        style={razon_social.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                }

            {/* CEDULA */}	 
                <TextInput
                    type='outlined'
                    placeholder="Cedula"
                    keyboardType='numeric'
                    value={cedula}
                    onChangeText={cedula => this.setState({ cedula })}
                    style={cedula.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* DIRECCION */}	
                {
                    acceso=="cliente"
                    &&<TextInput
                        type='outlined'
                        placeholder="Dirección"
                        autoCapitalize = 'none'
                        value={direccion}
                        onChangeText={direccion => this.setState({ direccion })}
                        style={direccion.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                }
            {/* DIRECCION */}	
            {
                    acceso=="cliente"
                    &&<TextInput
                        type='outlined'
                        placeholder="CODT"
                        autoCapitalize = 'none'
                        value={codt}
                        onChangeText={codt => this.setState({ codt })}
                        style={codt.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                }
            {/* EMAIL */}	 
                <TextInput
                    type='outlined'
                    placeholder="Email"
                    autoCapitalize = 'none'
					keyboardType='email-address'
                    value={email}
                    onChangeText={email => this.setState({ email })}
                    style={email.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* NOMBRES */}	 
                <TextInput
                    type='outlined'
                    label='Nombres'
                    placeholder="Nombres"
                    autoCapitalize = 'none'
                    value={nombre}
                    onChangeText={nombre => this.setState({ nombre })}
                    style={nombre.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* CELULAR */}	 
                <TextInput
                    type='outlined'
                    placeholder="Celular"
                    autoCapitalize = 'none'
					keyboardType='numeric'
                    value={celular}
                    onChangeText={celular => this.setState({ celular })}
                    style={celular.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* TIPO */}	 
                {
                    acceso=="cliente"
                    &&<RNPickerSelect
                        placeholder={{
                            label: 'Tipo',
                            value: null,
                            color: '#00218b',
                        }}
                        items={[
                            {label: 'Residencial', value: 'residencial',key: 'residencial'},
                            {label: 'Comercial', value: 'comercial',key:   'comercial'},
                            {label: 'Industrial',value: 'industrial',key:   'industrial'}
                        ]}
                        onValueChange={tipo => { this.setState({tipo}); }}
                        // onUpArrow={() => {
                        //     this.inputRefs.firstTextInput.focus();
                        // }}
                        // onDownArrow={() => {
                        //     this.inputRefs.favSport1.togglePicker();
                        // }}
                        mode="dropdown"
                        style={{
                            ...style,
                            placeholder: {
                            color: 'rgba(0,0,0,.2)',
                            fontSize: 15,
                            },
                        }}
                        value={this.state.tipo}
                    />
                }
            {/* AVATAR */}	 
                {
                    acceso!=="cliente"    
                    &&<View>
                        <TomarFoto 
                            source={avatar}
                            avatar
                            limiteImagenes={1}
                            imagenes={(imagen) => {  this.setState({imagen, showLoading:false}) }}
                        /> 
                    </View>
                }
            {/* BOTON GUARDAR */}
                {
                    tipoAcceso
                    ?<TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit()}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Guardando" :"Guardar"}</Text>
                    </TouchableOpacity> 
                    :<TouchableOpacity style={style.btnGuardar} onPress={()=>this.editarUsuario()}>
                    {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                    <Text style={style.textGuardar}>{cargando ?"Editando" :"Editar"}</Text>
                </TouchableOpacity> 
                }
                
            </ScrollView>  
            
        )
    }

    renderFormPass(){
        const {password, confirmar, showLoading, cargando} = this.state
        return <View>
                    <Text style={style.tituloContrasena}>Inserta tu contraseña</Text>
                        <TextInput
                            type='outlined'
                            label='Contraseña'
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={password => this.setState({ password })}
                            style={style.input}
                            secureTextEntry
                        />
                        <TextInput
                            type='outlined'
                            label='Confirmar'
                            placeholder="Confirmar"
                            value={confirmar}
                            onChangeText={confirmar => this.setState({ confirmar })}
                            style={style.input}
                            secureTextEntry={true}
                        />
                    {/* <Button color="#0071bb" loading={showLoading} 
                        title="Guardar"
                        disabled={ password!==confirmar ?true :false} 
                        onPress={() => this.savePassword()}
                    /> */}
                    <TouchableOpacity style={style.btnGuardar} onPress={()=>this.savePassword()}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Guardando" :"Guardar"}</Text>
                    </TouchableOpacity>
                    {
                        password!==confirmar
                        &&<Button 
                            title="No coinciden"
                            color="#0071bb" loading={showLoading} 
                            />
                    }
                </View>
    }
	render(){
        const {navigation} = this.props
        
        return (
            <View  style={style.container}>
                {
                    <KeyboardAvoidingView  behavior="padding" enabled>
                        {this.renderPerfil()}
                    </KeyboardAvoidingView>
                }
                <Footer navigation={navigation} />
            </View>
        )
    }
     
  

    ///////////////////////////////////////////////////////////////
    //////////////          ACTUALIZA EL AVATAR
    ///////////////////////////////////////////////////////////////
    avatar(imagen, idUser){
        console.log({imagen, idUser})
        this.setState({showLoading:true})
        let data = new FormData();
        imagen = imagen[0]
        this.state.tipoAcceso ?data.append('crear', true) :null
        data.append('imagen', imagen);
        data.append('imagenOtroUsuario', true);
        data.append('idUser', idUser);
        axios({
            method: 'post',  
            url: 'user/avatar',
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                if(this.state.tipoAcceso){
                    alert("Usuario guardado con exito")
                    this.props.navigation.navigate("perfil")
                }else{
                    this.loginExitoso(res.data.user)
                }
            }
        })
        .catch(err=>{
            this.setState({cargando:false})
        })
    }

    ///////////////////////////////////////////////////////////////
    //////////////          GUARDA SOLO LA CONTRASEÑA
    ///////////////////////////////////////////////////////////////
    savePassword(e){
        const { password, email } = this.state;
        this.props.cambiarContrasena(password, email)
        this.setState({passwordActivate:true})
    }

    ///////////////////////////////////////////////////////////////
    //////////////         VERIFICO QUE EL USUARIO TENGA TODOS LOS DATOS
    ///////////////////////////////////////////////////////////////
    handleSubmit(){
        const {razon_social, cedula, ubicacion, direccion, nombre,  email, celular, tipo, acceso, codt, imagen} = this.state
        console.log({razon_social, cedula, ubicacion, direccion, nombre, email,  tipo, celular, tipo, acceso, codt, imagen})
        if(acceso=="cliente"){
            if(razon_social=="" || cedula=="" || ubicacion=="" || direccion=="" || nombre=="" || email=="" ||  celular=="" || tipo=="" || acceso=="usuario" || codt==""){
                Alert.alert(
                    'Todos los campos son obligatorios',
                    '',
                    [
                      {text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    { cancelable: false }
                )
            }else{
                this.guardarUsuario()
            }
        }else{
            if(cedula=="" || email=="" || nombre=="" || acceso=="usuario" || celular=="" || !imagen){
                Alert.alert(
                    'Todos los campos son obligatorios',
                    "",
                    [
                      {text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    { cancelable: false }
                )
            }else{
                this.guardarUsuario()
            }
        }

    }
    guardarUsuario(e){
        this.setState({cargando:true})
        const {razon_social, cedula, ubicacion, direccion, nombre,  email, celular, tipo, acceso, codt, imagen} = this.state
        
        axios.post("user/sign_up", {razon_social, cedula, ubicacion, direccion, nombre, email, celular, tipo, acceso, codt})
        .then(e=>{
            console.log(e.data)
            if(e.data.status){
                if(acceso=="cliente") {
                    alert("Usuario guardado con exito")
                    this.props.navigation.navigate("perfil")
                }else{
                    this.avatar(imagen, e.data.user._id)
                } 
            }else{
                Toast.show("Este email ya existe")
                this.setState({cargando:false})
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({cargando:false})
        })
    }	
    editarUsuario(e){
        this.setState({cargando:true})
        const {razon_social, cedula, ubicacion, direccion, nombre,  email, celular, tipo, acceso, codt, imagen} = this.state
        
        axios.put("user/update", {razon_social, cedula, ubicacion, direccion, nombre, email, celular, tipo, acceso, codt})
        .then(e=>{
            console.log(imagen)
            console.log(e.data)
            if(e.data.status){
                if(imagen) {
                    this.avatar(imagen, e.data.user._id)
                }else{
                    this.loginExitoso(e.data.user)
                    
                }
            }else{
                Toast.show("Tenemos problemas, intentalo nuevamente")
                this.setState({cargando:false})
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({cargando:false})
        })
    } 
    async loginExitoso(user){
        console.log(user)
        AsyncStorage.setItem('nombre', user.nombre)
        AsyncStorage.setItem('avatar', user.avatar)
        alert("Usuario guardado con exito")
        this.setState({cargando:false})
        // this.setState({userId:user._id, cargando:false, nombre:user.nombre, email:user.email, acceso:user.acceso, avatar:user.avatar ?user.avatar :"null"})
    }
}
const mapState = state => {
   
	return {
        perfil:state.usuario.perfil.user,
        
	};
};


  
const mapDispatch = dispatch => {
	return {
		getPerfil: () => {
			dispatch(getPerfil());
        },
		 
        cambiarContrasena: (password, email) => {
            dispatch(cambiarContrasena(password, email));
        }
	};
};
verPerfil.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(verPerfil) 
