import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import {getUsuarios} from '../../redux/actions/usuarioActions'  
 
import Footer    from '../components/footer'
 
 
 

class verPerfil extends Component{
	constructor(props) {
        super(props);
        this.state={

        }
    }
 
    componentWillMount(){
       this.props.getUsuarios()
    }
     
     
    renderUsuarios(){
        const {usuarios} = this.props
        return usuarios.map((e, key)=>{
            return(
                <View style={style.contenedorUsers} key={key}>
                    <Text style={style.textUsers}>{e.nombre}</Text>
                    <Text style={style.textUsers}>{e.email}</Text>
                    <Text style={style.textUsers}>{e.acceso}</Text>
                </View>
            )
        })
    }

    
	render(){
        const {navigation} = this.props
        
        return (
            <View style={style.container}>
                <Text style={style.titulo}>Listado usuarios</Text>
                {
                    <ScrollView style={{ marginBottom:75}}>
                        {this.renderUsuarios()}
                    </ScrollView>
                }
                <Footer navigation={navigation} />
            </View>
        )
    }
     
  
    
}
const mapState = state => {
    console.log(state)
	return {
        usuarios:state.usuario.usuarios,
	};
};


  
const mapDispatch = dispatch => {
	return {
		getUsuarios: () => {
			dispatch(getUsuarios());
        },
	};
};
verPerfil.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(verPerfil) 
