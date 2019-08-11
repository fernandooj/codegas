import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import Icon                from 'react-native-fa-icons';
import {getUsuarios} from '../../redux/actions/usuarioActions'  
import { createFilter }    from 'react-native-search-filter';
import Footer    from '../components/footer'
const KEYS_TO_FILTERS = ["acceso", "email", 'nombre', 'codt', "razon_social", "direccion_factura", "celular", "cedula"] 
 
 

class verPerfil extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
        }
    }
 
    componentWillMount(){
       this.props.getUsuarios()
    }
     
     
    renderUsuarios(){
        const {usuarios, navigation} = this.props
        const {terminoBuscador} = this.state
        let filtroUsuarios = usuarios.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return filtroUsuarios.map((e, key)=>{
            return(
                <View style={[style.contenedorUsers, {backgroundColor: e.activo ?"white" :"red" }]} key={key}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"editar", idUsuario:e._id})}>
                        <View style={{width:"90%"}}>
                            <Text style={style.textUsers}>{e.nombre}</Text>
                            <Text style={style.textUsers}>{e.email}</Text>
                            <Text style={style.textUsers}>{e.acceso}</Text>
                        </View>
                        <View  style={{justifyContent:"center"}}>
                            <Icon name={'angle-right'} style={style.iconCerrar} />
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
                <Text style={style.titulo}>Listado usuarios</Text>
                <TextInput
                    placeholder="Buscar por: cliente, fecha, forma"
                    autoCapitalize = 'none'
                    onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                    value={terminoBuscador}
                    style={[style.inputCabezera]}
                />
                {
                    <ScrollView style={{ marginBottom:75}}>
                        {this.renderUsuarios()}
                    </ScrollView>
                }
                <Footer navigation={navigation} />
            </View>
        )
    }
     
  
    
}
const mapState = state => {
    console.log(state)
	return {
        usuarios:state.usuario.usuarios,
	};
};


  
const mapDispatch = dispatch => {
	return {
		getUsuarios: () => {
			dispatch(getUsuarios());
        },
	};
};
verPerfil.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(verPerfil) 
