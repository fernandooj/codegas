import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Dimensions, Modal, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';
import Footer   from '../components/footer'
import axios    from 'axios'
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-fa-icons';
 
import {style} from './style'

 
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        terminoBuscador:"",
        razon_social:"",
        cedula:"",
        direccion_factura:"",
        email:"",
        nombre:"",
        password:"",
        celular:"",
        tipo:"",
		inicio:0,
		final:7,
        categoriaUser:[],
        modalUbicacion:false,
        modalZona:false,
        zonas:[],
        ubicaciones:[{direccion:undefined, nombre:undefined, email:undefined, idZona:undefined, nombreZona:undefined, acceso:"cliente"}]
	  }
	}
	 
	async componentWillMount(){
        axios.get("zon/zona/activos")
        .then(res=>{
            console.log(res.data)
            res.data.status &&this.setState({zonas:res.data.zona})
        })	
    }
    actualizaUbicacion(){
        let {observacion, ubicaciones, direccion, emailUbicacion, nombreUbicacion, nombreZona} = this.state
        let data = {direccion, email:emailUbicacion, nombre:nombreUbicacion, observacion, nombreZona, acceso:"cliente"}
        ubicaciones.push(data)
        this.setState({ubicaciones})
    }
    actualizaArrayUbicacion(type, value, key){
        console.log({type, value, key})
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
                                                        style={style.inputUbicacion}
                                                    />
                                                    <TouchableOpacity style={style.btnOpenZona} onPress={()=>this.setState({modalZona:true, key})}>
                                                        <Text style={style.textZona}>{e.nombreZona ?e.nombreZona :"Zona"}</Text>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        type='outlined'
                                                        label='observacion al momento de ingresar el vehiculo'
                                                        placeholder="observaciones ingreso del vehiculo"
                                                        value={e.observacion}
                                                        onChangeText={observacion => this.actualizaArrayUbicacion("observacion", observacion, key)}
                                                        style={style.inputUbicacion}
                                                    />
                                                    <TextInput
                                                        type='outlined'
                                                        label='Email'
                                                        placeholder="Email"
                                                        value={e.email}
                                                        onChangeText={emailUbicacion => this.actualizaArrayUbicacion("emailUbicacion", emailUbicacion, key)}
                                                        style={style.inputUbicacion}
                                                    />
                                                    <TextInput
                                                        type='outlined'
                                                        label='Nombre'
                                                        placeholder="Nombre"
                                                        value={e.nombre}
                                                        onChangeText={nombreUbicacion => this.actualizaArrayUbicacion("nombreUbicacion", nombreUbicacion, key)}
                                                        style={style.inputUbicacion}
                                                    />
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
	renderRegistro(){
        const {razon_social, cedula, showcontrasena, direccion_factura, nombre, password, celular, tipo, ubicaciones} = this.state
        return(
            <ScrollView style={style.containerRegistro}>
                <View style={style.subContainerRegistro}>
                    <Text style={style.titulo}>Editar Perfil</Text>
                    <TextInput
                        style={razon_social.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Razón social"
                        onChangeText={(razon_social) => this.setState({razon_social})}
                        value={razon_social}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={cedula.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Cedula / Nit"
                        onChangeText={(cedula) => this.setState({cedula})}
                        value={cedula}
                        keyboardType="numeric"
                    />
                    <TextInput
                        type='outlined'
                        placeholder="Dirección factura"
                        autoCapitalize = 'none'
                        value={direccion_factura}
                        onChangeText={direccion_factura => this.setState({ direccion_factura })}
                        style={direccion_factura.length<3 ?[style.input, style.inputRequired] :style.input}
                    />
                   
                    <TouchableOpacity  style={!ubicaciones[0].idZona ?[style.btnUbicacion, style.inputInvalid] :style.btnUbicacion} onPress={()=>this.setState({modalUbicacion:true})}>
                       <Text>{!ubicaciones[0].idZona ?"Ubicación entrega" :`Tienes ${ubicaciones.length} ubicaciones guardadas`}</Text>
                   </TouchableOpacity>
                    <TextInput
                        style={nombre.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Nombres"
                        onChangeText={(nombre) => this.setState({nombre})}
                        value={nombre}
                        autoCapitalize="none"
                    />
                    <View style={{flexDirection:"row"}}>
                        <TextInput
                            style={password.length<2 ?[style.input, style.inputInvalid] :style.input}
                            placeholder="Contraseña"
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry
                            value={password}
                            secureTextEntry={showcontrasena ?false :true}
                        />
                        <TouchableOpacity style={style.btnIconPassLogin} onPress={()=>this.setState({showcontrasena:!this.state.showcontrasena})}>
                            <Icon name={showcontrasena ?'eye-slash' :'eye'} allowFontScaling style={style.iconPass} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={celular.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Celular"
                        onChangeText={(celular) => this.setState({celular})}
                        value={celular}
                        // keyboardType="numeric"
                    />
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
                            ...style,
                            placeholder: {
                            color: 'rgba(0,0,0,.2)',
                            fontSize: 15,
                            },
                        }}
                        value={tipo}
                    />
                    <TouchableOpacity style={style.btnGuardar} 
                        onPress={()=> razon_social.length<2 || cedula.length<2 || direccion_factura.length<2 || nombre.length<2 || password.length<2 || celular.length<2 || tipo.length<2 || !ubicaciones[0].idZona
                        ?alert("Todos los campos son obligatorios") :this.handleSubmit()}>
                        <Text style={style.textGuardar}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
	  
	render(){
        const {navigation} = this.props
      
	    return (
				<View style={style.container}>
                     {this.modalUbicacion()}
					<KeyboardAwareScrollView style={style.containerRegistro}>
                         {this.renderRegistro()}
					</KeyboardAwareScrollView>
					<Footer navigation={navigation} />
				</View>
		)
	}
    handleSubmit(e){
        this.setState({cargando:true})
        const {razon_social, cedula, direccion_factura, nombre,  email, celular, password, tipo, acceso, codt, ubicaciones} = this.state
        let clientes = ubicaciones.filter(e=>{
            return e.email
        })
        let puntos = ubicaciones.filter(e=>{
            return !e.email 
        })
        puntos = puntos.map(e=>{
            return {direccion:e.direccion, idZona:e.idZona, observacion:e.observacion}
        })
        
        axios.put("user/update", {razon_social, cedula, direccion_factura, nombre, email, password, celular, tipo, acceso, codt, puntos})
        .then(e=>{
            console.log(e.data)
            if(e.data.status){
                
                    if(clientes.length>0){
                        axios.post("user/crea_varios", {clientes, idPadre:e.data.user._id, nombrePadre:e.data.user.nombre})
                        .then(res=>{
                            this.props.navigation.navigate("perfil")
                            Toast.show("Ya puedes iniciar sesión")
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
                            Toast.show("Ya puedes iniciar sesión")
                        })
                        .catch(err2=>{
                            console.log(err2)
                            this.setState({cargando:false})
                        })
                    }
                
            }else{
                this.setState({cargando:false})
                Toast.show("Tenemos un problema, intentalo mas tarde")
            }
            // if(e.data.status){
            //     if(acceso=="cliente") {
            //         alert("Usuario guardado con exito")
            //         this.props.navigation.navigate("perfil")
            //     }else{
            //         this.avatar(imagen, e.data.user._id)
            //     } 
            // }else{
            //     Toast.show("Este email ya existe")
            //     this.setState({cargando:false})
            // }
        })
        .catch(err=>{
            console.log(err)
            this.setState({cargando:false})
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
  