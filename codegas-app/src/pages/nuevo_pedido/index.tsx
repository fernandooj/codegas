import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, ImageBackground, Image, Alert, ScrollView, Animated, Clipboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios'
import moment from 'moment'
import ModalSelector from 'react-native-modal-selector'
import { Calendar } from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text'
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../../context/context"
import { getUsuarios, getPointsByClient } from '../../redux/actions/usuarioActions'
import { GET_USUARIOS } from '../../redux/actions/constants/actionsTypes'
import { verificarPedidoHoy, crearPedido, notificarClienteInactivo } from '../../redux/actions/pedidoActions'
import Footer from '../components/footer'
import HeaderLogo from '../../components/HeaderLogo'
import { style } from './style'
import SeleccionarGrupoFrecuenciaModal from './SeleccionarGrupoFrecuenciaModal'
import { GrupoFrecuencia } from '../frecuencia/types'

import { frecuencias, dias, diasN, dia1, dia2, intervalosSemanas } from '../../utils/pedido_info'
import {
    NuevoPedidoProps,
    NuevoPedidoState,
    Cliente,
    PuntoEntrega,
    PedidoData,
    VerificacionPedidoResponse,
    CrearPedidoResponse,
    PuntosPorClienteResponse,
    FormaPedido,
    FrecuenciaPedido,
    DiaSemana,
    AccesoUsuario,
    ModalSelectorOption,
    CalendarDay,
    MarkedDates,
    DataContextType,
    RootState,
    TextInputMaskRef,
    VerificacionPedidoParams,
    CrearPedidoParams,
    GetPuntosParams,
    GetClientesParams,
    PedidoExistente
} from './types'

const Nuevo_pedido: React.FC<NuevoPedidoProps> = ({ navigation }) => {
    const context = useContext(DataContext) as DataContextType;
    const { acceso, userId: idUsuario, email, nombre } = context;
    const dispatch = useDispatch();
    const campoMonto = useRef<TextInputMaskRef>(null);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [buscandoClientes, setBuscandoClientes] = useState(false);

    // Estados para animaciones del modal
    const [modalAnimation] = useState(new Animated.Value(0));
    const [overlayAnimation] = useState(new Animated.Value(0));

    // Selector de Redux para obtener los clientes
    const clientes = useSelector((state: RootState) => state.usuario.usuarios || []);
    const usuariosAcceso = useSelector((state: RootState) => state.usuario.usuariosAcceso || []);

    const [state, setState] = useState<NuevoPedidoState>({
        imagen: [],
        terminoBuscador: "",
        inicio: 0,
        final: 7,
        categoriaUser: [],
        clientes: [],
        puntos: [],
        modalCliente: false,
        modalFechaEntrega: true,
        email: '',
        nombre: '',
        acceso: '',
        usuarios: [],
        showRenderUsuarios: false,
        showClientes: false,
        showFrecuencia: false,
        showFechaEntrega: false,
        tipoFrecuencia: null, // 'grupo' o 'manual'
        grupoFrecuenciaId: null,
        forma: null,
        cantidad: '',
        frecuencia: null,
        diaSeleccionado1: null,
        diaSeleccionado2: null,
        intervaloSemanas: null,
        diaMes: null,
        diaSemanaMensual: null,
        franja: null,
        idCliente: null,
        cliente: null,
        emailCliente: '',
        puntoId: null,
        solicitud: false,
        fechaSolicitud: '',
        novedad: '',
        guardando: false,
        idUsuario: null,
        showPedidosExistentes: false,
        pedidosExistentes: []
    });

    // Estado separado para manejar el modal de pedidos existentes
    const [modalData, setModalData] = useState<{
        show: boolean;
        pedidos: PedidoExistente[];
    }>({
        show: false,
        pedidos: []
    });

    // Estado para el modal de error
    const [errorModal, setErrorModal] = useState<{
        show: boolean;
        message: string;
    }>({
        show: false,
        message: ''
    });

    // Estado para grupos de frecuencias
    const [gruposFrecuencias, setGruposFrecuencias] = useState<any[]>([]);
    const [showSelectGrupoModal, setShowSelectGrupoModal] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState<GrupoFrecuencia | null>(null);

    useEffect(() => {
        if (!nombre && idUsuario) {
            navigation.navigate("verPerfil", { tipoAcceso: null });
        }

        setState(prev => ({ ...prev, idUsuario, acceso, email, nombre }));

        if (acceso === 'cliente') {
            getPuntos(idUsuario);
        }

        // Solo cargar usuarios si no es cliente
        if (acceso !== 'cliente') {
            // Usar la misma lógica que en clientes: cargar usuarios con acceso 'cliente'
            const action = getUsuarios(100, 0, 'cliente', '', idUsuario);
            if (action && typeof action === 'function') {
                dispatch(action);
            }
        }
    }, [context, navigation, dispatch, acceso, idUsuario, nombre]);

    // Efecto para animaciones del modal
    useEffect(() => {
        if (state.showClientes) {
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
    }, [state.showClientes]);

    const getPuntos = async (id: string): Promise<void> => {
        try {
            const response = await getPointsByClient(id) as PuntosPorClienteResponse;
            if (response.status) {
                if (response.puntos.length === 1) {
                    setState(prev => ({
                        ...prev,
                        puntos: response.puntos,
                        puntoId: response.puntos[0]._id
                    }));
                } else {
                    setState(prev => ({ ...prev, puntos: response.puntos }));
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Tuvimos un problema',
                    text2: 'intentele mas tarde'
                });
            }
        } catch (error) {
            console.error('Error fetching puntos:', error);
            Toast.show({
                type: 'error',
                text1: 'Error al cargar puntos',
                text2: 'Intente más tarde'
            });
        }
    };

    const rankCliente = (cliente: Cliente, termino: string): number => {
        const t = termino.trim().toLowerCase();
        if (!t) return 0;
        const nombreCli = (cliente.nombre || '').toLowerCase();
        const razon = (cliente.razon_social || '').toLowerCase();
        const codt = (cliente.codt || '').toLowerCase();
        let score = 0;
        if (cliente.activo) score += 1000;
        if (codt === t) score += 500;
        if (razon === t || nombreCli === t) score += 400;
        if (codt.startsWith(t)) score += 300;
        if (razon.startsWith(t) || nombreCli.startsWith(t)) score += 200;
        if (razon.includes(t) || nombreCli.includes(t) || codt.includes(t)) score += 100;
        return score;
    };

    const getClientes = (searchTerm?: string): void => {
        const { idUsuario, acceso } = state;
        const termino = (searchTerm ?? state.terminoBuscador).trim();

        // Si el acceso es cliente, no debe llamar a ningún endpoint de usuarios
        if (acceso === 'cliente') {
            Toast.show({
                type: 'info',
                text1: 'Los clientes no pueden buscar otros usuarios',
                text2: 'Solo pueden crear pedidos para sí mismos'
            });
            return;
        }

        if (termino.length < 3) {
            return;
        }

        setBuscandoClientes(true);
        const action = getUsuarios(40, 0, 'cliente', termino, idUsuario);
        if (action && typeof action === 'function') {
            Promise.resolve(dispatch(action as any))
                .catch(() => undefined)
                .finally(() => setBuscandoClientes(false));
        } else {
            setBuscandoClientes(false);
        }
    };

    const handleBuscadorClientesChange = (texto: string): void => {
        setState(prev => ({ ...prev, terminoBuscador: texto }));

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = null;
        }

        const termino = texto.trim();
        if (termino.length < 3) {
            setBuscandoClientes(false);
            setState(prev => ({ ...prev, showRenderUsuarios: false }));
            dispatch({ type: GET_USUARIOS, usuarios: [] });
            return;
        }

        setState(prev => ({ ...prev, showRenderUsuarios: true }));
        searchDebounceRef.current = setTimeout(() => {
            getClientes(termino);
        }, 350);
    };

    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);

    const renderUsuarios = (): React.JSX.Element[] => {
        const termino = state.terminoBuscador || '';
        const clientesOrdenados = [...clientes].sort(
            (a, b) => rankCliente(b, termino) - rankCliente(a, termino)
        );

        return clientesOrdenados.map((e: Cliente, key: number) => {
            const isInactive = !e.activo;
            return (
                <TouchableOpacity
                    key={key}
                    style={[
                        style.clienteCard,
                        isInactive && style.clienteCardInactive
                    ]}
                    onPress={() => filtroClientes(e)}
                    activeOpacity={0.7}
                >
                    <View style={style.clienteCardContent}>
                        {/* Avatar placeholder */}
                        <View style={[
                            style.clienteAvatar,
                            isInactive && style.clienteAvatarInactive
                        ]}>
                            <FontAwesome
                                name="user"
                                size={20}
                                style={[
                                    style.clienteAvatarIcon,
                                    isInactive && style.clienteAvatarIconInactive
                                ]}
                            />
                        </View>

                        {/* Client info */}
                        <View style={style.clienteInfo}>
                            {e.acceso === "cliente" && (
                                <Text style={[
                                    style.clienteRazonSocial,
                                    isInactive && style.clienteTextInactive
                                ]}>
                                    {e.razon_social || 'Sin razón social'}
                                </Text>
                            )}
                            <Text style={[
                                style.clienteNombre,
                                isInactive && style.clienteTextInactive
                            ]}>
                                {e.nombre}
                            </Text>
                            {e.codt && (
                                <Text style={[
                                    style.clienteCodt,
                                    isInactive && style.clienteTextInactive
                                ]}>
                                    CODT: {e.codt}
                                </Text>
                            )}

                            {/* Badge de estado */}
                            <View style={[
                                style.clienteStatusBadge,
                                isInactive ? style.clienteStatusBadgeInactive : style.clienteStatusBadgeActive
                            ]}>
                                <Text style={[
                                    style.clienteStatusText,
                                    isInactive ? style.clienteStatusTextInactive : style.clienteStatusTextActive
                                ]}>
                                    {isInactive ? 'INACTIVOS' : 'ACTIVOS'}
                                </Text>
                            </View>
                        </View>

                        {/* Arrow icon */}
                        <View style={style.clienteArrowContainer}>
                            <FontAwesome
                                name="chevron-right"
                                size={16}
                                style={[
                                    style.clienteArrowIcon,
                                    isInactive && style.clienteArrowIconInactive
                                ]}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
    };
    const renderCliente = (): React.JSX.Element | null => {
        const { idCliente, cliente, acceso } = state;

        // Si el acceso es cliente, no debe mostrar opciones de asignar cliente
        if (acceso === 'cliente') {
            return null;
        }

        return (
            <View>
                {idCliente ? (
                    <TouchableOpacity
                        style={style.eliminarFrecuencia}
                        onPress={() => setState(prev => ({
                            ...prev,
                            idCliente: null,
                            cliente: null,
                            puntos: []
                        }))}
                    >
                        <FontAwesome name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>{cliente}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={style.nuevaFrecuencia}
                        onPress={() => setState(prev => ({ ...prev, showClientes: true }))}
                    >
                        <FontAwesome name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Asignar Cliente</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    };
    const modalCliente = (): React.JSX.Element => {
        const { showRenderUsuarios, terminoBuscador } = state;

        const closeModal = (): void => {
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
                setState(prev => ({
                    ...prev,
                    showClientes: false,
                    terminoBuscador: '',
                    showRenderUsuarios: false
                }));
            });
        };

        return (
            <Modal transparent visible={true} animationType="none" onRequestClose={closeModal}>
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
                                Seleccionar Cliente
                            </Text>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={style.modalCloseButton}
                            >
                                <FontAwesome name="times" size={16} style={style.modalCloseIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Barra de búsqueda */}
                        <View style={style.modalSearchContainer}>
                            <View style={style.modalSearchInputContainer}>
                                <TextInput
                                    placeholder="Escriba al menos 3 letras..."
                                    value={terminoBuscador}
                                    style={style.modalSearchInput}
                                    onChangeText={handleBuscadorClientesChange}
                                    placeholderTextColor="#999"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity
                                    style={style.modalSearchButton}
                                    onPress={() => {
                                        if (terminoBuscador.trim().length >= 3) {
                                            if (searchDebounceRef.current) {
                                                clearTimeout(searchDebounceRef.current);
                                            }
                                            setState(prev => ({ ...prev, showRenderUsuarios: true }));
                                            getClientes(terminoBuscador.trim());
                                        } else {
                                            Toast.show({
                                                type: 'info',
                                                text1: 'Ingrese al menos 3 caracteres para buscar'
                                            });
                                        }
                                    }}
                                >
                                    {buscandoClientes ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <FontAwesome name='search' style={style.modalSearchIcon} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Lista de clientes */}
                        <View style={style.modalContent}>
                            {showRenderUsuarios ? (
                                buscandoClientes && clientes.length === 0 ? (
                                    <View style={style.modalEmptyState}>
                                        <ActivityIndicator size="large" color="#002587" />
                                        <Text style={[style.modalEmptyText, { marginTop: 12 }]}>
                                            Buscando clientes...
                                        </Text>
                                    </View>
                                ) : clientes.length > 0 ? (
                                    <ScrollView style={style.modalScrollView} keyboardShouldPersistTaps="handled">
                                        {renderUsuarios()}
                                    </ScrollView>
                                ) : (
                                    <View style={style.modalEmptyState}>
                                        <FontAwesome
                                            name="users"
                                            size={48}
                                            style={style.modalEmptyIcon}
                                        />
                                        <Text style={style.modalEmptyText}>
                                            No se encontraron clientes
                                        </Text>
                                        <Text style={style.modalEmptySubtext}>
                                            Intenta con otro término de búsqueda
                                        </Text>
                                    </View>
                                )
                            ) : (
                                <View style={style.modalEmptyState}>
                                    <FontAwesome
                                        name="search"
                                        size={48}
                                        style={style.modalEmptyIcon}
                                    />
                                    <Text style={style.modalEmptyText}>
                                        Buscar Clientes
                                    </Text>
                                    <Text style={style.modalEmptySubtext}>
                                        Escriba al menos 3 letras para ver resultados
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Footer */}
                        <View style={style.modalFooter}>
                            <TouchableOpacity
                                style={style.modalCancelButton}
                                onPress={closeModal}
                            >
                                <Text style={style.modalCancelText}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        )
    };
    const renderPedido = (): React.JSX.Element => {
        const {
            forma,
            acceso,
            cantidad,
            showFrecuencia,
            frecuencia,
            diaSeleccionado1,
            diaSeleccionado2,
            novedad,
            idCliente,
            puntoId,
            puntos,
            solicitud,
            fechaSolicitud,
            guardando,
            showClientes
        } = state;

        return (
            <View style={style.subContainerNuevo}>
                {showClientes && modalCliente()}
                {modalData.show && modalPedidosExistentes()}
                <SeleccionarGrupoFrecuenciaModal
                    visible={showSelectGrupoModal}
                    onClose={() => setShowSelectGrupoModal(false)}
                    onSelect={(grupo) => {
                        setGrupoSeleccionado(grupo);
                        setState(prev => ({
                            ...prev,
                            grupoFrecuenciaId: grupo._id,
                            frecuencia: grupo.tipo_frecuencia
                        }));
                    }}
                    grupoSeleccionado={grupoSeleccionado}
                />
                <View style={style.contenedorMonto}>
                    <Text style={style.tituloForm}>Realice su pedido</Text>
                    <TouchableOpacity
                        onPress={() => setState(prev => ({ ...prev, forma: "monto", cantidad: "" }))}
                        style={style.btnFormaLlenar}
                    >
                        <Image source={require('../../assets/img/pg3/btn2.png')} style={style.icon} resizeMode={'contain'} />
                        <Text style={style.textForma}>Monto $</Text>
                        {forma === "monto" && <FontAwesome name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setState(prev => ({ ...prev, forma: "cantidad", cantidad: "" }))}
                        style={style.btnFormaLlenar}
                    >
                        <Image source={require('../../assets/img/pg3/btn3.png')} style={style.icon} resizeMode={'contain'} />
                        <Text style={style.textForma}>Cantidad Kg</Text>
                        {forma === "cantidad" && <FontAwesome name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setState(prev => ({ ...prev, forma: "lleno", cantidad: "" }))}
                        style={style.btnFormaLlenar}
                    >
                        <Image source={require('../../assets/img/pg3/btn4.png')} style={style.icon} resizeMode={'contain'} />
                        <Text style={style.textForma}>Lleno total</Text>
                        {forma === "lleno" && <FontAwesome name="check" style={style.iconCheck} />}
                    </TouchableOpacity>
                </View>
                {forma === "monto" ? (
                    <TextInputMask
                        type={'money'}
                        options={{
                            precision: 0,
                            separator: ',',
                            delimiter: '.',
                            unit: '$',
                            suffixUnit: ''
                        }}
                        value={cantidad}
                        style={style.input}
                        placeholder="Monto"
                        onChangeText={(cantidad) => setState(prev => ({ ...prev, cantidad }))}
                        ref={campoMonto}
                    />
                ) : forma === "cantidad" && (
                    <TextInputMask
                        type={'only-numbers'}
                        options={{
                            precision: 0,
                            separator: ',',
                            delimiter: '.',
                            unit: '',
                            suffixUnit: ''
                        }}
                        style={style.input}
                        value={cantidad}
                        placeholder="Cantidad"
                        onChangeText={(cantidad) => setState(prev => ({ ...prev, cantidad }))}
                    />
                )}
                {/* Solo mostrar frecuencia si el acceso NO es veo */}
                {acceso !== "veo" && (
                    showFrecuencia ? (
                        <TouchableOpacity
                            style={style.eliminarFrecuencia}
                            onPress={() => {
                                setState(prev => ({
                                    ...prev,
                                    showFrecuencia: false,
                                    tipoFrecuencia: null,
                                    grupoFrecuenciaId: null,
                                    frecuencia: null,
                                    diaSeleccionado1: null,
                                    diaSeleccionado2: null,
                                    intervaloSemanas: null,
                                    diaMes: null,
                                    diaSemanaMensual: null,
                                    franja: null
                                }));
                                setGrupoSeleccionado(null);
                            }}
                        >
                            <FontAwesome name="minus" style={style.iconFrecuencia} />
                            <Text style={style.textGuardar}>Frecuencia pedido</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={style.nuevaFrecuencia}
                            onPress={() => setState(prev => ({ ...prev, showFrecuencia: true }))}
                        >
                            <FontAwesome name="plus" style={style.iconFrecuencia} />
                            <Text style={style.textGuardar}>Frecuencia pedido</Text>
                        </TouchableOpacity>
                    )
                )}

                {showFrecuencia && acceso !== "veo" && (
                    <View style={style.contenedorFrecuencia}>
                        {/* Selector de tipo de frecuencia: Grupo o Manual */}
                        {!state.tipoFrecuencia && (
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: '700',
                                    color: '#212529',
                                    marginBottom: 12
                                }}>
                                    Tipo de frecuencia
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 12,
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            padding: 12,
                                            borderRadius: 12,
                                            borderWidth: 2,
                                            borderColor: '#002587',
                                            backgroundColor: '#fff',
                                            alignItems: 'center',
                                            shadowColor: 'rgba(0,0,0, .2)',
                                            shadowOffset: { height: 2, width: 0 },
                                            shadowOpacity: .3,
                                            shadowRadius: 4,
                                            elevation: 4
                                        }}
                                        onPress={() => setState(prev => ({ ...prev, tipoFrecuencia: 'grupo' }))}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: '#002587',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12
                                        }}>
                                            <FontAwesome name="users" style={{
                                                fontSize: 20,
                                                color: '#fff'
                                            }} />
                                        </View>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '700',
                                            color: '#002587',
                                            fontFamily: 'Comfortaa-Bold',
                                            flex: 1
                                        }}>
                                            Por Grupo
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            padding: 12,
                                            borderRadius: 12,
                                            borderWidth: 2,
                                            borderColor: '#28a745',
                                            backgroundColor: '#fff',
                                            alignItems: 'center',
                                            shadowColor: 'rgba(0,0,0, .2)',
                                            shadowOffset: { height: 2, width: 0 },
                                            shadowOpacity: .3,
                                            shadowRadius: 4,
                                            elevation: 4
                                        }}
                                        onPress={() => setState(prev => ({ ...prev, tipoFrecuencia: 'manual' }))}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: '#28a745',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12
                                        }}>
                                            <FontAwesome name="edit" style={{
                                                fontSize: 20,
                                                color: '#fff'
                                            }} />
                                        </View>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '700',
                                            color: '#28a745',
                                            fontFamily: 'Comfortaa-Bold',
                                            flex: 1
                                        }}>
                                            Manual
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Si se seleccionó grupo */}
                        {state.tipoFrecuencia === 'grupo' && (
                            <View>
                                {grupoSeleccionado ? (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#e3f2fd',
                                            borderRadius: 12,
                                            padding: 16,
                                            borderWidth: 2,
                                            borderColor: '#002587',
                                            marginBottom: 12
                                        }}
                                        onPress={() => setShowSelectGrupoModal(true)}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    fontWeight: '700',
                                                    color: '#002587',
                                                    marginBottom: 4
                                                }}>
                                                    {grupoSeleccionado.nombre}
                                                </Text>
                                                <View style={{
                                                    backgroundColor: '#002587',
                                                    alignSelf: 'flex-start',
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 4,
                                                    borderRadius: 6,
                                                    marginBottom: 4
                                                }}>
                                                    <Text style={{
                                                        color: '#fff',
                                                        fontSize: 12,
                                                        fontWeight: '600'
                                                    }}>
                                                        {grupoSeleccionado.tipo_frecuencia.toUpperCase()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <FontAwesome name="chevron-right" style={{
                                                fontSize: 18,
                                                color: '#002587'
                                            }} />
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 12,
                                            padding: 16,
                                            borderWidth: 2,
                                            borderColor: !state.grupoFrecuenciaId ? '#dc3545' : '#dee2e6',
                                            borderStyle: 'dashed',
                                            alignItems: 'center',
                                            marginBottom: 12
                                        }}
                                        onPress={() => setShowSelectGrupoModal(true)}
                                        activeOpacity={0.7}
                                    >
                                        <FontAwesome name="plus-circle" style={{
                                            fontSize: 32,
                                            color: '#002587',
                                            marginBottom: 8
                                        }} />
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#002587'
                                        }}>
                                            Seleccionar Grupo
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={{
                                        marginTop: 8,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        alignSelf: 'flex-start'
                                    }}
                                    onPress={() => {
                                        setState(prev => ({
                                            ...prev,
                                            tipoFrecuencia: null,
                                            grupoFrecuenciaId: null,
                                            frecuencia: null
                                        }));
                                        setGrupoSeleccionado(null);
                                    }}
                                >
                                    <Text style={{
                                        color: '#007bff',
                                        fontSize: 13,
                                        fontWeight: '600'
                                    }}>
                                        Cambiar tipo
                                    </Text>
                                </TouchableOpacity>

                                {/* Botón para cambiar de grupo si ya hay uno seleccionado */}
                                {grupoSeleccionado && (
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 8,
                                            paddingVertical: 8,
                                            paddingHorizontal: 12,
                                            alignSelf: 'flex-start'
                                        }}
                                        onPress={() => setShowSelectGrupoModal(true)}
                                    >
                                        <Text style={{
                                            color: '#28a745',
                                            fontSize: 13,
                                            fontWeight: '600'
                                        }}>
                                            Cambiar grupo
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Si se seleccionó manual */}
                        {state.tipoFrecuencia === 'manual' && (
                            <View>
                                {/* Tipo de frecuencia */}
                                <View style={style.fieldContainer}>
                                    <Text style={style.fieldLabel}>Tipo de Frecuencia *</Text>
                                    <View style={style.radioContainer}>
                                        <TouchableOpacity
                                            style={[
                                                style.radioButton,
                                                frecuencia === 'semanal' && style.radioButtonSelected
                                            ]}
                                            onPress={() => {
                                                setState(prev => ({
                                                    ...prev,
                                                    frecuencia: 'semanal' as FrecuenciaPedido,
                                                    diaSeleccionado1: null,
                                                    intervaloSemanas: null,
                                                    diaMes: null,
                                                    diaSemanaMensual: null
                                                }));
                                            }}
                                        >
                                            <Text style={[
                                                style.radioText,
                                                frecuencia === 'semanal' && style.radioTextSelected
                                            ]}>
                                                Semanal
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                style.radioButton,
                                                frecuencia === 'mensual' && style.radioButtonSelected
                                            ]}
                                            onPress={() => {
                                                setState(prev => ({
                                                    ...prev,
                                                    frecuencia: 'mensual' as FrecuenciaPedido,
                                                    diaSeleccionado1: null,
                                                    intervaloSemanas: null,
                                                    diaMes: null,
                                                    diaSemanaMensual: null
                                                }));
                                            }}
                                        >
                                            <Text style={[
                                                style.radioText,
                                                frecuencia === 'mensual' && style.radioTextSelected
                                            ]}>
                                                Mensual
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Campos para frecuencia semanal */}
                                {frecuencia === "semanal" && (
                                    <>
                                        <View style={style.fieldContainer}>
                                            <Text style={style.fieldLabel}>Día de la Semana *</Text>
                                            <Text style={style.fieldSubLabel}>Selecciona el día de la semana (Lunes a Domingo)</Text>
                                            <View style={style.daysContainer}>
                                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia, index) => {
                                                    const dayNumber = index + 1;
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={[
                                                                style.dayButton,
                                                                diaSeleccionado1 === dayNumber && style.dayButtonSelected
                                                            ]}
                                                            onPress={() => {
                                                                setState(prev => ({ ...prev, diaSeleccionado1: dayNumber }));
                                                            }}
                                                        >
                                                            <Text style={[
                                                                style.dayText,
                                                                diaSeleccionado1 === dayNumber && style.dayTextSelected
                                                            ]}>
                                                                {dia.charAt(0)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                            <Text style={style.daySelectedText}>
                                                Día seleccionado: {diaSeleccionado1 ? (['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as any[])[diaSeleccionado1] || 'Ninguno' : 'Ninguno'}
                                            </Text>
                                        </View>

                                        <View style={style.fieldContainer}>
                                            <Text style={style.fieldLabel}>Intervalo de Semanas *</Text>
                                            <View style={style.radioContainer}>
                                                <TouchableOpacity
                                                    style={[
                                                        style.radioButton,
                                                        state.intervaloSemanas === 1 && style.radioButtonSelected
                                                    ]}
                                                    onPress={() => {
                                                        setState(prev => ({ ...prev, intervaloSemanas: 1 }));
                                                    }}
                                                >
                                                    <Text style={[
                                                        style.radioText,
                                                        state.intervaloSemanas === 1 && style.radioTextSelected
                                                    ]}>
                                                        Semanal
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        style.radioButton,
                                                        state.intervaloSemanas === 2 && style.radioButtonSelected
                                                    ]}
                                                    onPress={() => {
                                                        setState(prev => ({ ...prev, intervaloSemanas: 2 }));
                                                    }}
                                                >
                                                    <Text style={[
                                                        style.radioText,
                                                        state.intervaloSemanas === 2 && style.radioTextSelected
                                                    ]}>
                                                        Cada 2 Semanas
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        style.radioButton,
                                                        state.intervaloSemanas === 3 && style.radioButtonSelected
                                                    ]}
                                                    onPress={() => {
                                                        setState(prev => ({ ...prev, intervaloSemanas: 3 }));
                                                    }}
                                                >
                                                    <Text style={[
                                                        style.radioText,
                                                        state.intervaloSemanas === 3 && style.radioTextSelected
                                                    ]}>
                                                        Cada 3 Semanas
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                )}

                                {/* Campos para frecuencia mensual */}
                                {frecuencia === "mensual" && (
                                    <>
                                        <View style={style.fieldContainer}>
                                            <Text style={style.fieldLabel}>Día del Mes *</Text>
                                            <Text style={style.fieldSubLabel}>Selecciona el día del mes (1-31)</Text>
                                            <View style={style.daysContainer}>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                                                    <TouchableOpacity
                                                        key={dia}
                                                        style={[
                                                            style.dayButton,
                                                            state.diaMes === dia && style.dayButtonSelected
                                                        ]}
                                                        onPress={() => {
                                                            if (state.diaMes === dia) {
                                                                setState(prev => ({ ...prev, diaMes: null }));
                                                            } else {
                                                                setState(prev => ({ ...prev, diaMes: dia }));
                                                            }
                                                        }}
                                                    >
                                                        <Text style={[
                                                            style.dayText,
                                                            state.diaMes === dia && style.dayTextSelected
                                                        ]}>
                                                            {dia}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            <Text style={style.daySelectedText}>
                                                Día seleccionado: {state.diaMes || 'Ninguno'}
                                            </Text>
                                        </View>

                                        <View style={style.fieldContainer}>
                                            <Text style={style.fieldLabel}>Día de la Semana (Mensual) *</Text>
                                            <Text style={style.fieldSubLabel}>Selecciona el día de la semana para frecuencia mensual</Text>
                                            <View style={style.daysContainer}>
                                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia, index) => {
                                                    const dayNumber = index + 1;
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={[
                                                                style.dayButton,
                                                                state.diaSemanaMensual === dayNumber && style.dayButtonSelected
                                                            ]}
                                                            onPress={() => {
                                                                setState(prev => ({ ...prev, diaSemanaMensual: dayNumber }));
                                                            }}
                                                        >
                                                            <Text style={[
                                                                style.dayText,
                                                                state.diaSemanaMensual === dayNumber && style.dayTextSelected
                                                            ]}>
                                                                {dia.charAt(0)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                            <Text style={style.daySelectedText}>
                                                Día seleccionado: {state.diaSemanaMensual ? (['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as any[])[state.diaSemanaMensual] || 'Ninguno' : 'Ninguno'}
                                            </Text>
                                        </View>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={{ marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start' }}
                                    onPress={() => setState(prev => ({ ...prev, tipoFrecuencia: null, frecuencia: null, diaSeleccionado1: null, intervaloSemanas: null, diaMes: null, diaSemanaMensual: null }))}
                                >
                                    <Text style={{ color: '#007bff', fontSize: 13, fontWeight: '600' }}>Cambiar tipo</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                {acceso !== "cliente" && renderCliente()}

                {/* Sección de puntos de entrega mejorada */}
                {puntos.length > 0 && (
                    <View style={style.puntosEntregaContainer}>
                        {puntos.length > 1 ? (
                            <>
                                <Text style={style.puntosEntregaTitle}>
                                    Selecciona el punto de entrega
                                </Text>
                                {puntos.map((e, key) => {
                                    const isSelected = puntoId === e._id;
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                style.puntoEntregaCard,
                                                isSelected && style.puntoEntregaCardSelected
                                            ]}
                                            onPress={() => setState(prev => ({ ...prev, puntoId: e._id }))}
                                            activeOpacity={0.7}
                                        >
                                            <View style={style.puntoEntregaHeader}>
                                                <View style={[
                                                    style.puntoEntregaIcon,
                                                    isSelected && style.puntoEntregaIconSelected
                                                ]}>
                                                    <FontAwesome
                                                        name="map-marker"
                                                        style={style.puntoEntregaIconImage}
                                                    />
                                                </View>

                                                <View style={style.puntoEntregaInfo}>
                                                    <Text style={style.puntoEntregaDireccion}>
                                                        {e.direccion}
                                                    </Text>
                                                    <Text style={style.puntoEntregaCapacidad}>
                                                        🏭 Capacidad: {e.capacidad} kg
                                                    </Text>
                                                    {e.email && e.email.trim() !== "" && (
                                                        <Text style={style.puntoEntregaObservacion}>
                                                            📧 {e.email}
                                                        </Text>
                                                    )}
                                                    {e.nombre && e.nombre.trim() !== "" && (
                                                        <Text style={style.puntoEntregaObservacion}>
                                                            👤 Encargado: {e.nombre}
                                                        </Text>
                                                    )}
                                                    {e.celular && e.celular.trim() !== "" && (
                                                        <Text style={style.puntoEntregaObservacion}>
                                                            📱 {e.celular}
                                                        </Text>
                                                    )}
                                                    {e.observacion && e.observacion.trim() !== "" && (
                                                        <Text style={style.puntoEntregaObservacion}>
                                                            💬 {e.observacion}
                                                        </Text>
                                                    )}
                                                </View>

                                                {isSelected && (
                                                    <View style={style.puntoEntregaCheckContainer}>
                                                        <FontAwesome
                                                            name="check-circle"
                                                            style={style.puntoEntregaCheckIcon}
                                                        />
                                                    </View>
                                                )}
                                            </View>

                                            {isSelected && (
                                                <View style={style.puntoEntregaBadge}>
                                                    <Text style={style.puntoEntregaBadgeText}>
                                                        SELECCIONADO
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )
                                })}
                            </>
                        ) : (
                            // Punto único - diseño especial
                            puntos.map((e, key) => {
                                return (
                                    <View key={key} style={[
                                        style.puntoEntregaCard,
                                        style.puntoEntregaCardSingle
                                    ]}>
                                        <View style={style.puntoEntregaHeader}>
                                            <View style={[
                                                style.puntoEntregaIcon,
                                                style.puntoEntregaIconSelected
                                            ]}>
                                                <FontAwesome
                                                    name="map-marker"
                                                    style={style.puntoEntregaIconImage}
                                                />
                                            </View>

                                            <View style={style.puntoEntregaInfo}>
                                                <Text style={[
                                                    style.puntoEntregaDireccion,
                                                    { color: '#28a745' }
                                                ]}>
                                                    Punto de entrega único
                                                </Text>
                                                <Text style={style.puntoEntregaDireccion}>
                                                    {e.direccion}
                                                </Text>
                                                <Text style={style.puntoEntregaCapacidad}>
                                                    🏭 Capacidad: {e.capacidad} kg
                                                </Text>
                                                {e.email && e.email.trim() !== "" && (
                                                    <Text style={style.puntoEntregaObservacion}>
                                                        📧 {e.email}
                                                    </Text>
                                                )}
                                                {e.nombre && e.nombre.trim() !== "" && (
                                                    <Text style={style.puntoEntregaObservacion}>
                                                        👤 Encargado: {e.nombre}
                                                    </Text>
                                                )}
                                                {e.celular && e.celular.trim() !== "" && (
                                                    <Text style={style.puntoEntregaObservacion}>
                                                        📱 {e.celular}
                                                    </Text>
                                                )}
                                                {e.observacion && e.observacion.trim() !== "" && (
                                                    <Text style={style.puntoEntregaObservacion}>
                                                        💬 {e.observacion}
                                                    </Text>
                                                )}
                                            </View>

                                            <View style={style.puntoEntregaCheckContainer}>
                                                <FontAwesome
                                                    name="check-circle"
                                                    style={style.puntoEntregaCheckIcon}
                                                />
                                            </View>
                                        </View>

                                        <View style={style.puntoEntregaBadge}>
                                            <Text style={style.puntoEntregaBadgeText}>
                                                PUNTO AUTOMÁTICO
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })
                        )}
                    </View>
                )}
                {solicitud ? (
                    <TouchableOpacity
                        style={style.eliminarFrecuencia}
                        onPress={() => setState(prev => ({ ...prev, solicitud: false, fechaSolicitud: '' }))}
                    >
                        <FontAwesome name="minus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>{fechaSolicitud}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={style.nuevaFrecuencia}
                        onPress={() => {
                            setState(prev => ({ ...prev, showFechaEntrega: true }));
                        }}
                    >
                        <FontAwesome name="plus" style={style.iconFrecuencia} />
                        <Text style={style.textGuardar}>Fecha Entrega</Text>
                    </TouchableOpacity>
                )}

                <TextInput
                    placeholder="Observaciones"
                    onChangeText={(novedad) => setState(prev => ({ ...prev, novedad }))}
                    value={novedad}
                    multiline={true}
                    style={[style.inputNovedades]}
                />

                <TouchableOpacity
                    style={[!forma ? style.btnGuardarDisable : style.btnGuardar, { marginBottom: 100 }]}
                    onPress={() => {
                        // Solo validar cliente para usuarios que no son clientes
                        if ((acceso === "admin" || acceso === "solucion" || acceso === "veo" || acceso === "comercial" || acceso === "despacho") && !idCliente) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona un cliente' });
                        } else if ((acceso === "admin" || acceso === "solucion" || acceso === "veo" || acceso === "comercial" || acceso === "despacho") && !puntoId) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona una dirección' });
                        } else if (!forma) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona una forma' });
                        } else if (forma === "monto" && parseInt(cantidad) < 10) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta una cantidad' });
                        } else if (forma === "cantidad" && parseInt(cantidad) < 10) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta una cantidad' });
                        } else if (showFrecuencia && !state.tipoFrecuencia) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona el tipo de frecuencia (Grupo o Manual)' });
                        } else if (showFrecuencia && state.tipoFrecuencia === 'grupo' && !state.grupoFrecuenciaId) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona un grupo de frecuencia' });
                        } else if (showFrecuencia && state.tipoFrecuencia === 'manual' && !frecuencia) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Selecciona el tipo de frecuencia (Semanal o Mensual)' });
                        } else if (showFrecuencia && state.tipoFrecuencia === 'manual' && frecuencia === "semanal" && (!diaSeleccionado1 || !state.intervaloSemanas)) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Completa los datos de frecuencia semanal' });
                        } else if (showFrecuencia && state.tipoFrecuencia === 'manual' && frecuencia === "mensual" && (!state.diaMes || !state.diaSemanaMensual)) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Completa los datos de frecuencia mensual' });
                        } else if (!fechaSolicitud) {
                            Toast.show({ position: 'bottom', type: 'info', text1: 'Inserta una fecha de Entrega' });
                        } else if (acceso !== 'admin' && fechaSolicitud <= moment().format('YYYY-MM-DD')) {
                            Toast.show({
                                position: 'bottom',
                                type: 'info',
                                text1: 'Fecha no permitida',
                                text2: 'Solo el administrador puede crear pedidos con fecha de hoy. Elija a partir de mañana.'
                            });
                        } else if (!guardando) {
                            verificaPedido();
                        }
                    }}
                >
                    <FontAwesome name="caret-square-o-right" style={!forma ? style.iconGuardarDisable : style.iconGuardar} />
                    <Text style={!forma ? style.textGuardarDisable : style.textGuardar}>{!guardando ? "Enviar" : "Enviando..."}</Text>
                    {guardando && <ActivityIndicator color="#ffffff" />}
                </TouchableOpacity>
                <Toast />
            </View>
        )
    }
    const filtroClientes = (cliente: Cliente): void => {
        const { _id, email, nombre, razon_social, codt, activo } = cliente;

        if (!activo) {
            const clienteNombre = razon_social || nombre || 'Cliente sin nombre';
            Toast.show({
                type: 'error',
                text1: 'Cliente inactivo',
                text2: 'No se puede crear pedido. Se notificó a coordinación comercial.'
            });

            notificarClienteInactivo({
                clienteId: _id,
                usuarioNombre: state.nombre || 'Usuario',
                usuarioEmail: state.email || '',
                clienteNombre,
                clienteCodt: codt || ''
            }).catch((err) => {
                console.error('Error notificando cliente inactivo:', err);
            });

            return;
        }

        setState(prev => ({
            ...prev,
            cliente: nombre,
            idCliente: _id,
            emailCliente: email,
            showClientes: false
        }));
        getPuntos(_id);
    };
    const modalPedidosExistentes = (): React.JSX.Element => {
        const closeModal = (): void => {
            setModalData({
                show: false,
                pedidos: []
            });
        };

        const confirmCreate = (): void => {
            setModalData({
                show: false,
                pedidos: []
            });
            handleSubmit();
        };

        return (
            <Modal transparent visible={modalData.show} animationType="fade">
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 20,
                        width: '90%',
                        maxHeight: '80%'
                    }}>
                        <TouchableOpacity
                            onPress={closeModal}
                            style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}
                        >
                            <FontAwesome name={'times'} size={20} color="#666" />
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: 10,
                            marginTop: 10
                        }}>
                            Pedidos Existentes
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            textAlign: 'center',
                            marginBottom: 20,
                            color: '#666'
                        }}>
                            Se encontraron pedidos para este cliente
                        </Text>
                        <ScrollView style={{ maxHeight: 300, marginBottom: 20 }}>
                            {modalData.pedidos && modalData.pedidos.length > 0 ? modalData.pedidos.map((pedido: PedidoExistente, index: number) => {
                                const fechaSolicitud = pedido.fechasolicitud || 'Sin fecha';
                                const forma = pedido.forma || 'Sin forma';
                                const cantidadKl = pedido.cantidadkl || 0;
                                const cantidadPrecio = pedido.cantidadprecio || 0;
                                const creadoPor = pedido.nombre_usuario || pedido.razon_social_usuario || 'Usuario';
                                const fechaCreado = pedido.creado || '';
                                return (
                                    <View key={`pedido-${index}`} style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 8,
                                        padding: 15,
                                        marginBottom: 10,
                                        borderLeftWidth: 4,
                                        borderLeftColor: '#007bff'
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: '#007bff',
                                            marginBottom: 8
                                        }}>
                                            Pedido #{pedido._id}
                                        </Text>

                                        <Text style={{
                                            fontSize: 14,
                                            color: '#28a745',
                                            fontWeight: '600',
                                            marginBottom: 4
                                        }}>
                                            Fecha: {fechaSolicitud}
                                        </Text>

                                        <Text style={{
                                            fontSize: 14,
                                            color: '#333',
                                            marginBottom: 4
                                        }}>
                                            Forma: {forma}
                                        </Text>

                                        {cantidadKl > 0 && (
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#6f42c1',
                                                marginBottom: 4
                                            }}>
                                                Cantidad: {cantidadKl} KG
                                            </Text>
                                        )}

                                        {cantidadPrecio > 0 && (
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#28a745',
                                                marginBottom: 4
                                            }}>
                                                Precio: ${cantidadPrecio.toLocaleString()}
                                            </Text>
                                        )}

                                        <Text style={{
                                            fontSize: 14,
                                            color: '#dc3545',
                                            marginBottom: 4
                                        }}>
                                            Creado por: {creadoPor}
                                        </Text>

                                        {fechaCreado && (
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#6c757d',
                                                fontStyle: 'italic'
                                            }}>
                                                Fecha creación: {moment(fechaCreado).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        )}
                                    </View>
                                );
                            }) : (
                                <Text style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                                    No hay pedidos para mostrar
                                </Text>
                            )}
                        </ScrollView>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#6c757d',
                                    borderRadius: 8,
                                    padding: 15,
                                    alignItems: 'center'
                                }}
                                onPress={closeModal}
                            >
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: '#007bff',
                                    borderRadius: 8,
                                    padding: 15,
                                    alignItems: 'center'
                                }}
                                onPress={confirmCreate}
                            >
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Crear de todos modos
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const modalFechaEntrega = (): React.JSX.Element => {
        const { modalFechaEntrega, fechaSolicitud, acceso: accesoUsuario } = state;

        const diaActual = moment().format('YYYY-MM-DD');
        const manana = moment().add(1, 'day').format('YYYY-MM-DD');
        const minFecha = accesoUsuario === 'admin' ? diaActual : manana;
        // Validar que fechaSolicitud no esté vacía antes de formatear
        const fechaFormateada = fechaSolicitud
            ? moment(fechaSolicitud).format("YYYY-MM-DD")
            : minFecha;

        return (
            <Modal transparent visible={modalFechaEntrega} animationType="fade" >
                <TouchableOpacity activeOpacity={1} onPress={() => { setState(prev => ({ ...prev, showFechaEntrega: false })) }} >
                    <View style={style.contenedorModalCliente}>
                        <View style={style.subContenedorModalCliente}>
                            <TouchableOpacity activeOpacity={1} onPress={() => setState(prev => ({ ...prev, showFechaEntrega: false }))} style={style.btnModalClose}>
                                <FontAwesome name={'times-circle'} style={style.iconCerrar} />
                            </TouchableOpacity>
                            <Text style={style.tituloModal}>
                                {accesoUsuario === 'admin' ? 'Fecha entrega' : 'Fecha entrega (desde mañana)'}
                            </Text>
                            <Calendar
                                style={style.calendar}
                                current={fechaFormateada}
                                minDate={minFecha}
                                firstDay={1}
                                onDayPress={(day: CalendarDay) => {
                                    if (accesoUsuario !== 'admin' && day.dateString <= diaActual) {
                                        Toast.show({
                                            type: 'info',
                                            text1: 'Fecha no permitida',
                                            text2: 'Solo el administrador puede crear pedidos con fecha de hoy'
                                        });
                                        return;
                                    }
                                    setState(prev => ({
                                        ...prev,
                                        solicitud: true,
                                        showFechaEntrega: false,
                                        fechaSolicitud: day.dateString
                                    }));
                                    Toast.show({
                                        type: 'info',
                                        text1: 'Esta fecha esta sujeta a verificación',
                                        text2: 'si nuestros vehiculos estan en la zona'
                                    });
                                }}
                                markedDates={fechaSolicitud ? { [fechaFormateada]: { selected: true, marked: true } } : {}}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>
        )
    };

    //// verifica si se creo un pedido ese dia y valida que el punto pertenece al cliente
    const verificaPedido = async (): Promise<void> => {
        setState(prev => ({ ...prev, guardando: true }));
        const { idCliente, idUsuario, acceso, puntoId } = state;
        const id = acceso === "cliente" ? idUsuario : idCliente;

        try {
            // PRIMERO: Validar que el punto pertenece al cliente
            if (acceso !== "cliente" && puntoId && idCliente) {
                const validacionPunto = await axios.get(`ped/validar-punto-cliente`, {
                    params: {
                        puntoId: puntoId,
                        clienteId: idCliente
                    }
                });

                if (!validacionPunto.data.status) {
                    const mensajeError = validacionPunto.data.message || "El punto de entrega no pertenece al cliente seleccionado";

                    Alert.alert(
                        "⚠️ Error de Validación",
                        mensajeError,
                        [
                            {
                                text: "Entendido",
                                style: "default",
                                onPress: () => {
                                    // Limpiar el punto seleccionado para forzar nueva selección
                                    setState(prev => ({ ...prev, puntoId: null, guardando: false }));
                                }
                            }
                        ]
                    );
                    setState(prev => ({ ...prev, guardando: false }));
                    return;
                }
            }

            // SEGUNDO: Verificar si ya existe un pedido hoy
            const response = await verificarPedidoHoy(id, puntoId) as VerificacionPedidoResponse;
            const { status, pedidos, total } = response;
            if (status) {
                if (total > 0) {
                    // Mostrar modal con pedidos existentes
                    setModalData({
                        show: true,
                        pedidos: pedidos || []
                    });
                    setState(prev => ({
                        ...prev,
                        guardando: false
                    }));
                } else {
                    handleSubmit();
                }
            } else {
                response.message?.path === "puntoId"
                    ? Alert.alert("Error", "Inserte un punto de entrega")
                    : Alert.alert("Error", "tenemos un problema intentalo nuevamente");
                setState(prev => ({ ...prev, guardando: false }));
            }
        } catch (error: any) {
            console.error('Error verificando pedido:', error);
            setState(prev => ({ ...prev, guardando: false }));

            // Extraer el mensaje de error del backend
            const errorMessage = error?.response?.data?.message
                || error?.response?.data?.error
                || error?.message
                || "No se pudo validar el pedido. Intente nuevamente.";

            // Mostrar modal de error con opción de copiar
            setErrorModal({
                show: true,
                message: JSON.stringify(error?.response?.data || error?.message || error, null, 2)
            });
        }
    };
    const handleSubmit = async (): Promise<void> => {
        const {
            forma,
            cantidad,
            idCliente,
            tipoFrecuencia,
            grupoFrecuenciaId,
            diaSeleccionado1,
            diaSeleccionado2,
            frecuencia,
            intervaloSemanas,
            diaMes,
            diaSemanaMensual,
            novedad: observacion,
            puntoId,
            fechaSolicitud,
            idUsuario
        } = state;

        const cantidadKl = forma === "cantidad" ? cantidad : 0;
        const cantidadPrecio = forma === "monto" ? (campoMonto.current?.getRawValue() || 0) : 0;

        const data: PedidoData = {
            forma: forma!,
            puntoId: puntoId!,
            fechaSolicitud,
            cantidadKl: typeof cantidadKl === 'string' ? parseInt(cantidadKl) : cantidadKl,
            cantidadPrecio,
            usuarioCrea: idUsuario!,
            usuarioId: idCliente!,
            observacion
        };

        // Si se seleccionó un grupo, agregar grupo_id
        if (tipoFrecuencia === 'grupo' && grupoFrecuenciaId) {
            data.grupo_id = grupoFrecuenciaId;
        }

        // Si es frecuencia manual
        if (tipoFrecuencia === 'manual' && frecuencia) {
            if (frecuencia === 'semanal') {
                // Para semanal: dia1 es el día de la semana, intervalo_semanas es el intervalo
                if (diaSeleccionado1 !== undefined && diaSeleccionado1 !== null) {
                    data.dia1 = diaSeleccionado1;
                }
                if (intervaloSemanas !== undefined && intervaloSemanas !== null) {
                    data.intervalo_semanas = intervaloSemanas;
                    // Mapear intervalo de semanas a frecuencia
                    if (intervaloSemanas === 2) {
                        data.frecuencia = 'quincenal';
                    } else if (intervaloSemanas === 3) {
                        data.frecuencia = 'tressemanas';
                    } else {
                        data.frecuencia = 'semanal';
                    }
                } else {
                    data.frecuencia = frecuencia;
                }
            } else if (frecuencia === 'mensual') {
                data.frecuencia = 'mensual';
                // Para mensual: dia1 es el día del mes (1-31) y dia2 es el día de la semana (1-7)
                if (diaMes !== undefined && diaMes !== null) {
                    data.dia1 = diaMes; // Día del mes (1-31)
                    data.dia_mes = diaMes; // Mantener compatibilidad con backend
                }
                if (diaSemanaMensual !== undefined && diaSemanaMensual !== null) {
                    data.dia2 = diaSemanaMensual; // Día de la semana (1-7, donde 1=lunes, 7=domingo)
                    data.dia_semana_mensual = diaSemanaMensual; // Mantener compatibilidad con backend
                }
            }
        }

        try {
            const response = await crearPedido(data) as CrearPedidoResponse;

            // Mostrar toast de éxito
            Toast.show({
                type: 'success',
                text1: '✅ Pedido creado con éxito',
                text2: 'Tu pedido ha sido registrado correctamente',
                position: 'bottom',
                visibilityTime: 3000,
            });

            // Limpiar TODO el estado para evitar datos arrastrados
            setState(prev => ({
                ...prev,
                guardando: false,
                idCliente: null,
                cliente: null,
                emailCliente: '',
                forma: null,
                solicitud: false,
                puntos: [],
                puntoId: null,
                cantidad: '',
                tipoFrecuencia: null,
                grupoFrecuenciaId: null,
                frecuencia: null,
                diaSeleccionado1: null,
                diaSeleccionado2: null,
                intervaloSemanas: null,
                diaMes: null,
                diaSemanaMensual: null,
                novedad: '',
                fechaSolicitud: '',
                terminoBuscador: '',
                showRenderUsuarios: false,
                showClientes: false,
                showFrecuencia: false
            }));
            setGrupoSeleccionado(null);

            // Limpiar también el estado de Redux de clientes
            dispatch({ type: 'CLEAR_USUARIOS_SEARCH' });
        } catch (err) {
            console.error('Error creando pedido:', err);
            setState(prev => ({ ...prev, guardando: false }));
            Alert.alert("Error", "No pudimos procesar el pedido, intentelo mas tarde");
        }
    };

    const { showFechaEntrega } = state;

    return (
        <View style={style.container} >
            <HeaderLogo variant="compact" style={{}} />
            <ImageBackground style={style.container} source={require('../../assets/img/pg1/fondo2.jpg')} >
                {showFechaEntrega && modalFechaEntrega()}
                <KeyboardAwareScrollView style={style.containerNuevo}>
                    {renderPedido()}
                </KeyboardAwareScrollView>
                <Footer navigation={navigation} />
            </ImageBackground>

            {/* Modal de Error con opción de copiar */}
            <Modal
                visible={errorModal.show}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setErrorModal({ show: false, message: '' })}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 20,
                        width: '100%',
                        maxHeight: '80%',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}>
                        {/* Header */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15,
                            paddingBottom: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e0e0e0'
                        }}>
                            <FontAwesome name="exclamation-circle" style={{ fontSize: 24, color: '#f44336', marginRight: 10 }} />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#333',
                                flex: 1
                            }}>
                                Error del Backend
                            </Text>
                            <TouchableOpacity
                                onPress={() => setErrorModal({ show: false, message: '' })}
                                style={{
                                    padding: 5
                                }}
                            >
                                <FontAwesome name="times" style={{ fontSize: 20, color: '#666' }} />
                            </TouchableOpacity>
                        </View>

                        {/* Mensaje de error */}
                        <ScrollView style={{
                            maxHeight: 400,
                            marginBottom: 15
                        }}>
                            <View style={{
                                backgroundColor: '#f5f5f5',
                                padding: 12,
                                borderRadius: 8,
                                borderLeftWidth: 4,
                                borderLeftColor: '#f44336'
                            }}>
                                <Text style={{
                                    fontSize: 13,
                                    color: '#333',
                                    fontFamily: 'monospace'
                                }}>
                                    {errorModal.message}
                                </Text>
                            </View>
                        </ScrollView>

                        {/* Botones */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 10
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Clipboard.setString(errorModal.message);
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Copiado',
                                        text2: 'Error copiado al portapapeles',
                                        visibilityTime: 2000
                                    });
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#2196F3',
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesome name="copy" style={{ fontSize: 16, color: 'white', marginRight: 8 }} />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Copiar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setErrorModal({ show: false, message: '' })}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#757575',
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Nuevo_pedido;
