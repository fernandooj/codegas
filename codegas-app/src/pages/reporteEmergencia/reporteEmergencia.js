import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, TextInput, Linking} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import Icon from 'react-native-vector-icons/FontAwesome';
import axios             from 'axios';
import {getUsuarios}     from '../../redux/actions/usuarioActions'  
import Footer            from '../components/footer'
import {DataContext} from "../../context/context"
 
class reporteEmergencia extends Component{
    static contextType = DataContext;
	constructor(props) {
        super(props);
        this.state={
            search: undefined,
            reportes: [],
            start: 0,
            limit: 100
        }
    }
 
    async componentDidMount(){
        const {start, limit, search} = this.state
        const value = this.context;
        const {acceso, userId} = value     
        this.setState({userId, acceso})
        axios.get(`rep/reporte-emergencia/${start}/${limit}/${search}`)
        .then(res=>{
            console.log(res.data)
            this.setState({reportes:res.data.reporte})
        })
       
    }
     
    onScroll(e) {
		 
    }
    
    renderReportes(){
        const {navigation} = this.props
        const {reportes, acceso} = this.state
 
        return reportes.map((e, key)=>{
            return(
                <View style={[style.contenedorReportes, {backgroundColor: !e.activo ?"#F96D6C" :(e.tanque||e.red||e.puntos||e.fuga) ?"#e8a43d" :"white" }]} key={key}>
                    {
                        <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.navigate((acceso=="depTecnico" || acceso=="admin") ?"nuevoReporteEmergencia" :"", {reporteId:e._id})}>
                             <View style={{width:"90%"}}>
                                <Text style={style.textUsers}>N Reporte: {e._id}</Text>
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
 
	   
export default connect(mapState, mapDispatch)(reporteEmergencia) 
