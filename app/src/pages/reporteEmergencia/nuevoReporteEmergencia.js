import React, {Component} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput, Switch, Platform} from 'react-native'
import {style}        from './style'
import {connect}      from 'react-redux' 
import axios          from 'axios';
import SubirDocumento from "../components/subirDocumento";
import TomarFoto      from "../components/tomarFoto";
import Footer         from '../components/footer'
 
 
class cerrarRevision extends Component{
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
            final:10
        }
    }
 
    componentWillMount(){
        let reporteId = this.props.navigation.state.params ?this.props.navigation.state.params.reporteId :null
        if(reporteId){
            axios.get(`rep/reporteEmergenciaRutas/byId/${reporteId}`)
            .then(res => {
                console.log(res.data)
                const {reporte} = res.data
                this.setState({

                    reporteId,
                    nReporte      : reporte.nReporte,
                    tanque        : reporte.tanque,
                    red           : reporte.red,
                    puntos        : reporte.puntos,
                    fuga          : reporte.fuga,
                    pqr           : reporte.pqr,
                    usuario       : reporte.usuarioCrea ?reporte.usuarioCrea :{} ,
                    cliente       : reporte.usuarioId   ?reporte.usuarioId :{} ,
                    punto         : reporte.puntoId     ?reporte.puntoId :null,
                    imgRuta       : reporte.ruta        ?reporte.ruta :[],
                    imgDocumento  : reporte.documento   ?reporte.documento :[],
                    imgRutaCerrar : reporte.rutaCerrar  ?reporte.rutaCerrar :[],
                    cerradoText   : reporte.cerradoText ?reporte.cerradoText :"",
                    otrosText     : reporte.otrosText   ?reporte.otrosText :"",
                })
            })
        }
    }
     
    rendercontenido(){
        let {tanque, red, puntos, fuga, imgRuta, otrosText, cerradoText, nReporte, cargando, pqr, usuario, cliente, punto, reporteId, imgDocumento} = this.state
        return(
            <View>
                {/* BARRIO */}
                {nReporte  &&<Text style={style.textCerrar}>N Reporte: {nReporte}</Text>}
                {reporteId &&<Text style={style.textCerrar}>Usuario Reporta: {usuario.codt ?usuario.razon_social :usuario.nombre} / {usuario.codt ?usuario.codt :usuario.cedula} </Text>}
                {cliente   &&<Text style={style.textUsers}>Cliente:   {cliente.razon_social}</Text>}
                {cliente   &&<Text style={style.textUsers}>codt:      {cliente.codt}</Text>}
                {punto     && <Text style={style.textUsers}>Ubicacion: {punto.nombre}</Text>}
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
                        editable={reporteId ?false :true}
                    />
                </View>
                 {/* IMAGEN */}
                <View style={style.separador}></View>
                <TomarFoto 
                    source={imgRuta}
                    width={180}
                    titulo="Imagen"
                    limiteImagenes={4}
                    imagenes={(imgRuta) => {  this.setState({imgRuta}) }}
                />
                <View style={style.separador}></View>
                {
                    reporteId
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
                 {/* DOSSIER */}
                 {reporteId &&<View style={style.separador}></View>}
                {
                    reporteId
                    &&<SubirDocumento 
                        source={imgDocumento}
                        width={180}
                        titulo="Documento adjunto"
                        limiteImagenes={4}
                        imagenes={(imgDocumento) => {  this.setState({imgDocumento}) }}
                    />
                }
                {reporteId &&<View style={style.separador}></View>}
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity style={style.nuevoBtn} onPress={cargando ?null :()=>reporteId ?this.cerrar() :this.handleSubmit()}>
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
            </View>
        )
    }
    cerrar(){
        let {reporteId, cerradoText, imgRutaCerrar, tanque, imgDocumento, red, puntos, fuga, pqr} = this.state
        console.log({imgDocumento, red, puntos, fuga})
        const {navigation} = this.props
      
        let data = new FormData();
        imgRutaCerrar.forEach(e=>{
            data.append('imgRutaCerrar', e);
        })
        let documento = imgDocumento.filter(e=>{
            return !e.uri
        })
        imgDocumento = imgDocumento.filter(e=>{
            return e.uri
        })
        imgDocumento.forEach(e=>{
            data.append('imgDocumento', e);
        })
        data.append('tanque', tanque);
        data.append('red',    red);
        data.append('puntos', puntos);
        data.append('fuga',  fuga);
        data.append('pqr',  pqr);
      
        data.append('cerradoText',  cerradoText);
        data.append('documento',  JSON.stringify(documento));
        axios({
            method: 'PUT',   
            url: `rep/reporteEmergenciaRutas/cerrar/${reporteId}`,
            data: data,
        })
        .then(e=>{
            alert("Reporte Enviado")
            navigation.navigate("Home")
        })
    }
    handleSubmit(){
        const {tanque, red, puntos, fuga, otrosText, imgRuta} = this.state
        let usuarioId = this.props.navigation.state.params ?this.props.navigation.state.params.usuarioId :null
        let puntoId = this.props.navigation.state.params ?this.props.navigation.state.params.puntoId :null
        this.setState({cargando:true})
        let data = new FormData();
        imgRuta.forEach(e=>{
            data.append('imgRuta', e);
        })
        data.append('tanque', tanque);
        data.append('red',    red);
        data.append('puntos', puntos);
        data.append('fuga',  fuga);
        data.append('otrosText',  otrosText);
        data.append('usuarioId',  usuarioId);
        data.append('puntoId',  puntoId);
       
        axios({
            method: 'POST',   
            url: `rep/reporteEmergenciaRutas`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            alert("Reporte Creado")
            const {navigation} = this.props
            navigation.navigate("Home")
        })
        .catch(err=>{
            console.log({err})
            this.setState({cargando:false})
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
cerrarRevision.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(cerrarRevision) 
