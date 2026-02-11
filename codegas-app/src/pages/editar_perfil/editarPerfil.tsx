import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ImageBackground, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './style';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { DataContext } from "../../context/context"
import { getZonas } from '../../redux/actions/zonaActions';
import auth from '@react-native-firebase/auth';
import Footer from '../components/footer';
import ModalVeos from './ModalVeos';
import ModalUbicacion from './ModalUbicacion';
import FormPass from './FormPass';
import PerfilForm from './PerfilForm';
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
    uploadAvatar,
    updateUid
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
    const context = useContext(DataContext) as ContextType;
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
                activo: true,
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
        selectedUbicacionKey: 0,
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


    const updateState: UpdateStateFunction = useCallback((updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    }, []);
    useEffect(() => {
        const initializeData = async () => {
            const { acceso: accesoPerfil, userId } = context;
            const { accesoDefault } = route?.params || {};

            console.log('🔧 DEBUG - Inicializando datos:', {
                accesoPerfil,
                accesoDefault,
                routeParams: route?.params
            });

            let acceso;
            if (accesoDefault) {
                // Si se pasa un valor por defecto desde la navegación, usarlo
                acceso = accesoDefault;
                console.log('🔧 DEBUG - Usando accesoDefault:', acceso);
            } else {
                // Lógica original
                acceso = accesoPerfil == 'despacho' ? 'cliente' :
                    accesoPerfil == 'admin' ? 'admin' : 'usuario';
                console.log('🔧 DEBUG - Usando lógica original:', acceso);
            }

            console.log('🔧 DEBUG - Valor final de acceso:', acceso);
            updateState({ accesoPerfil, acceso, userId });

            // Cargar zonas
            try {
                const result = await dispatch(getZonas() as any);
            } catch (error) {
                console.error('Error loading zonas:', error);
            }

            // Cargar VEOs
            try {
                const veosResult = await getVeos(100, 0, 'undefined', userId);

                if (veosResult && veosResult.user) {
                    // Función para transformar recursivamente los VEOs y sus children
                    const transformarVeoRecursivamente = (veo: any, index: number): any => ({
                        key: veo._id || index.toString(),
                        _id: veo._id || index.toString(),
                        label: veo.nombre || 'Sin nombre',
                        idPadre: veo.idPadre || null,
                        email: veo.email || null,
                        children: veo.children && veo.children.length > 0
                            ? veo.children.map((child: any, childIndex: number) =>
                                transformarVeoRecursivamente(child, childIndex)
                            )
                            : []
                    });

                    // Transformar los datos al formato esperado por el modal, PRESERVANDO los children del backend
                    const veosFormatted = veosResult.user.map((veo: any, index: number) =>
                        transformarVeoRecursivamente(veo, index)
                    );


                    // Mostrar algunos ejemplos para debugging
                    veosFormatted.slice(0, 3).forEach((veo: any) => {
                    });

                    updateState({ veos: veosFormatted });
                }
            } catch (error) {
                console.error('Error loading VEOs:', error);
            }

            const params = route?.params;

            if (params?.tipoAcceso) {
                updateState({ tipoAcceso: params.tipoAcceso });
                if (params.tipoAcceso == "solucion") {
                    updateState({ acceso: "cliente" });
                }
                // Si es crear desde clientes, establecer como cliente
                // PERO solo si no se especificó un accesoDefault
                if (params.tipoAcceso == "crear" && !(params as any).accesoDefault) {
                    updateState({ acceso: "cliente" });
                }
            }

            if (!params?.tipoAcceso) {
                try {
                    // Validar que userId no sea null antes de hacer la llamada
                    if (!userId || userId === null || userId === undefined || userId === 'undefined' || userId === 'null' || userId.toString().trim() === '') {
                        console.log('userId is null or invalid, skipping getUserById call');
                        return;
                    }

                    const e = await getUserById(userId);
                    const { user } = e;
                    console.log('user', user);
                    // Usar userId del contexto cuando se edita perfil propio, no params.idUsuario
                    let ubicaciones = [];
                    if (userId && userId !== null && userId !== undefined && userId !== 'undefined' && userId !== 'null' && userId.toString().trim() !== '') {
                        const ubi = await getPointsByClient(userId);
                        ubicaciones = ubi.status ? ubi.puntos : [];

                        // Mapear las ubicaciones para asegurar que todos los campos estén correctamente asignados
                        ubicaciones = ubicaciones.map((data: any) => {
                            let data1 = userId;
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
                                    activo: data.activo !== undefined ? data.activo : true,
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
                                    activo: data.activo !== undefined ? data.activo : true,
                                    _id: data._id
                                };
                            }
                        });
                    } else {
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
                        valorUnitario: user.valorUnitario ? user.valorUnitario : '',
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
                        const ubi = await getPointsByClient(params.idUsuario);
                        ubicaciones = ubi.status ? ubi.puntos : [];
                    } else {
                    }

                    ubicaciones = ubicaciones.map((data: any) => {
                        console.log('ubicaciones22', data);
                        let data1 = params.idUsuario;
                        let data2 = data.idCliente;
                        if (data1 === data2) {
                            return {
                                direccion: data.direccion,
                                email: undefined,
                                idCliente: undefined,
                                idZona: data.idzona,
                                nombre: undefined,
                                celular: undefined,
                                nombreZona: data.nombrezona,
                                observacion: data.observacion,
                                capacidad: data.capacidad,
                                lat: data.lat?.toString() || '',
                                lng: data.lng?.toString() || '',
                                activo: data.activo !== undefined ? data.activo : true,
                                _id: data._id
                            };
                        } else {
                            return {
                                direccion: data.direccion,
                                email: data.email,
                                idCliente: data.idCliente,
                                idZona: data.idzona,
                                nombre: data.nombre,
                                celular: data.celular,
                                nombreZona: data.nombrezona,
                                observacion: data.observacion,
                                capacidad: data.capacidad,
                                lat: data.lat?.toString() || '',
                                lng: data.lng?.toString() || '',
                                activo: data.activo !== undefined ? data.activo : true,
                                _id: data._id
                            };
                        }
                    });

                    console.log('ubicaciones11', ubicaciones);
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
                        valorUnitario: user.valorunitario ? user.valorunitario : '',
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
        const { razon_social, cedula, ubicaciones, direccion_factura, nombre, email, celular, tipo, acceso, codt, imagen, editaAvatar, idUsuario, ubicacionesEliminadas, editado, codMagister, valorUnitario, idVeo } = state;
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
            .then(async (e) => {

                // Asignar VEO si se ha seleccionado uno
                if (idVeo && idVeo !== '') {
                    try {
                        await assignCommercial(idUsuario, idVeo);
                    } catch (error) {
                        console.error('Error al asignar VEO durante actualización:', error);
                        Toast.show({
                            type: 'error',
                            text1: 'Error al asignar VEO',
                            text2: 'Usuario actualizado pero no se pudo asignar el comercial'
                        });
                    }
                }

                if (acceso === "cliente") {
                    ////////////////////////////////////////////        EDITO LOS CLIENTES
                    if (clientes.length > 0) {

                        updateMultipleUsers(clientes, idUsuario, e.user.nombre)
                            .then(res => {
                                // Solo guardar nombre si es el perfil propio
                                if (!state.tipoAcceso || state.tipoAcceso === "") {
                                    AsyncStorage.setItem('nombre', e.user.nombre)
                                }
                                Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                                setTimeout(() => {
                                    // Navegar según el tipo de acceso del usuario editado
                                    const destinoNavegacion = acceso === 'cliente' ? 'clientes' : 'usuarios';
                                    navigation.navigate(destinoNavegacion, {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                                updateState({ cargando: false })
                            })
                            .catch(err2 => {
                                updateState({ cargando: false })
                            })
                    }
                    ////////////////////////////////////////////        INSERTO LOS CLIENTES
                    if (clientesNuevos.length > 0) {
                        createMultipleUsers(clientesNuevos, idUsuario, e.user.nombre)
                            .then(res => {
                                // Solo guardar nombre si es el perfil propio
                                if (!state.tipoAcceso || state.tipoAcceso === "") {
                                    AsyncStorage.setItem('nombre', e.user.nombre)
                                }
                                Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                                setTimeout(() => {
                                    // Navegar según el tipo de acceso del usuario editado
                                    const destinoNavegacion = acceso === 'cliente' ? 'clientes' : 'usuarios';
                                    navigation.navigate(destinoNavegacion, {
                                        scrollPosition: route?.params?.scrollPosition || 0
                                    });
                                }, 1500);
                                updateState({ cargando: false })
                            })
                            .catch(err2 => {
                                updateState({ cargando: false })
                            })
                    }

                    AsyncStorage.setItem('nombre', e.user.nombre || '')
                    AsyncStorage.setItem('email', e.user.email || '')

                    // Actualizar contexto en tiempo real
                    if (context.updateUserData) {
                        context.updateUserData({
                            nombre: e.user.nombre,
                            email: e.user.email,
                            avatar: e.user.avatar
                        });
                    } else {
                    }

                    Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })

                    // Solo navegar si venimos de la lista de clientes (tipoAcceso === "editar")
                    if (state.tipoAcceso === "editar") {
                        setTimeout(() => {
                            // Navegar según el tipo de acceso del usuario editado
                            const destinoNavegacion = acceso === 'cliente' ? 'clientes' : 'usuarios';
                            navigation.navigate(destinoNavegacion, {
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
                    // Solo actualizar AsyncStorage y contexto si es el perfil propio
                    if (!state.tipoAcceso || state.tipoAcceso === "") {
                        // Es perfil propio
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
                    }

                    if (editaAvatar) {
                        if (imagen.length === 0) {
                            Toast.show({ type: 'success', text1: 'Usuario editado con éxito' })
                            // Solo navegar si venimos de la lista de clientes (tipoAcceso === "editar")
                            if (state.tipoAcceso === "editar") {
                                setTimeout(() => {
                                    // Navegar según el tipo de acceso del usuario editado
                                    const destinoNavegacion = acceso === 'cliente' ? 'clientes' : 'usuarios';
                                    navigation.navigate(destinoNavegacion, {
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
                                // Navegar según el tipo de acceso del usuario editado
                                const destinoNavegacion = acceso === 'cliente' ? 'clientes' : 'usuarios';
                                navigation.navigate(destinoNavegacion, {
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
                updateState({ cargando: false });
            })
    }, [state.razon_social, state.cedula, state.ubicaciones, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.imagen, state.editaAvatar, state.idUsuario, state.ubicacionesEliminadas, state.editado, state.codMagister, state.valorUnitario, state.idVeo, updateState, navigation]);


    const cambiarValorUnitario: CambiarValorUnitarioFunction = useCallback(() => {
        // Esta función ya no hace nada automáticamente
        // El valor unitario se actualizará cuando se presione el botón "Actualizar Usuario"
    }, []);
    const verificaEmail: VerificaEmailFunction = useCallback(() => {
        let { email } = state;
        checkEmail(email)
            .then((res: any) => {
                if (res.data && res.data.status === "SUCCESS") {
                    Toast.show({ type: 'error', text1: 'Este email ya existe!' })
                }
            })
            .catch(err => {
                // Email no existe, está bien
            })
    }, [state.email]);
    const asignarVeo: AsignarVeoFunction = useCallback((idVeo: string) => {
        const { veos } = state;
        console.log('🔍 asignarVeo - idVeo recibido:', idVeo);
        console.log('🔍 asignarVeo - veos disponibles:', veos);

        // Función recursiva para buscar VEO en todos los niveles
        const buscarVeoRecursivamente = (veosArray: any[], targetKey: string): any => {
            for (let veo of veosArray) {
                // Comparar keys como strings
                if (String(veo.key) === String(targetKey)) {
                    return veo;
                }
                // Buscar recursivamente en children
                if (veo.children && veo.children.length > 0) {
                    const encontrado = buscarVeoRecursivamente(veo.children, targetKey);
                    if (encontrado) {
                        return encontrado;
                    }
                }
            }
            return null;
        };

        const veoEncontrado = buscarVeoRecursivamente(veos, idVeo);

        console.log('🔍 asignarVeo - veo encontrado:', veoEncontrado);

        if (veoEncontrado) {
            console.log('🔍 asignarVeo - VEO encontrado:', veoEncontrado);
            console.log('🔍 asignarVeo - label del VEO:', veoEncontrado.label);

            // Solo actualizar el estado local
            // La asignación real se hace cuando se presiona "Actualizar Usuario"
            updateState({ veo: veoEncontrado.label, modalCliente: false, idVeo });
        } else {
            console.log('❌ asignarVeo - VEO no encontrado con idVeo:', idVeo);
            console.log('❌ asignarVeo - Keys disponibles:', veos.map(v => v.key));

            // Mostrar error al usuario
            Alert.alert('Error', 'No se pudo encontrar el VEO seleccionado. Inténtalo de nuevo.');
        }
    }, [state.veos, updateState]);
    const eliminarUsuario: EliminarUsuarioFunction = useCallback(() => {
        const { nombre, idUsuario } = state;
        Alert.alert(
            'Seguro desea eliminar',
            `al usuario ${nombre}`,
            [
                { text: 'Confirmar', onPress: () => confirmar() },
            ],
            { cancelable: false }
        );
        const confirmar = () => {
            deleteUser(idUsuario)
                .then(res => {
                    if (res.status) {
                        Toast.show({ type: 'success', text1: 'Usuario eliminado con éxito' });
                        setTimeout(() => {
                            // Navegar según el tipo de acceso del usuario eliminado
                            const destinoNavegacion = state.acceso === 'cliente' ? 'clientes' : 'usuarios';
                            navigation.navigate(destinoNavegacion, {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                    }
                })
                .catch(err => {
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
            ],
            { cancelable: false }
        );
        const confirmar = () => {
            changeUserStatus(idUsuario, !activo)
                .then(res => {
                    if (res.status) {
                        Toast.show({ type: 'success', text1: `Usuario ${!activo ? 'activado' : 'desactivado'} con éxito` });
                        setTimeout(() => {
                            // Navegar según el tipo de acceso del usuario
                            const destinoNavegacion = state.acceso === 'cliente' ? 'clientes' : 'usuarios';
                            navigation.navigate(destinoNavegacion, {
                                scrollPosition: route?.params?.scrollPosition || 0
                            });
                        }, 1500);
                    }
                })
                .catch(err => {
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
            activo: true,
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
                                    : type == 'activo'
                                        ? (ubicaciones[key].activo = value === "true")
                                        : (ubicaciones[key].nombre = value);
        updateState({ ubicaciones });
    }, [state.ubicaciones, updateState]);

    const actualizaZona: ActualizaZonaFunction = useCallback((id: string, nombre: string) => {
        const { key, ubicaciones } = state;
        ubicaciones[key].idZona = id;
        ubicaciones[key].nombreZona = nombre;
        updateState({ ubicaciones, modalZona: false });
    }, [state.key, state.ubicaciones, updateState]);





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
                        activo: punto.activo !== undefined ? punto.activo : true,
                        idZona: punto.idZona,
                        idCliente: idUsuario,
                        idPadre: null,
                        email: punto.email || null,
                        celular: punto.celular || null,
                        nombre: punto.nombre || null
                    };
                });

                const resultCreate = await createPoints(puntosParaCrear);
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
                        activo: punto.activo !== undefined ? punto.activo : true,
                        idZona: punto.idZona,
                        idCliente: idUsuario,
                        idPadre: null,
                        email: punto.email || null,
                        celular: punto.celular || null,
                        nombre: punto.nombre || null
                    };
                });

                const resultUpdate = await updatePoints(puntosParaActualizar);
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
                })
        }
    }, [state.email, state.password, state.confirmar, navigation]);

    const renderFormPass = useCallback(() => {
        const { password, confirmar, showLoading, cargando } = state;
        return (
            <FormPass
                password={password}
                confirmar={confirmar}
                showLoading={showLoading}
                cargando={cargando}
                onUpdatePassword={(password) => updateState({ password })}
                onUpdateConfirmar={(confirmar) => updateState({ confirmar })}
                onSubmit={cambiarPass}
            />
        );
    }, [state.password, state.confirmar, state.showLoading, state.cargando, updateState, cambiarPass]);
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
        if (acceso === "cliente") {
            if (razon_social == "" || direccion_factura == "" || nombre == "" || email == "" || tipo == "" || ubicaciones.length < 1) {
                Alert.alert(
                    'Todos los campos son obligatorios',
                    '',
                    [
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
    // Función para crear usuario en Firebase Authentication
    const createFirebaseUser = async (email: string, password: string, displayName: string) => {
        try {
            // Guardar información del usuario actual antes de crear el nuevo
            const currentUser = auth().currentUser;
            const currentUserEmail = currentUser?.email || null;
            const currentUserUid = currentUser?.uid || null;

            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({
                displayName: displayName,
            });

            // Actualizar el UID en la base de datos
            try {
                await updateUid(email, userCredential.user.uid);
                console.log('✅ UID actualizado en la base de datos:', userCredential.user.uid);
            } catch (uidError) {
                console.error('⚠️ Error al actualizar UID en la base de datos:', uidError);
                // No fallar la creación si no se puede actualizar el UID
            }

            // IMPORTANTE: Siempre cerrar sesión del nuevo usuario creado
            // createUserWithEmailAndPassword automáticamente inicia sesión con el nuevo usuario,
            // lo cual activa onAuthStateChanged y puede interferir con la sesión del usuario original
            await auth().signOut();

            // Si había un usuario original autenticado, necesitamos restaurar su sesión
            // Sin embargo, no tenemos su contraseña, así que el usuario original necesitará
            // volver a iniciar sesión manualmente si es necesario para funcionalidades de Firebase
            // Pero esto NO afecta el inicio de sesión normal del sistema principal

            return {
                success: true,
                uid: userCredential.user.uid,
                user: userCredential.user
            };
        } catch (error: any) {
            console.error('Error al crear usuario en Firebase:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

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

        // Generar contraseña aleatoria más segura (mínimo 8 caracteres)
        const generateSecurePassword = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let password = '';
            for (let i = 0; i < 8; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };
        const generatedPassword = generateSecurePassword();

        signUp({
            razon_social,
            cedula,
            direccion_factura,
            nombre,
            email,
            celular,
            tipo,
            acceso,
            codt,
            puntos,
            codMagister,
            valorUnitario,
            pass: generatedPassword,
            uid: null,
            descuento: null,
            tokenPhone: null,
            codigoRegistro: null,
            idPadre: idVeo || null
        })
            .then(async (e) => {
                if (e.status) {
                    // Asignar VEO si se ha seleccionado uno
                    if (idVeo && idVeo !== '') {
                        try {
                            await assignCommercial(e.user._id, idVeo);
                        } catch (error) {
                            console.error('Error al asignar VEO durante creación:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error al asignar VEO',
                                text2: 'Usuario creado pero no se pudo asignar el comercial'
                            });
                        }
                    }

                    if (acceso === "cliente") {
                        if (clientes.length > 0) {
                            createMultipleUsers(clientes, e.user._id, e.user.nombre)
                                .then(async (res) => {
                                    // Crear usuario en Firebase después de crear clientes múltiples
                                    const firebaseResult = await createFirebaseUser(
                                        email.toLowerCase().trim(),
                                        generatedPassword,
                                        nombre
                                    );

                                    if (!firebaseResult.success) {
                                        console.error('Error al crear usuario en Firebase:', firebaseResult.error);
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Usuario creado en sistema',
                                            text2: 'Error al crear en Firebase: ' + firebaseResult.error
                                        });
                                    } else {
                                        Toast.show({
                                            type: 'success',
                                            text1: 'Usuario creado exitosamente',
                                            text2: 'Creado en sistema y Firebase'
                                        });
                                    }

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

                                    // Abrir automáticamente el modal de ubicaciones para agregar puntos de entrega
                                    setTimeout(() => {
                                        updateState({
                                            modalUbicacion: true,
                                            idUsuario: e.user._id,
                                            cargando: false
                                        });
                                    }, 1500);

                                })
                                .catch(err2 => {
                                    updateState({ cargando: false })
                                })
                        } else {
                            // No hay clientes nuevos, crear usuario en Firebase y abrir modal de ubicaciones
                            const firebaseResult = await createFirebaseUser(
                                email.toLowerCase().trim(),
                                generatedPassword,
                                nombre
                            );

                            if (!firebaseResult.success) {
                                console.error('Error al crear usuario en Firebase:', firebaseResult.error);
                                Toast.show({
                                    type: 'error',
                                    text1: 'Usuario creado en sistema',
                                    text2: 'Error al crear en Firebase: ' + firebaseResult.error
                                });
                            } else {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Usuario creado exitosamente',
                                    text2: 'Creado en sistema y Firebase'
                                });
                            }

                            // Abrir automáticamente el modal de ubicaciones para agregar puntos de entrega
                            setTimeout(() => {
                                updateState({
                                    modalUbicacion: true,
                                    idUsuario: e.user._id,
                                    cargando: false
                                });
                            }, 1500);
                        }
                    } else {
                        // Crear usuario en Firebase para usuarios no cliente
                        const firebaseResult = await createFirebaseUser(
                            email.toLowerCase().trim(),
                            generatedPassword,
                            nombre
                        );

                        if (!firebaseResult.success) {
                            console.error('Error al crear usuario en Firebase:', firebaseResult.error);
                            Toast.show({
                                type: 'error',
                                text1: 'Usuario creado en sistema',
                                text2: 'Error al crear en Firebase: ' + firebaseResult.error
                            });
                        } else {
                            Toast.show({
                                type: 'success',
                                text1: 'Usuario creado exitosamente',
                                text2: 'Creado en sistema y Firebase'
                            });
                        }

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
                            setTimeout(() => {
                                navigation.navigate("Home")
                            }, 1500);
                        }

                        updateState({ cargando: false });

                        // Nota: Las imágenes se manejarán posteriormente si es necesario
                        // No intentar subir avatar inmediatamente después de crear usuario
                    }
                } else {
                    updateState({ cargando: false });
                    Toast.show({ type: 'error', text1: 'Este email ya existe' })
                }
            })
            .catch(err => {
                updateState({ cargando: false });
            })
    }, [state.razon_social, state.cedula, state.direccion_factura, state.nombre, state.email, state.celular, state.tipo, state.acceso, state.codt, state.ubicaciones, state.imagen, state.codMagister, state.valorUnitario, state.idVeo, updateState, navigation, createFirebaseUser, context.updateUserData]);

    const edicionExitosa: EdicionExitosaFunction = useCallback(async (nombre: string) => {
        updateState({ cargando: false });
        Toast.show({ type: 'success', text1: 'Usuario Editado' });
        // Solo navegar si no es edición de perfil propio
        if (state.tipoAcceso && state.tipoAcceso !== "") {
            navigation.navigate("Home");
        }
    }, [updateState, navigation, state.tipoAcceso]);
    const loginExitoso: LoginExitosoFunction = useCallback(async (user: User) => {
        // Solo guardar en AsyncStorage si es el perfil propio (no tipoAcceso o tipoAcceso vacío)
        if (!state.tipoAcceso || state.tipoAcceso === "") {
            AsyncStorage.setItem('nombre', user.nombre || '');
            AsyncStorage.setItem('avatar', user.avatar ? JSON.stringify(user.avatar) : '');
        }
        updateState({ cargando: false });
        Toast.show({ type: 'success', text1: 'Informacion guardado' });
        // Solo navegar si no es edición de perfil propio
        if (state.tipoAcceso && state.tipoAcceso !== "") {
            navigation.navigate("Home");
        }
    }, [updateState, navigation, state.tipoAcceso]);

    const renderPerfil = useCallback(() => {
        const { razon_social, cedula, direccion_factura, email, nombre, celular, tipo, acceso, codt, valorUnitario, codMagister, imagen, ubicaciones, veo, activo, cargando, tipoAcceso, accesoPerfil, idUsuario, veos } = state;
        console.log('valorUnitario11', valorUnitario);
        return (
            <PerfilForm
                razon_social={razon_social}
                cedula={cedula}
                direccion_factura={direccion_factura}
                email={email}
                nombre={nombre}
                celular={celular}
                tipo={tipo}
                acceso={acceso}
                codt={codt}
                valorUnitario={valorUnitario}
                codMagister={codMagister}
                imagen={imagen}
                ubicaciones={ubicaciones as any}
                veo={veo}
                activo={activo}
                cargando={cargando}
                tipoAcceso={tipoAcceso}
                accesoPerfil={accesoPerfil}
                idUsuario={idUsuario}
                veos={veos as any}
                scrollEnabled={!(state.modalUbicacion || state.modalZona || state.modalCliente)}
                onUpdateState={updateState}
                onVerificaEmail={verificaEmail}
                onEditarUsuario={() => editarUsuario("editar")}
                onCambiarEstadoUsuario={cambiarEstadoUsuario}
                onEliminarUsuario={eliminarUsuario}
                onHandleSubmit={handleSubmit}
                onNavigate={navigation.navigate}
            />
        );
    }, [state, updateState, verificaEmail, editarUsuario, cambiarEstadoUsuario, eliminarUsuario, handleSubmit, navigation]);

    const { modalUbicacion: showModalUbicacion, modalCliente, modalZona, showPass, terminoBuscador, idZona, activeScroll, selectedUbicacionKey } = state;

    return (
        <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
            {/* Modal de VEOs */}
            <ModalVeos
                visible={modalCliente}
                veos={state.veos as any}
                terminoBuscador={terminoBuscador}
                idVeo={state.idVeo}
                onClose={() => updateState({ modalCliente: false })}
                onSelectVeo={asignarVeo}
                onUpdateTermino={(termino) => updateState({ terminoBuscador: termino })}
            />

            {/* Modal de Ubicaciones */}
            <ModalUbicacion
                visible={showModalUbicacion}
                ubicaciones={state.ubicaciones as any}
                modalZona={modalZona}
                zonas={zonas}
                idZona={idZona}
                terminoBuscador={terminoBuscador}
                activeScroll={activeScroll}
                selectedUbicacionKey={selectedUbicacionKey}
                onClose={() => updateState({ modalUbicacion: false })}
                onSave={guardarUbicacion}
                onAddUbicacion={actualizaUbicacion}
                onDeleteUbicacion={eliminarUbicacion}
                onUpdateUbicacion={actualizaArrayUbicacion}
                onOpenZonas={(key) => updateState({ modalZona: true, key, selectedUbicacionKey: key })}
                onCloseZonas={() => updateState({ modalZona: false })}
                onSelectZona={actualizaZona}
                onUpdateTermino={(termino) => updateState({ terminoBuscador: termino })}
                onUpdateActiveScroll={(active) => updateState({ activeScroll: active })}
            />

            {/* Formulario principal */}
            {
                showPass
                    ? renderFormPass()
                    : renderPerfil()
            }
            <Footer navigation={navigation} />
            <Toast />
        </ImageBackground>
    );
};

export default VerPerfil; 
