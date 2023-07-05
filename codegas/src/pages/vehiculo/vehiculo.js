import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-toast-message';
import axios               from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect }         from "react-redux";
import Footer              from '../components/footer'
import {getUsuariosAcceso} from '../../redux/actions/usuarioActions'
import {getVehiculos}      from '../../redux/actions/vehiculoActions'
import {DataContext} from "../../context/context"
import {style}             from './style'


let size  = Dimensions.get('window');
class Pedido extends Component{
    static contextType = DataContext;
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

    componentWillMount = async () =>{
        this.props.getVehiculos()
        this.props.getUsuariosAcceso("conductor")
        try {
            const value = this.context;
            const {acceso, userId: idUsuario} = value

            this.setState({idUsuario, acceso})
        } catch (error) {
            console.log(error)
        }
    }
    resultFilter = (firstArray, secondArray) => {
        return firstArray.filter(firstArrayItem =>
          !secondArray.some(
            secondArrayItem => firstArrayItem._id === secondArrayItem.idConductor
          )
        );
      };

    componentWillReceiveProps(props){
        let vehiculos = props.vehiculos.map(e=>{
            return{
                placa:e.placa,
                idVehiculo:e._id,
                centro:e.centro,
                bodega:e.bodega,
                conductor:e.conductor ?e.conductor.nombre :"Sin conductor",
                idConductor:e.conductor ?e.conductor._id :"000"
            }
        })
        console.log(vehiculos)
        let conductores = this.resultFilter(props.conductores, vehiculos)
        this.setState({conductores})
    }


    renderVehiculos(){
        const {acceso} = this.state
        return this.props.vehiculos.map((e, key)=>{
            return (
                <View style={style.vehiculo} key={key}>
                    <View style={style.vehiculoTexto}>
                        <Text style={{fontFamily: "Comfortaa-Regular"}}>Placa: {e.placa}</Text>
                        <Text style={{fontFamily: "Comfortaa-Regular"}}>Centro: {e.centro}</Text>
                        <Text style={{fontFamily: "Comfortaa-Regular"}}>Bodega: {e.bodega}</Text>
                        <Text style={{fontFamily: "Comfortaa-Regular"}}>Conductor: {e.conductor ?e.conductor.nombre :"Sin conductor"}</Text>
                    </View>
                    {
                        e.conductor
                        &&<TouchableOpacity style={style.btnVehiculo} onPress={()=>this.desvincularConductor(e.conductor.nombre, e._id, e.placa )}>
                            <Icon name={'chain-broken'} style={style.iconVehiculo} />
                        </TouchableOpacity>
                    }
                   
                    <TouchableOpacity style={style.btnVehiculo} onPress={()=>this.setState({modalConductor:true, placaVehiculo:e.placa, conductor:e.conductor ?e.conductor._id :"", idVehiculo:e._id})}>
                        <Icon name={'user'} style={style.iconVehiculo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.btnVehiculo} onPress={()=>this.setState({modalEditar:true, idVehiculo:e._id, placaEditar:e.placa, centroEditar:e.centro, bodegaEditar:e.bodega })}>
                        <Icon name={'pencil'} style={style.iconVehiculo} />
                    </TouchableOpacity>
                    {
                        acceso=="admin"
                        &&<TouchableOpacity style={style.btnVehiculo} onPress={()=>this.eliminarVehiculo(e.placa, e._id )}>
                            <Icon name={'trash'} style={style.iconVehiculo} />
                        </TouchableOpacity>
                    }
                </View>
            )
        })
    }

    renderModalEditar(){
        let {placaEditar, modalEditar, centroEditar, bodegaEditar} = this.state
        bodegaEditar = bodegaEditar ?bodegaEditar.toString() :""
        centroEditar = centroEditar ?centroEditar.toString() :""
        console.log(placaEditar, centroEditar, bodegaEditar)
        return(
            <Modal transparent visible={modalEditar} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({modalEditar:false, nombreConductor:null, idConductor:null})}} >
                    <View style={style.contenedorModal}>
                        <View style={style.subContenedorModalEditar}>
                            <TouchableOpacity activeOpacity={1} onPress={() => {this.setState({modalEditar:false})}} style={style.btnModalClose} >
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.text}>Placa</Text>
                            <TextInput
                                placeholder="Placa"
                                autoCapitalize = 'none'
                                onChangeText={(placaEditar)=> this.setState({ placaEditar })}
                                value={placaEditar}
                                style={style.input}
                                placeholderTextColor="#aaa" 
                            />
                            <Text style={style.text}>Centro de costos </Text>
                            <TextInput
                                placeholder="Centro Costos"
                                autoCapitalize = 'none'
                                onChangeText={(centroEditar)=> this.setState({ centroEditar })}
                                value={centroEditar}
                                style={style.input}
                                placeholderTextColor="#aaa" 
                                keyboardType="numeric"
                            />
                            <Text style={style.text}>Bodega</Text>
                            <TextInput
                                placeholder="Bodega"
                                autoCapitalize = 'none'
                                onChangeText={(bodegaEditar)=> this.setState({ bodegaEditar })}
                                value={bodegaEditar}
                                style={style.input}
                                placeholderTextColor="#aaa" 
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={style.btnGuardar} onPress={()=>this.editar()}>
                                <Text style={style.textGuardar}>{"Guardar"}</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    renderModalConductores(){
        const {conductor, modalConductor, conductores} = this.state
        return(
            <Modal transparent visible={modalConductor} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({modalConductor:false, nombreConductor:null, idConductor:null})}} >
                    <View style={style.contenedorModal}>
                        <View style={style.subContenedorModal}>
                            <ScrollView>
                                <TouchableOpacity activeOpacity={1} onPress={() => {this.setState({modalConductor:false})}} style={style.btnModalClose} >
                                    <Icon name={'times-circle'} style={style.iconCerrar} />
                                </TouchableOpacity>
                                <Text style={style.titulo}>{conductores.length==0 ?"No hay conductores libres" :"Selecciona un conductor"}</Text>
                                {
                                    conductores.map(e=>{
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
                            </ScrollView>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    renderCabezera(){
        const {placa, centro, bodega} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <TextInput
                    placeholder="Placa"
                    autoCapitalize = 'none'
                    onChangeText={(placa)=> this.setState({ placa })}
                    value={placa}
                    style={style.inputCabezera}
                    placeholderTextColor="#aaa" 
                />
                 <TextInput
                    placeholder="Centro Costos"
                    autoCapitalize = 'none'
                    onChangeText={(centro)=> this.setState({ centro })}
                    value={centro}
                    style={style.inputCabezera}
                    placeholderTextColor="#aaa" 
                    keyboardType="numeric"
                />
                 <TextInput
                    placeholder="Bodega"
                    autoCapitalize = 'none'
                    onChangeText={(bodega)=> this.setState({ bodega })}
                    value={bodega}
                    style={style.inputCabezera}
                    placeholderTextColor="#aaa" 
                    keyboardType="numeric"
                />
                <TouchableOpacity  style={style.btnIconNuevo} onPress={()=>this.crearVehiculo()}>
                    <Icon name={'plus'} style={style.iconNuevo} />
                </TouchableOpacity>
            </View>
        )
    }
	render(){
        const {navigation} = this.props
        return (
            <View style={style.container}>
                 {this.renderCabezera()}
                {this.renderModalConductores()}
                {this.renderModalEditar()}
                <ScrollView style={style.subContenedor}>
                    {
                        this.props.vehiculos.length==0
                        ?<ActivityIndicator />
                        :this.renderVehiculos()
                    }
                    
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
                    Toast.show({type: 'success', text1: 'Conductor Agregado con exito'})
                }else{
                    Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
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
                    Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
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
                    Toast.show({type: 'success', text1: 'Vehiculo Guardado'})
                    this.setState({placa:"", centro:"", bodega:""})
                    this.props.getVehiculos()
                }else{
                    Toast.show({type: 'error', text1: 'Esta placa ya existe'})
                }
            })
        }else{
            Toast.show({type: 'error', text1: 'Placa invalida'})
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
                    let text1 = `Vehiculo ${placaVehiculo} eliminado`;
                    text1 = text1.toString();
                    Toast.show({type: 'success', text1})

                    this.props.getVehiculos()
                }else{
                    Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
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
