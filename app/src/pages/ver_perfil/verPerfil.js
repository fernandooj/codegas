import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ImageBackground, ActivityIndicator, Alert, Modal} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import axios from "axios"
import Icon from 'react-native-fa-icons';
import AsyncStorage from '@react-native-community/async-storage';
import ModalFilterPicker        from 'react-native-modal-filter-picker'
import RNPickerSelect from 'react-native-picker-select';
import Footer    from '../components/footer'
import TomarFoto from "../components/tomarFoto";
import Toast from 'react-native-simple-toast';
import { createFilter }    from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['nombre'] 
const accesos=[
    {label: 'Administrador',        value: 'admin',      key: 'administrador'},
    {label: 'Solución Cliente',     value: 'solucion',   key: 'solucion'},
    {label: 'Despachos',            value: 'despacho',   key: 'despacho'},
    {label: 'Conductor',            value: 'conductor',  key: 'conductor'},
    {label: 'Veo',                  value: 'veo',        key: 'veo'},
    {label: 'Cliente',              value: 'cliente',    key: 'cliente'},
    {label: 'Comercial',            value: 'comercial',  key: 'comercial'},
    {label: 'Departamento Tecnico', value: 'depTecnico', key: 'depTecnico'},
    {label: 'Inspector Seguridad',  value: 'insSeguridad', key: 'insSeguridad'}
]

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
        codMagister:"",
        terminoBuscador:"",
        valorUnitario:"",
        modalUbicacion:false,
        modalZona:false,
        modalCliente:false,
        zonas:[],
        puntos:[],
        imagen:[],
        veos:[],
        ubicacionesEliminadas:[], //envio los id de las ubicaciones eliminados
        ubicaciones:[{direccion:undefined, nombre:undefined, email:undefined, celular:undefined, idZona:undefined, nombreZona:undefined, capacidad:undefined, nuevo:true, acceso:"cliente"}]
	  }
    }
 
    async componentWillMount(){
        const accesoPerfil = await AsyncStorage.getItem('acceso')
        this.setState({accesoPerfil})
        
         //////////////////////////////  DEVUELVE LOS USUARIOS TIPO VEOS
         axios.get("users/acceso/veo")   
         .then(res=>{
       
            let veos = res.data.usuarios.map(e=>{
                return {key:e._id, label:e.nombre}
            }) 
            this.setState({veos})            
         })


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
            console.log(user)
            this.setState({
                razon_social:     user.razon_social  ?user.razon_social :"",
                cedula:           user.cedula        ?user.cedula       :"",
                email:            user.email         ?user.email        :"",
                nombre:           user.nombre        ?user.nombre       :"",
                password :        user.password      ?user.password     :"",
                celular :         user.celular       ?user.celular      :"",
                tipo :            user.tipo          ?user.tipo         :"",
                acceso:           user.acceso        ?user.acceso       :"",
                imagen:           user.avatar        ?user.avatar       :[],
                codt:             user.codt          ?user.codt         :"",
                valorUnitario:    user.valorUnitario ?user.valorUnitario:"",
                idUsuario:        user._id           ?user._id          :"",
                codMagister:      user.codMagister   ?user.codMagister  :"", 
                editado:          user.editado       ?user.editado      :false,
                ubicaciones:      user.ubicaciones   ?user.ubicaciones  :[],
                direccion_factura:user.direccion_factura ?user.direccion_factura :"",
            })
        })
        :params.tipoAcceso=="editar"
        ?axios.get(`/user/byId/${params.idUsuario}`).then(e=>{
            console.log(e.data)
            const {user} = e.data
            let ubicaciones =  user.ubicaciones  ?user.ubicaciones  :[]
            ubicaciones= ubicaciones.map(data=>{
                let data1 = params.idUsuario
                let data2 = data.idCliente
                if(data1===data2){
                    return {
                        direccion: data.direccion,
                        email: undefined,
                        idCliente: undefined,
                        idZona: data.idZona,
                        nombre: undefined,
                        celular: undefined,
                        nombreZona: data.nombreZona,
                        observacion: data.observacion,
                        capacidad: data.capacidad,
                        _id: data._id
                    }
                }else{
                    return {
                        direccion  : data.direccion,
                        email      : data.email,
                        idCliente  : data.idCliente,
                        idZona     : data.idZona,
                        nombre     : data.nombre,
                        celular    : data.celular,
                        nombreZona : data.nombreZona,
                        observacion: data.observacion,
                        capacidad  : data.capacidad,
                        _id        : data._id
                    }
                }
            })  
           
            console.log(user.valorUnitario)
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
                ubicaciones,
                activo:           user.activo       &&user.activo ,
                idUsuario:        user._id          ?user._id          :"",
                veo:              user.veos         ?user.veos.nombre  :"",
                codMagister:      user.codMagister   ?user.codMagister  :"",
                valorUnitario:    user.valorUnitario,
                direccion_factura:user.direccion_factura ?user.direccion_factura :"",
            })
        })
        :null
    }
    renderPerfil(){
        let {razon_social, cedula, direccion_factura, email, nombre, celular,  codt, acceso, valorUnitario, tipoAcceso, imagen, cargando, ubicaciones, tipo, activo, idUsuario, accesoPerfil, modalCliente, veos, veo, codMagister} = this.state
        valorUnitario = valorUnitario.toString()
        return (
            <ScrollView keyboardDismissMode="on-drag" style={style.contenedorPerfil}>
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
                            items={accesos}
                            onValueChange={acceso => {this.setState({ acceso })}}
                            mode="dropdown"
                            style={{
                                ...style,
                                placeholder: {
                                color: 'rgba(0,0,0,1)',
                                fontSize: 15,
                                },
                            }}
                            value={acceso}
                        />    
                    </View>
                }
            {/* EMAIL */}	 
            <Text style={style.textInfo}>Email</Text>
            <TextInput
                type='outlined'
                placeholder="Email"
                autoCapitalize = 'none'
                keyboardType='email-address'
                placeholderTextColor="#aaa" 
                value={email}
                onChangeText={email => this.setState({ email })}
                style={email.length<3 ?[style.input, style.inputRequired] :style.input}
            />    

            {/* RAZON SOCIAL */}	 
                {
                    acceso=="cliente"
                    &&<View>
                        <Text style={style.textInfo}>Razón Social</Text>
                        <TextInput
                            type='outlined'
                            placeholderTextColor="#aaa" 
                            placeholder="Razón Social"
                            autoCapitalize = 'none'
                            value={razon_social}
                            onChangeText={razon_social => this.setState({ razon_social })}
                            style={razon_social.length<3 ?[style.input, style.inputRequired] :style.input}
                        />
                    </View>
                }

            {/* CEDULA */}	
                <Text style={style.textInfo}>Cedula/ Nit</Text> 
                <TextInput
                    type='outlined'
                    placeholder="Cedula / Nit"
                    placeholderTextColor="#aaa" 
                    keyboardType='numeric'
                    value={cedula}
                    onChangeText={cedula => this.setState({ cedula })}
                    style={cedula.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* DIRECCION */}	
                {
                    acceso=="cliente"
                    &&<View>
                        <Text style={style.textInfo}>Dirección factura</Text>
                        <TextInput
                            type='outlined'
                            placeholder="Dirección factura"
                            placeholderTextColor="#aaa" 
                            autoCapitalize = 'none'
                            value={direccion_factura}
                            onChangeText={direccion_factura => this.setState({ direccion_factura })}
                            style={direccion_factura.length<3 ?[style.input, style.inputRequired] :style.input}
                        />
                    </View>    
                }
            {/* UBICACION */}	
                {
                   acceso=="cliente"
                   &&<View>
                       <Text style={style.textInfo}>Ubicación entrega</Text>
                        <TouchableOpacity  style={ubicaciones.length<1 ?[style.btnUbicacion, style.inputRequired] :style.btnUbicacion} onPress={()=>this.setState({modalUbicacion:true})}>
                            {
                                ubicaciones[0].direccion
                                ?<Text>{ubicaciones.length<1 ?"Ubicación entrega" :`Tienes ${ubicaciones.length} ubicaciones guardadas`}</Text>
                                :<Text>Ubicación entrega</Text>
                            }
                            
                        </TouchableOpacity>
                    </View>
               }
            {/* CODT */}	
                {
                    acceso=="cliente"
                    &&<>
                    <Text style={style.textInfo}>Codt</Text>
                    <TextInput
                        type='outlined'
                        placeholder="CODT"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        value={codt}
                        onChangeText={codt => this.setState({ codt })}
                        style={style.input}
                    />
                    </>
                }
           
            {/* NOMBRES */}	 
                <Text style={style.textInfo}>Nombres</Text>
                <TextInput
                    type='outlined'
                    label='Nombres'
                    placeholder="Nombres"
                    autoCapitalize = 'none'
                    placeholderTextColor="#aaa" 
                    value={nombre}
                    onChangeText={nombre => this.setState({ nombre })}
                    style={nombre.length<3 ?[style.input, style.inputRequired] :style.input}
                />
            {/* CELULAR */}	 
                <Text style={style.textInfo}>Celular</Text>
                <TextInput
                    type='outlined'
                    placeholder="Celular"
                    autoCapitalize = 'none'
					placeholderTextColor="#aaa" 
                    value={celular}
                    onChangeText={celular => this.setState({ celular })}
                    style={celular.length<3 ?[style.input, style.inputRequired] :style.input}
                />

            {/* VEO */}	 
            {
                acceso=="veo"
                &&<><Text style={style.textInfo}>Codigo Magister</Text>
                    <TextInput
                        type='outlined'
                        placeholder="Codigo Magister"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        value={codMagister}
                        onChangeText={codMagister => this.setState({ codMagister })}
                        style={codMagister.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                    </>
            }
             {/* VALOR UNITARIO */}	 
             {   
                acceso=="cliente"
                &&<>
                    <Text style={style.textInfo}>Valor Unitario</Text>
                    <TextInput
                        type='outlined'
                        placeholder="Valor Unitario"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        value={valorUnitario}
                        onChangeText={valorUnitario => this.setState({ valorUnitario })}
                        style={valorUnitario.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                </>
            }


            {/* TIPO */}	 
                {
                    acceso=="cliente"
                    &&<View>
                        <Text style={style.textInfo}>Tipo</Text>
                        <View style={style.tipo}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Tipo',
                                value: null,
                                color: '#00218b',
                            }}
                            items={[
                                {label: 'Residencial', value: 'Residencial',key: 'Residencial'},
                                {label: 'Comercial', value: 'Comercial',key:   'Comercial'},
                                {label: 'Industrial',value: 'Industrial',key:   'Industrial'}
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
                    </View>
                }

                <ModalFilterPicker
					placeholderText="Filtrar ..."
					visible={modalCliente}
					onSelect={(e)=>this.asignarVeo(e )}
					onCancel={()=>this.setState({modalCliente:false})}
                    options={veos}
                    cancelButtonText="CANCELAR"
                />
               
                {
                    (tipoAcceso=="editar" && (accesoPerfil=="admin" || accesoPerfil=="comercial") || acceso=="cliente")
                    &&
                    <View>
                        <Text style={style.textInfo}>Comercial Veo</Text>
                        <TouchableOpacity onPress={()=>this.setState({modalCliente:true})} style={style.inputVeo}>
                            <Text style={style.textVeo}>{veo ?veo :"Veos"}</Text>
                        </TouchableOpacity>
                    </View>
                }

            {/* AVATAR */}	 
                {
                    acceso!=="cliente"    
                    &&<View>
                        <TomarFoto 
                            width={110}
                            source={imagen}
                            titulo="Foto de perfil"
                            limiteImagenes={1}
                            imagenes={(imagen) => {  this.setState({imagen, editaAvatar:true, showLoading:false}) }}
                        /> 
                    </View>
                }
            {/* BOTON CAMBIAR ESTADO */}
                {
                    (tipoAcceso=="editar" && accesoPerfil=="admin")
                    &&<TouchableOpacity style={[style.btnGuardar, {backgroundColor:activo ?"green" :"orange", marginBottom:0} ]} onPress={()=>this.cambiarEstadoUsuario()}>
                        <Text style={style.textGuardar}>{activo ?"Desactivar" :"Activar"}</Text>
                    </TouchableOpacity> 
                }

            {/* BOTON ELIMINAR */}
                {
                    (tipoAcceso=="editar" && accesoPerfil=="admin")
                    &&<TouchableOpacity style={[style.btnGuardar, {backgroundColor:"red", marginBottom:0} ]}  onPress={()=>this.eliminarUsuario()}>
                        <Text style={style.textGuardar}>{"Eliminar"}</Text>
                    </TouchableOpacity> 
                }

            {/* BOTON GUARDAR */}
                {
                    !tipoAcceso
                    ?<TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit("editar")}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Guardando" :"Guardar"}</Text>
                    </TouchableOpacity> 
                    :(tipoAcceso=="editar" && accesoPerfil=="admin")
                    ?<TouchableOpacity style={style.btnGuardar} onPress={()=>this.editarUsuario("editar")}>
                    {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Guardando" :"Guardar Usuario"}</Text>
                    </TouchableOpacity>
                    :accesoPerfil=="admin"
                    &&<TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit()}>
                        {cargando &&<ActivityIndicator style={{marginRight:5}}/>}
                        <Text style={style.textGuardar}>{cargando ?"Guardando" :"Guardar"}</Text>
                    </TouchableOpacity>   
                }
                {
                   (tipoAcceso=="editar" && (accesoPerfil=="admin" || accesoPerfil=="veo"))
                    &&<TouchableOpacity style={[style.btnGuardar, {backgroundColor:"#feac00", marginBottom:70} ]} onPress={()=>this.props.navigation.navigate("chart", {idUsuario})}>
                        <Text style={style.textGuardar}>{"Graficos"}</Text>
                    </TouchableOpacity> 
                }
                
            </ScrollView>  
            
        )
    }
    asignarVeo(idVeo){
        const {idUsuario, veos} = this.state
        axios.get(`/users/asignarComercial/${idUsuario}/${idVeo}`)
        .then(res=>{
            if(res.data.status){
                let veo = veos.filter(e=>{
                    return e.key==idVeo
                }) 
      
                
                this.setState({veo:veo[0].label, modalCliente:false})   
                setTimeout(() => {
                    Toast.show("Usuario asignado", Toast.LONG)
                }, 300);



            }
        })
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
        let {observacion, ubicaciones, direccion, emailUbicacion, celularUbicacion, nombreUbicacion, nombreZona} = this.state
        let data = {direccion, email:emailUbicacion, celular:celularUbicacion, nombre:nombreUbicacion, observacion, nombreZona, nuevo:true, acceso:"cliente"}
        ubicaciones.push(data)
        this.setState({ubicaciones})
    }
    actualizaArrayUbicacion(type, value, key){
        let {ubicaciones} = this.state 
        type == "direccion"       ?ubicaciones[key].direccion   = value 
        :type=="observacion"      ?ubicaciones[key].observacion = value 
        :type=="emailUbicacion"   ?ubicaciones[key].email       = value 
        :type=="celularUbicacion" ?ubicaciones[key].celular       = value 
        :type=="capacidad"        ?ubicaciones[key].capacidad   = value 
        :ubicaciones[key].nombre = value
        this.setState({ubicaciones})
    }
    modalZonas(){
        const {zonas, idZona, terminoBuscador} = this.state
        let filtroZonas = zonas.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return(
            <View  animationType="fade" >
                <TouchableOpacity activeOpacity={1}  >   
                    <View style={style.modalZona}>
                        <View style={style.subModalZona}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalZona:false})} style={style.btnModalClose}>
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <TextInput
                                type='outlined'
                                label='Buscar Zona'
                                placeholder="Buscar Zona"
                                 
                                onChangeText={terminoBuscador => this.setState({terminoBuscador})}
                                style={style.inputZona}
                            />
                            <ScrollView>
                                {
                                    filtroZonas.map((e, key)=>{
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
                                                            label='capacidad'
                                                            placeholder="Capacidad almacenamiento"
                                                            value={e.capacidad}
                                                            onChangeText={capacidad => this.actualizaArrayUbicacion("capacidad", capacidad, key)}
                                                            style={style.input}
                                                        />
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
                                                            (e.nuevo || e.idCliente )
                                                            &&<TextInput
                                                                type='outlined'
                                                                label='Celular'
                                                                placeholder="Celular"
                                                                value={e.celular}
                                                                onChangeText={celularUbicacion => this.actualizaArrayUbicacion("celularUbicacion", celularUbicacion, key)}
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
        return <View style={style.contenedorPerfil}>
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
                    <TouchableOpacity style={style.btnGuardar} onPress={()=>this.cambiarPass()}>
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
        const {modalUbicacion, showPass, editado, acceso} = this.state   
 
        return (
            <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo.jpg')} >
                {modalUbicacion ?this.modalUbicacion() :null}
                {
                    showPass
                    ?this.renderFormPass()
                    :this.renderPerfil()
                }
                <Footer navigation={navigation} />
            </ImageBackground>
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
 
        !isEmpty ?alert("Zonas son obligatorios") :this.setState({ubicaciones, modalUbicacion:false})
    }
    ///////////////////////////////////////////////////////////////
    //////////////          ACTUALIZA EL AVATAR
    ///////////////////////////////////////////////////////////////
    avatar(imagen, idUser){
      
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

     
    /////////////////////////////////////////////////////////////////////////
    //////////////         VERIFICO QUE EL USUARIO TENGA TODOS LOS DATOS
    ///////////////////////////////////////////////////////////////////////
    handleSubmit(esEditar){
        const {razon_social, cedula, ubicacion, direccion_factura, nombre,  email, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario} = this.state
        console.log({razon_social, cedula, ubicacion, direccion_factura, nombre, email,  tipo, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario})
        if(acceso=="cliente"){
            if(razon_social=="" || cedula=="" || ubicacion=="" || valorUnitario=="" || direccion_factura=="" || nombre=="" || email=="" ||  celular=="" || tipo=="" || acceso=="usuario"  || ubicaciones.length<1){
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
        const {razon_social, cedula, direccion_factura, nombre,  email, celular, tipo, acceso, codt, ubicaciones, imagen, codMagister, valorUnitario} = this.state
        let clientes = ubicaciones.filter(e=>{
            return e.email
        })
        let puntos = ubicaciones.filter(e=>{
            return !e.email 
        })
        puntos = puntos.map(e=>{
            return {direccion:e.direccion, idZona:e.idZona, observacion:e.observacion, capacidad:e.capacidad}
        })
        
        axios.post("user/sign_up", {razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, puntos, codMagister, valorUnitario})
        .then(e=>{
            console.log(e.data)
            if(e.data.status){
                if(acceso=="cliente") {
                    if(clientes.length>0){
                        axios.post("user/crea_varios", {clientes, idPadre:e.data.user._id, nombrePadre:e.data.user.nombre})
                        .then(res=>{
                            this.props.navigation.navigate("Home")
                            Toast.show("Usuario guardado con exito")
                        })
                        .catch(err2=>{
                            console.log(err2)
                            this.setState({cargando:false})
                        })
                    }else{
                        axios.post("pun/punto/varios",{puntos, idPadre:e.data.user._id})
                        .then(res=>{
                            console.log(res.data)
                            this.props.navigation.navigate("Home")
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
        const {razon_social, cedula, ubicaciones, direccion_factura, nombre,  email, celular, tipo, acceso, codt, imagen, editaAvatar, idUsuario, ubicacionesEliminadas, editado, codMagister, valorUnitario} = this.state
        let clientes = ubicaciones.filter(e=>{
            return e.email && e.idCliente
        })
        
        let clientesNuevos = ubicaciones.filter(e=>{
            return e.email && !e.idCliente
        })

        let puntos = ubicaciones.filter(e=>{
            return !e.email 
        })
        
        puntos = ubicaciones.map(e=>{
            return {direccion:e.direccion, idZona:e.idZona, observacion:e.observacion, _id:e._id, capacidad:e.capacidad}
        })
        let puntosNuevos = puntos.filter(e=>{
            return !e._id
        })
        puntos = puntos.filter(e=>{
            return e._id
        })
        console.log({ubicacionesEliminadas, puntos, puntosNuevos})
        axios.put(`user/update/${idUsuario}`, {puntos, puntosNuevos, razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicacionesEliminadas, codMagister, valorUnitario})
        .then(e=>{
            console.log(e.data)
            if(acceso=="cliente") {
                ////////////////////////////////////////////        EDITO LOS CLIENTES
                if(clientes.length>0){
                    
                    axios.put("user/update_varios", {clientes, idPadre:idUsuario, nombrePadre:e.data.user.nombre})
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
                    console.log("perrito")
                    axios.post("user/crea_varios", {clientes:clientesNuevos, idPadre:idUsuario, nombrePadre:e.data.user.nombre})
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
                // if(puntos.length>0){
                //     axios.put("pun/punto/varios",{puntos, idPadre:idUsuario})
                //     .then(res=>{
                //         AsyncStorage.setItem('nombre', e.data.user.nombre)
                //         //this.props.navigation.navigate("Home")
                //         Toast.show("Usuario guardado con exito")
                //     })
                //     .catch(err2=>{
                //         console.log(err2)
                //         this.setState({cargando:false})
                //     })
                // }
                ////////////////////////////////////////////       INSERTO LOS PUNTOS
                // if(puntosNuevos.length>0){
                //     axios.post("pun/punto/varios", {puntos:puntosNuevos, idPadre:idUsuario, idCliente:idUsuario})
                //     .then(res=>{
                //         AsyncStorage.setItem('nombre', e.data.user.nombre)
                //         this.props.navigation.navigate("Home")
                //         Toast.show("Usuario guardado con exito")
                //     })
                //     .catch(err2=>{
                //         console.log(err2)
                //         this.setState({cargando:false})
                //     })
                // }
                if(editado==false){
                    
                    this.setState({showPass:true, cargando:false})
                }else{
                    AsyncStorage.setItem('nombre', e.data.user.nombre)
                    this.props.navigation.navigate("Home")
                    Toast.show("Usuario editado con exito")
                    this.setState({cargando:false})

                }

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
    cambiarPass(){
        const {email, password, confirmar} = this.state
        if(password.length<3 || confirmar.length<3){
            alert("Inserte ambos campos")
        }
        else if(password!=confirmar){
            alert("Las contraseñas no coinciden")
        }else{
            axios.post("user/CambiarPassword", {email,password})
            .then(e=>{
                console.log(e.data)
                if(e.data.status) {
                    Toast.show("Informacion editada")
                    this.props.navigation.navigate("Home")
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde")
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
        
    }

    async edicionExitosa(nombre){
        
        this.setState({cargando:false})
        Toast.show("Usuario editado")
        this.props.navigation.navigate("Home")
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
