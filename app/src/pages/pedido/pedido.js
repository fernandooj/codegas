import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated, Keyboard} from 'react-native'
import Toast from 'react-native-simple-toast';
import AsyncStorage        from '@react-native-community/async-storage';
import moment 			   from 'moment-timezone'
import axios               from 'axios';
import KeyboardListener    from 'react-native-keyboard-listener';
import Icon                from 'react-native-fa-icons';
import {Calendar, LocaleConfig}     from 'react-native-calendars';
import { createFilter }    from 'react-native-search-filter';
import { connect }         from "react-redux";
import ImageProgress 	   from 'react-native-image-progress';
import Footer              from '../components/footer'
import {getPedidos, getZonasPedidos} from '../../redux/actions/pedidoActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import {sendRemoteNotification} from '../push/envioNotificacion';
import TomarFoto           from "../components/tomarFoto";
import RNPickerSelect      from 'react-native-picker-select';
import SocketIOClient      from 'socket.io-client';
import {style}             from './style'
import {URL} from "../../../App"
LocaleConfig.locales['es'] = {
    monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthNamesShort: ['Ener.','Febr.','Marzo.','Abril.','Mayo.','Jun.','Jul.','Agos','Sept.','Oct.','Nov.','Dic.'],
    dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
    dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.'],
    today: 'Hoy'
  };
LocaleConfig.defaultLocale = 'es';

const KEYS_TO_FILTERS = ["conductorId.nombre", "conductorId.cedula", 'forma', 'cantidadKl', 'cantidadPrecio', "usuarioId.nombre", "usuarioId.cedula", "usuarioId.razon_social", "usuarioId.email", "frecuencia", "estado", "puntoId.direccion"] 
let size  = Dimensions.get('window');
class Pedido extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        openModal:false,
        modalConductor:false,
        modalFechaEntrega:false,
        modalZona:false,
        terminoBuscador:"",
        kilosTexto:"",
        facturaTexto:"",
        valor_unitarioTexto:"",
        forma_pagoTexto:"",
        novedad:"",
        fechasFiltro:["0","1"],
        inicio:0,
        final:4,
        zonaPedidos:[],
        novedades:[],           //////  guardo la cantidad de novedades de cada pedido
        top:new Animated.Value(size.height),
        elevation:7,     ////// en Android sale un error al abrir el filtro debido a la elevation
        fechaEntregaFiltro:  moment().format("YYYY-MM-DD")
	  }
	}
	 
    componentWillMount = async () =>{
        this.props.getPedidos()
        this.props.getZonasPedidos(this.state.fechaEntregaFiltro)
        this.props.getVehiculos()
        try {
            let idUsuario = await AsyncStorage.getItem('userId')
            const acceso  = await AsyncStorage.getItem('acceso')
            idUsuario = idUsuario ?idUsuario : "FAIL"
            this.setState({idUsuario, acceso})
        } catch (error) {
            console.log(error)
        }
        this.socket = SocketIOClient(URL);
        this.socket.on(`actualizaPedidos`, this.reciveMensanje.bind(this));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    
    componentWillReceiveProps(props){
        this.setState({pedidos:props.pedidos, pedidosFiltro:props.pedidos, zonaPedidos:props.zonaPedidos})   
    }    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    reciveMensanje(messages) {
        this.props.getPedidos()
	}
    callObservaciones(id){
        axios.get(`nov/novedad/byPedido/${id}`)
        .then(e=>{
            this.setState({novedades:e.data.novedad})
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            MODAL QUE MUESTRA AL LISTADO DE LAS NOVEDADES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalNovedades(){
        let { novedades, nPedido} = this.state
        return(
            <View style={style.contenedorModal2}>
                <View style={[style.subContenedorModal, {alignItems:"flex-start"}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {this.setState({showNovedades:false})}}
                        style={style.btnModalConductorClose}
                    >
                        <Icon name={'times-circle'} style={style.iconCerrar} />
                    </TouchableOpacity>
                        <Text style={style.tituloNovedades}>Novedades pedido: {nPedido}</Text>
                        <ScrollView>
                            {
                                this.state.novedades.map(e=>{
                                    return (
                                        <View key={e._id} style={style.contenedorNovedad}>
                                            <Text style={style.textNovedad}>{e.novedad}</Text>
                                            <Text style={style.textNovedad2}>{e.usuarioId ? e.usuarioId.nombre :""}</Text>       
                                            <Text style={style.textNovedad2}>{e.creado}</Text>
                                        </View>
                                    )
                                })
                            }
                            
                        </ScrollView>
                      
                </View>
            </View>
        )
    }
    renderPedidos(){
        const {acceso, terminoBuscador, pedidos, inicio, final} = this.state
        let pedidosFiltro = pedidos.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newPedidos = pedidosFiltro.slice(inicio, final)
        return newPedidos.map((e, key)=>{
            return (
                <TouchableOpacity 
                    key={key}
                    style={e.estado=="espera" 
                        ?[style.pedidoBtn, {backgroundColor:"#5bc0de"}] 
                        :e.estado=="noentregado" 
                        ?[style.pedidoBtn, {backgroundColor:"#ffffff"}] 
                        :e.estado=="innactivo" 
                        ?[style.pedidoBtn, {backgroundColor:"#d9534f"}] 
                        :e.estado=="activo" &&!e.carroId && !e.entregado 
                        ?[style.pedidoBtn, {backgroundColor:"#ffeb00"}]
                        :e.estado=="activo" && !e.entregado 
                        ?[style.pedidoBtn, {backgroundColor:"#f0ad4e"}]
                        :[style.pedidoBtn, {backgroundColor:"#5cb85c"}]
                    }
                    ////// solo activa el modal si es de despachos o administrador o conductor 
                    onPress={
                        ()=>{
                            this.callObservaciones(e._id);
                            this.setState({openModal:true, elevation:0, placaPedido:e.carroId ?e.carroId.placa :null, conductorPedido:e.conductorId ?e.conductorId.nombre :null, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, estadoEntrega:e.estado=="activo" &&"asignado", nombre:e.usuarioId.nombre, razon_social:e.usuarioId.razon_social, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone, cedula:e.usuarioId.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, imagenCerrar:e.imagenCerrar[0], factura:e.factura, kilos:e.kilos, forma_pago:e.forma_pago, valor_unitario:e.valor_unitario, nPedido:e.nPedido })
                        }                        
                    }
                >
                     {/* <Text>{e._id}</Text> */}
                   {/* <Text>{e.orden}</Text> */}
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>{e.usuarioId.razon_social}</Text>
                        <Text style={style.textPedido}>{e.usuarioId.cedula}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>N pedido</Text>
                        <Text style={style.textPedido}>{e.nPedido}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Dirección</Text>
                        <Text style={style.textPedido}>{e.puntoId ?e.puntoId.direccion :"Sin dirección"}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Zona</Text>
                        <Text style={style.textPedido}>{e.zonaId ?e.zonaId.nombre :"Sin zona"}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>CODT</Text>
                        <Text style={style.textPedido}>{e.usuarioId.codt}</Text>
                    </View>
                    {
                        acceso!=="conductor"
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Fecha de creación </Text>
                            <Text style={style.textPedido}>{e.creado}</Text>
                        </View>
                    }
                    
                    {   
                        acceso!=="conductor"
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Fecha solicitud </Text>
                            <Text style={style.textPedido}>{ e.fechaSolicitud ?e.fechaSolicitud :"sin fecha de solicitud"}</Text>
                        </View>
                    }
                     {   
                        acceso!=="conductor"
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Fecha entrega </Text>
                            <Text style={style.textPedido}>{ e.fechaEntrega ?e.fechaEntrega :"sin fecha de asignación"}</Text>
                        </View>
                    }
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Tipo de solicitud:</Text>
                        <Text style={style.textPedido}>{e.forma} 
                        {
                            e.forma=="cantidad" 
                            ?' '+Number(e.cantidadKl).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")+" KG" 
                            :e.forma=="monto" ?'$ '+Number(e.cantidadPrecio).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") :""}</Text>
                    </View>
                    {
                        (e.carroId && acceso!=="conductor")
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Vehiculo Asignado</Text>
                            <Text style={style.text}>{e.carroId.placa}</Text>
                            {/* <Text style={style.text}>{e.carroId.cedula}</Text> */}
                        </View>
                    }
                    {
                        e.factura
                        &&<View style={style.containerPedidos}>
                                <Text style={style.textPedido}>Factura N</Text>
                                <Text>{e.factura}</Text>
                            </View>
                    }
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Estado</Text>
                        {
                            e.estado=="activo" &&!e.entregado
                            ?<Text style={{fontFamily: "Comfortaa-Regular"}}>Activo</Text>
                            :e.estado=="innactivo"
                            ?<Text style={{fontFamily: "Comfortaa-Regular"}}>In Activo</Text>
                            :e.estado=="espera"
                            ?<Text style={{fontFamily: "Comfortaa-Regular"}}>Espera</Text>
                            :e.estado=="activo" &&e.entregado
                            ?<Text style={{fontFamily: "Comfortaa-Regular"}}>Entregado</Text>
                            :<Text style={{fontFamily: "Comfortaa-Regular"}}>Cerrado sin entregar</Text>
                        }
                            
                    </View>
                </TouchableOpacity>
            )
        })
    }
    showModal(){
        Animated.timing(this.state.top,{
            toValue:0,
			duration:400,
			// easing:Easing.inOut
        }).start()
        this.setState({elevation:0})
    }
    hideModal(){
        Animated.timing(this.state.top,{
            toValue:size.height,
			duration:400,
			// easing:Easing.inOut
        }).start()
        this.state.textEstado=="todos" ?this.setState({elevation:7, textEstado:""}) :this.setState({elevation:7})
	}
    modalFechaEntrega(){
        let {modalFechaEntrega, fechaEntrega} = this.state
        fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
        let diaActual =  moment().tz("America/Bogota").format('YYYY-MM-DD')
        return(
             
            <View style={style.contenedorModal2}>
                <View style={[style.subContenedorModal, {height:size.height-180}]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalFechaEntrega:false})} style={style.btnModalClose}>
                        <Icon name={'times-circle'} style={style.iconCerrar} />
                    </TouchableOpacity>
                    <Text style={style.tituloModal}>Fecha entrega</Text>
                    <Calendar
                        style={style.calendar}
                        current={fechaEntrega ?fechaEntrega :diaActual}
                        minDate={diaActual}
                        firstDay={1}
                        onDayPress={(day) => {console.log('selected day', day); this.setState({fechaEntrega:day.dateString})}}
                        markedDates={{[fechaEntrega]: {selected: true,  marked: true}}}
                    />
                </View>
                <TouchableOpacity style={style.btnGuardar} onPress={fechaEntrega ?()=>this.asignarFecha() :null}>
                    <Text style={style.textGuardar}>Guardar fecha</Text>
                </TouchableOpacity>
            </View>
                
        )
    }
    _keyboardDidShow = () => {
        this.setState({
            keyboard: true
        });
    }
    
    _keyboardDidHide = () => {
        this.setState({
            keyboard: false
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           MODAL QUE MUESTRA LA OPCION DE EDITAR UN PEDIDO
    editarPedido(){
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
        const {openModal, estado, razon_social, cedula, forma, cantidad, acceso, novedad, kilosTexto, facturaTexto, valor_unitarioTexto, height, forma_pago, forma_pagoTexto, keyboard, entregado, fechaEntrega, avatar, imagenPedido, kilos, factura, novedades, placaPedido, imagen, estadoEntrega, conductorPedido, imagenCerrar, nPedido, showNovedades } = this.state
        console.log({imagenPedido})
        let imagenPedido1 = imagenPedido ?imagenPedido.split("-") :""
        let imagenPedido2 = `${imagenPedido1[0]}Miniatura${imagenPedido1[2]}`
        let imagenCerrar1 = imagenCerrar ?imagenCerrar.split("-") :""
        let imagenCerrar2 = `${imagenCerrar1[0]}Miniatura${imagenCerrar1[2]}`
        console.log({imagenCerrar})
        return (
            <View style={style.contenedorModal}>
                {showNovedades ?this.modalNovedades() :null}
                <View style={!keyboard ?style.subContenedorModal :[style.subContenedorModal, {marginTop:acceso=="admin" ?-610: -370}]}>
                    <ScrollView onContentSizeChange={(height) => { this.setState({height}) }}  keyboardDismissMode="on-drag">
                        <TouchableOpacity activeOpacity={1} onPress={() => this.setState({openModal:false, elevation:7})} style={size.height<height ?style.btnModalClose :style.btnModalClose2}>
                            <Icon name={'times-circle'} style={style.iconCerrar} />
                        </TouchableOpacity>
                            <View style={style.containerTituloModal}>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Razón Social: {razon_social}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Cedula: {cedula}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>N Pedido: {nPedido}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Forma:  {forma}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>{cantidad &&`cantidad ${cantidad}`}</Text>
                                <TouchableOpacity style={style.btnNovedad} onPress={()=>this.setState({showNovedades:true})} >
                                    <Text style={style.txtNovedad} >Novedades: {novedades.length} </Text>
                                </TouchableOpacity>
                                {imagenPedido ?<Image source={{uri:imagenPedido2}} style={style.imagen} /> :null}

                            </View>
                        
                        {/* CAMBIAR ESTADO */}
                        {
                            acceso=="admin" || acceso=="solucion"
                            ?<View style={style.contenedorEspera}>
                                <View style={style.separador}></View>
                                <Text style={style.tituloModal}>Estado</Text>
                                <TouchableOpacity style={estado=="activo" ?[style.subContenedorEditar, style.activo] :style.subContenedorEditar} onPress={()=>this.setState({estado:"activo"})}>
                                    <Text style={style.textoEspera}>Activo</Text>
                                    {estado=="activo" &&<Icon name="check" style={style.iconEditar} />}
                                </TouchableOpacity>
                                <TouchableOpacity style={estado=="innactivo" ?[style.subContenedorEditar, style.activo] :style.subContenedorEditar} onPress={()=>this.setState({estado:"innactivo"})}>
                                    <Text style={style.textoEspera}>In activo</Text>
                                    {estado=="innactivo" &&<Icon name="check" style={style.iconEditar} />}
                                </TouchableOpacity>
                                <TouchableOpacity style={estado=="espera" ?[style.subContenedorEditar, style.activo] :style.subContenedorEditar} onPress={()=>this.setState({estado:"espera"})}>
                                    <Text style={style.textoEspera}>Espera</Text>
                                    {estado=="espera" &&<Icon name="check" style={style.iconEditar} />}
                                </TouchableOpacity>
                                <TouchableOpacity style={style.btnGuardar2} onPress={()=>this.handleSubmit()}>
                                    <Text style={style.textGuardar}>Cambiar Estado</Text>
                                </TouchableOpacity>
                            </View>
                            :null
                        }
                        {/* ASIGNAR USUARIOS TIPO  */}
                        {
                            (acceso=="admin" || acceso=="despacho") && estadoEntrega=="asignado"
                            ?<View>
                                <View style={style.separador}></View>
                                <Text style={style.tituloModal}>Asignar Vehiculo y fecha</Text>
                                {placaPedido &&<Text style={style.tituloModal}>{placaPedido} - {conductorPedido}</Text>}
                                <TouchableOpacity style={[style.btnGuardar2, {flexDirection:"row", left:45}]} onPress={()=>this.setState({modalConductor:true})}>
                                    <Text style={style.textGuardar}>Asignar</Text>
                                    <Icon name="user" style={style.iconBtnGuardar} />
                                </TouchableOpacity>   
                            </View>
                            :null
                        }
                        {/* CERRAR PEDIDO  */}
                        {
                            acceso=="cliente" && entregado
                            &&<View>
                                <View style={style.separador}></View>
                                <Text style={style.tituloModal}>Pedido Cerrado</Text>
                                <View style={style.pedido}>
                                {
                                    imagenCerrar
                                    &&<ImageProgress 
                                        resizeMode="cover" 
                                        renderError={ (err) => { return (<ImageProgress source={require('../../assets/img/filtro.png')} imageStyle={{height: 40, width: 40, borderRadius: 10, left:-30, top:5}}  />) }} 
                                        source={{ uri:  imagenCerrar}} 
                                        indicator={{
                                            size: 20, 
                                            borderWidth: 0,
                                            color: '#ffffff',
                                            unfilledColor: '#ffffff'
                                            }} 
                                        style={style.imagen}
                                    />
                                }
                                </View>
                                <View style={style.pedido}>
                                    <Text>Kilos: </Text>
                                    <Text>{kilos}</Text>
                                </View>
                                <View style={style.pedido}>
                                    <Text>Factura: </Text>
                                    <Text>{factura}</Text>
                                </View>
                                <View style={style.pedido}>
                                    <Text>Valor unitario: </Text>
                                    <Text>{forma_pago}</Text>
                                </View>
                                <View style={style.pedido}>
                                    <Text>Forma de pago: </Text>
                                    <Text>{forma_pago}</Text>
                                </View>
                            </View>
                        }
                        {
                            (acceso=="admin" || acceso=="conductor") && fechaEntrega
                            ?<View>
                                {
                                    entregado
                                    ?<View>
                                        <View style={style.separador}></View>
                                        <Text style={style.tituloModal}>Pedido Cerrado</Text>
                                        <View style={style.pedido}>
                                        {
                                            imagenCerrar
                                            &&<ImageProgress 
                                                resizeMode="cover" 
                                                renderError={ (err) => { return (<ImageProgress source={require('../../assets/img/filtro.png')} imageStyle={{height: 40, width: 40, borderRadius: 10, left:-30, top:5}}  />) }} 
                                                source={{ uri:  imagenCerrar2}} 
                                                indicator={{
                                                    size: 20, 
                                                    borderWidth: 0,
                                                    color: '#ffffff',
                                                    unfilledColor: '#ffffff'
                                                    }} 
                                                style={style.imagen}
                                            />
                                        }
                                        </View>
                                        <View style={style.pedido}>
                                            <Text>Kilos: </Text>
                                            <Text>{kilos}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text>Factura: </Text>
                                            <Text>{factura}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text>Valor unitario: </Text>
                                            <Text>{forma_pago}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text>Forma de pago: </Text>
                                            <Text>{forma_pago}</Text>
                                        </View>
                                    </View>
                                    :<View style={style.contenedorCerrarPedido}>
                                        <View style={style.separador}></View>
                                        <Text style={style.tituloModal}>Cerrar Pedido</Text>
                                        <TomarFoto 
                                            source={avatar}
                                            width={100}
                                            limiteImagenes={3}
                                            imagenes={(imagen) => {  this.setState({imagen}) }}
                                        /> 
                                        <TextInput
                                            placeholder="N Kilos"
                                            autoCapitalize = 'none'
                                            onChangeText={(kilosTexto)=> this.setState({ kilosTexto })}
                                            value={kilosTexto}
                                            keyboardType='numeric'
                                            placeholderTextColor="#aaa" 
                                            style={[style.inputTerminarPedido, {marginTop:20}]}
                                        />
                                        <TextInput
                                            placeholder="N Factura"
                                            autoCapitalize = 'none'
                                            placeholderTextColor="#aaa" 
                                            onChangeText={(facturaTexto)=> this.setState({ facturaTexto })}
                                            value={facturaTexto}
                                            style={style.inputTerminarPedido}
                                        />
                                        <TextInput
                                            placeholder="Valor Unitario"
                                            autoCapitalize = 'none'
                                            keyboardType='numeric'
                                            placeholderTextColor="#aaa" 
                                            onChangeText={(valor_unitarioTexto)=> this.setState({ valor_unitarioTexto })}
                                            value={valor_unitarioTexto}
                                            style={style.inputTerminarPedido}
                                        />
                                        <View style={style.contenedorSelect}>
                                            <RNPickerSelect
                                                placeholder={{
                                                    label: 'Forma de pago',
                                                    value: null,
                                                    color: '#00218b',
                                                }}
                                                items={[
                                                    {label: 'Contado', value: 'Contado'},
                                                    {label: 'Credito', value: 'Credito'},
                                                    
                                                ]}
                                                onValueChange={forma_pagoTexto => {this.setState({ forma_pagoTexto })}}
                                                mode="dropdown"
                                                style={{
                                                    // ...style,
                                                    placeholder: {
                                                    color: 'rgba(0,0,0,.4)',
                                                    fontSize: 14,
                                                    },
                                                }}
                                                value={forma_pagoTexto}
                                            />  
                                        </View>
                                                
                                        <TextInput
                                            placeholder="Novedades"
                                            autoCapitalize = 'none'
                                            onChangeText={(novedad)=> this.setState({novedad})}
                                            value={novedad}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={style.inputNovedad}
                                            placeholderTextColor="#aaa" 
                                            onSubmitEditing={Keyboard.dismiss}
                                        />
                                        <View style={style.contenedorConductor}>
                                            <TouchableOpacity 
                                                style={kilosTexto.length<1 || facturaTexto.length<1 || forma_pagoTexto.length<1 || valor_unitarioTexto.length<1 || novedad.length<1 || !imagen
                                                ?style.btnDisable3 :style.btnGuardar3} 
                                                onPress={
                                                    kilosTexto.length<1 || facturaTexto.length<1 || forma_pagoTexto.length<1  || valor_unitarioTexto.length<1  || novedad.length<1 || !imagen
                                                    ?()=>alert("llene todos los campos")
                                                    :()=>this.cerrarPedido()
                                                }
                                            >
                                                <Text style={style.textGuardar}>Cerrar Pedido</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={ novedad.length<4 ?style.btnDisable3 :style.btnGuardar3} 
                                                onPress={()=>novedad.length<4 ?alert("Inserte alguna novedad") :this.setState({modalPerfiles:true})}>
                                                <Text style={style.textGuardar}>Guardar novedad, sin cerrar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                                
                            </View>
                            :null
                        }
                        
                    </ScrollView>
                </View>                   
                        
            </View>
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           MODAL QUE MUESTRA LA OPCION DE EDITAR UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalZonas(){
        const {modalZona, zonas, idZona, zonaPedidos} = this.state
        console.log(zonaPedidos)
        return(
            <Modal transparent visible={modalZona} animationType="fade" >
                <TouchableOpacity activeOpacity={1}  >   
                    <View style={style.modalZona}>
                        <View style={style.subModalZona}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalZona:false})} style={style.btnModalClose}>
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.tituloModal}>Total pedidos Zona</Text>
                            <ScrollView>
                                {
                                    zonaPedidos.map((e, key)=>{
                                        return(
                                            <TouchableOpacity key={key} onPress={()=>this.actualizaZona(e._id, e.nombre)}
                                                style={
                                                    (e.total>3 && e.total<=5) ?[style.btnZona,{backgroundColor:"#F59F24"}]
                                                    :e.total>5 ?[style.btnZona,{backgroundColor:"#F55024"}]
                                                    :[style.btnZona,{backgroundColor:"#42DF18"}]
                                                }
                                            >
                                                <Text style={style.textZona}>{e._id}</Text>
                                                <Text style={style.textZona}>{e.total}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           RENDER MODAL FILTROS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    renderModalFiltro(){
        let {fechaEntregaFiltro, textEstado, fechaSolicitudFiltro} = this.state
		return(
			<Animated.View style={[style.modal, {top:this.state.top}]}>
				<View style={style.cabezera}>
					<TouchableOpacity style={style.btnRegresar} onPress={()=>this.hideModal()}>
						<Icon name={'arrow-left'} style={style.iconFiltro} />
					</TouchableOpacity>
					<Text style={style.btnRegresar}>
						Filtros de búsqueda
					</Text>
                    <TouchableOpacity style={style.btnLimpiar} onPress={()=>this.limpiar()}>
                        <Text style={style.textoLimpiar}>Limpiar</Text>	
                        {textEstado=="todos" &&<Icon name={'check'} style={style.iconFiltro} />}
                    </TouchableOpacity>
				</View>
				<ScrollView>
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Estado</Text>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarTabla("innactivo")}>
							<Text style={style.textoFiltro}>Innactivo</Text>	
                            {textEstado=="innactivo" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarTabla("espera")}>
							<Text style={style.textoFiltro}>Espera</Text>	
                            {textEstado=="espera" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarTabla2("activo", false, "activo")}>
							<Text style={style.textoFiltro}>Activo</Text>	
                            {textEstado=="activo" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarTabla2("activo", true, "asignado")}>
							<Text style={style.textoFiltro}>Asignado</Text>	
                            {textEstado=="asignado" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarTabla3("activo", "entregado")}>
							<Text style={style.textoFiltro}>Entregado</Text>	
                            {textEstado=="entregado" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarTabla("noentregado")}>
							<Text style={style.textoFiltro}>No Entregado</Text>	
                            {textEstado=="noentregado" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
					</View>
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Forma</Text>
						 <TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarForma("lleno")}>
							<Text style={style.textoFiltro}>LLeno</Text>	
                            {textEstado=="lleno" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						 <TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarForma("monto")}>
							<Text style={style.textoFiltro}>Monto</Text>	
                            {textEstado=="monto" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						 <TouchableOpacity style={style.btnFiltro} onPress={()=>this.actualizarForma("cantidad")}>
							<Text style={style.textoFiltro}>Cantidad</Text>	
                            {textEstado=="cantidad" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
					</View> 
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Fecha entrega</Text>
                        <Calendar
                            current={fechaEntregaFiltro}
                            markedDates={this.state.dates} 
                            onDayPress={(day) => {console.log('selected day', day); this.actualizarFechaEntrega(day.dateString)}}
                            markedDates={{[fechaEntregaFiltro]: {selected: true,  marked: true}}}
                            // markingType={'period'}
                            // onDayPress={(date)=>this.onSelectDay(date.dateString)}
                            // markedDates={{
                            //     [fechasFiltro[0]]: {startingDay: true, color: 'green'},
                            //     [fechasFiltro[1]]: {endingDay: true, color: 'green'} 
                            // }}
                        />
					</View>
                    <View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Fecha solicitud</Text>
                        <Calendar
                            current={fechaSolicitudFiltro}
                            markedDates={this.state.dates} 
                            onDayPress={(day) => {console.log('selected day', day); this.actualizarFechaSolicitud(day.dateString)}}
                            markedDates={{[fechaSolicitudFiltro]: {selected: true,  marked: true}}}
                        />
					</View>
				</ScrollView>
			</Animated.View>
		)
    }
    actualizarTabla(filtro){
        let {pedidos, pedidosFiltro} = this.state
        pedidos = pedidosFiltro.filter(e=>{
          return e.estado==filtro
        })
        this.setState({pedidos, textEstado:filtro})
    }
    actualizarTabla2(filtro, filtro2, textEstado){
        let {pedidos, pedidosFiltro} = this.state
        if(filtro2){
          pedidos = pedidosFiltro.filter(e=>{
            return e.estado==filtro &&e.carroId
          })
        }else{
          pedidos = pedidosFiltro.filter(e=>{
            return e.estado==filtro &&!e.carroId
          })
        }
       this.setState({pedidos, textEstado})
    }
    actualizarTabla3(filtro, textEstado){
        let {pedidos, pedidosFiltro} = this.state
        pedidos = pedidosFiltro.filter(e=>{
          return e.estado==filtro &&e.entregado
        })
        this.setState({pedidos, textEstado})
    }
    actualizarForma(filtro){
        let {pedidos, pedidosFiltro} = this.state
        pedidos = pedidosFiltro.filter(e=>{
          return e.forma==filtro
        })
        this.setState({pedidos, textEstado:filtro})
    }
    actualizarFechaEntrega(filtro){
        this.props.getZonasPedidos(filtro) 
        this.props.getPedidos(filtro) 
        this.setState({fechaEntregaFiltro:filtro})
    }
    actualizarFechaSolicitud(filtro){ 
        axios.get(`zon/zona/pedidoSolicitud/${filtro}`)
        .then(res => {
            console.log(res.data)
            this.setState({fechaSolicitudFiltro:filtro, zonaPedidos:res.data.zona})
        })
        let {pedidos, pedidosFiltro, acceso} = this.state
        pedidos = pedidosFiltro.filter(e=>{
          return e.fechaSolicitud==filtro
        })
        this.setState({pedidos})  
    }
    limpiar(){
        this.setState({pedidos:this.state.pedidosFiltro, textEstado:"todos"})
        this.props.getPedidos() 
        this.props.getZonasPedidos(moment().format("YYYY-MM-DD")) 
    }
    onScroll(e) {
		const {final} =  this.state
		let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;
        if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            this.setState({final:final+5, showSpin:true})
            this.myInterval = setInterval(()=>this.setState({showSpin:false}), 2000)
            // clearInterval(this.myInterval);
        }
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            MODAL QUE MUESTRA AL LISTADO DE LOS CONDUCTORES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalVehiculos(){
        let {idVehiculo, modalConductor, showCalendar, fechaEntrega, placa} = this.state
        fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
        let diaActual =  moment().tz("America/Bogota").format('YYYY-MM-DD')
        return(
            <View style={style.contenedorModal2}>
                <View style={style.subContenedorModal}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {this.setState({modalConductor:false, placa:null, idVehiculo:null})}}
                        style={style.btnModalConductorClose}
                    >
                        <Icon name={'times-circle'} style={style.iconCerrar} />
                    </TouchableOpacity>
                    <View style={style.contenedorConductor}>
                        <Button title="Asignar Vehiculo" disabled={!showCalendar ? true :false} onPress={()=>this.setState({showCalendar:false})} />
                        <Button title="Fecha entrega" disabled={showCalendar ? true :false}  onPress={()=>this.setState({showCalendar:true})} />
                    </View>
                    {
                        showCalendar
                        ?<View>
                            <Calendar
                                style={style.calendar}
                                current={fechaEntrega ?fechaEntrega :diaActual}
                                minDate={diaActual}
                                firstDay={1}
                                onDayPress={(day) => {console.log('selected day', day); this.setState({fechaEntrega:day.dateString})}}
                                markedDates={{[fechaEntrega]: {selected: true,  marked: true}}}
                            />
                            <TouchableOpacity style={style.btnGuardar} onPress={()=>this.asignarFecha()}>
                                <Text style={style.textGuardar}>Guardar fecha</Text>
                            </TouchableOpacity>
                        </View>    
                        :<ScrollView>
                            {
                                this.props.vehiculos.map(e=>{
                                    return <TouchableOpacity
                                            key={e._id}
                                            style={idVehiculo == e._id ?[style.contenedorConductor, {backgroundColor:"#5cb85c"}] :style.contenedorConductor}
                                            onPress={()=>this.setState({
                                                idVehiculo:e._id, 
                                                placa:e.placa, 
                                                placaPedido:e.placa, 
                                                conductorPedido:e.conductor.nombre ?e.conductor.nombre :""
                                            })}
                                        >
                                        <Text style={style.conductor}>{e.placa}</Text>       
                                        <Text style={style.conductor}>{e.conductor ? e.conductor.nombre :""}</Text>       
                                        {e.conductor &&<Image source={{uri:e.conductor.avatar}} style={style.avatar} /> }
                                    </TouchableOpacity>
                                })
                            }
                            <TouchableOpacity style={style.btnGuardar} onPress={()=>placa ?this.asignarConductor() :alert("selecciona un Vehiculo")}>
                                <Text style={style.textGuardar}>Asignar Vehiculo</Text>
                            </TouchableOpacity>  
                        </ScrollView>
                    }    
                </View>
            </View>
              
        )
    }
    renderCabezera(){
        const {terminoBuscador, elevation, acceso, fechaEntregaFiltro, pedidos} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <View style={{flexDirection:"row"}}>
                    {
                        pedidos &&<Text style={style.titulo}>Pedidos:{pedidos.length} {acceso=="conductor" &&": "+moment(fechaEntregaFiltro).format("YYYY-MM-DD")}</Text>
                    }
                    <TouchableOpacity style={style.btnZonas} onPress={()=>this.setState({modalZona:true})}>
                        <Text style={style.textZonas}>Zonas</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.subContenedorCabezera}>
                    {   
                        acceso!=="conductor"
                        &&<TextInput
                            placeholder="Buscar por: cliente, fecha, forma"
                            placeholderTextColor="#aaa" 
                            autoCapitalize = 'none'
                            onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                            value={terminoBuscador}
                            style={[style.inputCabezera, {elevation}]}
                        />
                    }
                    {   
                        (acceso=="conductor" ||  acceso=="cliente")
                        ?null
                        :<TouchableOpacity style={style.btnFiltro} onPress={()=>this.showModal()}>
                            <Image source={require("../../assets/img/filtro.png")} style={style.imgFiltro} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
    modalNovedad(){
        const {novedad} = this.state
        return(<View style={style.contenedorModal2}>
            <View style={style.subContenedorModal}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {this.setState({modalNovedad:false, placa:null, idVehiculo:null})}}
                    style={style.btnModalConductorClose}
                >
                    <Icon name={'times-circle'} style={style.iconCerrar} />
                </TouchableOpacity>
                <Text>Novedad Innactividad</Text>
                <TextInput
                    placeholder="Novedades"
                    placeholderTextColor="#aaa" 
                    autoCapitalize = 'none'
                    onChangeText={(novedad)=> this.setState({novedad})}
                    value={novedad}
                    multiline={true}
                    numberOfLines={5}
                    style={style.inputNovedad}
                />
                 <TouchableOpacity style={style.btnGuardar} onPress={()=>novedad.length<5 ?alert("Inserta alguna novedad") :this.guardarNovedadInnactivo()}>
                    <Text style={style.textGuardar}>Guardar Novedad</Text>
                </TouchableOpacity>  
            </View>
        </View>)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            MODAL QUE MUESTRA LOS PERFILES CUANDO NO SE CIERRA UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalPerfiles(){
        const {novedad, perfil} = this.state
        return(<View style={style.contenedorModal2}>
            <View style={style.subContenedorModal2}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {this.setState({modalPerfiles:false, placa:null, idVehiculo:null})}}
                    style={style.btnModalConductorClose}
                >
                    <Icon name={'times-circle'} style={style.iconCerrar} />
                </TouchableOpacity>
                <Text>Asignar novedad</Text>
                <TouchableOpacity style={perfil=="logistica" ?style.listadoPerfil :style.listadoPerfil2} onPress={()=>this.setState({perfil:"logistica"})}>
                   <Text>Logistica</Text>
                </TouchableOpacity>
                <TouchableOpacity style={perfil=="comercial" ?style.listadoPerfil :style.listadoPerfil2} onPress={()=>this.setState({perfil:"comercial"})}>
                   <Text>Comercial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={perfil=="cliente" ?style.listadoPerfil :style.listadoPerfil2} onPress={()=>this.setState({perfil:"cliente"})}>
                   <Text>Cliente</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={style.btnGuardar} onPress={()=>novedad.length<5 ?alert("Seleccione algun perfil") :this.guardarNovedad()}>
                    <Text style={style.textGuardar}>Cerrar Pedido</Text>
                </TouchableOpacity>  
            </View>
        </View>)
    }

	render(){
        const {navigation} = this.props
        const {idUsuario, pedidos, fechaEntrega, openModal, modalFechaEntrega, modalConductor, modalNovedad, showSpin, modalPerfiles} = this.state
        
        return (
            <View style={style.container}>
                {modalPerfiles &&this.modalPerfiles()}
                {modalConductor &&this.modalVehiculos()}
                {modalFechaEntrega &&this.modalFechaEntrega()}
                {modalNovedad &&this.modalNovedad()}
                {this.renderCabezera()}
                {this.renderModalFiltro()}
                {this.modalZonas()}
                {openModal &&this.editarPedido()}
                <ScrollView style={style.subContenedor} onScroll={(e)=>this.onScroll(e)} >
                    {/* {
                        pedidos.length==0
                        ?<Text style={style.sinPedidos}>No hemos encontrado pedidos</Text>
                        :this.renderPedidos()
                    } */}
                    {
                        !pedidos
                        ?<ActivityIndicator color="#00218b" />
                        :pedidos.length==0
                        ?<Text style={style.sinPedidos}>No hemos encontrado pedidos</Text>
                        :this.renderPedidos()
                    }
                </ScrollView>
                    {showSpin &&<ActivityIndicator color="#0071bb" style={style.preload}/> }
                <Footer navigation={navigation} />
            </View>
        )    
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           GUARDAR NOVEDAD CUANDO ES INNACTIVO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    guardarNovedadInnactivo(){
        let {novedad, id} = this.state
        axios.post(`nov/novedad/`, {pedidoId:id, novedad})
        .then((res2)=>{
            this.setState({modalNovedad:false, estadoEntrega:"noentregado", novedad:""})
            setTimeout(() => {
                alert("Pedido actualizado")
            }, 1000);
            // this.props.getPedidos(moment(fechaEntregaFiltro).valueOf())
            this.props.getPedidos()
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ASIGNO UN CONDUCTOR A UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    asignarConductor(){
        const {placa, idVehiculo, id, fechaEntrega, nPedido} = this.state
        Alert.alert(
            `Seguro desea agregar a ${placa}`,
            'a este pedido',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, placa:null, idVehiculo:null})},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}/${fechaEntrega}/${nPedido}`)
            .then((res)=>{
                if(res.data.status){
                    this.props.getPedidos()
                    alert("Vehiculo Agregado con exito")
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ASIGNO FECHA DE ENTREGA A UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    asignarFecha(){
        const {fechaEntrega, id} = this.state
        fechaEntrega
        ?Alert.alert(
            `Seguro desea asignar el dia: ${fechaEntrega}`,
            'a este pedido',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, placa:null})},
            ],
            {cancelable: false},
        )
        :alert("Seleccione una fecha de asignación")
        const confirmar =()=>{
            axios.get(`ped/pedido/asignarFechaEntrega/${id}/${fechaEntrega}`)
            .then((res)=>{
                if(res.data.status){
                    this.setState({modalFechaEntrega:false, novedad:""})
                    setTimeout(() => {
                        Toast.show("Fecha agregada con exito", Toast.LONG)
                    }, 1000);
                    this.props.getPedidos()
                }else{
                    console.log(res.data)
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           GUARDAR NOVEDAD AL CERRAR EL PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    guardarNovedad(){
        let {novedad, id, tokenPhone, fechaEntrega, perfil} = this.state
        Alert.alert(
            `Va a finalizar este pedido`,
            'sin exito en la entrega',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
              {text: 'Cancelar', onPress: () => console.log("cerrado")},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.post('ped/pedido/novedad', {_id:id, fechaEntrega, novedad, perfil_novedad:perfil})
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    axios.post(`nov/novedad/`, {pedidoId:id, novedad})
                    .then((res2)=>{
                        this.setState({openModal:false, novedad:"", modalPerfiles:false})
                        sendRemoteNotification(2, tokenPhone, "pedido no entregado", `${novedad}`, null, null, null )
                        setTimeout(() => {
                            alert("Pedido cerrado")
                        }, 1000);
                        // this.props.getPedidos(moment(fechaEntregaFiltro).valueOf())
                        this.props.getPedidos()
                    })
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           CERRAR PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    cerrarPedido(){
        let {novedad, kilosTexto, facturaTexto, forma_pagoTexto, valor_unitarioTexto, id, tokenPhone, imagen, email, fechaEntrega, fechaEntregaFiltro} = this.state
        Alert.alert(
            `Seguro desea cerrar este pedido`,
            '',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
              {text: 'Cancelar', onPress: () => console.log("cerrado")},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            let data = new FormData();
            imagen.forEach(e=>{
                data.append('imagen', e);
            })
            // imagen = imagen[0]
            // data.append('imagen', imagen);
            data.append('email', email);
            data.append('_id', id);
            data.append('kilos', kilosTexto);
            data.append('factura', facturaTexto);
            data.append('valor_unitario', valor_unitarioTexto);
            data.append('forma_pago', forma_pagoTexto);
            data.append('fechaEntrega', fechaEntrega);
            
            axios({
                method: 'post',  
                url: 'ped/pedido/finalizar/true',
                data: data,
            })
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    axios.post(`nov/novedad/`, {pedidoId:id, novedad})
                    .then((res2)=>{
                        this.setState({openModal:false, novedad:"", kilosTexto:"", facturaTexto:"", valor_unitarioTexto:"", id:"", fechaEntrega:""})
                        sendRemoteNotification(2, tokenPhone, "pedido entregado", `Su pedido ha sido entregado`, null, null, null )
                        setTimeout(() => {
                            alert("Pedido cerrado")
                        }, 1000);
                        this.props.getPedidos()
                    })
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            CAMBIO EL ESTADO DEL PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    handleSubmit(){
        const {id, estado} = this.state
        axios.get(`ped/pedido/cambiarEstado/${id}/${estado}`)
        .then(res=>{
            console.log(res.data)
            if(res.data.status){
                if(estado=="activo"){
                    this.setState({modalFechaEntrega:true, estadoEntrega:"asignado"})
                }else if(estado=="innactivo"){
                    this.setState({modalNovedad:true})
                } else{
                    alert("Pedido actualizado")
                    this.props.getPedidos()
                }
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }    
}

const mapState = state => {
    let vehiculos = state.vehiculo.vehiculos.filter(e=>{
        return e.conductor!=null
    })
    console.log(state.pedido.pedidos)
	return {
        pedidos: state.pedido.pedidos,
        vehiculos:vehiculos,
        zonaPedidos:state.pedido.zonaPedidos,
	};
};
  
const mapDispatch = dispatch => {
    return {
        getPedidos: (fechaEntrega) => {
            dispatch(getPedidos(fechaEntrega));
        },
        getZonasPedidos: (fechaEntrega) => {
            dispatch(getZonasPedidos(fechaEntrega));
        },
        getVehiculos: () => {
            dispatch(getVehiculos());
        },
    };
};
  
Pedido.defaultProps = {
    pedidos:[],
    vehiculos:[]
};

Pedido.propTypes = {
    
};
  
export default connect(
	mapState,
	mapDispatch
)(Pedido);  