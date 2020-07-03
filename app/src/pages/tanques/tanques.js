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
 
    async componentWillMount(){
        const acceso    = await AsyncStorage.getItem('acceso')
        axios.get("tan/tanque")
        .then(res=>{
            
            this.setState({tanques:res.data.tanque, acceso})
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
        const {terminoBuscador, inicio, final, tanques, acceso} = this.state
        let filtroTanques = tanques.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newTanques = filtroTanques.slice(inicio, final) 
        return newTanques.map((e, key)=>{
            
            return(
                <View style={style.contenedorTanques} key={key}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate(acceso=="depTecnico" ?"cerrarTanque" :"nuevoTanque", {tanqueId:acceso=="depTecnico"?e._id._id :e._id._id})}>
                        <View style={{width:"90%"}}>
                            <Text style={style.textUsers}>Placa:     {e.placaText ?e.placaText :e._id.placaText}</Text>
                            <Text style={style.textUsers}>Capacidad: {e.capacidad ?e.capacidad :e._id.capacidad}</Text>
                            <Text style={style.textUsers}>Cliente:   {e.usuarioId ?e.usuarioId.razon_social+" "+e.usuarioId.codt :e._id.usuario} {e._id.codt &&"/ "+e._id.codt }</Text>
                            {/* {e.total &&<Text style={style.textUsers}>Alertas Activas:   {totalActivos}</Text>}
                            {e.total &&<Text style={style.textUsers}>Alertas Innactivas:{totalInnactivos}</Text>} */}
                        </View>
                        <View  style={{justifyContent:"center"}}>
                            <Icon name={'angle-right'} style={style.iconCerrar} />
                        </View>
                    </TouchableOpacity>
                    <View style={[style.separador, {width:"100%"}]}></View>
                    {
                        e.data.map((e2, key2)=>{
                            return (
                                <>
                                <View style={{padding:5, backgroundColor: e2.activo ?"#F96D6C" :"white" }} key={key2}>
                                    <Text style={{color:e2.activo&&"white" }} >{e2.texto}</Text>
                                    {e2.cerrado &&<Text>{e2.cerrado}</Text>}
                                </View>
                                  <View style={[style.separador, {width:"100%"}]}></View>
                                </>
                            )
                        })
                    }
                     
                    {
                        acceso=="admin"
                        &&<TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("cerrarTanque", {tanqueId:e._id._id})}>
                           <Text>Cerrar Alertas <Icon name='times-circle' style={style.iconCerrarTanque} /> </Text>
                        </TouchableOpacity>
                    }
                    
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
