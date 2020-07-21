import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Switch, TextInput, Platform, Image, Dimensions, Alert, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
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
            modalDpto:false,
            modalCiudad:false,
            modalPoblado:false,
            modalPropiedad:false,
            modalUbicacion:false,
            modalM3:false,
            modalPlacas:false,
            modalCapacidad:false,
            modalAlerta:false,
            extintores:false,
            avisos:false,
            distancias:false,
            electricas:false,
            accesorios:false,
            clientes:[],
            puntos:[],
            placas:[],
            imgIsometrico:[],
            imgOtrosComodato:[],
            imgSoporteEntrega:[],
            imgAlerta:[],
            imgDepTecnico:[],
            imgNMedidor:[],
            imgNComodato:[],
            otrosComodato:[],
            imgOtrosSi:[],
            soporteEntrega:[],
            imgPuntoConsumo:[],
            imgProtocoloLlenado:[],
            imgHojaSeguridad:[],
            imgVisual:[],
            tanqueArray:[],
            tanqueIdArray:[], 
            dptos:[{key:"", label:""}], 
            ciudades:[{key:"", label:""}], 
            poblados:[{key:"", label:""}], 
            lat:4.597825,
            lng:-74.0755723
	    }
    }
     
    // let {imgIsometrico, imgOtrosComodato,  imgSoporteEntrega, imgPuntoConsumo, imgVisual, imgProtocoloLlenado, imgHojaSeguridad, imgNComodato, imgOtrosSi} = this.state
    async componentWillMount(){
        //////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////        LISTA TODOS LOS TANQUES
        axios.get(`tan/tanque`)
        .then(res=>{
            
            let placas = res.data.tanque
            placas = placas.map(e=>{
                return{
                    key:e._id._id,
                    label:e._id.placaText
                }
            }) 
            this.setState({placas})
        })
        let accesoPerfil = await AsyncStorage.getItem('acceso')
        let revisionId = this.props.navigation.state.params ?this.props.navigation.state.params.revisionId :null
        let puntoId = this.props.navigation.state.params.puntoId  
        let usuarioId = this.props.navigation.state.params.clienteId 
        
        this.filtroClientes(usuarioId)
 
        this.setState({revisionId, puntoId, usuarioId, accesoPerfil})
 
        //////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////        LISTA SOLO LOS TANQUES DE ESTE USUARIO
        if(usuarioId){
            axios.get(`tan/tanque/byPunto/${puntoId}`)
            .then(res=>{
                let tanqueIdArray = []
                res.data.tanque.map(e=>{
                    tanqueIdArray.push(e._id)
                })
    
                this.setState({tanqueArray:res.data.tanque, tanqueIdArray})
            })
            axios.get(`pun/punto/byId/${puntoId}`)
            .then(res => {
                let {capacidad, direccion, observacion} = res.data.punto[0]
                this.setState({ capacidad, direccion, observacion })
            })

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////        SI SELECCIONA UNA REVISION POR DEFECTO LA SELECCIONA
        if(revisionId){
            axios.get(`rev/revision/byId/${revisionId}`)
            .then(res => {
                const {revision} = res.data
                console.log(revision)
                let tanqueIdArray = []
                revision.tanqueId.map(e=>{
                    tanqueIdArray.push(e._id)
                })
                
                this.setState({
                    /////// step 1
                    revisionId:    revision._id,
                    poblado:       revision.poblado,
 
                    
                    /////////  step 2
                    nControl         : revision.nControl         ?revision.nControl          :"",
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
                    direccion:                revision.puntoId             ?revision.puntoId.direccion                   :null,
                    puntoId:                  revision.puntoId             ?revision.puntoId._id                   :null,
                    zonaId:                   revision.zonaId              ?revision.zonaId._id                   :null,
                    
                    /////////  step 3
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
                    accesorios        : revision.accesorios        ?revision.accesorios        :false,
                    imgDepTecnico     : revision.depTecnico        ?revision.depTecnico        :[],
                    depTecnicoText    : revision.depTecnicoText    ?revision.depTecnicoText    :"",
                    depTecnicoEstado  : revision.depTecnicoEstado  ?revision.depTecnicoEstado  :"",  


                    /////////  step 4
                    imgIsometrico      : revision.isometrico      ?revision.isometrico     :[],
                    imgOtrosComodato   : revision.otrosComodato   ?revision.otrosComodato  :[],
                    imgSoporteEntrega  : revision.soporteEntrega  ?revision.soporteEntrega :[],
                    imgPuntoConsumo    : revision.puntoConsumo    ?revision.puntoConsumo   :[],
                    imgVisual          : revision.visual          ?revision.visual         :[],
                    
                    imgProtocoloLlenado: revision.protocoloLlenado ?revision.protocoloLlenado :[],
                    imgHojaSeguridad:    revision.hojaSeguridad    ?revision.hojaSeguridad :[],
                    imgNComodato    :    revision.nComodato        ?revision.nComodato     :[],
                    imgOtrosSi      :    revision.otrosSi          ?revision.otrosSi       :[],
                })
            })
        }
        
        Geolocation.getCurrentPosition(e=>{
     
			let lat = parseFloat(e.coords.latitude)
			let lng = parseFloat(e.coords.longitude)
            lat =  lat ?lat :4.597825;
            lng =  lng ?lng :-74.0755723;
 
            this.setState({lat, lng})
        }, (error)=>this.watchID = Geolocation.watchPosition(e=>{
 
            let lat =parseFloat(e.coords.latitude)
            let lng = parseFloat(e.coords.longitude)
            lat =  lat ?lat :4.597825;
            lng =  lng ?lng :-74.0755723;            
            this.setState({lat, lng})
        },
            (error) => console.log('error'),
            {enableHighAccuracy: true, timeout:5000, maximumAge:0})
        )
        this.buscarDepto()
    }
    filtroClientes(idCliente){
        axios.get(`users/clientes`)
        .then(res => { 
            if(res.data.status){
                let clientes1 = res.data.usuarios.map(e=>{
                    return {key:e._id, label:e.cedula ?e.razon_social+" | "+e.cedula+" | "+e.codt :e.razon_social, email:e.email, direccion_factura:e.direccion_factura, nombre:e.nombre, razon_social:e.razon_social, cedula:e.cedula, celular:e.celular, codt:e.codt }
                }) 
                let cliente = clientes1.filter(e=>{ return e.key==idCliente })
                this.setState({cliente:cliente[0].label, idCliente, cedulaCliente:cliente[0].cedula, codtCliente:cliente[0].codt, emailCliente:cliente[0].email, razon_socialCliente:cliente[0].razon_social, direccion_facturaCliente:cliente[0].direccion_factura, celularCliente:cliente[0].celular,nombreCliente:cliente[0].nombre, modalCliente:false})
            }
        })	
    }
    
    
    buscarTanque(id){
        let {tanqueArray, tanqueIdArray, usuarioId, puntoId} = this.state
        axios.get(`tan/tanque/byId/${id.key}`)
        .then(res=>{
            console.log(id)
            console.log(res.data)
            const {tanque} = res.data
            let infoTanque={
                _id:                tanque._id,
                placaText :         tanque.placaText ?tanque.placaText :"",
                barrio:             tanque.barrio    ?tanque.barrio    :"",
                capacidad:          tanque.capacidad ?tanque.capacidad :"",
            }
            if(tanqueIdArray.includes(tanque._id)){
                alert("Este tanque ya esta agregado")
            }else{
                Alert.alert(
                    `Asignar tanque`,
                    `Seguro desea agregar este tanque a este usuario?`,
                    [
                        {text: 'Confirmar', onPress: () => confirmar()},
                        {text: 'Cancelar', onPress: () => console.log("e")},
                    ],
                    {cancelable: false},
                )
                const confirmar = ()=>{
                    axios.get(`tan/tanque/asignarPunto/${id.key}/${usuarioId}/${puntoId}`)
                    .then(e => { 
                        console.log(e.data)
                        if(e.data.status){
                            tanqueArray.push(infoTanque)
                            tanqueIdArray.push(tanque._id)
                            this.setState({tanqueArray, tanqueIdArray, modalPlacas:false})
                        }
                    })
                }
                
            }
        })
    }
    alertaEliminarTanque(placaText, codt, razon_social){
        Alert.alert(
            `Vas a enviar una notificacion, para eliminar este tanque a este usuario`,
            `${placaText}`,
            [
                {text: 'Confirmar', onPress: () => confirmar()},
                {text: 'Cancelar', onPress: () => console.log("e")},
            ],
            {cancelable: false},
        )
        const confirmar = ()=>{
            axios.get(`tan/tanque/notificacionDesvincularUsuario/${placaText}/${codt}/${razon_social}`)
            .then(res => { 
                console.log(res.data)
                if(res.data.status){
                   alert("Notificacion enviada")
                }
            })
        }
    }
    // eliminarTanque(tanqueId, placaText){
    //     let {tanqueIdArray, tanqueArray} = this.state
    //     Alert.alert(
    //         `Seguro desea remover este tanque`,
    //         `${placaText}`,
    //         [
    //             {text: 'Confirmar', onPress: () => confirmar()},
    //             {text: 'Cancelar', onPress: () => console.log("e")},
    //         ],
    //         {cancelable: false},
    //     )
    //     const confirmar = ()=>{
    //         axios.get(`tan/tanque/desvincularUsuario/${tanqueId}`)
    //         .then(res => { 
    //             if(res.data.status){
    //                 tanqueArray= tanqueArray.filter(e=>{
    //                     return e._id!=tanqueId 
    //                 })
    //                 tanqueIdArray= tanqueIdArray.filter(e=>{
    //                     return e!=tanqueId 
    //                 })
    //                 console.log(tanqueArray, tanqueIdArray)
    //                 this.setState({tanqueArray, tanqueIdArray})
    //             }
    //         })
    //     }
    // }
    step1(){
        const {tanqueArray, modalPlacas, placas, placaText, puntoId, usuarioId} = this.state
        console.log({tanqueArray})
        return(
            <View>
                {/* PLACAS */}
                <ModalFilterPicker
					placeholderText="Placas ..."
					visible={modalPlacas}
					onSelect={(e)=>this.buscarTanque(e)}
					onCancel={()=>this.setState({modalPlacas:false})}
					crearTanque={(e)=>{this.props.navigation.navigate("nuevoTanque", {placaText:e, puntoId, usuarioId}), this.setState({modalPlacas:false}) }}
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
                                        <TouchableOpacity style={{width:"90%", alignItems:"center"}} onPress={()=>this.props.navigation.navigate("nuevoTanque", {tanqueId:e._id})}>
                                            <View style={style.subContenedorUsuario}>
                                                <Text style={style.row1}>Placa:</Text>
                                                <Text style={style.row2}>{e.placaText}</Text>
                                            </View>
                                            <View style={style.subContenedorUsuario}>
                                                <Text style={style.row1}>Capacidad:</Text>
                                                <Text style={style.row2}>{e.capacidad}</Text>
                                            </View>
                                            <View style={style.subContenedorUsuario}>
                                                <Text style={style.row1}>Propiedad:</Text>
                                                <Text style={style.row2}>{e.propiedad}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>e.usuarioId ?this.alertaEliminarTanque(e._id, e.placaText, e.usuarioId.codt, e.usuarioId.razon_social) :null}>
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
        console.log({capacidad})
        return(
            <View>
                 {/* SECTORES */}
                 <ModalFilterPicker
					placeholderText="Sectores ..."
					visible={modalSectores}
					onSelect={(e)=>this.setState({sector:e.key, modalSectores:false})}
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
                        keyboardType="numeric"
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
					onSelect={(e)=>this.setState({m3:e.key, modalM3:false})}
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
                 {/* <ModalFilterPicker
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
                </View> */}

                {/* UBICACIONES */}
                <ModalFilterPicker
					placeholderText="ubicaciones ..."
					visible={modalUbicacion}
					onSelect={(e)=>this.setState({ubicacion:e.key, modalUbicacion:false})}
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
        const {observaciones, avisos, extintores, distancias, electricas, accesorios, estado, solicitudServicio, imgAlerta, alertaText, alertaFecha, nActa, depTecnicoEstado, imgDepTecnico, depTecnicoText} = this.state
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
                        <View style={style.contenedorSetp2}>
                            <Text style={style.row1Step3}>Cumple accesorios y materiales</Text>
                            <Switch
                                trackColor={{ true: '#d60606', false: Platform.OS=='android'?'#d3d3d3':'#fbfbfb'  }}
                                thumbColor={[Platform.OS=='ios'?'#FFFFFF':(accesorios ?'#d60606':'#ffffff')]}
                                ios_backgroundColor="#fbfbfb"
                                style={[accesorios ?style.switchEnableBorder:style.switchDisableBorder]}
                                onValueChange = {(accesorios)=>this.setState({accesorios})}
                                value = {accesorios}
                            />
                        </View>
                    </>
                }
            </View>
        )
    }
      
    step4(){
        let {imgIsometrico, imgOtrosComodato,  imgSoporteEntrega, imgPuntoConsumo, imgVisual, imgProtocoloLlenado, imgHojaSeguridad, imgNComodato, imgOtrosSi} = this.state
        let {navigate} =this.props.navigation
        return(
            <View>
                {/* ISOMETRICO */}
                <TomarFoto 
                    source={imgIsometrico}
                    width={180}
                    titulo="Isometrico"
                    limiteImagenes={4}
                    imagenes={(imgIsometrico) => {  this.uploadImagen(imgIsometrico, 1) }}
                />
                <View style={style.separador}></View>
                {/* PLACA */}
                <TomarFoto 
                    source={imgOtrosComodato}
                    width={180}
                    titulo="Otros Comodatos"
                    limiteImagenes={4}
                    imagenes={(imgOtrosComodato) => {  this.uploadImagen(imgOtrosComodato, 2) }}
                />  
                <View style={style.separador}></View>
                {/* PLACA */}
                <TomarFoto 
                    source={imgSoporteEntrega}
                    width={180}
                    titulo="Soporte de entrega"
                    limiteImagenes={4}
                    imagenes={(imgSoporteEntrega) => {  this.uploadImagen(imgSoporteEntrega, 3) }}
                /> 
                <View style={style.separador}></View>
                {/* PLACA */}
                <TomarFoto 
                    source={imgPuntoConsumo}
                    width={180}
                    titulo="Visual gasoequipos"
                    limiteImagenes={4}
                    imagenes={(imgPuntoConsumo) => {  this.uploadImagen(imgPuntoConsumo, 4) }}
                /> 
                <View style={style.separador}></View>
                
                {/* PLACA */}
                <TomarFoto 
                    source={imgVisual}
                    width={180}
                    titulo="Visual instalación"
                    limiteImagenes={4}
                    imagenes={(imgVisual) => {  this.uploadImagen(imgVisual, 5) }}
                /> 
                <View style={style.separador}></View>
                
                {/* NO COMODATO */}
                <SubirDocumento 
                    navigate={navigate}
                    source={imgProtocoloLlenado}
                    width={180}
                    titulo="Protocolo de llenado"
                    limiteImagenes={4}
                    imagenes={(imgProtocoloLlenado) => {  this.uploadPdf(imgProtocoloLlenado, 1) }}
                />
                <View style={style.separador}></View>
                
                {/* NO COMODATO */}
                <SubirDocumento 
                    navigate={navigate}
                    source={imgHojaSeguridad}
                    width={180}
                    titulo="Hoja de seguridad"
                    limiteImagenes={4}
                    imagenes={(imgHojaSeguridad) => {  this.uploadPdf(imgHojaSeguridad, 2) }}
                />
                <View style={style.separador}></View>
                
                {/* NO COMODATO */}
                <SubirDocumento 
                    navigate={navigate}
                    source={imgNComodato}
                    width={180}
                    titulo="Doc. de comodato"
                    limiteImagenes={4}
                    imagenes={(imgNComodato) => {  this.uploadPdf(imgNComodato, 3) }}
                />
                <View style={style.separador}></View>
                
                {/* OTROS SI */}
                <SubirDocumento 
                    navigate={navigate}
                    source={imgOtrosSi}
                    width={180}
                    titulo="Otros si"
                    limiteImagenes={4}
                    imagenes={(imgOtrosSi) => {  this.uploadPdf(imgOtrosSi, 4) }}
                />
            </View>
        )
    }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 4, IMAGENES Y DOCUMENTOS 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    uploadImagen(imagen, tipo){
        let {imgIsometrico, imgOtrosComodato,  imgSoporteEntrega, imgPuntoConsumo, imgVisual, revisionId} = this.state

        let data = new FormData();
        let isometrico = imgIsometrico.filter(e=>{
            return !e.uri
        })
        imgIsometrico = imgIsometrico.filter(e=>{
            return e.uri
        })
        let otrosComodato = imgOtrosComodato.filter(e=>{
            return !e.uri
        })
        imgOtrosComodato = imgOtrosComodato.filter(e=>{
            return e.uri
        })
        let soporteEntrega = imgSoporteEntrega.filter(e=>{
            return !e.uri
        })
        imgSoporteEntrega = imgSoporteEntrega.filter(e=>{
            return e.uri
        })
        let puntoConsumo = imgPuntoConsumo.filter(e=>{
            return !e.uri
        })
        imgPuntoConsumo = imgPuntoConsumo.filter(e=>{
            return e.uri
        })
        let visual = imgVisual.filter(e=>{
            return !e.uri
        })
        imgVisual = imgVisual.filter(e=>{
            return e.uri
        })
        tipo === 1
        ?imagen.forEach(e=>{
            data.append('imgIsometrico', e);
        })
        :tipo === 2
        ?imagen.forEach(e=>{
            data.append('imgOtrosComodato', e);
        })
        :tipo === 3
        ?imagen.forEach(e=>{
            data.append('imgSoporteEntrega', e);
        })
        :tipo === 4
        ?imagen.forEach(e=>{
            data.append('imgPuntoConsumo', e);
        })
        :imagen.forEach(e=>{
            data.append('imgVisual', e);
        })
        console.log({imgIsometrico, imgOtrosComodato, imgSoporteEntrega, imgPuntoConsumo, imgVisual, revisionId})
        
        data.append('isometrico',JSON.stringify(isometrico));
        data.append('otrosComodato',JSON.stringify(otrosComodato));
        data.append('soporteEntrega',JSON.stringify(soporteEntrega));
        data.append('puntoConsumo',JSON.stringify(puntoConsumo));
        data.append('visual',JSON.stringify(visual));
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
            alert("Error al subir la imagen")
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           SUBE LOS PDF
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    uploadPdf(pdf, tipo){
        this.setState({loading:true})
        let {revisionId, imgProtocoloLlenado, imgHojaSeguridad, imgNComodato, imgOtrosSi} = this.state
        let data = new FormData();
        let protocoloLlenado = imgProtocoloLlenado.filter(e=>{
            return !e.uri
        })
        imgProtocoloLlenado = imgProtocoloLlenado.filter(e=>{
            return e.uri
        })
        let hojaSeguridad = imgHojaSeguridad.filter(e=>{
            return !e.uri
        })
        imgHojaSeguridad = imgHojaSeguridad.filter(e=>{
            return e.uri
        })
        let nComodato = imgNComodato.filter(e=>{
            return !e.uri
        })
        imgNComodato = imgNComodato.filter(e=>{
            return e.uri
        })
        let otrosSi = imgOtrosSi.filter(e=>{
            return !e.uri
        })
        imgOtrosSi = imgOtrosSi.filter(e=>{
            return e.uri
        })
        tipo === 1
        ?pdf.forEach(e=>{
            data.append('imgProtocoloLlenado', e);
        })
        :tipo === 2
        ?pdf.forEach(e=>{
            data.append('imgHojaSeguridad', e);
        })
        :tipo === 3
        ?pdf.forEach(e=>{
            data.append('imgNComodato', e);
        })
        :pdf.forEach(e=>{
            data.append('imgOtrosSi', e);
        })
        data.append('protocoloLlenado',JSON.stringify(protocoloLlenado));
        data.append('hojaSeguridad',   JSON.stringify(hojaSeguridad));
        data.append('nComodato',       JSON.stringify(nComodato));
        data.append('otrosSi',         JSON.stringify(otrosSi));
        console.log({imgNComodato, imgHojaSeguridad, imgProtocoloLlenado, imgOtrosSi})
        axios({ method: 'put',    url: `rev/revision/uploadPdf/${revisionId}`, data: data })
        .then((res)=>{
            if(res.data.status){
                this.setState({loading:false})
            }
        })
        .catch(err=>{
            this.setState({loading:false})
            alert("No pudimos subir el archivo")
        })
    }
    buscarDepto(){
        axios.get(`https://appcodegas.com/public/poblado/departamentos.json`)
        .then(res=>{
            let dptos = res.data
            dptos = dptos.map(e=>{
                return{
                    key:e.name,
                    label:e.name
                }
            }) 
            this.setState({dptos})
        })
    }
    buscarCiudad(ciudad){
        axios.get(`https://appcodegas.com/public/poblado/ciudades.json`)
        .then(res=>{
            console.log({ciudad})
            console.log(res.data)
            let ciudades = res.data
            ciudades = ciudades.filter(e=>{
                return ciudad===e.dpto
            })
            ciudades = ciudades.map(e=>{
                return{
                    key:e.ciudad,
                    label:e.ciudad
                }
            })
            this.setState({dpto:ciudad, ciudades, modalDpto:false})
        })
        
    }
    buscarPoblado(ciudad){
        axios.get(`https://appcodegas.com/public/poblado/poblado.json`)
        .then(res=>{
            console.log(res.data)
            let poblados = res.data
            poblados = poblados.filter(e=>{
                return ciudad===e.ciudad
            })
            poblados = poblados.map(e=>{
                return{
                    key:e.codigo,
                    label:e.poblado
                }
            })
            this.setState({ciudad:ciudad, poblados, modalCiudad:false})
        })
    }
    

    step5(){
        let {lat, lng, accesoPerfil, modalDpto, dpto, dptos, modalCiudad, ciudades, ciudad, modalPoblado, poblados, poblado }= this.state
        console.log({modalDpto, accesoPerfil})
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
                {/* DEPARTAMENTOS */}
                <ModalFilterPicker
					placeholderText="Dpto ..."
					visible={modalDpto}
					onSelect={(e)=>this.buscarCiudad(e.key)}
					onCancel={()=>this.setState({modalDpto:false})}
                    options={dptos}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Dpto</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalDpto:true})}>
                        <Text style={dpto ?style.textBtnActive :style.textBtn}>{dpto ?dpto :"Dpto"}</Text>
                    </TouchableOpacity>
                </View>

                {/* CIUDADES */}
                <ModalFilterPicker
					placeholderText="ciudad ..."
					visible={modalCiudad}
					onSelect={(e)=>this.buscarPoblado(e.key)}
					onCancel={()=>this.setState({modalCiudad:false})}
                    options={ciudades}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>ciudad</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalCiudad:true})}>
                        <Text style={ciudad ?style.textBtnActive :style.textBtn}>{ciudad ?ciudad :"ciudad"}</Text>
                    </TouchableOpacity>
                </View>

                {/* POBLADOS */}
                <ModalFilterPicker
					placeholderText="Poblado ..."
					visible={modalPoblado}
					onSelect={(e)=>this.setState({poblado:e.key, modalPoblado:false})}
					onCancel={()=>this.setState({modalPoblado:false})}
                    options={poblados}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Poblado</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalPoblado:true})}>
                        <Text style={poblado ?style.textBtnActive :style.textBtn}>{poblado ?poblado :"Poblado"}</Text>
                    </TouchableOpacity>
                </View>

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
        const {solicitudServicio, revisionId, nControl, codtCliente, direccion, razon_socialCliente} = this.state
        axios.post(`rev/revision/solicitudServicio/${revisionId}`, {solicitudServicio, nControl, codtCliente, direccion, razon_socialCliente})
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
                <ProgressStep label="Información" nextBtnText="Siguiente"   previousBtnText="Anterior"  onNext={()=>this.editarStep2()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step2()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Instalación" nextBtnText="Siguiente"  previousBtnText="Anterior"  onNext={()=>this.editarStep3()}>
                    <View style={{ alignItems: 'center' }}>
                        {modalAlerta &&this.modalAlerta()}
                        {this.step3()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Doc. adicionales" nextBtnText="Siguiente"  previousBtnText="Anterior">
                    <View style={{ alignItems: 'center' }}>
                        {this.step4()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Coordenadas" finishBtnText="Guardar" previousBtnText="Anterior" onSubmit={()=>this.editarStep5()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step5()}
                    </View>
                </ProgressStep>
                 
            </ProgressSteps>
        )
    }

	render(){
        const {navigation} = this.props
        console.log({placaText:this.state.placaText})
        return (
            <>
                <View style={style.container}>
                    {this.renderSteps()}
                    {
                        this.state.loading
                        &&<View style={style.loadingContain}>
                            <ActivityIndicator color="#00218b" size={'large'} />
                        </View>
                    }
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
        const {tanqueIdArray, tanqueArray} = this.state
        console.log({tanqueIdArray})
        axios.post(`rev/revision/`, {tanqueId:tanqueIdArray})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                this.setState({revisionId:res.data.revision._id, nControl:res.data.revision.nControl})
                let totalCapacidad = []
                tanqueArray.map(e=>{
                    e.capacidad = e.capacidad.replace( /^\D+/g, ''); 
                    e.capacidad = parseInt(e.capacidad)
                    totalCapacidad.push(e.capacidad)
                })
                totalCapacidad = totalCapacidad.reduce((a, b) => a + b)

           
                this.setState({capacidad:totalCapacidad})

            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 1
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep1(){
        const {sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion, tanqueArray} = this.state
        console.log({tanqueArray})
        axios.put(`rev/revision/${revisionId}`, {tanqueId:tanqueIdArray, sector, barrio, usuariosAtendidos, m3, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion})
        .then((res)=>{
            if(res.data.status){
                let totalCapacidad = []
                tanqueArray.map(e=>{
                    e.capacidad = e.capacidad.replace( /^\D+/g, ''); 
                    e.capacidad = parseInt(e.capacidad)
                    totalCapacidad.push(e.capacidad)
                })
                totalCapacidad = totalCapacidad.reduce((a, b) => a + b)

                console.log({totalCapacidad})
                this.setState({capacidad:totalCapacidad})
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 2
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep2(){
        const {zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, nComodatoText, nMedidorText, ubicacion, capacidad} = this.state
        console.log({capacidad, zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, nComodatoText, nMedidorText, ubicacion})
        axios.put(`rev/revision/${revisionId}`, {sector, barrio, usuariosAtendidos, m3, tanqueId:tanqueIdArray, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                axios.put(`pun/punto/editaAlmacenamiento/${puntoId}/${capacidad}`)
                .then((res)=>{
                    console.log(res.data)
                })
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 3
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep3(){
        const {observaciones, avisos, extintores, distancias, electricas, accesorios, revisionId} = this.state
        console.log({observaciones, avisos, extintores, distancias, electricas, accesorios})
        let data = new FormData();
        
        data.append('observaciones',  observaciones);
        data.append('avisos', avisos);
        data.append('extintores',   extintores);
        data.append('distancias',   distancias);
        data.append('electricas',   electricas);
        data.append('accesorios',   accesorios);
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
    ////////////////////////           EDITA EL STEP 5
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep5(){
        let {lat, lng, revisionId, poblado} = this.state
        lat =  lat ?lat :4.597825;
        lng =  lng ?lng :-74.0755723;
        console.log({lat, lng, poblado})
        
        axios.put(`rev/revision/coordenadas/${revisionId}`, {lat, lng, poblado})
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
