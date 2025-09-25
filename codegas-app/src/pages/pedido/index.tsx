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
    finalizarPedido
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
            valor_unitarioUsuario
        }
    } = state;


    // Estados locales
    const [idUsuario, setIdUsuario] = useState<string | undefined>();
    const [acceso, setAcceso] = useState<AccesoUsuario | undefined>();
    const [pedidoIdParaCerrar, setPedidoIdParaCerrar] = useState<string | undefined>(); // Estado para el ID del pedido
    const [valorUnitarioParaCerrar, setValorUnitarioParaCerrar] = useState<string | undefined>(); // Estado para el valor unitario del pedido
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
                // Solo limpiar pedidos si hay búsqueda activa
                dispatch({
                    type: 'GET_PEDIDOS',
                    pedidos: []
                });
                dispatch(getPedidos(idUsuario, 0, 20, acceso, terminoBuscador, estadoFiltro, ordenPor, tipoOrden));
            }, 300); // Debounce reducido de 500ms a 300ms

            return () => clearTimeout(searchTimeout);
        }
        // Si no hay término de búsqueda y estaba en búsqueda, recargar todos
        else if (terminoBuscador === '' && showSearch) {
            updateState(actions.setShowSearch(false));
            dispatch({
                type: 'GET_PEDIDOS',
                pedidos: []
            });
            dispatch(getPedidos(idUsuario, 0, 20, acceso, undefined, estadoFiltro, ordenPor, tipoOrden));
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
        updateState(actions.setLimit(20));

        // Cargar pedidos inmediatamente sin delay
        const loadPedidosWithFilters = async () => {
            try {
                await dispatch(getPedidos(idUsuario, 0, 20, acceso, terminoBuscador, estadoFiltro, ordenPor, tipoOrden));
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
        const currentLimit = type === 'load' ? 20 : limit || 20;
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

            const res2 = await guardarNovedadInactivo(id, novedad);
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
                                estado: 'noentregado',
                                motivo_no_cierre: 'cliente cancela pedido'
                            }];

                            // Llamar al API para cambiar el estado
                            const response = await fetch('https://api.codegascolombia.com/pedidos/cambiar-estado-pedido', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    seleccionados: datosCancelacion
                                })
                            });

                            const result = await response.json();

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
                                    getPedidos();
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

            // Preparar datos para el backend
            const pedidoData = {
                email: email || '',
                idUsuario: idUsuario,
                kilos,
                factura,
                valor_total,
                forma_pago,
                fechaEntrega: fechaEntrega || moment().format('YYYY-MM-DD HH:mm:ss'),
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


    const handleGuardarNovedadCerrar = async (novedad: string): Promise<void> => {
        try {

            if (!novedad || novedad.trim() === '') {
                Alert.alert('Error', 'Ingresa una novedad antes de guardar');
                return;
            }

            // Usar la función correcta para guardar novedad al cerrar pedido
            const response = await guardarNovedadCerrarPedido(
                id,
                fechaEntrega || moment().format('YYYY-MM-DD HH:mm:ss'),
                novedad,
                'logistica', // perfil por defecto
                null // conductorId
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
                Alert.alert('Éxito', `Vehículo ${finalPlaca} asignado correctamente`);

                // Cerrar modal y resetear datos
                updateState(actions.setModalConductor(false));
                updateState(actions.setPedidoData({ placa: null, idVehiculo: null }));

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

            // Formatear la fecha como espera el backend
            const fechaFormatted = moment(fechaAUsar).format('YYYY-MM-DD HH:mm:ss');
            const seleccionados = [{
                _id: id,
                fechaentrega: fechaFormatted
            }];


            const response = await asignarFechaEntrega(seleccionados);

            if (response.status) {
                // No mostrar Alert aquí porque ya se muestra en el modal

                // Cerrar modal
                updateState(actions.setModalFechaEntrega(false));
                updateState(actions.setShowCalendar(false));

                // Recargar pedidos - CORREGIR EL PARÁMETRO 'load'
                dispatch(getPedidos(idUsuario, 0, 10, acceso, undefined, estadoFiltro, ordenPor, tipoOrden));
            } else {
                Alert.alert('Error', 'No se pudo asignar la fecha');
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
                            marginHorizontal: 8, // Reducido de 15 a 8 para más cercanía a los bordes
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
                            <Text style={{ fontSize: 15, fontWeight: '600', color: '#333', flex: 1, lineHeight: 18 }}>
                                {e.razon_social}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <FontAwesome name="id-card" style={{ fontSize: 12, color: '#6c757d', marginRight: 6 }} />
                                <Text style={{ fontSize: 13, color: '#6c757d' }}>
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
                        {/* Primera fila: N° Pedido (25%) + Zona (75%) */}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="hashtag" style={{ fontSize: 12, color: '#007bff', marginRight: 6 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>N° Pedido</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#333' }} numberOfLines={1}>
                                        {e._id}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="map-marker" style={{ fontSize: 12, color: '#dc3545', marginRight: 6 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Zona</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#333' }} numberOfLines={2}>
                                        {e.zona || 'Sin zona'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Segunda fila: CODT (25%) + Dirección (75%) */}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {e.codt ? (
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <FontAwesome name="code" style={{ fontSize: 12, color: '#6f42c1', marginRight: 6, marginTop: 2 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>CODT</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#333' }} numberOfLines={1}>
                                            {e.codt}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={{ flex: 1 }} />
                            )}
                            <View style={{ flex: 3, flexDirection: 'row', alignItems: 'flex-start' }}>
                                <FontAwesome name="home" style={{ fontSize: 12, color: '#28a745', marginRight: 6, marginTop: 2 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Dirección</Text>
                                    <Text style={{ fontSize: 12, color: '#333' }} numberOfLines={2}>
                                        {e.direccion || "Sin dirección"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {acceso !== "conductor" && (
                        <View style={{
                            backgroundColor: '#ffffff', // Color de fondo más específico
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
                                {pedidos.length} pedidos {estadoFiltro !== 'todos' ? `(${estadoFiltro})` : 'encontrados'}
                            </Text>
                        )}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {/* Botón de ordenamiento */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#28a745',
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
                            onPress={() => updateState(actions.setModalOrdenamiento(true))}
                            activeOpacity={0.8}
                        >
                            <FontAwesome name='sort' style={{
                                fontSize: 14,
                                color: '#fff'
                            }} />
                        </TouchableOpacity>

                        {/* Botón de actualizar */}
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
                </View>

                {/* Barra de búsqueda con mejor diseño */}
                {acceso !== "conductor" && (
                    <View style={{
                        marginHorizontal: 20, // Margen para que no toque los bordes
                    }}>
                        <View style={{
                            backgroundColor: '#fff', // Ya tiene backgroundColor sólido
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
                                        backgroundColor: '#dc3545', // Ya tiene backgroundColor sólido
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

                {/* Botones de filtro por estado */}
                <View style={{
                    marginHorizontal: 20,
                    marginTop: 12,
                }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 4,
                            gap: 8
                        }}
                    >
                        {/* Botón Todos */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#007bff',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'todos' ? 4 : 1,
                                borderColor: estadoFiltro === 'todos' ? '#fff' : 'rgba(0, 123, 255, 0.3)',
                                shadowColor: estadoFiltro === 'todos' ? '#007bff' : '#000',
                                shadowOffset: { width: 0, height: estadoFiltro === 'todos' ? 3 : 1 },
                                shadowOpacity: estadoFiltro === 'todos' ? 0.4 : 0.1,
                                shadowRadius: estadoFiltro === 'todos' ? 6 : 2,
                                elevation: estadoFiltro === 'todos' ? 8 : 2,
                                transform: estadoFiltro === 'todos' ? [{ scale: 1.05 }] : [{ scale: 1 }],
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('todos'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'todos' ? '700' : '600',
                                color: '#fff'
                            }}>
                                Todos
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Espera */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(91, 192, 222, 1)',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'espera' ? 4 : 1,
                                borderColor: estadoFiltro === 'espera' ? '#fff' : 'rgba(91, 192, 222, 0.3)',
                                shadowColor: estadoFiltro === 'espera' ? 'rgba(91, 192, 222, 1)' : '#000',
                                shadowOffset: { width: 0, height: estadoFiltro === 'espera' ? 3 : 1 },
                                shadowOpacity: estadoFiltro === 'espera' ? 0.4 : 0.1,
                                shadowRadius: estadoFiltro === 'espera' ? 6 : 2,
                                elevation: estadoFiltro === 'espera' ? 8 : 2,
                                transform: estadoFiltro === 'espera' ? [{ scale: 1.05 }] : [{ scale: 1 }],
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('espera'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'espera' ? '700' : '600',
                                color: '#fff'
                            }}>
                                Espera
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Activo */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255, 235, 0, 1)',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'activo' ? 4 : 1,
                                borderColor: estadoFiltro === 'activo' ? '#333' : 'rgba(255, 235, 0, 0.3)',
                                shadowColor: estadoFiltro === 'activo' ? 'rgba(255, 235, 0, 1)' : '#000',
                                shadowOffset: { width: 0, height: estadoFiltro === 'activo' ? 3 : 1 },
                                shadowOpacity: estadoFiltro === 'activo' ? 0.4 : 0.1,
                                shadowRadius: estadoFiltro === 'activo' ? 6 : 2,
                                elevation: estadoFiltro === 'activo' ? 8 : 2,
                                transform: estadoFiltro === 'activo' ? [{ scale: 1.05 }] : [{ scale: 1 }],
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('activo'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'activo' ? '700' : '600',
                                color: '#333'
                            }}>
                                Activo
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Asignado */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(240, 173, 78, 1)',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'asignado' ? 3 : 1,
                                borderColor: estadoFiltro === 'asignado' ? '#fff' : 'rgba(240, 173, 78, 0.3)',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('asignado'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'asignado' ? '700' : '600',
                                color: '#fff'
                            }}>
                                Asignado
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Inactivo */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(217, 83, 79, 1)',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'innactivo' ? 3 : 1,
                                borderColor: estadoFiltro === 'innactivo' ? '#fff' : 'rgba(217, 83, 79, 0.3)',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('innactivo'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'innactivo' ? '700' : '600',
                                color: '#fff'
                            }}>
                                Inactivo
                            </Text>
                        </TouchableOpacity>

                        {/* Botón No Entregado */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#6c757d',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'noentregado' ? 3 : 1,
                                borderColor: estadoFiltro === 'noentregado' ? '#fff' : 'rgba(108, 117, 125, 0.3)',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('noentregado'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'noentregado' ? '700' : '600',
                                color: '#fff'
                            }}>
                                No Entregado
                            </Text>
                        </TouchableOpacity>

                        {/* Botón Otro */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(92, 184, 92, 1)',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: estadoFiltro === 'otro' ? 3 : 1,
                                borderColor: estadoFiltro === 'otro' ? '#fff' : 'rgba(92, 184, 92, 0.3)',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2,
                            }}
                            onPress={() => updateState(actions.setEstadoFiltro('otro'))}
                        >
                            <Text style={{
                                fontSize: 12,
                                fontWeight: estadoFiltro === 'otro' ? '700' : '600',
                                color: '#fff'
                            }}>
                                Cerrados
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
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
                    perfil_novedad,
                    imagenCerrar,
                    coordenadas,
                    nombre,
                    codt,
                    puntoId
                }}
                acceso={acceso}
                navigation={navigation}
                getEstadoColor={getEstadoColor}
                getEstadoBackgroundColor={getEstadoBackgroundColor}
                onChangeState={handleChangeStateModal}
                onAssignVehicle={() => updateState(actions.setModalConductor(true))}
                onCancelOrder={cancelarPedidoCliente}
                onClosePedido={() => {
                    // Capturar el ID del pedido y valor unitario antes de cerrar el modal
                    setPedidoIdParaCerrar(id);
                    setValorUnitarioParaCerrar(valor_unitarioUsuario?.toString());

                    // Primero cerrar el modal principal
                    closePedidoModal();
                    // Luego abrir el modal de cerrar pedido con un pequeño delay
                    setTimeout(() => {
                        updateState(actions.setModalCerrarPedido(true));
                    }, 300);
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

            <CerrarPedidoModal
                visible={modalCerrarPedido}
                pedidoId={pedidoIdParaCerrar} // Usar el ID capturado antes de cerrar el modal
                onClose={() => {
                    updateState(actions.setModalCerrarPedido(false));
                    setPedidoIdParaCerrar(undefined); // Limpiar el ID capturado
                    setValorUnitarioParaCerrar(undefined); // Limpiar el valor unitario capturado
                    // Reabrir el modal principal después de un pequeño delay
                    setTimeout(() => {
                        openPedidoModal({
                            // Mantener los mismos datos del pedido
                            id, estado, estadoEntrega, razon_social, cedula, forma,
                            cantidadKl, cantidadPrecio, fechaEntrega, creado, usuarioCrea,
                            capacidad, observacion, observacion_pedido, entregado,
                            placaPedido, conductorPedido, kilos, factura, valor_total,
                            forma_pago, motivo_no_cierre, perfil_novedad, idVehiculo, placa,
                            valor_unitarioUsuario
                        });
                    }, 200);
                }}
                entregado={entregado}
                imagenCerrar={undefined} // TODO: Agregar imagen del estado
                kilos={kilos}
                factura={factura}
                valor_total={valor_total}
                remision={undefined} // TODO: Agregar remision del estado
                forma_pago={forma_pago}
                valor_unitario={valorUnitarioParaCerrar || undefined}
                onCerrarPedido={handleCerrarPedido}
                onGuardarNovedad={handleGuardarNovedadCerrar}
            />

            {renderCabezera()}

            <ScrollView
                style={style.subContenedor}
                onScroll={(e) => onScroll(e)}
                bounces={bounces}
                scrollEventThrottle={16}
                ref={scrollViewRef}
                scrollEnabled={!(modalConductor || modalFechaEntrega || modalNovedad || modalPerfiles || modalCerrarPedido || modalOrdenamiento)}
            >
                {showSpin1 || !pedidos ? (
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: showSpin1 ? 20 : 40,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        marginHorizontal: 10,
                        marginTop: showSpin1 ? 10 : 20,
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3
                    }}>
                        <ActivityIndicator
                            size="large"
                            color="#0071bb"
                            style={{ marginBottom: showSpin1 ? 10 : 15 }}
                        />
                        <Text style={{
                            fontSize: showSpin1 ? 16 : 18,
                            color: '#0071bb',
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            {showSpin1 ? 'Cargando pedidos...' : 'Inicializando...'}
                        </Text>
                        <Text style={{
                            fontSize: showSpin1 ? 12 : 14,
                            color: '#666',
                            marginTop: 4,
                            textAlign: 'center',
                            paddingHorizontal: 20
                        }}>
                            {showSpin1
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
                            {estadoFiltro === 'todos' ? 'No hay pedidos' : `Sin pedidos ${estadoFiltro}`}
                        </Text>
                        <Text style={style.emptyStateSubtitle}>
                            {estadoFiltro === 'todos'
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
                <View style={{
                    position: 'absolute',
                    bottom: 80,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 15,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    marginHorizontal: 20,
                    borderRadius: 25,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 6
                }}>
                    <ActivityIndicator
                        size="small"
                        color="#0071bb"
                        style={{ marginBottom: 8 }}
                    />
                    <Text style={{
                        fontSize: 14,
                        color: '#0071bb',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}>
                        Cargando más pedidos...
                    </Text>
                </View>
            )}
            <Footer navigation={navigation} />
            <Toast
                config={{
                    success: (internalState) => (
                        <View style={{
                            height: 60,
                            width: '90%',
                            backgroundColor: '#28a745', // Ya tiene backgroundColor sólido
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
                            backgroundColor: '#dc3545', // Ya tiene backgroundColor sólido
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
        </View>
    );
};

export default Pedido;
