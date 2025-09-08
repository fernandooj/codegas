import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput, Image} from 'react-native'
import axios from "axios"
import {style}   from './style'
import {connect} from 'react-redux' 
 
import {getUsuarios} from '../../redux/actions/usuarioActions'  
import Footer    from '../components/footer'
 


class Puntos extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            puntos:[]
        }
    }
 
    componentDidMount() {
        const { idUsuario } = this.props.navigation.state.params;
        axios.get(`pun/punto/byCliente/${idUsuario}`)
          .then(response => {
            if (response.data.status) {
              this.setState({ puntos: response.data.puntos, idUsuario });
            } else {
              Toast.show("Tuvimos un problema, inténtelo más tarde");
            }
          })
          .catch(error => {
            console.error("Error en la petición:", error);
            Toast.show("Error en la conexión, inténtelo más tarde");
          });
      }
     
    renderPuntos(){
        const {navigation} = this.props
        const {idUsuario, puntos} = this.state
 
      
        return puntos.map((e, key)=>{
            return(
                <View key={key}>
                    <TouchableOpacity key={key} style={style.btnZona} onPress={()=>navigation.navigate("revision", { direccion:e.direccion, capacidad:e.capacidad, observacion:e.observacion, puntoId:e._id, clienteId:idUsuario}) }>
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
