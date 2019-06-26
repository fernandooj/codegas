import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated, NetInfo, KeyboardAvoidingView} from 'react-native'
import Toast from 'react-native-simple-toast';
import AsyncStorage        from '@react-native-community/async-storage';
import moment 			   from 'moment-timezone'
import axios               from 'axios';
import KeyboardListener    from 'react-native-keyboard-listener';
import Icon                from 'react-native-fa-icons';
import {Calendar}          from 'react-native-calendars';
import { createFilter }    from 'react-native-search-filter';
import { connect }         from "react-redux";
import ImageProgress 	   from 'react-native-image-progress';
import Footer              from '../components/footer'
import {getPedidos}        from '../../redux/actions/pedidoActions' 
import {getVehiculos}      from '../../redux/actions/vehiculoActions' 
import {sendRemoteNotification} from '../push/envioNotificacion';
import TomarFoto           from "../components/tomarFoto";
import {style}             from './style'



const KEYS_TO_FILTERS = ["conductorId.nombre", "conductorId.cedula", 'forma', 'cantidad', "usuarioId.nombre", "usuarioId.cedula", "usuarioId.razon_social", "usuarioId.email", "frecuencia", "estado"] 
let size  = Dimensions.get('window');
class Pedido extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        openModal:false,
        modalConductor:false,
        modalFechaEntrega:false,
        terminoBuscador:"",
        kilosTexto:"",
        facturaTexto:"",
        valor_unitarioTexto:"",
        novedad:"",
        fechasFiltro:["0","1"],
        pedidos:[],
        top:new Animated.Value(size.height),
        elevation:7,     ////// en Android sale un error al abrir el filtro debido a la elevation
        fechaEntregaFiltro:  moment().format("YYYY-MM-DD")
	  }
	}
	 
    componentWillMount = async () =>{
        this.props.getPedidos(moment(this.state.fechaEntregaFiltro).valueOf())
        this.props.getVehiculos()
        try {
            let idUsuario = await AsyncStorage.getItem('userId')
            const acceso  = await AsyncStorage.getItem('acceso')
            idUsuario = idUsuario ?idUsuario : "FAIL"
            this.setState({idUsuario, acceso})
        } catch (error) {
            console.log(error)
        }
    }
    componentDidMount(){
        NetInfo.isConnected.addEventListener('change', this.estadoRed);
    }
    componentWillReceiveProps(props){
        this.setState({pedidos:props.pedidos, pedidosFiltro:props.pedidos})
    }
    estadoRed(estadoRed){
        console.log(estadoRed)
    }
    renderPedidos(){
        const {acceso, terminoBuscador, pedidos} = this.state
        let pedidosFiltro = pedidos.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return pedidosFiltro.map((e, key)=>{
            return (
                <TouchableOpacity 
                    key={key}
                    style={e.estado=="espera" 
                        ?[style.pedidoBtn, {backgroundColor:"#5bc0de"}] 
                        :e.estado=="noentregado" 
                        ?[style.pedidoBtn, {backgroundColor:"#ffffff"}] 
                        :e.estado=="innactivo" 
                        ?[style.pedidoBtn, {backgroundColor:"#d9534f"}] 
                        :e.estado=="activo" && !e.entregado 
                        ?[style.pedidoBtn, {backgroundColor:"#f0ad4e"}]
                        :[style.pedidoBtn, {backgroundColor:"#5cb85c"}]
                    }
                    ////// solo activa el modal si es de despachos o administrador o conductor 
                    onPress={
                        ()=>
                        acceso!=="cliente"
                        ?this.setState({openModal:true, placaPedido:e.carroId ?e.carroId.placa :null, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, nombre:e.usuarioId.nombre, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone,  cedula:e.usuarioId.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, factura:e.factura, kilos:e.kilos, valor_unitario:e.valor_unitario })
                        :null                               
                    }
                >
                    {/* <Text>{e._id}</Text>
                    <Text>{e.orden}</Text> */}
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>{e.usuarioId.nombre}</Text>
                        <Text style={style.textPedido}>{e.usuarioId.cedula}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>CODT</Text>
                        <Text style={style.textPedido}>{e.usuarioId.codt}</Text>
                    </View>
                    {
                        acceso!=="conductor"
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Fecha de creación </Text>
                            <Text style={style.textPedido}>{moment(JSON.parse(e.creado)).format("YYYY-MM-DD h:mm a")}</Text>
                        </View>
                    }
                    
                    {   
                        acceso!=="conductor"
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Fecha solicitud </Text>
                            <Text style={style.textPedido}>{ e.fechaEntrega ?moment(JSON.parse(e.fechaEntrega)).format("YYYY-MM-DD") :"sin fecha de asignación"}</Text>
                        </View>
                    }
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Tipo de solicitud:</Text>
                        <Text style={style.textPedido}>{e.forma} {e.cantidad ?" - "+e.cantidad :""}</Text>
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
                            ?<Text>Activo</Text>
                            :e.estado=="innactivo"
                            ?<Text>In Activo</Text>
                            :e.estado=="espera"
                            ?<Text>Espera</Text>
                            :e.estado=="activo" &&e.entregado
                            ?<Text>Entregado</Text>
                            :<Text>Cerrado sin entregar</Text>
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
            <Modal transparent visible={modalFechaEntrega} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={() => {  this.setState({  modalFechaEntrega: false }) }} >   
                    <View style={style.contenedorModal}>
                        <View style={style.subContenedorModal}>
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
                </TouchableOpacity>
            </Modal>
        )
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           MODAL QUE MUESTRA LA OPCION DE EDITAR UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarPedido(){
        const {openModal, estado, nombre, cedula, forma, cantidad, acceso, novedad, kilosTexto, facturaTexto, valor_unitarioTexto, height, 
                keyboard, entregado, fechaEntrega, avatar, imagenPedido, kilos, factura, valor_unitario, placaPedido, imagen } = this.state
       
        return <Modal transparent visible={openModal} animationType="fade" >
                <KeyboardListener
                    onWillShow={() => { this.setState({ keyboard: true }); }}
                    onWillHide={() => { this.setState({ keyboard: false }); }}
                />
            <TouchableOpacity activeOpacity={1} onPress={() => {  this.setState({   }) }} >   
                <View style={size.height<height ?style.contenedorModal :style.contenedorModal2}>
                    <View style={!keyboard ?style.subContenedorModal :[style.subContenedorModal, {marginTop:acceso=="admin" ?-500: -180}]}>
                        <ScrollView onContentSizeChange={(height) => { this.setState({height}) }}  keyboardDismissMode="on-drag">
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({openModal:false})} style={size.height<height ?style.btnModalClose :style.btnModalClose2}>
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                                <Text>Nombre: {nombre}</Text>
                                <Text>Cedula: {cedula}</Text>
                                <Text>Forma:  {forma}</Text>
                                <Text>{cantidad &&`cantidad ${cantidad}`}</Text>
                            
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
                                (acceso=="admin" || acceso=="despacho") && estado=="activo"
                                ?<View>
                                    <View style={style.separador}></View>
                                    <Text style={style.tituloModal}>Asignar Vehiculo y fecha</Text>
                                    {placaPedido &&<Text style={style.tituloModal}>{placaPedido}</Text>}
                                    <TouchableOpacity style={[style.btnGuardar2, {flexDirection:"row", left:45}]} onPress={()=>this.setState({modalConductor:true})}>
                                        <Text style={style.textGuardar}>Asignar</Text>
                                        <Icon name="user" style={style.iconBtnGuardar} />
                                    </TouchableOpacity>   
                                </View>
                                :null
                            }
                            {/* CERRAR PEDIDO  */}
                            {
                                (acceso=="admin" || acceso=="conductor") && fechaEntrega
                                ?<View>
                                    {
                                        entregado
                                        ?<View>
                                            <View style={style.separador}></View>
                                            <Text style={style.tituloModal}>Pedido Cerrado</Text>
                                            <View style={style.pedido}>
                                            <ImageProgress 
                                                resizeMode="cover" 
                                                renderError={ (err) => { return (<ImageProgress source={require('../../assets/img/filtro.png')} imageStyle={{height: 40, width: 40, borderRadius: 10, left:-30, top:5}}  />) }} 
                                                source={{ uri:  imagenPedido}} 
                                                indicator={{
                                                    size: 20, 
                                                    borderWidth: 0,
                                                    color: '#ffffff',
                                                    unfilledColor: '#ffffff'
                                                    }} 
                                                style={style.imagen}
                                            />
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
                                        </View>
                                        :<View style={style.contenedorCerrarPedido}>
                                            <View style={style.separador}></View>
                                            <Text style={style.tituloModal}>Cerrar Pedido</Text>
                                            <TomarFoto 
                                                source={avatar}
                                                
                                                limiteImagenes={1}
                                                imagenes={(imagen) => {  this.setState({imagen}) }}
                                            /> 
                                            <TextInput
                                                placeholder="N Kilos"
                                                autoCapitalize = 'none'
                                                onChangeText={(kilosTexto)=> this.setState({ kilosTexto })}
                                                value={kilosTexto}
                                                keyboardType='numeric'
                                                style={[style.inputTerminarPedido, {marginTop:20}]}
                                            />
                                            <TextInput
                                                placeholder="N Factura"
                                                autoCapitalize = 'none'
                                                onChangeText={(facturaTexto)=> this.setState({ facturaTexto })}
                                                value={facturaTexto}
                                                style={style.inputTerminarPedido}
                                            />
                                            <TextInput
                                                placeholder="Valor Unitario"
                                                autoCapitalize = 'none'
                                                keyboardType='numeric'
                                                onChangeText={(valor_unitarioTexto)=> this.setState({ valor_unitarioTexto })}
                                                value={valor_unitarioTexto}
                                                style={style.inputTerminarPedido}
                                            />
                                            <TextInput
                                                placeholder="Novedades"
                                                autoCapitalize = 'none'
                                                onChangeText={(novedad)=> this.setState({novedad})}
                                                value={novedad}
                                                multiline={true}
                                                numberOfLines={4}
                                                style={style.inputNovedad}
                                            />
                                            <View style={style.contenedorConductor}>
                                                <TouchableOpacity 
                                                    style={kilosTexto.length<1 || facturaTexto.length<1 || valor_unitarioTexto.length<1 || novedad.length<1 || !imagen
                                                    ?style.btnDisable3 :style.btnGuardar3} 
                                                    onPress={
                                                        kilosTexto.length<1 || facturaTexto.length<1 || valor_unitarioTexto.length<1  || novedad.length<1 || !imagen
                                                        ?()=>alert("llene todos los campos")
                                                        :()=>this.cerrarPedido()
                                                    }
                                                >
                                                    <Text style={style.textGuardar}>Cerrar Pedido</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={ novedad.length<4 ?style.btnDisable3 :style.btnGuardar3} 
                                                    onPress={()=>novedad.length<4 ?alert("Inserte alguna novedad") :this.guardarNovedad()}>
                                                    <Text style={style.textGuardar}>Guardar novedad, sin cerrar</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                    
                                </View>
                                :null
                            }
                            {this.modalFechaEntrega()}
                            {this.modalVehiculos()}
                        </ScrollView>
                    </View>                   
                </View>
            </TouchableOpacity>
        </Modal>
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           RENDER MODAL FILTROS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    renderModalFiltro(){
        let {fechaEntregaFiltro, textEstado} = this.state
        fechaEntregaFiltro = moment(fechaEntregaFiltro).format("YYYY-MM-DD")
		return(
			<Animated.View style={[style.modal, {top:this.state.top}]}>
				<View style={style.cabezera}>
					<TouchableOpacity style={style.btnRegresar} onPress={()=>this.hideModal()}>
						<Icon name={'arrow-left'} style={style.iconFiltro} />
					</TouchableOpacity>
					<Text style={style.btnRegresar}>
						Filtros de búsqueda
					</Text>
                    <TouchableOpacity style={style.btnLimpiar} onPress={()=>this.setState({pedidos:this.state.pedidosFiltro, textEstado:"todos"})}>
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
                            onDayPress={(day) => {console.log('selected day', day); this.actualizarFecha(moment(day.dateString).valueOf())}}
                            markedDates={{[fechaEntregaFiltro]: {selected: true,  marked: true}}}
                            // markingType={'period'}
                            // onDayPress={(date)=>this.onSelectDay(date.dateString)}
                            // markedDates={{
                            //     [fechasFiltro[0]]: {startingDay: true, color: 'green'},
                            //     [fechasFiltro[1]]: {endingDay: true, color: 'green'} 
                            // }}
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
    actualizarFecha(filtro){
        let {pedidos, pedidosFiltro, acceso} = this.state
        pedidos = pedidosFiltro.filter(e=>{
          return e.fechaEntrega==filtro
        })
        console.log({filtro})
        this.setState({fechaEntregaFiltro:filtro})
        acceso == "conductor" ?this.props.getPedidos(filtro) :this.setState({pedidos})
        
    }
    // onSelectDay(date){
    //     const { fechasFiltro } = this.state
    //     if (fechasFiltro.length==2 ) {
    //         fechasFiltro.length = 0
    //         fechasFiltro.push(date)
    //         this.setState( { fechasFiltro } )
    //     } else {
    //         fechasFiltro.push(date)
    //         this.setState( { fechasFiltro } )
    //     }
        
    // }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            MODAL QUE MUESTRA AL LISTADO DE LOS CONDUCTORES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalVehiculos(){
        let {idVehiculo, modalConductor, showCalendar, fechaEntrega, placa} = this.state
        fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
        let diaActual =  moment().tz("America/Bogota").format('YYYY-MM-DD')
        return(
            <Modal transparent visible={modalConductor} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({placa:null, idVehiculo:null})}} > 
                    <View style={style.contenedorModal}>
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
                                :<View>
                                    {
                                        this.props.vehiculos.map(e=>{
                                            return <TouchableOpacity
                                                    key={e._id}
                                                    style={idVehiculo == e._id ?[style.contenedorConductor, {backgroundColor:"#5cb85c"}] :style.contenedorConductor}
                                                    onPress={()=>this.setState({idVehiculo:e._id, placa:e.placa})}
                                                >
                                                <Text style={style.conductor}>{e.placa}</Text>       
                                                <Text style={style.conductor}>{e.conductor ? e.conductor.nombre :""}</Text>       
                                                <Image source={{uri:e.avatar}} style={style.avatar} />
                                            </TouchableOpacity>
                                        })
                                    }
                                    <TouchableOpacity style={style.btnGuardar} onPress={()=>placa ?this.asignarConductor() :alert("selecciona un Vehiculo")}>
                                        <Text style={style.textGuardar}>Asignar Vehiculo</Text>
                                    </TouchableOpacity>  
                                </View>
                            }    
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    renderCabezera(){
        const {terminoBuscador, elevation, acceso, fechaEntregaFiltro, pedidos} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <Text style={style.titulo}>Pedidos:{pedidos.length} {acceso=="conductor" &&": "+moment(fechaEntregaFiltro).format("YYYY-MM-DD")}</Text>
                <View style={style.subContenedorCabezera}>
                    <TextInput
                        placeholder="Buscar por: cliente, fecha, forma"
                        autoCapitalize = 'none'
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={[style.inputCabezera, {elevation}]}
                    />
                    <TouchableOpacity style={style.btnFiltro} onPress={()=>this.showModal()}>
                        <Image source={require("../../assets/img/filtro.png")} style={style.imgFiltro} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
	render(){
        const {navigation} = this.props
        const {idUsuario, pedidos} = this.state
        if(!idUsuario){
            return <ActivityIndicator color="#00218b" />
        }else if(idUsuario=="FAIL"){
            return (navigation.navigate("perfil"))
        }else{
            return (
                <View style={style.container}>
                    {this.renderCabezera()}
                    {this.renderModalFiltro()}
                    <ScrollView style={style.subContenedor}>
                        {this.editarPedido()}
                        {
                            pedidos.length==0
                            ?<Text style={style.sinPedidos}>No hemos encontrado pedidos</Text>
                            :this.renderPedidos()
                        }
                    </ScrollView>
                    <Footer navigation={navigation} />
                </View>
            )    
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            ASIGNO UN CONDUCTOR A UN PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    asignarConductor(){
        const {placa, idVehiculo, id} = this.state
        Alert.alert(
            `Seguros deseas agregar a ${placa}`,
            'a este pedido',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, placa:null, idVehiculo:null})},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}`)
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
        Alert.alert(
            `Seguros deseas asignar el dia: ${fechaEntrega}`,
            'a este pedido',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, placa:null})},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.get(`ped/pedido/asignarFechaEntrega/${id}/${moment(fechaEntrega).valueOf()}`)
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
    ////////////////////////           GUARDAR NOVEDAD 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    guardarNovedad(){
        let {novedad, id, tokenPhone, fechaEntrega, fechaEntregaFiltro} = this.state
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
            axios.post('ped/pedido/novedad', {_id:id, fechaEntrega, novedad})
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    axios.post(`nov/novedad/`, {pedidoId:id, novedad})
                    .then((res2)=>{
                        this.setState({openModal:false, novedad:""})
                        sendRemoteNotification(2, tokenPhone, "pedido no entregado", `${novedad}`, null, null, null )
                        setTimeout(() => {
                            alert("Pedido cerrado")
                        }, 1000);
                        this.props.getPedidos(moment(fechaEntregaFiltro).valueOf())
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
        let {novedad, kilosTexto, facturaTexto, valor_unitarioTexto, id, tokenPhone, imagen, email, fechaEntrega, fechaEntregaFiltro} = this.state
        Alert.alert(
            `Seguros desea cerrar este pedido`,
            '',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
              {text: 'Cancelar', onPress: () => console.log("cerrado")},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            let data = new FormData();
            imagen = imagen[0]
            data.append('imagen', imagen);
            data.append('email', email);
            data.append('_id', id);
            data.append('kilos', kilosTexto);
            data.append('factura', facturaTexto);
            data.append('valor_unitario', valor_unitarioTexto);
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
                        this.props.getPedidos(moment(fechaEntregaFiltro).valueOf())
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
                    this.setState({modalFechaEntrega:true})
                }else{
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
    console.log(state)
	return {
        pedidos: state.pedido.pedidos,
        vehiculos:state.vehiculo.vehiculos
	};
};
  
const mapDispatch = dispatch => {
    return {
        getPedidos: (fechaEntrega) => {
            dispatch(getPedidos(fechaEntrega));
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