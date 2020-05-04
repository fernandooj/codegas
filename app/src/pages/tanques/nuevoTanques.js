import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, TextInput, Modal, ScrollView, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
import ModalFilterPicker               from 'react-native-modal-filter-picker'
import ModalSelector                   from 'react-native-modal-selector'
import DatePicker 			           from 'react-native-datepicker'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';  
import axios                           from 'axios';
import Icon                            from 'react-native-fa-icons';
import SubirDocumento                  from "../components/subirDocumento";
import TomarFoto                       from "../components/tomarFoto";
import { connect }                     from "react-redux";
import {getUsuariosAcceso}             from '../../redux/actions/usuarioActions'
import {getVehiculos}                  from '../../redux/actions/vehiculoActions'
import Footer                          from '../components/footer'
import {style}                         from './style'
 

let sectores    = [{key:"E2", label:"E2"},{key:"E3", label:"E3"},{key:"E4", label:"E4"},{key:"E5", label:"E5"},{key:"E6", label:"E6"},{key:"O", label:"O"},{key:"C", label:"C"},{key:"I", label:"I"},{key:"OT", label:"OT"}]
let zonas       = [{key:"Urbana", label:"Urbana"},{key:"Rural", label:"Rural"},{key:"Zona Industrial", label:"Zona Industrial"}]

let ubicaciones = [{key:"Azotea", label:"Azotea"},{key:"Enterrado", label:"Enterrado"},{key:"Piso", label:"Piso"}]

let capacidades = [{key:"TK 50", label:"TK 50"},{key:"TK 120", label:"TK 120"},{key:"TK 250", label:"TK 250"},{key:"TK 300", label:"TK 300"},{key:"TK 500", label:"TK 500"},{key:"TK 1000", label:"TK 1000"},{key:"TK 2000", label:"TK 2000"},{key:"TK 3000", label:"TK 3000"},{key:"TK 5000", label:"TK 5000"},{key:"TK 10000", label:"TK 10000"}]
let anosFabricacion = []
let existeTanques   = [{key:"Si", label:"Si"},{key:"No", label:"No"}]
 
//// devuelve el listado de años para el tanque
for (var index = 1950; index < 2021; index++) {
    anosFabricacion.push({key:index, label:index })
}

//// convertir en mayusculas las primera letra al crear el tanque
const capitalizeFirstLetter =(string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
            imgPlaca:[],
            imgVisual:[],
            imgPlacaFabricante:[],
            imgPlacaMantenimiento:[],
            imgDossier:[],
            imgCerFabricante:[],
            imgCerOnac:[],
            x: {
				latitude: 4.597825,
				longitude: -74.0755723,
				latitudeDelta: 0.046002887451081165,
				longitudeDelta: 0.05649235099555483,
		    },
	    }
    }
    async componentWillMount(){
        try{
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
 
            
            let tanqueId = this.props.navigation.state.params ?this.props.navigation.state.params.tanqueId :null
            console.log({tanqueId})
            this.setState({tanqueId})
            if(tanqueId){
                axios.get(`tan/tanque/byId/${tanqueId}`)
                .then(res => {
                    console.log(res.data)
                    const {tanque} = res.data
                    this.setState({
                        /////// step 1
                        tanqueId:  tanque._id,
                        placaText :             tanque.placaText         ?tanque.placaText          :"",
                        capacidad:              tanque.capacidad         ?tanque.capacidad          :"",
                        fabricante:             tanque.fabricante        ?tanque.fabricante         :"",
                        ultimaRevisionPar:      tanque.ultimaRevisionPar ?tanque.ultimaRevisionPar  :"",
                        fechaUltimaRev:         tanque.fechaUltimaRev    ?tanque.fechaUltimaRev     :"",
                        
                        nPlaca:                 tanque.nPlaca            ?tanque.nPlaca             :"",
                        codigoActivo:           tanque.codigoActivo      ?tanque.codigoActivo       :"",
                        serie:                  tanque.serie             ?tanque.serie              :"",
                        anoFabricacion:         tanque.anoFabricacion    ?tanque.anoFabricacion     :"",
                        existeTanque:           tanque.existeTanque      ?tanque.existeTanque       :"",

                        
                        //////  step 2
                        imgPlaca:              tanque.placa              ?tanque.placa               :[],
                        imgPlacaFabricante:    tanque.placaFabricante    ?tanque.placaFabricante     :[],
                        imgPlacaMantenimiento: tanque.placaMantenimiento ?tanque.placaMantenimiento  :[],
                        imgVisual:             tanque.visual             ?tanque.visual              :[],
                        imgDossier:            tanque.dossier            ?tanque.dossier             :[],
                        imgCerFabricante:      tanque.cerFabricante      ?tanque.cerFabricante       :[],
                        imgCerOnac:            tanque.cerOnac            ?tanque.cerOnac             :[],
                        
    
                        //////  step 3
                        usuarioId:                tanque.usuarioId           ?tanque.usuarioId._id                 :null,
                        cedulaCliente:            tanque.usuarioId           ?tanque.usuarioId.razon_social        :"",
                        razon_socialCliente:      tanque.usuarioId           ?tanque.usuarioId.cedula              :"",
                        direccion_facturaCliente: tanque.usuarioId           ?tanque.usuarioId.direccion_factura   :"",
                        nombreCliente:            tanque.usuarioId           ?tanque.usuarioId.nombre              :"",
                        celularCliente :          tanque.usuarioId           ?tanque.usuarioId.celular             :"",
                        emailCliente:             tanque.usuarioId           ?tanque.usuarioId.email               :"",
                        puntos:                   tanque.puntoId             ?[tanque.puntoId]                     :[],
                        puntoId:                  tanque.puntoId             ?tanque.puntoId._id                   :null,
                        zonaId:                   tanque.zonaId               ?tanque.zonaId._id                    :null,
                        modalPlacas:false    
                    })
                })

            }
        }catch(e){
            console.log(e)
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
        console.log({id})
        axios.get(`tan/tanque/byId/${id}`)
            .then(res=>{
                console.log(res.data)
                const {tanque} = res.data
                this.setState({
                    /////// step 1
                    tanqueId:  tanque._id,
                    placaText :             tanque.placaText         ?tanque.placaText          :"",
                    capacidad:              tanque.capacidad         ?tanque.capacidad          :"",
                    fabricante:             tanque.fabricante        ?tanque.fabricante         :"",
                    ultimaRevisionPar:      tanque.ultimaRevisionPar ?tanque.ultimaRevisionPar  :"",
                    fechaUltimaRev:         tanque.fechaUltimaRev    ?tanque.fechaUltimaRev     :"",
              
                    nPlaca:                 tanque.nPlaca            ?tanque.nPlaca          :"",
                    codigoActivo:           tanque.codigoActivo      ?tanque.codigoActivo       :"",
                    serie:                  tanque.serie             ?tanque.serie              :"",
                    anoFabricacion:         tanque.anoFabricacion    ?tanque.anoFabricacion     :"",
                 

                    //////  step 2
                    imgPlaca:                 tanque.placa              ?tanque.placa           :[],
                    imgPlacaFabricante:       tanque.placaFabricante    ?tanque.placaFabricante          :[],
                    imgPlacaMantenimiento:    tanque.placaMantenimiento ?tanque.placaMantenimiento     :[],
                    

                    //////  step 3
                    usuarioId:                tanque.usuarioId           ?tanque.usuarioId._id                 :null,
                    cedulaCliente:            tanque.usuarioId           ?tanque.usuarioId.razon_social        :"",
                    razon_socialCliente:      tanque.usuarioId           ?tanque.usuarioId.cedula              :"",
                    direccion_facturaCliente: tanque.usuarioId           ?tanque.usuarioId.direccion_factura   :"",
                    nombreCliente:            tanque.usuarioId           ?tanque.usuarioId.nombre              :"",
                    celularCliente :          tanque.usuarioId           ?tanque.usuarioId.celular             :"",
                    emailCliente:             tanque.usuarioId           ?tanque.usuarioId.email               :"",
                    puntos:                   tanque.puntoId             ?[tanque.puntoId]                     :[],
                    puntoId:                  tanque.puntboId            ?tanque.puntoId._id                   :[],
                    zonaId:                   tanque.zonaId               ?tanque.zonaId._id                   :null,
                    modalPlacas:false    
                })
                
            })
    }
    step1(){
        const {modalPlacas, placas, placaText, modalCapacidad, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, existeTanque, nPlaca, serie, anoFabricacion} = this.state
         
        return(
            <View>
                {/* PLACAS */}
                <ModalFilterPicker
					placeholderText="Placas ..."
					visible={modalPlacas}
					onSelect={(e)=>this.buscarTanque(e)}
					onCancel={()=>this.setState({modalPlacas:false})}
					crearPlaca={(e)=>this.setState({placaText:capitalizeFirstLetter(e), crearPlaca:true, modalPlacas:false})}
                    options={placas}
                    tanque
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Codigo Activo</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalPlacas:true})}>
                        <Text style={placaText ?style.textBtnActive :style.textBtn}>{placaText ?placaText :"Placas"}</Text>
                    </TouchableOpacity>
                </View>

                 {/* CAPACIDAD */}
                 <ModalFilterPicker
					placeholderText="Capacidad ..."
					visible={modalCapacidad}
					onSelect={(e)=>this.setState({capacidad:e, modalCapacidad:false})}
					onCancel={()=>this.setState({modalCapacidad:false})}
					 
                    options={capacidades}
                    
                    cancelButtonText="CANCELAR"
                    optionTextStyle={style.filterText}
                />
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Capacidad</Text>
                    <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalCapacidad:true})}>
                        <Text style={capacidad ?style.textBtnActive :style.textBtn}>{capacidad ?capacidad :"Capacidad"}</Text>
                    </TouchableOpacity>
                </View>

                {/* FABRICANTE */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Fabricante</Text>
                    <TextInput
                        placeholder="Fabricante"
                        style={style.inputStep2}
                        value={fabricante}
                        onChangeText={(fabricante)=> this.setState({ fabricante })}
                    />
                </View>

                {/* FECHA ULTIMA REVISION */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Fecha Ult Rev</Text>
                    <DatePicker
                        customStyles={{
                            dateInput:style.btnDate,
                            placeholderText:fechaUltimaRev ?style.textBtnActive :style.textBtn,
                            dateText: { 
                                fontSize:14,
                                color: '#000000'
                            },
                        }}
                        style={style.btnDate2}
                        
                        locale="es_co"
                        mode="date"
                        placeholder={fechaUltimaRev ?fechaUltimaRev :"Ultima Revisión"}
                        format="YYYY-MMM-DD"
                        showIcon={false}
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        androidMode='spinner'
                        onDateChange={(fechaUltimaRev) => {this.setState({fechaUltimaRev})}}
                    />
                </View>

                {/* ULTIMA REVISIÓN PARCIAL */}
                <View style={[style.contenedorSetp2, {marginTop:10, marginBottom:5}]}>
                    <Text style={style.row1Step2}>Ultima Rev Par</Text>
                    <DatePicker
                        customStyles={{
                            dateInput:style.btnDate,
                            placeholderText:ultimaRevisionPar ?style.textBtnActive :style.textBtn,
                            dateText: { 
                                fontSize:14,
                                color: '#000000'
                            },
                        }}
                        style={style.btnDate2}
                        
                        locale="es_co"
                        mode="date"
                        placeholder={ultimaRevisionPar ?ultimaRevisionPar :"Ultima Rev Par"}
                        format="YYYY-MMM-DD"
                        showIcon={false}
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        androidMode='spinner'
                        onDateChange={(ultimaRevisionPar) => {this.setState({ultimaRevisionPar})}}
                    />
                </View>
                  
                {/* NUMERO DE PLACA MANTENIMIENTO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>N Placa Man</Text>
                    <TextInput
                        placeholder="N Placa Man"
                        value={nPlaca}
                        style={style.inputStep2}
                        onChangeText={(nPlaca)=> this.setState({ nPlaca })}
                    />
                </View>
                {/* <ModalFilterPicker
					placeholderText="nPlaca ..."
					visible={modalUbicacion}
					onSelect={(e)=>this.setState({nPlaca:e, modalUbicacion:false})}
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
                </View> */}

                  
                {/* CODIGO ACTIVO */}
                {/* <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Codigo Activo</Text>
                    <TextInput
                        placeholder="Codigo Activo"
                        value={codigoActivo}
                        style={style.inputStep2}
                        onChangeText={(codigoActivo)=> this.setState({ codigoActivo })}
                    />
                </View> */}

                {/* SERIE */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Serie</Text>
                    <TextInput
                        placeholder="Serie"
                        value={serie}
                        style={style.inputStep2}
                        onChangeText={(serie)=> this.setState({ serie })}
                    />
                </View>

                {/* AÑO DE FABRICACIÓN */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Año Fabricación</Text>
                    <ModalSelector
                        style={style.inputStep2}
                        data={anosFabricacion}
                        initValue={anoFabricacion ?anoFabricacion :"Año Fabricación"}
                        cancelText="Cancelar"
                        onChange={(option)=>{ this.setState({anoFabricacion:option.key}) }} 
                    
                        initValueTextStyle={style.inputAno}
                        selectStyle={{borderWidth:0, padding:0, alignSelf:"stretch"  }}
                    />
                </View>
                
                {/* EXISTE PUNTO DE CONSUMO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Existe P Consumo</Text>
                    <ModalSelector
                        style={style.inputStep2}
                        data={existeTanques}
                        initValue={existeTanque ?existeTanque :"Existe P Consumo"}
                        cancelText="Cancelar"
                        onChange={(option)=>{ this.setState({existeTanque:option.key}) }} 
                        initValueTextStyle={style.inputAno}
                        selectStyle={{borderWidth:0, padding:0, alignSelf:"stretch"  }}
                    />
                </View>
                    {/* <DatePicker
                        customStyles={{
                            dateInput:style.btnDate,
                            placeholderText:anoFabricacion ?style.textBtnActive :style.textBtn,
                            dateText: { 
                                fontSize:14,
                                color: '#000000'
                            },
                        }}
                        style={style.btnDate2}
                        
                        locale="es_co"
                        mode="date"
                        placeholder={anoFabricacion ?anoFabricacion :"Año de Fabricación"}
                        format="YYYY"
                        showIcon={false}
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        androidMode='spinner'
                        onDateChange={(anoFabricacion) => {this.setState({anoFabricacion})}}
                    /> */}
                    

                
                 
            </View>
        )
    }

     
    step2(){
        let {imgPlaca, imgPlacaMantenimiento, imgPlacaFabricante, imgVisual, imgDossier, imgCerFabricante, imgCerOnac} = this.state
        return(
            <View>
               

                {/* PLACA */}
                <TomarFoto 
                    source={imgPlaca}
                    width={180}
                    titulo="Placa"
                    limiteImagenes={4}
                    imagenes={(imgPlaca) => {  this.setState({imgPlaca}) }}
                />
                {/* PLACA MANTENIMIENTO*/}
                <TomarFoto 
                    source={imgPlacaMantenimiento}
                    width={180}
                    titulo="Placa Mantenimiento"
                    limiteImagenes={4}
                    imagenes={(imgPlacaMantenimiento) => {  this.setState({imgPlacaMantenimiento}) }}
                />
                {/* PLACA FABRICANTE */}
                <TomarFoto 
                    source={imgPlacaFabricante}
                    width={180}
                    titulo="Placa fabricante"
                    limiteImagenes={4}
                    imagenes={(imgPlacaFabricante) => {  this.setState({imgPlacaFabricante}) }}
                />
                
                {/* VISUAL */}
                <TomarFoto 
                    source={imgVisual}
                    width={180}
                    titulo="Visual Tanque"
                    limiteImagenes={4}
                    imagenes={(imgVisual) => {  this.setState({imgVisual}) }}
                />

                {/* DOSSIER */}
                <SubirDocumento 
                    source={imgDossier}
                    width={180}
                    titulo="Dossier"
                    limiteImagenes={4}
                    imagenes={(imgDossier) => {  this.setState({imgDossier}) }}
                />
                {/* DOSSIER */}
                <SubirDocumento 
                    source={imgCerFabricante}
                    width={180}
                    titulo="Cer. Fabricante"
                    limiteImagenes={4}
                    imagenes={(imgCerFabricante) => {  this.setState({imgCerFabricante}) }}
                />
                {/* DOSSIER */}
                <SubirDocumento 
                    source={imgCerOnac}
                    width={180}
                    titulo="Cer. Onac"
                    limiteImagenes={4}
                    imagenes={(imgCerOnac) => {  this.setState({imgCerOnac}) }}
                />

            </View>
        )
    }
    step3(){
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


    renderSteps(){
        let {placaText, crearPlaca} = this.state
       
        return(
            <ProgressSteps activeStepIconBorderColor="#002587" progressBarColor="#002587" activeLabelColor="#002587" >
                <ProgressStep label="Datos"  nextBtnDisabled={placaText ?false :true} nextBtnText="Siguiente" onNext={()=>crearPlaca ?this.crearStep1() :this.editarStep1()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step1()}    
                    </View>
                </ProgressStep> 
                <ProgressStep label="Imagenes" nextBtnText="Siguiente"   onNext={()=>this.editarStep2()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step2()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Usuario" finishBtnText="Guardar"  onSubmit={()=>this.editarStep3()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step3()}
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
        const {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque} = this.state
        console.log({placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque})
        axios.post(`tan/tanque/`, {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                this.setState({crearPlaca:true, tanqueId:res.data.tanque._id})
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 1
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep1(){
        const {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, tanqueId, zonaId, usuarioId, puntoId, existeTanque} = this.state
        console.log({placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, tanqueId, existeTanque})
        axios.put(`tan/tanque/${tanqueId}`, {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, zonaId, usuarioId, puntoId, existeTanque})
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
    ////////////////////////           EDITA EL STEP 2
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep2(){
        let {imgPlaca, imgPlacaMantenimiento, imgPlacaFabricante, imgVisual, imgDossier, imgCerFabricante, imgCerOnac, tanqueId} = this.state
        console.log({imgVisual, imgCerFabricante, imgCerOnac})
        let data = new FormData();
        imgPlaca.forEach(e=>{
            data.append('imgPlaca', e);
        })
        imgPlacaMantenimiento.forEach(e=>{
            data.append('imgPlacaMantenimiento', e);
        })
        imgPlacaFabricante.forEach(e=>{
            data.append('imgPlacaFabricante', e);
        })
        imgVisual.forEach(e=>{
            data.append('imgVisual', e);
        })
        imgDossier.forEach(e=>{
            data.append('imgDossier', e);
        })
        imgCerFabricante.forEach(e=>{
            data.append('imgCerFabricante', e);
        })
        imgCerOnac.forEach(e=>{
            data.append('imgCerOnac', e);
        })
        data.append('imgPlaca',              imgPlaca);
        data.append('imgPlacaMantenimiento', imgPlacaMantenimiento);
        data.append('imgPlacaFabricante',    imgPlacaFabricante);
        data.append('imgVisual',             imgVisual);
        data.append('imgDossier',            imgDossier);
        data.append('imgCerFabricante',      imgCerFabricante);
        data.append('imgCerOnac',            imgCerOnac);
        axios({
            method: 'put',   
            url: `tan/tanque/guardarImagen/${tanqueId}`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                 
            }
        })
        .catch(err=>{
            this.setState({cargando:false})
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 3
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep3(){
        const {zonaId, usuarioId, puntoId, placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, tanqueId} = this.state
        console.log({zonaId, usuarioId, puntoId})
        axios.put(`tan/tanque/${tanqueId}`, {zonaId, usuarioId, puntoId, placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque  })
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                alert("Tanque Guardado")
                const {navigation} = this.props
                navigation.navigate("Home")
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 5
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep5(){
        const {x, tanqueId} = this.state
        console.log({x})
        let lat=x.latitude
        let lng=x.longitude
        axios.put(`tan/tanque/coordenadas/${tanqueId}`, {lat, lng})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                 
                alert("Tanque Guardado")
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
