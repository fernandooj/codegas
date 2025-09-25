import React, { useState, useEffect, useContext } from 'react'
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
    uploadImagenReporteEmergencia
} from '../../redux/actions/reporteActions'
import { ReporteEmergencia, ReporteEmergenciaFormData, ReporteEmergenciaCerrarData, ReporteEmergenciaImagenData, ImagenData, NavigationParams } from './types'

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
    const [reporteCerrado, setReporteCerrado] = useState(false);
    const [subiendoImagenes, setSubiendoImagenes] = useState(false);

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
        } else {
            setUsuarioId(usuarioIdParam);
            setPuntoId(puntoIdParam);
            setUsuariocodt(codt);
            setUsuarioRazonSocial(razon_social);
            setUsuarioNombre(nombre);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // Effect para manejar cuando se recibe el reporte desde Redux
    useEffect(() => {
        if (currentReporte) {
            setNReporte(currentReporte._id);
            setTanque(currentReporte.tanque);
            setRed(currentReporte.red);
            setPuntos(currentReporte.puntos);
            setFuga(currentReporte.fuga);
            setPqr(currentReporte.pqr);
            setUsuarioNombre(currentReporte.usuarionombre || '');
            setUsuarioRazonSocial(currentReporte.usuariorazonsocial || '');
            setUsuarioCreaNombre(currentReporte.usuariocreanombre || '');
            setUsuarioCreaRazonSocial(currentReporte.usuariocrearazonsocial || '');
            setPuntodireccion(currentReporte.puntodireccion || '');
            setUsuariocodt(currentReporte.usuariocodt || '');
            setImgRuta(currentReporte.ruta || []);
            setImgDocumento(currentReporte.documento || []);
            setImgRutaCerrar(currentReporte.rutacerrar || []);
            setCerradoText(currentReporte.cerradotext || "");
            setOtrosText(currentReporte.otrostext || "");
        }
    }, [currentReporte]);

    // Effect para manejar errores
    useEffect(() => {
        if (errorCreate) {
            Toast.show({ type: 'error', text1: 'Error al crear reporte', text2: errorCreate });
        }
        if (errorClose) {
            Toast.show({ type: 'error', text1: 'Error al cerrar reporte', text2: errorClose });
        }
        if (errorUpload) {
            Toast.show({ type: 'error', text1: 'Error al subir imagen', text2: errorUpload });
        }
    }, [errorCreate, errorClose, errorUpload]);

    // Effect para manejar éxito en creación de reporte
    useEffect(() => {
        if (currentReporte && !nReporte && loadingCreate === false) {
            // Establecer el nReporte para que se muestren las opciones de edición
            setNReporte(currentReporte._id);

            Toast.show({
                type: 'success',
                text1: 'Reporte creado exitosamente',
                text2: `ID del reporte: ${currentReporte._id}`
            });

            // Subir todas las imágenes pendientes (del problema, cierre y documentos)
            setTimeout(() => {
                uploadImagenesPendientes();
            }, 1000); // Pequeño delay para asegurar que el reporte esté completamente creado
        }
    }, [currentReporte, loadingCreate]);

    // Effect para manejar éxito en cierre de reporte
    useEffect(() => {
        if (reporteCerrado && loadingClose === false) {
            Toast.show({
                type: 'success',
                text1: 'Reporte cerrado exitosamente',
                text2: 'El reporte ha sido cerrado correctamente'
            });
            setReporteCerrado(false); // Resetear el estado
        }
    }, [reporteCerrado, loadingClose]);

    const cerrar = () => {
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
                            usuarioCierra: usuarioCrea
                        };

                        setReporteCerrado(true); // Activar el estado para el toast
                        dispatch(closeReporteEmergencia(data));
                    }
                }
            ]
        );
    };

    const handleSubmit = () => {
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
            codt: usuariocodt
        };

        dispatch(createReporteEmergencia(data));
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
        if (imgDocumento.length > 0) {
            imgDocumento.forEach((documento: any) => {
                if (documento.imagen) { // Solo si tiene la propiedad imagen (base64)
                    uploadImagen(documento, 'documento', 'application/pdf');
                    imagenesSubidas++;
                }
            });
        }

        // Mostrar toast de progreso
        Toast.show({
            type: 'info',
            text1: 'Subiendo imágenes',
            text2: `Subiendo ${totalImagenes} archivo(s)...`
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
                        tanque ? style.checkboxContainerActive : style.checkboxContainerInactive
                    ]}
                    onPress={() => {
                        setTanque(!tanque);
                    }}
                >
                    <Text style={style.checkboxText}>Tanque en mal estado</Text>
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
                        red ? style.checkboxContainerActive : style.checkboxContainerInactive
                    ]}
                    onPress={() => {
                        setRed(!red);
                    }}
                >
                    <Text style={style.checkboxText}>Red en mal estado</Text>
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
                        puntos ? style.checkboxContainerActive : style.checkboxContainerInactive
                    ]}
                    onPress={() => {
                        setPuntos(!puntos);
                    }}
                >
                    <Text style={style.checkboxText}>Puntos de ignición cerca</Text>
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
                        fuga ? style.checkboxContainerActive : style.checkboxContainerInactive
                    ]}
                    onPress={() => {
                        setFuga(!fuga);
                    }}
                >
                    <Text style={style.checkboxText}>Fuga</Text>
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
                        pqr ? style.checkboxContainerActive : style.checkboxContainerInactive
                    ]}
                    onPress={() => {
                        setPqr(!pqr);
                    }}
                >
                    <Text style={style.checkboxText}>PQR</Text>
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
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#ced4da',
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
                        }}
                        onChangeText={(value) => setOtrosText(value)}
                        editable={nReporte ? false : true}
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
                                source={imgRuta}
                                titulo="Imagen del Problema"
                                descripcion="Tome fotos del problema reportado"
                                multiple={true}
                                limiteImagenes={4}
                                permitirSubir={false}
                                imagenes={(e: any) => {
                                    // Si es múltiple, e es un array; si no, e es un objeto
                                    if (Array.isArray(e)) {
                                        setImgRuta(e);
                                    } else {
                                        setImgRuta([e]);
                                    }
                                }}
                            />
                        </View>
                        <View style={style.separador}></View>
                    </>
                )}

                {/* IMAGENES DEL PROBLEMA ORIGINAL - Solo cuando YA hay reporte creado */}
                {nReporte && imgRuta.length > 0 && (
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
                            <TomarFoto
                                source={imgRuta}
                                titulo=""
                                descripcion=""
                                multiple={true}
                                limiteImagenes={4}
                                imagenes={() => { }} // Solo visualización, no permite subir más
                                soloLectura={true} // Agregar esta prop para solo lectura
                            />
                        </View>
                        <View style={style.separador}></View>
                    </>
                )}

                {/* IMAGEN PARA CERRAR REPORTE - Solo cuando YA hay reporte creado */}
                {nReporte && (
                    <>
                        <View style={style.separador}></View>
                        <View style={{ marginHorizontal: 16 }}>
                            <TomarFoto
                                source={imgRutaCerrar}
                                titulo="Imagen de Solución"
                                descripcion="Tome fotos de la solución implementada"
                                multiple={true}
                                limiteImagenes={4}
                                imagenes={(e: any) => {
                                    // Si es múltiple, e es un array; si no, e es un objeto
                                    if (Array.isArray(e)) {
                                        setImgRutaCerrar(e);
                                    } else {
                                        setImgRutaCerrar([e]);
                                    }

                                    // También subir inmediatamente si ya tenemos el ID del reporte
                                    if (nReporte) {
                                        if (Array.isArray(e)) {
                                            e.forEach((imagen: any) => uploadImagen(imagen, 'rutaCerrar', 'image/jpeg'));
                                        } else {
                                            uploadImagen(e, 'rutaCerrar', 'image/jpeg');
                                        }
                                    }
                                }}
                            />
                        </View>
                        <View style={style.separador}></View>
                    </>
                )}{
                    nReporte
                    && <View style={{
                        marginVertical: 8,
                        marginHorizontal: 16,
                        width: Dimensions.get('window').width - 32,
                        alignSelf: 'center'
                    }}>
                        <Text style={[style.row1Step2, { marginBottom: 12, color: '#856404', fontWeight: '600', fontSize: 16 }]}>
                            Gestión del reporte
                        </Text>
                        <TextInput
                            placeholder="Describe las acciones tomadas para resolver el problema..."
                            value={cerradoText}
                            style={{
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#ffeaa7',
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
                            }}
                            onChangeText={(value) => setCerradoText(value)}
                            multiline={true}
                            numberOfLines={5}
                            placeholderTextColor="#6c757d"
                        />
                    </View>
                }

                {nReporte && <View style={style.separador}></View>}
                {
                    nReporte
                    && <View style={{ marginHorizontal: 16 }}>
                        <SubirDocumento
                            source={imgDocumento}
                            width="100%"
                            titulo="Documento adjunto"
                            limiteImagenes={4}
                            imagenes={(e: any) => {
                                // Si es múltiple, e es un array; si no, e es un objeto
                                if (Array.isArray(e)) {
                                    setImgDocumento(e);
                                } else {
                                    setImgDocumento([e]);
                                }

                                // También subir inmediatamente si ya tenemos el ID del reporte
                                if (nReporte) {
                                    if (Array.isArray(e)) {
                                        e.forEach((documento: any) => uploadImagen(documento, 'documento', 'application/pdf'));
                                    } else {
                                        uploadImagen(e, 'documento', 'application/pdf');
                                    }
                                }
                            }}
                        />
                    </View>
                }
                {nReporte && <View style={style.separador}></View>}
                <View style={{ alignItems: "center", marginTop: 20 }}>
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
                </View>

            </View>
        );
    };

    return (
        <View style={[style.containerTanque, {
            paddingTop: 0,
            overflow: 'hidden',
            width: '100%',
            flex: 1
        }]}>
            <HeaderLogo variant="compact" />
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
