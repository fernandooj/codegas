import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, Modal} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-fa-icons' 
 
import {style}   from './style'

export default class tomarPhoto extends Component{
    state={
        imagenes:[]
    }
    subirImagen(){
        const {avatar} = this.props
        let {imagenes} = this.state
        const options = {
            compressImageMaxWidth:800,
            compressImageMaxHeight:avatar?800 :1200,
            width: 800,
            height: avatar?800 :1200,
            cropping: true,
            forgeJpg: true,
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
                imagenes.push(imagen)
			    this.setState({ imagenes, showModal:false, isAndroidShareOpen:false });
                this.props.imagenes(imagenes)
			}
		});
    }
    tomarFoto(){
        const {avatar} = this.props
        let {imagenes} = this.state
        const options = {
            compressImageMaxWidth:800,
            compressImageMaxHeight:avatar?800 :1200,
            width: 800,
            height: avatar?800 :1200,
            cropping: true,
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
                <View key={key}>
                    <Image source={{uri:e.uri}} style={style.imagenesFotos} />
                    <Icon name={'trash'} style={style.iconTrash} onPress={()=>this.eliminarImagen(key)}/>
                </View>
            )
        })
    }
    eliminarImagen(keyImagen){
        let imagenes = this.state.imagenes.filter((e, key)=>{return key!=keyImagen })    
        this.setState({imagenes})    
        this.props.imagenes(imagenes)
    }
    renderModal(){
        return(
            <Modal
                transparent
                visible={this.state.isAndroidShareOpen}
                animationType="fade"
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {  this.setState({  isAndroidShareOpen: false });   }}
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
    render(){
        const {imagenes, showModal} = this.state
        const {source, limiteImagenes, avatar} = this.props
 
        return(
            <View style={style.contenedorPortada}>
            {
                showModal
                &&this.renderModal()
            }
                {
                    imagenes.length<limiteImagenes && !source
                    &&<TouchableOpacity style={style.contenedorUploadPortada} onPress={() => this.setState({showModal:true, isAndroidShareOpen:true}) }>
                        <Icon name={'camera'} style={style.iconPortada} />
                        <Text style={style.textPortada}> {!avatar ?"Subir Portada" :"Subir Avatar"}</Text>
                        {!avatar &&<Text style={style.textPortada2}>Sube al menos 1 imagen</Text>}
                    </TouchableOpacity>
                }
               
                <View style={{flexDirection:"row"}}>
                    {this.renderImagenes()}
                </View>
            </View>	
        )
    }
}