import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, ImageBackground, Image, Alert, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage             from '@react-native-community/async-storage';
import Icon                     from 'react-native-fa-icons';
import Toast                    from 'react-native-simple-toast';
import axios                    from 'axios'
import moment                   from 'moment-timezone'
import ModalSelector            from 'react-native-modal-selector'
import {createFilter} from 'react-search-input'
import {Calendar}               from 'react-native-calendars';
import { TextInputMask }        from 'react-native-masked-text'
import TomarFoto                from "../components/tomarFoto";
import { connect }              from "react-redux";
// import {sendRemoteNotification} from '../push/envioNotificacion';
import {getUsuariosAcceso}      from '../../redux/actions/usuarioActions' 
import Footer                   from '../components/footer'
import {style}                  from './style'
const KEYS_TO_FILTERS = ["nombre", "email",  "razon_social", 'codt'] 
const frecuencias = [
    { key: "semanal",   label: 'Semanal' },
    { key: "quincenal", label: 'Quincenal' },
    { key: "mensual",   label: 'Mensual' },
]; 
const franjas = [
    { key: "mañana",   label: 'Mañana' },
    { key: "tarde",    label: 'Tarde' },
    { key: "noche",    label: 'Noche' },
]; 
const dias=[
    { key: "lunes",    label: 'Lunes' },
    { key: "martes",   label: 'Martes' },
    { key: "miercoles",label: 'Miercoles' },
    { key: "jueves",   label: 'Jueves' },
    { key: "viernes",  label: 'Viernes' },
    { key: "sabado",   label: 'Sabado' },
]
const diasN = []
for (let index = 0; index < 32; index++) {
    diasN.push({label:index, key:index}); 
}

// const diasN  = [
// 	{label:1, key:1},
// 	{label:2, key:2},
// 	{label:3, key:3},
// 	{label:4, key:4},
// 	{label:5, key:5},
// 	{label:6, key:6},
// 	{label:7, key:7},
// 	{label:8,  key:8},
// 	{label:9,  key:9},
// 	{label:10, key:10},
// 	{label:11, key:11},
// 	{label:12, key:12},
// 	{label:13, key:13},
// 	{label:14, key:14},
// 	{label:15, key:15},
// 	{label:16, key:16},
// 	{label:17, key:17},
// 	{label:18, key:18},
// 	{label:19, key:19},
// 	{label:20, key:20},
// 	{label:21, key:21},
// 	{label:22, key:22},
// 	{label:23, key:23},
// 	{label:24, key:24},
// 	{label:25, key:25},
// 	{label:26, key:26},
// 	{label:27, key:27},
// 	{label:28, key:28},
// 	{label:29, key:29},
// 	{label:30, key:30},
// 	{label:31, key:31}
// ]
const horaActual = new Date().getHours();
if (horaActual < 16 ) {
    hora=1
} else {
    hora=2
}
class Nuevo_pedido extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        imagen:[],
		terminoBuscador:"",
		inicio:0,
		final:7,
        categoriaUser:[],
        clientes:[],
        puntos:[],
        modalCliente:false,
        modalFechaEntrega:true,
        // guardando:true,
        // fechaSolicitud: moment().tz("America/Bogota").add(hora, 'days').format('YYYY-MM-DD')
      }
     
	}
	 
	async componentWillMount(){
        axios
        .get(`users/by/adminsolucion`)
        .then(res => {
            console.log(res.data)
            if(res.data.status){
                this.setState({usuarios:res.data.usuarios})
            }
        })

        let idUsuario   = await AsyncStorage.getItem('userId')
        const acceso   	= await AsyncStorage.getItem('acceso')
        const email   	= await AsyncStorage.getItem('email')
        const nombre   	= await AsyncStorage.getItem('nombre')
        !nombre &&idUsuario ?this.props.navigation.navigate("verPerfil", {tipoAcceso:null}) :null //// si no ha editado el nombre lo mando para editar perfil
        idUsuario = idUsuario ?idUsuario : "FAIL"
        axios.get(`pun/punto/byCliente/${idUsuario}`)
        .then(e=>{
            if(e.data.status){
                e.data.puntos.length==1 ?this.setState({puntos:e.data.puntos, idZona:e.data.puntos[0].idZona, puntoId:e.data.puntos[0]._id}) :this.setState({puntos:e.data.puntos})
            }else{
                Toast.show("Tuvimos un problema, intentele mas tarde")
            }
        })

        this.setState({idUsuario, acceso, email})
       
    }
    getClientes(){
        axios.get(`users/clientes`)
        .then(res => {
            if(res.data.status){
                this.setState({clientes:res.data.usuarios})
            }
        })
    }
    renderUsuarios(){
        const {usuarios, navigation} = this.props
        const {terminoBuscador, clientes} = this.state
        let clientesFiltro = clientes.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        return clientesFiltro.map((e, key)=>{
            return(
                <View style={[style.contenedorUsers, {backgroundColor: e.activo ?"white" :"red" }]} key={key}>
                    <TouchableOpacity style={{flexDirection:"row"}} onPress={()=> this.filtroClientes(e) }>
                        <View style={{width:"90%"}}>
                            {e.acceso=="cliente" &&<Text style={style.textUsers}>{e.idPadre ?"Punto consumo: "+e.idPadre.razon_social :e.razon_social}</Text>}
                            <Text style={style.textUsers}>{e.nombre}</Text>
                            <Text style={style.textUsers}>{e.codt}</Text>
                        </View>
                        <View style={{justifyContent:"center"}}>
                            <Icon name={'angle-right'} style={style.iconCerrar} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
    }
    renderCliente(){
        const {idCliente, cliente} = this.state
		return (
			<View>
                {
                    idCliente
                    ?<TouchableOpacity style={style.eliminarFrecuencia} onPress={()=>this.setState({idCliente:null, cliente:null, puntos:[]})}>
                        <Icon name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>{cliente}</Text>
                    </TouchableOpacity>
                    :<TouchableOpacity style={style.nuevaFrecuencia} 
                        onPress={()=>
                            (this.getClientes(),
                            this.setState({showClientes:true}))
                        }>
                        <Icon name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Asignar Cliente</Text>
                    </TouchableOpacity>
                }
            </View>
		)
    }
    modalCliente(){
        let {showRenderUsuarios, terminoBuscador} = this.state
		return(
			<Modal transparent visible={true} animationType="fade" >
				<TouchableOpacity activeOpacity={1} >
					<View style={style.contenedorModalCliente}>
						<View style={style.subContenedorModalCliente}>
                            <TouchableOpacity activeOpacity={1} 
                                onPress={()=>this.setState({showClientes:false})} style={style.btnModalClose}
                            >
								<Icon name={'times-circle'} style={style.iconCerrar} />
							</TouchableOpacity>
                            <View style={{flexDirection:"row"}}>
                                <TextInput
                                    placeholder="Buscar cliente"
                                    value={terminoBuscador}
                                    style={style.inputStep2}
                                    onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador })}
                                />
                            <TouchableOpacity style={style.buscarCliente} onPress={()=>terminoBuscador.length>1 ?this.setState({showRenderUsuarios:true}) :alert("Inserte un valor") }>
                                <Icon name='search' style={style.iconSearch} />
                            </TouchableOpacity>
                        </View>
                            {
                                showRenderUsuarios
                                &&<ScrollView>
                                    {this.renderUsuarios()}
                                </ScrollView>
                            }
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
		)
    }
	renderPedido(){
        const {forma, acceso, cantidad, showFrecuencia, frecuencia, dia1, dia2, novedad, idCliente, puntoId, puntos, solicitud, fechaSolicitud, guardando, showClientes} = this.state
        return(
            <View style={style.subContainerNuevo}>
                {showClientes &&this.modalCliente()}
                <View style={style.contenedorMonto}>
                    <Text style={style.tituloForm}>Realice su pedido</Text>
                    <TouchableOpacity onPress={()=>this.setState({forma:"monto", cantidad:""})} style={style.btnFormaLlenar}>
                        <Image source={require('../../assets/img/pg3/btn2.png')} style={style.icon}  resizeMode={'contain'} />	
                        <Text style={style.textForma}>Monto $</Text>
                        {forma=="monto" &&<Icon name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({forma:"cantidad", cantidad:""})} style={style.btnFormaLlenar}>
                        <Image source={require('../../assets/img/pg3/btn3.png')} style={style.icon}  resizeMode={'contain'} />
                        <Text style={style.textForma}>Cantidad KG</Text>
                        {forma=="cantidad" &&<Icon name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({forma:"lleno", cantidad:""})} style={style.btnFormaLlenar}>
                        <Image source={require('../../assets/img/pg3/btn4.png')} style={style.icon}  resizeMode={'contain'} />
                        <Text style={style.textForma}>Lleno total</Text>
                        {forma=="lleno" &&<Icon name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                </View>
                {
                    forma=="monto"
                    ?<TextInputMask
                        type={'money'}
                        options={{
                            precision: 0,
                            separator: ',',
                            delimiter: '.',
                            unit: '$',
                            suffixUnit: ''
                        }}
                        value={cantidad}
                        style={style.input}
                        placeholder="Monto"
                        onChangeText={cantidad => { this.setState({cantidad}) }}
                        ref={(ref) => this.campoMonto = ref}
                    />
                    :forma=="cantidad"
                    &&<TextInputMask
                        type={'only-numbers'}
                        options={{
                            precision: 0,
                            separator: ',',
                            delimiter: '.',
                            unit: '',
                            suffixUnit: ''
                        }}
                        style={style.input}
                        value={cantidad}
                        placeholder="Cantidad"
                        onChangeText={cantidad => { this.setState({ cantidad }) }}
                    />
                }
                {
                    showFrecuencia
                    ?<TouchableOpacity style={style.eliminarFrecuencia} onPress={()=>this.setState({showFrecuencia:false, frecuencia:null, dia1:null, dia2:null, franja:null})}>
                        <Icon name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Frecuencia pedido</Text>
                    </TouchableOpacity>
                    :<TouchableOpacity style={style.nuevaFrecuencia} onPress={()=>this.setState({showFrecuencia:true})}>
                        <Icon name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Frecuencia pedido</Text>
                    </TouchableOpacity>

                }
                
                {
                    showFrecuencia
                    &&<View style={style.contenedorFrecuencia}>
                        <ModalSelector
                            style={style.btnFrecuencia}
                            data={frecuencias}
                            initValue="Frecuencia"
                            cancelText="Cancelar"
                            onChange={(option)=>{ this.setState({frecuencia:option.key, dia1:null, dia2:null, franja:null}) }} 
                            selectStyle={!frecuencia &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                        />
                        {
                            frecuencia
                            ?frecuencia=="semanal"
                                ?<ModalSelector
                                    style={style.btnFrecuencia}
                                    data={dias}
                                    initValue={"Dia"}
                                    cancelText="Cancelar"
                                    onChange={(option)=>{ this.setState({dia1:option.key}) }} 
                                    selectStyle={!dia1 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                />
                            :frecuencia=="mensual"
                            ?<ModalSelector
                                style={style.btnFrecuencia}
                                data={diasN}
                                initValue={"Dia"}
                                cancelText="Cancelar"
                                onChange={(option)=>{ this.setState({dia1:option.key}) }} 
                                selectStyle={!dia1 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                            />
                            :<View style={style.contenedorFrecuencia}>
                                <ModalSelector
                                    style={style.btnFrecuencia}
                                    data={diasN.slice(0,15)}
                                    initValue={"Dia 1"}
                                    cancelText="Cancelar"
                                    onChange={(option)=>{ this.setState({dia1:option.key}) }} 
                                    selectStyle={!dia1 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                />
                                <ModalSelector
                                    style={style.btnFrecuencia}
                                    data={diasN.slice(15,31)}
                                    initValue={"Dia 2"}
                                    cancelText="Cancelar"
                                    onChange={(option)=>{ this.setState({dia2:option.key}) }} 
                                    selectStyle={!dia2 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                />
                            </View>
                            :null
                        }
                        {/* {
                            frecuencia
                            &&<ModalSelector
                                style={style.btnFrecuencia}
                                data={franjas}
                                initValue={"Franja Horaria"}
                                onChange={(option)=>{ this.setState({franja:option.key}) }} 
                                selectStyle={!franja &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                            />
                        } */}
                    </View>
                }
                {
                    acceso=="admin" || acceso=="solucion" || acceso=="veo" || acceso=="comercial" || acceso=="despacho"
                    ?this.renderCliente()
                    :null
                }
                    {
                puntos.length>1
                ?<View>
                <Text>Selecciona el punto de entrega</Text>
                    {
                        puntos.map((e, key)=>{
                            return (
                                <TouchableOpacity key={key} style={style.btnZona} onPress={()=>this.setState({puntoId:e._id, idZona:e.idZona})}>
                                    <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                                    <View>
                                        <Text style={style.textZona}>{e.direccion}</Text>   
                                        <Text style={style.textZona}>Capacidad: {e.capacidad}</Text>
                                        {e.observacion &&<Text style={style.textZona}>Observacion: {e.observacion=="" ?"&nbsp;" :e.observacion }</Text>}
                                    </View>
                                    {(puntoId==e._id) &&<Icon name="check" style={style.iconCheck} /> }
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                :puntos.map((e, key)=>{
                    return (
                        <View key={key} style={style.btnZona} >
                            <Image source={require('../../assets/img/pg3/btn1.png')} style={style.icon}  resizeMode={'contain'} />	
                            <View>
                                <Text style={style.textZona}>Punto de entrega</Text>
                                <Text style={style.textZona}>{e.direccion}</Text>   
                                <Text style={style.textZona}>Capacidad: {e.capacidad}</Text>
                                {e.observacion && e.observacion.length!==0 ?<Text style={style.textZona}>Observacion: {e.observacion=="" ?"&nbsp;" :e.observacion }</Text> :null}
                            </View>
                        </View>    
                    )
                })
            }
            {
                solicitud 
                ?<TouchableOpacity style={style.eliminarFrecuencia} onPress={()=> this.setState({solicitud:null})}>
                    <Icon name="minus" style={style.iconFrecuencia} />
                    <Text style={style.textGuardar}>{fechaSolicitud}</Text>
                </TouchableOpacity>
                :<TouchableOpacity style={style.nuevaFrecuencia} 
                    onPress={()=>{Toast.show("Esta fecha esta sujeta a verificación si nuestros vehiculos estan en la zona"); this.setState({showFechaEntrega:true})} }
                >
                    <Icon name="plus" style={style.iconFrecuencia} />
                    <Text style={style.textGuardar}>Fecha Entrega</Text>
                </TouchableOpacity>
            }
                
                <TextInput
                    placeholder="Observaciones"
                    onChangeText={(novedad)=> this.setState({ novedad })}
                    value={novedad}
                    multiline = {true}
                    style={[style.inputNovedades]}
                />
                {/* <TomarFoto 
                    width={110}
                    
                    limiteImagenes={3}
                    imagenes={(imagen) => {  this.setState({imagen, showLoading:false}) }}
                />  */}
                <TouchableOpacity style={!forma ?style.btnGuardarDisable :style.btnGuardar} onPress={()=>
                    (acceso=="admin" || acceso=="solucion" || acceso=="veo" || acceso=="comercial" || acceso=="despacho") && !idCliente
                    ?Toast.show("Selecciona un cliente")
                    :(acceso=="admin" || acceso=="solucion" || acceso=="veo" || acceso=="comercial" || acceso=="despacho") && !puntoId
                    ?Toast.show("Selecciona una dirección")
                    :!forma
                    ?Toast.show("Selecciona una forma")
                    :(forma=="monto"&&cantidad<10)
                    ?Toast.show("Inserta una cantidad")
                    :(forma=="cantidad"&&cantidad<10)
                    ?Toast.show("Inserta una cantidad")
                    :(frecuencia=="semanal" || frecuencia=="mensual") &&!dia1
                    ?Toast.show("Inserta un dia de frecuencia")
                    :frecuencia=="quincenal"  &&(!dia1 ||!dia2)
                    ?Toast.show("Inserta los dias de frecuencia")
                    :!fechaSolicitud
                    ?Toast.show("Inserta una fecha de entrega")
                    :!guardando &&this.verificaPedido()
                }>
                    {/* <Text style={style.textGuardar}> {guardando ?"Guardando" :"Guardar pedido"}</Text> */}
                    {/* <Image source={require('../../assets/img/pg3/btnEnviar.png')} style={style.btnEnviar}  resizeMode={'contain'} /> */}
                    <Icon name="caret-square-o-right" style={!forma ?style.iconGuardarDisable :style.iconGuardar} />
                    <Text style={!forma ?style.textGuardarDisable :style.textGuardar}>{!guardando ?"Enviar" :"Enviando..."}</Text>
                    {guardando &&<ActivityIndicator color="#ffffff" />}
                </TouchableOpacity>
            </View>
        )
    }
    filtroClientes({_id, email, nombre}){
        this.setState({
            cliente:nombre, 
            idCliente:_id, 
            emailCliente:email, 
            showClientes:false
        })
        axios.get(`pun/punto/byCliente/${_id}`)
        .then(e=>{
            console.log(e.data.puntos)
            if(e.data.status){
                e.data.puntos.length==1 ?this.setState({puntos:e.data.puntos, puntoId:e.data.puntos[0]._id, idZona:e.data.puntos[0].idZona}) :this.setState({puntos:e.data.puntos})
            }else{
                Toast.show("Tuvimos un problema, intentele mas tarde")
            }
        })
    }
    modalFechaEntrega(){
        let {modalFechaEntrega, fechaSolicitud} = this.state
        fechaSolicitud = moment(fechaSolicitud).format("YYYY-MM-DD")
        let diaActual =  moment().tz("America/Bogota").add(0, 'days').format('YYYY-MM-DD')
        console.log(diaActual)
        return(
            <Modal transparent visible={modalFechaEntrega} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={() => {  this.setState({  showFechaEntrega: false }) }} >   
                    <View style={style.contenedorModalCliente}>
                        <View style={style.subContenedorModalCliente}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({showFechaEntrega:false})} style={style.btnModalClose}>
                                <Icon name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.tituloModal}>Fecha entrega</Text>
                            <Calendar
                                style={style.calendar}
                                current={fechaSolicitud}
                                //minDate={diaActual}
                                firstDay={1}
                                onDayPress={(day) => { this.setState({solicitud:true, showFechaEntrega:false, fechaSolicitud:day.dateString})}}
                                markedDates={{[fechaSolicitud]: {selected: true,  marked: true}}}
                            />
                        </View>
                        
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    	
    
     
	render(){
        const {navigation} = this.props
        const {idUsuario, showFechaEntrega, acceso} = this.state
        
        return (
            <View style={style.container} >
                <Image source={require('../../assets/img/pg1/fondo1.jpg')} style={style.cabezera} />
                <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
                    {
                        showFechaEntrega
                        &&this.modalFechaEntrega()
                        
                    }
                    <KeyboardAwareScrollView style={style.containerNuevo}>
                        {this.renderPedido()}
                    </KeyboardAwareScrollView>
                    <Footer navigation={navigation} />
                </ImageBackground>
            </View>
        )
    }
    //// verifica si se creo un pedido ese dia
    verificaPedido(){
        this.setState({guardando:true})
        let {idCliente, idUsuario, acceso, puntoId} = this.state
        console.log({idCliente, idUsuario, acceso, puntoId})
        let id = acceso=="cliente" ?idUsuario :idCliente
        axios.get(`ped/pedido/listadoDia/${id}/${puntoId}`)
        .then(res=>{
            const {status, pedido} = res.data
            console.log(res.data)
            if (status){
                if(pedido.length>0){
                    Alert.alert(
                        `hay ${pedido.length} pedidos creados hoy para este cliente`,
                        `desea crearlo`,
                        [
                            {text: 'Confirmar', onPress: () => this.handleSubmit()},
                            {text: 'Cancelar', onPress: () => this.setState({guardando:false})},
                        ],
                        {cancelable: false},
                    )
                }else{
                    this.handleSubmit()
                }
            }else{
                res.data.message.path=="puntoId"
                ?alert("Inserte un punto de entrega")
                :alert("tenemos un problema intentalo nuevamente")
                this.setState({guardando:false})
            }
        })
    }
    handleSubmit(){
       
        let {forma, email, emailCliente, cantidad, idCliente, dia1, dia2, frecuencia, usuarios, novedad, puntoId, fechaSolicitud, idZona, imagen, cliente} = this.state
        email = idCliente ?emailCliente :email
        forma=="monto" ?cantidad = this.campoMonto.getRawValue() :null
        let creado = moment().tz("America/Bogota").add(0, 'days').format('YYYY-MM-DD h:mm')
        console.log({creado, forma, email, cantidad, dia1, dia2, frecuencia, idCliente, puntoId, fechaSolicitud, idZona, novedad})
        let data = new FormData();
        imagen.forEach(e=>{
            data.append('imagen', e);
        })
        data.append('forma', forma);
        data.append('email', email);
        data.append('cantidad', cantidad);
        data.append('dia1', dia1);
        data.append('dia2', dia2);
        data.append('frecuencia', frecuencia ?frecuencia :"");
        data.append('idCliente', idCliente);
        data.append('puntoId', puntoId);
        data.append('fechaSolicitud', fechaSolicitud);
        data.append('idZona', idZona);
        data.append('creado', creado);
        // axios.post("ped/pedido", {forma, email, cantidad, dia1, dia2, frecuencia, idCliente, puntoId, fechaSolicitud, idZona})
        axios({
			method: 'post',  
			url: 'ped/pedido',
			data: data,
			headers: {
			'Accept': 'application/json',
			'Content-Type': 'multipart/form-data'
			}
		})
        .then(e=>{
            let data = new FormData();
            if(e.data.status){
                usuarios.filter(e=>{
                    // sendRemoteNotification(2, e.tokenPhone, "pedidos", `Nuevo Pedido`, `${forma} ${cantidad ?cantidad :""}`, null, null, cliente )
                })
                axios.post(`nov/novedad/`, {pedidoId:e.data.pedido._id, novedad})
                .then((res2)=>{ 
                    console.log(e.data)
                    if(res2.data.status){
                        // this.setState({guardando:false})
                        this.props.navigation.navigate("Home")
                        Toast.show("Su pedido ha sido guardado")
                    }else{
                        Toast.show("Algo salio mal intentalo nuevamente")
                    }
                })
            }else{
                this.setState({guardando:false})
                if(e.data.code==2){
                    alert("Seleccione una zona")
                }else{
                    alert("No pudimos procesar el pedido, intentelo mas tarde", JSON.stringify(e.data))
                }
                    
            }
        })
        .catch(err=>{
            console.log(err)
            this.setState({guardando:false})
            alert("No pudimos procesar el pedido, intentelo mas tarde", JSON.stringify(err))   
        })
    }
}

const mapState = state => {
	return {
        
    };
};
  
const mapDispatch = dispatch => {
    return {
        getUsuariosAcceso: (acceso) => {
            dispatch(getUsuariosAcceso(acceso));
        },
    };
};
  
Nuevo_pedido.defaultProps = {
    clientes:[]
};
  
Nuevo_pedido.propTypes = {
    
};
  
export default connect(
    mapState,
    mapDispatch
)(Nuevo_pedido);
  