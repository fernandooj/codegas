import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    ScrollView,
    Dimensions,
    Animated,
    Keyboard,
    Platform,
    StatusBar
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { useSelector, useDispatch } from "react-redux";
import Footer from '../components/footer';
import {
    getPedidos,
    guardarNovedadInactivo,
    asignarConductor,
    asignarFechaEntrega,
    guardarNovedadCerrarPedido,
    cambiarEstadoPedido
} from '../../redux/actions/pedidoActions';
import { getVehiculos } from '../../redux/actions/vehiculoActions';

import { DataContext } from "../../context/context";
import { style } from './style';
import { setupCalendarLocale } from '../../utils/calendar';
import { formatCurrency } from '../../utils/number';
import { usePedidoState } from './usePedidoState';
import { colors } from '../../utils/colors';
import {
    PedidoProps,
    Pedido as PedidoType,
    Vehiculo,
    DataContextType,
    RootState,
    ScrollEvent,
    EstadoPedido,
    AccesoUsuario
} from './types';

// Importar modales separados
import EditarPedidoModal from './EditarPedidoModal';
import NovedadModal from './NovedadModal';

// Configurar el calendario en español
setupCalendarLocale();

const size = Dimensions.get('window');

const Pedido: React.FC<PedidoProps> = ({ navigation }) => {
    // Redux hooks
    const dispatch = useDispatch();
    const pedidos = useSelector((state: RootState) => state.pedido.pedidos);
    const vehiculos = useSelector((state: RootState) => state.vehiculo.vehiculos);

    // Context hook
    const context = useContext(DataContext) as DataContextType;

    // Custom hook para manejar todo el estado
    const {
        state,
        updateState,
        openPedidoModal,
        closePedidoModal,
        handleKeyboardShow,
        handleKeyboardHide,
        handleSearch,
        clearSearch,
        handleScroll: handleScrollPagination,
        actions
    } = usePedidoState();

    // Destructuring del estado para facilitar el uso
    const {
        openModal,
        modalConductor,
        modalFechaEntrega,
        modalNovedad,
        modalPerfiles,
        terminoBuscador,
        showSearch,
        final,
        limit,
        elevation,
        showSpin,
        showSpin1,
        bounces,
        showCalendar,
        novedad,
        selectedPedido: {
            id,
            estado,
            estadoEntrega,
            razon_social,
            cedula,
            forma,
            cantidadKl,
            cantidadPrecio,
            fechaEntrega,
            creado,
            usuarioCrea,
            capacidad,
            observacion,
            observacion_pedido,
            entregado,
            placaPedido,
            conductorPedido,
            kilos,
            factura,
            valor_total,
            forma_pago,
            motivo_no_cierre,
            perfil_novedad,
            idVehiculo,
            placa,
            estadoInicial,
            textEstado
        }
    } = state;


    // Estados locales
    const [idUsuario, setIdUsuario] = useState<string | undefined>();
    const [acceso, setAcceso] = useState<AccesoUsuario | undefined>();
    const [top] = useState(new Animated.Value(size.height));
    const [modalScale] = useState(new Animated.Value(0));
    const [modalMainScale] = useState(new Animated.Value(0));
    const [modalMainOpacity] = useState(new Animated.Value(0));

    // Refs
    const scrollViewRef = useRef<ScrollView>(null);
    const keyboardDidShowListener = useRef<any>(null);
    const keyboardDidHideListener = useRef<any>(null);

    // Keyboard event handlers
    const _keyboardDidShow = () => handleKeyboardShow();
    const _keyboardDidHide = () => handleKeyboardHide();

    // Effects
    useEffect(() => {
        const { acceso, userId: idUsuario } = context;
        setIdUsuario(idUsuario);
        setAcceso(acceso);
        keyboardDidShowListener.current = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        if (idUsuario && acceso) {
            loadPedidos('load');
        }

        return () => {
            keyboardDidShowListener.current?.remove();
            keyboardDidHideListener.current?.remove();
        };
    }, [context, idUsuario, acceso]);

    useEffect(() => {
        updateState(actions.setPedidosFiltro(pedidos));
    }, [pedidos, updateState, actions]);

    useEffect(() => {
        if (idUsuario && acceso) {
            loadPedidos('load');
        }
    }, [idUsuario, acceso]);

    useEffect(() => {
        if (!terminoBuscador && showSearch) {
            updateState(actions.setShowSearch(false));
        }
    }, [terminoBuscador, showSearch, updateState, actions]);

    // Effect para búsqueda en tiempo real con debounce
    useEffect(() => {
        if (!idUsuario || !acceso) return;

        // Si hay término de búsqueda, implementar debounce
        if (terminoBuscador && terminoBuscador.length >= 2) {
            const searchTimeout = setTimeout(() => {
                console.log('🔍 Búsqueda en tiempo real:', terminoBuscador);
                updateState(actions.setShowSearch(true));
                dispatch(getPedidos(idUsuario, 0, 20, acceso, terminoBuscador));
            }, 500); // Debounce de 500ms

            return () => clearTimeout(searchTimeout);
        }
        // Si no hay término de búsqueda, cargar todos los pedidos
        else if (terminoBuscador === '') {
            updateState(actions.setShowSearch(false));
            dispatch(getPedidos(idUsuario, 0, 20, acceso, undefined));
        }
    }, [terminoBuscador, idUsuario, acceso, dispatch, updateState, actions]);

    useEffect(() => {
        // Cargar vehículos cuando tenemos el idUsuario
        if (idUsuario && idUsuario !== 'undefined') {
            dispatch(getVehiculos(idUsuario));
        }
    }, [dispatch, idUsuario]);

    useEffect(() => {
        if (modalPerfiles) {
            Animated.spring(modalScale, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();
        }
    }, [modalPerfiles, modalScale]);

    useEffect(() => {
        if (openModal) {
            modalMainScale.setValue(0.3);
            modalMainOpacity.setValue(0);

            Animated.parallel([
                Animated.spring(modalMainScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(modalMainOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [openModal, modalMainScale, modalMainOpacity]);

    // Helper functions
    const getEstadoColor = (estado: EstadoPedido): string => {
        switch (estado) {
            case "activo": return "#28a745";
            case "innactivo": return "#dc3545";
            case "espera": return "#5bc0de";
            case "noentregado": return "#ffc107";
            default: return "#6c757d";
        }
    };

    const getEstadoBackgroundColor = (estado: EstadoPedido): string => {
        switch (estado) {
            case "activo": return "#d4edda";
            case "innactivo": return "#f8d7da";
            case "espera": return "#d1ecf1";
            case "noentregado": return "#fff3cd";
            default: return "#f8f9fa";
        }
    };

    const getPedidoBackgroundColor = (pedido: PedidoType): string => {
        if (pedido.estado === "espera") return colors.espera;
        if (pedido.estado === "noentregado") return colors.noentregado;
        if (pedido.estado === "innactivo") return colors.innactivo;

        // Si está activo y no entregado
        if (pedido.estado === "activo" && !pedido.entregado) {
            // Si tiene fecha de entrega -> Color naranja (asignado)
            if (pedido.fechaentrega) return colors.asignado;
            // Si no tiene fecha de entrega -> Color amarillo (activo)
            return colors.activo;
        }

        return colors.otro;
    };

    // Modal handlers
    const closeModalEstados = () => {
        Animated.timing(modalScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            updateState(actions.setModalPerfiles(false));
        });
    };

    const cancelarCambioEstado = () => {
        updateState(actions.setModalPerfiles(false));
    };

    const handleChangeStateModal = () => {
        updateState(actions.setModalPerfiles(true));
    };

    const handleEstadoChange = (nuevoEstado: EstadoPedido) => {
        updateState(actions.setPedidoData({ estado: nuevoEstado }));
    };

    const handleConfirmStateChange = () => {
        closeModalEstados();
        setTimeout(() => handleSubmit(), 300);
    };

    const handleVehicleSelect = (vehiculo: Vehiculo) => {
        updateState(actions.setPedidoData({
            idVehiculo: vehiculo._id,
            placa: vehiculo.placa,
            placaPedido: vehiculo.placa,
            conductorPedido: vehiculo.conductor?.nombre || ""
        }));
    };

    // Business logic functions
    const loadPedidos = (type?: string): void => {
        if (!idUsuario || !acceso) {
            return;
        }

        let currentLimit = type === 'load' ? 20 : limit;
        let currentTerminoBuscador = type === 'load' ? undefined : terminoBuscador;

        dispatch(getPedidos(idUsuario, 0, currentLimit, acceso, currentTerminoBuscador));
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            // Crear el array con el formato esperado por el backend
            const seleccionados = [{
                _id: id,
                estado: estado
            }];
            const res = await cambiarEstadoPedido(seleccionados);

            if (res.status) {
                if (estado == "activo") {
                    if (estadoInicial == "innactivo") {
                        updateState(actions.setModalNovedad(true));
                        updateState(actions.setPedidoData({ estadoEntrega: "asignado" }));
                    } else {
                        updateState(actions.setModalFechaEntrega(true));
                        updateState(actions.setPedidoData({ estadoEntrega: "asignado" }));
                    }
                } else if (estado == "innactivo") {
                    updateState(actions.setModalNovedad(true));
                } else {
                    Toast.show({ type: 'success', text1: 'Pedido actualizado correctamente' });
                    loadPedidos();
                }
            } else {
                Toast.show({ type: 'error', text1: 'Tenemos un problema, intentelo mas tarde' });
            }
        } catch (error) {
            console.error('Error cambiando estado del pedido:', error);
            Toast.show({ type: 'error', text1: 'Error al cambiar el estado del pedido' });
        }
    };

    const guardarNovedadInnactivo = async (): Promise<void> => {
        try {
            const res2 = await guardarNovedadInactivo(id, novedad);
            updateState(actions.setModalNovedad(false));
            updateState(actions.setPedidoData({ estadoEntrega: "noentregado" }));
            updateState(actions.setNovedad(""));
            setTimeout(() => {
                Toast.show({ type: 'success', text1: 'Pedido actualizado' })
            }, 1000);
            loadPedidos();
        } catch (error) {
            console.error('Error guardando novedad inactivo:', error);
            Toast.show({ type: 'error', text1: 'Error al guardar novedad' })
        }
    };

    const cancelarPedidoCliente = (): void => {
        const { nombre: nombreUsuario, user } = context;
        const nombreFinal = nombreUsuario || user?.nombre || razon_social || 'Usuario';
        const ahora = moment().format('DD/MM/YYYY HH:mm:ss');
        const mensajeCancelacion = `El usuario ${nombreFinal} canceló su pedido el ${ahora}`;

        Toast.show({
            type: 'info',
            text1: 'Funcionalidad de cancelación',
            text2: 'Implementar lógica de cancelación'
        });
    };

    const asignarConductorFunc = async (vehiculoData?: { _id: string, placa: string }): Promise<void> => {
        try {
            // Usar datos pasados como parámetro o del estado
            const finalIdVehiculo = vehiculoData?._id || idVehiculo;
            const finalPlaca = vehiculoData?.placa || placa;

            if (!finalIdVehiculo || !finalPlaca) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Selecciona un vehículo'
                });
                return;
            }

            // Usar fecha actual si no hay fecha seleccionada
            const fechaParaAsignar = fechaEntrega || moment().format('YYYY-MM-DD HH:mm:ss');

            const response = await asignarConductor(id, finalIdVehiculo, fechaParaAsignar, idUsuario); // Usar idUsuario como usuarioAsigna

            if (response.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: `Vehículo ${finalPlaca} asignado correctamente`,
                    position: 'top',
                    topOffset: 100,
                    visibilityTime: 3000,
                    zIndex: 10000
                });

                // Cerrar modal y resetear datos
                updateState(actions.setModalConductor(false));
                updateState(actions.setPedidoData({ placa: null, idVehiculo: null }));

                // Recargar pedidos
                dispatch(getPedidos(idUsuario, 0, 10, acceso));
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'No se pudo asignar el vehículo'
                });
            }
        } catch (error) {
            console.error('Error asignando conductor:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al asignar el vehículo'
            });
        }
    };

    const asignarFecha = async (): Promise<void> => {
        try {
            if (!fechaEntrega) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Selecciona una fecha',
                    zIndex: 10000
                });
                return;
            }

            // Formatear la fecha como espera el backend
            const fechaFormatted = moment(fechaEntrega).format('YYYY-MM-DD HH:mm:ss');
            const seleccionados = [{
                _id: id,
                fechaentrega: fechaFormatted
            }];


            const response = await asignarFechaEntrega(seleccionados);

            if (response.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: `Fecha ${moment(fechaEntrega).format('DD/MM/YYYY')} asignada correctamente`,
                    position: 'top',
                    topOffset: 100,
                    visibilityTime: 3000,
                    zIndex: 10000
                });

                // Cerrar modal
                updateState(actions.setModalFechaEntrega(false));
                updateState(actions.setShowCalendar(false));

                // Recargar pedidos - CORREGIR EL PARÁMETRO 'load'
                dispatch(getPedidos(idUsuario, 0, 10, acceso));
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'No se pudo asignar la fecha',
                    zIndex: 10000
                });
            }
        } catch (error) {
            console.error('Error asignando fecha:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al asignar la fecha',
                zIndex: 10000
            });
        }
    };

    const onScroll = (event: ScrollEvent) => {
        const shouldLoadMore = handleScrollPagination(event);
        if (shouldLoadMore) {
            loadPedidos();
        }
    };

    // Render functions
    const renderPedidos = (): React.JSX.Element[] => {
        return pedidos.map((e: PedidoType, key: number) => {
            return (
                <TouchableOpacity
                    key={key}
                    style={[
                        style.pedidoBtn,
                        {
                            backgroundColor: getPedidoBackgroundColor(e),
                            borderRadius: 12,
                            marginHorizontal: 15,
                            marginVertical: 8,
                            padding: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            borderLeftWidth: 4,
                            borderLeftColor: getEstadoColor(e.estado),
                        }
                    ]}
                    onPress={() => {
                        openPedidoModal({
                            placaPedido: e.placa,
                            conductorPedido: e.conductor,
                            valor_unitarioUsuario: e.valorunitariousuario ? e.valorunitariousuario : e.valorunitario,
                            imagenPedido: e.imagen,
                            fechaEntrega: e.fechaentrega,
                            id: e._id,
                            estado: e.estado,
                            estadoEntrega: e.estado == "activo" ? "asignado" : undefined,
                            usuarioId: e.usuarioid,
                            nombre: e.nombre,
                            razon_social: e.razon_social,
                            codt: e.codt,
                            email: e.email,
                            tokenPhone: e.tokenPhone,
                            cedula: e.cedula,
                            forma: e.forma,
                            cantidad: e.cantidad,
                            entregado: e.entregado,
                            imagenCerrar: e.imagencerrar,
                            factura: e.factura,
                            kilos: e.kilos,
                            remision: e.remision,
                            forma_pago: e.forma_pago,
                            valor_total: e.valor_total,
                            nPedido: e._id,
                            estadoInicial: e.estado,
                            capacidad: e.capacidad,
                            cantidadKl: e.cantidadkl,
                            cantidadPrecio: e.cantidadprecio,
                            observacion_pedido: e.observacion_pedido,
                            observacion: e.observacion,
                            puntoId: e.puntoid,
                            usuarioCrea: e.usuariocrea,
                            creado: e.creado,
                            motivo_no_cierre: e.motivo_no_cierre,
                            perfil_novedad: e.perfil_novedad,
                            idVehiculo: e.idVehiculo,
                            placa: e.placa,
                        });
                    }}
                >
                    {/* Card content - same as before */}
                    <View style={{
                        marginBottom: 12,
                        paddingBottom: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e9ecef',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                            <FontAwesome name="building" style={{ fontSize: 14, color: '#007bff', marginRight: 6, marginTop: 2 }} />
                            <Text style={[style.textPedido, { fontSize: 15, fontWeight: '600', color: '#333', flex: 1, lineHeight: 18 }]}>
                                {e.razon_social}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <FontAwesome name="id-card" style={{ fontSize: 12, color: '#6c757d', marginRight: 6 }} />
                                <Text style={[style.textPedido, { fontSize: 13, color: '#6c757d' }]}>
                                    {e.cedula}
                                </Text>
                            </View>

                            <View style={{
                                backgroundColor: getEstadoColor(e.estado),
                                paddingHorizontal: 6,
                                paddingVertical: 3,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                minWidth: 60,
                                justifyContent: 'center',
                            }}>
                                <FontAwesome
                                    name={e.estado === "activo" ? "check" : e.estado === "innactivo" ? "times" : "pause"}
                                    style={{ fontSize: 9, color: 'white', marginRight: 3 }}
                                />
                                <Text style={{ fontSize: 10, color: 'white', fontWeight: '600' }}>
                                    {e.estado === "activo" && !e.entregado ? "Activo" :
                                        e.estado === "innactivo" ? "Inact." :
                                            e.estado === "espera" ? "Espera" :
                                                e.estado === "activo" && e.entregado ? "Entregado" :
                                                    "Cerrado"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Rest of card content */}
                    <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="hashtag" style={{ fontSize: 12, color: '#007bff', marginRight: 6 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>N° Pedido</Text>
                                    <Text style={[style.textPedido, { fontSize: 13, fontWeight: '600' }]} numberOfLines={1}>
                                        {e._id}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="map-marker" style={{ fontSize: 12, color: '#dc3545', marginRight: 6 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Zona</Text>
                                    <Text style={[style.textPedido, { fontSize: 13, fontWeight: '600' }]} numberOfLines={1}>
                                        {e.zona || 'Sin zona'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start' }}>
                                <FontAwesome name="home" style={{ fontSize: 12, color: '#28a745', marginRight: 6, marginTop: 2 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Dirección</Text>
                                    <Text style={[style.textPedido, { fontSize: 12 }]} numberOfLines={2}>
                                        {e.direccion || "Sin dirección"}
                                    </Text>
                                </View>
                            </View>
                            {e.codt && (
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <FontAwesome name="code" style={{ fontSize: 12, color: '#6f42c1', marginRight: 6, marginTop: 2 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>CODT</Text>
                                        <Text style={[style.textPedido, { fontSize: 12, fontWeight: '600' }]} numberOfLines={1}>
                                            {e.codt}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                    </View>

                    {acceso !== "conductor" && (
                        <View style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            marginTop: 12,
                            borderRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                        }}>
                            {e.fechasolicitud && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Solicitud</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#333' }}>
                                        {moment(e.fechasolicitud).format('DD/MM/YY')}
                                    </Text>
                                </View>
                            )}

                            {e.fechaentrega && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Entrega</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#007bff' }}>
                                        {moment(e.fechaentrega).format('DD/MM/YY')}
                                    </Text>
                                </View>
                            )}

                            {e.valorunitario && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Precio</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#28a745' }}>
                                        {formatCurrency(e.valorunitario)}
                                    </Text>
                                </View>
                            )}

                            {e.capacidad && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Cantidad</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#007bff' }}>
                                        {e.capacidad} gal
                                    </Text>
                                </View>
                            )}

                            {e.factura && (
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>Factura</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#6f42c1' }}>
                                        #{e.factura}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {(e.conductor && acceso !== "conductor") && (
                        <View style={{
                            backgroundColor: '#e8f5e8',
                            padding: 8,
                            borderRadius: 6,
                            marginTop: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <FontAwesome name="truck" style={{ fontSize: 12, color: '#28a745', marginRight: 8 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Vehículo Asignado</Text>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#333' }}>
                                    {e.placa} - {e.conductor}
                                </Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            );
        })
    };

    const renderCabezera = () => {
        // Calcular padding superior para iPhone con notch
        const getStatusBarHeight = () => {
            if (Platform.OS === 'ios') {
                return StatusBar.currentHeight || 44; // 44 para iPhone con notch
            }
            return StatusBar.currentHeight || 24;
        };

        return (
            <View style={{
                backgroundColor: '#f8f9fa',
                paddingHorizontal: 0, // Sin padding horizontal para ancho completo
                paddingTop: getStatusBarHeight(), // Reducido de +10 a +5
                paddingBottom: 12, // Reducido de 15 a 12
                borderBottomWidth: 1,
                borderBottomColor: '#e9ecef',
                width: '100%', // Ancho completo
            }}>
                {/* Header con mejor espaciado */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10, // Reducido de 15 a 10
                    paddingHorizontal: 20 // Padding interno para el contenido
                }}>
                    <View>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: 4
                        }}>
                            Pedidos
                        </Text>
                        {pedidos && (
                            <Text style={{
                                fontSize: 16,
                                color: '#666',
                                fontWeight: '500'
                            }}>
                                {pedidos.length} pedidos encontrados
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#007bff',
                            borderRadius: 8,
                            width: 36,
                            height: 36,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                        onPress={() => loadPedidos('load')}
                        activeOpacity={0.8}
                    >
                        <FontAwesome name='refresh' style={{
                            fontSize: 14,
                            color: '#fff'
                        }} />
                    </TouchableOpacity>
                </View>

                {/* Barra de búsqueda con mejor diseño */}
                {acceso !== "conductor" && (
                    <View style={{
                        marginHorizontal: 20, // Margen para que no toque los bordes
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 10, // Reducido de 12 a 10
                            flexDirection: "row",
                            alignItems: 'center',
                            paddingHorizontal: 12, // Reducido de 16 a 12
                            paddingVertical: 2, // Reducido de 4 a 2
                            borderWidth: 1, // Reducido de 2 a 1
                            borderColor: showSearch && terminoBuscador ? '#007bff' : '#e9ecef',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                            height: 40, // Altura fija más pequeña
                        }}>
                            <FontAwesome
                                name='search'
                                style={{
                                    fontSize: 16,
                                    color: '#6c757d',
                                    marginRight: 12
                                }}
                            />
                            <TextInput
                                placeholder="Escribir para buscar..."
                                placeholderTextColor="#999"
                                autoCapitalize='none'
                                onChangeText={(terminoBuscador) => updateState(actions.setTerminoBuscador(terminoBuscador))}
                                value={terminoBuscador}
                                style={{
                                    flex: 1,
                                    fontSize: 15,
                                    color: '#333',
                                    paddingVertical: 8,
                                }}
                            />

                            {terminoBuscador ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#dc3545',
                                        borderRadius: 6,
                                        width: 32,
                                        height: 32,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        updateState(actions.setTerminoBuscador(''));
                                        updateState(actions.setShowSearch(false));
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome name='times' style={{
                                        fontSize: 14,
                                        color: '#fff'
                                    }} />
                                </TouchableOpacity>
                            ) : showSearch ? (
                                <View style={{
                                    width: 32,
                                    height: 32,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <ActivityIndicator size="small" color="#007bff" />
                                </View>
                            ) : null}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    // Main component return
    return (
        <View style={style.container}>
            {/* Modales separados */}
            <EditarPedidoModal
                visible={openModal}
                onClose={closePedidoModal}
                modalMainScale={modalMainScale}
                modalMainOpacity={modalMainOpacity}
                pedidoData={{
                    id,
                    razon_social,
                    cedula,
                    forma,
                    cantidadKl,
                    cantidadPrecio,
                    fechaEntrega,
                    creado,
                    usuarioCrea,
                    capacidad,
                    observacion,
                    observacion_pedido,
                    estado,
                    estadoEntrega,
                    entregado,
                    placaPedido,
                    conductorPedido,
                    kilos,
                    factura,
                    valor_total,
                    forma_pago,
                    motivo_no_cierre,
                    perfil_novedad
                }}
                acceso={acceso}
                getEstadoColor={getEstadoColor}
                getEstadoBackgroundColor={getEstadoBackgroundColor}
                onChangeState={handleChangeStateModal}
                onAssignVehicle={() => updateState(actions.setModalConductor(true))}
                onCancelOrder={cancelarPedidoCliente}
                // Props para CambiarEstadoModal
                modalPerfiles={modalPerfiles}
                onEstadoChange={handleEstadoChange}
                onConfirmStateChange={handleConfirmStateChange}
                onCancelStateChange={cancelarCambioEstado}
                // Props para VehiculosModal y FechaEntregaModal
                modalConductor={modalConductor}
                modalFechaEntrega={modalFechaEntrega}
                vehiculos={vehiculos}
                showCalendar={showCalendar}
                fechaEntrega={fechaEntrega}
                idVehiculo={idVehiculo}
                placa={placa}
                onCloseConductor={() => {
                    updateState(actions.setModalConductor(false));
                    updateState(actions.setPedidoData({ placa: null, idVehiculo: null }));
                }}
                onToggleCalendar={(show) => updateState(actions.setShowCalendar(show))}
                onDateSelect={(date) => updateState(actions.setPedidoData({ fechaEntrega: date }))}
                onSaveDate={asignarFecha}
                onVehicleSelect={handleVehicleSelect}
                onAssignVehicleAction={asignarConductorFunc}
                onCloseFechaEntrega={() => updateState(actions.setModalFechaEntrega(false))}
                onSaveFecha={asignarFecha}
            />

            {/* Todos los modales internos ahora se renderizan dentro del EditarPedidoModal */}

            <NovedadModal
                visible={modalNovedad}
                onClose={() => updateState(actions.setModalNovedad(false))}
                novedad={novedad}
                onNovedadChange={(text) => updateState(actions.setNovedad(text))}
                onSave={guardarNovedadInnactivo}
            />

            {renderCabezera()}

            <ScrollView
                style={style.subContenedor}
                onScroll={(e) => onScroll(e)}
                bounces={bounces}
                scrollEventThrottle={16}
                ref={scrollViewRef}
            >
                {showSpin1 && <ActivityIndicator color="#0071bb" style={style.preload1} />}
                {!pedidos ? (
                    <ActivityIndicator color="#00218b" />
                ) : pedidos.length == 0 ? (
                    <Text style={style.sinPedidos}>No hemos encontrado pedidos</Text>
                ) : (
                    renderPedidos()
                )}
            </ScrollView>

            {showSpin && <ActivityIndicator color="#0071bb" style={style.preload} />}
            <Footer navigation={navigation} />
            <Toast
                config={{
                    success: (internalState) => (
                        <View style={{
                            height: 60,
                            width: '90%',
                            backgroundColor: '#28a745',
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 20,
                            zIndex: 99999
                        }}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                ✅ {internalState.text1}
                            </Text>
                            {internalState.text2 && (
                                <Text style={{ color: 'white', fontSize: 14, marginLeft: 8 }}>
                                    {internalState.text2}
                                </Text>
                            )}
                        </View>
                    ),
                    error: (internalState) => (
                        <View style={{
                            height: 60,
                            width: '90%',
                            backgroundColor: '#dc3545',
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 20,
                            zIndex: 99999
                        }}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                ❌ {internalState.text1}
                            </Text>
                            {internalState.text2 && (
                                <Text style={{ color: 'white', fontSize: 14, marginLeft: 8 }}>
                                    {internalState.text2}
                                </Text>
                            )}
                        </View>
                    )
                }}
            />
        </View>
    );
};

export default Pedido;
