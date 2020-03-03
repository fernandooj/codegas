import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
import AsyncStorage        from '@react-native-community/async-storage';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';  
import axios               from 'axios';
import Icon                from 'react-native-fa-icons';
import { connect }         from "react-redux";
import Footer              from '../components/footer'
import {getUsuariosAcceso} from '../../redux/actions/usuarioActions'
import {getVehiculos}      from '../../redux/actions/vehiculoActions'
import {style}             from './style'


let size  = Dimensions.get('window');
class Tanques extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        placa:"",
        centroEditar:"",
        bodegaEditar:"",
        modalConductor:false,
        modalEditar:false,
        conductores:[],
        top:new Animated.Value(size.height),
	  }
	}

        
	render(){
        const {navigation} = this.props
        return (
            <View style={style.container}>
                
                <ProgressSteps>
                    <ProgressStep label="First Step">
                        <View style={{ alignItems: 'center' }}>
                            <Text>This is the content within step 1!</Text>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Second Step">
                        <View style={{ alignItems: 'center' }}>
                            <Text>This is the content within step 2!</Text>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Third Step">
                        <View style={{ alignItems: 'center' }}>
                            <Text>This is the content within step 3!</Text>
                        </View>
                    </ProgressStep>
                </ProgressSteps>
                <Footer navigation={navigation} />
            </View>
        )
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ASIGNO UN CONDUCTOR A UN Tanques
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
    desvincularConductor(nombreConductor, idVehiculo, placaVehiculo){
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
                console.log(res.data)
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
        const {placa, centro, bodega} = this.state
        if(placa.length>5){
            axios.post(`veh/vehiculo/`, {placa, centro, bodega})
            .then(res=>{
                console.log(res.data)
                if(res.data.status){
                    Toast.show("Vehiculo Guardado", Toast.LONG)
                    this.setState({placa:"", centro:"", bodega:""})
                    this.props.getVehiculos()
                }else{
                    Toast.show("Esta placa ya existe", Toast.LONG)
                }
            })
        }else{
            Toast.show("Placa invalida")
        }
    }
    editar(){
        const {idVehiculo, placaEditar, centroEditar, bodegaEditar} = this.state
        if(placaEditar.length>5){
            axios.put(`veh/vehiculo/editar/${idVehiculo}`, {placa: placaEditar, centro: centroEditar, bodega: bodegaEditar})
            .then(res=>{
                console.log(res.data)
                if(res.data.status){
                    Toast.show("Vehiculo Editado", Toast.LONG)
                    this.setState({modalEditar:false, placaEditar:"", centroEditar:"", bodegaEditar:""})
                    this.props.getVehiculos()
                }else{
                    Toast.show("Esta placa ya existe", Toast.LONG)
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

Tanques.defaultProps = {
    vehiculos:[],
    conductores:[]
};

Tanques.propTypes = {

};

  export default connect(
	mapState,
	mapDispatch
  )(Tanques);
