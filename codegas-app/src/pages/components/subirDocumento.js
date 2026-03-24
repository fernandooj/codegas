import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Modal, Alert, Dimensions, Platform } from 'react-native'
import { pick, types } from '@react-native-documents/picker';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';

import { style } from './style'

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

export default class subirDocumento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagenes: props.source && props.source.length >= 1 ? props.source.map(item => {
                try {
                    return typeof item === 'string' ? JSON.parse(item) : item;
                } catch (e) {
                    return item;
                }
            }) : []
        }
    }

    componentDidUpdate(prevProps) {
        // Sincronizar con props cuando cambien
        if (prevProps.source !== this.props.source) {
            this.setState({
                imagenes: this.props.source && this.props.source.length >= 1 ? this.props.source.map(item => {
                    try {
                        return typeof item === 'string' ? JSON.parse(item) : item;
                    } catch (e) {
                        return item;
                    }
                }) : []
            });
        }
    }


    async subirDocumento() {
        let { imagenes } = this.state
        const { limiteImagenes, soloLectura } = this.props;

        // Verificar si está en modo solo lectura
        if (soloLectura) {
            Alert.alert('Modo solo lectura', 'No se pueden agregar documentos en modo solo lectura');
            return;
        }

        // Verificar límite de documentos
        if (imagenes.length >= limiteImagenes) {
            Alert.alert('Límite alcanzado', `Solo se permiten ${limiteImagenes} documentos`);
            return;
        }

        try {
            const [result] = await pick({
                mode: 'open',
                type: [types.pdf],
                allowMultiSelection: false,
            });

            if (!result) {
                return;
            }

            const base64 = await getBase64FromUri(result.uri);

            if (!base64) {
                Alert.alert('Error', 'No se pudo procesar el documento');
                return;
            }

            let documento = {
                imagen: base64,
                name: result.name || `documento_${Date.now()}.pdf`,
                uri: result.uri
            };

            const nuevasImagenes = [...imagenes, documento];
            this.setState({ imagenes: nuevasImagenes });
            this.props.imagenes(nuevasImagenes);

            // Llamar al callback onUploadComplete si existe (ahora con la URL de S3)
            if (this.props.onUploadComplete) {
                // La URL de S3 se pasará cuando se complete la subida
                this.props.onUploadComplete([documento.uri]);
            }
        } catch (err) {
            console.error('Error al seleccionar documento:', err);
            // No mostrar alerta si el usuario canceló
            if (err.message && !err.message.includes('cancelled')) {
                Alert.alert('Error', 'No se pudo seleccionar el documento');
            }
        }
    }

    /**
     * El API guarda documentos como URLs (strings). Tras elegir archivo es { name, uri, imagen }.
     */
    normalizeDocumento(doc, index = 0) {
        if (doc == null || doc === '') {
            return { name: 'Documento', uri: null };
        }
        if (typeof doc === 'string') {
            const s = doc.trim();
            if (!s) return { name: 'Documento', uri: null };
            try {
                const parsed = JSON.parse(s);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    const u = parsed.uri || parsed.url || parsed.s3Url;
                    return {
                        name: parsed.name || `Documento ${index + 1}.pdf`,
                        uri: typeof u === 'string' ? u : null,
                    };
                }
            } catch (e) {
                /* no es JSON */
            }
            if (/^https?:\/\//i.test(s)) {
                let name = `documento_${index + 1}.pdf`;
                try {
                    const part = s.split('/').pop() || '';
                    const base = decodeURIComponent(part.split('?')[0] || '');
                    if (base.length > 0) name = base;
                } catch (e2) { /* ignore */ }
                return { name, uri: s };
            }
            return { name: `Documento ${index + 1}`, uri: null };
        }
        const uri = doc.uri || doc.url || doc.s3Url || null;
        const name = doc.name || `Documento ${index + 1}.pdf`;
        return { name, uri: typeof uri === 'string' ? uri : null };
    }

    abrirPdf(uri) {
        const { navigation, navigate } = this.props;
        if (!uri) {
            Alert.alert('Documento', 'No hay una dirección disponible para abrir este archivo.');
            return;
        }
        if (navigation && typeof navigation.navigate === 'function') {
            navigation.navigate('pdf', { uri });
            return;
        }
        if (typeof navigate === 'function') {
            navigate('pdf', { uri });
            return;
        }
        Alert.alert('Documento', 'No se puede abrir el visor desde esta pantalla.');
    }

    renderDocumentos() {
        let { imagenes } = this.state
        const { soloLectura } = this.props;

        if (imagenes.length === 0) {
            return (
                <View style={{
                    backgroundColor: '#f8f9fa',
                    padding: 20,
                    borderRadius: 12,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#e9ecef',
                    borderStyle: 'dashed'
                }}>
                    <FontAwesome
                        name="file-pdf-o"
                        size={32}
                        color="#6c757d"
                        style={{ marginBottom: 8 }}
                    />
                    <Text style={{
                        color: '#6c757d',
                        fontSize: 14,
                        textAlign: 'center'
                    }}>
                        No hay documentos adjuntos
                    </Text>
                </View>
            );
        }

        return (
            <View style={{ marginTop: 12 }}>
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#495057',
                    marginBottom: 8
                }}>
                    Documentos adjuntos ({imagenes.length})
                </Text>
                {imagenes.map((doc, key) => {
                    const { name, uri } = this.normalizeDocumento(doc, key);
                    return (
                        <View key={`${uri || name}-${key}`} style={{
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 8,
                            borderWidth: 1,
                            borderColor: '#e9ecef',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => this.abrirPdf(uri)}
                                activeOpacity={0.7}
                            >
                                <FontAwesome
                                    name="file-pdf-o"
                                    size={20}
                                    color="#dc3545"
                                    style={{ marginRight: 12 }}
                                />
                                <Text style={{
                                    fontSize: 14,
                                    color: '#495057',
                                    flex: 1,
                                    fontWeight: '500'
                                }} numberOfLines={1}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                            {!soloLectura && (
                                <TouchableOpacity
                                    onPress={() => this.eliminarPdf(key)}
                                    style={{
                                        padding: 8,
                                        borderRadius: 20,
                                        backgroundColor: '#f8f9fa'
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <FontAwesome name="trash-o" size={16} color="#dc3545" />
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </View>
        );
    }

    eliminarPdf(keyImagen) {
        const { soloLectura } = this.props;

        if (soloLectura) {
            Alert.alert('Modo solo lectura', 'No se pueden eliminar documentos en modo solo lectura');
            return;
        }

        Alert.alert(
            'Eliminar Documento',
            '¿Estás seguro de que deseas eliminar este documento?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        const imagenes = this.state.imagenes.filter((e, key) => {
                            return key !== keyImagen;
                        });
                        this.setState({ imagenes });
                        this.props.imagenes(imagenes);
                    }
                }
            ],
            { cancelable: false }
        );
    }
    renderModal() {
        const { tipoMensaje, cerrar } = this.props
        return (
            <Modal
                transparent
                visible={this.state.isAndroidShareOpen}
                animationType="fade"
                onRequestClose={() => { }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { tipoMensaje ? cerrar() : this.setState({ isAndroidShareOpen: false }); }}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        width: '80%',
                        maxWidth: 300
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginBottom: 20,
                            textAlign: 'center',
                            color: '#333'
                        }}>
                            Subir Documento
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#007bff',
                                padding: 15,
                                borderRadius: 8,
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                this.setState({ isAndroidShareOpen: false, showModal: false });
                                setTimeout(() => {
                                    this.subirDocumento();
                                }, 100);
                            }}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name="file-pdf-o" size={20} color="#fff" style={{ marginBottom: 8 }} />
                            <Text style={{
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                Seleccionar Documento
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }


    render() {
        const { imagenes, showModal } = this.state
        const { width, avatar, limiteImagenes, tipoMensaje, titulo, soloLectura } = this.props

        return (
            <View style={{
                width: width || '100%',
                marginVertical: 8
            }}>
                {/* Modal para selección de documentos */}
                {(showModal || tipoMensaje) && this.renderModal()}

                {/* Botón para subir documento */}
                {!tipoMensaje && imagenes.length < limiteImagenes && !soloLectura && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 20,
                            borderWidth: 2,
                            borderColor: '#007bff',
                            borderStyle: 'dashed',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                        onPress={() => this.setState({ showModal: true, isAndroidShareOpen: true })}
                        activeOpacity={0.8}
                    >
                        <FontAwesome name="plus-circle" size={32} color="#007bff" style={{ marginBottom: 8 }} />
                        <Text style={{
                            color: '#007bff',
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            {titulo || 'Agregar Documento'}
                        </Text>
                        <Text style={{
                            color: '#6c757d',
                            fontSize: 12,
                            textAlign: 'center',
                            marginTop: 4
                        }}>
                            Imagen/PDF • Máximo {limiteImagenes} documento(s)
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Lista de documentos */}
                {!tipoMensaje && this.renderDocumentos()}
            </View>
        )
    }
}