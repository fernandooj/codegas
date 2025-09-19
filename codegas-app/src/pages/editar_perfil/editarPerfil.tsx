import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Button,
    TextInput,
    ImageBackground,
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Picker } from '@react-native-picker/picker';
import Footer from '../components/footer';
import TomarFoto from '../components/tomarFoto';
import Toast from 'react-native-toast-message';
import { DataContext } from "../../context/context"
import { accesos } from '../../utils/constants';
import { getZonas } from '../../redux/actions/zonaActions';
import {
    getUserById,
    getPointsByClient,
    createPoints,
    updatePoints,
    signUp,
    updateUserProfile,
    getVeos,
    getActiveZones,
    changeValorUnitario,
    checkEmail,
    assignCommercial,
    deleteUser,
    changeUserStatus,
    createMultipleUsers,
    createMultiplePoints,
    updateMultipleUsers,
    changePassword,
    uploadAvatar
} from '../../redux/actions/usuarioActions';
import {
    EditarPerfilProps,
    EditarPerfilState,
    ContextType,
    RootState,
    UpdateStateFunction,
    RenderPerfilFunction,
    RenderFormPassFunction,
    ModalZonasFunction,
    ModalUbicacionFunction,
    CambiarValorUnitarioFunction,
    VerificaEmailFunction,
    AsignarVeoFunction,
    EliminarUsuarioFunction,
    CambiarEstadoUsuarioFunction,
    ActualizaUbicacionFunction,
    ActualizaArrayUbicacionFunction,
    ActualizaZonaFunction,
    GuardarUbicacionFunction,
    AvatarFunction,
    HandleSubmitFunction,
    EliminarUbicacionFunction,
    GuardarUsuarioFunction,
    EditarUsuarioFunction,
    CambiarPassFunction,
    EdicionExitosaFunction,
    LoginExitosoFunction,
    Ubicacion,
    Veo,
    Zona,
    User,
    ApiResponse,
    SignUpData,
    UpdateUserData,
    MultipleUsersData,
    MultiplePointsData,
    FormDataUpload
} from './types';

// Import FormData as a type to avoid conflicts
import FormDataType from 'form-data';
const VerPerfil: React.FC<EditarPerfilProps> = ({ navigation, route }) => {
    const context = useContext<ContextType>(DataContext);
    const dispatch = useDispatch();
    const perfil = useSelector((state: RootState) => state.usuario.perfil.user);
    const zonas = useSelector((state: any) => state.zona?.zonas || []);

    const [state, setState] = useState<EditarPerfilState>({
        razon_social: '',
        cedula: '',
        direccion_factura: '',
        email: '',
        nombre: '',
        password: '',
        celular: '',
        tipo: '',
        acceso: 'usuario',
        codt: '',
        codMagister: '',
        terminoBuscador: '',
        valorUnitario: '',
        modalUbicacion: false,
        modalZona: false,
        modalCliente: false,
        userId: null,
        zonas: [],
        puntos: [],
        imagen: [],
        veos: [],
        ubicacionesEliminadas: [], //envio los id de las ubicaciones eliminados
        ubicaciones: [
            {
                direccion: undefined,
                nombre: undefined,
                email: undefined,
                celular: undefined,
                idZona: undefined,
                nombreZona: undefined,
                capacidad: undefined,
                lat: undefined,
                lng: undefined,
                is_active: true,
                nuevo: true,
                acceso: 'cliente',
            },
        ],
        cargando: false,
        showPass: false,
        activo: true,
        idUsuario: '',
        veo: '',
        editado: false,
        editaAvatar: false,
        showLoading: false,
        activeScroll: false,
        idZona: '',
        key: 0,
        idVeo: '',
        tipoAcceso: '',
        accesoPerfil: '',
        observacion: '',
        direccion: '',
        emailUbicacion: '',
        celularUbicacion: '',
        nombreUbicacion: '',
        nombreZona: '',
        confirmar: ''
    });

    // Estado para animaciones del modal
    const [modalAnimation] = useState(new Animated.Value(0));
    const [overlayAnimation] = useState(new Animated.Value(0));

    const updateState: UpdateStateFunction = useCallback((updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);
    useEffect(() => {
        const initializeData = async () => {
            const { acceso: accesoPerfil, userId } = context;
            let acceso = accesoPerfil == 'despacho' ? 'cliente' : 'usuario';
            updateState({ accesoPerfil, acceso, userId });

            // Cargar zonas
            try {
                console.log('Loading zonas...');
                const result = await dispatch(getZonas() as any);
                console.log('Zonas result:', result);
            } catch (error) {
                console.error('Error loading zonas:', error);
            }

            // Cargar VEOs
            try {
                console.log('Loading VEOs...');
                const veosResult = await getVeos(100, 0, 'undefined', userId);
                console.log('VEOs result:', veosResult);

                if (veosResult && veosResult.user) {
                    // Transformar los datos al formato esperado por el modal
                    const veosFormatted = veosResult.user.map((veo: any, index: number) => ({
                        key: veo._id || index.toString(),
                        label: veo.nombre || 'Sin nombre'
                    }));
                    updateState({ veos: veosFormatted });
                }
            } catch (error) {
                console.error('Error loading VEOs:', error);
            }

            const params = route?.params;
            console.log('🔍 Parámetros de ruta:', params);
            console.log('🔍 userId del contexto:', userId);

            if (params?.tipoAcceso) {
                updateState({ tipoAcceso: params.tipoAcceso });
                if (params.tipoAcceso == "solucion") {
                    updateState({ acceso: "cliente" });
                }
            }

            if (!params?.tipoAcceso) {
                try {
                    const e = await getUserById(userId);
                    const { user } = e;
                    // Usar userId del contexto cuando se edita perfil propio, no params.idUsuario
                    let ubicaciones = [];
                    if (userId && userId !== null && userId !== undefined && userId !== 'undefined' && userId !== 'null' && userId.toString().trim() !== '') {
                        console.log('📍 Obteniendo puntos para userId:', userId);
                        const ubi = await getPointsByClient(userId);
                        ubicaciones = ubi.status ? ubi.puntos : [];
                        console.log('📍 Ubicaciones obtenidas:', ubicaciones.length);
                    } else {
                        console.log('⚠️ userId no válido para obtener puntos:', userId);
                        console.log('⚠️ Tipo de userId:', typeof userId);
                    }
                    updateState({
                        razon_social: user.razon_social ? user.razon_social : '',
                        cedula: user.cedula ? user.cedula : '',
                        email: user.email ? user.email : '',
                        nombre: user.nombre ? user.nombre : '',
                        password: user.password ? user.password : '',
                        celular: user.celular ? user.celular : '',
                        tipo: user.tipo ? user.tipo : '',
                        acceso: user.acceso ? user.acceso : '',
                        imagen: user.avatar ? user.avatar : [],
                        codt: user.codt ? user.codt : '',
                        valorUnitario: user.valorunitario ? user.valorunitario : '',
                        idUsuario: user._id ? user._id : '',
                        codMagister: user.codMagister ? user.codMagister : '',
                        editado: user.editado ? user.editado : false,
                        ubicaciones: ubicaciones,
                        accesoPerfil: 'cliente',
                        direccion_factura: user.direccion_factura ? user.direccion_factura : "",
                        veo: user.nombrepadre || "",
                    });
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else if (params?.tipoAcceso === "editar") {
                try {
                    const e = await getUserById(params.idUsuario);
                    const { user } = e;
                    // Validar que params.idUsuario existe antes de hacer la llamada
                    let ubicaciones = [];
                    if (params.idUsuario && params.idUsuario !== null && params.idUsuario !== undefined && params.idUsuario !== 'undefined' && params.idUsuario !== 'null' && params.idUsuario.toString().trim() !== '') {
                        console.log('📍 Obteniendo puntos para params.idUsuario:', params.idUsuario);
                        const ubi = await getPointsByClient(params.idUsuario);
                        ubicaciones = ubi.status ? ubi.puntos : [];
                        console.log('📍 Ubicaciones obtenidas:', ubicaciones.length);
                    } else {
                        console.log('⚠️ params.idUsuario no válido para obtener puntos:', params.idUsuario);
                        console.log('⚠️ Tipo de params.idUsuario:', typeof params.idUsuario);
                    }

                    ubicaciones = ubicaciones.map(data => {
                        let data1 = params.idUsuario;
                        let data2 = data.idCliente;
                        if (data1 === data2) {
                            return {
                                direccion: data.direccion,
                                email: undefined,
                                idCliente: undefined,
                                idZona: data.idZona,
                                nombre: undefined,
                                celular: undefined,
                                nombreZona: data.nombreZona,
                                observacion: data.observacion,
                                capacidad: data.capacidad,
                                lat: data.lat?.toString() || '',
                                lng: data.lng?.toString() || '',
                                is_active: data.is_active !== undefined ? data.is_active : true,
                                _id: data._id
                            };
                        } else {
                            return {
                                direccion: data.direccion,
                                email: data.email,
                                idCliente: data.idCliente,
                                idZona: data.idZona,
                                nombre: data.nombre,
                                celular: data.celular,
                                nombreZona: data.nombreZona,
                                observacion: data.observacion,
                                capacidad: data.capacidad,
                                lat: data.lat?.toString() || '',
                                lng: data.lng?.toString() || '',
                                is_active: data.is_active !== undefined ? data.is_active : true,
                                _id: data._id
                            };
                        }
                    });

                    console.log(user);
                    updateState({
                        razon_social: user.razon_social ? user.razon_social : "",
                        cedula: user.cedula ? user.cedula : "",
                        email: user.email ? user.email : "",
                        nombre: user.nombre ? user.nombre : "",
                        password: user.password ? user.password : "",
                        celular: user.celular ? user.celular : "",
                        tipo: user.tipo ? user.tipo : "",
                        acceso: user.acceso ? user.acceso : "",
                        imagen: user.avatar ? user.avatar : [],
                        codt: user.codt ? user.codt : "",
                        ubicaciones,
                        activo: user.activo && user.activo,
                        idUsuario: user._id ? user._id : "",
                        veo: user.nombrepadre || "",
                        codMagister: user.codMagister ? user.codMagister : "",
                        valorUnitario: user.valorunitario,
                        direccion_factura: user.direccion_factura ? user.direccion_factura : "",
                    });
                } catch (error) {
                    console.error('Error loading edit data:', error);
                }
            }
        };

        initializeData();
    }, [context, route?.params, updateState]);
    const editarUsuario: EditarUsuarioFunction = useCallback((e?: any) => {
        updateState({ cargando: true });
        const { razon_social, cedula, ubicaciones, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, editaAvatar, idUsuario, ubicacionesEliminadas, editado, codMagister, valorUnitario } = state;
        let clientes = ubicaciones.filter(e => {
            return e.email && e.idCliente
        })

        let clientesNuevos = ubicaciones.filter(e => {
            return e.email && !e.idCliente
        })

        let puntos = ubicaciones.filter(e => {
            return !e.email
        })

        puntos = ubicaciones.map(e => {
            return { direccion: e.direccion, idZona: e.idZona, observacion: e.observacion, _id: e._id, capacidad: e.capacidad }
        })
        let puntosNuevos = puntos.filter(e => {
            return !e._id
        })
        puntos = puntos.filter(e => {
            return e._id
        })

        updateUserProfile(idUsuario, { editado, puntos, puntosNuevos, razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicacionesEliminadas, codMagister, valorUnitario })
            .then(e => {
                console.log(e)
                if (acceso === "cliente") {
                    ////////////////////////////////////////////        EDITO LOS CLIENTES
                    if (clientes.length > 0) {

                        updateMultipleUsers(clientes, idUsuario, e.user.nombre)
                            .then(res => {
                                AsyncStorage.setItem('nombre', e.user.nombre)
                                Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                                setTimeout(() => {
                                    navigation.navigate("clientes", {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                                updateState({ cargando: false })
                            })
                            .catch(err2 => {
                                console.log(err2)
                                updateState({ cargando: false })
                            })
                    }
                    ////////////////////////////////////////////        INSERTO LOS CLIENTES
                    if (clientesNuevos.length > 0) {
                        console.log("perrito")
                        createMultipleUsers(clientesNuevos, idUsuario, e.user.nombre)
                            .then(res => {
                                AsyncStorage.setItem('nombre', e.user.nombre)
                                Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                                setTimeout(() => {
                                    navigation.navigate("clientes", {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                                updateState({ cargando: false })
                            })
                            .catch(err2 => {
                                console.log(err2)
                                updateState({ cargando: false })
                            })
                    }
                    ////////////////////////////////////////////       EDITO LOS PUNTOS
                    // if(puntos.length>0){
                    //     axios.put("pun/punto/varios",{puntos, idPadre:idUsuario})
                    //     .then(res=>{
                    //         AsyncStorage.setItem('nombre', e.data.user.nombre)
                    //         //navigation.navigate("Home")
                    //         Toast.show("Usuario guardado con exito")
                    //     })
                    //     .catch(err2=>{
                    //         console.log(err2)
                    //         this.setState({cargando:false})
                    //     })
                    // }
                    ////////////////////////////////////////////       INSERTO LOS PUNTOS
                    // if(puntosNuevos.length>0){
                    //     axios.post("pun/punto/varios", {puntos:puntosNuevos, idPadre:idUsuario, idCliente:idUsuario})
                    //     .then(res=>{
                    //         AsyncStorage.setItem('nombre', e.data.user.nombre)
                    //         navigation.navigate("Home")
                    //         Toast.show("Usuario guardado con exito")
                    //     })
                    //     .catch(err2=>{
                    //         console.log(err2)
                    //         this.setState({cargando:false})
                    //     })
                    // }
                    // Actualizar AsyncStorage con los nuevos datos
                    AsyncStorage.setItem('nombre', e.user.nombre || '')
                    AsyncStorage.setItem('email', e.user.email || '')

                    // Actualizar contexto en tiempo real
                    if (context.updateUserData) {
                        console.log('🔄 Actualizando contexto desde editarUsuario (cliente) con:', {
                            nombre: e.user.nombre,
                            email: e.user.email,
                            avatar: e.user.avatar
                        });
                        context.updateUserData({
                            nombre: e.user.nombre,
                            email: e.user.email,
                            avatar: e.user.avatar
                        });
                    } else {
                        console.log('❌ context.updateUserData no está disponible en editarUsuario (cliente)');
                    }

                    Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })

                    // Solo navegar si venimos de la lista de clientes (tipoAcceso === "editar")
                    if (state.tipoAcceso === "editar") {
                        setTimeout(() => {
                            navigation.navigate("clientes", {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                    } else {
                        // Si es perfil propio, no navegar a ningún lado
                        // Solo mostrar mensaje de éxito y quedarse en la misma pantalla
                    }
                    updateState({ cargando: false })

                } else {
                    // Para usuarios no cliente (admin, veo, etc.)
                    // Actualizar AsyncStorage con los nuevos datos
                    AsyncStorage.setItem('nombre', e.user.nombre || '')
                    AsyncStorage.setItem('email', e.user.email || '')

                    // Actualizar contexto en tiempo real
                    if (context.updateUserData) {
                        context.updateUserData({
                            nombre: e.user.nombre,
                            email: e.user.email,
                            avatar: e.user.avatar
                        });
                    }

                    if (editaAvatar) {
                        if (imagen.length === 0) {
                            Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                            // Solo navegar si venimos de la lista de clientes (tipoAcceso === "editar")
                            if (state.tipoAcceso === "editar") {
                                setTimeout(() => {
                                    navigation.navigate("clientes", {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                            } else {
                                // Si es perfil propio, no navegar a ningún lado
                            }
                            updateState({ cargando: false })
                        } else {
                            avatar(imagen, e.user._id)
                        }
                    } else {
                        Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                        // Solo navegar si venimos de la lista de clientes (tipoAcceso === "editar")
                        if (state.tipoAcceso === "editar") {
                            setTimeout(() => {
                                navigation.navigate("clientes", {
                                    scrollPosition: route?.params?.scrollPosition || 0
                                });
                            }, 1500);
                        } else {
                            // Si es perfil propio, no navegar a ningún lado
                        }
                        updateState({ cargando: false })
                    }
                }
            })
            .catch(err => {
                console.log(err);
                updateState({ cargando: false });
            })
    }, [state.razon_social, state.cedula, state.ubicaciones, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.imagen, state.editaAvatar, state.idUsuario, state.ubicacionesEliminadas, state.editado, state.codMagister, state.valorUnitario, updateState, navigation]);

    const renderPerfil: RenderPerfilFunction = useCallback(() => {
        let { razon_social, cedula, direccion_factura, email, nombre, celular, codt, acceso, valorUnitario, tipoAcceso, imagen, cargando, ubicaciones, tipo, activo, idUsuario, accesoPerfil, modalCliente, veos, veo, editado, codMagister } = state;
        valorUnitario = valorUnitario ? valorUnitario.toString() : '';
        razon_social = razon_social ? razon_social.toUpperCase() : razon_social;
        email = email ? email.toUpperCase() : email;
        direccion_factura = direccion_factura ? direccion_factura.toUpperCase() : direccion_factura;
        nombre = nombre ? nombre.toUpperCase() : nombre;

        return (
            <View style={style.formContainer}>
                {/* Header moderno */}
                <View style={style.headerContainer}>
                    <Text style={style.headerTitle}>
                        {tipoAcceso === "admin" ? `Nuevo ${acceso}` : 'Editar perfil'}
                    </Text>
                    <Text style={style.headerSubtitle}>
                        Complete la información del usuario
                    </Text>
                </View>

                <ScrollView
                    keyboardDismissMode="on-drag"
                    style={style.scrollViewContainer}
                    contentContainerStyle={style.scrollViewContent}
                >
                    {/* ACCESO */}
                    {
                        // Mostrar campo solo si:
                        // 1. No es edición de cliente (cliente no puede cambiar su tipo de acceso)
                        // 2. Es admin y no es despacho
                        // 3. Es modo crear
                        ((tipoAcceso === "admin" && accesoPerfil !== "despacho") ||
                            (tipoAcceso === "editar" && acceso !== "cliente") ||
                            tipoAcceso === "crear")
                        && <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>
                                Tipo de Acceso
                            </Text>
                            <TouchableOpacity
                                style={style.selectorContainer}
                                onPress={() => {
                                    // Filtrar opciones según el contexto
                                    let opcionesAcceso = accesos;

                                    // Si es edición y el usuario no es cliente, quitar opción "cliente"
                                    if (tipoAcceso === "editar" && acceso !== "cliente") {
                                        opcionesAcceso = accesos.filter(item => item.value !== "cliente");
                                    }

                                    // Abrir modal para seleccionar acceso
                                    Alert.alert(
                                        'Seleccionar Tipo de Acceso',
                                        'Elija el tipo de acceso:',
                                        opcionesAcceso.map(item => ({
                                            text: item.label,
                                            onPress: () => updateState({ acceso: item.value })
                                        }))
                                    );
                                }}
                            >
                                <Text style={style.selectorText}>
                                    {accesos.find(item => item.value === acceso)?.label || 'Seleccionar acceso'}
                                </Text>
                                <FontAwesome
                                    name="chevron-down"
                                    size={16}
                                    color="#666"
                                    style={style.selectorIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    }

                    {/* EMAIL */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Email
                        </Text>
                        <TextInput
                            placeholder="Ingrese el email"
                            keyboardType='email-address'
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={email => updateState({ email })}
                            onBlur={email => verificaEmail()}
                            style={[
                                style.fieldInput,
                                email.length < 3 && style.fieldInputError
                            ]}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* RAZON SOCIAL */}
                    {
                        acceso === "cliente"
                        && <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>
                                Razón Social
                            </Text>
                            <TextInput
                                placeholder="Ingrese la razón social"
                                placeholderTextColor="#aaa"
                                autoCapitalize="characters"
                                value={razon_social}
                                onChangeText={razon_social => updateState({ razon_social })}
                                style={[
                                    style.fieldInput,
                                    razon_social.length < 3 && style.fieldInputError
                                ]}
                            />
                        </View>
                    }

                    {/* CEDULA */}
                    <View style={style.fieldContainer}>
                        <Text style={style.fieldLabel}>
                            Cédula / NIT
                        </Text>
                        <TextInput
                            placeholder="Ingrese la cédula o NIT"
                            placeholderTextColor="#aaa"
                            keyboardType='numeric'
                            value={cedula}
                            onChangeText={cedula => updateState({ cedula })}
                            style={[
                                style.fieldInput,
                                cedula.length < 5 && style.fieldInputError
                            ]}
                        />
                    </View>

                    {/* DIRECCION */}
                    {
                        acceso === "cliente"
                        && <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>
                                Dirección de Facturación
                            </Text>
                            <TextInput
                                placeholder="Ingrese la dirección de facturación"
                                placeholderTextColor="#aaa"
                                autoCapitalize="characters"
                                value={direccion_factura}
                                onChangeText={direccion_factura => updateState({ direccion_factura })}
                                style={[
                                    style.fieldInput,
                                    direccion_factura.length < 3 && style.fieldInputError
                                ]}
                            />
                        </View>
                    }
                    {/* UBICACION */}
                    {
                        acceso === "cliente"
                        && <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>
                                Ubicación entrega
                            </Text>
                            <TouchableOpacity
                                style={[
                                    style.selectorContainer,
                                    ubicaciones.length < 1 && style.fieldInputError
                                ]}
                                onPress={() => updateState({ modalUbicacion: true })}
                            >
                                <Text style={[
                                    style.selectorText,
                                    ubicaciones.length < 1 && { color: '#dc3545' }
                                ]}>
                                    {ubicaciones.length < 1
                                        ? "Agregar ubicación de entrega"
                                        : `Tienes ${ubicaciones.length} ubicaciones guardadas`
                                    }
                                </Text>
                                <FontAwesome
                                    name="chevron-right"
                                    size={16}
                                    color="#666"
                                    style={style.selectorIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                    {/* CODT */}
                    {
                        acceso === "cliente"
                        && <>
                            <Text style={style.textInfo}>Codt</Text>
                            <TextInput
                                placeholder="CODT"
                                autoCapitalize='none'
                                placeholderTextColor="#aaa"
                                value={codt}
                                onChangeText={codt => updateState({ codt })}
                                style={style.input}
                                editable={accesoPerfil == "cliente" ? false : true}
                            />
                        </>
                    }

                    {/* NOMBRES */}
                    <Text style={style.textInfo}>Nombres</Text>
                    <TextInput
                        placeholder="Nombres"
                        autoCapitalize='none'
                        placeholderTextColor="#aaa"
                        value={nombre}
                        onChangeText={nombre => updateState({ nombre })}
                        style={nombre.length < 3 ? [style.input, style.inputRequired] : style.input}
                    />
                    {/* CELULAR */}
                    <Text style={style.textInfo}>Celular</Text>
                    <TextInput
                        placeholder="Celular"
                        autoCapitalize='none'
                        placeholderTextColor="#aaa"
                        value={celular}
                        onChangeText={celular => updateState({ celular })}
                        style={celular.length < 7 ? [style.input, style.inputRequired] : style.input}
                    />

                    {/* VEO */}
                    {
                        acceso === "veo"
                        && <><Text style={style.textInfo}>Codigo Magister</Text>
                            <TextInput
                                placeholder="Codigo Magister"
                                autoCapitalize='none'
                                placeholderTextColor="#aaa"
                                value={codMagister}
                                onChangeText={codMagister => updateState({ codMagister })}
                                style={codMagister.length < 3 ? [style.input, style.inputRequired] : style.input}
                            />
                        </>
                    }
                    {/* VALOR UNITARIO */}
                    {
                        acceso === "cliente"
                        && <>
                            <Text style={style.textInfo}>Valor Unitario</Text>
                            <TextInput
                                placeholder="Valor Unitario"
                                autoCapitalize='none'
                                placeholderTextColor="#aaa"
                                value={valorUnitario}
                                onChangeText={valorUnitario => updateState({ valorUnitario })}
                                style={valorUnitario.length < 3 ? [style.input, style.inputRequired] : style.input}
                                editable={accesoPerfil == "cliente" ? false : true}
                                onBlur={() => cambiarValorUnitario()}
                            />
                        </>
                    }


                    {/* TIPO */}
                    {
                        acceso === "cliente"
                        && <View style={style.fieldContainer}>
                            <Text style={style.fieldLabel}>
                                Tipo de Cliente
                            </Text>
                            <TouchableOpacity
                                style={[
                                    style.modernSelectorContainer,
                                    tipo && style.modernSelectorSelected
                                ]}
                                onPress={() => {
                                    Alert.alert(
                                        'Seleccionar Tipo',
                                        'Elija el tipo de cliente:',
                                        [
                                            { label: 'Residencial', value: 'Residencial' },
                                            { label: 'Comercial', value: 'Comercial' },
                                            { label: 'Industrial', value: 'Industrial' }
                                        ].map(item => ({
                                            text: item.label,
                                            onPress: () => updateState({ tipo: item.value })
                                        }))
                                    );
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={[
                                        style.modernSelectorText,
                                        tipo && style.modernSelectorTextSelected
                                    ]}>
                                        {tipo || 'Seleccionar tipo'}
                                    </Text>
                                    {tipo && (
                                        <Text style={style.modernSelectorSecondaryText}>
                                            Tipo seleccionado
                                        </Text>
                                    )}
                                </View>
                                <View style={[
                                    style.modernSelectorIconContainer,
                                    tipo && style.modernSelectorIconContainerSelected
                                ]}>
                                    <FontAwesome
                                        name="chevron-down"
                                        size={14}
                                        style={[
                                            style.modernSelectorIcon,
                                            tipo && style.modernSelectorIconSelected
                                        ]}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* Modal VEOs personalizado */}
                    {modalCliente && modalVeos()}

                    {
                        (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "comercial") || acceso === "cliente")
                        && <View style={style.veoContainer}>
                            <Text style={style.veoLabel}>
                                Comercial VEO
                            </Text>
                            <TouchableOpacity
                                onPress={() => accesoPerfil == "cliente" ? null : updateState({ modalCliente: true })}
                                style={[
                                    style.veoSelector,
                                    veo && style.veoSelectorSelected
                                ]}
                            >
                                <View style={style.veoSelectorContent}>
                                    <Text style={[
                                        style.veoSelectorText,
                                        veo && style.veoSelectorTextSelected
                                    ]}>
                                        {veo || "Seleccionar VEO"}
                                    </Text>
                                    {veo && (
                                        <Text style={style.veoSelectorSecondaryText}>
                                            VEO asignado
                                        </Text>
                                    )}
                                </View>
                                <View style={[
                                    style.veoSelectorIconContainer,
                                    veo && style.veoSelectorIconContainerSelected
                                ]}>
                                    <FontAwesome
                                        name="chevron-down"
                                        size={14}
                                        style={[
                                            style.veoSelectorIcon,
                                            veo && style.veoSelectorIconSelected
                                        ]}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* AVATAR */}
                    {
                        acceso !== "cliente"
                        && <View>
                            <TomarFoto
                                width={110}
                                source={imagen}
                                titulo="Foto de perfil"
                                limiteImagenes={1}
                                imagenes={(imagen) => { updateState({ imagen, editaAvatar: true, showLoading: false }) }}
                            />
                        </View>
                    }
                    {/* BOTON ACTUALIZAR USUARIO */}
                    {
                        (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                        && <View style={style.updateUserContainer}>
                            <TouchableOpacity
                                style={style.updateUserButton}
                                onPress={() => editarUsuario("editar")}
                            >
                                {cargando && <ActivityIndicator color="white" style={style.updateUserButtonLoading} />}
                                <Text style={style.updateUserButtonText}>
                                    {cargando ? "Guardando..." : "Actualizar Usuario"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* BOTONES DE ESTADO Y ACCIONES */}
                    {
                        (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                        && <View style={style.actionButtonsContainer}>
                            {/* BOTON CAMBIAR ESTADO */}
                            <TouchableOpacity
                                style={[
                                    style.actionButton,
                                    activo ? style.actionButtonDeactivate : style.actionButtonActivate
                                ]}
                                onPress={() => cambiarEstadoUsuario()}
                            >
                                <FontAwesome
                                    name={activo ? "ban" : "check"}
                                    size={16}
                                    color="white"
                                    style={style.actionButtonIcon}
                                />
                                <Text style={style.actionButtonText}>
                                    {activo ? "Desactivar" : "Activar"}
                                </Text>
                            </TouchableOpacity>

                            {/* BOTON ELIMINAR */}
                            <TouchableOpacity
                                style={[
                                    style.actionButton,
                                    style.actionButtonDelete
                                ]}
                                onPress={() => eliminarUsuario()}
                            >
                                <FontAwesome
                                    name="trash"
                                    size={16}
                                    color="white"
                                    style={style.actionButtonIcon}
                                />
                                <Text style={style.actionButtonText}>
                                    Eliminar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* BOTONES DE ACCIÓN PRINCIPALES */}
                    {
                        // Mostrar botones principales solo para perfil propio o modo crear/admin
                        (tipoAcceso === "" || (tipoAcceso === "admin" || tipoAcceso === "crear")) && (
                            <View style={style.mainButtonsContainer}>
                                {/* BOTON GUARDAR/CREAR PRINCIPAL */}
                                <TouchableOpacity
                                    style={style.primaryButton}
                                    onPress={() => tipoAcceso === "" ? handleSubmit("editar") : handleSubmit()}
                                >
                                    {cargando && <ActivityIndicator color="white" style={style.primaryButtonLoading} />}
                                    <Text style={style.primaryButtonText}>
                                        {cargando
                                            ? "Guardando..."
                                            : (tipoAcceso === ""
                                                ? "Guardar Cambios"
                                                : "Crear Usuario"
                                            )
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                    {/* BOTONES SECUNDARIOS */}
                    <View style={style.secondaryButtonsContainer}>
                        {
                            (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "veo"))
                            && <TouchableOpacity
                                style={[
                                    style.secondaryButton,
                                    style.secondaryButtonCharts
                                ]}
                                onPress={() => navigation.navigate("chart", { idUsuario })}
                            >
                                <FontAwesome
                                    name="bar-chart"
                                    size={16}
                                    color="white"
                                    style={style.secondaryButtonIcon}
                                />
                                <Text style={style.secondaryButtonText}>
                                    Ver Gráficos
                                </Text>
                            </TouchableOpacity>
                        }

                        {
                            (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                            && <TouchableOpacity
                                style={[
                                    style.secondaryButton,
                                    style.secondaryButtonReview
                                ]}
                                onPress={() => navigation.navigate("puntos", { idUsuario })}
                            >
                                <FontAwesome
                                    name="clipboard"
                                    size={16}
                                    color="white"
                                    style={style.secondaryButtonIcon}
                                />
                                <Text style={style.secondaryButtonText}>
                                    Crear Revisión
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </View>

        );
    }, [state]);

    const cambiarValorUnitario: CambiarValorUnitarioFunction = useCallback(() => {
        let { valorUnitario, idUsuario } = state;
        changeValorUnitario(valorUnitario, idUsuario)
            .then(res => {
                if (res.status) {
                    Toast.show({ type: 'success', text1: 'Valor unitario editado' })
                }
            })
    }, [state.valorUnitario, state.idUsuario]);
    const verificaEmail: VerificaEmailFunction = useCallback(() => {
        let { email } = state;
        checkEmail(email)
            .then(res => {
                if (res.data && res.data.status === "SUCCESS") {
                    Toast.show({ type: 'error', text1: 'Este email ya existe!' })
                }
            })
            .catch(err => {
                // Email no existe, está bien
            })
    }, [state.email]);
    const asignarVeo: AsignarVeoFunction = useCallback((idVeo: string) => {
        const { idUsuario, veos, tipoAcceso } = state;
        let veo = veos.filter(e => {
            return e.key == idVeo
        });
        updateState({ veo: veo[0].label, modalCliente: false, idVeo });
        assignCommercial(idUsuario, idVeo)
            .then(res => {
                if (res.status) {
                    setTimeout(() => {
                        Toast.show({ type: 'success', text1: 'Usuario asignado' })
                    }, 100);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [state.idUsuario, state.veos, state.tipoAcceso, updateState]);
    const eliminarUsuario: EliminarUsuarioFunction = useCallback(() => {
        const { nombre, idUsuario } = state;
        Alert.alert(
            'Seguro desea eliminar',
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },
                { text: 'Cancelar', onPress: () => console.log("cancelado") },
            ],
            { cancelable: false }
        );
        const confirmar = () => {
            deleteUser(idUsuario)
                .then(res => {
                    if (res.status) {
                        Toast.show({ type: 'success', text1: 'Usuario eliminado con éxito' });
                        setTimeout(() => {
                            navigation.navigate("clientes", {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                    }
                })
                .catch(err => {
                    console.log(err);
                    Toast.show({ type: 'error', text1: 'Error al eliminar usuario' });
                });
        }
    }, [state.nombre, state.idUsuario, navigation]);
    const cambiarEstadoUsuario: CambiarEstadoUsuarioFunction = useCallback(() => {
        const { nombre, idUsuario, activo } = state;

        Alert.alert(
            `Seguro desea ${activo ? "Desactivar" : "Activar"}`,
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },
                { text: 'Cancelar', onPress: () => console.log("cancelado") },
            ],
            { cancelable: false }
        );
        const confirmar = () => {
            changeUserStatus(idUsuario, !activo)
                .then(res => {
                    if (res.status) {
                        Toast.show({ type: 'success', text1: `Usuario ${!activo ? 'activado' : 'desactivado'} con éxito` });
                        setTimeout(() => {
                            navigation.navigate("clientes");
                        }, 1500);
                    }
                })
                .catch(err => {
                    console.log(err);
                    Toast.show({ type: 'error', text1: 'Error al cambiar estado del usuario' });
                });
        }
    }, [state.nombre, state.idUsuario, state.activo, navigation]);
    const actualizaUbicacion: ActualizaUbicacionFunction = useCallback(() => {
        let {
            observacion,
            ubicaciones,
            direccion,
            emailUbicacion,
            celularUbicacion,
            nombreUbicacion,
            nombreZona,
        } = state;
        let data = {
            direccion,
            email: emailUbicacion,
            celular: celularUbicacion,
            nombre: nombreUbicacion,
            observacion,
            nombreZona,
            lat: '',
            lng: '',
            is_active: true,
            nuevo: true,
            acceso: 'cliente',
        };
        ubicaciones.push(data);
        updateState({ ubicaciones });
    }, [state.observacion, state.ubicaciones, state.direccion, state.emailUbicacion, state.celularUbicacion, state.nombreUbicacion, state.nombreZona, updateState]);
    const actualizaArrayUbicacion: ActualizaArrayUbicacionFunction = useCallback((type: string, value: string, key: number) => {
        let { ubicaciones } = state;
        type == 'direccion'
            ? (ubicaciones[key].direccion = value)
            : type == 'observacion'
                ? (ubicaciones[key].observacion = value)
                : type == 'emailUbicacion'
                    ? (ubicaciones[key].email = value)
                    : type == 'celularUbicacion'
                        ? (ubicaciones[key].celular = value)
                        : type == 'capacidad'
                            ? (ubicaciones[key].capacidad = value)
                            : type == 'lat'
                                ? (ubicaciones[key].lat = value)
                                : type == 'lng'
                                    ? (ubicaciones[key].lng = value)
                                    : type == 'is_active'
                                        ? (ubicaciones[key].is_active = value === "true")
                                        : (ubicaciones[key].nombre = value);
        updateState({ ubicaciones });
    }, [state.ubicaciones, updateState]);

    const actualizaZona: ActualizaZonaFunction = useCallback((id: string, nombre: string) => {
        const { key, ubicaciones } = state;
        ubicaciones[key].idZona = id;
        ubicaciones[key].nombreZona = nombre;
        updateState({ ubicaciones, modalZona: false });
    }, [state.key, state.ubicaciones, updateState]);

    const modalZonas: ModalZonasFunction = useCallback(() => {
        const { idZona, terminoBuscador } = state;
        console.log('Modal zonas - zonas from Redux:', zonas);

        return (
            <View style={style.modalZonaOverlay}>
                <View style={style.modalZonaContainer}>
                    {/* Header del Modal */}
                    <View style={style.modalZonaHeader}>
                        <Text style={style.modalZonaTitle}>
                            Seleccionar Zona
                        </Text>
                        <TouchableOpacity
                            onPress={() => updateState({ modalZona: false })}
                            style={style.modalZonaCloseButton}
                        >
                            <FontAwesome name="times" size={16} style={style.modalZonaCloseIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Barra de búsqueda */}
                    <View style={style.zonaSearchContainer}>
                        <TextInput
                            placeholder="Buscar zona..."
                            value={terminoBuscador}
                            onChangeText={terminoBuscador => updateState({ terminoBuscador })}
                            style={style.zonaSearchInput}
                        />
                    </View>

                    {/* Lista de zonas */}
                    <ScrollView style={style.zonaListContainer}>
                        {zonas
                            .filter(zona =>
                                terminoBuscador === '' ||
                                zona.nombre.toLowerCase().includes(terminoBuscador.toLowerCase())
                            )
                            .map((zona, key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => actualizaZona(zona._id, zona.nombre)}
                                    style={[
                                        style.zonaItem,
                                        idZona === zona._id && style.zonaItemSelected
                                    ]}
                                >
                                    <Text style={style.zonaItemText}>
                                        {zona.nombre}
                                    </Text>
                                    {idZona === zona._id && (
                                        <FontAwesome
                                            name="check"
                                            size={18}
                                            style={style.zonaItemCheck}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>

                    {/* Footer */}
                    <View style={style.modalFooter}>
                        <TouchableOpacity
                            style={style.modalCancelButton}
                            onPress={() => updateState({ modalZona: false })}
                        >
                            <Text style={style.modalButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, [zonas, state.idZona, state.terminoBuscador, updateState, actualizaZona]);

    // Effect para animaciones del modal VEO
    useEffect(() => {
        if (state.modalCliente) {
            // Reset animations
            modalAnimation.setValue(0);
            overlayAnimation.setValue(0);

            // Start entrance animations
            Animated.parallel([
                Animated.timing(overlayAnimation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.spring(modalAnimation, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [state.modalCliente]);

    const modalVeos = useCallback(() => {
        const { terminoBuscador, veos } = state;

        const closeModal = () => {
            Animated.parallel([
                Animated.timing(overlayAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(modalAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                updateState({ modalCliente: false });
            });
        };

        const renderVeoItem = (veo: any, index: number, nivel: number = 0) => {
            const paddingLeft = nivel * 20;
            const tieneHijos = veo.children && veo.children.length > 0;

            return (
                <View key={veo.key || index}>
                    <TouchableOpacity
                        onPress={() => {
                            asignarVeo(veo.key);
                            closeModal();
                        }}
                        style={{
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f1f3f4',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: state.idVeo === veo.key ? '#e3f2fd' : '#fff',
                            marginLeft: paddingLeft,
                            borderLeftWidth: nivel > 0 ? 2 : 0,
                            borderLeftColor: '#2196f3'
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            {nivel > 0 && (
                                <Text style={{ color: '#2196f3', marginRight: 8 }}>
                                    └─
                                </Text>
                            )}
                            <View>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#333',
                                    fontWeight: state.idVeo === veo.key ? 'bold' : 'normal'
                                }}>
                                    {veo.label}
                                </Text>
                                {tieneHijos && (
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#666',
                                        marginTop: 2
                                    }}>
                                        {veo.children.length} subordinado(s)
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {tieneHijos && (
                                <FontAwesome
                                    name="users"
                                    size={14}
                                    color="#2196f3"
                                    style={{ marginRight: 8 }}
                                />
                            )}
                            {state.idVeo === veo.key && (
                                <FontAwesome
                                    name="check"
                                    size={18}
                                    color="#2196f3"
                                />
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Renderizar hijos recursivamente */}
                    {tieneHijos && veo.children.map((hijo: any, childIndex: number) =>
                        renderVeoItem(hijo, childIndex, nivel + 1)
                    )}
                </View>
            );
        };

        return (
            <Modal
                transparent
                visible={true}
                animationType="none"
                onRequestClose={closeModal}
            >
                <Animated.View
                    style={[
                        style.modalOverlay,
                        {
                            opacity: overlayAnimation,
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            style.modalContainer,
                            {
                                transform: [
                                    {
                                        scale: modalAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 1],
                                        }),
                                    },
                                    {
                                        translateY: modalAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            }
                        ]}
                    >
                        {/* Header del Modal */}
                        <View style={style.modalHeader}>
                            <Text style={style.modalTitle}>
                                Seleccionar VEO Comercial
                            </Text>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 15,
                                    width: 30,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#e9ecef'
                                }}
                            >
                                <FontAwesome name="times" size={16} color="#6c757d" />
                            </TouchableOpacity>
                        </View>

                        {/* Barra de búsqueda */}
                        <View style={{ padding: 20, paddingBottom: 10 }}>
                            <TextInput
                                placeholder="Buscar VEO..."
                                value={terminoBuscador}
                                onChangeText={terminoBuscador => updateState({ terminoBuscador })}
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    borderWidth: 1,
                                    borderColor: '#e9ecef',
                                    borderRadius: 8,
                                    paddingHorizontal: 15,
                                    paddingVertical: 12,
                                    fontSize: 16,
                                    color: '#333'
                                }}
                            />
                        </View>

                        {/* Lista de VEOs */}
                        <ScrollView style={{ maxHeight: 400 }}>
                            {veos.length === 0 ? (
                                <View style={{
                                    padding: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FontAwesome
                                        name="users"
                                        size={48}
                                        color="#e9ecef"
                                        style={{ marginBottom: 16 }}
                                    />
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#666',
                                        textAlign: 'center'
                                    }}>
                                        No hay VEOs disponibles
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#999',
                                        textAlign: 'center',
                                        marginTop: 8
                                    }}>
                                        Contacta al administrador para asignar VEOs
                                    </Text>
                                </View>
                            ) : (
                                veos
                                    .filter(veo =>
                                        terminoBuscador === '' ||
                                        veo.label.toLowerCase().includes(terminoBuscador.toLowerCase())
                                    )
                                    .map((veo, index) => renderVeoItem(veo, index))
                            )}
                        </ScrollView>

                        {/* Footer */}
                        <View style={{
                            padding: 20,
                            borderTopWidth: 1,
                            borderTopColor: '#e9ecef'
                        }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#6c757d',
                                    borderRadius: 8,
                                    padding: 15
                                }}
                                onPress={closeModal}
                            >
                                <Text style={{
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        );
    }, [state.terminoBuscador, state.veos, state.idVeo, updateState, asignarVeo, overlayAnimation, modalAnimation]);

    const modalUbicacion: ModalUbicacionFunction = useCallback(() => {
        let { modalZona, ubicaciones, activeScroll } = state;
        return (
            <View style={style.modalUbicacionOverlay}>
                {modalZona ? modalZonas() : null}
                <View style={style.modalUbicacionContainer}>
                    {/* Header del Modal */}
                    <View style={style.modalUbicacionHeader}>
                        <Text style={style.modalUbicacionTitle}>
                            Ubicaciones de Entrega
                        </Text>
                        <TouchableOpacity
                            onPress={() => updateState({ modalUbicacion: false })}
                            style={style.modalUbicacionCloseButton}
                        >
                            <FontAwesome name="times" size={16} style={style.modalUbicacionCloseIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Contenido del Modal */}
                    <ScrollView style={style.modalUbicacionScrollView} keyboardDismissMode="on-drag">
                        <View style={style.modalContentPadding}>
                            <Text style={style.modalUbicacionDescription}>
                                Si el pedido lo realizará el encargado del punto por favor inserta su información, de lo contrario solo inserta la dirección y zona
                            </Text>

                            {ubicaciones.map((ubicacion, key) => (
                                <View key={key} style={style.ubicacionCard}>
                                    <View style={style.ubicacionHeader}>
                                        <Text style={style.ubicacionTitle}>
                                            Ubicación {key + 1}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => eliminarUbicacion(key)}
                                            style={style.ubicacionDeleteButton}
                                        >
                                            <FontAwesome name="trash" size={12} style={style.ubicacionDeleteIcon} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Campos de la ubicación */}
                                    <View style={style.ubicacionFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Dirección *
                                        </Text>
                                        <TextInput
                                            placeholder="Dirección"
                                            value={ubicacion.direccion ? ubicacion.direccion.toUpperCase() : ubicacion.direccion}
                                            onChangeText={direccion => actualizaArrayUbicacion("direccion", direccion, key)}
                                            style={style.ubicacionFieldInput}
                                        />
                                    </View>

                                    <View style={style.ubicacionFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Zona *
                                        </Text>
                                        <TouchableOpacity
                                            style={style.ubicacionSelector}
                                            onPress={() => updateState({ modalZona: true, key })}
                                        >
                                            <Text style={style.ubicacionSelectorText}>
                                                {ubicacion.nombreZona || "Seleccionar zona"}
                                            </Text>
                                            <FontAwesome name="chevron-down" size={14} style={style.ubicacionSelectorIcon} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Campos de Coordenadas (Latitud y Longitud) */}
                                    <View style={style.latLngContainer}>
                                        <View style={style.latLngFieldContainer}>
                                            <Text style={style.ubicacionFieldLabel}>
                                                Latitud
                                            </Text>
                                            <TextInput
                                                placeholder="Ej: 4.6230545"
                                                value={ubicacion.lat || ''}
                                                onChangeText={lat => actualizaArrayUbicacion("lat", lat, key)}
                                                style={style.ubicacionFieldInput}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View style={style.latLngFieldContainer}>
                                            <Text style={style.ubicacionFieldLabel}>
                                                Longitud
                                            </Text>
                                            <TextInput
                                                placeholder="Ej: -74.1910443"
                                                value={ubicacion.lng || ''}
                                                onChangeText={lng => actualizaArrayUbicacion("lng", lng, key)}
                                                style={style.ubicacionFieldInput}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>

                                    <View style={style.ubicacionFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Capacidad almacenamiento
                                        </Text>
                                        <TextInput
                                            placeholder="Capacidad almacenamiento"
                                            value={ubicacion.capacidad}
                                            onChangeText={capacidad => actualizaArrayUbicacion("capacidad", capacidad, key)}
                                            style={style.ubicacionFieldInput}
                                        />
                                    </View>

                                    <View style={style.ubicacionFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Observaciones
                                        </Text>
                                        <TextInput
                                            placeholder="Observaciones ingreso del vehículo"
                                            onChangeText={observacion => actualizaArrayUbicacion("observacion", observacion, key)}
                                            style={style.ubicacionFieldInput}
                                        />
                                    </View>

                                    {/* Campo de Estado Activo */}
                                    <View style={style.ubicacionFieldContainer}>
                                        <Text style={style.ubicacionFieldLabel}>
                                            Estado del punto
                                        </Text>
                                        <TouchableOpacity
                                            style={[
                                                style.ubicacionSelector,
                                                ubicacion.is_active === false && { borderColor: '#dc3545' }
                                            ]}
                                            onPress={() => actualizaArrayUbicacion("is_active", ubicacion.is_active === false ? "true" : "false", key)}
                                        >
                                            <Text style={[
                                                style.ubicacionSelectorText,
                                                { color: ubicacion.is_active === false ? '#dc3545' : '#28a745' }
                                            ]}>
                                                {ubicacion.is_active === false ? "Inactivo" : "Activo"}
                                            </Text>
                                            <FontAwesome
                                                name={ubicacion.is_active === false ? "times-circle" : "check-circle"}
                                                size={14}
                                                style={[
                                                    style.ubicacionSelectorIcon,
                                                    { color: ubicacion.is_active === false ? '#dc3545' : '#28a745' }
                                                ]}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {(ubicacion.nuevo || ubicacion.idCliente) && (
                                        <>
                                            <View style={style.ubicacionFieldContainer}>
                                                <Text style={style.ubicacionFieldLabel}>
                                                    Email
                                                </Text>
                                                <TextInput
                                                    placeholder="Email"
                                                    value={ubicacion.email}
                                                    onFocus={() => updateState({ activeScroll: true })}
                                                    onBlur={() => updateState({ activeScroll: false })}
                                                    onChangeText={emailUbicacion => actualizaArrayUbicacion("emailUbicacion", emailUbicacion, key)}
                                                    style={style.ubicacionFieldInput}
                                                />
                                            </View>

                                            <View style={style.ubicacionFieldContainer}>
                                                <Text style={style.ubicacionFieldLabel}>
                                                    Celular
                                                </Text>
                                                <TextInput
                                                    placeholder="Celular"
                                                    value={ubicacion.celular}
                                                    onFocus={() => updateState({ activeScroll: true })}
                                                    onBlur={() => updateState({ activeScroll: false })}
                                                    onChangeText={celularUbicacion => actualizaArrayUbicacion("celularUbicacion", celularUbicacion, key)}
                                                    style={style.ubicacionFieldInput}
                                                />
                                            </View>

                                            <View style={style.ubicacionFieldContainer}>
                                                <Text style={style.ubicacionFieldLabel}>
                                                    Nombre
                                                </Text>
                                                <TextInput
                                                    placeholder="Nombre"
                                                    value={ubicacion.nombre}
                                                    onFocus={() => updateState({ activeScroll: true })}
                                                    onBlur={() => updateState({ activeScroll: false })}
                                                    onChangeText={nombreUbicacion => actualizaArrayUbicacion("nombreUbicacion", nombreUbicacion, key)}
                                                    style={style.ubicacionFieldInput}
                                                />
                                            </View>
                                        </>
                                    )}
                                </View>
                            ))}

                            {/* Botón Agregar Ubicación */}
                            <TouchableOpacity
                                onPress={() => actualizaUbicacion()}
                                style={style.addUbicacionButton}
                            >
                                <FontAwesome name="plus" size={16} color="#fff" style={style.addUbicacionIcon} />
                                <Text style={style.addUbicacionText}>
                                    Agregar Ubicación
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Footer del Modal */}
                    <View style={[style.modalFooter, style.modalFooterRow]}>
                        <TouchableOpacity
                            style={style.modalCancelButton}
                            onPress={() => updateState({ modalUbicacion: false })}
                        >
                            <Text style={style.modalButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={style.modalSaveButton}
                            onPress={() => guardarUbicacion()}
                        >
                            <Text style={style.modalButtonText}>
                                Guardar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, [state.modalZona, state.ubicaciones, state.activeScroll, modalZonas, updateState, zonas]);

    const guardarUbicacion: GuardarUbicacionFunction = useCallback(async () => {
        try {
            let { ubicaciones, idUsuario } = state;

            // Filtrar ubicaciones válidas
            ubicaciones = ubicaciones.filter((e, index) => {
                return e.direccion != undefined && e.direccion != ""
            });

            // Validar que todas tengan zona
            const isEmpty = ubicaciones.every(x => {
                return x.idZona && x.idZona !== "";
            });

            if (!isEmpty) {
                Alert.alert("Error", "Todas las ubicaciones deben tener una zona asignada");
                return;
            }

            // Separar puntos nuevos de puntos existentes
            const puntosNuevos = ubicaciones.filter(e => !e._id);
            const puntosExistentes = ubicaciones.filter(e => e._id);

            // Preparar datos para crear puntos nuevos
            if (puntosNuevos.length > 0) {
                const puntosParaCrear = puntosNuevos.map(punto => {
                    // Convertir lat/lng a coordenadas POINT si están disponibles
                    let location = punto.location || null;
                    if (punto.lat && punto.lng && punto.lat.trim() !== '' && punto.lng.trim() !== '') {
                        // Formato POINT de PostgreSQL: (lng, lat)
                        location = `(${punto.lng}, ${punto.lat})`;
                    }

                    return {
                        observacion: punto.observacion || '',
                        direccion: punto.direccion,
                        capacidad: punto.capacidad || 0,
                        punto: punto.capacidad || 0,
                        location: location,
                        place_name: punto.place_name || null,
                        is_active: punto.is_active !== undefined ? punto.is_active : true,
                        idZona: punto.idZona,
                        idCliente: idUsuario,
                        idPadre: null
                    };
                });

                console.log('Creando puntos nuevos:', puntosParaCrear);
                const resultCreate = await createPoints(puntosParaCrear);
                console.log('Resultado crear puntos:', resultCreate);
            }

            // Preparar datos para actualizar puntos existentes
            if (puntosExistentes.length > 0) {
                const puntosParaActualizar = puntosExistentes.map(punto => {
                    // Convertir lat/lng a coordenadas POINT si están disponibles
                    let location = punto.location || null;
                    if (punto.lat && punto.lng && punto.lat.trim() !== '' && punto.lng.trim() !== '') {
                        // Formato POINT de PostgreSQL: (lng, lat)
                        location = `(${punto.lng}, ${punto.lat})`;
                    }

                    return {
                        _id: punto._id,
                        observacion: punto.observacion || '',
                        direccion: punto.direccion,
                        capacidad: punto.capacidad || 0,
                        location: location,
                        place_name: punto.place_name || null,
                        is_active: punto.is_active !== undefined ? punto.is_active : true,
                        idZona: punto.idZona,
                        idCliente: idUsuario,
                        idPadre: null
                    };
                });

                console.log('Actualizando puntos existentes:', puntosParaActualizar);
                const resultUpdate = await updatePoints(puntosParaActualizar);
                console.log('Resultado actualizar puntos:', resultUpdate);
            }

            // Mostrar mensaje de éxito y cerrar modal
            Toast.show({
                type: 'success',
                text1: 'Ubicaciones guardadas',
                text2: 'Las ubicaciones se han guardado correctamente'
            });

            updateState({ ubicaciones, modalUbicacion: false });

        } catch (error) {
            console.error('Error al guardar ubicaciones:', error);
            Alert.alert("Error", "No se pudieron guardar las ubicaciones. Inténtalo de nuevo.");
        }
    }, [state.ubicaciones, state.idUsuario, updateState]);

    const renderFormPass: RenderFormPassFunction = useCallback(() => {
        const { password, confirmar, showLoading, cargando } = state;
        return <View style={style.contenedorPerfil}>
            <Text style={style.tituloContrasena}>Inserta tu contraseña</Text>
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={password => updateState({ password })}
                style={style.input}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirmar"
                value={confirmar}
                onChangeText={confirmar => updateState({ confirmar })}
                style={style.input}
                secureTextEntry={true}
            />
            {/* <Button color="#0071bb" loading={showLoading} 
                        title="Guardar"
                        disabled={ password!==confirmar ?true :false} 
                        onPress={() => savePassword()}
                    /> */}
            <TouchableOpacity style={style.btnGuardar} onPress={() => cambiarPass()}>
                {cargando && <ActivityIndicator style={{ marginRight: 5 }} />}
                <Text style={style.textGuardar}>{cargando ? "Guardando" : "Guardar"}</Text>
            </TouchableOpacity>
            {
                password !== confirmar
                && <TouchableOpacity
                    style={style.passwordMismatchButton}
                    disabled={showLoading}
                >
                    {showLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={style.passwordMismatchText}>
                            No coinciden
                        </Text>
                    )}
                </TouchableOpacity>
            }
        </View>;
    }, [state.password, state.confirmar, state.showLoading, state.cargando]);
    const { modalUbicacion: showModalUbicacion, showPass } = state;

    return (
        <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
            {showModalUbicacion ? modalUbicacion() : null}
            {
                showPass
                    ? renderFormPass()
                    : renderPerfil()
            }
            <Footer navigation={navigation} />
            <Toast />
        </ImageBackground>
    );
    ///////////////////////////////////////////////////////////////
    //////////////          ACTUALIZA EL AVATAR
    ///////////////////////////////////////////////////////////////
    const avatar: AvatarFunction = useCallback((imagen: string[], idUser: string) => {
        updateState({ showLoading: true });
        let data = new FormDataType();
        const imagenFile = imagen[0];
        state.tipoAcceso ? data.append('crear', true) : null;
        data.append('imagen', imagenFile);
        data.append('imagenOtroUsuario', true);
        data.append('idUser', idUser);
        uploadAvatar(data)
            .then((res) => {
                console.log(res);
                if (res.status) {
                    if (state.tipoAcceso) {
                        Alert.alert("Éxito", "Usuario guardado con exito");
                        navigation.navigate("Perfil");
                    } else {
                        loginExitoso(res.user);
                    }
                }
            })
            .catch(err => {
                updateState({ cargando: false });
            })
    }, [state.tipoAcceso, updateState, navigation]);


    /////////////////////////////////////////////////////////////////////////
    //////////////         VERIFICO QUE EL USUARIO TENGA TODOS LOS DATOS
    ///////////////////////////////////////////////////////////////////////
    const handleSubmit: HandleSubmitFunction = useCallback((esEditar?: string) => {
        const { razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario } = state;
        console.log({ razon_social, cedula, direccion_factura, nombre, email, tipo, celular, acceso, codt, imagen, ubicaciones, valorUnitario })
        if (acceso === "cliente") {
            if (razon_social == "" || direccion_factura == "" || nombre == "" || email == "" || tipo == "" || ubicaciones.length < 1) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    '',
                    [
                        { text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            } else if (celular.length < 7) {
                Toast.show({ type: 'error', text1: 'Telefono incorrecto' })

            } else if (cedula.length < 5) {
                Toast.show({ type: 'error', text1: 'Cedula incorrecta' })
            } else {
                esEditar == "editar" ? editarUsuario() : guardarUsuario()
            }
        } else {
            if (cedula == "" || email == "" || nombre == "" || celular == "" || !imagen) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    "",
                    [
                        { text: 'Cerrar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            } else {
                esEditar == "editar" ? editarUsuario() : guardarUsuario();
            }
        }
    }, [state.razon_social, state.cedula, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.imagen, state.ubicaciones, state.valorUnitario]);

    /////////////////////////////////////////////////////////////////////////
    //////////////         ELIMINO LA UBICACION SELECCIONADA
    ///////////////////////////////////////////////////////////////////////
    const eliminarUbicacion: EliminarUbicacionFunction = useCallback((key: number) => {
        let { ubicaciones, ubicacionesEliminadas } = state;
        ubicaciones.filter((e, index) => {
            if (index == key && e._id) {
                ubicacionesEliminadas.push(e._id)
            }
        });
        ubicaciones = ubicaciones.filter((e, index) => {
            return index != key
        });

        updateState({ ubicaciones, ubicacionesEliminadas });
    }, [state.ubicaciones, state.ubicacionesEliminadas, updateState]);
    const guardarUsuario: GuardarUsuarioFunction = useCallback((e?: any) => {
        updateState({ cargando: true });
        const { razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, ubicaciones, imagen, codMagister, valorUnitario, idVeo } = state;
        let clientes = ubicaciones.filter(e => {
            return e.email
        })
        let puntos = ubicaciones.filter(e => {
            return !e.email
        })
        puntos = puntos.map(e => {
            return { direccion: e.direccion, idZona: e.idZona, observacion: e.observacion, capacidad: e.capacidad }
        })

        signUp({ razon_social, cedula, direccion_factura, nombre, email, celular, tipo, acceso, codt, puntos, codMagister, valorUnitario })
            .then(e => {

                console.log(e)
                if (e.status) {
                    assignCommercial(e.user._id, idVeo)
                    if (acceso === "cliente") {
                        if (clientes.length > 0) {
                            createMultipleUsers(clientes, e.user._id, e.user.nombre)
                                .then(res => {
                                    // Actualizar contexto si es edición de perfil propio
                                    if (!state.tipoAcceso || state.tipoAcceso === "") {
                                        // Actualizar contexto en tiempo real
                                        if (context.updateUserData) {
                                            context.updateUserData({
                                                nombre: e.user.nombre,
                                                email: e.user.email,
                                                avatar: e.user.avatar
                                            });
                                        }
                                    }
                                    // Solo navegar si es creación de usuario, no edición de perfil propio
                                    if (state.tipoAcceso && state.tipoAcceso !== "") {
                                        navigation.navigate("Home")
                                    }
                                    Toast.show({ type: 'success', text1: 'Usuario guardado con exito' })

                                })
                                .catch(err2 => {
                                    console.log(err2)
                                    updateState({ cargando: false })
                                })
                        } else {
                            createMultiplePoints(puntos, e.user._id)
                                .then(res => {
                                    console.log(res)
                                    // Actualizar contexto si es edición de perfil propio
                                    if (!state.tipoAcceso || state.tipoAcceso === "") {
                                        // Actualizar contexto en tiempo real
                                        if (context.updateUserData) {
                                            context.updateUserData({
                                                nombre: e.user.nombre,
                                                email: e.user.email,
                                                avatar: e.user.avatar
                                            });
                                        }
                                    }
                                    // Solo navegar si es creación de usuario, no edición de perfil propio
                                    if (state.tipoAcceso && state.tipoAcceso !== "") {
                                        navigation.navigate("Home")
                                    }
                                    Toast.show({ type: 'success', text1: 'Usuario guardado con exito' })
                                })
                                .catch(err2 => {
                                    console.log(err2)
                                    updateState({ cargando: false })
                                })
                        }
                    } else {
                        if (imagen.length === 0) {
                            // Actualizar contexto si es edición de perfil propio
                            if (!state.tipoAcceso || state.tipoAcceso === "") {
                                // Actualizar contexto en tiempo real
                                if (context.updateUserData) {
                                    context.updateUserData({
                                        nombre: e.user.nombre,
                                        email: e.user.email,
                                        avatar: e.user.avatar
                                    });
                                }
                            }
                            // Solo navegar si es creación de usuario, no edición de perfil propio
                            if (state.tipoAcceso && state.tipoAcceso !== "") {
                                navigation.navigate("Home")
                            }
                            Toast.show({ type: 'success', text1: 'Usuario guardado con exito' })
                        } else {
                            avatar(imagen, e.user._id)
                        }
                    }
                } else {
                    updateState({ cargando: false });
                    Toast.show({ type: 'error', text1: 'Este email ya existe' })
                }
            })
            .catch(err => {
                console.log(err);
                updateState({ cargando: false });
            })
    }, [state.razon_social, state.cedula, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.ubicaciones, state.imagen, state.codMagister, state.valorUnitario, state.idVeo, updateState, navigation]);
    const cambiarPass: CambiarPassFunction = useCallback(() => {
        const { email, password, confirmar } = state;
        if (password.length < 3 || confirmar.length < 3) {
            Alert.alert("Error", "Inserte ambos campos")
        }
        else if (password != confirmar) {
            Alert.alert("Error", "Las contraseñas no coinciden")
        } else {
            changePassword(email, password)
                .then(e => {
                    console.log(e)
                    if (e.status) {
                        Toast.show({ type: 'success', text1: 'Información editada' })
                        // Solo navegar si no es edición de perfil propio
                        if (state.tipoAcceso && state.tipoAcceso !== "") {
                            navigation.navigate("Home")
                        }
                    } else {
                        Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [state.email, state.password, state.confirmar, navigation]);

    const edicionExitosa: EdicionExitosaFunction = useCallback(async (nombre: string) => {
        updateState({ cargando: false });
        Toast.show({ type: 'success', text1: 'Usuario Editado' });
        // Solo navegar si no es edición de perfil propio
        if (state.tipoAcceso && state.tipoAcceso !== "") {
            navigation.navigate("Home");
        }
    }, [updateState, navigation, state.tipoAcceso]);
    const loginExitoso: LoginExitosoFunction = useCallback(async (user: User) => {
        console.log(user);
        AsyncStorage.setItem('nombre', user.nombre || '');
        AsyncStorage.setItem('avatar', user.avatar ? JSON.stringify(user.avatar) : '');
        updateState({ cargando: false });
        Toast.show({ type: 'success', text1: 'Informacion guardado' });
        // Solo navegar si no es edición de perfil propio
        if (state.tipoAcceso && state.tipoAcceso !== "") {
            navigation.navigate("Home");
        }
    }, [updateState, navigation, state.tipoAcceso]);
};

export default VerPerfil; 
