import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, Modal} from 'react-native'
import ImagePicker  from 'react-native-image-crop-picker';
import Icon         from 'react-native-fa-icons' 
import Lightbox 	from 'react-native-lightbox';
import {style}      from './style'
 
export default class tomarPhoto extends Component{
    constructor(props) {
        super(props);
        this.state={
            imagenes:props.source
        }
    }
    subirImagen(){
        let {imagenes} = this.state
        const options = {
            compressImageMaxWidth:800,
            compressImageMaxHeight:800,
            width: 800,
            height: 800,
            forgeJpg: true,
            // cropping: true,
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
            compressImageMaxHeight:800,
            width: 800,
            height: 800,
            // cropping: true,
            forgeJpg: true,
        };
        ImagePicker.openCamera(options).then(response => {
            
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
        let {imagenes} = this.state
        let img = []
         
        imagenes.map(e=>{
            if(e.uri){
                img.push(e)
            }else{
                let img2 = e.split("-")
                img2 = `${img2[0]}Resize${img2[2]}`
                img.push({uri:img2})
            }
        })
      
        return  img.map((e, key)=>{
            return(
                <Lightbox 
                    key={key}
                    backgroundColor="#ccc"
                    renderContent={() => (
                        <Image 
                            source={{uri: e.uri }}
                            style={{ width: "100%", height:600, backgrundColor:"white"}}
                            resizeMode="contain"
                        />
                    )}
                    >
                    <View key={key}>
                        <Image source={{uri:e.uri}} style={style.imagenesFotos} resizeMode="cover" />
                        <Icon name={'trash'} style={style.iconTrash} onPress={()=>this.eliminarImagen(key)}/>
                    </View>
                     
                </Lightbox>	
            )
        })
    }
    
    eliminarImagen(keyImagen){
        let imagenes = this.state.imagenes.filter((e, key)=>{return key!=keyImagen })    
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
        const {width, avatar, limiteImagenes, tipoMensaje, titulo} = this.props
     
        return(
            <View style={style.contenedorPortada}>
                {
                    showModal
                    &&this.renderModal()
                }
                {
                    tipoMensaje
                    ?this.renderModal()
                    :imagenes.length<limiteImagenes
                    &&<TouchableOpacity style={[style.contenedorUploadPortada, {width}]} onPress={() => this.setState({showModal:true, isAndroidShareOpen:true}) }>
                        <Icon name={'camera'} style={style.iconPortada} />
                        {/* <Text style={style.textPortada}> {!avatar ?"Imagen" :"Avatar"}</Text> */}
                        {!avatar &&<Text style={style.textPortada2}>{titulo}</Text>}
                    </TouchableOpacity>
                }
                {
                    !tipoMensaje
                    &&<View style={{flexDirection:"row"}}>
                        {this.renderImagenes()}
                    </View>
                }
            </View>	
        )
    }
}