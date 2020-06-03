import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import Icon              from 'react-native-fa-icons';
import axios             from 'axios';
import AsyncStorage      from '@react-native-community/async-storage';
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
 
    async componentWillMount(){
        try{
            const userId    = await AsyncStorage.getItem('userId')
            const nombre    = await AsyncStorage.getItem('nombre')
            const email 	= await AsyncStorage.getItem('email')
            const avatar    = await AsyncStorage.getItem('avatar')
            const acceso    = await AsyncStorage.getItem('acceso')
            userId ?this.setState({userId, nombre, email, avatar, acceso}) :null
        }catch(e){
            console.log(e)
        }
        this.props.navigation.state.params
        ?axios.get(`rev/revision/byPunto/${this.props.navigation.state.params.puntoId}`)
        .then(res=>{
            this.setState({revisiones:res.data.revision})
        })
        :axios.get(`rev/revision/`)
        .then(res=>{
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
        const {terminoBuscador, inicio, final, revisiones, acceso} = this.state
        let filtroRevisiones = revisiones.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newRevisiones = filtroRevisiones.slice(inicio, final) 
        return newRevisiones.map((e, key)=>{
            return(
                <View style={[style.contenedorRevisiones, {backgroundColor: !e.activo ?"#F96D6C" :(e.estado==2 ||e.avisos||e.distancias||e.electricas||e.extintores||e.accesorios) ?"#e8a43d" :"white" }]} key={key}>
                    {
                        navigation.state.params
                        ?<TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate(acceso=="depTecnico" ?"cerrarRevision" :acceso=="insSeguridad" ?"cerrarSeguridad" :"nuevaRevision", {puntoId:navigation.state.params.puntoId, clienteId:navigation.state.params.clienteId, revisionId:e._id})}>
                             <View style={{width:"90%"}}>
                                <Text style={style.textUsers}>N Control: {e.nControl}</Text>
                                <Text style={style.textUsers}>Fecha:     {e.creado}</Text>
                                
                                {e.estado==2  &&<Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                                {e.estado==3  &&<Text style={style.textUsers}>Solicitud cerrada</Text>}
                                {e.avisos     &&<Text style={style.textUsers}>Falta de Avisos reglamentarios en mal estado</Text>}
                                {e.extintores &&<Text style={style.textUsers}>Falta extintores en mal estado</Text>}
                                {e.distancias &&<Text style={style.textUsers}>No cumple distancias en mal estado</Text>}
                                {e.electricas &&<Text style={style.textUsers}>Fuentes ignición cerca en mal estado</Text>}
                                {e.accesorios &&<Text style={style.textUsers}>No cumple accesorios y materiales</Text>}
                            </View>
                            <View  style={{justifyContent:"center"}}>
                                <Icon name={'angle-right'} style={style.iconCerrar} />
                            </View>
                        </TouchableOpacity>
                        :<TouchableOpacity style={{flexDirection:"row"}}>
                             <View style={{width:"90%"}}>
                            <Text style={style.textUsers}>N Control: {e.nControl}</Text>
                            <Text style={style.textUsers}>Fecha:     {e.creado}</Text>
                            
                            {e.estado==2  &&<Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                            {e.estado==3  &&<Text style={style.textUsers}>Solicitud cerrada</Text>}
                            {e.avisos     &&<Text style={style.textUsers}>Falta de Avisos reglamentarios en mal estado</Text>}
                            {e.extintores &&<Text style={style.textUsers}>Falta extintores en mal estado</Text>}
                            {e.distancias &&<Text style={style.textUsers}>No cumple distancias en mal estado</Text>}
                            {e.electricas &&<Text style={style.textUsers}>Fuentes ignición cerca en mal estado</Text>}
                            {e.accesorios &&<Text style={style.textUsers}>No cumple accesorios y materiales</Text>}
                        </View>
                        <View  style={{justifyContent:"center"}}>
                            <Icon name={'angle-right'} style={style.iconCerrar} />
                        </View>
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
                        placeholder="Buscar revision"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={[style.inputCabezera]}
                    />
                    {
                        this.props.navigation.state.params
                        &&<TouchableOpacity  onPress={()=>navigation.navigate("nuevaRevision", {puntoId:this.props.navigation.state.params.puntoId, clienteId:this.props.navigation.state.params.clienteId, direccion:this.props.navigation.state.params.direccion, capacidad:this.props.navigation.state.params.capacidad, observacion:this.props.navigation.state.params.observacion} )}>
                            <Icon name='plus' style={style.iconAdd} />
                        </TouchableOpacity>
                    }
                </View>

                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)}  keyboardDismissMode="on-drag">
                    {this.renderRevisiones()}
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
Revision.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(Revision) 
