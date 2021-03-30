import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import Icon                from 'react-native-fa-icons';
import {getFrecuencia} from '../../redux/actions/pedidoActions'  
import { createFilter }    from 'react-native-search-filter';
import Footer    from '../components/footer'
import axios from 'axios'
const KEYS_TO_FILTERS = ["forma", "frecuencia", 'dia1', 'dia2', "usuarioId.nombre", "usuarioId.email", "usuarioId.codt", "usuarioId.cedula", "nPedido"] 
 
 

class verPerfil extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:"",
            pedidos:[],
            inicio:0,
            final:10
        }
    }
 
    componentWillMount(){
       this.props.getFrecuencia()
    }
    componentWillReceiveProps(props){
        this.setState({pedidos:props.pedidos, filtroPedidos:props.pedidos})
    }
     
    onScroll(e) {
		const {final} =  this.state
		let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;
        if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            this.setState({final:final+5, showSpin:true})
            this.myInterval = setInterval(()=>this.setState({showSpin:false}), 2000)
        }
	}
    
	render(){
 
      
        const {navigation} = this.props
        const {pedidos, terminoBuscador, inicio, final} = this.state
        let filtroPedidos = pedidos.filter(createFilter(terminoBuscador, KEYS_TO_FILTERS))
        let newPedidos = filtroPedidos.slice(inicio, final) 
        console.log(newPedidos)
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Pedidos: {filtroPedidos.length}</Text>
                <TextInput
                    placeholder="Buscar por: cliente, fecha, forma"
                    autoCapitalize = 'none'
                    placeholderTextColor="#aaa" 
                    onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                    value={terminoBuscador}
                    style={[style.inputCabezera]}
                />
                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)} >
                    {
                        newPedidos.map((e, key)=>{
                            return(
                                <View style={[style.contenedorUsers, {backgroundColor: e.activo ?"white" :"white" }]} key={key}>
                                    <View style={{flexDirection:"row"}}>
                                        <TouchableOpacity 
                                            style={{width:"80%"}}
                                            onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"editar", idUsuario:e.usuarioId._id})
                                        }>
                                            <Text style={style.textUsers}>Cliente: {e.usuarioId.nombre} - {e.usuarioId.codt}</Text>
                                            <Text style={style.textUsers}>N Pedido:{e.nPedido}</Text>
                                            <Text style={style.textUsers}>Forma   :{e.forma} {e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :""}</Text>
                                            <Text style={style.textUsers}>Tipo:    {e.frecuencia}</Text>
                                            {e.frecuencia=="semanal"   &&<Text style={style.textUsers}>{"Dia 1: "+e.dia1}</Text>}
                                            {e.frecuencia=="quincenal" &&<Text style={style.textUsers}>{"Dia 1: "+e.dia1+" - Dia 2: "+e.dia2}</Text>}
                                        </TouchableOpacity>
                                        <View  style={{justifyContent:"center"}}>
                                            <Icon name={'angle-right'} style={style.iconCerrar} />
                                        </View>
                                        <TouchableOpacity 
                                            onPress={()=>this.eliminarFrecuencia(e._id, e.nPedido)}
                                            style={{justifyContent:"center"}}>
                                            <Icon name='trash' style={style.iconDrop} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )
    }
    eliminarFrecuencia(id, nPedido){
        Alert.alert(
            `Seguro deseas eliminar la frecuencia ${nPedido}`,
            ``,
            [
              {text: 'Confirmar', onPress: () => confirmar()},

              {text: 'Cancelar', onPress: () => console.log()},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.put(`ped/pedido/eliminarFrecuencia/`, {id})
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    this.props.getFrecuencia()
                }else{
                    Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
                }
            })
        }
    }
}
const mapState = state => {
    console.log(state.pedido.pedidosFrecuencia)
	return {
        pedidos:state.pedido.pedidosFrecuencia,
	};
};


  
const mapDispatch = dispatch => {
	return {
		getFrecuencia: () => {
			dispatch(getFrecuencia());
        },
	};
};
 
 
	   
export default connect(mapState, mapDispatch)(verPerfil) 
