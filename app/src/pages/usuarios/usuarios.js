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
            inicio:0,
            final:10
        }
    }
 
    componentWillMount(){
       this.props.getUsuarios()
    }
     
    onScroll(e) {
		const {final} =  this.state
		let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;
        if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            this.setState({final:final+5, showSpin:true})
            this.myInterval = setInterval(()=>this.setState({showSpin:false}), 2000)
            // clearInterval(this.myInterval);
        }
	}
    renderUsuarios(){
        const {usuarios, navigation} = this.props
        const {terminoBuscador, inicio, final} = this.state
        let filtroUsuarios = usuarios.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newUsuarios = filtroUsuarios.slice(inicio, final) 
 
        return newUsuarios.map((e, key)=>{
            return(
                <View style={[style.contenedorUsers, {backgroundColor: e.activo ?"white" :"red" }]} key={key}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.state.params?navigation.navigate("puntos", {idUsuario:e._id}) :navigation.navigate("verPerfil", {tipoAcceso:"editar", idUsuario:e._id})}>
                        <View style={{width:"90%"}}>
                            
                            {e.acceso=="cliente" &&<Text style={style.textUsers}>{e.idPadre ?"Punto consumo: "+e.idPadre.razon_social :e.razon_social}</Text>}
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
        const {navigation, usuarios} = this.props
        const {terminoBuscador} = this.state
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Listado usuarios</Text>
                <TextInput
                    placeholder="Buscar por: cliente, fecha, forma"
                    autoCapitalize = 'none'
                    placeholderTextColor="#aaa" 
                    onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                    value={terminoBuscador}
                    style={[style.inputCabezera]}
                />
                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)}  keyboardDismissMode="on-drag">
                    {
                        usuarios.length==0
                        ?<ActivityIndicator color="#00218b" />
                        :this.renderUsuarios()
                    }
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
verPerfil.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(verPerfil) 
