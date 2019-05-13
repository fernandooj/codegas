import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, ScrollView, Button, TextInput, KeyboardAvoidingView} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios from "axios"
import moment from "moment" 
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-fa-icons' 
import RNPickerSelect from 'react-native-picker-select';
import Footer    from '../components/footer'
import TomarFoto from "../components/tomarFoto";

 

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
        tipo:"Tipo",
        acceso:"",
        password:"",
        textGuardar:"GUARDAR",
        
	  }
    }
 
    componentWillMount(){
        console.log(this.props.navigation.state.params)
        const {params} = this.props.navigation.state
        params.tipoAcceso ?this.setState({tipoAcceso:params.tipoAcceso}) :null
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
        const {razon_social, cedula, direccion, email, nombre, celular,  tipo, acceso, tipoAcceso, avatar, showLoading, textGuardar} = this.state
        console.log(tipoAcceso)
        return (
            <ScrollView  keyboardDismissMode="on-drag" style={{marginBottom:50}}>
                <View>
                    <TomarFoto 
                        source={avatar}
                        avatar
                        limiteImagenes={1}
                        imagenes={(imagen) => {
                            this.updateAvatar(imagen)
                        }}
                    /> 
                </View>
                <Text style={{textAlign:"center"}}>{email}</Text>
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
                        onValueChange={value => {
                            this.setState({
                            acceso: value,
                            // tipoAcceso: value,
                            });
                        }}
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
                {
                    acceso=="cliente"
                    &&<TextInput
                        type='outlined'
                        placeholder="Cedula"
                        keyboardType='numeric'
                        value={cedula}
                        onChangeText={cedula => this.setState({ cedula })}
                        style={cedula.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                }
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
                        onValueChange={value => {
                            this.setState({
                            tipo: value,
                            });
                        }}
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

                
            {/* BOTON GUARDAR */}	     
                <Button color="#0071bb" loading={showLoading} 
                    title= {textGuardar}
                    disabled={nombre.length<3  ?true :false} 
                    onPress={() => this.handleSubmit()}
                />
            </ScrollView>  
            
        )
    }

    renderFormPass(){
        const {password, confirmar, showLoading} = this.state
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
                    <Button color="#0071bb" loading={showLoading} 
                        title="Guardar"
                        disabled={ password!==confirmar ?true :false} 
                        onPress={() => this.savePassword()}
                    />
                       
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
    updateAvatar(imagen){
        if(imagen.length>0){
            this.setState({showLoading:true})
            let data = new FormData();
            imagen = imagen[0]
            data.append('imagen', imagen);
            axios({
                method: 'post',  
                url: 'user/avatar',
                data: data,
            })
            .then((res)=>{
                res.data.status=="SUCCESS" &&this.setState({showLoading:false})
            })
            .catch(err=>{
                this.setState({showLoading:false})
            })
        }  
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
    //////////////          EDITA EL PERFIL
    ///////////////////////////////////////////////////////////////
    async handleSubmit(e){
        // this.setState({showLoading:true, textGuardar:"GUARDANDO..."})
        const {razon_social, cedula, ubicacion, direccion, nombre,  email, celular, tipo, acceso} = this.state
        
        console.log({razon_social, cedula, ubicacion, direccion, nombre, email,  celular, tipo, acceso})
        axios.post("user/sign_up", {razon_social, cedula, ubicacion, direccion, nombre, email, celular, tipo, acceso})
        .then(e=>{
            console.log(e.data)
            // e.data.status ?this.props.navigation.navigate("Home") :Toast.show("Tenemos un problema, intentelo mas tarde")
        })
        .catch(err=>{
            console.log(err)
        })
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
