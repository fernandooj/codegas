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
                    style={{ flex: 1 }}
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
                        && <View style={{ marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>
                                Comercial VEO
                            </Text>
                            <TouchableOpacity
                                onPress={() => accesoPerfil == "cliente" ? null : updateState({ modalCliente: true })}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: veo ? '#28a745' : '#e9ecef',
                                    shadowColor: veo ? 'rgba(40,167,69, .15)' : 'rgba(0,0,0, .1)',
                                    shadowOffset: { height: 2, width: 0 },
                                    shadowOpacity: .3,
                                    shadowRadius: 4,
                                    elevation: 3,
                                    paddingHorizontal: 16,
                                    paddingVertical: 16,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    minHeight: 56,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: veo ? '#28a745' : '#999',
                                        fontWeight: veo ? '600' : '400'
                                    }}>
                                        {veo || "Seleccionar VEO"}
                                    </Text>
                                    {veo && (
                                        <Text style={{
                                            fontSize: 12,
                                            color: '#28a745',
                                            marginTop: 2
                                        }}>
                                            VEO asignado
                                        </Text>
                                    )}
                                </View>
                                <View style={{
                                    backgroundColor: veo ? '#28a745' : '#f8f9fa',
                                    borderRadius: 8,
                                    padding: 8,
                                    borderWidth: 1,
                                    borderColor: veo ? '#28a745' : '#e9ecef'
                                }}>
                                    <FontAwesome
                                        name="chevron-down"
                                        size={14}
                                        color={veo ? '#fff' : '#666'}
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
                        && <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#00218b',
                                    paddingVertical: 16,
                                    paddingHorizontal: 24,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    shadowColor: 'rgba(0,0,0, .2)',
                                    shadowOffset: { height: 2, width: 0 },
                                    shadowOpacity: .3,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}
                                onPress={() => editarUsuario("editar")}
                            >
                                {cargando && <ActivityIndicator color="white" style={{ marginRight: 8 }} />}
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    {cargando ? "Guardando..." : "Actualizar Usuario"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* BOTONES DE ESTADO Y ACCIONES */}
                    {
                        (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                        && <View style={{
                            marginTop: 20,
                            marginBottom: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 12
                        }}>
                            {/* BOTON CAMBIAR ESTADO */}
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: activo ? "#dc3545" : "#28a745",
                                    paddingVertical: 14,
                                    paddingHorizontal: 16,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    shadowColor: activo ? 'rgba(220,53,69, .3)' : 'rgba(40,167,69, .3)',
                                    shadowOffset: { height: 2, width: 0 },
                                    shadowOpacity: .4,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}
                                onPress={() => cambiarEstadoUsuario()}
                            >
                                <FontAwesome
                                    name={activo ? "ban" : "check"}
                                    size={16}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: '600'
                                }}>
                                    {activo ? "Desactivar" : "Activar"}
                                </Text>
                            </TouchableOpacity>

                            {/* BOTON ELIMINAR */}
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: "#dc3545",
                                    paddingVertical: 14,
                                    paddingHorizontal: 16,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    shadowColor: 'rgba(220,53,69, .3)',
                                    shadowOffset: { height: 2, width: 0 },
                                    shadowOpacity: .4,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}
                                onPress={() => eliminarUsuario()}
                            >
                                <FontAwesome
                                    name="trash"
                                    size={16}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: '600'
                                }}>
                                    Eliminar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* BOTONES DE ACCIÓN PRINCIPALES */}
                    {
                        // Mostrar botones principales solo para perfil propio o modo crear/admin
                        (tipoAcceso === "" || (tipoAcceso === "admin" || tipoAcceso === "crear")) && (
                            <View style={{ marginTop: 30, marginBottom: 20 }}>
                                {/* BOTON GUARDAR/CREAR PRINCIPAL */}
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#00218b',
                                        paddingVertical: 16,
                                        paddingHorizontal: 24,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        marginBottom: 12,
                                        shadowColor: 'rgba(0,0,0, .2)',
                                        shadowOffset: { height: 2, width: 0 },
                                        shadowOpacity: .3,
                                        shadowRadius: 4,
                                        elevation: 4,
                                    }}
                                    onPress={() => tipoAcceso === "" ? handleSubmit("editar") : handleSubmit()}
                                >
                                    {cargando && <ActivityIndicator color="white" style={{ marginRight: 8 }} />}
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 16,
                                        fontWeight: '600'
                                    }}>
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
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 12,
                        marginTop: 12
                    }}>
                        {
                            (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "veo"))
                            && <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#fd7e14',
                                    paddingVertical: 14,
                                    paddingHorizontal: 16,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    shadowColor: 'rgba(253,126,20, .3)',
                                    shadowOffset: { height: 2, width: 0 },
                                    shadowOpacity: .4,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}
                                onPress={() => navigation.navigate("chart", { idUsuario })}
                            >
                                <FontAwesome
                                    name="bar-chart"
                                    size={16}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: '600'
                                }}>
                                    Ver Gráficos
                                </Text>
                            </TouchableOpacity>
                        }

                        {
                            (tipoAcceso === "editar" && (accesoPerfil === "admin" || accesoPerfil === "despacho"))
                            && <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#007bff',
                                    paddingVertical: 14,
                                    paddingHorizontal: 16,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    shadowColor: 'rgba(0,123,255, .3)',
                                    shadowOffset: { height: 2, width: 0 },
                                    shadowOpacity: .4,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}
                                onPress={() => navigation.navigate("puntos", { idUsuario })}
                            >
                                <FontAwesome
                                    name="clipboard"
                                    size={16}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: '600'
                                }}>
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
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    margin: 20,
                    maxHeight: '80%',
                    width: '90%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                }}>
                    {/* Header del Modal */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e9ecef'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333'
                        }}>
                            Seleccionar Zona
                        </Text>
                        <TouchableOpacity
                            onPress={() => updateState({ modalZona: false })}
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
                            placeholder="Buscar zona..."
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

                    {/* Lista de zonas */}
                    <ScrollView style={{ maxHeight: 300 }}>
                        {zonas
                            .filter(zona =>
                                terminoBuscador === '' ||
                                zona.nombre.toLowerCase().includes(terminoBuscador.toLowerCase())
                            )
                            .map((zona, key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => actualizaZona(zona._id, zona.nombre)}
                                    style={{
                                        padding: 15,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f1f3f4',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: idZona === zona._id ? '#e3f2fd' : '#fff'
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#333',
                                        flex: 1
                                    }}>
                                        {zona.nombre}
                                    </Text>
                                    {idZona === zona._id && (
                                        <FontAwesome
                                            name="check"
                                            size={18}
                                            color="#2196f3"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))
                        }
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
                            onPress={() => updateState({ modalZona: false })}
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
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                {modalZona ? modalZonas() : null}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    margin: 20,
                    maxHeight: '90%',
                    width: '90%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                }}>
                    {/* Header del Modal */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e9ecef'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333'
                        }}>
                            Ubicaciones de Entrega
                        </Text>
                        <TouchableOpacity
                            onPress={() => updateState({ modalUbicacion: false })}
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

                    {/* Contenido del Modal */}
                    <ScrollView style={{ maxHeight: 400 }} keyboardDismissMode="on-drag">
                        <View style={{ padding: 20 }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                marginBottom: 20,
                                lineHeight: 20
                            }}>
                                Si el pedido lo realizará el encargado del punto por favor inserta su información, de lo contrario solo inserta la dirección y zona
                            </Text>

                            {ubicaciones.map((ubicacion, key) => (
                                <View key={key} style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 8,
                                    padding: 15,
                                    marginBottom: 15,
                                    borderWidth: 1,
                                    borderColor: '#e9ecef'
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 10
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: '#333',
                                            flex: 1
                                        }}>
                                            Ubicación {key + 1}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => eliminarUbicacion(key)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                borderRadius: 12,
                                                width: 24,
                                                height: 24,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <FontAwesome name="trash" size={12} color="#fff" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Campos de la ubicación */}
                                    <View style={{ marginBottom: 15 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 }}>
                                            Dirección *
                                        </Text>
                                        <TextInput
                                            placeholder="Dirección"
                                            value={ubicacion.direccion ? ubicacion.direccion.toUpperCase() : ubicacion.direccion}
                                            onChangeText={direccion => actualizaArrayUbicacion("direccion", direccion, key)}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderWidth: 1,
                                                borderColor: '#e9ecef',
                                                borderRadius: 6,
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                fontSize: 14,
                                                color: '#333'
                                            }}
                                        />
                                    </View>

                                    <View style={{ marginBottom: 15 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 }}>
                                            Zona *
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#fff',
                                                borderWidth: 1,
                                                borderColor: '#e9ecef',
                                                borderRadius: 6,
                                                paddingHorizontal: 12,
                                                paddingVertical: 12,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                            onPress={() => updateState({ modalZona: true, key })}
                                        >
                                            <Text style={{ fontSize: 14, color: '#333', flex: 1 }}>
                                                {ubicacion.nombreZona || "Seleccionar zona"}
                                            </Text>
                                            <FontAwesome name="chevron-down" size={14} color="#666" />
                                        </TouchableOpacity>
                                    </View>

                                    <TextInput
                                        placeholder="Capacidad almacenamiento"
                                        value={ubicacion.capacidad}
                                        onChangeText={capacidad => actualizaArrayUbicacion("capacidad", capacidad, key)}
                                        style={{
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: '#e9ecef',
                                            borderRadius: 6,
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            fontSize: 14,
                                            color: '#333',
                                            marginBottom: 15
                                        }}
                                    />

                                    <TextInput
                                        placeholder="Observaciones ingreso del vehículo"
                                        onChangeText={observacion => actualizaArrayUbicacion("observacion", observacion, key)}
                                        style={{
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: '#e9ecef',
                                            borderRadius: 6,
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            fontSize: 14,
                                            color: '#333',
                                            marginBottom: 15
                                        }}
                                    />

                                    {(ubicacion.nuevo || ubicacion.idCliente) && (
                                        <>
                                            <TextInput
                                                placeholder="Email"
                                                value={ubicacion.email}
                                                onFocus={() => updateState({ activeScroll: true })}
                                                onBlur={() => updateState({ activeScroll: false })}
                                                onChangeText={emailUbicacion => actualizaArrayUbicacion("emailUbicacion", emailUbicacion, key)}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderWidth: 1,
                                                    borderColor: '#e9ecef',
                                                    borderRadius: 6,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 8,
                                                    fontSize: 14,
                                                    color: '#333',
                                                    marginBottom: 15
                                                }}
                                            />

                                            <TextInput
                                                placeholder="Celular"
                                                value={ubicacion.celular}
                                                onFocus={() => updateState({ activeScroll: true })}
                                                onBlur={() => updateState({ activeScroll: false })}
                                                onChangeText={celularUbicacion => actualizaArrayUbicacion("celularUbicacion", celularUbicacion, key)}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderWidth: 1,
                                                    borderColor: '#e9ecef',
                                                    borderRadius: 6,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 8,
                                                    fontSize: 14,
                                                    color: '#333',
                                                    marginBottom: 15
                                                }}
                                            />

                                            <TextInput
                                                placeholder="Nombre"
                                                value={ubicacion.nombre}
                                                onFocus={() => updateState({ activeScroll: true })}
                                                onBlur={() => updateState({ activeScroll: false })}
                                                onChangeText={nombreUbicacion => actualizaArrayUbicacion("nombreUbicacion", nombreUbicacion, key)}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderWidth: 1,
                                                    borderColor: '#e9ecef',
                                                    borderRadius: 6,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 8,
                                                    fontSize: 14,
                                                    color: '#333',
                                                    marginBottom: 15
                                                }}
                                            />
                                        </>
                                    )}
                                </View>
                            ))}

                            {/* Botón Agregar Ubicación */}
                            <TouchableOpacity
                                onPress={() => actualizaUbicacion()}
                                style={{
                                    backgroundColor: '#28a745',
                                    borderRadius: 8,
                                    padding: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 20
                                }}
                            >
                                <FontAwesome name="plus" size={16} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                    Agregar Ubicación
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Footer del Modal */}
                    <View style={{
                        flexDirection: 'row',
                        padding: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#e9ecef'
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#6c757d',
                                borderRadius: 8,
                                padding: 15,
                                marginRight: 10
                            }}
                            onPress={() => updateState({ modalUbicacion: false })}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#007bff',
                                borderRadius: 8,
                                padding: 15
                            }}
                            onPress={() => guardarUbicacion()}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
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
                const puntosParaCrear = puntosNuevos.map(punto => ({
                    observacion: punto.observacion || '',
                    direccion: punto.direccion,
                    capacidad: punto.capacidad || 0,
                    punto: punto.capacidad || 0,
                    location: punto.location || null,
                    place_name: punto.place_name || null,
                    idZona: punto.idZona,
                    idCliente: idUsuario,
                    idPadre: null
                }));

                console.log('Creando puntos nuevos:', puntosParaCrear);
                const resultCreate = await createPoints(puntosParaCrear);
                console.log('Resultado crear puntos:', resultCreate);
            }

            // Preparar datos para actualizar puntos existentes
            if (puntosExistentes.length > 0) {
                const puntosParaActualizar = puntosExistentes.map(punto => ({
                    _id: punto._id,
                    observacion: punto.observacion || '',
                    direccion: punto.direccion,
                    capacidad: punto.capacidad || 0,
                    location: punto.location || null,
                    place_name: punto.place_name || null,
                    idZona: punto.idZona,
                    idCliente: idUsuario,
                    idPadre: null
                }));

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
                    style={{
                        backgroundColor: '#dc3545',
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 10
                    }}
                    disabled={showLoading}
                >
                    {showLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
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
        console.log({ razon_social, cedula, direccion_factura, nombre, email, tipo, celular, tipo, acceso, codt, imagen, ubicaciones, valorUnitario })
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
