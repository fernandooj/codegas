import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
import ModalFilterPicker               from 'react-native-modal-filter-picker'
 
import DatePicker 			           from 'react-native-datepicker'
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
let zonas       = [{key:"Urbana", label:"Urbana"},{key:"Rural", label:"Rural"},{key:"Zona Industrial", label:"Zona Industrial"}]
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
            clientes:[],
            puntos:[],
            placas:[],
            imgNMedidor:[],
            imgNComodato:[],
            imgOtrosSi:[],
            imgRetiroTanques:[],
            tanqueArray:[],
            tanqueIdArray:[],
            x: {
				latitude: 4.597825,
				longitude: -74.0755723,
				latitudeDelta: 0.046002887451081165,
				longitudeDelta: 0.05649235099555483,
		    },
	    }
    }
    async componentWillMount(){
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
            
            this.setState({revisionId})
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
                        propiedad         : revision.propiedad           ?revision.propiedad            :"",
                        lote              : revision.lote                ?revision.lote                 :"",
                        nMedidorText      : revision.nMedidorText        ?revision.nMedidorText         :"",

                        /////////  step 3
                        imgNMedidor     : revision.nMedidor      ?revision.nMedidor      :[],
                        imgNComodato    : revision.nComodato     ?revision.nComodato     :[],
                        imgOtrosSi      : revision.otrosSi       ?revision.otrosSi       :[],
                        imgRetiroTanques: revision.retiroTanques ?revision.retiroTanques :[],
                       
                        
                        
                        /////////  step 4
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
                    })
                })

            }
        
        navigator.geolocation.getCurrentPosition(e=>{
			let lat = parseFloat(e.coords.latitude)
			let lng = parseFloat(e.coords.longitude)
			let latitude =  lat ?lat :4.597825;
			let longitude = lng ?lng :-74.0755723;
			let x = {
				latitude:latitude,
				longitude:longitude,
				latitudeDelta:0.15,
				longitudeDelta:0.15
            }
        console.log({x})
        this.setState({x})
        }, (error)=>this.watchID = navigator.geolocation.watchPosition(e=>{
            let lat =parseFloat(e.coords.latitude)
            let lng = parseFloat(e.coords.longitude)
            let latitude =  lat ?lat :4.597825;
            let longitude =  lng ?lng :-74.0755723;
            let x = {
                latitude:latitude,
                longitude:longitude,
                latitudeDelta:0.15,
                longitudeDelta:0.15
        }
        console.log({x})
        this.setState({x})
       
            },
            (error) => console.log('error'),
            {enableHighAccuracy: true, timeout:5000, maximumAge:0})
        )
    }
    getClientes(){
        axios.get(`users/clientes`)
        .then(res => {
            console.log(res.data.usuarios)
            if(res.data.status){
                let clientes = res.data.usuarios.map(e=>{
                    return {key:e._id, label:e.cedula ?e.razon_social+" | "+e.cedula+" | "+e.codt :e.razon_social, email:e.email, direccion_factura:e.direccion_factura, nombre:e.nombre, razon_social:e.razon_social, cedula:e.cedula, celular:e.celular }
                }) 
                this.setState({clientes, modalCliente:true, puntoId:undefined})
            }
        })
    }
    
    

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
                tanqueArray.push(infoTanque)
                tanqueIdArray.push(tanque._id)
                console.log(tanqueIdArray)
                this.setState({tanqueArray, tanqueIdArray, modalPlacas:false})
            })
        }
    eliminarTanque(tanqueId){
        let {tanqueIdArray, tanqueArray} = this.state
        tanqueArray= tanqueArray.filter(e=>{
            return e.tanqueId!=tanqueId 
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
					crearPlaca={(e)=>this.setState({placaText:e, crearPlaca:true, modalPlacas:false})}
                    options={placas}
                    placa
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
                                        <TouchableOpacity onPress={()=>this.eliminarTanque(e.tanqueId)}>
                                            <Icon name="trash" style={style.iconTrash} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )
                        })
                    }
                
                {/* {
                    tanqueId
                    &&<View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Placa:</Text>
                            <Text style={style.row2}>{placaText}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Capacidad:</Text>
                            <Text style={style.row2}>{capacidad}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Fabricante:</Text>
                            <Text style={style.row2}>{fabricante}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Ultima Revision Parcial:</Text>
                            <Text style={style.row2}>{ultimaRevisionPar}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Ultima Revisión:</Text>
                            <Text style={style.row2}>{fechaUltimaRev}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Propiedad:</Text>
                            <Text style={style.row2}>{propiedad}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Ubicacion:</Text>
                            <Text style={style.row2}>{ubicacion}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Codigo Activo:</Text>
                            <Text style={style.row2}>{codigoActivo}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Serie:</Text>
                            <Text style={style.row2}>{serie}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Año Fabricación:</Text>
                            <Text style={style.row2}>{anoFabricacion}</Text>
                        </View>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Lote:</Text>
                            <Text style={style.row2}>{lote}</Text>
                        </View>
                    </View>
                }  */}
            </View>
        )
    }

    step2(){
        const {modalSectores, sector, barrio, usuariosAtendidos, modalM3, m3, usuarioId, modalCliente, clientes, cedulaCliente, razon_socialCliente, celularCliente, emailCliente, nombreCliente, direccion_facturaCliente, puntos, puntoId, modalPropiedad, propiedad, lote, nMedidorText} = this.state
      
        return(
            <View>
                {/* CODIGO INTERNO */}
                {/* <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Cod Interno</Text>
                    <TextInput
                        placeholder="Codigo Interno"
                        style={style.inputStep2}
                        value={codigoInterno}
                        onChangeText={(codigoInterno)=> this.setState({ codigoInterno })}
                    />
                </View> */}

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

                {/* LOTE */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Lote</Text>
                    <TextInput
                        placeholder="Lote"
                        value={lote}
                        style={style.inputStep2}
                        onChangeText={(lote)=> this.setState({ lote })}
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
                <TouchableOpacity style={style.nuevaFrecuencia} onPress={()=>this.getClientes()}>
                    <Icon name="plus" style={style.iconFrecuencia} />
                    <Text style={style.textGuardar}>Asignar Cliente</Text>
                </TouchableOpacity>
                {
                    usuarioId
                    &&<View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Identificación:</Text>
                            <Text style={style.row2}>{cedulaCliente}</Text>
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
                {
                     puntos.length>1
                     ?<View>
                     <Text style={style.textZona}>Punto de entrega</Text>
                         {
                             puntos.map((e, key)=>{
                                 return (
                                     <TouchableOpacity key={key} style={puntoId==e._id ?style.btnZonaActiva :style.btnZona} onPress={()=>this.setState({puntoId:e._id, zonaId:e.idZona})}>
                                         <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                                         <View>
                                             <Text style={style.textZona}>{e.direccion}</Text>   
                                             <Text style={style.textZona}>Almacenamiento: {e.capacidad}</Text>
                                         </View>
                                        
                                     </TouchableOpacity>
                                 )
                             })
                         }
                     </View>
                     :puntos.map((e, key)=>{
                         return (
                             <View key={key} style={style.btnZonaActiva} >
                                <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                                <View>
                                    <Text style={style.textZona}>{e.direccion}</Text>
                                    <Text style={style.textZona}>Almacenamiento: {e.capacidad}</Text>
                                </View>
                             </View>    
                         )
                     })
                }

            </View>
        )
    }

     
    step3(){
        let {imgNMedidor, imgNComodato, imgOtrosSi, imgRetiroTanques} = this.state
        
        return(
            <View>
                {/* PLACA */}
                <TomarFoto 
                    source={imgNMedidor}
                    width={180}
                    titulo="Medidor"
                    limiteImagenes={4}
                    imagenes={(imgNMedidor) => {  this.setState({imgNMedidor}) }}
                />
                {/* PLACA */}
                <TomarFoto 
                    source={imgRetiroTanques}
                    width={180}
                    titulo="Retiro de tanques"
                    limiteImagenes={4}
                    imagenes={(imgRetiroTanques) => {  this.setState({imgRetiroTanques}) }}
                /> 
                <SubirDocumento 
                    source={imgNComodato}
                    width={180}
                    titulo="N. Comodato"
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
    step4(){
        const {usuarioId, modalCliente, clientes, cedulaCliente, razon_socialCliente, celularCliente, emailCliente, nombreCliente, direccion_facturaCliente, puntos, puntoId} = this.state
        return(
            <View>
                <ModalFilterPicker
					placeholderText="Filtrar ..."
					visible={modalCliente}
					onSelect={(e)=>this.filtroClientes(e)}
					onCancel={()=>this.setState({modalCliente:false})}
                    options={clientes}
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <TouchableOpacity style={style.nuevaFrecuencia} onPress={()=>this.getClientes()}>
                    <Icon name="plus" style={style.iconFrecuencia} />
                    <Text style={style.textGuardar}>Asignar Cliente</Text>
                </TouchableOpacity>
                {
                    usuarioId
                    &&<View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>Identificación:</Text>
                            <Text style={style.row2}>{cedulaCliente}</Text>
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
                {
                     puntos.length>1
                     ?<View>
                     <Text style={style.textZona}>Punto de entrega</Text>
                         {
                             puntos.map((e, key)=>{
                                 return (
                                     <TouchableOpacity key={key} style={puntoId==e._id ?style.btnZonaActiva :style.btnZona} onPress={()=>this.setState({puntoId:e._id, zonaId:e.idZona})}>
                                         <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                                         <View>
                                             <Text style={style.textZona}>{e.direccion}</Text>   
                                             <Text style={style.textZona}>Almacenamiento: {e.capacidad}</Text>
                                         </View>
                                        
                                     </TouchableOpacity>
                                 )
                             })
                         }
                     </View>
                     :puntos.map((e, key)=>{
                         return (
                             <View key={key} style={style.btnZonaActiva} >
                                <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                                <View>
                                    <Text style={style.textZona}>{e.direccion}</Text>
                                    <Text style={style.textZona}>Almacenamiento: {e.capacidad}</Text>
                                </View>
                             </View>    
                         )
                     })
                }
            </View>
        )
    }

    step5(){
        let {x}= this.state
        return(
            <View>
                <Text>Lat: {x.latitude}</Text>
                <Text>Lng: {x.longitude}</Text>
                <Text></Text>
            </View>
        )
    }

    renderSteps(){
        let {tanqueIdArray, revisionId} = this.state
       
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
                <ProgressStep label="Imagenes" nextBtnText="Siguiente"  onNext={()=>this.editarStep3()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step3()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Usuario" nextBtnText="Siguiente"  onNext={()=>this.editarStep4()}>
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
     
    filtroClientes(idCliente){
		let cliente = this.state.clientes.filter(e=>{ return e.key==idCliente })
        this.setState({cliente:cliente[0].label, idCliente, cedulaCliente:cliente[0].cedula, emailCliente:cliente[0].email, razon_socialCliente:cliente[0].razon_social, direccion_facturaCliente:cliente[0].direccion_factura, celularCliente:cliente[0].celular,nombreCliente:cliente[0].nombre, modalCliente:false})
        axios.get(`pun/punto/byCliente/${idCliente}`)
        .then(e=>{
            if(e.data.status){
                e.data.puntos.length==1 ?this.setState({puntos:e.data.puntos, puntoId:e.data.puntos[0]._id, zonaId:e.data.puntos[0].idZona, usuarioId:idCliente}) :this.setState({puntos:e.data.puntos, usuarioId:idCliente })
            }else{
                Toast.show("Tuvimos un problema, intentele mas tarde")
            }
        })
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
        const {sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, zonaId, usuarioId, puntoId, propiedad, lote, nMedidorText} = this.state
        console.log({puntoId})
        axios.put(`rev/revision/${revisionId}`, {tanqueId:tanqueIdArray, sector, barrio, usuariosAtendidos, m3, zonaId, usuarioId, puntoId, propiedad, lote, nMedidorText})
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
        const {zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, propiedad, lote, nMedidorText} = this.state
        console.log({zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, propiedad, lote, nMedidorText})
        axios.put(`rev/revision/${revisionId}`, {sector, barrio, usuariosAtendidos, m3, tanqueId:tanqueIdArray, zonaId, usuarioId, puntoId, propiedad, lote, nMedidorText})
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
    ////////////////////////           EDITA EL STEP 3, IMAGENES Y DOCUMENTOS 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep3(){
        let {imgNMedidor, imgNComodato, imgOtrosSi, imgRetiroTanques, revisionId} = this.state
        console.log({imgNMedidor, imgNComodato, imgOtrosSi, imgRetiroTanques, revisionId})
        let data = new FormData();
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
        data.append('imgNMedidor',  imgNMedidor);
        data.append('imgNComodato', imgNComodato);
        data.append('imgOtrosSi',   imgOtrosSi);
        data.append('imgRetiroTanques',   imgRetiroTanques);
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
    ////////////////////////           EDITA EL STEP 4
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep4(){
        // const {sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray} = this.state
        // console.log({zonaId, usuarioId, puntoId})
        // axios.put(`rev/revision/${revisionId}`, {zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, tanqueId:tanqueIdArray })
        // .then((res)=>{
        //     console.log(res.data)
        //     if(res.data.status){
                 
        //     }else{
        //         Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
        //     }
        // })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 5
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep5(){
        const {x, revisionId} = this.state
        console.log({x})
        let lat=x.latitude
        let lng=x.longitude
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
