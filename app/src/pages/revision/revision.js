import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import Icon              from 'react-native-fa-icons';
import axios             from 'axios';
 
import {getUsuarios}     from '../../redux/actions/usuarioActions'  
import { createFilter }  from 'react-native-search-filter';
import Footer            from '../components/footer'
 

const KEYS_TO_FILTERS = ["nControl", "usuarioId.razon_social", "usuarioId.codt", "zonaId.nombre", "puntoId.nombre"] 
 
class Revision extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            revisiones:[],
            inicio:0,
            final:10
        }
    }
 
    componentWillMount(){
        axios.get("rev/revision")
        .then(res=>{
            console.log(res.data)
            this.setState({revisiones:res.data.revision})
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
    
    renderRevisiones(){
        const {navigation} = this.props
        const {terminoBuscador, inicio, final, revisiones} = this.state
        let filtroRevisiones = revisiones.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newRevisiones = filtroRevisiones.slice(inicio, final) 
        return newRevisiones.map((e, key)=>{
            return(
                <View style={[style.contenedorRevisiones, {backgroundColor: e.activo ?"white" :"red" }]} key={key}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate("nuevaRevision", {revisionId:e._id})}>
                        <View style={{width:"90%"}}>
                            <Text style={style.textUsers}>N Control: {e.nControl}</Text>
                            <Text style={style.textUsers}>Placa: {e.tanqueId ?e.tanqueId[0].placaText :""}</Text>
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
                        placeholder="Buscar revision"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={[style.inputCabezera]}
                    />
                    <TouchableOpacity  onPress={()=>this.nuevaRevision()}>
                        <Icon name='plus' style={style.iconAdd} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)}  keyboardDismissMode="on-drag">
                    {this.renderRevisiones()}
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )
    }
    nuevaRevision(){
        const {navigation} = this.props
       
        navigation.navigate("nuevaRevision")
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
Revision.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(Revision) 
