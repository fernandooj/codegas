import React, { useState, useEffect, useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Switch, Platform, ActivityIndicator, Alert, Dimensions } from 'react-native'
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { style } from './style'
import { useSelector, useDispatch } from 'react-redux'
import Toast from 'react-native-toast-message';
import SubirDocumento from "../components/subirDocumento";
import TomarFoto from "../components/tomarFoto";
import Footer from '../components/footer'
import HeaderLogo from '../../components/HeaderLogo'
import { DataContext } from "../../context/context"
import {
    getReporteEmergenciaById,
    createReporteEmergencia,
    closeReporteEmergencia,
    uploadImagenReporteEmergencia,
    uploadMultipleImagesToS3
} from '../../redux/actions/reporteActions'
import { ReporteEmergenciaFormData, ReporteEmergenciaCerrarData, ReporteEmergenciaImagenData, ImagenData, NavigationParams } from './types'


interface NuevoReporteEmergenciaProps {
    navigation: any;
}

const NuevoReporteEmergencia = ({ navigation }: NuevoReporteEmergenciaProps) => {
    const context = useContext(DataContext) as any;
    const { acceso, userId: usuarioCrea } = context || {};
    const dispatch = useDispatch() as any;

    // Redux state
    const {
        currentReporte,
        loadingById,
        loadingCreate,
        loadingClose,
        loadingUpload,
        errorById,
        errorCreate,
        errorClose,
        errorUpload
    } = useSelector((state: any) => state.reporte);

    const [terminoBuscador, setTerminoBuscador] = useState("");
    const [cerradoText, setCerradoText] = useState("");
    const [otrosText, setOtrosText] = useState("");
    const [imgRuta, setImgRuta] = useState<string[]>([]);

    const [imgRutaCerrar, setImgRutaCerrar] = useState<string[]>([]);
    const [imgDocumento, setImgDocumento] = useState<string[]>([]);
    const [imgUrlsS3, setImgUrlsS3] = useState<string[]>([]);
    const [imgUrlsS3Cerrar, setImgUrlsS3Cerrar] = useState<string[]>([]);
    const [documentosUrlsS3, setDocumentosUrlsS3] = useState<string[]>([]);
    const [tanque, setTanque] = useState(false);
    const [red, setRed] = useState(false);
    const [puntos, setPuntos] = useState(false);
    const [fuga, setFuga] = useState(false);
    const [pqr, setPqr] = useState(false);
    const [inicio, setInicio] = useState(0);
    const [final, setFinal] = useState(10);
    const [puntodireccion, setPuntodireccion] = useState('');
    const [nReporte, setNReporte] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [puntoId, setPuntoId] = useState('');
    const [usuariocodt, setUsuariocodt] = useState('');
    const [usuarioRazonSocial, setUsuarioRazonSocial] = useState('');
    const [usuarioNombre, setUsuarioNombre] = useState('');
    const [usuarioCreaNombre, setUsuarioCreaNombre] = useState('');
    const [usuarioCreaRazonSocial, setUsuarioCreaRazonSocial] = useState('');
    const [subiendoImagenes, setSubiendoImagenes] = useState(false);
    const [mostrandoReporteCreado, setMostrandoReporteCreado] = useState(false);
    const [reporteCerrado, setReporteCerrado] = useState(false);

    // Función para mostrar toast de éxito cuando el backend sea positivo
    const mostrarToastExito = () => {
        Toast.show({
            type: 'success',
            text1: 'Reporte creado exitosamente',
            visibilityTime: 3000, // 3 segundos
            autoHide: true
        });
    };

    // Función para limpiar el estado después de crear exitosamente
    const limpiarEstadoDespuesDeCrear = () => {
        setTanque(false);
        setRed(false);
        setPuntos(false);
        setFuga(false);
        setPqr(false);
        setOtrosText("");
        setImgRuta([]);
        setImgUrlsS3([]);
        setImgRutaCerrar([]);
        setImgUrlsS3Cerrar([]);
        setImgDocumento([]);
        setDocumentosUrlsS3([]);
        setCerradoText("");
        setSubiendoImagenes(false);
        setMostrandoReporteCreado(false);
        setNReporte(''); // Resetear el ID del reporte para permitir crear uno nuevo
    };

    const getData = () => {

        const routeParams = navigation.getState ? navigation.getState().routes.find((route: any) => route.name === 'nuevoReporteEmergencia')?.params : navigation.state?.params;
        const reporteId = routeParams ? routeParams.reporteId : null;
        const usuarioIdParam = routeParams ? routeParams.usuarioId : null;
        const puntoIdParam = routeParams ? routeParams.puntoId : null;
        const codt = routeParams ? routeParams.codt : null;
        const razon_social = routeParams ? routeParams.razon_social : null;
        const nombre = routeParams ? routeParams.nombre : null;


        if (reporteId) {
            dispatch(getReporteEmergenciaById(reporteId));
            // También cargar los parámetros de navegación cuando se edita un reporte existente
            setUsuarioId(usuarioIdParam || '');
            setPuntoId(puntoIdParam || '');
            setUsuariocodt(codt || '');
            setUsuarioRazonSocial(razon_social || '');
            setUsuarioNombre(nombre || '');
        } else {
            setUsuarioId(usuarioIdParam);
            setPuntoId(puntoIdParam);
            setUsuariocodt(codt);
            setUsuarioRazonSocial(razon_social);
            setUsuarioNombre(nombre);
        }
    };

    useEffect(() => {

        // Limpiar solo el toast de éxito si existe
        Toast.hide();

        getData();

        // Cleanup function para limpiar el estado cuando se desmonta el componente
        return () => {
            // Solo limpiar si no hay reporte activo
            if (!nReporte) {
                dispatch({ type: 'CLEAR_REPORTE_STATE' });
            }
        };
    }, []);

    // Effect para limpiar el estado cuando se regresa a esta pantalla
    useFocusEffect(
        React.useCallback(() => {
            // Limpiar toasts cuando se enfoca la pantalla
            Toast.hide();

            // Limpiar estado de reporte si no hay reporte activo
            if (!nReporte && !currentReporte) {
                dispatch({ type: 'CLEAR_REPORTE_STATE' });
            }

            // Cleanup function para cuando se desenfoca la pantalla
            return () => {
                // Limpiar estado cuando se sale de la pantalla
                if (nReporte || currentReporte) {
                    dispatch({ type: 'CLEAR_REPORTE_STATE' });
                }
            };
        }, [nReporte, currentReporte, dispatch])
    );

    // Effect para manejar cuando se recibe el reporte desde Redux
    useEffect(() => {

        if (currentReporte) {
            setNReporte(currentReporte._id);
            setTanque(currentReporte.tanque);
            setRed(currentReporte.red);
            setPuntos(currentReporte.puntos);
            setFuga(currentReporte.fuga);
            setPqr(currentReporte.pqr);

            // Detectar si el reporte está cerrado (usuarioCierranombre tiene valor)
            const usuarioCierraNombre = currentReporte.usuariocierranombre || currentReporte.usuarioCierranombre || currentReporte.usuarioCierraNombre;
            const reporteEstaCerrado = !!usuarioCierraNombre;
            setReporteCerrado(reporteEstaCerrado);

            // Solo sobrescribir si no hay datos de los parámetros de navegación
            if (!usuarioNombre || usuarioNombre === 'undefined' || usuarioNombre === '') {
                setUsuarioNombre(currentReporte.usuarionombre || '');
            }
            if (!usuarioRazonSocial || usuarioRazonSocial === 'undefined' || usuarioRazonSocial === '') {
                setUsuarioRazonSocial(currentReporte.usuariorazonsocial || '');
            }
            setUsuarioCreaNombre(currentReporte.usuariocreanombre || '');
            setUsuarioCreaRazonSocial(currentReporte.usuariocrearazonsocial || '');
            setPuntodireccion(currentReporte.puntodireccion || '');
            setUsuariocodt(currentReporte.usuariocodt || '');

            setImgRuta(currentReporte.ruta || []);
            setImgDocumento(currentReporte.documento || []);
            setDocumentosUrlsS3(currentReporte.documento || []);
            setImgRutaCerrar(currentReporte.rutacerrar || []);
            setImgUrlsS3Cerrar(currentReporte.rutacerrar || []);
            setCerradoText(currentReporte.cerradotext || "");
            setOtrosText(currentReporte.otrostext || "");

            // Cargar las URLs de las imágenes S3 si existen
            if (currentReporte.ruta && currentReporte.ruta.length > 0) {
                setImgUrlsS3(currentReporte.ruta);
            }
        }
    }, [currentReporte]);

    // Effect para manejar errores
    useEffect(() => {
        if (errorCreate) {
            Toast.show({
                type: 'error',
                text1: 'Error al crear reporte',
                text2: errorCreate,
                visibilityTime: 10000,
                autoHide: true
            });
        }
        if (errorClose) {
            Toast.show({
                type: 'error',
                text1: 'Error al cerrar reporte',
                text2: errorClose,
                visibilityTime: 10000,
                autoHide: true
            });
        }
        if (errorUpload) {
            Toast.show({
                type: 'error',
                text1: 'Error al subir imagen',
                text2: errorUpload,
                visibilityTime: 10000,
                autoHide: true
            });
        }
    }, [errorCreate, errorClose, errorUpload]);

    // Effect para manejar éxito en creación de reporte
    useEffect(() => {
        // Solo mostrar toast si realmente se acaba de crear un reporte (no al cargar uno existente)
        if (currentReporte && !nReporte && loadingCreate === false && !mostrandoReporteCreado && loadingById === false) {

            // Establecer el nReporte para que se muestren las opciones de edición
            setNReporte(currentReporte._id);
            setMostrandoReporteCreado(true);


            // Subir todas las imágenes pendientes (del problema, cierre y documentos)
            setTimeout(() => {
                uploadImagenesPendientes();
            }, 1000); // Pequeño delay para asegurar que el reporte esté completamente creado

            // Limpiar el estado después de crear exitosamente (solo para reportes recién creados)
            setTimeout(() => {
                // Solo limpiar si realmente se creó un nuevo reporte
                if (mostrandoReporteCreado) {
                    limpiarEstadoDespuesDeCrear();
                }
                // Forzar la limpieza del toast
                Toast.hide();
            }, 2000); // Delay para que el usuario vea el toast de éxito
        } else if (currentReporte && loadingById === false && nReporte !== currentReporte._id) {
            // Si es un reporte existente (no recién creado), solo establecer el estado sin toast
            setNReporte(currentReporte._id);
        }
    }, [currentReporte, loadingCreate, loadingById, nReporte, mostrandoReporteCreado]);

    // Effect para limpiar imágenes cuando se resetea el estado
    useEffect(() => {
        // Solo limpiar si no hay reporte Y no se está cargando un reporte existente
        if (!nReporte && !mostrandoReporteCreado && !currentReporte) {
            setImgRuta([]);
            setImgUrlsS3([]);
        }
    }, [nReporte, mostrandoReporteCreado, currentReporte, imgRuta.length]);

    // Effect para forzar limpieza cuando se resetea completamente
    useEffect(() => {
        if (!nReporte && imgRuta.length === 0 && imgUrlsS3.length === 0) {
            // Estado completamente limpio
        }
    }, [nReporte, imgRuta.length, imgUrlsS3.length]);


    const cerrar = () => {
        // Validar que el campo "Gestión del reporte" no esté vacío
        if (!cerradoText || cerradoText.trim() === '') {
            Toast.show({
                type: 'error',
                text1: 'Campo obligatorio',
                text2: 'Debe describir la gestión realizada en el reporte',
                visibilityTime: 3000,
                autoHide: true
            });
            return;
        }

        // Validar que se haya subido al menos una foto de solución
        if (!imgUrlsS3Cerrar || imgUrlsS3Cerrar.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Foto obligatoria',
                text2: 'Debe subir al menos una foto de la solución implementada',
                visibilityTime: 3000,
                autoHide: true
            });
            return;
        }

        Alert.alert(
            'Cerrar Reporte',
            '¿Estás seguro de que quieres cerrar este reporte? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar',
                    style: 'destructive',
                    onPress: () => {
                        const data: ReporteEmergenciaCerrarData = {
                            idRevision: nReporte,
                            cerradoText,
                            tanque,
                            red,
                            puntos,
                            fuga,
                            pqr,
                            usuarioCierra: usuarioCrea,
                            rutaCerrar: imgUrlsS3Cerrar,
                            documentosUrlsS3: documentosUrlsS3
                        };

                        setReporteCerrado(true); // Activar el estado para el toast
                        dispatch(closeReporteEmergencia(data));

                        // Mostrar toast de éxito inmediatamente después de enviar al backend
                        Toast.show({
                            type: 'success',
                            text1: 'Reporte cerrado exitosamente',
                            text2: 'El reporte ha sido cerrado correctamente',
                            visibilityTime: 10000,
                            autoHide: true
                        });
                    }
                }
            ]
        );
    };

    const handleSubmit = () => {
        // Validar que se haya subido al menos una foto del problema
        if (!imgUrlsS3 || imgUrlsS3.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Foto obligatoria',
                text2: 'Debe subir al menos una foto del problema reportado',
                visibilityTime: 3000,
                autoHide: true
            });
            return;
        }

        const data: ReporteEmergenciaFormData = {
            tanque,
            red,
            puntos,
            fuga,
            pqr,
            otrosText,
            usuarioId,
            puntoId,
            usuarioCrea,
            razonSocial: usuarioRazonSocial,
            nombre: usuarioNombre,
            codt: usuariocodt,
            imgUrlsS3: imgUrlsS3, // Incluir las URLs de las imágenes subidas a S3
            documentosUrlsS3: documentosUrlsS3 // Incluir las URLs de los documentos subidos a S3
        };

        dispatch(createReporteEmergencia(data));

        // Mostrar toast de éxito cuando el backend sea positivo
        mostrarToastExito();
    };

    const uploadImagen = (imagen: ImagenData, type: string, mime: string) => {
        // Si no hay nReporte, usar el currentReporte._id (que se obtiene después de crear)
        const idReporteParaUpload = nReporte || currentReporte?._id;

        if (!idReporteParaUpload) {
            return;
        }

        const data: ReporteEmergenciaImagenData = {
            mime,
            imagen: imagen.imagen,
            idReporte: idReporteParaUpload,
            type,
            name: imagen.name
        };

        dispatch(uploadImagenReporteEmergencia(data));
    };

    // Función para subir documentos directamente a S3 usando la misma función que las imágenes
    const uploadDocumento = async (documento: ImagenData) => {
        try {
            // Estructurar los datos como lo hace tomarFoto.tsx
            const imageData = [{
                uri: documento.name, // Usar el nombre como URI para documentos
                base64: documento.imagen
            }];

            // Usar la misma función que tomarFoto.tsx (función de Redux)
            const result = await dispatch(uploadMultipleImagesToS3(imageData) as any);

            if (result && result.length > 0) {
                // Acumular las URLs de S3 en el estado, evitando duplicados
                setDocumentosUrlsS3(prevUrls => {
                    const newUrls = result.filter((url: string) => !prevUrls.includes(url));
                    return [...prevUrls, ...newUrls];
                });

                return result[0];
            } else {
                throw new Error('No se recibieron URLs del servidor');
            }
        } catch (error) {
            console.error('Error al subir documento:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al subir documento',
                text2: 'No se pudo subir el documento a S3',
                visibilityTime: 3000,
                autoHide: true
            });
            return null;
        }
    };

    // Función para subir todas las imágenes pendientes
    const uploadImagenesPendientes = () => {
        if (!currentReporte?._id) return;

        setSubiendoImagenes(true);

        let totalImagenes = 0;
        let imagenesSubidas = 0;

        // Contar imágenes pendientes
        if (imgRuta.length > 0) {
            imgRuta.forEach((imagen: any) => {
                if (imagen.imagen) totalImagenes++;
            });
        }
        if (imgRutaCerrar.length > 0) {
            imgRutaCerrar.forEach((imagen: any) => {
                if (imagen.imagen) totalImagenes++;
            });
        }
        if (imgDocumento.length > 0) {
            imgDocumento.forEach((documento: any) => {
                if (documento.imagen) totalImagenes++;
            });
        }

        if (totalImagenes === 0) {
            setSubiendoImagenes(false);
            return;
        }

        // Subir imágenes del problema (ruta) si existen
        if (imgRuta.length > 0) {
            imgRuta.forEach((imagen: any) => {
                if (imagen.imagen) { // Solo si tiene la propiedad imagen (base64)
                    uploadImagen(imagen, 'ruta', 'image/jpeg');
                    imagenesSubidas++;
                }
            });
        }

        // Subir imágenes de cierre (rutaCerrar) si existen
        if (imgRutaCerrar.length > 0) {
            imgRutaCerrar.forEach((imagen: any) => {
                if (imagen.imagen) { // Solo si tiene la propiedad imagen (base64)
                    uploadImagen(imagen, 'rutaCerrar', 'image/jpeg');
                    imagenesSubidas++;
                }
            });
        }

        // Subir documentos si existen
        // Los documentos ya se suben inmediatamente cuando se seleccionan
        // No necesitamos subirlos aquí

        // Mostrar toast de progreso
        Toast.show({
            type: 'info',
            text1: 'Subiendo imágenes',
            text2: `Subiendo ${totalImagenes} archivo(s)...`,
            visibilityTime: 5000,
            autoHide: true
        });

        // Resetear estado después de un tiempo
        setTimeout(() => {
            setSubiendoImagenes(false);
        }, 3000);
    };

    const rendercontenido = () => {
        return (
            <View style={{
                width: Dimensions.get('window').width,
                maxWidth: Dimensions.get('window').width,
                overflow: 'hidden',
                flex: 1
            }}>
                {/* Información del Cliente */}
                {(nReporte || usuarioRazonSocial || usuarioNombre || usuariocodt || puntodireccion) && (
                    <View style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: 12,
                        padding: 16,
                        marginVertical: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: '#007bff',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8
                        }}>
                            <FontAwesome
                                name="user-circle"
                                style={{
                                    color: '#007bff',
                                    fontSize: 16,
                                    marginRight: 8
                                }}
                            />
                            <Text style={{
                                color: '#007bff',
                                fontWeight: '600',
                                fontSize: 16
                            }}>
                                Información del Cliente
                            </Text>
                        </View>

                        {nReporte && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 4
                            }}>
                                <FontAwesome
                                    name="file-text-o"
                                    style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        marginRight: 8,
                                        width: 16
                                    }}
                                />
                                <Text style={{
                                    color: '#495057',
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    <Text style={{ fontWeight: '600' }}>N Reporte:</Text> {nReporte}
                                </Text>
                            </View>
                        )}

                        {nReporte && (usuariocodt ? usuarioCreaNombre : usuarioCreaRazonSocial) && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 4
                            }}>
                                <FontAwesome
                                    name="user-o"
                                    style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        marginRight: 8,
                                        width: 16
                                    }}
                                />
                                <Text style={{
                                    color: '#495057',
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    <Text style={{ fontWeight: '600' }}>Usuario Reporta:</Text> {usuariocodt ? usuarioCreaNombre : usuarioCreaRazonSocial}
                                </Text>
                            </View>
                        )}

                        {puntodireccion && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 4
                            }}>
                                <FontAwesome
                                    name="map-marker"
                                    style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        marginRight: 8,
                                        width: 16
                                    }}
                                />
                                <Text style={{
                                    color: '#495057',
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    <Text style={{ fontWeight: '600' }}>Ubicación:</Text> {puntodireccion}
                                </Text>
                            </View>
                        )}

                        {usuarioRazonSocial && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 4
                            }}>
                                <FontAwesome
                                    name="building"
                                    style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        marginRight: 8,
                                        width: 16
                                    }}
                                />
                                <Text style={{
                                    color: '#495057',
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    <Text style={{ fontWeight: '600' }}>Cliente:</Text> {usuarioRazonSocial}
                                </Text>
                            </View>
                        )}

                        {usuarioNombre && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 4
                            }}>
                                <FontAwesome
                                    name="user"
                                    style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        marginRight: 8,
                                        width: 16
                                    }}
                                />
                                <Text style={{
                                    color: '#495057',
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    <Text style={{ fontWeight: '600' }}>Nombre:</Text> {usuarioNombre}
                                </Text>
                            </View>
                        )}

                        {usuariocodt && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 4
                            }}>
                                <FontAwesome
                                    name="id-card"
                                    style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        marginRight: 8,
                                        width: 16
                                    }}
                                />
                                <Text style={{
                                    color: '#495057',
                                    fontSize: 14,
                                    flex: 1
                                }}>
                                    <Text style={{ fontWeight: '600' }}>CODT:</Text> {usuariocodt}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                <TouchableOpacity
                    style={[
                        style.checkboxContainer,
                        tanque ? style.checkboxContainerActive : style.checkboxContainerInactive,
                        reporteCerrado && { opacity: 0.6 }
                    ]}
                    onPress={() => {
                        if (!reporteCerrado) {
                            setTanque(!tanque);
                        }
                    }}
                    disabled={reporteCerrado}
                >
                    <Text style={[style.checkboxText, reporteCerrado && { color: '#6c757d' }]}>Tanque en mal estado</Text>
                    <View
                        style={[
                            style.checkboxIcon,
                            tanque ? style.checkboxIconActive : style.checkboxIconInactive
                        ]}
                    >
                        {tanque && (
                            <FontAwesome
                                name="check"
                                size={16}
                                color="#fff"
                            />
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        style.checkboxContainer,
                        red ? style.checkboxContainerActive : style.checkboxContainerInactive,
                        reporteCerrado && { opacity: 0.6 }
                    ]}
                    onPress={() => {
                        if (!reporteCerrado) {
                            setRed(!red);
                        }
                    }}
                    disabled={reporteCerrado}
                >
                    <Text style={[style.checkboxText, reporteCerrado && { color: '#6c757d' }]}>Red en mal estado</Text>
                    <View
                        style={[
                            style.checkboxIcon,
                            red ? style.checkboxIconActive : style.checkboxIconInactive
                        ]}
                    >
                        {red && (
                            <FontAwesome
                                name="check"
                                size={16}
                                color="#fff"
                            />
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        style.checkboxContainer,
                        puntos ? style.checkboxContainerActive : style.checkboxContainerInactive,
                        reporteCerrado && { opacity: 0.6 }
                    ]}
                    onPress={() => {
                        if (!reporteCerrado) {
                            setPuntos(!puntos);
                        }
                    }}
                    disabled={reporteCerrado}
                >
                    <Text style={[style.checkboxText, reporteCerrado && { color: '#6c757d' }]}>Puntos de ignición cerca</Text>
                    <View
                        style={[
                            style.checkboxIcon,
                            puntos ? style.checkboxIconActive : style.checkboxIconInactive
                        ]}
                    >
                        {puntos && (
                            <FontAwesome
                                name="check"
                                size={16}
                                color="#fff"
                            />
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        style.checkboxContainer,
                        fuga ? style.checkboxContainerActive : style.checkboxContainerInactive,
                        reporteCerrado && { opacity: 0.6 }
                    ]}
                    onPress={() => {
                        if (!reporteCerrado) {
                            setFuga(!fuga);
                        }
                    }}
                    disabled={reporteCerrado}
                >
                    <Text style={[style.checkboxText, reporteCerrado && { color: '#6c757d' }]}>Fuga</Text>
                    <View
                        style={[
                            style.checkboxIcon,
                            fuga ? style.checkboxIconActive : style.checkboxIconInactive
                        ]}
                    >
                        {fuga && (
                            <FontAwesome
                                name="check"
                                size={16}
                                color="#fff"
                            />
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        style.checkboxContainer,
                        pqr ? style.checkboxContainerActive : style.checkboxContainerInactive,
                        reporteCerrado && { opacity: 0.6 }
                    ]}
                    onPress={() => {
                        if (!reporteCerrado) {
                            setPqr(!pqr);
                        }
                    }}
                    disabled={reporteCerrado}
                >
                    <Text style={[style.checkboxText, reporteCerrado && { color: '#6c757d' }]}>PQR</Text>
                    <View
                        style={[
                            style.checkboxIcon,
                            pqr ? style.checkboxIconActive : style.checkboxIconInactive
                        ]}
                    >
                        {pqr && (
                            <FontAwesome
                                name="check"
                                size={16}
                                color="#fff"
                            />
                        )}
                    </View>
                </TouchableOpacity>


                <View style={{
                    marginVertical: 8,
                    marginHorizontal: 16,
                    width: Dimensions.get('window').width - 32,
                    alignSelf: 'center'
                }}>
                    <TextInput
                        placeholder="Describe los detalles del problema..."
                        value={otrosText}
                        style={{
                            fontFamily: "Comfortaa-Regular",
                            textAlignVertical: 'top',
                            backgroundColor: reporteCerrado ? '#f8f9fa' : '#fff',
                            borderWidth: 1,
                            borderColor: reporteCerrado ? '#e9ecef' : '#ced4da',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            minHeight: 100,
                            width: '100%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            opacity: reporteCerrado ? 0.7 : 1,
                        }}
                        onChangeText={(value) => !reporteCerrado && setOtrosText(value)}
                        editable={nReporte ? false : !reporteCerrado}
                        multiline={true}
                        numberOfLines={5}
                        placeholderTextColor="#6c757d"
                    />
                </View>
                {/* IMAGEN PARA CREAR REPORTE - Solo cuando NO hay reporte creado */}
                {!nReporte && (
                    <>
                        <View style={style.separador}></View>
                        <View style={{ marginHorizontal: 16 }}>
                            <TomarFoto
                                key={nReporte || 'new'} // Key para forzar re-render cuando cambia el estado
                                source={imgRuta} // Pasar imgRuta para que se sincronice con el estado
                                titulo="Imagen del Problema *"
                                descripcion="Tome fotos del problema reportado"
                                multiple={true}
                                limiteImagenes={4}
                                permitirSubir={true}
                                imagenes={(e: any) => {
                                    // Si es múltiple, e es un array; si no, e es un objeto
                                    if (Array.isArray(e)) {
                                        setImgRuta(e);
                                    } else {
                                        setImgRuta([e]);
                                    }
                                }}
                                onUploadComplete={(urls: string[]) => {
                                    // Acumular las URLs de S3 en lugar de reemplazarlas
                                    setImgUrlsS3(prevUrls => {
                                        const newUrls = [...prevUrls, ...urls];
                                        return newUrls;
                                    });
                                }}
                            />
                        </View>
                        <View style={style.separador}></View>
                    </>
                )}

                {/* IMAGENES DEL PROBLEMA ORIGINAL - Solo cuando YA hay reporte creado */}
                {nReporte && (
                    <>
                        <View style={style.separador}></View>
                        <View style={{ marginHorizontal: 16 }}>
                            <Text style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 18,
                                fontWeight: '600',
                                color: '#dc2626',
                                marginBottom: 12,
                                textAlign: 'center'
                            }}>
                                📸 Imágenes del Problema Original
                            </Text>
                            <Text style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 14,
                                color: '#6b7280',
                                marginBottom: 16,
                                textAlign: 'center'
                            }}>
                                Estas son las imágenes que se tomaron al reportar el problema
                            </Text>
                            {imgRuta.length > 0 ? (
                                <TomarFoto
                                    source={imgRuta}
                                    titulo=""
                                    descripcion=""
                                    multiple={true}
                                    limiteImagenes={4}
                                    imagenes={() => { }} // Solo visualización, no permite subir más
                                    soloLectura={true} // Agregar esta prop para solo lectura
                                />
                            ) : (
                                <View style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: 20,
                                    borderRadius: 8,
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        color: '#6c757d',
                                        fontSize: 14,
                                        textAlign: 'center'
                                    }}>
                                        No hay imágenes del problema original
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={style.separador}></View>
                    </>
                )}

                {/* IMAGEN PARA CERRAR REPORTE - Solo cuando YA hay reporte creado */}
                {nReporte && (
                    <>
                        <View style={style.separador}></View>
                        <View style={{ marginHorizontal: 16 }}>
                            <Text style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 18,
                                fontWeight: '600',
                                color: '#28a745',
                                marginBottom: 12,
                                textAlign: 'center'
                            }}>
                                📸 Imágenes de Solución <Text style={{ color: '#dc3545', fontWeight: 'bold' }}>*</Text>
                            </Text>
                            <Text style={{
                                fontFamily: "Comfortaa-Regular",
                                fontSize: 14,
                                color: '#6b7280',
                                marginBottom: 16,
                                textAlign: 'center'
                            }}>
                                Estas son las imágenes que documentan la solución implementada
                            </Text>

                            {reporteCerrado ? (
                                <View>
                                    {imgRutaCerrar.length > 0 ? (
                                        <View>
                                            <View style={{
                                                backgroundColor: '#e8f5e8',
                                                borderRadius: 8,
                                                padding: 12,
                                                marginBottom: 16,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <FontAwesome name="lock" size={16} color="#28a745" style={{ marginRight: 8 }} />
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: '#28a745',
                                                    fontWeight: '600',
                                                    flex: 1
                                                }}>
                                                    Reporte Cerrado - Solo visualización
                                                </Text>
                                            </View>
                                            <TomarFoto
                                                source={imgRutaCerrar}
                                                titulo=""
                                                descripcion=""
                                                multiple={true}
                                                limiteImagenes={4}
                                                imagenes={() => { }} // Solo visualización
                                                soloLectura={true}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 12,
                                            padding: 20,
                                            borderWidth: 1,
                                            borderColor: '#e9ecef',
                                            alignItems: 'center'
                                        }}>
                                            <FontAwesome name="lock" size={32} color="#6c757d" style={{ marginBottom: 8 }} />
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#6c757d',
                                                textAlign: 'center',
                                                marginBottom: 4
                                            }}>
                                                Reporte Cerrado
                                            </Text>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#6c757d',
                                                textAlign: 'center'
                                            }}>
                                                No hay imágenes de solución disponibles
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <TomarFoto
                                    source={imgRutaCerrar}
                                    titulo="Imagen de Solución *"
                                    descripcion="Tome fotos de la solución implementada"
                                    multiple={true}
                                    limiteImagenes={4}
                                    soloLectura={false}
                                    imagenes={(e: any) => {
                                        // Si es múltiple, e es un array; si no, e es un objeto
                                        if (Array.isArray(e)) {
                                            setImgRutaCerrar(e);
                                        } else {
                                            setImgRutaCerrar([e]);
                                        }
                                    }}
                                    onUploadComplete={(urls: string[]) => {
                                        // Acumular las URLs de S3 de las imágenes de solución
                                        setImgUrlsS3Cerrar(prevUrls => {
                                            const newUrls = [...prevUrls, ...urls];
                                            return newUrls;
                                        });
                                    }}
                                />
                            )}
                        </View>
                        <View style={style.separador}></View>
                    </>
                )}

                {nReporte && (
                    <View style={{
                        marginVertical: 8,
                        marginHorizontal: 16,
                        width: Dimensions.get('window').width - 32,
                        alignSelf: 'center'
                    }}>
                        <Text style={[style.row1Step2, { marginBottom: 12, color: '#856404', fontWeight: '600', fontSize: 16 }]}>
                            Gestión del reporte <Text style={{ color: '#dc3545', fontWeight: 'bold' }}>*</Text>
                        </Text>
                        <TextInput
                            placeholder={reporteCerrado ? "Descripción de la gestión realizada..." : "Describe las acciones tomadas para resolver el problema..."}
                            value={cerradoText}
                            style={{
                                backgroundColor: reporteCerrado ? '#f8f9fa' : '#fff',
                                borderWidth: 1,
                                borderColor: reporteCerrado ? '#e9ecef' : '#ffeaa7',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                minHeight: 100,
                                textAlignVertical: 'top',
                                width: '100%',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                                opacity: reporteCerrado ? 0.7 : 1,
                            }}
                            onChangeText={(value) => !reporteCerrado && setCerradoText(value)}
                            multiline={true}
                            numberOfLines={5}
                            placeholderTextColor="#6c757d"
                            editable={!reporteCerrado}
                        />
                        {reporteCerrado && (
                            <Text style={{
                                fontSize: 12,
                                color: '#6c757d',
                                textAlign: 'center',
                                marginTop: 8,
                                fontStyle: 'italic'
                            }}>
                                Este reporte está cerrado y no puede ser editado
                            </Text>
                        )}
                    </View>
                )}

                {nReporte && <View style={style.separador}></View>}

                {nReporte && (
                    <View style={{ marginHorizontal: 16 }}>
                        <SubirDocumento
                            source={imgDocumento}
                            width="100%"
                            titulo="Documento adjunto"
                            limiteImagenes={4}
                            soloLectura={reporteCerrado}
                            imagenes={(e: any) => {
                                // Si es múltiple, e es un array; si no, e es un objeto
                                if (Array.isArray(e)) {
                                    setImgDocumento(e);
                                    // Subir cada documento a S3 solo una vez
                                    e.forEach((documento: any) => {
                                        if (documento.imagen && nReporte && !documento.subido) {
                                            // Marcar como subido para evitar duplicados
                                            documento.subido = true;
                                            uploadDocumento(documento);
                                        }
                                    });
                                } else {
                                    setImgDocumento([e]);
                                    // Subir el documento a S3 solo una vez
                                    if (e.imagen && nReporte && !e.subido) {
                                        // Marcar como subido para evitar duplicados
                                        e.subido = true;
                                        uploadDocumento(e);
                                    }
                                }
                            }}
                        />
                    </View>
                )}
                {nReporte && <View style={style.separador}></View>}
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    {!reporteCerrado && (
                        <TouchableOpacity
                            style={[
                                style.nuevoBtn,
                                {
                                    backgroundColor: (loadingCreate || loadingClose || subiendoImagenes) ? '#ccc' : '#007bff',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 15,
                                    paddingHorizontal: 30,
                                    borderRadius: 25,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 8,
                                    minWidth: 200
                                }
                            ]}
                            onPress={(loadingCreate || loadingClose || subiendoImagenes) ? undefined : () => nReporte ? cerrar() : handleSubmit()}
                            disabled={loadingCreate || loadingClose || subiendoImagenes}
                        >
                            {(loadingCreate || loadingClose || subiendoImagenes) && (
                                <ActivityIndicator
                                    color="#fff"
                                    size="small"
                                    style={{ marginRight: 10 }}
                                />
                            )}
                            <Text style={[
                                style.textGuardar,
                                {
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }
                            ]}>
                                {loadingCreate ? "Creando..." : loadingClose ? "Cerrando..." : subiendoImagenes ? "Subiendo..." : nReporte ? "Cerrar Reporte" : "Crear Reporte"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {reporteCerrado && (
                        <View style={{
                            backgroundColor: '#e8f5e8',
                            borderRadius: 12,
                            padding: 20,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#28a745',
                            minWidth: 200
                        }}>
                            <FontAwesome name="check-circle" size={32} color="#28a745" style={{ marginBottom: 8 }} />
                            <Text style={{
                                color: '#28a745',
                                fontSize: 16,
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                Reporte Cerrado
                            </Text>
                            <Text style={{
                                color: '#28a745',
                                fontSize: 12,
                                textAlign: 'center',
                                marginTop: 4
                            }}>
                                Este reporte ya fue cerrado
                            </Text>
                            {(currentReporte?.usuariocierranombre || currentReporte?.usuarioCierranombre || currentReporte?.usuarioCierraNombre) && (
                                <Text style={{
                                    color: '#28a745',
                                    fontSize: 11,
                                    textAlign: 'center',
                                    marginTop: 4,
                                    fontStyle: 'italic'
                                }}>
                                    Por: {currentReporte.usuariocierranombre || currentReporte.usuarioCierranombre || currentReporte.usuarioCierraNombre}
                                </Text>
                            )}
                        </View>
                    )}
                </View>

            </View >
        );
    };

    return (
        <View style={[style.containerTanque, {
            paddingTop: 0,
            overflow: 'hidden',
            width: '100%',
            flex: 1
        }]}>
            <HeaderLogo variant="compact" style={{}} />
            <ScrollView
                style={{ marginBottom: 85, flex: 1, width: '100%' }}
                contentContainerStyle={{
                    paddingBottom: 20,
                    paddingHorizontal: 0,
                    width: '100%',
                    alignItems: 'center'
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                bounces={false}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
            >
                {rendercontenido()}
            </ScrollView>
            <Footer navigation={navigation} />
            <Toast />
        </View>
    );
};

export default NuevoReporteEmergencia;
