import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Button, Alert, ActivityIndicator, TextInput, Modal, ScrollView, Image, Dimensions, Animated, KeyboardAvoidingView} from 'react-native'
import Toast from 'react-native-simple-toast';
import axios               from 'axios';
import Footer              from '../components/footer'
import {style}             from './style'

 
class Pedido extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        
	  }
	}
	 
    componentWillMount = async () =>{
        
    }
    
    renderCalificacion(){
        const {sugerencia, calificacion} = this.state
        return(
            <View style={style.contenedorCabezera}>
                <Text style={style.titulo}>Nos gustaria que nos dieras tu opinion en tu experiencia en la aplicación</Text>
                <View style={style.subContenedorCabezera}>
                    <View style={style.contenedorCalificacion1}>
                        <TouchableOpacity onPress={()=>this.setState({calificacion:1})}  style={[style.btnCalificacion, calificacion==1 &&{backgroundColor:"#00218b"}]}>
                            <Text style={style.textCalificacion1}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({calificacion:2})}  style={[style.btnCalificacion, calificacion==2 &&{backgroundColor:"#00218b"}]}>
                            <Text style={style.textCalificacion1}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({calificacion:3})}  style={[style.btnCalificacion, calificacion==3 &&{backgroundColor:"#00218b"}]}>
                            <Text style={style.textCalificacion1}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({calificacion:4})}  style={[style.btnCalificacion, calificacion==4 &&{backgroundColor:"#00218b"}]}>
                            <Text style={style.textCalificacion1}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({calificacion:5})}  style={[style.btnCalificacion, calificacion==5 &&{backgroundColor:"#00218b"}]}>
                            <Text style={style.textCalificacion1}>5</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder="Sugerencias"
                        autoCapitalize = 'none'
                        onChangeText={(sugerencia)=> this.setState({ sugerencia: sugerencia })}
                        value={sugerencia}
                        multiline = {true}
                        style={[style.inputCabezera]}
                    />
                    <TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit()}>
                        <Text style={style.textGuardar} >Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
	render(){
        const {navigation} = this.props       
        return (
            <View style={style.container}>
                <ScrollView style={style.subContenedor} keyboardDismissMode="on-drag">
                    <View style={style.container}>
                        {this.renderCalificacion()}
                    </View>
                </ScrollView>
                
                <Footer navigation={navigation} />
            </View>
        )             
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////            CAMBIO EL ESTADO DEL PEDIDO
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    handleSubmit(){
        const {sugerencia, calificacion} = this.state
        const {id} = this.props.navigation.state.params
        axios.post(`cal/calificacion/`, {sugerencia, calificacion, idConversacion:id})
        .then(res=>{
            console.log(res.data)
            if(res.data.status){
                this.props.navigation.navigate("Home")
                Toast.show("Gracias por visitarnos")
            }else{
                Toast.show("Tenemos un problema, intentelo mas tarde", Toast.LONG)
            }
        })
    }    
}
 
  
export default Pedido