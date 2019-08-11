import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
import AsyncStorage        from '@react-native-community/async-storage';
import moment 			   from 'moment-timezone'
import axios               from 'axios';
import Icon                from 'react-native-fa-icons';
import { connect }         from "react-redux";
import Footer              from '../components/footer'
import {getUsuariosAcceso} from '../../redux/actions/usuarioActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import {style}             from './style'

 
let size  = Dimensions.get('window');
class Pedido extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        placa:"",
        modalConductor:false,
        top:new Animated.Value(size.height),
	  }
	}
	 
    componentWillMount = async () =>{
        this.props.getVehiculos()
        this.props.getUsuariosAcceso("conductor")
        try {
            let idUsuario = await AsyncStorage.getItem('userId')
            const acceso  = await AsyncStorage.getItem('acceso')
            idUsuario = idUsuario ?idUsuario : "FAIL"
            this.setState({idUsuario, acceso})
        } catch (error) {
            console.log(error)
        }
    }
 
    
    renderVehiculos(){
        const {acceso} = this.state
        return this.props.vehiculos.map((e, key)=>{
            
            return (
                <View style={style.vehiculo} key={key}>
                    <View style={style.vehiculoTexto}>
                        <Text>{e.placa}</Text>
                        <Text>{e.conductor ?e.conductor.nombre :"Sin conductor"}</Text>
                    </View>
                    <TouchableOpacity style={style.btnVehiculo} onPress={()=>this.setState({modalConductor:true, placaVehiculo:e.placa, conductor:e.conductor ?e.conductor._id :"", idVehiculo:e._id})}>
                        <Icon name={'pencil'} style={style.iconCerrar} />
                    </TouchableOpacity>
                    
                    {
                        acceso=="admin"
                        &&<TouchableOpacity style={style.btnVehiculo} onPress={()=>this.eliminarVehiculo(e.placa, e._id )}>
                            <Icon name={'trash'} style={style.iconCerrar} />
                        </TouchableOpacity>
                    }
                </View>
            )
        })
    }
 
      
    renderModalConductores(){
        const {conductor, modalConductor, nombreConductor} = this.state
        
        return(
            <Modal transparent visible={modalConductor} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({modalConductor:false, nombreConductor:null, idConductor:null})}} > 
                    <View style={style.contenedorModal}>
                        <View style={style.subContenedorModal}>
                            <TouchableOpacity activeOpacity={1} onPress={() => {this.setState({modalConductor:false})}} style={style.btnModalClose} >
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.titulo}>Selecciona un conductor</Text>
                            {
                                this.props.conductores.map(e=>{
                                    return <TouchableOpacity
                                            key={e._id}
                                            style={conductor == e._id ?[style.contenedorConductor, {backgroundColor:"#5cb85c"}] :style.contenedorConductor}
                                            onPress={conductor == e._id ?()=>this.desvincularConductor(e.nombre, e._id) :()=>this.asignarConductor(e.nombre, e._id)}
                                        >
                                        <Text style={style.conductor}>{e.nombre}</Text>       
                                        <Image source={{uri:e.avatar}} style={style.avatar} />
                                    </TouchableOpacity>
                                })
                            }
                             
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    renderCabezera(){
        const {placa} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <TextInput
                    placeholder="Placa"
                    autoCapitalize = 'none'
                    onChangeText={(placa)=> this.setState({ placa })}
                    value={placa}
                    style={style.inputCabezera}
                />
                <TouchableOpacity  style={style.btnIconNuevo} onPress={()=>this.crearVehiculo()}>
                    <Icon name={'plus'} style={style.iconNuevo} />
                </TouchableOpacity>
            </View>
        )
    }
	render(){
        const {navigation, conductores} = this.props
        console.log(conductores)
        return (
            <View style={style.container}>
                 {this.renderCabezera()}
                {this.renderModalConductores()}
                <ScrollView style={style.subContenedor}>
                  
                    {this.renderVehiculos()}
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )    
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ASIGNO UN CONDUCTOR A UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    asignarConductor(nombreConductor, idConductor){
        const {placaVehiculo, idVehiculo} = this.state
        Alert.alert(
            `Seguro deseas agregar a ${nombreConductor}`,
            `a la placa: ${placaVehiculo}`,
            [
              {text: 'Confirmar', onPress: () => confirmar()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, placaVehiculo:null, idConductor:null})},
            ],
            {cancelable: false},
        )
      
        const confirmar =()=>{
            axios.get(`veh/vehiculo/asignarConductor/${idVehiculo}/${idConductor}`)
            .then((res)=>{
                if(res.data.status){
                    // this.setState({modalConductor:false})
                    this.props.getVehiculos()
                    Toast.show("Conductor Agregado con exito") 
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }
    desvincularConductor(nombreConductor, idConductor){
        const {placaVehiculo, idVehiculo} = this.state
        Alert.alert(
            `Seguro deseas desvincular a ${nombreConductor}`,
            `a la placa: ${placaVehiculo}`,
            [
              {text: 'Confirmar', onPress: () => confirmar1()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, placaVehiculo:null, idConductor:null})},
            ],
            {cancelable: false},
        );
        const confirmar1 =()=>{
            axios.get(`veh/vehiculo/desvincularConductor/${idVehiculo}`)
            .then((res)=>{
                if(res.data.status){
                    this.setState({modalConductor:false})
                    setTimeout(() => {
                        alert("Conductor desvinculado ")
                    }, 500);
                    
                    this.props.getVehiculos()
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }     
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            CREAR VEHICULO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    crearVehiculo(){
        const {placa} = this.state
        if(placa.length>5){
            axios.post(`veh/vehiculo/`, {placa})
            .then(res=>{
                console.log(res.data)
                if(res.data.status){
                    Toast.show("Vehiculo Guardado", Toast.LONG)
                    this.setState({placa:""})
                    this.props.getVehiculos()
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }else{
            Toast.show("Placa invalida")
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ELIMINAR VEHICULO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    eliminarVehiculo(placaVehiculo, idVehiculo){
        Alert.alert(
            `Seguro deseas eliminar ${idVehiculo}`,
            `a la placa: ${placaVehiculo}`,
            [
              {text: 'Confirmar', onPress: () => confirmar1()},
               
              {text: 'Cancelar', onPress: () => console.log()},
            ],
            {cancelable: false},
        );
        const confirmar1 =()=>{
            axios.get(`veh/vehiculo/eliminar/${idVehiculo}/true`)
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    let textEliminado = `Vehiculo ${placaVehiculo} eliminado`;
                    textEliminado = textEliminado.toString();
                    Toast.show(textEliminado, Toast.LONG)
                    
                    this.props.getVehiculos()
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }
    
     
}

const mapState = state => {
	return {
        conductores:state.usuario.usuariosAcceso,
        vehiculos:state.vehiculo.vehiculos
	};
};
  
const mapDispatch = dispatch => {
    return {
        getVehiculos: () => {
            dispatch(getVehiculos());
        },
        getUsuariosAcceso: (acceso) => {
            dispatch(getUsuariosAcceso(acceso));
        },
    };
};
  
Pedido.defaultProps = {
    vehiculos:[],
    conductores:[]
};

Pedido.propTypes = {
    
};
  
  export default connect(
	mapState,
	mapDispatch
  )(Pedido);
  