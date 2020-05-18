import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput, Image} from 'react-native'
import axios from "axios"
import {style}   from './style'
import {connect} from 'react-redux' 
 
import {getUsuarios} from '../../redux/actions/usuarioActions'  
import { createFilter }    from 'react-native-search-filter';
import Footer    from '../components/footer'
 

const KEYS_TO_FILTERS = ["direccion", "capacidad" ] 
 
 

class Puntos extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            puntos:[]
        }
    }
 
    componentWillMount(){
        axios.get(`pun/punto/byCliente/${this.props.navigation.state.params.idUsuario}`)
        .then(e=>{
            console.log(e.data.puntos)
            if(e.data.status){
                this.setState({puntos:e.data.puntos})
            }else{
                Toast.show("Tuvimos un problema, intentele mas tarde")
            }
        })
    }
     
   
    renderPuntos(){
        const {navigation} = this.props
        const {terminoBuscador, puntos} = this.state
        let filtroPuntos = puntos.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
      
        return filtroPuntos.map((e, key)=>{
            return(
                <View key={key}>
                    <TouchableOpacity key={key} style={style.btnZona} onPress={()=>navigation.navigate("revision", { direccion:e.direccion, capacidad:e.capacidad, observacion:e.observacion, puntoId:e._id, clienteId:e.idPadre}) }>
                        <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                        <View>
                            <Text style={style.textZona}>{e.direccion}</Text>   
                            <Text style={style.textZona}>Capacidad: {e.capacidad}</Text>
                            {e.observacion &&<Text style={style.textZona}>Observacion: {e.observacion=="" ?"&nbsp;" :e.observacion }</Text>}
                        </View>
                    </TouchableOpacity>                   
                </View>
            )
        })
    }    
	render(){
        const {navigation} = this.props
        const {terminoBuscador} = this.state
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Listado Puntos</Text>
                <TextInput
                    placeholder="Buscar por: cliente, fecha, forma"
                    autoCapitalize = 'none'
                    placeholderTextColor="#aaa" 
                    onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                    value={terminoBuscador}
                    style={[style.inputCabezera]}
                />
                <ScrollView style={{ marginBottom:85}}  keyboardDismissMode="on-drag">
                    {this.renderPuntos()}
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )
    }
}
const mapState = state => {
	return {
        usuarios:state.usuario.usuarios,
        usuariosFiltro:state.usuario.usuarios,
	};
};


  
const mapDispatch = dispatch => {
	return {
		getUsuarios: () => {
			dispatch(getUsuarios());
        },
	};
};
Puntos.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(Puntos) 
