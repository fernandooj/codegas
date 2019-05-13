import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage        from '@react-native-community/async-storage';
import Icon                from 'react-native-fa-icons';
import axios               from 'axios'
import ModalSelector       from 'react-native-modal-selector'
import ModalFilterPicker   from 'react-native-modal-filter-picker'
import { TextInputMask }   from 'react-native-masked-text'
import { connect }         from "react-redux";
import {getUsuariosAcceso} from '../../redux/actions/usuarioActions' 
import Footer              from '../components/footer'
import {style}             from './style'
 
 
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
const diasN  = [
	{label:1, key:1},
	{label:2, key:2},
	{label:3, key:3},
	{label:4, key:4},
	{label:5, key:5},
	{label:6, key:6},
	{label:7, key:7},
	{label:8,  key:8},
	{label:9,  key:9},
	{label:10, key:10},
	{label:11, key:11},
	{label:12, key:12},
	{label:13, key:13},
	{label:14, key:14},
	{label:15, key:15},
	{label:16, key:16},
	{label:17, key:17},
	{label:18, key:18},
	{label:19, key:19},
	{label:20, key:20},
	{label:21, key:21},
	{label:22, key:22},
	{label:23, key:23},
	{label:24, key:24},
	{label:25, key:25},
	{label:26, key:26},
	{label:27, key:27},
	{label:28, key:28},
	{label:29, key:29},
	{label:30, key:30},
	{label:31, key:31}
]

class Nuevo_pedido extends Component{
	constructor(props) {
	  super(props);
	  this.state={
		terminoBuscador:"",
		inicio:0,
		final:7,
        categoriaUser:[],
        modalCliente:false
	  }
	}
	 
	async componentWillMount(){
        this.props.getUsuariosAcceso("cliente")
        const idUsuario = await AsyncStorage.getItem('userId')
        const acceso   	= await AsyncStorage.getItem('acceso')
        const email   	= await AsyncStorage.getItem('email')
        this.setState({idUsuario, acceso, email})
	}
	renderPedido(){
        const {forma, acceso, cantidad, showFrecuencia, frecuencia, dia, dia2, franja, idCliente} = this.state
        return(
            <KeyboardAwareScrollView style={style.containerNuevo}>
                <View style={style.subContainerNuevo}>
                    <Text style={style.titulo}>Realice su pedido</Text>
                    <View style={style.contenedorMonto}>
                        <Text style={style.tituloForm}>De que forma desea llenarlo</Text>
                        <TouchableOpacity onPress={()=>this.setState({forma:"monto", cantidad:""})} style={style.btnFormaLlenar}>
                            <Text style={style.textForma}>Monto $</Text>
                            {forma=="monto" &&<Icon name="check" style={style.icon} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({forma:"cantidad", cantidad:""})} style={style.btnFormaLlenar}>
                            <Text style={style.textForma}>Cantidad KL</Text>
                            {forma=="cantidad" &&<Icon name="check" style={style.icon} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({forma:"lleno", cantidad:""})} style={style.btnFormaLlenar}>
                            <Text style={style.textForma}>Lleno total</Text>
                            {forma=="lleno" &&<Icon name="check" style={style.icon} />}
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
                                        onChange={(option)=>{ this.setState({dia1:option.key}) }} 
                                        selectStyle={!dia1 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                    />
                                :frecuencia=="mensual"
                                ?<ModalSelector
                                    style={style.btnFrecuencia}
                                    data={diasN}
                                    initValue={"Dia"}
                                    onChange={(option)=>{ this.setState({dia1:option.key}) }} 
                                    selectStyle={!dia1 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                />
                                :<View style={style.contenedorFrecuencia}>
                                    <ModalSelector
                                        style={style.btnFrecuencia}
                                        data={diasN.slice(0,15)}
                                        initValue={"Dia 1"}
                                        onChange={(option)=>{ this.setState({dia:option.key}) }} 
                                        selectStyle={!dia &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                    />
                                    <ModalSelector
                                        style={style.btnFrecuencia}
                                        data={diasN.slice(15,31)}
                                        initValue={"Dia 2"}
                                        onChange={(option)=>{ this.setState({dia2:option.key}) }} 
                                        selectStyle={!dia2 &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                    />
                                </View>
                                :null
                            }
                            {
                                frecuencia
                                &&<ModalSelector
                                    style={style.btnFrecuencia}
                                    data={franjas}
                                    initValue={"Franja Horaria"}
                                    onChange={(option)=>{ this.setState({franja:option.key}) }} 
                                    selectStyle={!franja &&{borderColor:"rgba(255, 0, 0, 0.22)"}}
                                />
                            }
                        </View>
                    }
                    {
                        acceso=="admin" || acceso=="solucion"
                        ?this.renderCliente()
                        :null
                    }

                    <TouchableOpacity style={!forma ?style.btnGuardarDisable :style.btnGuardar} onPress={()=>
                        (acceso=="admin" || acceso=="solucion") && !idCliente
                        ?alert("selecciona un cliente")
                        :this.handleSubmit()
                    }>
                        <Text style={style.textGuardar}>Guardar pedido</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        )
       
    }
    filtroClientes(idCliente){
		let cliente = this.props.clientes.filter(e=>{ return e.key==idCliente })
		this.setState({cliente:cliente[0].label, idCliente, emailCliente:cliente[0].email, modalCliente:false})
	}
    renderCliente(){
        const {idCliente, modalCliente, cliente} = this.state
		return (
			<View>
				<ModalFilterPicker
					placeholderText="Filtrar ..."
					visible={modalCliente}
					onSelect={(e)=>this.filtroClientes(e)}
					onCancel={()=>this.setState({modalCliente:false})}
					options={this.props.clientes}
					// noResultsText="Crear Titulo"
					// crearTitulo={(titulo)=>this.setState({titulo, showTitulo:false})}
                />
                {
                    idCliente
                    ?<TouchableOpacity style={style.eliminarFrecuencia} onPress={()=>this.setState({idCliente:null, cliente:null})}>
                        <Icon name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Eliminar cliente</Text>
                    </TouchableOpacity>
                    :<TouchableOpacity style={style.nuevaFrecuencia} onPress={()=>this.setState({modalCliente:true})}>
                        <Icon name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Asignar Cliente</Text>
                    </TouchableOpacity>
                }
                <Text>{cliente}</Text>
               
            </View>
		)
	}	
	render(){
        const {navigation} = this.props
	    return (
				<View style={style.container}>
					<ScrollView>
                        {this.renderPedido()}
                   
					</ScrollView>
					<Footer navigation={navigation} />
				</View>
		)
	}
    handleSubmit(){
        let {forma, email, emailCliente, cantidad, idCliente, dia1, dia2, frecuencia} = this.state
        email = idCliente ?emailCliente :email
        console.log({forma, email, cantidad, dia1, dia2, frecuencia, idCliente})
        axios.post("ped/pedido", {forma, email, cantidad, dia1, dia2, frecuencia, idCliente})
        .then(e=>{
            console.log(e.data)
            if(e.data.status){
                alert("Su pedido ha sido guardado")    
                this.props.navigation.navigate("pedido")
            }else{
                alert("No pudimos procesar el pedido, intentelo mas tarde")    
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

const mapState = state => {
    let clientes = state.usuario.usuariosAcceso.map(e=>{
        return {key:e._id, label:e.nombre+" -" +e.cedula, email:e.email}
    })
	return {
        clientes
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
  