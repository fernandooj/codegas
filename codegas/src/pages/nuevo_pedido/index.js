import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, ImageBackground, Image, Alert, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import axios                    from 'axios'
import moment                   from 'moment'
import ModalSelector            from 'react-native-modal-selector'
import {Calendar}               from 'react-native-calendars';
import { TextInputMask }        from 'react-native-masked-text'
 
import { connect }              from "react-redux";
import {DataContext} from "../../context/context"
import {getUsuariosAcceso}      from '../../redux/actions/usuarioActions' 
import Footer                   from '../components/footer'
import {style}                  from './style'

import {frecuencias, dias, diasN} from '../../utils/pedido_info'
 
const horaActual = new Date().getHours();
if (horaActual < 16 ) {
    hora=1
} else {
    hora=2
}
class Nuevo_pedido extends Component{
    static contextType = DataContext;
    
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
        email: '',
        nombre: '',
        acceso: '',
        // guardando:true,
        // fechaSolicitud: moment().tz("America/Bogota").add(hora, 'days').format('YYYY-MM-DD')
      }
     
	}
	 
	async componentWillMount(){
        axios
        .get(`users/by/adminsolucion`)
        .then(res => {
  
            if(res.data.status){
                this.setState({usuarios:res.data.usuarios})
            }
        })

        const value = this.context;
        const {acceso, userId: idUsuario, email, nombre} = value
 
        !nombre &&idUsuario ?this.props.navigation.navigate("verPerfil", {tipoAcceso:null}) :null //// si no ha editado el nombre lo mando para editar perfil
        
        axios.get(`pun/punto/byCliente/${idUsuario}`)
        .then(e=>{
            if(e.data.status){
                e.data.puntos.length==1 ?this.setState({puntos:e.data.puntos,  puntoId:e.data.puntos[0]._id}) :this.setState({puntos:e.data.puntos})
            }else{
                Toast.show({
                    type: 'error',
                    text1: 'Tuvimos un problema',
                    text2: 'intentele mas tarde'
                });
            }
        })

        this.setState({idUsuario, acceso, email, nombre})
       
    }
 
    
    getClientes(){
        const {terminoBuscador} = this.state
        axios.get(`users/acceso/10/0/clientes/${terminoBuscador}`)
        .then(res => {

            if(res.data.status){
                this.setState({clientes:res.data.user})
            }
        })
    }
    renderUsuarios(){
        const {clientes} = this.state
        return clientes.map((e, key)=>{
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
                        onPress={()=> this.setState({showClientes:true})}>
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
                            <TouchableOpacity style={style.buscarCliente} onPress={()=>terminoBuscador.length>1 ?(this.getClientes(), this.setState({showRenderUsuarios:true})) :alert("Inserte un valor") }>
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
                    acceso!=="cliente"
                    &&this.renderCliente()
                }
                    {
                puntos.length>1
                ?<View>
                <Text>Selecciona el punto de entrega</Text>
                    {
                        puntos.map((e, key)=>{
                            return (
                                <TouchableOpacity key={key} style={style.btnZona} onPress={()=>this.setState({puntoId:e._id})}>
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
                    onPress={()=>{
                        this.setState({showFechaEntrega:true})
                    }}
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
                
                <TouchableOpacity style={!forma ?style.btnGuardarDisable :style.btnGuardar} 
                    onPress={()=>
                    (acceso=="admin" || acceso=="solucion" || acceso=="veo" || acceso=="comercial" || acceso=="despacho") && !idCliente
                    ?Toast.show({type: 'info', text1: 'Selecciona un cliente'})
                    :(acceso=="admin" || acceso=="solucion" || acceso=="veo" || acceso=="comercial" || acceso=="despacho") && !puntoId
                    ?Toast.show({type: 'info', text1: 'Selecciona una dirección'})
                    :!forma
                    ?Toast.show({type: 'info', text1: 'Selecciona una forma'})
                    :(forma=="monto"&&cantidad<10)
                    ?Toast.show({type: 'info', text1: 'Inserta una cantidad'})
                    :(forma=="cantidad"&&cantidad<10)
                    ?Toast.show({type: 'info', text1: 'Inserta una cantidad'})
                    :(frecuencia=="semanal" || frecuencia=="mensual") &&!dia1
                    ?Toast.show({type: 'info', text1: 'Inserta un dia de frecuencia'})
                    :frecuencia=="quincenal"  &&(!dia1 ||!dia2)
                    ?Toast.show({type: 'info', text1: 'Inserta los dias de frecuencia'})
                    :!fechaSolicitud
                    ?Toast.show({type: 'info', text1: 'Inserta una fecha de Entrega'})
                    :!guardando &&this.verificaPedido()
                }
                >
                    {/* <Text style={style.textGuardar}> {guardando ?"Guardando" :"Guardar pedido"}</Text> */}
                    {/* <Image source={require('../../assets/img/pg3/btnEnviar.png')} style={style.btnEnviar}  resizeMode={'contain'} /> */}
                    <Icon name="caret-square-o-right" style={!forma ?style.iconGuardarDisable :style.iconGuardar} />
                    <Text style={!forma ?style.textGuardarDisable :style.textGuardar}>{!guardando ?"Enviar" :"Enviando..."}</Text>
                    {guardando &&<ActivityIndicator color="#ffffff" />}
                </TouchableOpacity>
                <Toast />
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
    
            if(e.data.status){
                e.data.puntos.length==1 ?this.setState({puntos:e.data.puntos, puntoId:e.data.puntos[0]._id}) :this.setState({puntos:e.data.puntos})
            }else{
                // Toast.show("Tuvimos un problema, intentele mas tarde")
            }
        })
    }
    modalFechaEntrega(){
        let {modalFechaEntrega, fechaSolicitud} = this.state
        fechaSolicitud = moment(fechaSolicitud).format("YYYY-MM-DD")
        let diaActual =  moment().add(0, 'days').format('YYYY-MM-DD')

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
                                onDayPress={(day) => { 
                                    this.setState({
                                        solicitud:true, 
                                        showFechaEntrega:false, 
                                        fechaSolicitud:day.dateString
                                    })
                                    Toast.show({
                                        type: 'info',
                                        text1: 'Esta fecha esta sujeta a verificación',
                                        text2: 'si nuestros vehiculos estan en la zona'
                                    });
                                }}
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
        const { showFechaEntrega} = this.state
        
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
        let id = acceso=="cliente" ?idUsuario :idCliente
        axios.get(`ped/pedido/today/${id}/${puntoId}`)
        .then(res=>{
            const {status, pedido} = res.data
            if (status){
                if(pedido>0){
                    Alert.alert(
                        `hay ${pedido} pedidos creados hoy para este cliente`,
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
        let {forma, cantidad, idCliente, dia1, dia2, frecuencia, novedad: observacion, puntoId, fechaSolicitud, idUsuario} = this.state
   
        const cantidadKl     = forma=="cantidad" ?cantidad :0
        const cantidadPrecio = forma=="monto" 	?this.campoMonto.getRawValue() :0
        
        const data = {
            forma,
            ...(dia1 !== undefined && { dia1 }),
            ...(dia2 !== undefined && { dia2 }),
            ...(frecuencia !== undefined && { frecuencia }),
            puntoId,
            fechaSolicitud,
            cantidadKl,
            cantidadPrecio,
            usuarioCrea: idUsuario,
            usuarioId: idCliente,
            observacion
          };
        console.log(data)
        
        axios({
			method: 'post',  
			url: 'ped/pedido',
			data:  JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json'
            },
		})
        .then(e=>{
            Toast.show({
                type: 'success',
                text1: 'Pedido creado con exito',
            });
            setTimeout(() => {
                this.props.navigation.navigate("Home")
              }, 1000);            
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
  