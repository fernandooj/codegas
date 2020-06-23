import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput, Linking} from 'react-native'
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
            reportes:[],
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
        
        axios.get(`rep/reporteEmergenciaRutas/`)
        .then(res=>{
            console.log(res.data)
            this.setState({reportes:res.data.reporte})
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
    
    renderReportes(){
        const {navigation} = this.props
        const {terminoBuscador, inicio, final, reportes, acceso} = this.state
        let filtroReportes = reportes.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newReportes = filtroReportes.slice(inicio, final) 
        console.log(newReportes)
        return newReportes.map((e, key)=>{
            return(
                <View style={[style.contenedorReportes, {backgroundColor: !e.activo ?"#F96D6C" :(e.tanque||e.red||e.puntos||e.fuga) ?"#e8a43d" :"white" }]} key={key}>
                    {
                        <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate((acceso=="depTecnico" || acceso=="admin") ?"nuevoReporteEmergencia" :"", {reporteId:e._id})}>
                             <View style={{width:"90%"}}>
                                <Text style={style.textUsers}>N Reporte: {e.nReporte}</Text>
                                <Text style={style.textUsers}>Fecha:     {e.creado}</Text>
                              
                                
                                {e.estado==2  &&<Text style={style.textUsers}>Solicitud: {e.solicitudServicio}</Text>}
                                {e.estado==3  &&<Text style={style.textUsers}>Solicitud cerrada</Text>}
                                {e.tanque     &&<Text style={style.textUsers}>Tanque en mal estado</Text>}
                                {e.red &&<Text style={style.textUsers}>Red en mal estado</Text>}
                                {e.puntos &&<Text style={style.textUsers}>Puntos de ignición cerca</Text>}
                                {e.fuga &&<Text style={style.textUsers}>Fuga</Text>}
                                {e.pqr &&<Text style={style.textUsers}>PQR</Text>}
                                {(e.cerradoText &&e.cerradoText!=="") &&<Text style={style.textUsers}>{e.cerradoText=="" ?"fer" :e.cerradoText}</Text>}
                                
                            </View>
                         
                        <View  style={{justifyContent:"center"}}>
                            <Icon name={'angle-right'} style={style.iconCerrar} />
                        </View>
                    </TouchableOpacity>
                    }
                    { e.documento.length!=0 &&<View style={[style.separador, {width:"100%"}]}></View>}
                    {
                        e.documento.length!=0
                        &&e.documento.map(e2=>{
                            let document = e2.split("--")
                            return(
                                <TouchableOpacity onPress={()=>Linking.openURL(e2.toString()).catch(err => console.error("Couldn't load page", err))}>
                                    <Text>ver Pdf: {document[1]}</Text>
                                </TouchableOpacity>
                            )
                        })
                        
                    }
                
                </View>
            )
        })
    }    
  
	render(){
        const {navigation} = this.props
        const {terminoBuscador, acceso} = this.state
        return (
            <View style={style.containerTanque}>
                <View style={{flexDirection:"row"}}>
                    <TextInput
                        placeholder="Buscar Reporte"
                        autoCapitalize = 'none'
                        placeholderTextColor="#aaa" 
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={[style.inputCabezera]}
                    />
                    {
                        acceso==="cliente"
                        &&<TouchableOpacity  onPress={()=>navigation.navigate("nuevoReporteEmergencia")}>
                            <Icon name='plus' style={style.iconAdd} />
                        </TouchableOpacity>
                    }
                    
                </View>

                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)}  keyboardDismissMode="on-drag">
                    {this.renderReportes()}
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
