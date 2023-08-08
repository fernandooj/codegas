import React, {Component} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput, Switch, Platform} from 'react-native'
import {style}        from './style'
import {connect}      from 'react-redux' 
import axios          from 'axios';
import Toast from 'react-native-toast-message';
import SubirDocumento from "../components/subirDocumento";
import TomarFoto      from "../components/tomarFoto";
import Footer         from '../components/footer'
import {DataContext} from "../../context/context"
 
class nuevoReporteEmergencia extends Component{
    static contextType = DataContext;
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            cerradoText:"",
            otrosText:"",
            imgRuta:[],
            imgRutaCerrar:[],
            imgDocumento:[],
            tanque:false, 
            red:false, 
            puntos:false, 
            fuga:false, 
            inicio:0,
            final:10,
            puntodireccion: '',
            nReporte: ''
        }
    }
 
    componentDidMount(){
        const value = this.context;
        const {acceso, userId: usuarioCrea} = value
        this.setState({usuarioCrea, acceso})
        this.getData()
    }
    getData() {
        let reporteId = this.props.navigation.state.params ?this.props.navigation.state.params.reporteId :null
        let usuarioId = this.props.navigation.state.params ?this.props.navigation.state.params.usuarioId :null
        let puntoId = this.props.navigation.state.params ?this.props.navigation.state.params.puntoId :null
        let codt = this.props.navigation.state.params ?this.props.navigation.state.params.codt :null
        let razon_social = this.props.navigation.state.params ?this.props.navigation.state.params.razon_social :null
         
        if(reporteId){
            axios.get(`rep/reporte-emergencia/byId/${reporteId}`)
            .then(res => {
                const {reporte} = res.data
                this.setState({
                    nReporte      : reporte._id,
                    tanque        : reporte.tanque,
                    red           : reporte.red,
                    puntos        : reporte.puntos,
                    fuga          : reporte.fuga,
                    pqr           : reporte.pqr,
                    usuarioNombre : reporte.usuarionombre,
                    usuarioRazonSocial : reporte.usuariorazonsocial,
                    usuarioCreaNombre : reporte.usuariocreanombre,
                    usuarioCreaRazonSocial : reporte.usuariocrearazonsocial,
                    puntodireccion         : reporte.puntodireccion,
                    usuariocodt   : reporte.usuariocodt,
                    imgRuta       : reporte.ruta        ?reporte.ruta :[],
                    imgDocumento  : reporte.documento   ?reporte.documento :[],
                    imgRutaCerrar : reporte.rutacerrar  ?reporte.rutacerrar :[],
                    cerradoText   : reporte.cerradotext ?reporte.cerradotext :"",
                    otrosText     : reporte.otrostext   ?reporte.otrostext :"",
                })
            })
        } else {
            this.setState({
                usuarioId,
                puntoId,
                usuariocodt: codt,
                usuarioRazonSocial: razon_social
            })
        }
    }
    rendercontenido(){
        let {tanque, red, puntos, fuga, imgRuta, otrosText, cerradoText, nReporte, cargando, pqr, usuariocodt, usuarioCreaNombre, usuarioCreaRazonSocial, usuarioNombre, usuarioRazonSocial, puntodireccion, imgDocumento} = this.state
         console.log(imgDocumento)
        return(
            <View style={style.container}>
                {/* BARRIO */}
                {nReporte  &&<Text style={style.textCerrar}>N Reporte: {nReporte}</Text>}
                {nReporte &&<Text style={style.textCerrar}>Usuario Reporta: {usuariocodt ?usuarioCreaNombre :usuarioCreaRazonSocial} </Text>}
                {usuarioRazonSocial   &&<Text style={style.textUsers}>Cliente:   {usuarioRazonSocial} - {usuarioNombre}</Text>}
                {usuariocodt   &&<Text style={style.textUsers}>codt:      {usuariocodt}</Text>}
                {puntodireccion     && <Text style={style.textUsers}>Ubicacion: {puntodireccion}</Text>}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Tanque en mal estado</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(tanque ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[tanque ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(tanque)=>this.setState({tanque})}
                        value = {tanque}  
                    />

                    
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Red en mal estado</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(red ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[red ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(red)=>this.setState({red})}
                        value = {red}  
                    />
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Puntos de ignición cerca</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(puntos ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[puntos ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(puntos)=>this.setState({puntos})}
                        value = {puntos}  
                    />
                    
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Fuga</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(fuga ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[fuga ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(fuga)=>this.setState({fuga})}
                        value = {fuga}  
                    />
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>PQR</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(pqr ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[pqr ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(pqr)=>this.setState({pqr})}
                        value = {pqr}  
                    />
                     
                </View>


                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Detalles reporte</Text>
                    <TextInput
                        placeholder="Detalles reporte"
                        value={otrosText}
                        style={style.inputStep4}
                        onChangeText={(otrosText)=> this.setState({ otrosText })}
                        editable={nReporte ?false :true}
                    />
                </View>
                 {/* IMAGEN */}
                <View style={style.separador}></View>
                {
                    nReporte
                    &&<>
                        <TomarFoto 
                            source={imgRuta}
                            width={180}
                            titulo="Imagen"
                            limiteImagenes={4}
                            imagenes={(e) => {  this.uploadImagen(e, 'ruta', 'image/jpeg') }}
                        />
                        <View style={style.separador}></View>
                    </>
                }{
                    nReporte
                    &&<View style={style.contenedorSetp2}>
                        <Text style={style.row1Step2}>Gestión reporte</Text>
                        <TextInput
                            placeholder="Gestión reporte"
                            value={cerradoText}
                            style={style.inputStep4}
                            onChangeText={(cerradoText)=> this.setState({ cerradoText })}
                        />
                    </View>
                }
                
                 {nReporte &&<View style={style.separador}></View>}
                {
                    nReporte
                    &&<SubirDocumento 
                        source={imgDocumento}
                        width={180}
                        titulo="Documento adjunto"
                        limiteImagenes={4}
                        imagenes={(e) => {  this.uploadImagen(e, 'documento', 'application/pdf') }}
                    />
                }
                {nReporte &&<View style={style.separador}></View>}
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity style={style.nuevoBtn} onPress={cargando ?null :()=>nReporte ?this.cerrar() :this.handleSubmit()}>
                        <Text style={style.textGuardar}>{cargando ?"Guardando.." :"Guardar"}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    
	render(){
        const {navigation} = this.props
        return (
            <View style={[style.containerTanque, {paddingTop:0}]}>
                <Image source={require('../../assets/img/pg1/fondo1.jpg')} style={style.cabezera1} />
                <ScrollView style={{ marginBottom:85}}>
                    {this.rendercontenido()}
                </ScrollView>
                <Footer navigation={navigation} />
                <Toast />
            </View>
        )
    }
    cerrar(){
        const {nReporte: idRevision, cerradoText, tanque, red, puntos, fuga, pqr, usuarioCrea: usuarioCierra} = this.state
        const data = {
            idRevision, cerradoText, tanque, red, puntos, fuga, pqr, usuarioCierra
        };
    
        axios({
            method: 'put',  
            url: `rep/reporte-emergencia/cerrar`,
            data:  JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json'
            },
        })
        .then((res)=>{
            Toast.show({type: 'success', text1: 'Reporte Cerrado'})
        })
        .catch(err=>{
            console.log({err})
            Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
            this.setState({cargando:false})
        })
    }


    handleSubmit(){
        this.setState({cargando:true})
        const {tanque, red, puntos, fuga, otrosText, pqr, usuarioId, puntoId, usuarioCrea} = this.state
        const data = {
            tanque, red, puntos, fuga,  pqr, otrosText, usuarioId, puntoId, usuarioCrea
        };
    
        axios({
            method: 'post',  
            url: `rep/reporte-emergencia`,
            data:  JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json'
            },
        })
        .then((res)=>{
            console.log(res.data)
            this.setState({nReporte: res.data.reporte})
            Toast.show({type: 'success', text1: 'Reporte Creado'})
        })
        .catch(err=>{
            console.log({err})
            this.setState({cargando:false})
        })
    }
    uploadImagen(imagen, type, mime){
        this.setState({loading:true})
        let {nReporte: idReporte} = this.state
        
        const data = {
            mime,
            imagen: imagen.imagen,
            idReporte,
            type,
            name: imagen.name
        }
        axios({
            method: 'PUT',  
            url: `/rep/reporte-emergencia/add-images-reporte-emergencia`,
            data:  JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json'
            },
          })
          .then((res)=>{
            if(res.data.status){
                
                Toast.show({type: 'success', text1: 'Imagen Subida'})
                this.setState({loading:false})
            }else{
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
                this.setState({loading:false})
            }
          })
    }
}
const mapState = state => {
	return {
        
	};
};
  
const mapDispatch = dispatch => {
	return {
		 
	};
};
 
	   
export default connect(mapState, mapDispatch)(nuevoReporteEmergencia) 
