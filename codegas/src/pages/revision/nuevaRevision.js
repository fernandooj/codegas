import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Switch, TextInput, Platform, Image, Dimensions, Alert, ActivityIndicator} from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import ModalFilterPicker               from 'react-native-modal-filter-picker'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';  
import axios                           from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import TomarFoto                       from "../components/tomarFoto";
import SubirDocumento                  from "../components/subirDocumento";
import { connect }                     from "react-redux";
import {getUsuariosAcceso}             from '../../redux/actions/usuarioActions'
import {getVehiculos}                  from '../../redux/actions/vehiculoActions'
import {getTanques}                  from '../../redux/actions/tanqueActions'
import Footer                          from '../components/footer'
import {style}                         from './style'
import {DataContext} from "../../context/context"
 

let sectores    = [{key:"E2", label:"E2"},{key:"E3", label:"E3"},{key:"E4", label:"E4"},{key:"E5", label:"E5"},{key:"E6", label:"E6"},{key:"O", label:"O"},{key:"C", label:"C"},{key:"I", label:"I"},{key:"OT", label:"OT"}]
let ubicaciones = [{key:"Azotea", label:"Azotea"},{key:"Enterrado", label:"Enterrado"},{key:"Piso", label:"Piso"}]
let propiedades = [{key:"Usuario", label:"Usuario"},{key:"Propio", label:"Propio"}]
let m3s         = [{key:"Si", label:"Si"},{key:"No", label:"No"}]



const images = [
    {title: 'Soporte Entrega', type: 'soporteEntrega', mime: 'image/jpeg', source: 'imgSoporteEntrega'},
    {title: 'Punto Consumo', type: 'puntoConsumo', mime: 'image/jpeg', source: 'imgPuntoConsumo'},
    {title: 'Visual instalación', type: 'visual', mime: 'image/jpeg', source: 'imgVisual'},
    {title: 'Doc. de comodato', type: 'nComodato', mime: 'application/pdf', source: 'imgNComodato'},
    {title: 'Isometrico', type: 'isometrico', mime: 'application/pdf', source: 'imgIsometrico'},
    {title: 'Otros Comodato', type: 'otrosComodato', mime: 'application/pdf', source: 'imgOtrosComodato'},
    {title: 'Protocolo Llenado', type: 'protocoloLlenado', mime: 'application/pdf', source: 'imgProtocoloLlenado'},
    {title: 'Hoja Seguridad', type: 'hojaSeguridad', mime: 'application/pdf', source: 'imgHojaSeguridad'},
    {title: 'Otros Si', type: 'otrosSi', mime: 'application/pdf', source: 'imgOtrosSi'},
    {title: 'Documento', type: 'documento', mime: 'application/pdf', source: 'imgDocumento'},
    {title: 'Dep. Tecnico', type: 'depTecnico', mime: 'application/pdf', source: 'imgDepTecnico'}
]

class Tanques extends Component{
    static contextType = DataContext;
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
     
 
    componentDidMount() {
        this.props.getTanques(0, 10, undefined);
    
        const { acceso: accesoPerfil, userId: idUsuario } = this.context;
        this.setState({ accesoPerfil, idUsuario });
    
        const { revisionId, puntoId, clienteId } = this.props.navigation.state.params || {};
        this.setState({ revisionId, puntoId, usuarioId: clienteId });
    
        this.filtroClientes(clienteId);
    
        if (clienteId) {
          axios.get(`tan/tanque/byPunto/${puntoId}`)
            .then(res => {
              const tanqueIdArray = res.data.tanque.map(e => e._id);
              this.setState({ tanqueArray: res.data.tanque, tanqueIdArray });
            });
    
          axios.get(`pun/punto/byId/${puntoId}`)
            .then(res => {
              const { capacidad, direccion, observacion } = res.data.punto;
              this.setState({ capacidad, direccion, observacion });
            });
        }
    
        this.buscarRevision();
        this.buscarDepto();
    }
    
    componentWillReceiveProps(props){
 
        let placas = []
        placas = props.tanques.map(e=>{
            return{
                key:e._id,
                label:e.placatext
            }
        }) 
        this.setState({placas, tanques: props.tanques})
         
    }  
    buscarRevision(){
        let revisionId = this.props.navigation.state.params ?this.props.navigation.state.params.revisionId :this.state.revisionId
 
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////        SI SELECCIONA UNA REVISION POR DEFECTO LA SELECCIONA
        if(revisionId){
            axios.get(`rev/revision/byId/${revisionId}`)
            .then(res => {
                const {revision} = res.data
        
                let tanqueIdArray = []
                revision.tanqueid.map(e=>{
                    tanqueIdArray.push(e._id)
                })
                
                this.setState({
                    /////// step 1
                    revisionId:    revision._id,
                    poblado:       revision.poblado,
                    tanqueArray :  revision.tanqueid,
                    tanqueIdArray,
                    /////////  step 2
                    nControl          : revision.nControl          ?revision.nControl          :"",
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

                    usuarioId:                revision._id                ,
                    cedulaCliente:            revision.razon_social      ,
                    codtCliente:              revision.codt              ,
                    razon_socialCliente:      revision.cedula            ,
                    direccion_facturaCliente: revision.direccion_factura ,
                    nombreCliente:            revision.nombre            ,
                    celularCliente :          revision.celular           ,
                    emailCliente:             revision.email             ,
                    puntos:                   revision.puntoId      ?[revision.puntoId]                   :[],
                    direccion:                revision.puntoId      ?revision.puntoId.direccion           :null,
                    puntoId:                  revision.puntoId      ?revision.puntoId._id                 :null,
                    zonaId:                   revision.zonaId       ?revision.zonaId._id                  :null,
                    
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
                    imgSoporteEntrega  : revision.soporteentrega  ?revision.soporteentrega :[],
                    imgPuntoConsumo    : revision.puntoconsumo    ?revision.puntoconsumo   :[],
                    imgVisual          : revision.visual          ?revision.visual         :[],                    
                    imgNComodato    :    revision.nCcmodato        ?revision.ncomodato     :[],
                    imgIsometrico      : revision.isometrico      ?revision.isometrico     :[],
                    imgOtrosComodato   : revision.otroscomodato   ?revision.otroscomodato  :[],
                    imgProtocoloLlenado: revision.protocolollenado ?revision.protocolollenado :[],
                    imgHojaSeguridad:    revision.hojaseguridad    ?revision.hojaseguridad :[],
                    imgOtrosSi      :    revision.otrossi          ?revision.otrossi       :[],
                    imgDocumento      :    revision.documento          ?revision.documento       :[],
                    imgDepTecnico      :    revision.depTecnico          ?revision.depTecnico       :[],
                    

                    /////////  step 5
                    poblado: revision.poblado ?revision.poblado :"",
                    ciudad: revision.ciudad ?revision.ciudad :"",
                    dpto: revision.dpto ?revision.dpto :"",
                })

                Geolocation.getCurrentPosition(e=>{
                    let lat = parseFloat(e.coords.latitude)
                    let lng = parseFloat(e.coords.longitude)
                    lat =  revision.coordenadas ?revision.coordenadas.coordinates[1] :lat;
                    lng =  revision.coordenadas ?revision.coordenadas.coordinates[0] :lng;
                    this.setState({lat, lng})
                }, (error)=>this.watchID = Geolocation.watchPosition(e=>{
         
                    let lat =parseFloat(e.coords.latitude)
                    let lng = parseFloat(e.coords.longitude)
                    lat =  revision.coordenadas ?revision.coordenadas.coordinates[1] :lat;
                    lng =  revision.coordenadas ?revision.coordenadas.coordinates[0] :lng;
                    this.setState({lat, lng})
                },
                    (error) => console.log('error'),
                    {enableHighAccuracy: true, timeout:5000, maximumAge:0})
                )
            })
        }
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
        let {tanqueArray, tanqueIdArray, usuarioId, puntoId, tanques} = this.state
        // axios.get(`tan/tanque/byId/${id.key}`)
        // .then(res=>{
        //     console.log(id)
        //     console.log(res.data)
        //     const {tanque} = res.data
        //     let infoTanque={
        //         _id:                tanque._id,
        //         placaText :         tanque.placaText ?tanque.placaText :"",
        //         barrio:             tanque.barrio    ?tanque.barrio    :"",
        //         capacidad:          tanque.capacidad ?tanque.capacidad :"",
        //     }
        // })
        const tanque = tanques.filter(({_id})=> {
            return _id===id.key
        })
        if(tanqueIdArray.includes(tanque[0]._id)){
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
                const data = {
                    tanqueId: id.key,
                    usuarioId: usuarioId,
                    puntoId: puntoId
                  };

                axios.put('/tan/tanque/add-user', data)
                .then(e => { 
                    if(e.data.status){
                        tanqueArray.push(tanque[0])
                        tanqueIdArray.push(tanque._id)
                        this.setState({tanqueArray, tanqueIdArray, modalPlacas:false})
                    }
                })
            }
            
        }
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
    
    step1(){
        const {tanqueIdArray, tanqueArray, modalPlacas, placas, placaText, puntoId, usuarioId} = this.state
  
        
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
        let {navigate} =this.props.navigation
        return(
            <View>
                {
                    images.map(({title, type, mime, source})=>{
                         
                        if(mime==='image/jpeg') {
                            return <>
                                 <TomarFoto 
                                    source={this.state[source]}
                                    width={180}
                                    titulo={title}
                                    limiteImagenes={4}
                                    imagenes={(e) => {  this.uploadImagen(e, type, mime) }}
                                /> 
                                <View style={style.separador}></View>
                            </>
                        } else {
                            return <>
                                <SubirDocumento 
                                    navigate={navigate}
                                    source={this.state[source]}
                                    width={180}
                                    titulo={title}
                                    limiteImagenes={4}
                                    imagenes={(e) => {  this.uploadImagen(e, type, mime) }}
                                    />
                                <View style={style.separador}></View>
                            </>
                        }
                    })
                }
            </View>
        )
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 4, IMAGENES Y DOCUMENTOS 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    uploadImagen(imagen, type, mime){
        this.setState({loading:true})
        let {imgIsometrico, imgOtrosComodato,  imgSoporteEntrega, imgPuntoConsumo, imgVisual, revisionId} = this.state
        
        const data = {
            mime,
            imagen: imagen.imagen,
            revisionId,
            type,
            name: imagen.name
        }
        console.log(data)
        axios({
            method: 'PUT',  
            url: `rev/revision/add-images`,
            data:  JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json'
            },
          })
          .then((res)=>{
            if(res.data.status){
                this.buscarRevision()
                this.setState({loading:false})
                Toast.show({type: 'success', text1: 'Imagen Subida'})
            }else{
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
            }
          })
    }

    
    buscarDepto(){
        axios.get(`https://resources-codegas.s3.amazonaws.com/departamentos.json`)
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
        axios.get(`https://resources-codegas.s3.amazonaws.com/ciudades.json`)
        .then(res=>{
          
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
        axios.get(`https://resources-codegas.s3.amazonaws.com/poblado.json`)
        .then(res=>{
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
        return(
          <View>
              {
                (accesoPerfil=="admin" || accesoPerfil=="adminTanque")
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
            if(res.data.status){
                Toast.show({type: 'success', text1: 'Solicitud enviada'})
                this.setState({modalAlerta:false, solicitudServicio:""})
            }else{
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
            }
        })
    }


    renderSteps(){
        let {tanqueArray, revisionId, modalAlerta} = this.state
       
        return(
            <ProgressSteps activeStepIconBorderColor="#002587" progressBarColor="#002587" activeLabelColor="#002587" >
                <ProgressStep label="Datos"  nextBtnDisabled={tanqueArray.length==0 ?true :false} nextBtnText="Siguiente" onNext={()=>revisionId ?this.editarStep1() :this.crearStep1()}>
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
                <Toast />
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
    ////////////////////////            CREAR REVISION
    //idUsuario => usuario que crea la revision
    //usuarioId => usuario a quien se le asigna la revision
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    crearStep1(){
        const {tanqueIdArray, tanqueArray, idUsuario, usuarioId, puntoId} = this.state
       
        axios.post(`rev/revision/`, {tanqueId:tanqueIdArray, usuarioId, puntoId, usuarioCrea: idUsuario})
        .then((res)=>{
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
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 1
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep1(){
        const {sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion, tanqueArray} = this.state
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

      
                this.setState({capacidad:totalCapacidad})
            }else{
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            EDITA EL STEP 2
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep2(){
        const {zonaId, usuarioId, puntoId, sector, barrio, usuariosAtendidos, m3, revisionId, tanqueIdArray, nComodatoText, nMedidorText, ubicacion, capacidad} = this.state
        
        axios.put(`rev/revision/${revisionId}`, {sector, barrio, usuariosAtendidos, m3, tanqueId:tanqueIdArray, zonaId, usuarioId, puntoId, nComodatoText, nMedidorText, ubicacion})
        .then((res)=>{
      
            if(res.data.status){
                // axios.put(`pun/punto/editaAlmacenamiento/${puntoId}/${capacidad}`)
                // .then((res)=>{
                //     console.log(res.data)
                // })
            }else{
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           EDITA EL STEP 3
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarStep3(){
        const {observaciones, avisos, extintores, distancias, electricas, accesorios, revisionId} = this.state
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
        let {lat, lng, revisionId, poblado, ciudad, dpto} = this.state
        lat =  lat ?lat :4.597825;
        lng =  lng ?lng :-74.0755723;
        console.log({lat, lng, poblado, ciudad, dpto})
        
        axios.put(`rev/revision/coordenadas/${revisionId}`, {lat, lng, poblado, ciudad, dpto})
        .then((res)=>{
            console.log(res.data)
            if(res.data.status){
                 
                alert("Revisión Guardado")
                const {navigation} = this.props
                // navigation.navigate("Home")
            }else{
                Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
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
        vehiculos:state.vehiculo.vehiculos,
        tanques:state.tanque.tanques
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
        getTanques: (start, limit, search) => {
            dispatch(getTanques(start, limit, search));
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
