import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, Modal} from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import Icon           from 'react-native-fa-icons' 
 
import {style}        from './style'
 
export default class subirDocumento extends Component{
    constructor(props) {
        super(props);
        this.state={
            imagenes:props.source
        }
    }
    async subirDocumento(){
        let {imagenes} = this.state
        try {
            const response = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
            let imagen = {
                uri:  response.uri,
                type: response.type,
                name: response.name,
                path: response.uri
            };
            
            imagenes.push(imagen)
            this.setState({ imagenes, showModal:false, isAndroidShareOpen:false });
            this.props.imagenes(imagenes)
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
          
          // Pick multiple files
        //   try {
        //     const results = await DocumentPicker.pickMultiple({
        //       type: [DocumentPicker.types.pdf],
        //     });
        //     for (const res of results) {
        //       console.log(
        //         res.uri,
        //         res.type, // mime type
        //         res.name,
        //         res.size
        //       );
        //     }
        //   } catch (err) {
        //     if (DocumentPicker.isCancel(err)) {
        //       // User cancelled the picker, exit any dialogs or menus and move on
        //     } else {
        //       throw err;
        //     }
        //   }
    }
     
   
	renderDocumentos(){
        let {imagenes} = this.state
        let img = []
        imagenes.map(e=>{
            if(e.uri){
                img.push(e)
            }else{
                let img2 = e.split("--")
                img2 = `${img2[2]}`
                img.push({name:img2})
            }
        })
   
 
        return  img.map((e, key)=>{
            return(
                <View key={key} style={style.contenedorPdf}>     
                    <Text style={style.textPdf}>{e.name}</Text>
                    <Icon name={'close'} style={style.iconTrashPdf} onPress={()=>this.eliminarImagen(key)}/>
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
                        <TouchableOpacity style={style.btnOpcionModal} onPress={()=>{this.subirDocumento()}}>
                            <Text style={style.textModal}>Subir Documento</Text>
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
                    &&<View>
                        {this.renderDocumentos()}
                    </View>
                }
            </View>	
        )
    }
}