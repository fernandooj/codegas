import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, Modal, Alert} from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
 
import {style}        from './style'
 
const getBase64FromUri = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      return null;
    }
  };


export default class subirDocumento extends Component{
    constructor(props) {
        super(props);
        this.state={
            imagenes:  props.source.length > 1 ? props.source.map(item => JSON.parse(item)) : []
        }
      
   
    }
  
   
    async subirDocumento(){
        let {imagenes} = this.state
        try {
            const response = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
    
            const base64 = await getBase64FromUri(response[0].uri);
            
   
            let imagen = {
                imagen:  base64,
                name: response[0].name,
                uri: response[0].uri
            };
            
            imagenes.push(imagen)
            this.setState({ imagenes, showModal:false, isAndroidShareOpen:false });
            this.props.imagenes(imagen)
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
    }
     
   
	renderDocumentos(){
        let {imagenes} = this.state
        // let img = []
        // imagenes.map(e=>{
        //     img.push({uri:e, name:e}) 
        // })
        // console.log(props.titulo)
        console.log(imagenes)
        return imagenes.map((e, key)=>{
            return(
                <View key={key} style={style.contenedorPdf}>   
                    <TouchableOpacity onPress={()=>this.props.navigate("pdf", {uri:e.uri}) }>
                        <Text style={style.textPdf}>{e.name}</Text>
                    </TouchableOpacity>  
                    <Icon name={'close'} style={style.iconTrashPdf} onPress={()=>this.eliminarPdf(key)}/>
                </View>
            )
        })
    }
 
    eliminarPdf(keyImagen){
        Alert.alert(
            'Eliminar Pdf',
            'seguro desea eliminar este pdf',
            [
               
              {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'Eliminar', onPress: () => eliminar() }
            ],
            { cancelable: false }
        );

        const eliminar =()=>{
            console.log({imagenes:this.state.imagenes, keyImagen})
            let imagenes = this.state.imagenes.filter((e, key)=>{
              return key!=keyImagen 
            })  
            console.log({imagenes2:imagenes})  
            this.setState({imagenes})    
            this.props.imagenes(imagenes)
        }

        
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