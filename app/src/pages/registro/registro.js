import React, {Component} from 'react'
import {View, Text, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, ScrollView} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
 
import Footer   from '../components/footer'
import axios    from 'axios'
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
 
 
import {style} from './style'

 
let screenWidth = Dimensions.get('window').width;
 
 
class Home extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        terminoBuscador:"",
        razon_social:"",
        cedula:"",
        direccion:"",
        email:"",
        nombre:"",
        password:"",
        celular:"",
        tipo:"",
		inicio:0,
		final:7,
		categoriaUser:[]
	  }
	}
	 
	async componentWillMount(){
	  
			
	}
	renderRegistro(){
        const {razon_social, cedula, ubicacion, direccion, email, nombre, password, celular, tipo} = this.state
        return(
            <ScrollView style={style.containerRegistro}>
                <View style={style.subContainerRegistro}>
                    <Text style={style.titulo}>Editar Perfil</Text>
                    <TextInput
                        style={razon_social.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Razón social"
                        onChangeText={(razon_social) => this.setState({razon_social})}
                        value={razon_social}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={cedula.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Cedula / Nit"
                        onChangeText={(cedula) => this.setState({cedula})}
                        value={cedula}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={direccion.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Dirección"
                        onChangeText={(direccion) => this.setState({direccion})}
                        value={direccion}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={nombre.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Nombre"
                        onChangeText={(nombre) => this.setState({nombre})}
                        value={nombre}
                        autoCapitalize="none"
                    />
                    
                    <TextInput
                        style={password.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Contraseña"
                        onChangeText={(password) => this.setState({password})}
                        secureTextEntry
                        value={password}
                    />
                    <TextInput
                        style={celular.length<2 ?[style.input, style.inputInvalid] :style.input}
                        placeholder="Celular"
                        onChangeText={(celular) => this.setState({celular})}
                        value={celular}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={style.btnGuardar} onPress={()=>this.handleSubmit()}>
                        <Text style={style.textGuardar}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
	  
	render(){
        const {navigation} = this.props
      
	    return (
				<View style={style.container}>
					<KeyboardAwareScrollView style={style.containerRegistro}>
                         {this.renderRegistro()}
					</KeyboardAwareScrollView>
					<Footer navigation={navigation} />
				</View>
		)
	}
    handleSubmit(){
        const {razon_social, cedula, ubicacion, direccion, nombre, password, celular, tipo} = this.state
        let acceso = "cliente";
        console.log({razon_social, cedula, ubicacion, direccion, nombre, password, celular, tipo, acceso})
        axios.put("user/update", {razon_social, cedula, ubicacion, direccion, nombre, password, celular, tipo, acceso})
        .then(e=>{
            console.log(e.data)
            e.data.status ?this.props.navigation.navigate("Home") :Toast.show("Tenemos un problema, intentelo mas tarde")
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

const mapState = state => {
	return {
		 
	  };
  };
  
	const mapDispatch = dispatch => {
		return {
		
		};
	};
  
  Home.defaultProps = {
	 
  };
  
  Home.propTypes = {
	 
  };
  
  export default connect(
	mapState,
	mapDispatch
  )(Home);
  