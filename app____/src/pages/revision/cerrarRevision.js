import React, {Component} from 'react'
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}           from './style'
import {connect}         from 'react-redux' 
import DatePicker 			           from 'react-native-datepicker'
import axios             from 'axios';

import {getUsuarios}     from '../../redux/actions/usuarioActions'  
import TomarFoto                       from "../components/tomarFoto";
import Footer            from '../components/footer'
 

const KEYS_TO_FILTERS = ["nControl", "usuarioId.razon_social", "usuarioId.codt", "zonaId.nombre", "puntoId.nombre"] 
 
class cerrarRevision extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            imgAlerta:[],
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
                        imgIsometrico     : revision.isometrico        ?revision.isometrico        :[],
                        observaciones     : revision.observaciones     ?revision.observaciones     :"",
                        solicitudServicio : revision.solicitudServicio ?revision.solicitudServicio :"",
                        alerta            : revision.alerta            ?revision.alerta.nombre :"",
                        alertaText        : revision.alertaText        ?revision.alertaText.nombre :"",
                        alertaFecha       : revision.alertaFecha       ?revision.alertaFecha.nombre :"",
                        nActa             : revision.nActa             ?revision.nActa.nombre :"",
                        avisos            : revision.avisos            ?revision.avisos            :"",
                        extintores        : revision.extintores        ?revision.extintores        :"",
                        distancias        : revision.distancias        ?revision.distancias        :"",
                        electricas        : revision.electricas        ?revision.electricas        :"",
                    })
                })
       
    }
     
    
    rendercontenido(){
        let {usuarioSolicita, solicitudServicio, imgAlerta, alertaText, alertaFecha, nActa, cargando} = this.state
        return(
            <View>
                {/* BARRIO */}
                <Text style={style.textCerrar}>solicitud: {solicitudServicio}</Text>
                <Text style={style.textCerrar}>Usuario: {usuarioSolicita}</Text>

                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Comentario</Text>
                    <TextInput
                        placeholder="Comentarios"
                        value={alertaText}
                        style={style.inputStep4}
                        onChangeText={(alertaText)=> this.setState({ alertaText })}
                    />
                </View>

                {/* Numero Acta */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Numero Acta</Text>
                    <TextInput
                        placeholder="Numero Acta"
                        value={nActa}
                        style={style.inputStep2}
                        onChangeText={(nActa)=> this.setState({ nActa })}
                    />
                </View>

                {/* FECHA ULTIMA REVISION */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Fecha</Text>
                    <DatePicker
                        customStyles={{
                            dateInput:style.btnDate,
                            placeholderText:alertaFecha ?style.textBtnActive :style.textBtn,
                            dateText: { 
                                fontSize:14,
                                color: '#000000'
                            },
                        }}
                        style={style.btnDate2}
                        
                        locale="es_co"
                        mode="date"
                        placeholder={alertaFecha ?alertaFecha :"Fecha"}
                        format="YYYY-MMM-DD"
                        showIcon={false}
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        androidMode='spinner'
                        onDateChange={(alertaFecha) => {this.setState({alertaFecha})}}
                    />
                </View>
                
                {/* IMAGEN */}
                <TomarFoto 
                    source={imgAlerta}
                    width={180}
                    titulo="Imagen"
                    limiteImagenes={4}
                    imagenes={(imgAlerta) => {  this.setState({imgAlerta}) }}
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
        const {alertaFecha, imgAlerta, alertaText, nActa,revisionId} = this.state
        console.log({alertaFecha, imgAlerta, alertaText, nActa, revisionId})
        this.setState({cargando:true})
        let data = new FormData();
        imgAlerta.forEach(e=>{
            data.append('imgAlerta', e);
        })
        data.append('alertaFecha',  alertaFecha);
        data.append('alertaText', alertaText);
        data.append('nActa',   nActa);
  
        axios({
            method: 'PUT',   
            url: `rev/revision/cerrarRevision/${revisionId}`,
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
