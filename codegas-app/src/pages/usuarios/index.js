import React, {Component} from 'react'
import {View, Text, TouchableOpacity, ScrollView, Button, TextInput, ActivityIndicator, Alert} from 'react-native'
import {style}   from './style'
import {connect} from 'react-redux' 
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUsuarios} from '../../redux/actions/usuarioActions'  
 
import Footer    from '../components/footer'
 
const ACCESO = 'clientes'

class verPerfil extends Component{
	constructor(props) {
        super(props);
        this.state={
            terminoBuscador:undefined,
            inicio:0,
            final:false,
            limit:10,
            showSearch: true

        }
    }
 
    componentDidMount(){
       this.searchUser()
    }
     
    onScroll(event) {
        const {final, limit, inicio, terminoBuscador} =  this.state
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;
        
        if (reachedEnd && !final) {
          this.setState({ final: true, limit: limit+10 });
          this.searchUser()
        } else if (!reachedEnd && final) {
          this.setState({ final: false });
        }
	}
    renderUsuarios(){
      const {usuarios, navigation} = this.props
      return usuarios.map((e, key)=>{
        return(
          <View style={[style.contenedorUsers, {backgroundColor: e.activo ?"white" :"red" }]} key={key}>
            <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>navigation.state.params ?navigation.navigate("puntos", {idUsuario:e._id}) :navigation.navigate("editarPerfil", {tipoAcceso:"editar", idUsuario:e._id})}>
                <View style={{width:"90%"}}>
                    
                  {e.acceso=="cliente" 
                    &&<Text style={style.textUsers}>
                        {e.idPadre ?"Punto consumo: "+e.idPadre.razon_social.toUpperCase() :e.razon_social && e.razon_social.length!==0  &&e.razon_social.toUpperCase()}
                    </Text>}
                  {e.nombre && e.nombre.length!==0 ?<Text style={style.textUsers}>{e.nombre.toUpperCase()}</Text> :null }
                  {e.email && e.email.length!==0 ?<Text style={style.textUsers}>{e.email.toUpperCase()}</Text> :null }
                  {e.acceso && e.acceso.length!==0 ?<Text style={style.textUsers}>{e.acceso.toUpperCase()}</Text> :null }
                </View>
                <View  style={{justifyContent:"center"}}>
                    <Icon name={'angle-right'} style={style.iconCerrar} />
                </View>
            </TouchableOpacity>
          </View>
        )
      })
    }    
  searchUser =(clean)=> {
    const {limit, inicio, terminoBuscador} = this.state
    this.props.getUsuarios(limit, inicio, ACCESO, clean ?'' :terminoBuscador )
  }
	render(){
        const {navigation, usuarios} = this.props
        const {terminoBuscador, showSearch} = this.state
        return (
            <View style={style.container}>
                {
                    navigation.state.params 
                    ?<TouchableOpacity onPress={()=>navigation.navigate("revision")} style={{padding:10}}>
                        <Text style={style.titulo}>Ver por revisiones</Text>
                    </TouchableOpacity>
                    :<Text style={style.titulo}>Listado usuarios</Text>
                }
                <View style={{flexDirection:"row"}}>
                  <TextInput
                      placeholder="Buscar por: cliente, fecha, forma"
                      autoCapitalize = 'none'
                      placeholderTextColor="#aaa" 
                      onChangeText={(terminoBuscador)=> this.setState({ terminoBuscador: terminoBuscador })}
                      value={terminoBuscador}
                      style={[style.inputCabezera]}
                  />
                  {
                    showSearch
                    ?<TouchableOpacity style={style.buscarCliente} onPress={()=>terminoBuscador.length>1 ?(this.searchUser(), this.setState({showSearch:false})) :alert("Inserte un valor") }>
                      <Icon name='search' style={style.iconSearch} />
                    </TouchableOpacity>
                    :<TouchableOpacity style={style.buscarCliente} onPress={()=>(this.setState({showSearch:true, terminoBuscador: ''}), this.searchUser('clean')) }>
                      <Icon name='close' style={style.iconSearch} />
                    </TouchableOpacity>
                  }
                  
                  
                </View>
                <ScrollView style={{ marginBottom:85}} onScroll={(e)=>this.onScroll(e)}  keyboardDismissMode="on-drag" scrollEventThrottle={16} >
                    {
                        usuarios.length==0
                        ?<ActivityIndicator color="#00218b" />
                        :!navigation.state.params 
                        ?this.renderUsuarios()
                        :terminoBuscador.length>2
                        ?this.renderUsuarios()
                        :<Text>Digita un usuario</Text>
                    }
                </ScrollView>
                <Footer navigation={navigation} />
            </View>
        )
    }
}
const mapState = state => {
	return {
        usuarios:state.usuario.usuarios,
        usuariosFiltro:state.usuario.usuarios,
	};
};


  
const mapDispatch = dispatch => {
	return {
		getUsuarios: (limit, inicio, ACCESO, terminoBuscador) => {
			dispatch(getUsuarios(limit, inicio, ACCESO, terminoBuscador));
      },
	};
};
verPerfil.defaultProps={
    perfil:{categoria:[]}
}
 
	   
export default connect(mapState, mapDispatch)(verPerfil) 
