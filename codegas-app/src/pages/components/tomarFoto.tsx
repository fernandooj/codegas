import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, Modal, Alert, Platform, PermissionsAndroid, Dimensions } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Lightbox from 'react-native-lightbox-v2';
import { launchCamera, launchImageLibrary, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import { style } from './style'
import { TomarFotoProps, ImagenData } from './tomarFoto.types'
import { uploadPickerImagesToS3 } from '../../utils/s3Upload'

const TomarFoto: React.FC<TomarFotoProps> = ({
    source = [],
    width,
    titulo,
    descripcion,
    multiple = false,
    limiteImagenes = 4,
    imagenes,
    avatar,
    tipoMensaje,
    cerrar,
    soloLectura = false,
    mostrarSoloConImagenes = false,
    permitirSubir = true,
    onUploadComplete
}) => {
    const [imagenesState, setImagenesState] = useState<any[]>(source);
    const [showModal, setShowModal] = useState(false);
    const [isAndroidShareOpen, setIsAndroidShareOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingUpdates, setPendingUpdates] = useState<{ imageData: any[], urls: string[] } | null>(null);
    const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
    const uploadsEnCursoRef = useRef(0);

    // Sincronizar el estado interno con el prop source cuando cambie
    // Solo sincronizar si no estamos en modo múltiple O si estamos en modo solo lectura
    useEffect(() => {
        if (!multiple || soloLectura) {
            setImagenesState(source);
        } else {
        }
    }, [source, multiple, soloLectura]);

    // Effect para limpiar imágenes cuando source está vacío en modo múltiple
    useEffect(() => {
        if (multiple && !soloLectura && source.length === 0 && imagenesState.length > 0) {
            setImagenesState([]);
        }
    }, [source, multiple, soloLectura, imagenesState.length]);

    // Manejar actualizaciones pendientes de S3
    useEffect(() => {
        if (pendingUpdates) {
            const { imageData, urls } = pendingUpdates;

            if (multiple) {
                // En modo múltiple, actualizar solo las URLs de S3 de las imágenes subidas
                setImagenesState(prevImages => {
                    const updatedImages = [...prevImages];

                    // Para cada imagen que se subió, actualizar su URL de S3
                    imageData.forEach((img, index) => {
                        const existingIndex = updatedImages.findIndex(existingImg =>
                            existingImg.uri === img.uri || existingImg.base64 === img.base64
                        );

                        if (existingIndex !== -1) {
                            // Solo actualizar la URL de S3, mantener todo lo demás
                            updatedImages[existingIndex] = {
                                ...updatedImages[existingIndex],
                                uri: urls[index] || updatedImages[existingIndex].uri, // Usar URL de S3 si está disponible
                                s3Url: urls[index] // Guardar la URL de S3
                            };
                        } else {
                            // Si no se encuentra la imagen, agregarla (por si acaso)
                            updatedImages.push({
                                ...img,
                                uri: urls[index] || img.uri,
                                s3Url: urls[index]
                            });
                        }
                    });

                    // Notificar al componente padre con el estado actualizado
                    setTimeout(() => {
                        imagenes?.(updatedImages);
                    }, 0);

                    return updatedImages;
                });
            } else {
                // En modo single, reemplazar todo el estado
                const updatedImages = imageData.map((img, index) => ({
                    ...img,
                    uri: urls[index] || img.uri,
                    s3Url: urls[index]
                }));
                setImagenesState(updatedImages);
                imagenes?.(updatedImages);
            }

            setPendingUpdates(null);
        }
    }, [pendingUpdates, multiple, imagenes]);

    // Función para subir imágenes a S3
    const uploadImagesToS3 = async (images: any[]) => {
        if (!onUploadComplete || images.length === 0) {
            return;
        }

        uploadsEnCursoRef.current += 1;
        setIsUploading(true);
        const imageData = images.map(img => ({
            uri: img.uri || img,
            base64: img.base64
        }));

        try {
            const urls = await uploadPickerImagesToS3(imageData);
            setPendingUpdates({ imageData, urls });
            onUploadComplete(urls);
        } catch (error) {
            console.error('Error uploading images to S3:', error);
            Alert.alert('Error', 'No se pudieron subir las imágenes. Inténtalo de nuevo.');
        } finally {
            uploadsEnCursoRef.current = Math.max(0, uploadsEnCursoRef.current - 1);
            if (uploadsEnCursoRef.current === 0) {
                setIsUploading(false);
            }
        }
    };
    // Función para solicitar permisos de cámara
    const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Permiso de Cámara',
                        message: 'Esta aplicación necesita acceso a la cámara para tomar fotos',
                        buttonNeutral: 'Preguntar después',
                        buttonNegative: 'Cancelar',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn('Error solicitando permiso de cámara:', err);
                return false;
            }
        }
        return true; // iOS maneja permisos automáticamente
    }

    // Función para abrir cámara usando react-native-image-picker
    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Error', 'Se necesita permiso de cámara para tomar fotos');
            return;
        }

        const options = {
            mediaType: 'photo' as MediaType,
            quality: 0.8 as any,
            maxWidth: 800,
            maxHeight: 600,
            includeBase64: true,
            saveToPhotos: false,
        };

        launchCamera(options, (response: ImagePickerResponse) => {

            if (response.didCancel) {
                return;
            }

            if (response.errorMessage) {
                console.error('Error de cámara:', response.errorMessage);
                Alert.alert('Error', `Error al abrir cámara: ${response.errorMessage}`);
                return;
            }

            if (response.assets && response.assets[0] && response.assets[0].uri) {
                const asset = response.assets[0];
                handleImageSelected(asset.uri!, asset.base64);
                Alert.alert('Éxito', 'Foto tomada correctamente');
            }
        });
    }

    // Función para abrir galería usando react-native-image-picker
    const openGallery = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            quality: 0.8 as any,
            maxWidth: 800,
            maxHeight: 600,
            includeBase64: true,
            selectionLimit: multiple ? 4 : 1,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {

            if (response.didCancel) {
                return;
            }

            if (response.errorMessage) {
                console.error('Error de galería:', response.errorMessage);
                Alert.alert('Error', `Error al abrir galería: ${response.errorMessage}`);
                return;
            }

            if (response.assets && response.assets.length > 0) {
                if (multiple) {
                    response.assets.forEach(asset => {
                        if (asset.uri) {
                            handleImageSelected(asset.uri!, asset.base64);
                        }
                    });
                } else {
                    if (response.assets[0].uri) {
                        handleImageSelected(response.assets[0].uri!, response.assets[0].base64);
                    }
                }
            }
        });
    }

    // Función para manejar la imagen seleccionada
    const handleImageSelected = (imageUri: string, base64Data: string | undefined = '') => {
        const base64String = base64Data || '';

        // Si no es múltiple, limpiar imágenes anteriores
        if (!multiple) {
            const newImage = { uri: imageUri, base64: base64String };
            setImagenesState([newImage]);
            imagenes?.([newImage]);
            // Subir a S3 si está habilitado
            if (permitirSubir && onUploadComplete) {
                uploadImagesToS3([newImage]);
            }
        } else {
            // Si es múltiple, agregar a la lista
            const currentImages = imagenesState && Array.isArray(imagenesState) ? imagenesState : [];
            if (currentImages.length < limiteImagenes) {
                const newImage = { uri: imageUri, base64: base64String };
                const newImagenes = [...currentImages, newImage];
                setImagenesState(newImagenes);
                imagenes?.(newImagenes);
                // Subir a S3 si está habilitado - solo la nueva imagen
                if (permitirSubir && onUploadComplete) {
                    uploadImagesToS3([newImage]);
                }
            } else {
                Alert.alert('Límite alcanzado', `Solo se pueden subir ${limiteImagenes} imágenes`);
            }
        }
    }

    // Función para manejar la selección de imagen (modal)
    const handleTomarFoto = () => {
        Alert.alert(
            'Seleccionar Imagen',
            'Elige una opción',
            [
                {
                    text: 'Cámara',
                    onPress: openCamera
                },
                {
                    text: 'Galería',
                    onPress: openGallery
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        );
    };

    // Función legacy para compatibilidad
    const subirImagen = async () => {
        const options = {
            compressImageMaxWidth: 900,
            compressImageMaxHeight: 900,
            width: 900,
            height: 900,
            includeBase64: true,
            mediaType: 'photo' as any,
            forgeJpg: true,
        };

        ImagePicker.openPicker(options).then(response => {
            if (response) {
                let base64 = `data:${response.mime};base64,${(response as any).data}`
                let imagen = {
                    uri: response.path,
                    type: response.mime ? response.mime : 'image/jpeg',
                    name: (response as any).fileName ? (response as any).fileName : `imagen.jpg`,
                    path: response.path,
                    imagen: base64
                };

                const newImagenes = [...imagenesState, imagen];
                setImagenesState(newImagenes);
                setShowModal(false);
                setIsAndroidShareOpen(false);
                imagenes?.(imagen);
            }
        });
    }

    const tomarFoto = () => {
        const options = {
            compressImageMaxWidth: 900,
            compressImageMaxHeight: 900,
            width: 900,
            height: 900,
            includeBase64: true,
            mediaType: 'photo' as any,
            forgeJpg: true,
        };
        ImagePicker.openCamera(options).then(response => {
            if (response) {
                let base64 = `data:${response.mime};base64,${(response as any).data}`
                let imagen = {
                    uri: response.path,
                    type: response.mime ? response.mime : 'image/jpeg',
                    name: (response as any).fileName ? (response as any).fileName : `imagen.jpg`,
                    path: response.path
                };
                const newImagenes = [...imagenesState, imagen];
                setImagenesState(newImagenes);
                setShowModal(false);
                setIsAndroidShareOpen(false);
                imagenes?.(base64);
            }
        });
    }
    const renderImagenes = () => {
        let img: any[] = []

        if (!imagenesState || !Array.isArray(imagenesState)) {
            return img;
        }

        imagenesState.map((e: any) => {
            if (e.uri) {
                img.push(e)
            } else {
                img.push({ uri: e })
            }
        })

        return img.map((e: any, key: number) => {
            return (
                <View key={key} style={{ position: 'relative' }}>
                    <TouchableOpacity onPress={() => {
                        setExpandedImageIndex(key);
                    }}>
                        <Image source={{ uri: e.uri }} style={style.imagenesFotos} resizeMode="cover" />
                    </TouchableOpacity>

                    {/* Icono del ojo para expandir */}
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 5,
                            left: 5,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            borderRadius: 15,
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            setExpandedImageIndex(key);
                        }}
                    >
                        <FontAwesome name="eye" style={{ fontSize: 14, color: '#fff' }} />
                    </TouchableOpacity>

                    {!soloLectura && (
                        <FontAwesome name={'trash'} style={style.iconTrash} onPress={() => eliminarImagen(key)} />
                    )}
                </View>
            )
        })
    }

    const eliminarImagen = (keyImagen: number) => {
        Alert.alert(
            'Eliminar Imagen',
            'seguro desea eliminar esta imagen',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                { text: 'Eliminar', onPress: () => eliminar() }
            ],
            { cancelable: false }
        );
        const eliminar = () => {
            let newImagenes = imagenesState.filter((e, key) => { return key != keyImagen })
            setImagenesState(newImagenes)
            imagenes?.(newImagenes)
        }
    }
    const renderModal = () => {
        return (
            <Modal
                transparent
                visible={isAndroidShareOpen}
                animationType="fade"
                onRequestClose={() => { }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { tipoMensaje ? cerrar?.() : setIsAndroidShareOpen(false); }}
                    style={style.btnModal}
                >
                    <View style={style.contenedorModal}>
                        <TouchableOpacity style={style.btnOpcionModal} onPress={openGallery}>
                            <Text style={style.textModal}>Subir Imagen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btnOpcionModal} onPress={openCamera}>
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

    return (
        <View style={style.contenedorPortada}>
            {
                showModal
                && renderModal()
            }
            {
                tipoMensaje
                    ? renderModal()
                    : permitirSubir && !soloLectura && !mostrarSoloConImagenes && (multiple ? (imagenesState && Array.isArray(imagenesState) ? imagenesState.length : 0) < limiteImagenes : true)
                    && <View style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 20,
                        alignItems: 'center'
                    }}>
                        <FontAwesome name="camera" style={{ fontSize: 32, color: '#007bff', marginBottom: 8 }} />
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                            {titulo || 'Foto'}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 }}>
                            {descripcion || 'Tome una foto clara para completar el proceso'}
                        </Text>

                        {!soloLectura && (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isUploading ? '#6c757d' : '#007bff',
                                    borderRadius: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    opacity: isUploading ? 0.7 : 1
                                }}
                                onPress={() => {
                                    if (!isUploading) {
                                        handleTomarFoto();
                                    }
                                }}
                                activeOpacity={0.8}
                                disabled={isUploading}
                            >
                                <FontAwesome
                                    name={isUploading ? "spinner" : "camera"}
                                    style={{
                                        fontSize: 16,
                                        color: '#fff',
                                        marginRight: 8,
                                        ...(isUploading && { transform: [{ rotate: '0deg' }] })
                                    }}
                                />
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                    {isUploading ? 'Subiendo...' : (multiple ? 'Subir Foto' : ((imagenesState && Array.isArray(imagenesState) && imagenesState.length > 0) ? 'Cambiar Foto' : 'Tomar Foto'))}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {imagenesState && Array.isArray(imagenesState) && imagenesState.length > 0 && (
                            <View style={{
                                marginTop: 12,
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    flexDirection: multiple ? 'row' : 'column',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    gap: 8
                                }}>
                                    {imagenesState.map((imagen, index) => {
                                        return (
                                            <View key={`${imagen.uri || imagen}-${index}`} style={{ position: 'relative' }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // Mostrar imagen en modal o navegación
                                                        Alert.alert('Imagen', 'Imagen seleccionada');
                                                    }}
                                                >
                                                    <Image
                                                        key={imagen.uri || imagen} // Forzar re-renderizado cuando cambie la URI
                                                        source={{ uri: imagen.uri || imagen }}
                                                        style={{
                                                            width: multiple ? 100 : 150,
                                                            height: multiple ? 100 : 150,
                                                            borderRadius: 10,
                                                            marginBottom: 8
                                                        }}
                                                        resizeMode="cover"
                                                        onLoad={() => { }}
                                                        onError={(error) => console.error(`Error cargando imagen ${index}:`, error)}
                                                    />
                                                </TouchableOpacity>

                                                {/* Botón de eliminar */}
                                                {!soloLectura && (
                                                    <TouchableOpacity
                                                        style={{
                                                            position: 'absolute',
                                                            top: 5,
                                                            right: 5,
                                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                                            borderRadius: 15,
                                                            width: 30,
                                                            height: 30,
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                        onPress={() => eliminarImagen(index)}
                                                    >
                                                        <FontAwesome name="trash" style={{ fontSize: 14, color: '#fff' }} />
                                                    </TouchableOpacity>
                                                )}

                                                {/* Botón de expandir (ojo) */}
                                                {/* <TouchableOpacity
                                                    style={{
                                                        position: 'absolute',
                                                        top: 5,
                                                        left: 5,
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                        borderRadius: 15,
                                                        width: 30,
                                                        height: 30,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                    onPress={() => {
                                                        // El Lightbox se activa automáticamente al tocar la imagen
                                                        console.log(`👁️ [TomarFoto] Expandir imagen ${index}`);
                                                    }}
                                                >
                                                    <FontAwesome name="eye" style={{ fontSize: 14, color: '#fff' }} />
                                                </TouchableOpacity> */}
                                            </View>
                                        );
                                    })}
                                </View>

                                <View style={{
                                    backgroundColor: '#d4edda',
                                    borderRadius: 8,
                                    padding: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <FontAwesome name="check" style={{ fontSize: 14, color: '#28a745', marginRight: 8 }} />
                                    <Text style={{ color: '#28a745', fontSize: 14, fontWeight: '500' }}>
                                        {(imagenesState && Array.isArray(imagenesState) && imagenesState.length === 1) ? 'Foto agregada correctamente' : `${imagenesState && Array.isArray(imagenesState) ? imagenesState.length : 0} fotos agregadas correctamente`}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
            }
            {
                !tipoMensaje && mostrarSoloConImagenes && imagenesState.length === 0
                && <View style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20,
                    alignItems: 'center'
                }}>
                    <FontAwesome name="image" style={{ fontSize: 32, color: '#6c757d', marginBottom: 8 }} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#6c757d', marginBottom: 8 }}>
                        No hay imágenes
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center' }}>
                        Las imágenes aparecerán aquí después de tomar las fotos
                    </Text>
                </View>
            }
            {
                !tipoMensaje && soloLectura && imagenesState && Array.isArray(imagenesState) && imagenesState.length > 0 && (
                    <View style={{
                        marginTop: 12,
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flexDirection: multiple ? 'row' : 'column',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 8
                        }}>
                            {imagenesState.map((imagen, index) => {
                                return (
                                    <View key={`${imagen.uri || imagen}-${index}`} style={{ position: 'relative' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // Mostrar imagen en modal o navegación
                                                Alert.alert('Imagen', 'Imagen seleccionada');
                                            }}
                                        >
                                            <Image
                                                key={imagen.uri || imagen}
                                                source={{ uri: imagen.uri || imagen }}
                                                style={{
                                                    width: multiple ? 100 : 150,
                                                    height: multiple ? 100 : 150,
                                                    borderRadius: 10,
                                                    marginBottom: 8
                                                }}
                                                resizeMode="cover"
                                                onLoad={() => { }}
                                                onError={(error) => console.error(`Error cargando imagen ${index}:`, error)}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )
            }

            {/* Modal para expandir imagen */}
            <Modal
                visible={expandedImageIndex !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setExpandedImageIndex(null)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 50,
                            right: 20,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 20,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => setExpandedImageIndex(null)}
                    >
                        <FontAwesome name="times" style={{ fontSize: 20, color: '#fff' }} />
                    </TouchableOpacity>

                    {expandedImageIndex !== null && imagenesState[expandedImageIndex] && (
                        <Image
                            source={{ uri: imagenesState[expandedImageIndex].uri }}
                            style={{
                                width: Dimensions.get('window').width * 0.9,
                                height: Dimensions.get('window').height * 0.7,
                                resizeMode: 'contain'
                            }}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default TomarFoto;