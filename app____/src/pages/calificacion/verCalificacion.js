import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import Toast from 'react-native-simple-toast';
import {style}   from './style'
import axios from "axios"
import moment from "moment"
 import Footer    from '../components/footer'
 

class verCalificacion extends Component{
	constructor(props) {
        super(props);
        this.state={
            calificacion:[]
        }
    }
 
    componentWillMount(){
      axios.get("cal/calificacion/")
      .then(e=>{
          console.log(e.data)
          e.data.status ?this.setState({calificacion:e.data.calificacion}) :Toast.show("Tenemos un problema intentalo mas tarde")
      })
    }
     
     
    renderCalificacion(){
        const {calificacion} = this.state
        console.log(calificacion)
        return calificacion.map((e, key)=>{
            return(
                <View style={style.contenedorCalificacion} key={key}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={style.textCalificacion}>Empleado</Text>
                        <Text style={style.textCalificacion}>{e.data[0].nombreEmpleado}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={style.textCalificacion}>Cliente</Text>
                        <Text style={style.textCalificacion}>{e.data[0].nombreCliente}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={style.textCalificacion}>Calificacion</Text>
                        <Text style={style.textCalificacion}>{e.data[0].calificacion}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={style.textCalificacion}>Sugerencia</Text>
                        <Text style={style.textCalificacion}>{e.data[0].sugerencia}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={style.textCalificacion}>Creado</Text>
                        <Text style={style.textCalificacion}>{moment(e.data[0].fecha).format("YYYY-MM-DD")}</Text>
                    </View>
                </View>
            )
        })
    }

    
	render(){
        const {navigation} = this.props
        
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Listado Calificaciones</Text>
                {
                    <ScrollView style={{ marginBottom:75}}>
                        {this.renderCalificacion()}
                    </ScrollView>
                }
                <Footer navigation={navigation} />
            </View>
        )
    }
     
  
    
}
 
 
	   
export default verCalificacion
