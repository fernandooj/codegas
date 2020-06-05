import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
 
import axios               from 'axios';
import Icon                from 'react-native-fa-icons';
import { connect }         from "react-redux";
import Footer              from '../components/footer'
 
import {style}             from './style'


let size  = Dimensions.get('window');
class Capacidad extends Component{
	constructor(props) {
        super(props);
        this.state={
            capacidad:"",
            
            capacidades:[],
            top:new Animated.Value(size.height),
        }
        this.getCapacidades()
	}

    
    getCapacidades(){
        axios.get("cap/capacidad")
        .then(res=>{
            if(res.data.status){
                this.setState({capacidades:res.data.capacidad})
            }else{
             this.setState({capacidades:[]})
            }
        })
    }
    renderCabezera(){
        const {capacidad} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <TextInput
                    placeholder="Capacidad"
                    autoCapitalize = 'none'
                    onChangeText={(capacidad)=> this.setState({ capacidad })}
                    value={capacidad}
                    style={style.inputCabezera}
                    placeholderTextColor="#aaa" 
                />
                <TouchableOpacity  style={style.btnIconNuevo} onPress={capacidad.length<2 ?()=>alert("ingrese una capacidad") :()=>this.crearCapacidad()}>
                    <Icon name={'plus'} style={style.iconNuevo} />
                </TouchableOpacity>
            </View>
        )
    }


    renderCapacidad(){
        return this.state.capacidades.map((e, key)=>{
            return (
                <View style={style.vehiculo} key={key}>
                    <View style={style.vehiculoTexto}>
                        <Text style={{fontFamily: "Comfortaa-Regular"}}>Capacidad: {e.capacidad}</Text>
                    </View>
                    <TouchableOpacity style={style.btnVehiculo} onPress={()=>this.eliminarCapacidad(e.capacidad, e._id )}>
                        <Icon name={'trash'} style={style.iconVehiculo} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    
    
	render(){
        const {navigation} = this.props
        return (
            <View style={style.container}>
                {this.renderCabezera()}
                <ScrollView style={style.subContenedor}>
                    {
                        this.state.capacidades.length==0
                        ?<ActivityIndicator />
                        :this.renderCapacidad()
                    }
                    
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            CREAR VEHICULO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    crearCapacidad(){
        const {capacidad} = this.state
         
        axios.post(`cap/capacidad/`, {capacidad})
        .then(res=>{
            console.log(res.data)
            if(res.data.status){
                Toast.show("capacidad Guardada", Toast.LONG)
                this.setState({capacidad:""})
                this.getCapacidades()
            }else{
                Toast.show("Esta placa ya existe", Toast.LONG)
            }
        })
         
    }
   
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ELIMINAR VEHICULO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    eliminarCapacidad(capacidad, id){
        Alert.alert(
            `Seguro deseas eliminar ${capacidad}`,
            ``,
            [
              {text: 'Confirmar', onPress: () => confirmar()},

              {text: 'Cancelar', onPress: () => console.log()},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.put(`cap/capacidad/eliminar/${id}`)
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    let textEliminado = `Capacidad ${capacidad} eliminada`;
                    textEliminado = textEliminado.toString();
                    Toast.show(textEliminado, Toast.LONG)

                    this.getCapacidades()
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

Capacidad.defaultProps = {
    vehiculos:[],
    conductores:[]
};

Capacidad.propTypes = {

};

  export default connect(
	mapState,
	mapDispatch
  )(Capacidad);
