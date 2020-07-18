import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
import ModalFilterPicker               from 'react-native-modal-filter-picker'
import ModalSelector                   from 'react-native-modal-selector'
import DatePicker 			           from 'react-native-datepicker'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';  
import axios                           from 'axios';
import Lightbox 					   from 'react-native-lightbox';
import Icon                            from 'react-native-fa-icons';
import SubirDocumento                  from "../components/subirDocumento";
import TomarFoto                       from "../components/tomarFoto";
import { connect }                     from "react-redux";
import {getUsuariosAcceso}             from '../../redux/actions/usuarioActions'
import {getVehiculos}                  from '../../redux/actions/vehiculoActions'
import Footer                          from '../components/footer'
import {style}                         from './style'
 
 


// let capacidades = [{key:"TK 50", label:"TK 50"},{key:"TK 120", label:"TK 120"},{key:"TK 250", label:"TK 250"},{key:"TK 300", label:"TK 300"},{key:"TK 500", label:"TK 500"},{key:"TK 1000", label:"TK 1000"},{key:"TK 2000", label:"TK 2000"},{key:"TK 3000", label:"TK 3000"},{key:"TK 5000", label:"TK 5000"},{key:"TK 10000", label:"TK 10000"}]
let anosFabricacion = []
let existeTanques   = [{key:"Bodega", label:"Bodega"},{key:"Cliente", label:"Cliente"}]
let propiedades     = [{key:"Usuario", label:"Usuario"},{key:"Propio", label:"Propio"}]

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
            imgUltimaRev:[],
            revisiones:[],
            alertas:[],
            capacidades:[],
            alertaText:""
	    }
    }
    async componentWillMount(){
        try{
            axios.get(`tan/tanque`)
            .then(res=>{
                let placas = res.data.tanque
                placas = placas.map(e=>{
                    return{
                        key:e._id,
                        label:e.placaText
                    }
                }) 
                this.setState({placas})
            })
            axios.get("cap/capacidad")
            .then(res=>{
                if(res.data.status){
                    
                    let capacidades = res.data.capacidad
                    capacidades = capacidades.map(e=>{
                        return{
                            key:e.capacidad,
                            label:e.capacidad
                        }
                    }) 
                    this.setState({capacidades})
                }else{
                 this.setState({capacidades:[]})
                }
            })
 
            
            let tanqueId  = this.props.navigation.state.params.tanqueId ?this.props.navigation.state.params.tanqueId :null
            let placaText = this.props.navigation.state.params.placaText ?this.props.navigation.state.params.placaText :null
            let puntoId   = this.props.navigation.state.params.puntoId ?this.props.navigation.state.params.puntoId :null
            let usuarioId = this.props.navigation.state.params.usuarioId ?this.props.navigation.state.params.usuarioId :null
            console.log({tanqueId})
            if(usuarioId){
                axios.get(`user/byId/${usuarioId}`)
                .then(res => {
                    const {cedula, razon_social, direccion_factura, nombre, celular, email} = res.data.user
                    this.setState({
                        cedulaCliente:cedula, razon_socialCliente:razon_social, direccion_facturaCliente: direccion_factura, nombreCliente:nombre, celularCliente: celular, emailCliente: email

                    })
                })
                axios.get(`pun/punto/byId/${puntoId}`)
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        puntos:res.data.punto
                    })
                })
               
            }
 
            this.setState({placaText, puntoId, usuarioId})
            if(tanqueId){
                axios.get(`ult/ultimaRev/byTanque/${tanqueId}`)
                .then(res=>{
                    console.log(res.data)
                    this.setState({revisiones:res.data.revision})
                })
                axios.get(`ale/alertaTanque/byTanque/${tanqueId}`)
                .then(res=>{
                    console.log(res.data.alerta)
                    this.setState({alertas:res.data.alerta})
                })

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
                        registroOnac:           tanque.registroOnac      ?tanque.registroOnac       :"",
                        fechaUltimaRev:         tanque.fechaUltimaRev    ?tanque.fechaUltimaRev     :"",
                        ultimRevTotal:          tanque.ultimRevTotal     ?tanque.ultimRevTotal      :"",
                        propiedad             : tanque.propiedad         ?tanque.propiedad          :"",
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
                        usuarioId:                tanque.usuarioId           ?tanque.usuarioId._id               :null,
                        codtCliente:              tanque.usuarioId           ?tanque.usuarioId.codt              :"",
                        cedulaCliente:            tanque.usuarioId           ?tanque.usuarioId.razon_social      :"",
                        razon_socialCliente:      tanque.usuarioId           ?tanque.usuarioId.cedula            :"",
                        direccion_facturaCliente: tanque.usuarioId           ?tanque.usuarioId.direccion_factura :"",
                        nombreCliente:            tanque.usuarioId           ?tanque.usuarioId.nombre            :"",
                        celularCliente :          tanque.usuarioId           ?tanque.usuarioId.celular           :"",
                        emailCliente:             tanque.usuarioId           ?tanque.usuarioId.email             :"",
                        puntos:                   tanque.puntoId             ?[tanque.puntoId]                   :[],
                        puntoId:                  tanque.puntoId             ?tanque.puntoId._id                 :null,
                        zonaId:                   tanque.zonaId              ?tanque.zonaId._id                  :null,
                        modalPlacas:false    
                    })
                })
            }else{
                this.setState({crearPlaca:true})    /// esta linea es para cuando creo la placa desde revision, el crear placa sera verdadero, o de lo contrario editara un tanque que aun no existe
            }   
        }catch(e){
            console.log(e)
        }    
        
    }
    getClientes(){
        this.setState({loadClientes:true})
        axios.get(`users/clientes`)
        .then(res => {
            console.log(res.data.usuarios)
            if(res.data.status){
                this.setState({loadClientes:false})
                let clientes = res.data.usuarios.map(e=>{
                    return {key:e._id, label:e.cedula ?e.razon_social+" | "+e.cedula+" | "+e.codt :e.razon_social, email:e.email, direccion_factura:e.direccion_factura, nombre:e.nombre, razon_social:e.razon_social, cedula:e.cedula, celular:e.celular , codt:e.codt }
                }) 
                this.setState({clientes, modalCliente:true, puntoId:undefined})
            }
        })
    }
    eliminarTanque(){
        let {tanqueId} = this.state
        Alert.alert(
            `Seguro desea remover este cliente`,
            ``,
            [
                {text: 'Confirmar', onPress: () => confirmar()},
                {text: 'Cancelar', onPress: () => console.log("e")},
            ],
            {cancelable: false},
        )
    const confirmar = ()=>{
        axios.get(`tan/tanque/desvincularUsuario/${tanqueId}`)
        .then(res => { 
            if(res.data.status){
                this.setState({ usuarioId:null, puntos:[]})
            }
        })
    }
    }
    buscarTanque(id){
        console.log({id})
        axios.get(`tan/tanque/byPlacaText/${id}`)
            .then(res=>{
                console.log(res.data)
                const {tanque} = res.data
                if(res.data.status){
                    Toast.show("Esta placa ya existe")
                    this.setState({placaText:null})
                }
                
            })
    }
    renderModalUltimaRev(){
        let {ultimaRevisionPar, imgUltimaRev, loading, err1, err2} = this.state
		return(
			<Modal transparent visible={true} animationType="fade" >
				<TouchableOpacity activeOpacity={1} >
					<View style={style.contenedorModal}>
						<View style={style.subContenedorModalUbicacion}>
							<TouchableOpacity activeOpacity={1} onPress={() => this.setState({showModal:false})} style={style.btnModalClose}>
								<Icon name={'times-circle'} style={style.iconCerrar} />
							</TouchableOpacity>
                            <DatePicker
                                customStyles={{
                                    dateInput:style.btnDate,
                                    placeholderText:ultimaRevisionPar ?style.textBtnActive :style.textBtn,
                                    dateText: { 
                                        fontSize:14,
                                        color: '#000000'
                                    },
                                }}
                                style={style.btnDate3}
                                
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
                            <TomarFoto 
                                source={imgUltimaRev}
                                width={180}
                                titulo="Ultima Rev Par"
                                limiteImagenes={4}
                                imagenes={(imgUltimaRev) => {  this.setState({imgUltimaRev}) }}
                            />
                            <TouchableOpacity style={style.nuevaRevision} onPress={()=>ultimaRevisionPar ?this.saveRevision() :alert("Inserte una fecha") }>
                                <Text style={style.textGuardar}>Guardar</Text>
                            </TouchableOpacity>
                            
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
		)
    }
    saveRevision(){
        let {ultimaRevisionPar, imgUltimaRev, tanqueId} = this.state
        let data = new FormData();
        imgUltimaRev.forEach(e=>{
            data.append('imgUltimaRev', e);
        })
        data.append('fecha',    ultimaRevisionPar);
        data.append('tanqueId', tanqueId);
        
        axios({ method: 'post',    url: `ult/ultimaRev/`, data: data })
        .then((res)=>{
            if(res.data.status){
                axios.get(`ult/ultimaRev/byTanque/${tanqueId}`)
                .then(res=>{
                   this.setState({revisiones:res.data.revision, showModal:false, ultimaRevisionPar:null, imgUltimaRev:[]})
                })
            }
        })
        .catch(err=>{
            alert("Error intentalo mas tarde")
        }) 
        axios.post("")
    }
    step1(){
        const {modalPlacas, placas, placaText, modalCapacidad, capacidad, fabricante, showModal, fechaUltimaRev, existeTanque, capacidades, nPlaca, serie, anoFabricacion, revisiones, registroOnac, ultimRevTotal, propiedad, modalPropiedad, tanqueId} = this.state
         
        return(
            <View>
                {
                    showModal &&this.renderModalUltimaRev()
                }
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
                    <TextInput
                        placeholder="Serie"
                        value={placaText}
                        style={style.inputStep2}
                        onChangeText={(placaText)=> this.setState({ placaText:capitalizeFirstLetter(placaText) })}
                        onBlur={()=>this.buscarTanque(placaText)}
                    />
                    {/* <TouchableOpacity style={style.btnMultiple} onPress={()=>this.setState({modalPlacas:true})}>
                        <Text style={placaText ?style.textBtnActive :style.textBtn}>{placaText ?placaText :"Placas"}</Text>
                    </TouchableOpacity> */}
                </View>

                 {/* CAPACIDAD */}
                 <ModalFilterPicker
					placeholderText="Capacidad ..."
					visible={modalCapacidad}
					onSelect={(e)=>this.setState({capacidad:e.key, modalCapacidad:false})}
					// onSelect={(e)=>console.log(e)}
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

                {/* FECHA MANTENIMIENTO TOTAL */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Fecha Mto</Text>
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
                        placeholder={fechaUltimaRev ?fechaUltimaRev :"Mto total"}
                        format="YYYY-MMM-DD"
                        showIcon={false}
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        androidMode='spinner'
                        onDateChange={(fechaUltimaRev) => {this.setState({fechaUltimaRev})}}
                    /> 
                </View>

              
                  
                {/* NUMERO DE PLACA MANTENIMIENTO */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>No placa Mto</Text>
                    <TextInput
                        placeholder="No placa Mto"
                        value={nPlaca}
                        style={style.inputStep2}
                        onChangeText={(nPlaca)=> this.setState({ nPlaca })}
                    />
                </View>
                
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
                    <Text style={style.row1Step2}>Ubicación tanque</Text>
                    <ModalSelector
                        style={style.inputStep2}
                        data={existeTanques}
                        initValue={existeTanque ?existeTanque :"Ubicación del tanque"}
                        cancelText="Cancelar"
                        onChange={(option)=>{ this.setState({existeTanque:option.label}) }} 
                        initValueTextStyle={style.inputAno}
                        selectStyle={{borderWidth:0, padding:0, alignSelf:"stretch"  }}
                    />
                </View>    
                
                {/* PROPIEDAD */}  
                <ModalFilterPicker
					placeholderText="Propiedad ..."
					visible={modalPropiedad}
					onSelect={(e)=>this.setState({propiedad:e.key, modalPropiedad:false})}
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

                {/* REGISTRO ONAC */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Registro onac</Text>
                    <TextInput
                        placeholder="Registro onac"
                        style={style.inputStep2}
                        value={registroOnac}
                        onChangeText={(registroOnac)=> this.setState({ registroOnac })}
                    />
                </View>
                
                {/* REGISTRO ONAC */}
                <View style={style.contenedorSetp2}>
                    <Text style={style.row1Step2}>Ultima Rev Total</Text>
                    <DatePicker
                        customStyles={{
                            dateInput:style.btnDate,
                            placeholderText:ultimRevTotal ?style.textBtnActive :style.textBtn,
                            dateText: { 
                                fontSize:14,
                                color: '#000000'
                            },
                        }}
                        style={style.btnDate2}
                        
                        locale="es_co"
                        mode="date"
                        placeholder={ultimRevTotal ?ultimRevTotal :"Ultima Rev Par"}
                        format="YYYY-MMM-DD"
                        showIcon={false}
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        androidMode='spinner'
                        onDateChange={(ultimRevTotal) => {this.setState({ultimRevTotal})}}
                    />
                </View>

                <View style={[style.separador, {width:size.width-30}]}></View>
                
                {/* ULTIMA REVISIÓN PARCIAL */}
                {
                    tanqueId
                    &&<View style={[style.contenedorSetp2, {marginTop:10, marginBottom:5}]}>
                        <Text style={style.row1Step2}>Ultima Rev Par</Text>
                        <TouchableOpacity onPress={()=>this.setState({showModal:true})}>
                            <Icon name="plus" style={style.iconFrecuencia} />
                        </TouchableOpacity>    
                    </View>  
                }
                {
                    revisiones.length>0
                    &&
                    <View>
                        <View style={style.contenedorRevision}>
                            <Text style={style.txtUltimaRevTit}>Fecha</Text>
                            <Text style={style.txtUltimaRevTit}>Usuario</Text>
                            <Text style={style.txtUltimaRevTit}>Imagen</Text>
                        </View>       
                        {
                            revisiones.map(e=>{
                                let imagen = e.ruta[0]
                                imagen = imagen ?imagen.split("-") :""
                                imagen = `${imagen[0]}Resize${imagen[2]}`
                                return(
                                    <View style={style.contenedorRevision}>
                                        <Text style={style.txtUltimaRev}>{e.fecha}</Text>
                                        <Text style={style.txtUltimaRev}>{e.usuarioId.nombre}</Text>
                                        <Lightbox 
                                            backgroundColor="#fff"
                                            renderContent={() => (
                                                <Image
                                                    source={{uri: imagen }}
                                                    style={{ width:"100%", height:400, resizeMode:"contain" }}
                                                />
                                                )}
                                        >
                                            <Image
                                                source={{ uri: imagen  }}
                                                style={style.imagen}
                                            />
                                        </Lightbox>	  
                                    </View>
                                )
                            })
                        }
                    </View>    
                }
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
                <View style={style.separador}></View>

                {/* PLACA MANTENIMIENTO*/}
                <TomarFoto 
                    source={imgPlacaMantenimiento}
                    width={180}
                    titulo="Placa Mantenimiento"
                    limiteImagenes={4}
                    imagenes={(imgPlacaMantenimiento) => {  this.setState({imgPlacaMantenimiento}) }}
                />
                <View style={style.separador}></View>

                {/* PLACA FABRICANTE */}
                <TomarFoto 
                    source={imgPlacaFabricante}
                    width={180}
                    titulo="Placa fabricante"
                    limiteImagenes={4}
                    imagenes={(imgPlacaFabricante) => {  this.setState({imgPlacaFabricante}) }}
                />
                <View style={style.separador}></View>

                {/* VISUAL */}
                <TomarFoto 
                    source={imgVisual}
                    width={180}
                    titulo="Visual Tanque"
                    limiteImagenes={4}
                    imagenes={(imgVisual) => {  this.setState({imgVisual}) }}
                />
                <View style={style.separador}></View>

                {/* DOSSIER */}
                <SubirDocumento 
                    navigate={this.props.navigation.navigate}
                    source={imgDossier}
                    width={180}
                    titulo="Dossier"
                    limiteImagenes={4}
                    imagenes={(imgDossier) => {  this.uploadPdf(imgDossier, 1) }}
                />
                <View style={style.separador}></View>

                {/* CER FABRICANTE */}
                <SubirDocumento 
                    navigate={this.props.navigation.navigate}
                    source={imgCerFabricante}
                    width={180}
                    titulo="Cer. Fabricante"
                    limiteImagenes={4}
                    imagenes={(imgCerFabricante) => {  this.uploadPdf(imgCerFabricante, 2) }}
                />
                <View style={style.separador}></View>
                
                {/* CER ONAC */}
                <SubirDocumento 
                    navigate={this.props.navigation.navigate}
                    source={imgCerOnac}
                    width={180}
                    titulo="Cer. Onac"
                    limiteImagenes={4}
                    imagenes={(imgCerOnac) => {  this.uploadPdf(imgCerOnac, 3) }}
                />

            </View>
        )
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           SUBE LOS PDF
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    uploadPdf(pdf, tipo){
      
        this.setState({loading:true})
        let {tanqueId, imgDossier, imgCerFabricante, imgCerOnac} = this.state
        let data = new FormData();
        let dossier = imgDossier.filter(e=>{
            return !e.uri
        })
        imgDossier = imgDossier.filter(e=>{
            return e.uri
        })
        let cerFabricante = imgCerFabricante.filter(e=>{
            return !e.uri
        })
        imgCerFabricante = imgCerFabricante.filter(e=>{
            return e.uri
        })
        let cerOnac = imgCerOnac.filter(e=>{
            return !e.uri
        })
        imgCerOnac = imgCerOnac.filter(e=>{
            return e.uri
        })
        tipo===1
        ?pdf.forEach(e=>{
            data.append('imgDossier', e);
        })
        :tipo===2
        ?pdf.forEach(e=>{
            data.append('imgCerFabricante', e);
        })
        :pdf.forEach(e=>{
            data.append('imgCerOnac', e);
        })
        data.append('dossier',       JSON.stringify(dossier));
        data.append('cerFabricante', JSON.stringify(cerFabricante));
        data.append('cerOnac',       JSON.stringify(cerOnac));
        console.log({imgCerOnac, tipo})
       
            axios({ method: 'put',    url: `tan/tanque/uploadPdf/${tanqueId}`, data })
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    this.setState({loading:false})
                }
            })
            .catch(err=>{
                this.setState({loading:false})
                console.log(err)
                alert("No pudimos subir el archivo")
            })

        
    }
    step3(){
        const {usuarioId, modalCliente, clientes, codtCliente, cedulaCliente, razon_socialCliente, celularCliente, emailCliente, nombreCliente, direccion_facturaCliente, puntos, puntoId, loadClientes} = this.state
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
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={style.nuevoUsuario} onPress={()=>this.getClientes()}>
                        {loadClientes &&<ActivityIndicator color="#ffffff"  />}
                        <Icon name="plus" style={style.iconUsuario} />
                        <Text style={style.textGuardar}>Asignar Cliente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.nuevoUsuario} onPress={()=>this.eliminarTanque()}>
                        <Icon name="minus" style={style.iconUsuario} />
                        <Text style={style.textGuardar}>Remover Cliente</Text>
                    </TouchableOpacity>
                </View>
                {
                    usuarioId
                    &&<View style={style.contenedorUsuario}>
                        <View style={style.subContenedorUsuario}>
                            <Text style={style.row1}>CODT:</Text>
                            <Text style={style.row2}>{codtCliente}</Text>
                        </View>
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
    renderModaAlerta(){
        let {alertaText} = this.state
		return(
			<Modal transparent visible={true} animationType="fade" >
				<TouchableOpacity activeOpacity={1} >
					<View style={style.contenedorModal}>
						<View style={style.subContenedorModalUbicacion}>
							<TouchableOpacity activeOpacity={1} onPress={() => this.setState({showAlerta:false})} style={style.btnModalClose}>
								<Icon name={'times-circle'} style={style.iconCerrar} />
							</TouchableOpacity>
                            <TextInput
                                placeholder="Comentarios"
                                value={alertaText}
                                style={style.inputStep4}
                                onChangeText={(alertaText)=> this.setState({ alertaText })}
                            />
                            <TouchableOpacity style={style.nuevaRevision} onPress={()=>alertaText.length>5 ?this.enviarAlerta() :alert("Inserte una alerta") }>
                                <Text style={style.textGuardar}>Guardar</Text>
                            </TouchableOpacity>
                            
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
		)
    }
    enviarAlerta(){
        const { alertaText, tanqueId, placaText, codtCliente, razon_socialCliente } = this.state
        console.log({ alertaText, tanqueId, placaText, codtCliente, razon_socialCliente })
        axios.post(`ale/alertaTanque/`, {alertaText, placaText, tanqueId, codtCliente, razon_socialCliente})
        .then((res)=>{
            if(res.data.status){
                axios.get(`ale/alertaTanque/byTanque/${tanqueId}`)
                .then(res2=>{
                    console.log(res2.data)
                    setTimeout(() => {
                        alert("Alerta Enviada")
                    }, 500);
                    this.setState({alertaText:"", showAlerta:false, alertas:res2.data.alerta })
                })
            }
        })
        .catch(err=>{
            this.setState({loading:false})
            alert(JSON.stringify(err))
        })
    }
    step4(){
        const {alertas, showAlerta} = this.state
        return(
            <View>
                {showAlerta &&this.renderModaAlerta()}
                <View style={[style.contenedorSetp2, {marginTop:10, marginBottom:5}]} > 
                    <Text style={style.row1Step2}>Nueva alerta</Text>
                    <TouchableOpacity onPress={()=>this.setState({showAlerta:true})}>
                        <Icon name="plus" style={style.iconFrecuencia} />
                    </TouchableOpacity>    
                </View>
                <View style={[style.separador]}></View> 
                <View>
                    <View style={style.contenedorRevision}>
                        <Text style={style.alertaTit}>Alerta</Text>
                        <Text style={style.alertaTit}>Crea</Text>
                        <Text style={style.alertaTit}>Cierra</Text>
                        <Text style={style.alertaTit}>Imagen</Text>
                    </View>   
                    {
                        alertas.map(e=>{
                            let imagen = e.alertaImagen[0]
                            imagen = imagen ?imagen.split("-") :""
                            imagen = `${imagen[0]}Resize${imagen[2]}`
                            return(
                                <View key={e._id} style={[style.contenedorRevision, {backgroundColor: e.activo ?"#F96D6C" :"#e8a43d"} ]}>
                                    <Text style={style.alertaText}>{e.alertaText}</Text>
                                    <Text style={style.alertaText}>{e.usuarioCrea.nombre}</Text>
                                    <Text style={style.alertaText}>{e.usuarioCierra ?e.usuarioCierra.nombre :""}</Text>
                                    <Lightbox 
                                        backgroundColor="#fff"
                                        renderContent={() => (
                                            <Image
                                                source={{uri: imagen }}
                                                style={{ width:"100%", height:400, resizeMode:"contain" }}
                                            />
                                            )}
                                    >
                                        <Image
                                            source={{ uri: imagen  }}
                                            style={style.imagen}
                                        />
                                    </Lightbox>
                                </View>
                            )
                        })
                    }
                </View>
            </View> 
        )
    }
    renderSteps(){
        let {placaText, tanqueId} = this.state
        return(
            <ProgressSteps activeStepIconBorderColor="#002587" progressBarColor="#002587" activeLabelColor="#002587" style={{margin:0,padding:0}} >
                <ProgressStep label="Datos"  nextBtnDisabled={placaText ?false :true} nextBtnText="Siguiente" onNext={()=>tanqueId ?this.editarStep1() :this.crearStep1()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step1()}    
                    </View>
                </ProgressStep> 
                <ProgressStep label="Imagenes" nextBtnText="Siguiente"  previousBtnText="Anterior"  onNext={()=>this.editarStep2()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step2()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Usuario" finishBtnText="Siguiente" previousBtnText="Anterior"  onNext={()=>this.editarStep3()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step3()}
                    </View>
                </ProgressStep>
                <ProgressStep label="Alerta" finishBtnText="Guardar" previousBtnText="Anterior"  onSubmit={()=>this.editarStep4()}>
                    <View style={{ alignItems: 'center' }}>
                        {this.step4()}
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
     
    filtroClientes(idCliente){
        let cliente = this.state.clientes.filter(e=>{ return e.key==idCliente.key })
        console.log({cliente})
        this.setState({cliente:cliente[0].label, idCliente, cedulaCliente:cliente[0].cedula, codtCliente:cliente[0].codt, emailCliente:cliente[0].email, razon_socialCliente:cliente[0].razon_social, direccion_facturaCliente:cliente[0].direccion_factura, celularCliente:cliente[0].celular, nombreCliente:cliente[0].nombre, modalCliente:false})
        axios.get(`pun/punto/byCliente/${idCliente.key}`)
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
        const {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, registroOnac, ultimRevTotal, propiedad} = this.state
        console.log({placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, registroOnac, ultimRevTotal, propiedad})
        axios.post(`tan/tanque/`, {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, registroOnac, ultimRevTotal, propiedad})
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
        const {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, tanqueId, zonaId, usuarioId, puntoId, existeTanque, registroOnac, ultimRevTotal, propiedad} = this.state
        console.log({placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, tanqueId, existeTanque, registroOnac, ultimRevTotal, propiedad})
        axios.put(`tan/tanque/${tanqueId}`, {placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, zonaId, usuarioId, puntoId, existeTanque, registroOnac, ultimRevTotal, propiedad})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                Toast.show("Información Guardada")
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
        data.append('imgPlaca',              imgPlaca);
        data.append('imgPlacaMantenimiento', imgPlacaMantenimiento);
        data.append('imgPlacaFabricante',    imgPlacaFabricante);
        data.append('imgVisual',             imgVisual);
        axios({
            method: 'put',   
            url: `tan/tanque/guardarImagen/${tanqueId}`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                Toast.show("Información Guardada")
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
        axios.put(`tan/tanque/${tanqueId}`, {zonaId, usuarioId:usuarioId ?usuarioId.key :null, puntoId, placaText, capacidad, fabricante, ultimaRevisionPar, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque  })
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                //Toast.show("Usuario Guardado")
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    editarStep4(){
        alert("Tanque Guardado")
        const {navigation} = this.props
        navigation.navigate("Home")
    }
     
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
