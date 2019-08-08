import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, Modal} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-fa-icons' 
 
import {style}   from './style'

export default class tomarPhoto extends Component{
    state={
        imagenes:[]
    }
    componentWillReceiveProps(props){
        console.log(props.source)
        if(props.source){
            if(props.source.length>1){
                let imagenes=[
                    {uri:props.source}
                ]
                this.setState({imagenes})
            }
        } 
    }
    subirImagen(){
        let {imagenes} = this.state
        const options = {
            compressImageMaxWidth:800,
            compressImageMaxHeight:800,
            width: 800,
            forgeJpg: true,
            compressImageQuality:0.5
        };
       
        ImagePicker.openPicker(options).then(response => {
		    if (response) {
				let source = { uri: response.path };
			    let imagen = {
				    uri:  response.path,
				    type: response.mime ?response.mime :'image/jpeg',
				    name: response.fileName ?response.fileName :`imagen.jpg`,
				    path: response.path
                };
                console.log(response)
                imagenes.push(imagen)
			    this.setState({ imagenes, showModal:false, isAndroidShareOpen:false });
                this.props.imagenes(imagenes)
			}
		});
    }
    tomarFoto(){
        let {imagenes} = this.state
        const options = {
            compressImageMaxWidth:800,
            // compressImageMaxHeight:800,
            width: 800,
            // height: avatar?800 :1200,
            // cropping: true,
            forgeJpg: true,
        };
        ImagePicker.openCamera(options).then(response => {
            console.log(response);
            if (response) {
				let source = { uri: response.path };
			    let imagen = {
				    uri:  response.path,
				    type: response.mime ?response.mime :'image/jpeg',
				    name: response.fileName ?response.fileName :`imagen.jpg`,
				    path: response.path
				};
                imagenes.push(imagen)
			    this.setState({ imagenes, showModal:false, isAndroidShareOpen:false });
                this.props.imagenes(imagenes)
			}
		 });
		
	}
	renderImagenes(){
        return  this.state.imagenes.map((e, key)=>{
            return(
                <TouchableOpacity key={key}  onPress={()=>this.eliminarImagen(key)}>
                    <Image source={{uri:e.uri}} style={style.imagenesFotos} />
                    
                        <Icon name={'trash'} style={style.iconTrash}/>
                     
                </TouchableOpacity>
            )
        })
    }
    eliminarImagen(keyImagen){
        // let imagenes = this.state.imagenes.filter((e, key)=>{return key!=keyImagen })    
        let imagenes = []
       
        this.setState({imagenes})    
        this.props.imagenes(imagenes)
    }
    renderModal(){
        const {tipoMensaje, cerrar} = this.props
        return(
            <Modal
                transparent
                visible={this.state.isAndroidShareOpen}
                animationType="fade"
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {  tipoMensaje ?cerrar() :this.setState({  isAndroidShareOpen: false });   }}
                    style={style.btnModal}
                >
                    <View style={style.contenedorModal}>
                        <TouchableOpacity style={style.btnOpcionModal} onPress={()=>{this.subirImagen()}}>
                            <Text style={style.textModal}>Subir Imagen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btnOpcionModal} onPress={()=>{this.tomarFoto()}}>
                            <Text style={style.textModal}>Tomar Foto</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    /*
        TIPOMENSAJE == cuando la foto es para el chat, no muestra, la opcion de tomar foto, si no que muestra directamente el modal
    */
    render(){
        const {imagenes, showModal} = this.state
        const {tipoMensaje, avatar} = this.props
        console.log(imagenes)
        return(
            <View style={style.contenedorPortada}>
                {
                    showModal
                    &&this.renderModal()
                }
                {
                    tipoMensaje
                    ?this.renderModal()
                    :imagenes.length<1
                    &&<TouchableOpacity style={style.contenedorUploadPortada} onPress={() => this.setState({showModal:true, isAndroidShareOpen:true}) }>
                        <Icon name={'camera'} style={style.iconPortada} />
                        <Text style={style.textPortada}> {!avatar ?"Subir Factura" :"Subir Avatar"}</Text>
                        {!avatar &&<Text style={style.textPortada2}>Sube al menos 1 imagen</Text>}
                    </TouchableOpacity>
                }
                {
                    !tipoMensaje && imagenes.length>0
                    &&<View style={{flexDirection:"row"}}>
                        {this.renderImagenes()}
                    </View>
                }
            </View>	
        )
    }
}