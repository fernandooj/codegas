import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert, Modal} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios from "axios"
import Icon from 'react-native-fa-icons';
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
        direccion_factura:"",
        email:"",
        nombre:"",
        password:"",
        celular:"",
        tipo:"",
        acceso:"usuario",
        password:"",
        codt:"",
        modalUbicacion:false,
        modalZona:false,
        zonas:[],
        puntos:[],
        ubicaciones:[{direccion:undefined, nombre:undefined, email:undefined, idZona:undefined, nombreZona:undefined, acceso:"cliente"}]
	  }
    }
 
    componentWillMount(){
        axios.get("zon/zona/activos")
        .then(res=>{
            console.log(res.data)
            res.data.status &&this.setState({zonas:res.data.zona})
        })
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
            console.log(e.data.user)
            this.setState({
                razon_social:     user.razon_social ?user.razon_social :"",
                cedula:           user.cedula       ?user.cedula       :"",
                email:            user.email        ?user.email        :"",
                nombre:           user.nombre       ?user.nombre       :"",
                password :        user.password     ?user.password     :"",
                celular :         user.celular      ?user.celular      :"",
                tipo :            user.tipo         ?user.tipo         :"",
                acceso:           user.acceso       ?user.acceso       :"",
                avatar:           user.avatar       ?user.avatar       :"",
                avatar:           user.avatar       ?user.avatar       :"",
                ubicaciones:      user.ubicaciones  ?user.ubicaciones  :[],
                direccion_factura:user.direccion_factura ?user.direccion_factura :"",
            })
        })
        :null
    }
    renderPerfil(){
        const {razon_social, cedula, direccion_factura, email, nombre, celular,  codt, acceso, tipoAcceso, avatar, cargando, ubicaciones, tipo} = this.state
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
                        placeholder="Dirección factura"
                        autoCapitalize = 'none'
                        value={direccion_factura}
                        onChangeText={direccion_factura => this.setState({ direccion_factura })}
                        style={direccion_factura.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                }
            {/* UBICACION */}	
                {
                   acceso=="cliente"
                   &&<TouchableOpacity  style={ubicaciones.length<1 ?[style.btnUbicacion, style.inputRequired] :style.btnUbicacion} onPress={()=>this.setState({modalUbicacion:true})}>
                       <Text>{ubicaciones.length<1 ?"Ubicación entrega" :`Tienes ${ubicaciones.length} ubicaciones guardadas`}</Text>
                   </TouchableOpacity>
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
                       
                        mode="dropdown"
                        style={{
                            ...style,
                            placeholder: {
                            color: 'rgba(0,0,0,.2)',
                            fontSize: 15,
                            },
                        }}
                        value={tipo}
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
    actualizaUbicacion(){
        let {observacion, ubicaciones, direccion, emailUbicacion, nombreUbicacion, nombreZona} = this.state
        let data = {direccion, email:emailUbicacion, nombre:nombreUbicacion, observacion, nombreZona, nuevo:true, acceso:"cliente"}
        ubicaciones.push(data)
        this.setState({ubicaciones})
    }
    actualizaArrayUbicacion(type, value, key){
        let {ubicaciones} = this.state 
        type == "direccion" ?ubicaciones[key].direccion = value :type=="observacion" ?ubicaciones[key].observacion = value :type=="emailUbicacion" ?ubicaciones[key].email = value :ubicaciones[key].nombre = value
        this.setState({ubicaciones})
    }
    modalZonas(){
        const {modalZona, zonas, idZona} = this.state
        return(
            <Modal transparent visible={modalZona} animationType="fade" >
                <TouchableOpacity activeOpacity={1}  >   
                    <View style={style.modalZona}>
                        <View style={style.subModalZona}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalUbicacion:false})} style={style.btnModalClose}>
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.tituloModal}>Seleccione una Zona</Text>
                            <ScrollView>
                                {
                                    zonas.map((e, key)=>{
                                        return(
                                            <TouchableOpacity style={style.btnZona} key={key} onPress={()=>this.actualizaZona(e._id, e.nombre)}>
                                                <Text style={style.textZona}>{e.nombre}</Text>
                                                {idZona==e._id &&<Icon name={'check'} style={style.iconZona} />}
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    actualizaZona(id, nombre){
        const {key, ubicaciones} = this.state
        ubicaciones[key].idZona = id
        ubicaciones[key].nombreZona = nombre
        this.setState({ubicaciones, modalZona:false}) 
    }
    modalUbicacion(){
        let {modalUbicacion, ubicaciones} = this.state
        return(
            <Modal transparent visible={modalUbicacion} animationType="fade" >
                {this.modalZonas()}
                <TouchableOpacity activeOpacity={1}  >   
                    <View style={style.modal}>
                        <View style={style.subContenedorModal}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalUbicacion:false})} style={style.btnModalClose}>
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <ScrollView keyboardDismissMode="on-drag">
                                <Text style={style.tituloModal}>Si el pedido lo realizara el encargado del punto por favor inserta su informacion, de lo contrario solo inserta la dirección y zona</Text>
                                <View>
                                    {
                                        ubicaciones.map((e, key)=>{
                                            return(
                                                <View key={key}>
                                                    <TextInput
                                                        type='outlined'
                                                        label='Dirección'
                                                        placeholder="Dirección"
                                                        value={e.direccion}
                                                        onChangeText={direccion => this.actualizaArrayUbicacion("direccion", direccion, key)}
                                                        style={style.input}
                                                    />
                                                    <TouchableOpacity style={style.btnUbicacion} onPress={()=>this.setState({modalZona:true, key})}>
                                                        <Text style={style.textZona}>{e.nombreZona ?e.nombreZona :"Zona"}</Text>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        type='outlined'
                                                        label='observacion al momento de ingresar el vehiculo'
                                                        placeholder="observaciones ingreso del vehiculo"
                                                        value={e.observacion}
                                                        onChangeText={observacion => this.actualizaArrayUbicacion("observacion", observacion, key)}
                                                        style={style.input}
                                                    />
                                                    {
                                                        (e.nuevo || e.idCliente )
                                                        &&<TextInput
                                                            type='outlined'
                                                            label='Email'
                                                            placeholder="Email"
                                                            value={e.email}
                                                            onChangeText={emailUbicacion => this.actualizaArrayUbicacion("emailUbicacion", emailUbicacion, key)}
                                                            style={style.input}
                                                        />
                                                    }
                                                    {
                                                        (e.nuevo || e.idCliente)
                                                        &&<TextInput
                                                            type='outlined'
                                                            label='Nombre'
                                                            placeholder="Nombre"
                                                            value={e.nombre}
                                                            onChangeText={nombreUbicacion => this.actualizaArrayUbicacion("nombreUbicacion", nombreUbicacion, key)}
                                                            style={style.input}
                                                        />
                                                    }
                                                    
                                                    <Text style={style.separador}></Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <View style={style.contenedorAdd}>
                                    <TouchableOpacity onPress={() => this.actualizaUbicacion()} style={style.btnAdd}>
                                        <Icon name={'plus'} style={style.iconAdd} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={style.btnGuardarUbicacion} onPress={() => this.setState({modalUbicacion:false})}>
                                    <Text style={style.textGuardar}>Guardar</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
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
                {this.modalUbicacion()}
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

    /////////////////////////////////////////////////////////////////////////
    //////////////         VERIFICO QUE EL USUARIO TENGA TODOS LOS DATOS
    ///////////////////////////////////////////////////////////////////////
    handleSubmit(){
        const {razon_social, cedula, ubicacion, direccion_factura, nombre,  email, celular, tipo, acceso, codt, imagen, ubicaciones} = this.state
        console.log({razon_social, cedula, ubicacion, direccion_factura, nombre, email,  tipo, celular, tipo, acceso, codt, imagen, ubicaciones})
        if(acceso=="cliente"){
            if(razon_social=="" || cedula=="" || ubicacion=="" || direccion_factura=="" || nombre=="" || email=="" ||  celular=="" || tipo=="" || acceso=="usuario" || codt=="" || ubicaciones.length<1){
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
        const {razon_social, cedula, direccion_factura, nombre,  email, celular, tipo, acceso, codt, ubicaciones, imagen} = this.state
        let clientes = ubicaciones.filter(e=>{
            return e.email
        })
        let puntos = ubicaciones.filter(e=>{
            return !e.email 
        })
        puntos = puntos.map(e=>{
            return {direccion:e.direccion, idZona:e.idZona, observacion:e.observacion}
        })
        
        axios.post("user/sign_up", {razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, puntos})
        .then(e=>{
            console.log(e.data)
            if(e.data.status){
                if(acceso=="cliente") {
                    if(clientes.length>0){
                        axios.post("user/crea_varios", {clientes, idPadre:e.data.user._id, nombrePadre:e.data.user.nombre})
                        .then(res=>{
                            this.props.navigation.navigate("perfil")
                            Toast.show("Usuario guardado con exito")
                        })
                        .catch(err2=>{
                            console.log(err2)
                            this.setState({cargando:false})
                        })
                    }else{
                        axios.post("pun/punto/varios",{puntos, id:e.data.user._id})
                        .then(res=>{
                            console.log(res.data)
                            this.props.navigation.navigate("perfil")
                            Toast.show("Usuario guardado con exito")
                        })
                        .catch(err2=>{
                            console.log(err2)
                            this.setState({cargando:false})
                        })
                    }
                }else{
                    this.avatar(imagen, e.data.user._id)
                }
            }else{
                this.setState({cargando:false})
                Toast.show("Este email ya existe")
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({cargando:false})
        })
    }	
    editarUsuario(e){
        // this.setState({cargando:true})
        const {razon_social, cedula, ubicaciones, direccion_factura, nombre,  email, celular, tipo, acceso, codt, imagen} = this.state
        let clientes = ubicaciones.filter(e=>{
            return e.email && e.idCliente
        })
        
        let clientesNuevos = ubicaciones.filter(e=>{
            return e.email && !e.idCliente
        })

        let puntos = ubicaciones.filter(e=>{
            return !e.email 
        })
        puntos = puntos.map(e=>{
            return {direccion:e.direccion, idZona:e.idZona, observacion:e.observacion, _id:e._id}
        })
        let puntosNuevos = puntos.filter(e=>{
            return !e._id
        })
        puntos = puntos.filter(e=>{
            return e._id
        })
        console.log({clientes})
        console.log({clientesNuevos})
        console.log({puntos})
        console.log({puntosNuevos})
        axios.put("user/update", {razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt})
        .then(e=>{
            if(acceso=="cliente") {
                ////////////////////////////////////////////        EDITO LOS CLIENTES
                if(clientes.length>0){
                    axios.put("user/update_varios", {clientes, idPadre:e.data.user._id, nombrePadre:e.data.user.nombre})
                    .then(res=>{
                        // this.props.navigation.navigate("perfil")
                        Toast.show("Usuario guardado con exito")
                    })
                    .catch(err2=>{
                        console.log(err2)
                        this.setState({cargando:false})
                    })
                }
                ////////////////////////////////////////////        INSERTO LOS CLIENTES
                if(clientesNuevos.length>0){
                    axios.post("user/crea_varios", {clientes:clientesNuevos, idPadre:e.data.user._id, nombrePadre:e.data.user.nombre})
                    .then(res=>{
                        // this.props.navigation.navigate("perfil")
                        Toast.show("Usuario guardado con exito")
                    })
                    .catch(err2=>{
                        console.log(err2)
                        this.setState({cargando:false})
                    })
                }
                ////////////////////////////////////////////       EDITO LOS PUNTOS
                if(puntos.length>0){
                    axios.put("pun/punto/varios",{puntos, id:e.data.user._id})
                    .then(res=>{
                        console.log(res.data)
                        // this.props.navigation.navigate("perfil")
                        Toast.show("Usuario guardado con exito")
                    })
                    .catch(err2=>{
                        console.log(err2)
                        this.setState({cargando:false})
                    })
                }
                ////////////////////////////////////////////       INSERTO LOS PUNTOS
                if(puntosNuevos.length>0){
                    axios.post("pun/punto/varios", {puntos:puntosNuevos, id:e.data.user._id})
                    .then(res=>{
                        console.log(res.data)
                        // this.props.navigation.navigate("perfil")
                        Toast.show("Usuario guardado con exito")
                    })
                    .catch(err2=>{
                        console.log(err2)
                        this.setState({cargando:false})
                    })
                }
            }else{
                this.avatar(imagen, e.data.user._id)
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
