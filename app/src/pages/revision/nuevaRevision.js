import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Switch, TextInput, Platform, Image, Dimensions, AsyncStorage} from 'react-native'
import Toast from 'react-native-simple-toast';
import ModalFilterPicker               from 'react-native-modal-filter-picker'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';  
import axios                           from 'axios';
import Icon                            from 'react-native-fa-icons';
import TomarFoto                       from "../components/tomarFoto";
import SubirDocumento                  from "../components/subirDocumento";
import { connect }                     from "react-redux";
import {getUsuariosAcceso}             from '../../redux/actions/usuarioActions'
import {getVehiculos}                  from '../../redux/actions/vehiculoActions'
import Footer                          from '../components/footer'
import {style}                         from './style'
 

let sectores    = [{key:"E2", label:"E2"},{key:"E3", label:"E3"},{key:"E4", label:"E4"},{key:"E5", label:"E5"},{key:"E6", label:"E6"},{key:"O", label:"O"},{key:"C", label:"C"},{key:"I", label:"I"},{key:"OT", label:"OT"}]
let ubicaciones = [{key:"Azotea", label:"Azotea"},{key:"Enterrado", label:"Enterrado"},{key:"Piso", label:"Piso"}]
let propiedades = [{key:"Usuario", label:"Usuario"},{key:"Propio", label:"Propio"}]
let m3s         = [{key:"Si", label:"Si"},{key:"No", label:"No"}]


let size  = Dimensions.get('window');
class Tanques extends Component{
	constructor(props) {
	    super(props);
	    this.state={
            modalCliente:false,
            modalSectores:false,
            modalZona:false,
            modalPropiedad:false,
            modalUbicacion:false,
            modalM3:false,
            modalPlacas:false,
            modalCapacidad:false,
            modalAlerta:false,
            clientes:[],
            puntos:[],
            placas:[],
            imgIsometrico:[],
            imgAlerta:[],
            imgDepTecnico:[],
            imgNMedidor:[],
            imgNComodato:[],
            imgOtrosSi:[],
            imgRetiroTanques:[],
            imgPuntoConsumo:[],
            imgProtocoloLlenado:[],
            imgHojaSeguridad:[],
            imgVisual:[],
            tanqueArray:[],
            tanqueIdArray:[],  
            lat:4.597825,
            lng:-74.0755723
	    }
    }
    async componentWillMount(){
        const accesoPerfil = await AsyncStorage.getItem('acceso')
        this.setState({accesoPerfil})
            axios.get(`tan/tanque`)
            .then(res=>{
                console.log(res.data)
                let placas = res.data.tanque
                placas = placas.map(e=>{
                    return{
                        key:e._id,
                        label:e.placaText
                    }
                }) 
                this.setState({placas})
            })
            let revisionId = this.props.navigation.state.params ?this.props.navigation.state.params.revisionId :null
            let puntoId = this.props.navigation.state.params.puntoId  
            let usuarioId = this.props.navigation.state.params.clienteId 
            let capacidad = this.props.navigation.state.params.capacidad 
            let direccion = this.props.navigation.state.params.direccion 
            let observacion = this.props.navigation.state.params.observacion 
    
            this.filtroClientes(usuarioId)
            
            this.setState({revisionId, puntoId, usuarioId, capacidad, direccion, observacion})
            if(revisionId){
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
                        nMedidorText      : revision.nMedidorText      ?revision.nMedidorText       :"",
                        ubicacion         : revision.ubicacion         ?revision.ubicacion          :"",
                        nComodatoText     : revision.nComodatoText     ?revision.nComodatoText      :"",

                        usuarioId:                revision.usuarioId           ?revision.usuarioId._id                 :null,
                        cedulaCliente:            revision.usuarioId           ?revision.usuarioId.razon_social        :"",
                        codtCliente:              revision.usuarioId           ?revision.usuarioId.codt        :"",
                        razon_socialCliente:      revision.usuarioId           ?revision.usuarioId.cedula              :"",
                        direccion_facturaCliente: revision.usuarioId           ?revision.usuarioId.direccion_factura   :"",
                        nombreCliente:            revision.usuarioId           ?revision.usuarioId.nombre              :"",
                        celularCliente :          revision.usuarioId           ?revision.usuarioId.celular             :"",
                        emailCliente:             revision.usuarioId           ?revision.usuarioId.email               :"",
                        puntos:                   revision.puntoId             ?[revision.puntoId]                     :[],
                        puntoId:                  revision.puntoId             ?revision.puntoId._id                   :null,
                        zonaId:                   revision.zonaId               ?revision.zonaId._id                   :null,
                        
                        /////////  step 3
                        imgNMedidor     :    revision.nMedidor         ?revision.nMedidor      :[],
                        imgNComodato    :    revision.nComodato        ?revision.nComodato     :[],
                        imgOtrosSi      :    revision.otrosSi          ?revision.otrosSi       :[],
                        imgRetiroTanques:    revision.retiroTanques    ?revision.retiroTanques :[],
                        imgPuntoConsumo:     revision.puntoConsumo     ?revision.puntoConsumo :[],
                        imgVisual:           revision.visual           ?revision.visual :[],
                        imgProtocoloLlenado: revision.protocoloLlenado ?revision.protocoloLlenado :[],
                        imgHojaSeguridad:    revision.hojaSeguridad    ?revision.hojaSeguridad :[],
                        
                        
                        /////////  step 4
                        imgIsometrico     : revision.isometrico        ?revision.isometrico        :[],
                        observaciones     : revision.observaciones     ?revision.observaciones     :"",
                        estado            : revision.estado            ?revision.estado            :"",
                        solicitudServicio : revision.solicitudServicio ?revision.solicitudServicio :"",
                        imgAlerta         : revision.alerta            ?revision.alerta            :[],
                        alertaText        : revision.alertaText        ?revision.alertaText        :"",
                        alertaFecha       : revision.alertaFecha       ?revision.alertaFecha       :"",
                        nActa             : revision.nActa             ?revision.nActa             :"",
                        avisos            : revision.avisos            ?revision.avisos            :false,
                        extintores        : revision.extintores        ?revision.extintores        :false,
                        distancias        : revision.distancias        ?revision.distancias        :false,
                        electricas        : revision.electricas        ?revision.electricas        :false,
                        imgDepTecnico     : revision.depTecnico        ?revision.depTecnico        :[],
                        depTecnicoText    : revision.depTecnicoText    ?revision.depTecnicoText    :"",
                        depTecnicoEstado  : revision.depTecnicoEstado  ?revision.depTecnicoEstado  :"",
                        
                    })
                })

            }
        
        navigator.geolocation.getCurrentPosition(e=>{
            console.log({e})
			let lat = parseFloat(e.coords.latitude)
			let lng = parseFloat(e.coords.longitude)
            lat =  lat ?lat :4.597825;
            lng =  lng ?lng :-74.0755723;
            console.log({lat, lng})
            this.setState({lat, lng})
        }, (error)=>this.watchID = navigator.geolocation.watchPosition(e=>{
            console.log({e})
            let lat =parseFloat(e.coords.latitude)
            let lng = parseFloat(e.coords.longitude)
            lat =  lat ?lat :4.597825;
            lng =  lng ?lng :-74.0755723;            
            this.setState({lat, lng})
        },
            (error) => console.log('error'),
            {enableHighAccuracy: true, timeout:5000, maximumAge:0})
        )
    }
    filtroClientes(idCliente){
        axios.get(`users/clientes`)
        .then(res => {
            console.log(res.data)
            if(res.data.status){
                let clientes1 = res.data.usuarios.map(e=>{
                    return {key:e._id, label:e.cedula ?e.razon_social+" | "+e.cedula+" | "+e.codt :e.razon_social, email:e.email, direccion_factura:e.direccion_factura, nombre:e.nombre, razon_social:e.razon_social, cedula:e.cedula, celular:e.celular, codt:e.codt }
                }) 
                let cliente = clientes1.filter(e=>{ return e.key==idCliente })
                this.setState({cliente:cliente[0].label, idCliente, cedulaCliente:cliente[0].cedula, codtCliente:cliente[0].codt, emailCliente:cliente[0].email, razon_socialCliente:cliente[0].razon_social, direccion_facturaCliente:cliente[0].direccion_factura, celularCliente:cliente[0].celular,nombreCliente:cliente[0].nombre, modalCliente:false})
                
            }
        })


		
    }

    // getClientes(){
    //     axios.get(`users/clientes`)
    //     .then(res => {
    //         console.log(res.data)
    //         if(res.data.status){
    //             let clientes = res.data.usuarios.map(e=>{
    //                 return {key:e._id, label:e.cedula ?e.razon_social+" | "+e.cedula+" | "+e.codt :e.razon_social, email:e.email, direccion_factura:e.direccion_factura, nombre:e.nombre, razon_social:e.razon_social, cedula:e.cedula, celular:e.celular, codt:e.codt }
    //             }) 
    //             // this.setState({clientes, modalCliente:true, puntoId:undefined})
    //         }
    //     })
    // }
    
    

    buscarTanque(id){
        
        let {tanqueArray, tanqueIdArray} = this.state
        axios.get(`tan/tanque/byId/${id}`)
            .then(res=>{
                console.log(res.data)
                const {tanque} = res.data
                let infoTanque={
                    /////// step 1
                    _id:                tanque._id,
                    placaText :         tanque.placaText         ?tanque.placaText          :"",
                    sector:             tanque.sector         ?tanque.sector          :"",
                    barrio:             tanque.barrio        ?tanque.barrio         :"",
                    usuariosAtendidos:  tanque.usuariosAtendidos ?tanque.usuariosAtendidos  :"",
                    
                    //////  step 2
                    m3:                 tanque.m3             ?tanque.m3             :"",
                    ubicacion:          tanque.ubicacion      ?tanque.ubicacion      :"",
                    codigoActivo:       tanque.codigoActivo   ?tanque.codigoActivo   :"",
                    serie:              tanque.serie          ?tanque.serie          :"",
                    anoFabricacion:     tanque.anoFabricacion ?tanque.anoFabricacion :"",
                     

                    //////  step 3
                    imgNMedidor:        tanque.imgNMedidor     ?tanque.imgNMedidor   :[],
                    imgNComodato:       tanque.imgNComodato    ?tanque.imgNComodato  :[],
                    imgOtrosSi:         tanque.imgOtrosSi      ?tanque.imgOtrosSi    :[],
                    

                    //////  step 3
                    usuarioId:                tanque.usuarioId           ?tanque.usuarioId._id                 :null,
                    codtCliente:              tanque.usuarioId           ?tanque.usuarioId.codt              :"",
                    cedulaCliente:            tanque.usuarioId           ?tanque.usuarioId.cedula              :"",
                    razon_socialCliente:      tanque.usuarioId           ?tanque.usuarioId.razon_social        :"",
                    direccion_facturaCliente: tanque.usuarioId           ?tanque.usuarioId.direccion_factura   :"",
                    nombreCliente:            tanque.usuarioId           ?tanque.usuarioId.nombre              :"",
                    celularCliente :          tanque.usuarioId           ?tanque.usuarioId.celular             :"",
                    emailCliente:             tanque.usuarioId           ?tanque.usuarioId.email               :"",
                    puntos:                   tanque.puntoId             &&[tanque.puntoId]                       ,
                    puntoId:                  tanque.puntoId             ?tanque.puntoId._id                   :[],
                    zonaId:                   tanque.zonaId              ?tanque.zonaId._id                    :null,
                }
                
                if(tanqueIdArray.includes(tanque._id)){
                    alert("Este tanque ya esta agregado")
                }else{
                    tanqueArray.push(infoTanque)
                    tanqueIdArray.push(tanque._id)
                 
                    this.setState({tanqueArray, tanqueIdArray, modalPlacas:false})

                }
            })
        }
    eliminarTanque(tanqueId){
        console.log(tanqueId)
        let {tanqueIdArray, tanqueArray} = this.state
        tanqueArray= tanqueArray.filter(e=>{
            return e._id!=tanqueId 
        })
        tanqueIdArray= tanqueIdArray.filter(e=>{
            return e!=tanqueId 
        })
        this.setState({tanqueArray, tanqueIdArray})
    }
    step1(){
        const {tanqueArray, modalPlacas, placas, placaText} = this.state
       
        return(
            <View>
                {/* PLACAS */}
                <ModalFilterPicker
					placeholderText="Placas ..."
					visible={modalPlacas}
					onSelect={(e)=>this.buscarTanque(e)}
					onCancel={()=>this.setState({modalPlacas:false})}
					crearTanque={(e)=>{this.props.navigation.navigate("nuevoTanque"), this.setState({modalPlacas:false}) }}
                    options={placas}
                    revision 
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Placa</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalPlacas:true})}>
                        <Text style={placaText ?style.textBtnActive :style.textBtn}>{placaText ?placaText :"Placas"}</Text>
                    </TouchableOpacity>
                </View>
                
                    {
                        tanqueArray.map((e, key)=>{
                            return(
                                <View style={style.contenedorUsuario} key={key}>
                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                        <View style={{width:"90%", alignItems:"center"}}>
                                            <View style={style.subContenedorUsuario}>
                                                <Text style={style.row1}>Placa:</Text>
                                                <Text style={style.row2}>{e.placaText}</Text>
                                            </View>
                                            <View style={style.subContenedorUsuario}>
                                                <Text style={style.row1}>Capacidad:</Text>
                                                <Text style={style.row2}>{e.capacidad}</Text>
                                            </View>
                                            <View style={style.subContenedorUsuario}>
                                                <Text style={style.row1}>Cliente:</Text>
                                                <Text style={style.row2}>{e.razon_socialCliente}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={()=>this.eliminarTanque(e._id)}>
                                            <Icon name="trash" style={style.iconTrash} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )
                        })
                    }
            </View>
        )
    }

    step2(){
        const {modalSectores, sector, barrio, usuariosAtendidos, modalM3, m3, usuarioId, modalCliente, clientes, codtCliente, cedulaCliente, razon_socialCliente, celularCliente, emailCliente, nombreCliente, direccion_facturaCliente, puntos, puntoId, modalPropiedad, propiedad, nComodatoText, nMedidorText, ubicacion, modalUbicacion, capacidad, direccion, observacion} = this.state
        console.log({puntos})
        return(
            <View>
                 {/* SECTORES */}
                 <ModalFilterPicker
					placeholderText="Sectores ..."
					visible={modalSectores}
					onSelect={(e)=>this.setState({sector:e, modalSectores:false})}
					onCancel={()=>this.setState({modalSectores:false})}
                    options={sectores}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Sector</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalSectores:true})}>
                        <Text style={sector ?style.textBtnActive :style.textBtn}>{sector ?sector :"Sector"}</Text>
                    </TouchableOpacity>
                </View>

                {/* BARRIO */}
                 <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Barrio</Text>
                    <TextInput
                        placeholder="Barrio"
                        value={barrio}
                        style={style.inputStep2}
                        onChangeText={(barrio)=> this.setState({ barrio })}
                    />
                </View>


                {/* USUARIOS ATENDIDOS */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Usuarios Atendidos</Text>
                    <TextInput
                        placeholder="Usuarios Atendidos"
                        style={style.inputStep2}
                        value={usuariosAtendidos}
                        onChangeText={(usuariosAtendidos)=> this.setState({ usuariosAtendidos })}
                    />
                </View>

                {/* M3 */}
                <ModalFilterPicker
					placeholderText="M3 ..."
					visible={modalM3}
					onSelect={(e)=>this.setState({m3:e, modalM3:false})}
					onCancel={()=>this.setState({modalM3:false})}
                    options={m3s}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>M3</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalM3:true})}>
                        <Text style={m3 ?style.textBtnActive :style.textBtn}>{m3 ?m3 :"M3"}</Text>
                    </TouchableOpacity>
                </View>
                
                {/* NO MEDIDOR TEXTO */}
                {
                    m3=="Si"
                    &&<View style={style.contenedorSetp2}>
                        <Text style={style.row1Step2}>N° Medidor</Text>
                        <TextInput
                            placeholder="N° Medidor"
                            value={nMedidorText}
                            style={style.inputStep2}
                            onChangeText={(nMedidorText)=> this.setState({ nMedidorText })}
                        />
                    </View>
                }

                {/* PROPIEDAD */}  
                 <ModalFilterPicker
					placeholderText="Propiedad ..."
					visible={modalPropiedad}
					onSelect={(e)=>this.setState({propiedad:e, modalPropiedad:false})}
					onCancel={()=>this.setState({modalPropiedad:false})}
                    options={propiedades}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Propiedad</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalPropiedad:true})}>
                        <Text style={propiedad ?style.textBtnActive :style.textBtn}>{propiedad ?propiedad :"Propiedad"}</Text>
                    </TouchableOpacity>
                </View>

                {/* UBICACIONES */}
                <ModalFilterPicker
					placeholderText="ubicaciones ..."
					visible={modalUbicacion}
					onSelect={(e)=>this.setState({ubicacion:e, modalUbicacion:false})}
					onCancel={()=>this.setState({modalUbicacion:false})}
                    options={ubicaciones}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Ubicación</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalUbicacion:true})}>
                        <Text style={ubicacion ?style.textBtnActive :style.textBtn}>{ubicacion ?ubicacion :"Ubicación"}</Text>
                    </TouchableOpacity>
                </View> 

                {/* NUMERO DE COMODATO */}
                 <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>N Comodato</Text>
                    <TextInput
                        placeholder="N Comodato"
                        value={nComodatoText}
                        style={style.inputStep2}
                        onChangeText={(nComodatoText)=> this.setState({ nComodatoText })}
                    />
                </View>  
                

                {/* USUARIO */}
                
                <ModalFilterPicker
					placeholderText="Filtrar ..."
					visible={modalCliente}
					onSelect={(e)=>this.filtroClientes(e)}
					onCancel={()=>this.setState({modalCliente:false})}
                    options={clientes}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                {/* <TouchableOpacity style={style.nuevaFrecuencia} onPress={()=>this.getClientes()}>
                    <Icon name="plus" style={style.iconFrecuencia} />
                    <Text style={style.textGuardar}>Asignar Cliente</Text>
                </TouchableOpacity> */}
                {
                    usuarioId
                    &&<View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Identificación:</Text>
                            <Text style={style.row2}>{cedulaCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>CODT:</Text>
                            <Text style={style.row2}>{codtCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Razón Social:</Text>
                            <Text style={style.row2}>{razon_socialCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Dirección:</Text>
                            <Text style={style.row2}>{direccion_facturaCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Nombre:</Text>
                            <Text style={style.row2}>{nombreCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Celular:</Text>
                            <Text style={style.row2}>{celularCliente}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Email:</Text>
                            <Text style={style.row2}>{emailCliente}</Text>
                        </View>
                    </View>
                } 
                    <View style={style.btnZonaActiva} >
                        <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                        <View>
                            <Text style={style.textZona}>{direccion}</Text>
                            <Text style={style.textZona}>Almacenamiento: {capacidad}</Text>
                            <Text style={style.textZona}>Observacion: {observacion}</Text>
                        </View>
                    </View>    
                {
                    //  puntos.length>1
                    //  ?<View>
                    //  <Text style={style.textZona}>Punto de entrega</Text>
                    //      {
                    //          puntos.map((e, key)=>{
                    //              return (
                    //                  <TouchableOpacity key={key} style={puntoId==e._id ?style.btnZonaActiva :style.btnZona} onPress={()=>this.setState({puntoId:e._id, zonaId:e.idZona})}>
                    //                      <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                    //                      <View>
                    //                          <Text style={style.textZona}>{e.direccion}</Text>   
                    //                          <Text style={style.textZona}>Almacenamiento: {e.capacidad}</Text>
                    //                      </View>
                                        
                    //                  </TouchableOpacity>
                    //              )
                    //          })
                    //      }
                    //  </View>
                    //  :puntos.map((e, key)=>{
                    //      return (
                    //          <View key={key} style={style.btnZonaActiva} >
                    //             <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                    //             <View>
                    //                 <Text style={style.textZona}>{e.direccion}</Text>
                    //                 <Text style={style.textZona}>Almacenamiento: {e.capacidad}</Text>
                    //             </View>
                    //          </View>    
                    //      )
                    //  })
                }

            </View>
        )
    }

   
    step3(){
        const {observaciones, avisos, extintores, distancias, electricas, estado, solicitudServicio, imgAlerta, alertaText, alertaFecha, nActa, depTecnicoEstado, imgDepTecnico, depTecnicoText} = this.state
        return(
            <View>

                {/* OBSERVACIONES */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Observaciones</Text>
                    <TextInput
                        placeholder="Observaciones"
                        style={style.inputStep4}
                        value={observaciones}
                        onChangeText={(observaciones)=> this.setState({ observaciones })}
                    />
                </View>
                <View style={style.separador}></View>
                {
                    estado==2
                    ?<View style={style.contenedorSetp2}>
                        <Text style={style.row1Step2}>Solicitud</Text>
                        <Text style={style.row1Step2}>{solicitudServicio}</Text>
                    </View>
                    :estado==3
                    ?<>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Solicitud</Text>
                            <Text style={style.row1Step2}>{solicitudServicio}</Text>
                        </View>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Comentario</Text>
                            <Text style={style.row1Step2}>{alertaText}</Text>
                        </View>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Fecha</Text>
                            <Text style={style.row1Step2}>{alertaFecha}</Text>
                        </View>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>N Acta</Text>
                            <Text style={style.row1Step2}>{nActa}</Text>
                        </View>
                        <TomarFoto 
                            source={imgAlerta}
                            width={180}
                            titulo="Retiro de tanques"
                            limiteImagenes={1}
                            imagenes={(imgAlerta) => {  this.setState({imgAlerta}) }}
                        /> 
                    </>
                    :<TouchableOpacity style={style.nuevaFrecuencia} onPress={()=>this.setState({modalAlerta:true})}>
                        <Text style={style.textGuardar}>Nueva Alerta</Text>
                    </TouchableOpacity>
                }
                <View style={style.separador}></View>
                {
                    depTecnicoEstado
                    ?<>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Observacion</Text>
                            <Text style={style.row1Step2}>{depTecnicoText}</Text>
                        </View>
                        <TomarFoto 
                            source={imgDepTecnico}
                            width={180}
                            titulo="Retiro de tanques"
                            limiteImagenes={1}
                            imagenes={(imgDepTecnico) => {  this.setState({imgDepTecnico}) }}
                        /> 
                    </>
                    :<>
                    <View style={style.contenedorSetp2}>
                        <Text style={style.row1Step3}>Falta de Avisos reglamentarios</Text>
                        <Switch
                            trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                            thumbColor={[Platform.OS=='ios'?'#FFFFFF':(avisos ?'#d60606':'#ffffff')]}
                            ios_backgroundColor="#fbfbfb"
                            style={[avisos ?style.switchEnableBorder:style.switchDisableBorder]}
                            value={avisos}
                            onValueChange={(avisos) =>this.setState({avisos})}
                        />
                        
                    </View>
                    <View style={style.contenedorSetp2}>
                        <Text style={style.row1Step3}>Falta extintores</Text>
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
                        <Text style={style.row1Step3}>No cumple distancias</Text>
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
                        <Text style={style.row1Step3}>Fuentes ignición cerca</Text>
                        <Switch
                            trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                            thumbColor={[Platform.OS=='ios'?'#FFFFFF':(electricas ?'#d60606':'#ffffff')]}
                            ios_backgroundColor="#fbfbfb"
                            style={[electricas ?style.switchEnableBorder:style.switchDisableBorder]}
                            onValueChange = {(electricas)=>this.setState({electricas})}
                            value = {electricas}
                        />
                    </View>
                    </>
                }
                
               
            </View>
        )
    }
      
    step4(){
        let {imgNMedidor, imgNComodato, imgOtrosSi, imgRetiroTanques, imgPuntoConsumo, imgVisual, imgProtocoloLlenado, imgHojaSeguridad, imgIsometrico} = this.state
        
        return(
            <View>
                {/* ISOMETRICO */}
                <TomarFoto 
                    source={imgIsometrico}
                    width={180}
                    titulo="Isometrico"
                    limiteImagenes={4}
                    imagenes={(imgIsometrico) => {  this.setState({imgIsometrico}) }}
                />

                {/* PLACA */}
                <TomarFoto 
                    source={imgNMedidor}
                    width={180}
                    titulo="Otros Comodatos"
                    limiteImagenes={4}
                    imagenes={(imgNMedidor) => {  this.setState({imgNMedidor}) }}
                />
                
                {/* PLACA */}
                <TomarFoto 
                    source={imgRetiroTanques}
                    width={180}
                    titulo="Acta de recibido"
                    limiteImagenes={4}
                    imagenes={(imgRetiroTanques) => {  this.setState({imgRetiroTanques}) }}
                /> 
                {/* PLACA */}
                 <TomarFoto 
                    source={imgPuntoConsumo}
                    width={180}
                    titulo="Punto Consumo"
                    limiteImagenes={4}
                    imagenes={(imgPuntoConsumo) => {  this.setState({imgPuntoConsumo}) }}
                /> 
                {/* PLACA */}
                 <TomarFoto 
                    source={imgVisual}
                    width={180}
                    titulo="Visual Tanque"
                    limiteImagenes={4}
                    imagenes={(imgVisual) => {  this.setState({imgVisual}) }}
                /> 

                
                {/* NO COMODATO */}
                <SubirDocumento 
                    source={imgProtocoloLlenado}
                    width={180}
                    titulo="Protocolo de llenado"
                    limiteImagenes={4}
                    imagenes={(imgProtocoloLlenado) => {  this.setState({imgProtocoloLlenado}) }}
                />

                {/* NO COMODATO */}
                <SubirDocumento 
                    source={imgHojaSeguridad}
                    width={180}
                    titulo="Hoja de seguridad"
                    limiteImagenes={4}
                    imagenes={(imgHojaSeguridad) => {  this.setState({imgHojaSeguridad}) }}
                />
                {/* NO COMODATO */}
                <SubirDocumento 
                    source={imgNComodato}
                    width={180}
                    titulo="Doc. de comodato"
                    limiteImagenes={4}
                    imagenes={(imgNComodato) => {  this.setState({imgNComodato}) }}
                />
                {/* OTROS SI */}
                <SubirDocumento 
                    source={imgOtrosSi}
                    width={180}
                    titulo="Otros si"
                    limiteImagenes={4}
                    imagenes={(imgOtrosSi) => {  this.setState({imgOtrosSi}) }}
                />
            </View>
        )
    }
    step5(){
        let {lat, lng, accesoPerfil}= this.state
        console.log({lat, lng})
        return(
            <View>
                {
                    accesoPerfil=="admin"
                    ?<>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Latitud</Text>
                            <TextInput
                                placeholder="Latitud"
                                style={style.inputStep2}
                                value={lat ?lat.toString() :""}
                                onChangeText={(lat)=> this.setState({ lat })}
                            />
                        </View>
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step2}>Longitud</Text>
                            <TextInput
                                placeholder="Longitud"
                                style={style.inputStep2}
                                value={lng ?lng.toString() :""}
                                onChangeText={(lng)=> this.setState({ lng })}
                            />
                        </View>
                    </>
                    :<><Text>Lat: {lat}</Text>
                     <Text>Lng: {lng}</Text></>
                }
            </View>
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           MODAL QUE MUESTRA LA OPCION DE EDITAR UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalAlerta(){
        const {solicitudServicio} = this.state
        return(
            <View style={style.modal}>
                <View style={style.subContenedorModal}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalAlerta:false})} style={style.btnModalClose}>
                        <Icon name={'times-circle'} style={style.iconCerrar} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Solicitud Servicio"
                        style={style.inputAlerta}
                        value={solicitudServicio}
                        onChangeText={(solicitudServicio)=> this.setState({ solicitudServicio })}
                    />
                    <TouchableOpacity style={style.nuevaAlerta} onPress={()=>this.solicitudServicio()}>
                        <Text style={style.textGuardar}>Enviar Alerta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    solicitudServicio(){
        const {solicitudServicio, revisionId} = this.state
        axios.post(`rev/revision/solicitudServicio/${revisionId}`, {solicitudServicio})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                Toast.show("Solicitud enviada")
                this.setState({modalAlerta:false, solicitudServicio:""})
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }


    renderSteps(){
        let {tanqueIdArray, revisionId, modalAlerta} = this.state
       
        return(
            <ProgressSteps activeStepIconBorderColor="#002587" progressBarColor="#002587" activeLabelColor="#002587" >
                <ProgressStep label="Datos"  nextBtnDisabled={tanqueIdArray.length==0 ?true :false} nextBtnText="Siguiente" onNext={()=>revisionId ?this.editarStep1() :this.crearStep1()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step1()}    
                    </View>
                </ProgressStep> 
                <ProgressStep label="Información" nextBtnText="Siguiente"   onNext={()=>this.editarStep2()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step2()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Instalación" nextBtnText="Siguiente"  onNext={()=>this.editarStep3()}>
                    <View style={{ alignItems: 'center' }}>
                        {modalAlerta &&this.modalAlerta()}
                        {this.step3()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Documetos adicionales" nextBtnText="Siguiente"  onNext={()=>this.editarStep4()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step4()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Coordenadas" finishBtnText="Guardar"  onSubmit={()=>this.editarStep5()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step5()}
                    </View>
                </ProgressStep>
                 
            </ProgressSteps>
        )
    }

	render(){
        const {navigation} = this.props
        return (
            <>
                <View style={style.container}>
                    {this.renderSteps()}
                </View>
                <Footer navigation={navigation} />
            </>
        )
    }
     

    
    addTanque(nombre, cantidad){
        let tanques = this.state.tanques.filter(e=>{
            if (e.nombre==nombre) e.cantidad = e.cantidad+cantidad
            return e
        })
        this.setState({tanques})
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            CREAR TANQUE
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    crearStep1(){
        const {tanqueIdArray} = this.state
        console.log({tanqueIdArray})
        axios.post(`rev/revision/`, {tanqueId:tanqueIdArray})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                this.setState({revisionId:res.data.revision._id})
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 1
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep1(){
        const {sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, zonaId, usuarioId, puntoId, propiedad, nComodatoText, nMedidorText, ubicacion} = this.state
        console.log({puntoId})
        axios.put(`rev/revision/${revisionId}`, {tanqueId:tanqueIdArray, sector, barrio, usuariosAtendidos, m3, zonaId, usuarioId, puntoId, propiedad, nComodatoText, nMedidorText, ubicacion})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                // AsyncStorage.setItem('tanqueId', res.data.tanque._id)
                // this.setState({tanqueId:res.data.tanque._id})
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 2
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep2(){
        const {zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, propiedad, nComodatoText, nMedidorText, ubicacion} = this.state
        console.log({zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, propiedad, nComodatoText, nMedidorText, ubicacion})
        axios.put(`rev/revision/${revisionId}`, {sector, barrio, usuariosAtendidos, m3, tanqueId:tanqueIdArray, zonaId, usuarioId, puntoId, propiedad, nComodatoText, nMedidorText, ubicacion})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                // AsyncStorage.setItem('tanqueId', res.data.tanque._id)
                // this.setState({tanqueId:res.data.tanque._id})
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 3
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep3(){
        const {observaciones, avisos, extintores, distancias, electricas, revisionId} = this.state
        console.log({observaciones, avisos, extintores, distancias, electricas})
        let data = new FormData();
        
        data.append('observaciones',  observaciones);
        data.append('avisos', avisos);
        data.append('extintores',   extintores);
        data.append('distancias',   distancias);
        data.append('electricas',   electricas);
        axios({
            method: 'PUT',   
            url: `rev/revision/instalacion/${revisionId}`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            
        })
        .catch(err=>{
            console.log({err})
            this.setState({cargando:false})
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 4, IMAGENES Y DOCUMENTOS 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep4(){
        let {imgIsometrico, imgNMedidor, imgNComodato, imgOtrosSi, imgRetiroTanques, imgPuntoConsumo, imgVisual, imgProtocoloLlenado, imgHojaSeguridad, revisionId} = this.state
        console.log({imgNMedidor, imgNComodato, imgOtrosSi, imgRetiroTanques, imgPuntoConsumo, imgVisual, imgProtocoloLlenado, imgHojaSeguridad, revisionId})
        let data = new FormData();
        imgIsometrico.forEach(e=>{
            data.append('imgIsometrico', e);
        })
        imgNMedidor.forEach(e=>{
            data.append('imgNMedidor', e);
        })
        imgNComodato.forEach(e=>{
            data.append('imgNComodato', e);
        })
        imgOtrosSi.forEach(e=>{
            data.append('imgOtrosSi', e);
        })
        imgRetiroTanques.forEach(e=>{
            data.append('imgRetiroTanques', e);
        })
        imgPuntoConsumo.forEach(e=>{
            data.append('imgPuntoConsumo', e);
        })
        imgVisual.forEach(e=>{
            data.append('imgVisual', e);
        })
        imgProtocoloLlenado.forEach(e=>{
            data.append('imgProtocoloLlenado', e);
        })
        imgHojaSeguridad.forEach(e=>{
            data.append('imgHojaSeguridad', e);
        })
        axios({
            method: 'PUT',   
            url: `rev/revision/guardarImagen/${revisionId}`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            
        })
        .catch(err=>{
            console.log({err})
            this.setState({cargando:false})
        })
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 5
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep5(){
        let {lat, lng, revisionId} = this.state
        lat =  lat ?lat :4.597825;
        lng =  lng ?lng :-74.0755723;
        console.log({lat, lng})
        
        axios.put(`rev/revision/coordenadas/${revisionId}`, {lat, lng})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                 
                alert("Revisión Guardado")
                const {navigation} = this.props
                navigation.navigate("Home")
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 3
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
}

const mapState = state => {
	return {
        conductores:state.usuario.usuariosAcceso,
        vehiculos:state.vehiculo.vehiculos
	};
};

const mapDispatch = dispatch => {
    return {
        getVehiculos: () => {
            dispatch(getVehiculos());
        },
        getUsuariosAcceso: (acceso) => {
            dispatch(getUsuariosAcceso(acceso));
        },
    };
};

Tanques.defaultProps = {
    vehiculos:[],
    conductores:[]
};

Tanques.propTypes = {

};

  export default connect(
	mapState,
	mapDispatch
  )(Tanques);
