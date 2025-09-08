import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import Icon from 'react-native-vector-icons/FontAwesome';
import {getFrecuencia} from '../../redux/actions/pedidoActions'  
import Toast from 'react-native-toast-message';
import Footer    from '../components/footer'
import axios from 'axios'
 

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
        const {pedidos, terminoBuscador} = this.state
 
        console.log(pedidos)
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Pedidos: {pedidos.length}</Text>
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
                        pedidos.map((e, key)=>{
                            return(
                                <View style={[style.contenedorUsers, {backgroundColor: e.activo ?"white" :"white" }]} key={key}>
                                    <View style={{flexDirection:"row"}}>
                                        <TouchableOpacity 
                                            style={{width:"80%"}}
                                            onPress={()=>navigation.navigate("verPerfil", {tipoAcceso:"editar", idUsuario:e.usuarioid})
                                        }>
                                            <Text style={style.textUsers}>Cliente: {e.nombre} - {e.codt}</Text>
                                            <Text style={style.textUsers}>N Pedido:{e.pedido_id}</Text>
                                            <Text style={style.textUsers}>Forma   :{e.forma} {e.forma=="cantidad" ?e.cantidadKl :e.forma=="monto" ?e.cantidadPrecio :""}</Text>
                                            <Text style={style.textUsers}>Tipo:    {e.frecuencia}</Text>
                                            {e.frecuencia=="semanal"   &&<Text style={style.textUsers}>{"Dia 1: "+e.dia1}</Text>}
                                            {e.frecuencia=="quincenal" &&<Text style={style.textUsers}>{"Dia 1: "+e.dia1+" - Dia 2: "+e.dia2}</Text>}
                                        </TouchableOpacity>
                                        <View  style={{justifyContent:"center"}}>
                                            <Icon name={'angle-right'} style={style.iconCerrar} />
                                        </View>
                                        <TouchableOpacity 
                                            onPress={()=>this.eliminarFrecuencia(e.pedido_id)}
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
                <Toast />
            </View>
        )
    }
    eliminarFrecuencia(id){
        Alert.alert(
            `Seguro deseas eliminar la frecuencia ${id}`,
            ``,
            [
              {text: 'Confirmar', onPress: () => confirmar()},

              {text: 'Cancelar', onPress: () => console.log()},
            ],
            {cancelable: false},
        );
        const confirmar =()=>{
            axios.delete(`fre/frecuencia/${id}`)
            .then((res)=>{
                console.log(res.data)
                if(res.data.status){
                    Toast.show({type: 'success', text1: 'Frecuencia Eliminada'})
                    this.props.getFrecuencia()
                }else{
                    Toast.show({type: 'error', text1: 'Tenemos un problema, intentelo mas tarde'})
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
