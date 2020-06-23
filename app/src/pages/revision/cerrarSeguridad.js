import React, {Component} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput, Switch, Platform, Alert} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import SubirDocumento from "../components/subirDocumento";
import axios             from 'axios';

 
import TomarFoto                       from "../components/tomarFoto";
import Footer            from '../components/footer'
 
 
class cerrarRevision extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            imgDepTecnico:[],
            imgDocumento:[],
            inicio:0,
            final:10
        }
    }
 
    componentWillMount(){
        let revisionId = this.props.navigation.state.params ?this.props.navigation.state.params.revisionId :null
        axios.get(`rev/revision/byId/${revisionId}`)
                .then(res => {
                    console.log(res.data)
                    const {revision} = res.data
                    let tanqueIdArray = []
                    revision.tanqueId.map(e=>{
                        tanqueIdArray.push(e._id)
                    })
                    
                    this.setState({
                        /////// step 1
                        nControl:    revision.nControl,
                        revisionId:    revision._id,
                        tanqueArray:   revision.tanqueId   ?revision.tanqueId      :[],
                        tanqueIdArray: tanqueIdArray       ?tanqueIdArray :[],
                        
                        

                        usuarioId:                revision.usuarioId           ?revision.usuarioId._id                 :null,
                        cedulaCliente:            revision.usuarioId           ?revision.usuarioId.razon_social        :"",
                        razon_socialCliente:      revision.usuarioId           ?revision.usuarioId.cedula              :"",
                        direccion_facturaCliente: revision.usuarioId           ?revision.usuarioId.direccion_factura   :"",
                        nombreCliente:            revision.usuarioId           ?revision.usuarioId.nombre              :"",
                        celularCliente :          revision.usuarioId           ?revision.usuarioId.celular             :"",
                        emailCliente:             revision.usuarioId           ?revision.usuarioId.email               :"",
                        puntos:                   revision.puntoId             ?[revision.puntoId]                     :[],
                        puntoId:                  revision.puntoId             ?revision.puntoId._id                   :null,
                        zonaId:                   revision.zonaId               ?revision.zonaId._id                   :null,
                        
                      
                        imgDocumento     : revision.documento      ?revision.documento      :[],
                      
                    })
                })
       
    }
     
    
    rendercontenido(){
        let {avisos, extintores, distancias, electricas, accesorios, imgDepTecnico, depTecnicoText, nControl, imgDocumento, cargando} = this.state
        console.log(imgDocumento)
        return(
            <View>
                {/* BARRIO */}
                <Text style={style.textCerrar}>N Control: {nControl}</Text>

                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2Cerrar}>Falta de Avisos reglamentarios en mal estado</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(avisos ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[avisos ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(avisos)=>this.setState({avisos})}
                        value = {avisos}  
                    />
                     
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2Cerrar}>Falta extintores en mal estado</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(extintores ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[extintores ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(extintores)=>this.setState({extintores})}
                        value = {extintores}  
                    />
                    
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2Cerrar}>No cumple distancias en mal estado</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(distancias ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[distancias ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(distancias)=>this.setState({distancias})}
                        value = {distancias}  
                    />
                    
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2Cerrar}>Fuentes ignición cerca en mal estado</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(electricas ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[electricas ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(electricas)=>this.setState({electricas})}
                        value = {electricas}  
                    />
                    
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2Cerrar}>No cumple accesorios y materiales</Text>
                    <Switch
                        trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                        thumbColor={[Platform.OS=='ios'?'#FFFFFF':(accesorios ?'#d60606':'#ffffff')]}
                        ios_backgroundColor="#fbfbfb"
                        style={[accesorios ?style.switchEnableBorder:style.switchDisableBorder]}
                        onValueChange = {(accesorios)=>this.setState({accesorios})}
                        value = {accesorios}  
                    />
                     
                </View>


                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Comentario</Text>
                    <TextInput
                        placeholder="Comentarios"
                        value={depTecnicoText}
                        style={style.inputStep4}
                        onChangeText={(depTecnicoText)=> this.setState({ depTecnicoText })}
                    />
                </View>
                 {/* DOSSIER */}
                 <SubirDocumento 
                    source={imgDocumento}
                    width={180}
                    titulo="Documento Adjunto"
                    limiteImagenes={4}
                    imagenes={(imgDocumento) => {  this.setState({imgDocumento}) }}
                />
                <View style={style.separador}></View>
                {/* IMAGEN */}
                <TomarFoto 
                    source={imgDepTecnico}
                    width={180}
                    titulo="Imagen"
                    limiteImagenes={4}
                    imagenes={(imgDepTecnico) => {  this.setState({imgDepTecnico}) }}
                />
                <View style={style.separador}></View>

               
                <TouchableOpacity style={style.nuevaFrecuencia} onPress={cargando ?null :()=>this.handleSubmit()}>
                    <Text style={style.textGuardar}>{cargando ?"Guardando.." :"Guardar"}</Text>
                </TouchableOpacity>

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
    handleSubmit(){
        const {distancias, extintores, accesorios, imgDepTecnico, depTecnicoText, avisos, electricas, imgDocumento, revisionId} = this.state
        console.log({imgDocumento, extintores, imgDepTecnico, depTecnicoText, avisos, revisionId})
        this.setState({cargando:true})
        let data = new FormData();
        imgDepTecnico.forEach(e=>{
            data.append('imgDepTecnico', e);
        })
        imgDocumento.forEach(e=>{
            data.append('imgDocumento', e);
        })
        data.append('depTecnicoText',  depTecnicoText);
        data.append('distancias',  distancias);
        data.append('avisos',      avisos);
        data.append('extintores',  extintores);
        data.append('electricas',  electricas);
        data.append('accesorios',  accesorios);
  
        axios({
            method: 'PUT',   
            url: `rev/revision/cerrarDepTecnico/${revisionId}`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            alert("Revisión Cerrada")
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
