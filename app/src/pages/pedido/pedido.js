import React, {useState, useEffect} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated, Keyboard} from 'react-native'
import Toast from 'react-native-simple-toast';
import AsyncStorage        from '@react-native-community/async-storage';
import moment 			   from 'moment-timezone'
import axios               from 'axios';
 
import Icon                from 'react-native-fa-icons';
import {Calendar, LocaleConfig}     from 'react-native-calendars';
import { createFilter }    from 'react-native-search-filter';
import { connect }         from "react-redux";
import ImageProgress 	   from 'react-native-image-progress';
import Footer              from '../components/footer'
import {getPedidos, getZonasPedidos} from '../../redux/actions/pedidoActions' 
import store from "../../redux/store.js";
 
import {style}             from './style'
 
  

const KEYS_TO_FILTERS = ["conductorId.nombre", "conductorId.cedula", 'forma', 'cantidadKl', 'cantidadPrecio', "nPedido", "usuarioId.nombre", "usuarioId.cedula", "usuarioId.razon_social", "usuarioId.email", "frecuencia", "estado", "puntoId.direccion"] 
let {height}  = Dimensions.get('window');
 

const Pedido = ({pedidos=[], navigation, getPedidos})=>{
 
    const top = new Animated.Value(height)
    const [acceso, setAcceso] = useState("");
    const [terminoBuscador, setTerminoBuscador] = useState("");
    const [inicio, setInicio] = useState(0);
    const [final, setFinal] = useState(80);
    const [elevation, setElevation] = useState(0);
    const [fechaEntregaFiltro, setFechaEntregaFiltro] = useState("");
    const [textEstado, setTextEstado] = useState("");
    const [showSpin, setShowSpin] = useState(false);
    const [pedidosFiltro, setPedidosFiltro] = useState(pedidos);
    const [fechaSolicitudFiltro, setFechaSolicitudFiltro] = useState("");
    const [dates, setDates] = useState("");
 
    const callObservaciones=(id)=>{
        axios.get(`nov/novedad/byPedido/${id}`)
        .then(e=>{
            // this.setState({novedades:e.data.novedad})
        })
    }
    const getRandom = async () => {
        let acceso = await AsyncStorage.getItem("acceso");
        setAcceso(acceso);
    };
    
    useEffect(() => {
        getRandom();
    }, []);
    const renderCabezera =()=>{
        return(
            <View style={style.contenedorCabezera}>
                <View style={{flexDirection:"row"}}>
                    {
                        pedidos &&<Text style={style.titulo}>Pedidos: {pedidos.length} {acceso=="conductor" &&": "+moment(fechaEntregaFiltro).format("YYYY-MM-DD")}</Text>
                    }
                    {/* <TouchableOpacity style={style.btnZonas} onPress={()=>this.setState({modalCarrosFiltro:true, elevation:0})}>
                        <Text style={style.textZonas}>Carros</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.btnZonas} onPress={()=>this.setState({modalZona:true})}>
                        <Text style={style.textZonas}>Zonas</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={style.subContenedorCabezera}>
                    {   
                        acceso!=="conductor"
                        &&<TextInput
                            placeholder="Buscar por: cliente, fecha, forma"
                            placeholderTextColor="#aaa" 
                            autoCapitalize = 'none'
                            onChangeText={(terminoBuscador)=> setTerminoBuscador(terminoBuscador)}
                            value={terminoBuscador}
                            style={[style.inputCabezera, {elevation}]}
                        />
                    }
                    {   
                        (acceso=="conductor" ||  acceso=="cliente")
                        ?null
                        :(<View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={style.btnReload} onPress={()=>reload()}>
                                <Icon name='refresh' style={style.iconReload} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={style.btnReload} onPress={()=>showModal()}>
                                <Image source={require("../../assets/img/filtro.png")} style={style.imgFiltro} />
                            </TouchableOpacity> */}
                        </View>)
                    }
                </View>
            </View>
        )
    }
    const showModal =()=>{
        Animated.timing(top,{
            toValue:0,
			duration:400,
			// easing:Easing.inOut
        }).start()
        setElevation(0)
    }
    const hideModal =()=>{
        Animated.timing(top,{
            toValue:size.height,
			duration:400,
			// easing:Easing.inOut
        }).start()
         textEstado=="todos" ?(setElevation(7), setTextEstado("")) :setElevation(7)
      }
    const limpiar =()=>{
        // this.setState({pedidos:this.state.pedidosFiltro, textEstado:"todos", modalCarrosFiltro:false, placa:null})
        // this.props.getPedidos(undefined, 5) 
        // this.props.getZonasPedidos(moment().format("YYYY-MM-DD")) 
    }
      const renderModalFiltro=()=>{
 
		return(
			<Animated.View style={[style.modal, {top}]}>
				<View style={style.cabezera}>
					<TouchableOpacity style={style.btnRegresar} onPress={()=>hideModal()}>
						<Icon name={'arrow-left'} style={style.iconFiltro} />
					</TouchableOpacity>
					<Text style={style.btnRegresar}>
						Filtros de búsqueda
					</Text>
                    <TouchableOpacity style={style.btnLimpiar} onPress={()=>limpiar()}>
                        <Text style={style.textoLimpiar}>Limpiar</Text>	
                        {textEstado=="todos" &&<Icon name={'check'} style={style.iconFiltro} />}
                    </TouchableOpacity>
				</View>
				<ScrollView>
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Estado</Text>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarTabla("innactivo")}>
							<Text style={style.textoFiltro}>Innactivo</Text>	
                            {textEstado=="innactivo" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarTabla("espera")}>
							<Text style={style.textoFiltro}>Espera</Text>	
                            {textEstado=="espera" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						<TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarTabla2("activo", false, "activo")}>
							<Text style={style.textoFiltro}>Activo</Text>	
                            {textEstado=="activo" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarTabla2("activo", true, "asignado")}>
							<Text style={style.textoFiltro}>Asignado</Text>	
                            {textEstado=="asignado" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarTabla3("activo", "entregado")}>
							<Text style={style.textoFiltro}>Entregado</Text>	
                            {textEstado=="entregado" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
                        <TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarTabla("noentregado")}>
							<Text style={style.textoFiltro}>No Entregado</Text>	
                            {textEstado=="noentregado" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
					</View>
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Forma</Text>
						 <TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarForma("lleno")}>
							<Text style={style.textoFiltro}>LLeno</Text>	
                            {textEstado=="lleno" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						 <TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarForma("monto")}>
							<Text style={style.textoFiltro}>Monto</Text>	
                            {textEstado=="monto" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
						 <TouchableOpacity style={style.btnFiltro} onPress={()=>actualizarForma("cantidad")}>
							<Text style={style.textoFiltro}>Cantidad</Text>	
                            {textEstado=="cantidad" &&<Icon name={'check'} style={style.iconFiltro} />}
						</TouchableOpacity>
					</View> 
					<View style={style.subContenedorFiltro}>
						<Text style={style.titulo1}>Fecha entrega</Text>
                        <Calendar
                            current={fechaEntregaFiltro}
                            markedDates={dates} 
                            onDayPress={(day) => {console.log('selected day', day); actualizarFechaEntrega(day.dateString)}}
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
                            markedDates={dates} 
                            onDayPress={(day) => {console.log('selected day', day); actualizarFechaSolicitud(day.dateString)}}
                            markedDates={{[fechaSolicitudFiltro]: {selected: true,  marked: true}}}
                        />
					</View>
				</ScrollView>
			</Animated.View>
		)
    }
    const actualizarFechaEntrega =(filtro) =>{
        // this.props.getZonasPedidos(filtro) 
        // this.props.getPedidos(filtro, 10) 
        // this.setState({fechaEntregaFiltro:filtro})
    }
    const actualizarTabla =(filtro)=>{
        pedidos = pedidosFiltro.filter(e=>{
          return e.estado==filtro
        })
        // this.setState({pedidos, textEstado:filtro})
        setTextEstado(filtro)
    }
    const actualizarTabla2=(filtro, filtro2, textEstado)=>{
        if(filtro2){
          pedidos = pedidosFiltro.filter(e=>{
            return e.estado==filtro &&e.carroId
          })
        }else{
          pedidos = pedidosFiltro.filter(e=>{
            return e.estado==filtro &&!e.carroId
          })
        }
 
    setTextEstado(filtro)
    }
    const actualizarTabla3 = (filtro, textEstado)=>{
        pedidos = pedidosFiltro.filter(e=>{
          return e.estado==filtro &&e.entregado
        })
 
        setTextEstado(filtro)
    }
    const actualizarForma =(filtro) =>{
        pedidos = pedidosFiltro.filter(e=>{
          return e.forma==filtro
        })
 
        setTextEstado(filtro)
    }
    const reload =()=>{
        setShowSpin(true)
          setInterval(()=>setShowSpin(false), 2200)
        getPedidos(undefined,80) 
        // store.dispatch(getPedidos(undefined, 100));
        // this.props.getZonasPedidos(this.state.fechaEntregaFiltro)
    }
    const renderPedidos=() => {
        let pedidosFiltro = pedidos.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newPedidos = pedidosFiltro.slice(inicio, final)
       
        return newPedidos.map((e, key)=>{
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
                            callObservaciones(e._id);
                            navigation.navigate("editarPedido", e)
                        }                        
                    }
                >
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
                        {e.usuarioId.codt &&e.usuarioId.codt.length
                            ?<Text style={style.textPedido}>{e.usuarioId.codt}</Text>
                            :null
                        }
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
                        e.puntoId.capacidad
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Almacenamiento galones </Text>
                            <Text style={style.textPedido}>{ e.puntoId.capacidad ?e.puntoId.capacidad :"0"}</Text>
                        </View>
                    }

                    {
                        e.usuarioId.valorUnitario
                        &&<View style={style.containerPedidos}>
                            <Text style={style.textPedido}>Valor Unitario </Text>
                            <Text style={style.textPedido}>{'$ '+Number(e.valorUnitario ?e.valorUnitario :e.usuarioId.valorUnitario).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                        </View>
                    }
                    
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
    const onScroll =(event)=> {
		 
		let paddingToBottom = 10;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;
    
        if(event.nativeEvent.contentOffset.y >= event.nativeEvent.contentSize.height - paddingToBottom) {
        
            setFinal(final+5)
            setShowSpin(true)
             setInterval(()=>setShowSpin(false), 2000)
            // this.props.getPedidos(undefined, final)
        }
    }
    return(
        <View style={style.container}>
            {/* {modalPerfiles &&this.modalPerfiles()}
            {modalConductor &&this.modalVehiculos()}
            {modalCarrosFiltro &&this.modalCarrosFiltro()}
            {modalFechaEntrega &&this.modalFechaEntrega()}
            {modalNovedad &&this.modalNovedad()} */}
            {renderCabezera()}
            {renderModalFiltro()}
            {/*{this.modalZonas()}
            {openModal &&this.editarPedido()} */}
            <ScrollView style={style.subContenedor}>
                {
                 
                    pedidos.length==0
                    ?<ActivityIndicator color="#00218b" />
                    :renderPedidos()
                }
            </ScrollView>
                {showSpin &&<ActivityIndicator color="#0071bb" style={style.preload}/> }
            <Footer navigation={navigation} />
        </View>
    )
} 

const mapState = state => {
 
	return {
        pedidos: state.pedido.pedidos,
	};
};
  
const mapDispatch = dispatch => {
    return {
 
        getZonasPedidos: (fechaEntrega) => {
            dispatch(getZonasPedidos(fechaEntrega));
        },
        getPedidos: (fechaEntrega, limit) => {
            dispatch(getPedidos(fechaEntrega, limit));
        },
    };
};
export default connect(
	mapState,
	mapDispatch
)(Pedido);  