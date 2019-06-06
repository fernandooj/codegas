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
import {getUsuariosAcceso} from '../../redux/actions/usuarioActions' 
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
        top:new Animated.Value(size.height),
	  }
	}
	 
    componentWillMount = async () =>{
        this.props.getPedidos()
        this.props.getUsuariosAcceso("conductor")
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
    estadoRed(estadoRed){
        console.log(estadoRed)
    }
    renderPedidos(){
        const {acceso, terminoBuscador} = this.state
        let pedidos = this.props.pedidos.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return pedidos.map((e, key)=>{
            return (
                <TouchableOpacity 
                    key={key}
                    style={e.estado=="espera" 
                        ?[style.pedidoBtn, {backgroundColor:"#5bc0de"}] 
                        :e.estado=="innactivo" 
                        ?[style.pedidoBtn, {backgroundColor:"#d9534f"}] 
                        :e.estado=="activo" && !e.entregado 
                        ?[style.pedidoBtn, {backgroundColor:"#f0ad4e"}]
                        :[style.pedidoBtn, {backgroundColor:"#5cb85c"}]
                    }
                    ////// solo activa el modal si es de despachos o administrador
                    onPress={
                        ()=>
                        acceso!=="cliente"
                        ?this.setState({openModal:true, imagenPedido:e.imagen, fechaEntrega:e.fechaEntrega, id:e._id, estado:e.estado, nombre:e.usuarioId.nombre, email:e.usuarioId.email, tokenPhone:e.usuarioId.tokenPhone,  cedula:e.usuarioId.cedula, forma:e.forma, cantidad:e.cantidad, entregado:e.entregado, factura:e.factura, kilos:e.kilos, valor_unitario:e.valor_unitario })
                        :null                               
                    }
                >
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>{e.usuarioId.nombre}</Text>
                        <Text style={style.textPedido}>{e.usuarioId.cedula}</Text>
                    </View>
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>Fecha creación </Text>
                        <Text style={style.textPedido}>{moment(JSON.parse(e.creado)).format("YYYY-MM-DD h:mm a")}</Text>
                    </View>
                    {
                        <View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Fecha Asignacion </Text>
                            <Text style={style.textPedido}>{ e.fechaEntrega ?moment(JSON.parse(e.fechaEntrega)).format("YYYY-MM-DD") :"sin fecha de asignación"}</Text>
                        </View>
                    }
                    <View style={style.containerPedidos}>
                        <Text style={style.textPedido}>{e.forma}</Text>
                        <Text style={style.textPedido}>{e.cantidad ?e.cantidad :""}</Text>
                    </View>
                    {
                        e.conductorId
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Conductor Asignado</Text>
                            <Text style={style.text}>{e.conductorId.nombre}</Text>
                            <Text style={style.text}>{e.conductorId.cedula}</Text>
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
                            :null
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
    }
    hideModal(){
        Animated.timing(this.state.top,{
            toValue:size.height,
			duration:400,
			// easing:Easing.inOut
		}).start()
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
                keyboard, entregado, fechaEntrega, avatar, imagenPedido, kilos, factura, valor_unitario } = this.state
       
        return <Modal transparent visible={openModal} animationType="fade" >
                <KeyboardListener
                    onWillShow={() => { this.setState({ keyboard: true }); }}
                    onWillHide={() => { this.setState({ keyboard: false }); }}
                />
            <TouchableOpacity activeOpacity={1} onPress={() => {  this.setState({  openModal: false }) }} >   
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
                                    <Text style={style.tituloModal}>Asignar conductor y fecha</Text>
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
                                                    style={kilosTexto.length<1 || facturaTexto.length<1 || valor_unitarioTexto.length<1 || novedad.length<1
                                                    ?style.btnDisable3 :style.btnGuardar3} 
                                                    onPress={
                                                        kilosTexto.length<1 || facturaTexto.length<1 || valor_unitarioTexto.length<1  || novedad.length<1
                                                        ?()=>alert("llene todos los campos")
                                                        :()=>this.cerrarPedido()
                                                    }
                                                >
                                                    <Text style={style.textGuardar}>Cerrar Pedido</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={ novedad.length<4 ?style.btnDisable3 :style.btnGuardar3} 
                                                    onPress={()=>novedad.length<4 ?alert("Inserte alguna novedad") :this.asignarFecha()}>
                                                    <Text style={style.textGuardar}>Guardar novedad, sin cerrar</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                    
                                </View>
                                :null
                            }
                            {this.modalFechaEntrega()}
                            {this.modalConductores()}
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
        let {fechasFiltro} = this.state
        let diaActual =  moment().tz("America/Bogota").format('YYYY-MM-DD')
		return(
			<Animated.View style={[style.modal, {top:this.state.top}]}>
				<View style={style.cabezera}>
					<TouchableOpacity style={style.btnRegresar} onPress={()=>this.hideModal()}>
						<Icon name={'arrow-left'} style={style.iconFiltro} />
					</TouchableOpacity>
					<Text>
						Filtros de búsqueda
					</Text>
				</View>
				<ScrollView>
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Estado</Text>
						<TouchableOpacity style={style.btnFiltro}>
							<Text>Espera</Text>	
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro}>
							<Text>Innactivo</Text>	
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro}>
							<Text>Activo</Text>	
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro}>
							<Text>En camino</Text>	
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro}>
							<Text>Entregado</Text>	
						</TouchableOpacity>
					</View>
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Forma</Text>
						<TouchableOpacity style={style.btnFiltro}>
							<Text>LLeno</Text>	
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro}>
							<Text>Monto</Text>	
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro}>
							<Text>Cantidad</Text>	
						</TouchableOpacity>
					</View> 
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Fecha entrega</Text>
                        <Calendar
                            style={style.btnFiltro}
                            current={diaActual}
                            markedDates={this.state.dates} 
                            markingType={'period'}
                            onDayPress={(date)=>this.onSelectDay(date.dateString)}
                            markedDates={{
                                [fechasFiltro[0]]: {startingDay: true, color: 'green'},
                                [fechasFiltro[1]]: {endingDay: true, color: 'green'} 
                            }}
                        />
					</View>
				</ScrollView>
			</Animated.View>
		)
    }
    onSelectDay(date){
        const { fechasFiltro } = this.state
        if (fechasFiltro.length==2 ) {
            fechasFiltro.length = 0
            fechasFiltro.push(date)
            this.setState( { fechasFiltro } )
        } else {
            fechasFiltro.push(date)
            this.setState( { fechasFiltro } )
        }
        
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            MODAL QUE MUESTRA AL LISTADO DE LOS CONDUCTORES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    modalConductores(){
        let {idConductor, modalConductor, showCalendar, fechaEntrega, nombreConductor} = this.state
        fechaEntrega = moment(fechaEntrega).format("YYYY-MM-DD")
        let diaActual =  moment().tz("America/Bogota").format('YYYY-MM-DD')
        return(
            <Modal transparent visible={modalConductor} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({modalConductor:false, nombreConductor:null, idConductor:null})}} > 
                    <View style={style.contenedorModal}>
                        <View style={style.subContenedorModal}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {this.setState({modalConductor:false, nombreConductor:null, idConductor:null})}}
                                style={style.btnModalConductorClose}
                            >
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <View style={style.contenedorConductor}>
                                <Button title="Asignar conductor" disabled={!showCalendar ? true :false} onPress={()=>this.setState({showCalendar:false})} />
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
                                        this.props.conductores.map(e=>{
                                            return <TouchableOpacity
                                                    key={e._id}
                                                    style={idConductor == e._id ?[style.contenedorConductor, {backgroundColor:"#5cb85c"}] :style.contenedorConductor}
                                                    onPress={()=>this.setState({idConductor:e._id, nombreConductor:e.nombre})}
                                                >
                                                <Text style={style.conductor}>{e.nombre}</Text>       
                                                <Image source={{uri:e.avatar}} style={style.avatar} />
                                            </TouchableOpacity>
                                        })
                                    }
                                    <TouchableOpacity style={style.btnGuardar} onPress={()=>nombreConductor ?this.asignarConductor() :alert("selecciona un conductor")}>
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
        const {terminoBuscador} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <Text style={style.titulo}>Pedidos</Text>
                <View style={style.subContenedorCabezera}>
                    <TextInput
                        placeholder="Buscar por: cliente, fecha, forma"
                        autoCapitalize = 'none'
                        onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                        value={terminoBuscador}
                        style={style.inputCabezera}
                    />
                    <TouchableOpacity style={style.btnFiltro} onPress={()=>this.showModal()}>
                        <Image source={require("../../assets/img/filtro.png")} style={style.imgFiltro} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
	render(){
        const {navigation, pedidos} = this.props
        const {idUsuario} = this.state
        console.log(this.state.tokenPhone)
        console.log(pedidos)
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
                        {this.renderPedidos()}
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
        const {nombreConductor, idConductor, id} = this.state
        Alert.alert(
            `Seguros deseas agregar a ${nombreConductor}`,
            'a este pedido',
            [
              {text: 'Confirmar', onPress: () => confirmar()},
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, nombreConductor:null, idConductor:null})},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.get(`ped/pedido/asignarConductor/${id}/${idConductor}`)
            .then((res)=>{
                if(res.data.status){
                    this.props.getPedidos()
                    alert("Conductor Agregado con exito")
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
               
              {text: 'Cancelar', onPress: () => this.setState({modalConductor:false, nombreConductor:null})},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.get(`ped/pedido/asignarFechaEntrega/${id}/${fechaEntrega}`)
            .then((res)=>{
                if(res.data.status){
                    alert("Fecha agregada con exito")
                    this.props.getPedidos()
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
        let {novedad, kilosTexto, facturaTexto, valor_unitarioTexto, id, tokenPhone, imagen, email} = this.state
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
            
            // axios.post(`ped/pedido/finalizar/${id}`, {_id:id, kilos, factura, valor_unitario})
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
                        this.setState({openModal:false})
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
	return {
        pedidos: state.pedido.pedidos,
        conductores:state.usuario.usuariosAcceso
	};
};
  
const mapDispatch = dispatch => {
    return {
        getPedidos: () => {
            dispatch(getPedidos());
        },
        getUsuariosAcceso: (acceso) => {
            dispatch(getUsuariosAcceso(acceso));
        },
    };
};
  
Pedido.defaultProps = {
    pedidos:[],
    conductores:[]
};

Pedido.propTypes = {
    
};
  
  export default connect(
	mapState,
	mapDispatch
  )(Pedido);
  