import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView,
    Dimensions,
    Animated,
    Keyboard
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
import CambiarEstadoModal from './CambiarEstadoModal';
import VehiculosModal from './VehiculosModal';
import NovedadModal from './NovedadModal';
import FechaEntregaModal from './FechaEntregaModal';

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

    useEffect(() => {
        dispatch(getVehiculos());
    }, [dispatch]);

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
        if (pedido.estado === "activo" && !pedido.carroId && !pedido.entregado) return colors.activo;
        if (pedido.estado === "activo" && !pedido.entregado) return colors.asignado;
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

    const handleChangeStateModal = () => {
        console.log('🔄 Abriendo modal de perfiles...');
        console.log('📊 Estado actual modalPerfiles:', modalPerfiles);
        updateState(actions.setModalPerfiles(true));
        console.log('✅ Acción enviada: setModalPerfiles(true)');
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
            console.log('⚠️ No se pueden cargar pedidos: idUsuario o acceso no disponibles');
            return;
        }

        let currentLimit = type === 'load' ? 20 : limit;
        let currentTerminoBuscador = type === 'load' ? undefined : terminoBuscador;

        console.log('🔄 Cargando pedidos...', { idUsuario, acceso, currentLimit, currentTerminoBuscador });
        dispatch(getPedidos(idUsuario, 0, currentLimit, acceso, currentTerminoBuscador));
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            const res = await cambiarEstadoPedido(id, estado);

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

        // Implementation continues...
        // (Implementation of cancelarPedidoCliente, asignarConductorFunc, asignarFecha)
    };

    const asignarConductorFunc = (): void => {
        // Implementation
    };

    const asignarFecha = (): void => {
        // Implementation
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

                        {acceso !== "conductor" && e.fechaentrega && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="calendar-check-o" style={{ fontSize: 12, color: '#28a745', marginRight: 6 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Entrega</Text>
                                    <Text style={[style.textPedido, { fontSize: 12 }]}>
                                        {moment(e.fechaentrega).format('YYYY-MM-DD')}
                                    </Text>
                                </View>
                            </View>
                        )}
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
                                        {e.fechasolicitud}
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
        return (
            <View style={style.contenedorCabezera}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {pedidos && <Text style={style.titulo}>Pedidos: {pedidos.length}</Text>}
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={style.btnReload} onPress={() => loadPedidos('load')}>
                            <FontAwesome name='refresh' style={style.iconReload} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.subContenedorCabezera}>
                    {acceso !== "conductor" && (
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                placeholder="Buscar por: cliente, fecha, forma"
                                placeholderTextColor="#aaa"
                                autoCapitalize='none'
                                onChangeText={(terminoBuscador) => updateState(actions.setTerminoBuscador(terminoBuscador))}
                                value={terminoBuscador}
                                style={[style.inputCabezera, { elevation }]}
                            />
                            {!showSearch || !terminoBuscador ? (
                                <TouchableOpacity style={style.buscarCliente} onPress={() => {
                                    if (handleSearch(terminoBuscador)) {
                                        loadPedidos();
                                    } else {
                                        Toast.show({ type: 'error', text1: 'Inserte un valor' });
                                    }
                                }}>
                                    <FontAwesome name='search' style={style.iconSearch} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={style.buscarCliente} onPress={() => {
                                    clearSearch();
                                    loadPedidos('load');
                                }}>
                                    <FontAwesome name='close' style={style.iconSearch} />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
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
                onChangeState={handleChangeStateModal}
                onAssignVehicle={() => updateState(actions.setModalConductor(true))}
                onCancelOrder={cancelarPedidoCliente}
            />

            <CambiarEstadoModal
                visible={modalPerfiles}
                onClose={closeModalEstados}
                modalScale={modalScale}
                estado={estado}
                entregado={entregado}
                acceso={acceso}
                getEstadoColor={getEstadoColor}
                getEstadoBackgroundColor={getEstadoBackgroundColor}
                onEstadoChange={handleEstadoChange}
                onConfirm={handleConfirmStateChange}
            />

            <VehiculosModal
                visible={modalConductor}
                onClose={() => {
                    updateState(actions.setModalConductor(false));
                    updateState(actions.setPedidoData({ placa: null, idVehiculo: null }));
                }}
                vehiculos={vehiculos}
                showCalendar={showCalendar}
                onToggleCalendar={(show) => updateState(actions.setShowCalendar(show))}
                fechaEntrega={fechaEntrega}
                onDateSelect={(date) => updateState(actions.setPedidoData({ fechaEntrega: date }))}
                onSaveDate={asignarFecha}
                idVehiculo={idVehiculo}
                placa={placa}
                onVehicleSelect={handleVehicleSelect}
                onAssignVehicle={asignarConductorFunc}
            />

            <NovedadModal
                visible={modalNovedad}
                onClose={() => updateState(actions.setModalNovedad(false))}
                novedad={novedad}
                onNovedadChange={(text) => updateState(actions.setNovedad(text))}
                onSave={guardarNovedadInnactivo}
            />

            <FechaEntregaModal
                visible={modalFechaEntrega}
                onClose={() => updateState(actions.setModalFechaEntrega(false))}
                fechaEntrega={fechaEntrega}
                onDateSelect={(date) => updateState(actions.setPedidoData({ fechaEntrega: date }))}
                onSave={asignarFecha}
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
            <Toast />
        </View>
    );
};

export default Pedido;
