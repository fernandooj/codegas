import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import Icon              from 'react-native-fa-icons';
import axios             from 'axios';
import AsyncStorage      from '@react-native-community/async-storage';
import {getUsuarios}     from '../../redux/actions/usuarioActions'  
import { createFilter }  from 'react-native-search-filter';
import Footer            from '../components/footer'
 

const KEYS_TO_FILTERS = ["nControl", "usuarioId.razon_social", 'placa', 'fabricante', "anoFabricacion", "barrio"] 
 
class verPerfil extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            tanques:[],
            inicio:0,
            final:10
        }
    }
 
    componentWillMount(){
        axios.get("tan/tanque")
        .then(res=>{
            console.log(res.data)
            this.setState({tanques:res.data.tanque})
        })
       
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
    
    renderTanques(){
        const {navigation} = this.props
        const {terminoBuscador, inicio, final, tanques} = this.state
        let filtroTanques = tanques.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newTanques = filtroTanques.slice(inicio, final) 
        return newTanques.map((e, key)=>{
            return(
                <View style={[style.contenedorTanques, {backgroundColor: e.activo ?"white" :"red" }]} key={key}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("nuevoTanque", {tanqueId:e._id})}>
                        <View style={{width:"90%"}}>
                            <Text style={style.textUsers}>Placa: {e.placaText}</Text>
                            <Text style={style.textUsers}>Capacidad: {e.capacidad}</Text>
                            <Text style={style.textUsers}>Cliente:   {e.usuarioId &&e.usuarioId.razon_social}</Text>
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
            <View style={style.containerTanque}>
                <View style={{flexDirection:"row"}}>
                    <TextInput
                        placeholder="Buscar tanque"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={[style.inputCabezera]}
                    />
                    <TouchableOpacity  onPress={()=>this.nuevoTanque()}>
                        <Icon name='plus' style={style.iconAdd} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)}  keyboardDismissMode="on-drag">
                    {this.renderTanques()}
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )
    }
    nuevoTanque(){
        const {navigation} = this.props
       
        navigation.navigate("nuevoTanque")
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
