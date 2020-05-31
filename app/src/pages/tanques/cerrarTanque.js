import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, Image, Dimensions, Animated} from 'react-native'
import Toast from 'react-native-simple-toast';
 
import DatePicker 			           from 'react-native-datepicker'
 
import axios                           from 'axios';
import Lightbox 					   from 'react-native-lightbox';
import Icon                            from 'react-native-fa-icons';
 
import TomarFoto                       from "../components/tomarFoto";
import { connect }                     from "react-redux";
import {getUsuariosAcceso}             from '../../redux/actions/usuarioActions'
import {getVehiculos}                  from '../../redux/actions/vehiculoActions'
import Footer                          from '../components/footer'
import {style}                         from './style'
 
 

let size  = Dimensions.get('window');
class Tanques extends Component{
	constructor(props) {
	    super(props);
	    this.state={
            modalCliente:false,
            modalSectores:false,
            modalZona:false,
            modalPropiedad:false,
            modalUbicacion:false,
            modalM3:false,
            modalPlacas:false,
            modalCapacidad:false,
            clientes:[],
            puntos:[],
            placas:[],
            imgPlaca:[],
            imgVisual:[],
            imgPlacaFabricante:[],
            imgAlertaTanque:[],
            imgDossier:[],
            imgCerFabricante:[],
            imgCerOnac:[],
            imgUltimaRev:[],
            revisiones:[],
            alertas:[],
            alertaText:""
	    }
    }
    async componentWillMount(){
        try{
            axios.get(`tan/tanque`)
            .then(res=>{
                let placas = res.data.tanque
                placas = placas.map(e=>{
                    return{
                        key:e._id,
                        label:e.placaText
                    }
                }) 
                this.setState({placas})
            })
            
 
            
            let tanqueId  = this.props.navigation.state.params.tanqueId ?this.props.navigation.state.params.tanqueId :null
            let placaText = this.props.navigation.state.params.placaText ?this.props.navigation.state.params.placaText :null
            let puntoId   = this.props.navigation.state.params.puntoId ?this.props.navigation.state.params.puntoId :null
            let usuarioId = this.props.navigation.state.params.usuarioId ?this.props.navigation.state.params.usuarioId :null

            if(usuarioId){
                axios.get(`user/byId/${usuarioId}`)
                .then(res => {
                    const {cedula, razon_social, direccion_factura, nombre, celular, email} = res.data.user
                    this.setState({
                        cedulaCliente:cedula, razon_socialCliente:razon_social, direccion_facturaCliente: direccion_factura, nombreCliente:nombre, celularCliente: celular, emailCliente: email

                    })
                })
                axios.get(`pun/punto/byId/${puntoId}`)
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        puntos:res.data.punto
                    })
                })
               
            }
 
            this.setState({placaText, puntoId, usuarioId})
            if(tanqueId){
                axios.get(`ult/ultimaRev/byTanque/${tanqueId}`)
                .then(res=>{
                    console.log(res.data.revision)
                    this.setState({revisiones:res.data.revision})
                })
                axios.get(`ale/alertaTanque/byTanque/${tanqueId}`)
                .then(res=>{
                    console.log(res.data.alerta)
                    this.setState({alertas:res.data.alerta})
                })

                axios.get(`tan/tanque/byId/${tanqueId}`)
                .then(res => {
                    console.log(res.data)
                    const {tanque} = res.data
                    this.setState({
                        /////// step 1
                        tanqueId:  tanque._id,
                        placaText :             tanque.placaText         ?tanque.placaText          :"",
                        capacidad:              tanque.capacidad         ?tanque.capacidad          :"",
                        fabricante:             tanque.fabricante        ?tanque.fabricante         :"",
                        registroOnac:           tanque.registroOnac ?tanque.registroOnac  :"",
                        fechaUltimaRev:         tanque.fechaUltimaRev    ?tanque.fechaUltimaRev     :"",
                        
                        nPlaca:                 tanque.nPlaca            ?tanque.nPlaca             :"",
                        codigoActivo:           tanque.codigoActivo      ?tanque.codigoActivo       :"",
                        serie:                  tanque.serie             ?tanque.serie              :"",
                        anoFabricacion:         tanque.anoFabricacion    ?tanque.anoFabricacion     :"",
                        existeTanque:           tanque.existeTanque      ?tanque.existeTanque       :"",
                        modalPlacas:false    
                    })
                })
            }else{
                this.setState({crearPlaca:true})    /// esta linea es para cuando creo la placa desde revision, el crear placa sera verdadero, o de lo contrario editara un tanque que aun no existe
            }   
        }catch(e){
            console.log(e)
        }    
        
    }
    
    renderModaAlerta(){
        let {cerradoText, imgAlertaTanque, alertaText} = this.state
 
		return(
			<Modal transparent visible={true} animationType="fade" >
				<TouchableOpacity activeOpacity={1} >
					<View style={style.contenedorModal}>
						<View style={style.subContenedorModalUbicacion}>
							<TouchableOpacity activeOpacity={1} onPress={() => this.setState({showAlerta:false})} style={style.btnModalClose}>
								<Icon name={'times-circle'} style={style.iconCerrar} />
							</TouchableOpacity>
                            <Text>cerrar Alerta: {alertaText}</Text>
                            <TextInput
                                placeholder="Comentarios"
                                value={cerradoText}
                                style={style.inputStep4}
                                onChangeText={(cerradoText)=> this.setState({ cerradoText })}
                            />
                             {/* PLACA MANTENIMIENTO*/}
                                <TomarFoto 
                                    source={imgAlertaTanque}
                                    width={180}
                                    titulo="Alerta"
                                    limiteImagenes={4}
                                    imagenes={(imgAlertaTanque) => {  this.setState({imgAlertaTanque}) }}
                                />
                            <TouchableOpacity style={style.nuevaRevision} onPress={()=>cerradoText.length>5 ?this.cerrarAlerta() :alert("Inserte una alerta") }>
                                <Text style={style.textGuardar}>Cerrar</Text>
                            </TouchableOpacity>
                            
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
		)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////           CERRAR ALERTA
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    cerrarAlerta(){
        let {imgAlertaTanque, cerradoText, alertaId, tanqueId} = this.state
 
        let data = new FormData();
        imgAlertaTanque.forEach(e=>{
            data.append('imgAlertaTanque', e);
        })
        data.append('cerradoText', cerradoText);
        axios({
            method: 'put',   
            url: `ale/alertaTanque/cerrar/${alertaId}`,
            data: data,
        })
        .then((res)=>{
            console.log(res.data)
            
                axios.get(`ale/alertaTanque/byTanque/${tanqueId}`)
                .then(res2=>{
                    alert("Alerta Cerrada")
                    console.log(res2.data.alerta)
                    this.setState({alertas:res2.data.alerta, showAlerta:false })
                })
            
        })
        .catch(err=>{
            this.setState({cargando:false})
        })
    }
    renderAlertas(){
        const {alertas, showAlerta} = this.state
        return(
            <View>
                {showAlerta &&this.renderModaAlerta()}
                  
                <View>
                    <View style={style.contenedorRevision}>
                        <Text style={style.alertaTit}>Alerta</Text>
                        <Text style={style.alertaTit}>Crea</Text>
                        <Text style={style.alertaTit}>Cierra</Text>
                        <Text style={style.alertaTit}>Imagen</Text>
                    </View>   
                    {
                        alertas.map(e=>{
                            let imagen = e.alertaImagen[0]
                            imagen = imagen ?imagen.split("-") :""
                            imagen = `${imagen[0]}Resize${imagen[2]}`
                            return(
                                <TouchableOpacity style={[style.contenedorRevision, {backgroundColor: e.activo ?"#F96D6C" :"#fff"} ]} key={e._id} onPress={()=>this.setState({showAlerta:true, alertaText:e.alertaText, alertaId:e._id })}>
                                    <Text style={style.alertaText}>{e.alertaText}</Text>
                                    <Text style={style.alertaText}>{e.usuarioCrea.nombre}</Text>
                                    <Text style={style.alertaText}>{e.usuarioCierra ?e.usuarioCierra.nombre :""}</Text>
                                    <Lightbox 
                                        backgroundColor="#fff"
                                        renderContent={() => (
                                            <Image
                                                source={{uri: imagen }}
                                                style={{ width:"100%", height:400, resizeMode:"contain" }}
                                            />
                                            )}
                                    >
                                        <Image
                                            source={{ uri: imagen  }}
                                            style={style.imagen}
                                        />
                                    </Lightbox>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View> 
        )
    }
     

	render(){
        const {navigation} = this.props
        return (
            <>
                <View>
                    {this.renderAlertas()}
                    {
                        this.state.loading
                        &&<View style={style.loadingContain}>
                            <ActivityIndicator color="#00218b" size={'large'} />
                        </View>
                    }
                </View>
                <Footer navigation={navigation} />
            </>
        )
    }
     
    
    



    
    
}

const mapState = state => {
	return {
        conductores:state.usuario.usuariosAcceso,
        vehiculos:state.vehiculo.vehiculos
	};
};

const mapDispatch = dispatch => {
    return {
        getVehiculos: () => {
            dispatch(getVehiculos());
        },
        getUsuariosAcceso: (acceso) => {
            dispatch(getUsuariosAcceso(acceso));
        },
    };
};

Tanques.defaultProps = {
    vehiculos:[],
    conductores:[]
};

Tanques.propTypes = {

};

  export default connect(
	mapState,
	mapDispatch
  )(Tanques);
