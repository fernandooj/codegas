import React, {Component} from 'react'
import {View, Text, TouchableOpacity,  Dimensions, ScrollView, Image} from 'react-native'
import Icon from 'react-native-fa-icons';
import CodeInput from 'react-native-confirmation-code-input';
import Toast from 'react-native-simple-toast';
import {style} from './style'
import axios from 'axios';
const screenWidth = Dimensions.get('window').width;
 
 

export default class ConfirmarComponent extends Component{
	constructor(props) {
	  super(props);
	  this.state={
        porcentaje:60,
        titulo:'HEMOS ENVIADO UN CODIGO A TU CORREO',
        code:"0000"
      }
    }
    componentWillMount(){
        const {params} = this.props.navigation.state
        console.log(params)
		this.setState({
			code:params.code.toString(), 
			email:params.email, 
		})
    }
   
    cabezera(){
 
		return(
			<View style={style.regresarContenedor}>
                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("perfil")} style={style.btnRegresar}>
                    <Icon name={'arrow-left'} allowFontScaling style={style.iconRegresar} />
                </TouchableOpacity> */}
                <Text style={style.tituloRegresar}>Hemos enviado un correo con un codigo de verificación</Text>
            </View>
		)
    }
    renderContenido(){
        return <CodeInput
            ref="codeInputRef2"
            keyboardType="numeric"
            codeLength={4}
            className={'border-b'}
            compareWithCode={this.state.code}
            autoFocus={true}
            activeColor='#0071bb'
            inactiveColor='rgba(49, 180, 4, 1.3)'
            codeInputStyle={{ fontWeight: '800' }}
            onFulfill={(isValid, code) => this.onFinish(isValid, code)}
        />

    }
	render(){
		const {navigate} = this.props.navigation
	    return <ScrollView style={style.container}>
                {this.cabezera()}
                {this.renderContenido()}
                <Text></Text>
            </ScrollView>
    }
    onFinish(isValid){
        if(isValid){
            const {code, email} = this.state
            axios.post("user/verificaToken", {token:code, email})
            .then(res=>{
                alert("tu usuario ha sido activado")
                res.data.status ?this.props.navigation.navigate("privacidad") : Toast.show("Tenemos un problema intentalo mas tarde")
            })
        }else{
            Toast.show("Codigo Incorrecto")
        }
    }
 
}

