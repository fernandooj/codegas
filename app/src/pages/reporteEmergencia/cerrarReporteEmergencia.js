import React, {Component} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput, Switch, Alert} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import DatePicker 			           from 'react-native-datepicker'
import axios             from 'axios';

 
import TomarFoto                       from "../components/tomarFoto";
import Footer            from '../components/footer'
 
 
class cerrarRevision extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            imgDepTecnico:[],
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
                        
                        /////////  step 2
                        //codigoInterno:     revision.codigoInterno ?revision.codigoInterno           :"",
                        capacidad         : revision.capacidad         ?revision.capacidad          :"",
                        fabricante        : revision.fabricante        ?revision.fabricante         :"",
                        barrio            : revision.barrio            ?revision.barrio             :"",
                        sector            : revision.sector            ?revision.sector             :"",
                        m3                : revision.m3                ?revision.m3                 :"",
                        usuariosAtendidos : revision.usuariosAtendidos ?revision.usuariosAtendidos  :"",
                        propiedad         : revision.propiedad         ?revision.propiedad          :"",
                        lote              : revision.lote              ?revision.lote               :"",
                        nMedidorText      : revision.nMedidorText      ?revision.nMedidorText       :"",

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
                        
                        /////////  step 3
                        imgNMedidor     : revision.nMedidor      ?revision.nMedidor      :[],
                        imgNComodato    : revision.nComodato     ?revision.nComodato     :[],
                        imgOtrosSi      : revision.otrosSi       ?revision.otrosSi       :[],
                        imgRetiroTanques: revision.retiroTanques ?revision.retiroTanques :[],
                        
                        /////////  step 4
                        imgDepTecnico     : revision.depTecnico        ?revision.depTecnico        :[],
                        depTecnicoText     : revision.depTecnicoText   ?revision.depTecnicoText  :"",
                        avisos            : revision.avisos            ?revision.avisos            :"",
                        extintores        : revision.extintores        ?revision.extintores        :"",
                        distancias        : revision.distancias        ?revision.distancias        :"",
                        electricas        : revision.electricas        ?revision.electricas        :"",
                    })
                })
       
    }
     
    
    rendercontenido(){
        let {avisos, extintores, distancias, electricas, imgDepTecnico, depTecnicoText, nControl, nActa, cargando} = this.state
        return(
            <View>
                {/* BARRIO */}
                <Text style={style.textCerrar}>N Control: {nControl}</Text>

                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Avisos reglamentarios</Text>
                    <Switch
                        onValueChange = {(avisos)=>this.setState({avisos})}
                        value = {avisos}
                    />
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Extintores</Text>
                    <Switch
                        onValueChange = {(extintores)=>this.setState({extintores})}
                        value = {extintores}
                    />
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Distancias</Text>
                    <Switch
                        onValueChange = {(distancias)=>this.setState({distancias})}
                        value = {distancias}
                    />
                </View>
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Condiciones electricas</Text>
                    <Switch
                        onValueChange = {(electricas)=>this.setState({electricas})}
                        value = {electricas}
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
                
                {/* IMAGEN */}
                <TomarFoto 
                    source={imgDepTecnico}
                    width={180}
                    titulo="Imagen"
                    limiteImagenes={4}
                    imagenes={(imgDepTecnico) => {  this.setState({imgDepTecnico}) }}
                />

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
        const {distancias, extintores, imgDepTecnico, depTecnicoText, avisos, electricas, revisionId} = this.state
        console.log({distancias, extintores, imgDepTecnico, depTecnicoText, avisos, revisionId})
        this.setState({cargando:true})
        let data = new FormData();
        imgDepTecnico.forEach(e=>{
            data.append('imgDepTecnico', e);
        })
        data.append('depTecnicoText',  depTecnicoText);
        data.append('distancias',  distancias);
        data.append('avisos',      avisos);
        data.append('extintores',  extintores);
        data.append('electricas',  electricas);
  
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
