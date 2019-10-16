import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
import update 			  from 'react-addons-update';
import axios               from 'axios';
import Icon                from 'react-native-fa-icons';
 
import Footer              from '../components/footer'
 
import {style}             from './style'

 
let size  = Dimensions.get('window');
class Zona extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        placa:"",
        zonas:[]
	  }
	}
	 
    componentWillMount = async () =>{
       axios.get("zon/zona/activos")
       .then(res=>{
           console.log(res.data)
           res.data.status &&this.setState({zonas:res.data.zona})
       })
    }
 
    
    renderZonas(){
        return this.state.zonas.map((e, key)=>{
            
            return (
                <View style={style.vehiculo} key={key}>
                    <View style={style.vehiculoTexto}>
                        <Text style={{fontFamily: "Comfortaa-Regular",}}>{e.nombre}</Text>
                    </View>
                    <TouchableOpacity style={style.btnVehiculo} onPress={()=>this.eliminarZona(e.nombre, e._id)}>
                        <Icon name={'trash'} style={style.iconCerrar} />
                    </TouchableOpacity>
                </View>
            )
        })
    }
 
   
    renderCabezera(){
        const {zona} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <TextInput
                    placeholder="Zona"
                    autoCapitalize = 'none'
                    onChangeText={(zona)=> this.setState({ zona })}
                    value={zona}
                    style={style.inputCabezera}
                />
                <TouchableOpacity  style={style.btnIconNuevo} onPress={()=>this.crearVehiculo()}>
                    <Icon name={'plus'} style={style.iconNuevo} />
                </TouchableOpacity>
            </View>
        )
    }
	render(){
        const {navigation} = this.props
        console.log(this.state.zonas)
        return (
            <View style={style.container}>
                {this.renderCabezera()}
                <ScrollView style={style.subContenedor}>
                    {this.renderZonas()}
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )    
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            CREAR VEHICULO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    crearVehiculo(){
        const {zona} = this.state
        if(zona.length>3){
            axios.post(`zon/zona/`, {nombre:zona})
            .then(res=>{
                console.log(res.data)
                if(res.data.status){
                    Toast.show("Zona Guardada", Toast.LONG)
                    this.setState({zona:""})
                    let nuevaZona= {activo:true, nombre:zona, _id:res.data.zonas._id}
                    this.setState({
                        zonas: update(this.state.zonas, {$unshift: [nuevaZona]})
                     })
           
                    // axios.get("zon/zona/activos")
                    // .then(res=>{
                    //     console.log(res.data)
                    //     res.data.status &&this.setState({zonas:res.data.zona})
                    // })
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }else{
            Toast.show("Zona invalida")
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ELIMINAR VEHICULO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    eliminarZona(zona, _id){
        Alert.alert(
            `Seguro deseas eliminar a: ${zona}`,
            ``,
            [
              {text: 'Confirmar', onPress: () => confirmar1()},
               
              {text: 'Cancelar', onPress: () => console.log()},
            ],
            {cancelable: false},
        );
        const confirmar1 =()=>{
            axios.put(`zon/zona/`, {_id})
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    let textEliminado = `zona ${zona} eliminada`;
                    textEliminado = textEliminado.toString();
                    Toast.show(textEliminado, Toast.LONG)
                    axios.get("zon/zona/activos")
                    .then(res=>{
                        console.log(res.data)
                        res.data.status &&this.setState({zonas:res.data.zona})
                    })
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }
    
     
}
 
 
  
export default Zona
  