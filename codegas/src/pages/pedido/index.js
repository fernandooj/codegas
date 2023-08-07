import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated, Keyboard} from 'react-native'
import moment 			   from 'moment'
import axios               from 'axios';
import RNPickerSelect      from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar, LocaleConfig}     from 'react-native-calendars';
import { connect }         from "react-redux";
import ImageProgress 	   from 'react-native-image-progress';
import Footer              from '../components/footer'
import {getPedidos} from '../../redux/actions/pedidoActions' 
 
import TomarFoto           from "../components/tomarFoto";
import {DataContext} from "../../context/context"
import {style}             from './style'
 
LocaleConfig.locales['es'] = {
    monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthNamesShort: ['Ener.','Febr.','Marzo.','Abril.','Mayo.','Jun.','Jul.','Agos','Sept.','Oct.','Nov.','Dic.'],
    dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
    dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.'],
    today: 'Hoy'
  };
LocaleConfig.defaultLocale = 'es';

let size  = Dimensions.get('window');
function parseNumber(strg) {
    var strg = strg || "";
    var decimal = '.';
    strg = strg.replace(/[^0-9$.,]/g, '');
    if(strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
    if((strg.match(new RegExp("\\" + decimal,"g")) || []).length > 1) decimal="";
    if (decimal != "" && (strg.length - strg.indexOf(decimal) - 1 == 3) && strg.indexOf("0" + decimal)!==0) decimal = "";
    strg = strg.replace(new RegExp("[^0-9$" + decimal + "]","g"), "");
    strg = strg.replace(',', '.');
    return parseFloat(strg);
} 

class Pedido extends Component{
    static contextType = DataContext;
	constructor(props) {
	  super(props);
	  this.state={
        openModal:false,
        modalConductor:false,
        modalFechaEntrega:false,
        modalZona:false,
        terminoBuscador:undefined,
        kilosTexto:"",
        remisionTexto:"",
        facturaTexto:"",
        valor_totalTexto:"",
        forma_pagoTexto:"",
        novedad:"",
        fechasFiltro:["0","1"],
        inicio:0,
        final:false,
        limit:20,
        zonaPedidos:[],
        avatar:[],
        novedades:[],           //////  guardo la cantidad de novedades de cada pedido
        top: new Animated.Value(size.height),
        elevation:7,     ////// en Android sale un error al abrir el filtro debido a la elevation
        fechaEntregaFiltro:  moment().format("YYYY-MM-DD")
	  }
	}
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pedidos !== prevState.pedidos) {
          return { pedidos: nextProps.pedidos, pedidosFiltro: nextProps.pedidos };
        }
        return null;
      }
    
      componentDidMount = async () =>{
        const value = this.context;
        const {acceso, userId: idUsuario} = value
        this.setState({idUsuario, acceso})
        // this.socket = SocketIOClient(URL);
        // this.socket.on(`actualizaPedidos`, this.reciveMensanje.bind(this));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    
    // componentWillReceiveProps(props){
    //     this.setState({pedidos:props.pedidos, pedidosFiltro:props.pedidos})   
    // }    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
                                            <Text style={style.textNovedad2}>{e.nombre}</Text>       
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
        const {acceso, terminoBuscador, pedidos, inicio, final, limit} = this.state
 
  
        return pedidos.map((e, key)=>{
            return (
                <TouchableOpacity 
                    key={key}
                    style={e.estado=="espera" 
                        ?[style.pedidoBtn, {backgroundColor:"rgba(91, 192, 222, 0.79)"}] 
                        :e.estado=="noentregado" 
                        ?[style.pedidoBtn, {backgroundColor:"#ffffff"}] 
                        :e.estado=="innactivo" 
                        ?[style.pedidoBtn, {backgroundColor:"rgba(217, 83, 79, 0.79)"}] 
                        :e.estado=="activo" &&!e.carroId && !e.entregado 
                        ?[style.pedidoBtn, {backgroundColor:"rgba(255, 235, 0, 0.79)"}]
                        :e.estado=="activo" && !e.entregado 
                        ?[style.pedidoBtn, {backgroundColor:"rgba(240, 173, 78, 0.79)"}]
                        :[style.pedidoBtn, {backgroundColor:"rgba(92, 184, 92, 0.79)",  }]
                    }
                    ////// solo activa el modal si es de despachos o administrador o conductor 
                    onPress={
                        ()=>{
                            this.callObservaciones(e._id);
                            this.setState({
                                openModal:true, elevation:0, 
                                placaPedido:e.placa, 
                                conductorPedido:e.conductor,
                                valor_unitarioUsuario:e.valorUnitarioUsuario ?e.valorUnitarioUsuario :e.valorUnitario, 
                                imagenPedido:e.imagen, fechaEntrega:e.fechaentrega, id:e._id, estado:e.estado, estadoEntrega:e.estado=="activo" &&"asignado", usuarioId:e.usuarioId, nombre:e.nombre, razon_social:e.razon_social, codt:e.codt, email:e.email, tokenPhone:e.tokenPhone, cedula:e.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, imagenCerrar:e.imagenCerrar, factura:e.factura, kilos:e.kilos, remision:e.remision, forma_pago:e.forma_pago, valor_total:e.valor_total, nPedido:e.nPedido, estadoInicial:e.estado, capacidad:e.capacidad,
                                cantidadKl:e.cantidadKl,
                                cantidadPrecio:e.cantidadPrecio,
                                observacion:e.observacion,  puntoId:e.puntoId, usuarioCrea:e.nombre, creado:e.creado })
                        }                        
                    }
                >
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>{e.razon_social}</Text>
                        <Text style={style.textPedido}>{e.cedula}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>N pedido</Text>
                        <Text style={style.textPedido}>{e._id}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Dirección</Text>
                        <Text style={style.textPedido}>{e.direccion ?e.direccion :"Sin dirección"}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Zona</Text>
                        <Text style={style.textPedido}>{e.zonaId ?e.zonaId.nombre :"Sin zona"}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>CODT</Text>
                            <Text style={style.textPedido}>{e.codt}</Text>
                    </View>
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
                            <Text style={style.textPedido}>{ e.fechaEntrega ?e.fechaEntrega :"sin fecha"}</Text>
                        </View>
                    }
                     
                    {
                        e.capacidad
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Almacenamiento galones </Text>
                            <Text style={style.textPedido}>{ e.capacidad ?e.capacidad :"0"}</Text>
                        </View>
                    }

                    {
                        e.valorunitario
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Valor Unitario </Text>
                            <Text style={style.textPedido}>{'$ '+Number(e.valorunitario ?e.valorunitario :0).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                        </View>
                    }
                    
                    {
                        (e.conductor && acceso!=="conductor")
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Vehiculo Asignado</Text>
                            <Text style={style.text}>{e.conductor}</Text>
    
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
        // fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
        let diaActual =  moment().format('YYYY-MM-DD')
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarPedido(){
        let {estado, razon_social, cedula, forma, id, acceso, novedad,remision, remisionTexto, kilosTexto, facturaTexto, valor_totalTexto, valor_total, height, forma_pago, forma_pagoTexto, keyboard, entregado, fechaEntrega, avatar, imagenPedido, kilos, factura, novedades, placaPedido, imagen, estadoEntrega, conductorPedido, imagenCerrar, nPedido, showNovedades, capacidad, creado, codt, usuarioCrea, observacion, usuarioId, puntoId, cantidadKl, cantidadPrecio } = this.state
        kilosTexto =kilosTexto.replace(/[A-Za-z$-]/g, "");
        kilosTexto=kilosTexto.replace(",", "");
        kilosTexto = kilosTexto==="NaN" ?"" :kilosTexto

        valor_totalTexto =valor_totalTexto.replace(/[A-Za-z$-]/g, "");
        valor_totalTexto=valor_totalTexto.replace(",", "");
        valor_totalTexto=parseInt(valor_totalTexto).toFixed(0);
        valor_totalTexto = valor_totalTexto==="NaN" ?"" :valor_totalTexto


        let imagenPedido1 = imagenPedido ?imagenPedido.split("-") :""
        let imagenPedido2 = `${imagenPedido1[0]}Miniatura${imagenPedido1[2]}`
        let imagenCerrar1 = imagenCerrar ?imagenCerrar.split("-") :""
        imagenCerrar = `${imagenCerrar1[0]}Miniatura${imagenCerrar1[2]}`
        let valor_unitario =Number(valor_total)/parseNumber(kilos)

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
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Cedula/NIT: {cedula}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>N Pedido: {id}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Forma: {forma}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Fecha de creación: {creado}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Usuario crea: {usuarioCrea}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Almacenamiento: {capacidad}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>Observacion: {observacion}</Text>
                                <Text style={{fontFamily: "Comfortaa-Regular"}}>
                                    {forma=="cantidad"
                                     ?`cantidad: ${cantidadKl}`
                                     :forma=="monto"
                                     &&`monto: ${cantidadPrecio}`
                                    }
                                </Text>
                                <TouchableOpacity style={style.btnEmergencia} onPress={()=>this.props.navigation.navigate("nuevoReporteEmergencia", {usuarioId, puntoId, codt, razon_social})} >
                                    <Text style={style.txtNovedad}> Crear Reporte de emergencia </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.btnNovedad} onPress={()=>this.setState({showNovedades:true})} >
                                    <Text style={style.txtNovedad} >Novedades: {novedades.length} </Text>
                                </TouchableOpacity>
                                {imagenPedido ?<Image source={{uri:imagenPedido2}} style={style.imagen} /> :null}
                            </View>
                        {/* CAMBIAR ESTADO */}
                        {
                            acceso=="admin" || acceso=="solucion" || acceso=="comercial" || acceso=="despacho"
                            ?<View style={style.contenedorEspera}>
                                <View style={style.separador}></View>
                                <Text style={style.tituloModal}>Estado</Text>
                                <TouchableOpacity style={estado=="activo" ?[style.subContenedorEditar, style.activo] :style.subContenedorEditar} onPress={()=>this.setState({estado:"activo"})}>
                                    <Text style={style.textoEspera}>Activo</Text>
                                    {estado=="activo" &&<Icon name="check" style={style.iconEditar} />}
                                </TouchableOpacity>
                                <TouchableOpacity style={estado=="innactivo" ?[style.subContenedorEditar, style.activo] :style.subContenedorEditar} 
                                    onPress={()=>(entregado==true &&estado=="activo" && (acceso!=="admin")) ?null :this.setState({estado:"innactivo"})}>
                                    <Text style={style.textoEspera}>In activo</Text>
                                    {estado=="innactivo" &&<Icon name="check" style={style.iconEditar} />}
                                </TouchableOpacity>
                                <TouchableOpacity style={estado=="espera" ?[style.subContenedorEditar, style.activo] :style.subContenedorEditar} 
                                    onPress={()=>(entregado==true &&estado=="activo"&& (acceso!=="admin")) ?null :this.setState({estado:"espera"})}>
                                    <Text style={style.textoEspera}>Espera</Text>
                                    {estado=="espera" &&<Icon name="check" style={style.iconEditar} />}
                                </TouchableOpacity>
                                {
                                    entregado==true &&estado=="activo"
                                    ?null
                                    :<TouchableOpacity style={style.btnGuardar2} onPress={()=>this.handleSubmit()}>
                                        <Text style={style.textGuardar}>Cambiar Estado</Text>
                                    </TouchableOpacity>
                                }
                                    
                                
                               
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
                                {
                                    entregado==true &&estado=="activo"
                                    ?null
                                    :<TouchableOpacity style={[style.btnGuardar2, {flexDirection:"row", left:45}]} onPress={()=>this.setState({modalConductor:true})}>
                                        <Text style={style.textGuardar}>Asignar</Text>
                                        <Icon name="user" style={style.iconBtnGuardar} />
                                    </TouchableOpacity>   
                                }
                            </View>
                            :null
                        }
                        {/* MUESTRA LA NOTIFICACION DEL PEDIDO CERRADO */}
                        {
                            (acceso=="cliente" || acceso=="veo" || acceso=="despacho") && entregado
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
                                    <Text>{valor_unitario}</Text>
                                </View>
                                <View style={style.pedido}>
                                    <Text>Remisión: </Text>
                                    <Text>{remision}</Text>
                                </View>
                                <View style={style.pedido}>
                                    <Text style={style.txtPedidoFinalizado}>Total: </Text>
                                    <Text style={style.txtPedidoFinalizado}>
                                        {'$ '+Number(valor_total).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                    </Text>
                                </View>
                                <View style={style.pedido}>
                                    <Text>Forma de pago: </Text>
                                    <Text>{forma_pago}</Text>
                                </View>
                            </View>
                        }
                        {
                            (acceso=="admin" || acceso=="conductor" || acceso=="despacho") && fechaEntrega
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
                                                source={{ uri: imagenCerrar}} 
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
                                            <Text style={style.txtPedidoFinalizado}>Kilos: </Text>
                                            <Text style={style.txtPedidoFinalizado}>{kilos}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text style={style.txtPedidoFinalizado}>Factura: </Text>
                                            <Text style={style.txtPedidoFinalizado}>{factura}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text style={style.txtPedidoFinalizado}>Valor unitario: </Text>
                                            <Text style={style.txtPedidoFinalizado}>{valor_unitario}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text style={style.txtPedidoFinalizado}>Remisión: </Text>
                                            <Text style={style.txtPedidoFinalizado}>{remision}</Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text style={style.txtPedidoFinalizado}>Total: </Text>
                                            <Text style={style.txtPedidoFinalizado}>
                                                {'$ '+Number(valor_total).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                            </Text>
                                        </View>
                                        <View style={style.pedido}>
                                            <Text style={style.txtPedidoFinalizado}>Forma de pago: </Text>
                                            <Text style={style.txtPedidoFinalizado}>{forma_pago}</Text>
                                        </View>
                                    </View>
                                    :<View style={style.contenedorCerrarPedido}>
                                        <View style={style.separador}></View>
                                        <Text style={style.tituloModal}>Cerrar Pedido</Text>
                                        <TomarFoto 
                                            source={avatar}
                                            width={180}
                                            titulo="Foto de factura"
                                            limiteImagenes={1}
                                            imagenes={(imagen) => {  this.setState({imagen}) }}
                                        />
                                        {/* <Text>Valor Unitario: {'$ '+Number(valor_unitarioUsuario).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </Text> */}
                                        <TextInput
                                            placeholder="N Kilos"
                                            autoCapitalize = 'none'
                                            onChangeText={(kilosTexto)=> this.setState({ kilosTexto })}
                                            value={kilosTexto}
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
                                            placeholder="Valor total factura"
                                            autoCapitalize = 'none'
                                            keyboardType='numeric'
                                            placeholderTextColor="#aaa" 
                                            onChangeText={(valor_totalTexto)=> this.setState({ valor_totalTexto })}
                                            value={valor_totalTexto}
                                            style={style.inputTerminarPedido}
                                        />
                                         <TextInput
                                            placeholder="Remisión"
                                            autoCapitalize = 'none'
                                            keyboardType='numeric'
                                            placeholderTextColor="#aaa" 
                                            onChangeText={(remisionTexto)=> this.setState({ remisionTexto })}
                                            value={remisionTexto}
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
                                            {/* <ModalSelector
                                              style={style.btnFrecuencia}
                                              data={[
                                                {label: 'Contado', key: 'Contado'},
                                                {label: 'Credito', key: 'Credito'},
                                              ]}
                                              value={'juan'}
                                              initValue="Forma de pago"
                                              cancelText="Cancelar"
                                              onChange={({key})=>{ this.setState({forma_pagoTexto:key}) }} 
                                              selectStyle={{
                                                ...style,
                                                placeholder: {
                                                color: 'rgba(0,0,0,.4)',
                                                fontSize: 14,
                                                },
                                              }}
                                            /> */}
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
                                                style={remisionTexto.length<1 || kilosTexto.length<1 || facturaTexto.length<1 || forma_pagoTexto.length<1 || valor_totalTexto.length<2 || novedad.length<1 || !imagen
                                                ?style.btnDisable3 :style.btnGuardar3} 
                                                onPress={
                                                    remisionTexto.length<1 || kilosTexto.length<1 || facturaTexto.length<1 || forma_pagoTexto.length<1 || novedad.length<1 || !imagen
                                                    ?()=>alert("llene todos los campos")
                                                    :valor_totalTexto<100
                                                    ?()=>alert("Valor total debe ser mayor a 100")
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
                                            <TouchableOpacity key={key} onPress={()=>this.actualizaZona(e._id)}
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
    actualizaZona(nombre){
        let {pedidos, pedidosFiltro} = this.state
        pedidos = pedidosFiltro.filter(e=>{
          return e.zonaId.nombre==nombre
        })
        this.setState({pedidos})
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
        this.setState({fechaEntregaFiltro:filtro})
    }
    actualizaVehiculos(placa){
        let {pedidos, pedidosFiltro} = this.state
        pedidos = pedidosFiltro.filter(e=>{
            return e.carroId
        })
        pedidos = pedidos.filter(e=>{
            return (e.carroId!=="undefined" || e.carroId!==undefined)
        })
        pedidos = pedidos.filter(e=>{
            return e.carroId.placa==placa
        })
      
        this.setState({pedidos, modalCarrosFiltro:false, placa})
    }
    actualizarFechaSolicitud(filtro){ 
        
    }
    limpiar(){
        this.setState({pedidos:this.state.pedidosFiltro, textEstado:"todos", modalCarrosFiltro:false, placa:null})
        this.props.getPedidos() 
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            MODAL QUE MUESTRA AL LISTADO DE LOS CONDUCTORES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalVehiculos(){
        let {idVehiculo, modalConductor, showCalendar, fechaEntrega, placa} = this.state
        let diaActual =  moment().format('YYYY-MM-DD')
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
    modalCarrosFiltro(){
        let {idVehiculo, modalConductor, showCalendar, fechaEntrega, placa} = this.state
        return(
            <View style={style.contenedorModal2}>
                <View style={style.subContenedorModal}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {this.setState({modalCarrosFiltro:false, placa:null, idVehiculo:null})}}
                        style={style.btnModalConductorClose}
                    >
                        <Icon name={'times-circle'} style={style.iconCerrar} />
                    </TouchableOpacity>
                    <ScrollView>
                        {
                            this.props.vehiculos.map(e=>{
                                return <TouchableOpacity
                                        key={e._id}
                                        style={placa == e.placa ?[style.contenedorConductor, {backgroundColor:"#5cb85c"}] :style.contenedorConductor}
                                        onPress={()=>placa == e.placa ?this.limpiar() :this.actualizaVehiculos(e.placa)}
                                    >
                                    <Text style={style.conductor}>{e.placa}</Text>       
                                    <Text style={style.conductor}>{e.conductor ? e.conductor.nombre :""}</Text>       
                                    {e.conductor &&<Image source={{uri:e.conductor.avatar}} style={style.avatar} /> }
                                </TouchableOpacity>
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
  renderCabezera(){
      const {terminoBuscador, elevation, acceso, fechaEntregaFiltro, pedidos, showSearch} = this.state
      return(
          <View style={style.contenedorCabezera}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  {
                      pedidos &&<Text style={style.titulo}>Pedidos: {pedidos.length} {acceso=="conductor" &&": "+moment(fechaEntregaFiltro).format("YYYY-MM-DD")}</Text>
                  }
                  <View style={{flexDirection:'row'}}>
                      <TouchableOpacity style={style.btnReload} onPress={()=>this.reload()}>
                          <Icon name='refresh' style={style.iconReload} />
                      </TouchableOpacity>
                      <TouchableOpacity style={style.btnReload} onPress={()=>this.showModal()}>
                          <Image source={require("../../assets/img/filtro.png")} style={style.imgFiltro} />
                      </TouchableOpacity> 
                  </View>
              </View>
              <View style={style.subContenedorCabezera}>
                  {   
                    acceso!=="conductor"
                    &&<View style={{flexDirection:"row"}}>
                        <TextInput
                        placeholder="Buscar por: cliente, fecha, forma"
                        placeholderTextColor="#aaa" 
                        autoCapitalize = 'none'
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={[style.inputCabezera, {elevation}]}
                      />
                      {
                        !showSearch
                        ?<TouchableOpacity style={style.buscarCliente} onPress={()=>terminoBuscador.length>1 ?(this.loadPedidos(), this.setState({showSearch:true})) :alert("Inserte un valor") }>
                          <Icon name='search' style={style.iconSearch} />
                        </TouchableOpacity>
                        :<TouchableOpacity style={style.buscarCliente} onPress={()=>(this.setState({showSearch:false, terminoBuscador: ''}), this.reload()) }>
                          <Icon name='close' style={style.iconSearch} />
                        </TouchableOpacity>
                      }
                    </View>
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
  onScroll(event) {
    const {final, limit} =  this.state
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;
    
    if (reachedEnd && !final) {
      const value = this.context;
      this.setState({ final: true, limit: limit+10 });
      this.loadPedidos()
    } else if (!reachedEnd && final) {
      this.setState({ final: false });
    }
  }
  reload =()=>{
      this.loadPedidos('load')
      this.setState({showSpin1:true})
      setTimeout(()=> this.setState({showSpin1:false}), 1000)
      if (this.scrollViewRef) {
        this.scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
      }

  }
	render(){
    const {navigation} = this.props
    const {pedidos, openModal, modalFechaEntrega, modalConductor, modalNovedad, showSpin, showSpin1, modalPerfiles, modalCarrosFiltro, bounces} = this.state

    return (
        <View style={style.container}>
            {modalPerfiles &&this.modalPerfiles()}
            {modalConductor &&this.modalVehiculos()}
            {modalCarrosFiltro &&this.modalCarrosFiltro()}
            {modalFechaEntrega &&this.modalFechaEntrega()}
            {modalNovedad &&this.modalNovedad()}
            {this.renderCabezera()}
            {this.renderModalFiltro()}
            {this.modalZonas()}
            {openModal &&this.editarPedido()}
            <ScrollView style={style.subContenedor} onScroll={(e)=>this.onScroll(e)}  bounces={this.state.bounces} scrollEventThrottle={16}  ref={(ref) => (this.scrollViewRef = ref)}>
                {showSpin1 &&<ActivityIndicator color="#0071bb" style={style.preload1}/> }
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
                {showSpin &&<ActivityIndicator color="#0071bb" style={style.preload}/> }
            <Footer navigation={navigation} />
            <Toast />
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
            this.loadPedidos()
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ASIGNO UN CONDUCTOR A UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    asignarConductor(){
        const {placa, idVehiculo, id, fechaEntrega, idUsuario} = this.state
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
            axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}/${fechaEntrega}/${idUsuario}`)
            .then((res)=>{
                if(res.data.status){
                    this.loadPedidos()
                    // alert("Vehiculo Agregado con exito")
                    Toast.show({type: 'success', text1: 'Vehiculo Agregado con exito'})
                }else{
                    Toast.show({type: 'info', text1: 'Tenemos un problema, intentelo mas tarde'})
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
                        // Toast.show("Fecha agregada con exito", Toast.LONG)
                        Toast.show({type: 'success', text1: 'Fecha agregada con exito'})
                    }, 1000);
                    this.loadPedidos()
                }else{
                    console.log(res.data)
                    Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
                    // Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
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
                if(res.data.status){
                  Toast.show({type: 'success', text1: 'Pedido Cerrado'})
                }else{
                  Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
                }
            })
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           CERRAR PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    cerrarPedido(){
        let {novedad, kilosTexto, facturaTexto, forma_pagoTexto, valor_totalTexto, id, tokenPhone, imagen, email, fechaEntrega, remisionTexto, valor_unitarioUsuario} = this.state
       
        Alert.alert(
            `Seguro desea cerrar este pedido`,
            '',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
              {text: 'Cancelar', onPress: () => console.log("cerrado")},
            ],
            {cancelable: false},
        );

        //////  verifica que el valortotal sea de acuerdo a la operacion
        let valorDivision = valor_totalTexto/kilosTexto
        let mayor = ((valor_unitarioUsuario*0.07)+valor_unitarioUsuario)
        let menor = (valor_unitarioUsuario-(valor_unitarioUsuario*0.07))
        const confirmar = ()=>{
            if(valorDivision>mayor || valorDivision<menor ){
                Alert.alert(
                    `El valor total no corresponde, se espera valor total de ${'$ '+Number(valor_unitarioUsuario*kilosTexto).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} `,
                    'deseas continuar',
                    [
                      {text: 'Confirmar', onPress: () => confirmar1()},
                      {text: 'Cancelar', onPress: () => console.log("cerrado")},
                    ],
                    {cancelable: false},
                );
            }else{
                confirmar1()
            }
        }
        const confirmar1= async()=>{
          const data = {
            mime: "image/jpeg",
            imagenCerrar: imagen,
            _id: id,
            kilos: kilosTexto,
            factura: facturaTexto,
            valor_total: valor_totalTexto,
            forma_pago: forma_pagoTexto,
            remision: remisionTexto,
            novedadCierre: novedad
          };
          console.log(data)
        
          axios({
            method: 'post',  
            url: `ped/pedido/finalizar/${id}`,
            data:  JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json'
            },
          })
          .then((res)=>{
            if(res.data.status){
                this.setState({openModal:false, novedad:"", kilosTexto:"", facturaTexto:"", valor_totalTexto:"", id:"", fechaEntrega:"", remisionTexto:""})
                Toast.show({type: 'success', text1: 'Pedido Cerrado'})
                this.loadPedidos()
            }else{
                Toast.show({type: 'success', text1: 'Tenemos un problema, intentelo mas tarde'})
            }
          })

            // let data = new FormData();
            // imagen.forEach(e=>{
            //     data.append('imagen', e);
            // })
            // imagen = imagen[0]
            // data.append('imagen', imagen);
            // data.append('email', email);
            // data.append('_id', id);
            // data.append('kilos', kilosTexto);
            // data.append('factura', facturaTexto);
            // data.append('valor_total', valor_totalTexto);
            // data.append('forma_pago', forma_pagoTexto);
            // data.append('fechaEntrega', fechaEntrega);
            // data.append('remision', remisionTexto);
            
            // axios({
            //     method: 'post',  
            //     url: 'ped/pedido/finalizar/true',
            //     data: data,
            // })
            // .then((res)=>{
            //     if(res.data.status){
            //         axios.post(`nov/novedad/`, {pedidoId:id, novedad})
            //         .then((res2)=>{
            //             this.setState({openModal:false, novedad:"", kilosTexto:"", facturaTexto:"", valor_totalTexto:"", id:"", fechaEntrega:"", remisionTexto:""})
            //             // sendRemoteNotification(2, tokenPhone, "pedido entregado", `Su pedido ha sido entregado`, null, null, null )
            //             setTimeout(() => {
            //                 alert("Pedido cerrado")
            //             }, 1000);
            //             this.loadPedidos()
            //         })
            //     }else{
            //         // Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            //     }
            // })
        }
    }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////            CAMBIO EL ESTADO DEL PEDIDO
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleSubmit(){
    const {id, estado, estadoInicial} = this.state

    axios.get(`ped/pedido/cambiarEstado/${id}/${estado}`)
    .then(res=>{

        if(res.data.status){
            if(estado=="activo"){
                //////// esta condicion es para cuando estaba el pedido innactivo y luego lo activaron
                if(estadoInicial=="innactivo"){
                    this.setState({modalNovedad:true, estadoEntrega:"asignado"})
                }else{
                    this.setState({modalFechaEntrega:true, estadoEntrega:"asignado"})
                }
                ////////////////////////////////////////////////////////////////////////////////////
            }else if(estado=="innactivo"){
                this.setState({modalNovedad:true})
            } else{
                Toast.show({type: 'success', text1: 'Pedido actualizado'})
                this.loadPedidos()
            }
        }else{
          Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
        }
    })
  }
  loadPedidos(type){
    let {idUsuario, acceso, limit, terminoBuscador} = this.state
    limit = type==='load' ?20 :limit
    terminoBuscador = type==='load' ?'' :terminoBuscador
   
    this.props.getPedidos(idUsuario, 0, limit, acceso, terminoBuscador)
  }
}

const mapState = state => {
	return {
        pedidos: state.pedido.pedidos,
	};
};
  
const mapDispatch = dispatch => {
    return {
        getPedidos: (idUser, start, limit, acceso, search) => {
            dispatch(getPedidos(idUser, start, limit, acceso, search));
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
