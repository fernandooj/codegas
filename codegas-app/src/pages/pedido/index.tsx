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
    StatusBar,
    Modal
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
    cambiarEstadoPedido,
    finalizarPedido,
    resetPedido
} from '../../redux/actions/pedidoActions';
import { getVehiculos } from '../../redux/actions/vehiculoActions';

import { DataContext } from "../../context/context";
import { style } from './style';
import { setupCalendarLocale } from '../../utils/calendar';
import { formatCurrency } from '../../utils/number';
import { usePedidoState } from './usePedidoState';
import { colors, estadoColors, estadoBackgroundColors } from '../../utils/colors';
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
import CerrarPedidoModal from './CerrarPedidoModal';
import ModalOrdenamiento from './ModalOrdenamiento';
import ModalEstadisticas from './ModalEstadisticas';

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
        modalCerrarPedido,
        modalOrdenamiento,
        modalResetPedido,
        terminoBuscador,
        showSearch,
        searchLoading,
        final,
        limit,
        elevation,
        showSpin,
        showSpin1,
        bounces,
        showCalendar,
        novedad,
        estadoFiltro,
        ordenPor,
        tipoOrden,
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
            textEstado,
            imagenCerrar,
            coordenadas,
            nombre,
            codt,
            puntoId,
            valor_unitarioUsuario,
            punto_email,
            punto_celular,
            punto_nombre
        }
    } = state;


    // Estados locales
    const [idUsuario, setIdUsuario] = useState<string | undefined>();
    const [acceso, setAcceso] = useState<AccesoUsuario | undefined>();
    const [pedidoIdParaCerrar, setPedidoIdParaCerrar] = useState<string | undefined>(); // Estado para el ID del pedido
    const [valorUnitarioParaCerrar, setValorUnitarioParaCerrar] = useState<string | undefined>(); // Estado para el valor unitario del pedido
    const [modalEstadisticas, setModalEstadisticas] = useState<boolean>(false); // Estado para el modal de estadísticas
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

        // Solo cargar pedidos si tenemos los datos necesarios
        if (idUsuario && acceso) {
            // Si es conductor, establecer filtro por defecto a "asignado"
            if (acceso === 'conductor' && estadoFiltro === 'todos') {
                updateState(actions.setEstadoFiltro('asignado'));
            }

            // Delay mínimo para evitar cargas múltiples
            const timeoutId = setTimeout(() => {
                loadPedidos('load');
            }, 50);

            return () => clearTimeout(timeoutId);
        }

        return () => {
            keyboardDidShowListener.current?.remove();
            keyboardDidHideListener.current?.remove();
        };
    }, [context]);

    useEffect(() => {
        updateState(actions.setPedidosFiltro(pedidos));
        // Ocultar spinner cuando lleguen los pedidos
        if (pedidos && pedidos.length >= 0) {
            updateState(actions.setShowSpin1(false));
        }
    }, [pedidos, updateState, actions]);

    // Removido - duplicado con el primer useEffect

    useEffect(() => {
        if (!terminoBuscador && showSearch) {
            updateState(actions.setShowSearch(false));
        }
    }, [terminoBuscador, showSearch, updateState, actions]);

    // Effect optimizado para búsqueda en tiempo real con debounce
    useEffect(() => {
        if (!idUsuario || !acceso) return;

        // Si hay término de búsqueda, implementar debounce
        if (terminoBuscador && terminoBuscador.length >= 2) {
            const searchTimeout = setTimeout(() => {
                updateState(actions.setShowSearch(true));
                updateState(actions.setSearchLoading(true));
                // Limpiar pedidos inmediatamente para evitar mostrar resultados antiguos
                dispatch({
                    type: 'GET_PEDIDOS',
                    pedidos: []
                });

                // Realizar la búsqueda
                dispatch(getPedidos(idUsuario, 0, 10, acceso, terminoBuscador, estadoFiltro, ordenPor, tipoOrden))
                    .finally(() => {
                        updateState(actions.setSearchLoading(false));
                    });
            }, 150); // Debounce optimizado para mejor experiencia

            return () => clearTimeout(searchTimeout);
        }
        // Si no hay término de búsqueda y estaba en búsqueda, recargar todos
        else if (terminoBuscador === '' && showSearch) {
            updateState(actions.setShowSearch(false));
            updateState(actions.setSearchLoading(true));
            dispatch({
                type: 'GET_PEDIDOS',
                pedidos: []
            });
            dispatch(getPedidos(idUsuario, 0, 20, acceso, undefined, estadoFiltro, ordenPor, tipoOrden))
                .finally(() => {
                    updateState(actions.setSearchLoading(false));
                });
        }
    }, [terminoBuscador]); // Solo reaccionar a cambios en el término de búsqueda

    // Effect optimizado para filtros y ordenamiento
    useEffect(() => {
        if (!idUsuario || !acceso) return;

        // Mostrar indicador de carga
        updateState(actions.setShowSpin1(true));

        // Limpiar pedidos primero
        dispatch({
            type: 'GET_PEDIDOS',
            pedidos: []
        });

        // Reiniciar paginación y limpiar estado
        updateState(actions.setInicio(0));
        updateState(actions.setFinal(false));
        updateState(actions.setLimit(10));

        // Cargar pedidos inmediatamente sin delay
        const loadPedidosWithFilters = async () => {
            try {
                await dispatch(getPedidos(idUsuario, 0, 10, acceso, terminoBuscador, estadoFiltro, ordenPor, tipoOrden));
            } catch (error) {
                console.error('Error cargando pedidos:', error);
                Alert.alert(
                    'Funcionalidad no disponible',
                    'Los filtros y ordenamiento requieren actualizar el servidor. Mostrando todos los pedidos.',
                    [{ text: 'OK' }]
                );
                // Resetear a valores por defecto
                updateState(actions.setEstadoFiltro('todos'));
                updateState(actions.setOrdenPor('fecha_creacion'));
                updateState(actions.setTipoOrden('DESC'));
                // Cargar pedidos con valores por defecto
                await dispatch(getPedidos(idUsuario, 0, 20, acceso, terminoBuscador, 'todos', 'fecha_creacion', 'DESC'));
            } finally {
                // Ocultar indicador de carga
                updateState(actions.setShowSpin1(false));
            }
        };

        loadPedidosWithFilters();
    }, [estadoFiltro, ordenPor, tipoOrden]); // Solo reaccionar a cambios en filtros y ordenamiento

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
        return estadoColors[estado] || estadoColors.default;
    };

    const getEstadoBackgroundColor = (estado: EstadoPedido): string => {
        return estadoBackgroundColors[estado] || estadoBackgroundColors.default;
    };

    const getPedidoBackgroundColor = (pedido: PedidoType): string => {
        if (pedido.estado === "espera") return colors.espera;
        if (pedido.estado === "noentregado") return colors.noentregado;
        if (pedido.estado === "innactivo") return colors.innactivo;
        // Si está activo y no entregado
        if (pedido.estado === "activo" && !pedido.entregado) {
            // Si tiene conductor Y fecha de entrega -> Color naranja (asignado)
            if (pedido.conductor && pedido.fechaentrega) return colors.asignado;
            // Si no tiene conductor o no tiene fecha -> Color amarillo (activo)
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
        const updateData: any = { estado: nuevoEstado };

        // Si el nuevo estado es "activo", establecer estadoEntrega según si tiene fecha
        if (nuevoEstado === "activo") {
            updateData.estadoEntrega = fechaEntrega ? "asignado" : "activo";
        }

        updateState(actions.setPedidoData(updateData));
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

        // Optimización: usar valores por defecto más eficientes
        const currentLimit = type === 'load' ? 10 : limit || 10;
        const currentStart = 0; // Siempre empezar desde 0
        const currentTerminoBuscador = type === 'load' ? undefined : terminoBuscador;

        // Solo mostrar spinner si es una carga inicial
        if (type === 'load') {
            updateState(actions.setShowSpin1(true));
        }

        dispatch(getPedidos(idUsuario, currentStart, currentLimit, acceso, currentTerminoBuscador, estadoFiltro, ordenPor, tipoOrden));
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
                        updateState(actions.setPedidoData({ estadoEntrega: fechaEntrega ? "asignado" : "activo" }));
                    } else {
                        // Ya no se abre el modal de fecha al cambiar estado
                        updateState(actions.setPedidoData({ estadoEntrega: fechaEntrega ? "asignado" : "activo" }));
                        Alert.alert('Éxito', 'Pedido actualizado correctamente');
                        loadPedidos();
                    }
                } else if (estado == "innactivo") {
                    updateState(actions.setModalNovedad(true));
                } else {
                    Alert.alert('Éxito', 'Pedido actualizado correctamente');
                    loadPedidos();
                }
            } else {
                Alert.alert('Error', 'Tenemos un problema, intentelo mas tarde');
            }
        } catch (error) {
            console.error('Error cambiando estado del pedido:', error);
            Alert.alert('Error', 'Error al cambiar el estado del pedido');
        }
    };

    const guardarNovedadInnactivo = async (): Promise<void> => {
        try {

            if (!novedad || novedad.trim() === '') {
                Alert.alert('Error', 'Ingresa una novedad antes de guardar');
                return;
            }

            // Obtener el ID del usuario logueado desde el contexto
            const { userId: usuarioId } = context;

            const res2 = await guardarNovedadInactivo(id, novedad, usuarioId as any, 'inactivo');
            updateState(actions.setModalNovedad(false));
            updateState(actions.setPedidoData({ estadoEntrega: "noentregado" }));
            updateState(actions.setNovedad(""));
            setTimeout(() => {
                Alert.alert('Éxito', 'Pedido actualizado correctamente');
            }, 500);
            loadPedidos();
        } catch (error) {
            console.error('Error guardando novedad inactivo:', error);
            Alert.alert('Error', 'Error al guardar novedad');
        }
    };

    const cancelarPedidoCliente = async (): Promise<void> => {
        const { nombre: nombreUsuario, user } = context;
        const nombreFinal = nombreUsuario || user?.nombre || razon_social || 'Usuario';
        const ahora = moment().format('DD/MM/YYYY HH:mm:ss');
        const mensajeCancelacion = `El usuario ${nombreFinal} canceló su pedido el ${ahora}`;

        // Mostrar confirmación antes de cancelar
        Alert.alert(
            'Confirmar cancelación',
            '¿Está seguro de que desea cancelar este pedido? Esta acción no se puede revertir.',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Preparar los datos para cambiar el estado
                            const datosCancelacion = [{
                                _id: id,
                                estado: 'innactivo',
                                motivo_no_cierre: 'cliente cerro el pedido'
                            }];

                            // Llamar al API para cambiar el estado usando Redux
                            const result = await cambiarEstadoPedido(datosCancelacion);

                            if (result.status) {
                                // Mostrar mensaje de éxito
                                Toast.show({
                                    type: 'success',
                                    text1: 'Pedido cancelado',
                                    text2: 'El pedido ha sido cancelado exitosamente',
                                    visibilityTime: 3000,
                                });

                                // Cerrar el modal y refrescar los datos
                                closePedidoModal();
                                setTimeout(() => {
                                    dispatch(getPedidos(idUsuario, 0, 20, acceso, terminoBuscador, estadoFiltro, ordenPor, tipoOrden));
                                }, 1000);
                            } else {
                                throw new Error('Error en la respuesta del servidor');
                            }
                        } catch (error) {
                            console.error('Error cancelando pedido:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error al cancelar',
                                text2: 'No se pudo cancelar el pedido. Inténtalo de nuevo.',
                                visibilityTime: 3000,
                            });
                        }
                    }
                }
            ]
        );
    };

    const handleCerrarPedido = async (data: any, pedidoId?: string): Promise<void> => {
        const { kilos, factura, valor_total, remision, forma_pago, novedad, imagen } = data;
        const { email, tokenPhone } = context.user || {};

        // Mostrar confirmación
        Alert.alert(
            'Confirmar cierre de pedido',
            '¿Está seguro de que desea cerrar este pedido?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => confirmarCierrePedido(data, pedidoId)
                }
            ]
        );
    };

    const confirmarCierrePedido = async (data: any, pedidoId?: string): Promise<void> => {
        try {
            const { kilos, factura, valor_total, remision, forma_pago, novedad, imagen } = data;
            const { email, tokenPhone } = context.user || {};

            // Usar el pedidoId pasado como parámetro, el pedidoIdParaCerrar, o el id del estado como fallback
            const finalPedidoId = pedidoId || pedidoIdParaCerrar || id;


            if (!finalPedidoId || finalPedidoId === 'undefined') {
                Alert.alert('Error', 'No se pudo obtener el ID del pedido');
                return;
            }

            // Formatear la fechaEntrega correctamente
            const fechaFormateada = fechaEntrega
                ? moment(fechaEntrega).format('YYYY-MM-DD HH:mm:ss')
                : moment().format('YYYY-MM-DD HH:mm:ss');

            // Preparar datos para el backend
            const pedidoData = {
                email: email || '',
                idUsuario: idUsuario,
                kilos,
                factura,
                valor_total,
                forma_pago,
                fechaEntrega: fechaFormateada,
                remision,
                novedad: novedad || '',
                imagen: imagen || null
            };


            // Llamar al endpoint de finalizar pedido
            const response = await finalizarPedido(finalPedidoId, pedidoData);

            if (response.status) {
                // Cerrar todos los modales primero
                updateState(actions.setModalCerrarPedido(false));
                closePedidoModal();
                setPedidoIdParaCerrar(undefined);
                setValorUnitarioParaCerrar(undefined);

                // Luego mostrar alert y limpiar campos
                setTimeout(() => {
                    Alert.alert(
                        'Pedido cerrado exitosamente',
                        `Factura: ${factura}\nEl pedido ha sido finalizado correctamente`,
                        [{ text: 'OK' }]
                    );

                    // Limpiar todos los campos del formulario de cierre
                    updateState(actions.updateMultiple({
                        kilosTexto: '',
                        facturaTexto: '',
                        valor_totalTexto: '',
                        remisionTexto: '',
                        forma_pagoTexto: '',
                        novedad: '',
                        imagen: null
                    }));

                    loadPedidos();
                }, 300);
            } else {
                Alert.alert('Error', 'Tenemos un problema, inténtelo más tarde');
            }
        } catch (error) {
            console.error('Error cerrando pedido:', error);
            Alert.alert('Error', 'Ocurrió un error inesperado al cerrar el pedido');
        }
    };


    const handleGuardarNovedadCerrar = async (novedad: string, pedidoId?: string, motivoKey?: string): Promise<void> => {
        try {

            if (!novedad || novedad.trim() === '') {
                Alert.alert('Error', 'Ingresa una novedad antes de guardar');
                return;
            }

            // Obtener el ID del usuario logueado desde el contexto
            const { userId: usuarioId } = context;

            // Debug: Verificar qué IDs están disponibles
            console.log('🔍 [handleGuardarNovedadCerrar] IDs disponibles:');
            console.log('📋 id (selectedPedido):', id);
            console.log('📋 pedidoIdParaCerrar:', pedidoIdParaCerrar);
            console.log('📋 pedidoId (parámetro):', pedidoId);
            console.log('👤 usuarioId:', usuarioId);

            // Usar el ID del pedido disponible (prioridad: pedidoId > id > pedidoIdParaCerrar)
            const pedidoIdFinal = pedidoId || id || pedidoIdParaCerrar;

            if (!pedidoIdFinal || pedidoIdFinal === 'undefined') {
                Alert.alert('Error', 'No se pudo obtener el ID del pedido');
                return;
            }

            console.log('✅ [handleGuardarNovedadCerrar] Usando pedidoId:', pedidoIdFinal);

            // Usar la función correcta para guardar novedad inactivo
            const response = await guardarNovedadInactivo(
                pedidoIdFinal, // pedidoId
                novedad,
                usuarioId as any, // conductorId (ID del usuario logueado)
                motivoKey // motivo seleccionado
            );

            if (response.status) {
                // Cerrar modal de cerrar pedido
                updateState(actions.setModalCerrarPedido(false));

                Alert.alert('Éxito', 'Novedad guardada correctamente');

                // Recargar pedidos
                loadPedidos();
            } else {
                Alert.alert('Error', 'No se pudo guardar la novedad');
            }
        } catch (error) {
            console.error('Error guardando novedad:', error);
            Alert.alert('Error', 'Error al guardar novedad');
        }
    };

    const asignarConductorFunc = async (vehiculoData?: { _id: string, placa: string }): Promise<void> => {
        try {
            // Usar datos pasados como parámetro o del estado
            const finalIdVehiculo = vehiculoData?._id || idVehiculo;
            const finalPlaca = vehiculoData?.placa || placa;

            if (!finalIdVehiculo || !finalPlaca) {
                Alert.alert('Error', 'Selecciona un vehículo');
                return;
            }

            // Usar fecha actual si no hay fecha seleccionada
            const fechaParaAsignar = fechaEntrega || moment().format('YYYY-MM-DD HH:mm:ss');

            const response = await asignarConductor(id, finalIdVehiculo, fechaParaAsignar, idUsuario); // Usar idUsuario como usuarioAsigna

            if (response.status) {
                // Cerrar modal de vehículos
                updateState(actions.setModalConductor(false));

                // Abrir modal de fecha para seleccionar fecha de entrega
                updateState(actions.setModalFechaEntrega(true));

                // Recargar pedidos
                dispatch(getPedidos(idUsuario, 0, 10, acceso, undefined, estadoFiltro, ordenPor, tipoOrden));
            } else {
                Alert.alert('Error', 'No se pudo asignar el vehículo');
            }
        } catch (error) {
            console.error('Error asignando conductor:', error);
            Alert.alert('Error', 'Error al asignar el vehículo');
        }
    };

    const asignarFecha = async (fechaParam?: string): Promise<void> => {
        try {
            // Usar la fecha pasada como parámetro o la del estado
            const fechaAUsar = fechaParam || fechaEntrega;

            if (!fechaAUsar) {
                Alert.alert('Error', 'Selecciona una fecha');
                return;
            }

            // Si hay un vehículo asignado, actualizar la asignación con la nueva fecha
            if (idVehiculo && placa) {
                const fechaFormatted = moment(fechaAUsar).format('YYYY-MM-DD HH:mm:ss');

                // Llamar al endpoint de asignar conductor con la nueva fecha
                const response = await asignarConductor(id, idVehiculo, fechaFormatted, idUsuario);

                if (response.status) {
                    Alert.alert('Éxito', `Vehículo ${placa} asignado para el ${moment(fechaAUsar).format('DD/MM/YYYY')}`);

                    // Cerrar modal
                    updateState(actions.setModalFechaEntrega(false));
                    updateState(actions.setShowCalendar(false));

                    // Recargar pedidos
                    dispatch(getPedidos(idUsuario, 0, 10, acceso, undefined, estadoFiltro, ordenPor, tipoOrden));
                } else {
                    Alert.alert('Error', 'No se pudo actualizar la asignación del vehículo');
                }
            } else {
                // Si no hay vehículo asignado, solo asignar la fecha
                const fechaFormatted = moment(fechaAUsar).format('YYYY-MM-DD HH:mm:ss');
                const seleccionados = [{
                    _id: id,
                    fechaentrega: fechaFormatted
                }];

                const response = await asignarFechaEntrega(seleccionados);

                if (response.status) {
                    // Cerrar modal
                    updateState(actions.setModalFechaEntrega(false));
                    updateState(actions.setShowCalendar(false));

                    // Recargar pedidos
                    dispatch(getPedidos(idUsuario, 0, 10, acceso, undefined, estadoFiltro, ordenPor, tipoOrden));
                } else {
                    Alert.alert('Error', 'No se pudo asignar la fecha');
                }
            }
        } catch (error) {
            console.error('Error asignando fecha:', error);
            Alert.alert('Error', 'Error al asignar la fecha');
        }
    };

    const onScroll = (event: ScrollEvent) => {
        const shouldLoadMore = handleScrollPagination(event);
        if (shouldLoadMore) {
            loadPedidos();
        }
    };

    const handleResetPedido = async (): Promise<void> => {
        try {
            if (!id) {
                Alert.alert('Error', 'No se pudo obtener el ID del pedido');
                return;
            }

            console.log('🔍 Llamando al endpoint de reset para pedido:', id);
            const response = await resetPedido(id);
            console.log('🔍 Respuesta del endpoint:', response);

            if (response.status) {
                // Mostrar mensaje de éxito
                Toast.show({
                    type: 'success',
                    text1: 'Pedido reseteado',
                    text2: 'El pedido ha sido reseteado exitosamente',
                    visibilityTime: 3000,
                });

                // Cerrar el modal principal y recargar pedidos
                closePedidoModal();
                setTimeout(() => {
                    loadPedidos('load');
                }, 1000);
            } else {
                Alert.alert('Error', response.message || 'Error al resetear el pedido');
            }
        } catch (error) {
            console.error('Error reseteando pedido:', error);
            Alert.alert('Error', 'Error al resetear el pedido');
        }
    };

    // Render functions
    const renderPedidos = (): React.JSX.Element[] => {
        return pedidos.map((e: PedidoType, key: number) => {
            return (
                <TouchableOpacity
                    key={key}
                    style={[
                        style.pedidoCard,
                        {
                            backgroundColor: getPedidoBackgroundColor(e),
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
                            estadoEntrega: e.estado == "activo" ? (e.fechaentrega ? "asignado" : "activo") : undefined,
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
                            coordenadas: e.coordenadas ? {
                                x: e.coordenadas.x,
                                y: e.coordenadas.y,
                                lat: e.lat || e.coordenadas.y,
                                lng: e.lng || e.coordenadas.x
                            } : (e.lat && e.lng) ? {
                                lat: e.lat,
                                lng: e.lng
                            } : undefined,
                            punto_email: e.punto_email,
                            punto_celular: e.punto_celular,
                            punto_nombre: e.punto_nombre,
                            idVehiculo: e.idVehiculo,
                            placa: e.placa,
                        });
                    }}
                >
                    {/* Card content */}
                    <View style={style.pedidoCardHeader}>
                        <View style={style.pedidoCardHeaderRow}>
                            <FontAwesome name="building" style={style.pedidoCardBuildingIcon} />
                            <Text style={style.pedidoCardCompanyText}>
                                {e.razon_social}
                            </Text>
                        </View>

                        <View style={style.pedidoCardInfoRow}>
                            <View style={style.pedidoCardInfoLeft}>
                                <FontAwesome name="id-card" style={style.pedidoCardIdIcon} />
                                <Text style={style.pedidoCardCedulaText}>
                                    {e.cedula}
                                </Text>
                            </View>

                            <View style={[style.pedidoCardEstadoBadge, { backgroundColor: getEstadoColor(e.estado) }]}>
                                <FontAwesome
                                    name={e.estado === "activo" ? "check" : e.estado === "innactivo" ? "times" : "pause"}
                                    style={style.pedidoCardEstadoIcon}
                                />
                                <Text style={style.pedidoCardEstadoText}>
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
                    <View style={style.pedidoCardBody}>
                        {/* Primera fila: N° Pedido (25%) + Zona (75%) */}
                        <View style={style.pedidoCardRow}>
                            <View style={style.pedidoCardFieldSmall}>
                                <FontAwesome name="hashtag" style={style.pedidoCardIconHashtag} />
                                <View style={style.pedidoCardFieldContent}>
                                    <Text style={style.pedidoCardLabelText}>Pedido</Text>
                                    <Text style={style.pedidoCardValueSmall} numberOfLines={1}>
                                        {e._id}
                                    </Text>
                                </View>
                            </View>
                            <View style={style.pedidoCardFieldLarge}>
                                <FontAwesome name="map-marker" style={style.pedidoCardIconMarker} />
                                <View style={style.pedidoCardFieldContent}>
                                    <Text style={style.pedidoCardLabelText}>Zona</Text>
                                    <Text style={style.pedidoCardValueSmall} numberOfLines={2}>
                                        {e.zona || 'Sin zona'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Segunda fila: CODT (25%) + Dirección (75%) */}
                        <View style={style.pedidoCardRow}>
                            {e.codt ? (
                                <View style={style.pedidoCardFieldSmallStart}>
                                    <FontAwesome name="code" style={style.pedidoCardIconCode} />
                                    <View style={style.pedidoCardFieldContent}>
                                        <Text style={style.pedidoCardLabelText}>CODT</Text>
                                        <Text style={style.pedidoCardValue} numberOfLines={1}>
                                            {e.codt}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={style.pedidoCardFieldSpacer} />
                            )}
                            <View style={style.pedidoCardFieldLargeStart}>
                                <FontAwesome name="home" style={style.pedidoCardIconHome} />
                                <View style={style.pedidoCardFieldContent}>
                                    <Text style={style.pedidoCardLabelText}>Dirección entrega</Text>
                                    <Text style={style.pedidoCardValueAddress} numberOfLines={2}>
                                        {e.direccion || "Sin dirección"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>


                    <View style={style.pedidoCardInfoPanel}>
                        {e.fechasolicitud && (
                            <View style={style.pedidoCardInfoItem}>
                                <Text style={style.pedidoCardInfoItemLabel}>Solicitud</Text>
                                <Text style={style.pedidoCardInfoItemValue}>
                                    {moment(e.fechasolicitud).format('DD/MM/YY')}
                                </Text>
                            </View>
                        )}

                        {e.fechaentrega && (
                            <View style={style.pedidoCardInfoItem}>
                                <Text style={style.pedidoCardInfoItemLabel}>Entrega</Text>
                                <Text style={style.pedidoCardInfoItemValueEntrega}>
                                    {moment(e.fechaentrega).format('DD/MM/YY')}
                                </Text>
                            </View>
                        )}

                        {e.valorunitario && (
                            <View style={style.pedidoCardInfoItem}>
                                <Text style={style.pedidoCardInfoItemLabel}>Precio</Text>
                                <Text style={style.pedidoCardInfoItemValuePrecio}>
                                    {formatCurrency(e.valorunitario)}
                                </Text>
                            </View>
                        )}

                        {e.capacidad && (
                            <View style={style.pedidoCardInfoItem}>
                                <Text style={style.pedidoCardInfoItemLabel}>Cantidad</Text>
                                <Text style={style.pedidoCardInfoItemValue}>
                                    {e.capacidad} Gal
                                </Text>
                            </View>
                        )}

                        {e.factura && (
                            <View style={style.pedidoCardInfoItem}>
                                <Text style={style.pedidoCardInfoItemLabel}>Factura</Text>
                                <Text style={style.pedidoCardInfoItemValueFactura}>
                                    #{e.factura}
                                </Text>
                            </View>
                        )}
                    </View>


                    {(e.conductor && acceso !== "conductor") && (
                        <View style={style.pedidoCardVehicleBox}>
                            <FontAwesome name="truck" style={style.pedidoCardVehicleIcon} />
                            <View style={style.pedidoCardVehicleContent}>
                                <Text style={style.pedidoCardVehicleLabel}>Vehículo Asignado</Text>
                                <Text style={style.pedidoCardVehicleValue}>
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
            <View style={[style.headerContainer, { paddingTop: getStatusBarHeight() }]}>
                {/* Header con mejor espaciado */}
                <View style={style.headerTitleContainer}>
                    <View style={style.headerTitleLeft}>
                        <View style={style.headerTitleWrapper}>
                            <Text style={style.headerTitle}>
                                {acceso === 'conductor' ? 'Mis Pedidos' : 'Pedidos'}
                            </Text>
                            {pedidos && (
                                <Text style={style.headerSubtitle}>
                                    {acceso === 'conductor'
                                        ? `${pedidos.length} pedidos asignados`
                                        : `${pedidos.length} pedidos ${estadoFiltro !== 'todos' ? `(${estadoFiltro})` : 'encontrados'}`
                                    }
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={style.headerButtonGroup}>
                        {/* Botón de estadísticas - Solo visible para admin y conductor */}
                        {(acceso === 'admin' || acceso === 'conductor') && (
                            <TouchableOpacity
                                style={[style.headerButton, { backgroundColor: '#17a2b8' }]}
                                onPress={() => setModalEstadisticas(true)}
                                activeOpacity={0.8}
                            >
                                <FontAwesome name='bar-chart' style={style.headerIcon} />
                            </TouchableOpacity>
                        )}

                        {/* Botón de ordenamiento */}
                        <TouchableOpacity
                            style={[style.headerButton, { backgroundColor: '#28a745' }]}
                            onPress={() => updateState(actions.setModalOrdenamiento(true))}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name='sort' style={style.headerIcon} />
                        </TouchableOpacity>

                        {/* Botón de actualizar */}
                        <TouchableOpacity
                            style={[style.headerButton, { backgroundColor: '#007bff' }]}
                            onPress={() => loadPedidos('load')}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name='refresh' style={style.headerIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Barra de búsqueda con mejor diseño */}
                {acceso !== "conductor" && (
                    <View style={style.searchBarContainer}>
                        <View style={[style.searchBar, showSearch && terminoBuscador ? style.searchBarActive : style.searchBarInactive]}>
                            <FontAwesome name='search' style={style.searchIconStyle} />
                            <TextInput
                                placeholder="Escribir para buscar..."
                                placeholderTextColor="#999"
                                autoCapitalize='none'
                                onChangeText={(terminoBuscador) => updateState(actions.setTerminoBuscador(terminoBuscador))}
                                value={terminoBuscador}
                                style={style.searchInputStyle}
                            />

                            {terminoBuscador ? (
                                <TouchableOpacity
                                    style={style.searchClearButton}
                                    onPress={() => {
                                        updateState(actions.setTerminoBuscador(''));
                                        updateState(actions.setShowSearch(false));
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome name='times' style={style.searchClearIcon} />
                                </TouchableOpacity>
                            ) : searchLoading ? (
                                <View style={style.searchLoadingContainer}>
                                    <ActivityIndicator size="small" color="#007bff" />
                                </View>
                            ) : null}
                        </View>
                    </View>
                )}

                {/* Botones de filtro por estado */}
                {acceso !== "conductor" && (
                    <View style={style.filterContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={style.filterScrollContent}
                        >
                            {/* Botón Todos */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterTodos, estadoFiltro === 'todos' && style.filterTodosActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('todos'))}
                            >
                                <Text style={[style.filterButtonText, style.filterTodosText, estadoFiltro === 'todos' && style.filterTextActive]}>
                                    Todos
                                </Text>
                            </TouchableOpacity>

                            {/* Botón Espera */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterEspera, estadoFiltro === 'espera' && style.filterEsperaActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('espera'))}
                            >
                                <Text style={[style.filterButtonText, style.filterEsperaText, estadoFiltro === 'espera' && style.filterTextActive]}>
                                    Espera
                                </Text>
                            </TouchableOpacity>

                            {/* Botón Activo */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterActivo, estadoFiltro === 'activo' && style.filterActivoActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('activo'))}
                            >
                                <Text style={[style.filterButtonText, style.filterActivoText, estadoFiltro === 'activo' && style.filterTextActive]}>
                                    Activo
                                </Text>
                            </TouchableOpacity>

                            {/* Botón Asignado */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterAsignado, estadoFiltro === 'asignado' ? style.filterAsignadoActive : style.filterAsignadoInactive]}
                                onPress={() => updateState(actions.setEstadoFiltro('asignado'))}
                            >
                                <Text style={[style.filterButtonText, style.filterAsignadoText, estadoFiltro === 'asignado' && style.filterTextActive]}>
                                    Asignado
                                </Text>
                            </TouchableOpacity>

                            {/* Botón Inactivo */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterInnactivo, estadoFiltro === 'innactivo' && style.filterInnactivoActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('innactivo'))}
                            >
                                <Text style={[style.filterButtonText, style.filterInnactivoText, estadoFiltro === 'innactivo' && style.filterTextActive]}>
                                    Inactivo
                                </Text>
                            </TouchableOpacity>

                            {/* Botón No Entregado */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterNoEntregado, estadoFiltro === 'noentregado' && style.filterNoEntregadoActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('noentregado'))}
                            >
                                <Text style={[style.filterButtonText, style.filterNoEntregadoText, estadoFiltro === 'noentregado' && style.filterTextActive]}>
                                    No Entregado
                                </Text>
                            </TouchableOpacity>

                            {/* Botón Otro */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterOtro, estadoFiltro === 'otro' ? style.filterOtroActive : style.filterOtroInactive]}
                                onPress={() => updateState(actions.setEstadoFiltro('otro'))}
                            >
                                <Text style={[style.filterButtonText, style.filterOtroText, estadoFiltro === 'otro' && style.filterTextActive]}>
                                    Cerrados
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}

                {/* Botones de filtro para conductores */}
                {acceso === "conductor" && (
                    <View style={style.filterContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={style.filterScrollContent}
                        >
                            {/* Botón Asignado */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterAsignado, estadoFiltro === 'asignado' && style.filterAsignadoActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('asignado'))}
                            >
                                <Text style={[style.filterButtonText, style.filterAsignadoText, estadoFiltro === 'asignado' && style.filterTextActive]}>
                                    Asignados
                                </Text>
                            </TouchableOpacity>

                            {/* Botón No Entregado */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterNoEntregado, estadoFiltro === 'noentregado' && style.filterNoEntregadoActive]}
                                onPress={() => updateState(actions.setEstadoFiltro('noentregado'))}
                            >
                                <Text style={[style.filterButtonText, style.filterNoEntregadoText, estadoFiltro === 'noentregado' && style.filterTextActive]}>
                                    No Entregados
                                </Text>
                            </TouchableOpacity>

                            {/* Botón Cerrados */}
                            <TouchableOpacity
                                style={[style.filterButtonBase, style.filterOtro, estadoFiltro === 'otro' ? style.filterOtroActive : style.filterOtroInactive]}
                                onPress={() => updateState(actions.setEstadoFiltro('otro'))}
                            >
                                <Text style={[style.filterButtonText, style.filterOtroText, estadoFiltro === 'otro' && style.filterTextActive]}>
                                    Entregados
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
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
                    perfil_novedad,
                    imagenCerrar,
                    coordenadas,
                    nombre,
                    codt,
                    puntoId,
                    punto_email,
                    punto_celular,
                    punto_nombre
                }}
                acceso={acceso}
                navigation={navigation}
                getEstadoColor={getEstadoColor}
                getEstadoBackgroundColor={getEstadoBackgroundColor}
                onChangeState={handleChangeStateModal}
                onAssignVehicle={() => updateState(actions.setModalConductor(true))}
                onCancelOrder={cancelarPedidoCliente}
                onResetPedido={() => {
                    // Primero cerrar el modal de editar pedido
                    closePedidoModal();
                    // Mostrar directamente el Alert de confirmación
                    setTimeout(() => {
                        Alert.alert(
                            'Resetear Pedido',
                            `¿Está seguro de que desea resetear este pedido?\n\nPedido: ${id || 'Sin ID'}\nCliente: ${razon_social || 'Sin cliente'}\n\nEsta acción eliminará todos los datos del pedido excepto la información básica y lo volverá al estado "Espera".`,
                            [
                                {
                                    text: 'Cancelar',
                                    style: 'cancel'
                                },
                                {
                                    text: 'Sí, Resetear',
                                    style: 'destructive',
                                    onPress: handleResetPedido
                                }
                            ]
                        );
                    }, 300);
                }}
                onClosePedido={() => {
                    // Capturar el ID del pedido y valor unitario
                    setPedidoIdParaCerrar(id);
                    setValorUnitarioParaCerrar(valor_unitarioUsuario?.toString());

                    // Abrir el modal de cerrar pedido SIN cerrar el modal principal
                    updateState(actions.setModalCerrarPedido(true));
                }}
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
                fechaEntregaModal={fechaEntrega}
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
                // Props para CerrarPedidoModal
                modalCerrarPedido={modalCerrarPedido}
                onCloseCerrarPedido={() => {
                    updateState(actions.setModalCerrarPedido(false));
                    setPedidoIdParaCerrar(undefined);
                    setValorUnitarioParaCerrar(undefined);
                }}
                onCerrarPedido={handleCerrarPedido}
                onGuardarNovedad={handleGuardarNovedadCerrar}
                valorUnitario={valorUnitarioParaCerrar}
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
                scrollEnabled={!(modalConductor || modalFechaEntrega || modalNovedad || modalPerfiles || modalCerrarPedido || modalOrdenamiento || modalResetPedido)}
            >
                {showSpin1 || !pedidos || (searchLoading && pedidos.length === 0) ? (
                    <View style={[style.loadingContainerMain, {
                        paddingVertical: showSpin1 ? 20 : 40,
                        marginTop: showSpin1 ? 10 : 20,
                    }]}>
                        <ActivityIndicator
                            size="large"
                            color="#0071bb"
                            style={showSpin1 ? style.loadingIndicatorSmall : style.loadingIndicatorLarge}
                        />
                        <Text style={showSpin1 ? style.loadingTextSmall : style.loadingTextLarge}>
                            {searchLoading ? 'Buscando...' : showSpin1 ? 'Cargando pedidos...' : 'Inicializando...'}
                        </Text>
                        <Text style={showSpin1 ? style.loadingSubtextSmall : style.loadingSubtextContainer}>
                            {searchLoading
                                ? `Buscando "${terminoBuscador}"...`
                                : showSpin1
                                    ? (estadoFiltro === 'todos' ? 'Obteniendo todos los pedidos' : `Filtrando por "${estadoFiltro}"`)
                                    : 'Preparando la lista de pedidos'
                            }
                        </Text>
                    </View>
                ) : pedidos.length == 0 ? (
                    <View style={style.emptyStateContainer}>
                        <View style={style.emptyStateIconContainer}>
                            <FontAwesome
                                name="inbox"
                                size={48}
                                style={style.emptyStateIcon}
                            />
                        </View>
                        <Text style={style.emptyStateTitle}>
                            {showSearch
                                ? 'Sin resultados'
                                : estadoFiltro === 'todos'
                                    ? 'No hay pedidos'
                                    : `Sin pedidos ${estadoFiltro}`
                            }
                        </Text>
                        <Text style={style.emptyStateSubtitle}>
                            {showSearch
                                ? `No se encontraron pedidos para "${terminoBuscador}"`
                                : estadoFiltro === 'todos'
                                    ? 'No se encontraron pedidos en el sistema'
                                    : `No hay pedidos en estado "${estadoFiltro}"`
                            }
                        </Text>
                        <View style={style.emptyStateDivider} />
                        <Text style={style.emptyStateHint}>
                            Los nuevos pedidos aparecerán aquí automáticamente
                        </Text>
                    </View>
                ) : (
                    renderPedidos()
                )}
            </ScrollView>

            {showSpin && (
                <View style={style.loadingPaginationContainer}>
                    <ActivityIndicator
                        size="small"
                        color="#0071bb"
                        style={style.loadingIndicatorSmall}
                    />
                    <Text style={style.loadingTextPagination}>
                        Cargando más pedidos...
                    </Text>
                </View>
            )}
            <Footer navigation={navigation} />
            <Toast
                config={{
                    success: (internalState) => (
                        <View style={style.toastSuccessContainer}>
                            <Text style={style.toastTextPrimary}>
                                ✅ {internalState.text1}
                            </Text>
                            {internalState.text2 && (
                                <Text style={style.toastTextSecondary}>
                                    {internalState.text2}
                                </Text>
                            )}
                        </View>
                    ),
                    error: (internalState) => (
                        <View style={style.toastErrorContainer}>
                            <Text style={style.toastTextPrimary}>
                                ❌ {internalState.text1}
                            </Text>
                            {internalState.text2 && (
                                <Text style={style.toastTextSecondary}>
                                    {internalState.text2}
                                </Text>
                            )}
                        </View>
                    )
                }}
            />

            {/* Modal de Ordenamiento */}
            <ModalOrdenamiento
                visible={modalOrdenamiento}
                onClose={() => updateState(actions.setModalOrdenamiento(false))}
                ordenPor={ordenPor}
                tipoOrden={tipoOrden}
                onOrdenPorChange={(ordenPor) => updateState(actions.setOrdenPor(ordenPor))}
                onTipoOrdenChange={(tipoOrden) => updateState(actions.setTipoOrden(tipoOrden))}
                onApply={async () => {
                    updateState(actions.setModalOrdenamiento(false));
                }}
            />

            {/* Modal de Estadísticas */}
            <ModalEstadisticas
                visible={modalEstadisticas}
                onClose={() => setModalEstadisticas(false)}
                conductorId={acceso === 'conductor' ? parseInt(idUsuario || '0') : null}
                acceso={acceso}
            />

        </View>
    );
};

export default Pedido;
