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
        ubicacionesEliminadas:[], //envio los id de las ubicaciones eliminados
        ubicaciones:[{direccion:undefined, nombre:undefined, email:undefined, idZona:undefined, nombreZona:undefined, acceso:"cliente"}]
	  }
    }
 
    componentWillMount(){
        //////////////////////////////  DEVUELVE EL LISTADO DE LAS ZONAS
        axios.get("zon/zona/activos")   
        .then(res=>{
            res.data.status &&this.setState({zonas:res.data.zona})
        })
        ////////////////////////////////////////////////////////////////
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
                imagen:           user.avatar       ?user.avatar       :"",
                codt:             user.codt         ?user.codt         :"",
                idUsuario:        user._id          ?user._id          :"",
                ubicaciones:      user.ubicaciones  ?user.ubicaciones  :[],
                direccion_factura:user.direccion_factura ?user.direccion_factura :"",
            })
        })
        :params.tipoAcceso=="editar"
        ?axios.get(`/user/byId/${params.idUsuario}`).then(e=>{
            const {user} = e.data
 
            this.setState({
                razon_social:     user.razon_social ?user.razon_social :"",
                cedula:           user.cedula       ?user.cedula       :"",
                email:            user.email        ?user.email        :"",
                nombre:           user.nombre       ?user.nombre       :"",
                password :        user.password     ?user.password     :"",
                celular :         user.celular      ?user.celular      :"",
                tipo :            user.tipo         ?user.tipo         :"",
                acceso:           user.acceso       ?user.acceso       :"",
                imagen:           user.avatar       ?user.avatar       :"",
                codt:             user.codt         ?user.codt         :"",
                ubicaciones:      user.ubicaciones  ?user.ubicaciones  :[],
                activo:           user.activo       &&user.activo ,
                idUsuario:        user._id          ?user._id          :"",
                direccion_factura:user.direccion_factura ?user.direccion_factura :"",
            })
        })
        :null
    }
    renderPerfil(){
        const {razon_social, cedula, direccion_factura, email, nombre, celular,  codt, acceso, tipoAcceso, imagen, cargando, ubicaciones, tipo, activo} = this.state
        console.log({tipoAcceso})
        return (
            <ScrollView  keyboardDismissMode="on-drag" style={{marginBottom:0}}>
            {tipoAcceso=="admin" ?<Text style={style.titulo}>Nuevo {acceso}</Text> :<Text style={style.titulo}>Editar perfil</Text> }
            {/* ACCESO */}	 
                {
                    (tipoAcceso=="admin" || tipoAcceso=="editar")
                    &&<View style={style.tipo}>
                        <RNPickerSelect
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
                    </View>
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
                    placeholder="Cedula / Nit"
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
            {/* CODT */}	
                {
                    acceso=="cliente"
                    &&<TextInput
                        type='outlined'
                        placeholder="CODT"
                        autoCapitalize = 'none'
                        value={codt}
                        onChangeText={codt => this.setState({ codt })}
                        style={style.input}
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
					// keyboardType='numeric'
                    value={celular}
                    onChangeText={celular => this.setState({ celular })}
                    style={celular.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* TIPO */}	 
                {
                    acceso=="cliente"
                    &&<View style={style.tipo}>
                        <RNPickerSelect
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
                                placeholder: {
                                color: 'rgba(0,0,0,.2)',
                                fontSize: 15,
                                },
                            }}
                            value={tipo}
                        />
                    </View>
                }
            {/* AVATAR */}	 
                {
                    acceso!=="cliente"    
                    &&<View>
                        <TomarFoto 
                            width={110}
                            source={imagen}
                            avatar
                            limiteImagenes={1}
                            imagenes={(imagen) => {  this.setState({imagen, editaAvatar:true, showLoading:false}) }}
                        /> 
                    </View>
                }
            {/* BOTON CAMBIAR ESTADO */}
                {
                    tipoAcceso=="editar"
                    &&<TouchableOpacity style={[style.btnGuardar, {backgroundColor:activo ?"green" :"orange", marginBottom:0} ]} onPress={()=>this.cambiarEstadoUsuario()}>
                        <Text style={style.textGuardar}>{activo ?"Desactivar" :"Activar"}</Text>
                    </TouchableOpacity> 
                }

            {/* BOTON ELIMINAR */}
                {
                    tipoAcceso=="editar"
                    &&<TouchableOpacity style={[style.btnGuardar, {backgroundColor:"red", marginBottom:0} ]}  onPress={()=>this.eliminarUsuario()}>
                        <Text style={style.textGuardar}>{"Eliminar"}</Text>
                    </TouchableOpacity> 
                }

            {/* BOTON GUARDAR */}
                {
                    !tipoAcceso
                    ?<TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit("editar")}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Editando" :"Editar"}</Text>
                    </TouchableOpacity> 
                    :tipoAcceso=="editar"
                    ?<TouchableOpacity style={style.btnGuardar} onPress={()=>this.editarUsuario("editar")}>
                    {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Editando" :"Editar Usuario"}</Text>
                    </TouchableOpacity>
                    :<TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit()}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Guardando" :"Guardar"}</Text>
                    </TouchableOpacity>   
                }
                
            </ScrollView>  
            
        )
    }
    eliminarUsuario(){
        const {nombre, idUsuario} = this.state
        Alert.alert(
            'Seguro desea eliminar',
            `al usuario ${nombre}`,
            [
                {text: 'Confirmar', onPress: () => confirmar()},
               
                {text: 'Cancelar', onPress: () =>  console.log("cancelado")},
            ],
            { cancelable: false }
        )
        const confirmar =() =>{
            axios.get(`/users/eliminar/${idUsuario}`)
            .then(res=>{
                if(res.data.status){
                    this.props.navigation.navigate("Home")
                    Toast.show("Usuario eliminado con exito")
                }
            })
        }
    }
    cambiarEstadoUsuario(){
        const {nombre, idUsuario, activo} = this.state
        console.log({nombre, idUsuario, activo})
        Alert.alert(
            `Seguro desea ${activo ?"Desactivar" :"Activar"}`,
            `al usuario ${nombre}`,
            [
                {text: 'Confirmar', onPress: () => confirmar()},
               
                {text: 'Cancelar', onPress: () =>  console.log("cancelado")},
            ],
            { cancelable: false }
        )
        const confirmar =() =>{
            axios.get(`/users/cambiarEstado/${idUsuario}/${!activo}`)
            .then(res=>{
                if(res.data.status){
                    this.props.navigation.navigate("Home")
                    Toast.show("Usuario guardado con exito")
                }
            })

        }
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
            <View  animationType="fade" >
                <TouchableOpacity activeOpacity={1}  >   
                    <View style={style.modalZona}>
                        <View style={style.subModalZona}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalZona:false})} style={style.btnModalClose}>
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
            </View>
        )
    }
    actualizaZona(id, nombre){
        const {key, ubicaciones} = this.state
        ubicaciones[key].idZona = id
        ubicaciones[key].nombreZona = nombre
        this.setState({ubicaciones, modalZona:false}) 
    }
 
    modalUbicacion(){
        let {modalZona, ubicaciones} = this.state
        console.log(modalZona)
        return(
            <View>
                {modalZona ?this.modalZonas() :null}
                <View>
                    <TouchableOpacity activeOpacity={1}  >   
                        <View style={style.modal}>
                            <View style={style.subContenedorModal}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalUbicacion:false})} style={style.btnModalClose}>
                                    <Icon name={'times-circle'} style={style.iconCerrar} />
                                </TouchableOpacity>
                                <ScrollView keyboardDismissMode="on-drag" >
                                    <Text style={style.tituloModal}>Si el pedido lo realizara el encargado del punto por favor inserta su informacion, de lo contrario solo inserta la dirección y zona</Text>
                                    <View>
                                        {
                                            ubicaciones.map((e, key)=>{
                                                return(
                                                    <View key={key}>
                                                    <View>
                                                            <TextInput
                                                                type='outlined'
                                                                label='Dirección'
                                                                placeholder="Dirección"
                                                                value={e.direccion}
                                                                onChangeText={direccion => this.actualizaArrayUbicacion("direccion", direccion, key)}
                                                                style={style.input}
                                                            />
                                                            <Text style={style.asterisco}>*</Text>
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity style={style.btnUbicacion} onPress={()=>this.setState({modalZona:true, key})}>
                                                                <Text style={style.textZona}>{e.nombreZona ?e.nombreZona :"Zona"}</Text>
                                                            </TouchableOpacity>
                                                            <Text style={style.asterisco}>*</Text>
                                                        </View>
                                                        <TextInput
                                                            type='outlined'
                                                            label='observacion al momento de ingresar el vehiculo'
                                                            placeholder="observaciones ingreso del vehiculo"
                                                            value={e.observacion}
                                                            onChangeText={observacion => this.actualizaArrayUbicacion("observacion", observacion, key)}
                                                            style={[style.input, {marginBottom: (e.nuevo || !e.idCliente ) && key>0 ?40 :10}]}
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
                                                                style={[style.input, {marginBottom: key>0 ?40 :10}]}
                                                            />
                                                        }
                                                        {
                                                            key>0
                                                            &&<TouchableOpacity style={style.btnEliminar} onPress={()=>this.eliminarUbicacion(key)}>
                                                                <Icon name={'trash'} style={style.iconEliminar} />
                                                            </TouchableOpacity>
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
                                    <TouchableOpacity style={style.btnGuardarUbicacion} onPress={() => this.guardarUbicacion() }>
                                        <Text style={style.textGuardar}>Guardar</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
             </View>
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
        const {modalUbicacion, modalZona} = this.state   
        return (
            <View  style={style.container}>
                {modalUbicacion ?this.modalUbicacion() :null}
                {this.renderPerfil()}
                <Footer navigation={navigation} />
            </View>
        )
    }
    guardarUbicacion(){
        let {ubicaciones} = this.state
        ubicaciones = ubicaciones.filter((e, index)=>{
            return e.direccion!=undefined
        })
        ubicaciones = ubicaciones.filter((e, index)=>{
            return e.direccion!="" 
        })
        const isEmpty = Object.values(ubicaciones).every(x => {
            if(!x.idZona){ 
              return false
            }else{
              return true
            }
          })
        console.log(isEmpty)
        console.log(ubicaciones)
        !isEmpty ?alert("Zonas son obligatorios") :this.setState({ubicaciones, modalUbicacion:false})
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
    handleSubmit(esEditar){
        const {razon_social, cedula, ubicacion, direccion_factura, nombre,  email, celular, tipo, acceso, codt, imagen, ubicaciones} = this.state
        console.log({razon_social, cedula, ubicacion, direccion_factura, nombre, email,  tipo, celular, tipo, acceso, codt, imagen, ubicaciones})
        if(acceso=="cliente"){
            if(razon_social=="" || cedula=="" || ubicacion=="" || direccion_factura=="" || nombre=="" || email=="" ||  celular=="" || tipo=="" || acceso=="usuario"  || ubicaciones.length<1){
                Alert.alert(
                    'Todos los campos son obligatorios',
                    '',
                    [
                    {text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    { cancelable: false }
                )
            }else{
                esEditar=="editar" ?this.editarUsuario() :this.guardarUsuario()
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
                esEditar=="editar" ?this.editarUsuario() :this.guardarUsuario()
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////
    //////////////         ELIMINO LA UBICACION SELECCIONADA
    ///////////////////////////////////////////////////////////////////////
    eliminarUbicacion(key){
        let {ubicaciones, ubicacionesEliminadas} = this.state
        ubicaciones.filter((e, index)=>{
            if(index==key){
                ubicacionesEliminadas.push(e._id)
            }
        })
        ubicaciones = ubicaciones.filter((e, index)=>{
            return index!=key
        })
        
        this.setState({ubicaciones, ubicacionesEliminadas })
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
        this.setState({cargando:true})
        const {razon_social, cedula, ubicaciones, direccion_factura, nombre,  email, celular, tipo, acceso, codt, imagen, editaAvatar, idUsuario, ubicacionesEliminadas} = this.state
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
        console.log({acceso})
        axios.put(`user/update/${idUsuario}`, {razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicacionesEliminadas})
        .then(e=>{
            console.log(e.data)
            if(acceso=="cliente") {
                ////////////////////////////////////////////        EDITO LOS CLIENTES
                if(clientes.length>0){
                    axios.put("user/update_varios", {clientes, idPadre:e.data.user._id, nombrePadre:e.data.user.nombre})
                    .then(res=>{
                        AsyncStorage.setItem('nombre', e.data.user.nombre)
                        this.props.navigation.navigate("Home")
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
                        AsyncStorage.setItem('nombre', e.data.user.nombre)
                        this.props.navigation.navigate("Home")
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
                        AsyncStorage.setItem('nombre', e.data.user.nombre)
                        this.props.navigation.navigate("Home")
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
                        AsyncStorage.setItem('nombre', e.data.user.nombre)
                        this.props.navigation.navigate("Home")
                        Toast.show("Usuario guardado con exito")
                    })
                    .catch(err2=>{
                        console.log(err2)
                        this.setState({cargando:false})
                    })
                }
                AsyncStorage.setItem('nombre', e.data.user.nombre)
                this.props.navigation.navigate("Home")
                Toast.show("Usuario editado con exito")
                this.setState({cargando:false})
            }else{
                if(editaAvatar){
                    this.avatar(imagen, e.data.user._id)
                }else{
                    this.edicionExitosa(nombre)
                }
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({cargando:false})
        })
    } 
    async edicionExitosa(nombre){
        this.setState({cargando:false})
        AsyncStorage.setItem('nombre', nombre)
        Toast.show("Usuario editado")
        this.props.navigation.navigate("inicio")
    }
    async loginExitoso(user){
        console.log(user)
        AsyncStorage.setItem('nombre', user.nombre)
        AsyncStorage.setItem('avatar', user.avatar)
        this.setState({cargando:false})
        Toast.show("Usuario guardado con exito")
        this.props.navigation.navigate("Home")
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
