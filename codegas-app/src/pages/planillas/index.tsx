import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { style } from './style';
import Footer from '../components/footer';
import { DataContext } from '../../context/context';
import {
    getPlanillas,
    createPlanilla,
    updatePlanilla,
    deletePlanilla,
    getPedidosConductorDia
} from '../../redux/actions/planillaActions';
import { getZonas } from '../../redux/actions/zonaActions';
import {
    PlanillaProps,
    Planilla,
    PlanillaState,
    PedidoConductor,
    Gasto,
    PlanillaFormData,
    DataContextType
} from './types';

const Planillas: React.FC<PlanillaProps> = ({ navigation }) => {
    const { userId, acceso } = useContext(DataContext) as DataContextType;
    const dispatch = useDispatch();

    // Redux state
    const { planillas: reduxPlanillas, pedidos: reduxPedidos, loading: reduxLoading, loadingCreate, loadingUpdate, loadingPedidos } = useSelector(
        (reduxState: any) => reduxState.planilla || { planillas: [], pedidos: [], loading: false, loadingCreate: false, loadingUpdate: false, loadingPedidos: false }
    );
    const zonas = useSelector((reduxState: any) => reduxState.zona?.zonas || []);

    const [state, setState] = useState<PlanillaState>({
        planillas: [],
        pedidos: [],
        loading: false,
        error: null,
        searchTerm: '',
        showCreateModal: false,
        showEditModal: false,
        editingPlanilla: null,
        selectedPlanilla: null,
        showGastosModal: false,
        editingGastos: [],
        showZonasModal: false
    });

    const [vehiculo, setVehiculo] = useState<any>(null);

    const [formData, setFormData] = useState<PlanillaFormData>({
        ruta: '',
        guia: '',
        no_planilla: undefined,
        placa_vehiculo: '',
        kilometraje_inicial: undefined,
        kilometraje_final: undefined,
        remision_inicial: '',
        remision_final: '',
        inventario_inicial_porcentaje: undefined,
        inventario_final_porcentaje: undefined,
        inventario_inicial_kl: undefined,
        inventario_final_kl: undefined,
        novedades: '',
        gastos: [],
        user_id: parseInt(userId || '0')
    });

    const [currentGasto, setCurrentGasto] = useState<Gasto>({ concepto: '', valor: 0 });
    const [valorFormateado, setValorFormateado] = useState<string>('');
    const [zonaSearchTerm, setZonaSearchTerm] = useState<string>('');

    // Funciones para formatear y desformatear números
    const formatearNumero = (numero: number): string => {
        if (!numero || numero === 0) return '';
        return numero.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    const desformatearNumero = (texto: string): number => {
        // Remover todos los separadores de miles (comas y puntos que no sean decimales)
        const sinFormato = texto.replace(/[^\d.,]/g, '');
        // Reemplazar comas por puntos para decimales
        const conPuntoDecimal = sinFormato.replace(/,/g, '.');
        // Si hay múltiples puntos, mantener solo el último como decimal
        const partes = conPuntoDecimal.split('.');
        let numeroFinal = '';
        if (partes.length > 1) {
            numeroFinal = partes.slice(0, -1).join('') + '.' + partes[partes.length - 1];
        } else {
            numeroFinal = partes[0];
        }
        const valor = parseFloat(numeroFinal) || 0;
        return valor;
    };

    // Función para formatear fecha en formato DD/MM/YYYY
    const formatearFecha = (fecha: string | Date): string => {
        if (!fecha) return '';
        const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
        if (isNaN(fechaObj.getTime())) return '';

        const dia = fechaObj.getDate().toString().padStart(2, '0');
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaObj.getFullYear();

        return `${dia}/${mes}/${año}`;
    };

    // Obtener último número de planilla
    const getNextPlanillaNumber = () => {
        if (reduxPlanillas.length === 0) return 1;
        const maxId = Math.max(...reduxPlanillas.map((p: Planilla) => p.no_planilla || 0));
        return maxId + 1;
    };

    // Load vehiculo for conductor
    const loadVehiculo = useCallback(async () => {
        if (!userId || acceso !== 'conductor') return;

        try {
            const response = await axios.get(`veh/vehiculo/byConductor/${userId}`);
            if (response.data.status && response.data.carro) {
                setVehiculo(response.data.carro);
                setFormData(prev => ({
                    ...prev,
                    placa_vehiculo: response.data.carro.placa || ''
                }));
            }
        } catch (error: any) {
            console.error('Error loading vehiculo:', error);
        }
    }, [userId, acceso]);

    // Load planillas using Redux
    const loadPlanillas = useCallback(() => {
        if (!userId || !acceso) return;
        dispatch(getPlanillas(userId, acceso) as any);
    }, [userId, acceso, dispatch]);

    // Load zonas using Redux
    const loadZonas = useCallback(() => {
        dispatch(getZonas() as any);
    }, [dispatch]);

    // Load pedidos using Redux
    const loadPedidos = useCallback(() => {
        if (!userId || acceso !== 'conductor') return;
        dispatch(getPedidosConductorDia(userId) as any);
    }, [userId, acceso, dispatch]);

    useEffect(() => {
        loadPlanillas();
        loadZonas();
        if (acceso === 'conductor') {
            loadPedidos();
            loadVehiculo();
        }
    }, [loadPlanillas, loadZonas, loadPedidos, loadVehiculo]);

    useFocusEffect(
        useCallback(() => {
            loadPlanillas();
            loadZonas();
            if (acceso === 'conductor') {
                loadPedidos();
                loadVehiculo();
            }
        }, [loadPlanillas, loadZonas, loadPedidos, loadVehiculo])
    );

    // Update local state when Redux state changes
    useEffect(() => {
        setState(prev => ({
            ...prev,
            planillas: reduxPlanillas || [],
            pedidos: reduxPedidos || [],
            loading: reduxLoading || false
        }));
    }, [reduxPlanillas, reduxPedidos, reduxLoading]);

    // Handle create planilla
    const handleCreate = async () => {
        if (!formData.user_id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Usuario no válido'
            });
            return;
        }

        // Validar kilometraje final no sea mayor al inicial
        if (formData.kilometraje_final !== undefined && formData.kilometraje_final !== null &&
            formData.kilometraje_inicial !== undefined && formData.kilometraje_inicial !== null &&
            formData.kilometraje_final > formData.kilometraje_inicial) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'El kilometraje final no puede ser mayor al inicial'
            });
            return;
        }

        // Validar inventarios no sean mayores a 100
        const inventariosInvalidos = [
            { campo: 'Inventario Inicial %', valor: formData.inventario_inicial_porcentaje },
            { campo: 'Inventario Final %', valor: formData.inventario_final_porcentaje },
            { campo: 'Inventario Inicial KL', valor: formData.inventario_inicial_kl },
            { campo: 'Inventario Final KL', valor: formData.inventario_final_kl }
        ].filter(item => item.valor !== undefined && item.valor !== null && item.valor > 100);

        if (inventariosInvalidos.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${inventariosInvalidos[0].campo} no puede ser mayor a 100`
            });
            return;
        }

        // Verificar si ya existe una planilla del día actual (solo para conductores)
        if (acceso === 'conductor' && existePlanillaHoy()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Ya existe una planilla para el día de hoy'
            });
            return;
        }

        const result = await dispatch(createPlanilla(formData) as any);
        if (result.success) {
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Planilla creada correctamente'
            });
            setState(prev => ({
                ...prev,
                showCreateModal: false
            }));
            resetForm();
            loadPlanillas();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: result.error || 'Error al crear planilla'
            });
        }
    };

    // Handle update planilla
    const handleUpdate = async () => {
        if (!state.editingPlanilla) return;

        // Validar kilometraje final no sea mayor al inicial
        if (formData.kilometraje_final !== undefined && formData.kilometraje_final !== null &&
            formData.kilometraje_inicial !== undefined && formData.kilometraje_inicial !== null &&
            formData.kilometraje_final > formData.kilometraje_inicial) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'El kilometraje final no puede ser mayor al inicial'
            });
            return;
        }

        // Validar inventarios no sean mayores a 100
        const inventariosInvalidos = [
            { campo: 'Inventario Inicial %', valor: formData.inventario_inicial_porcentaje },
            { campo: 'Inventario Final %', valor: formData.inventario_final_porcentaje },
            { campo: 'Inventario Inicial KL', valor: formData.inventario_inicial_kl },
            { campo: 'Inventario Final KL', valor: formData.inventario_final_kl }
        ].filter(item => item.valor !== undefined && item.valor !== null && item.valor > 100);

        if (inventariosInvalidos.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `${inventariosInvalidos[0].campo} no puede ser mayor a 100`
            });
            return;
        }

        const result = await dispatch(updatePlanilla(state.editingPlanilla._id, formData) as any);
        if (result.success) {
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Planilla actualizada correctamente'
            });
            setState(prev => ({
                ...prev,
                showEditModal: false,
                editingPlanilla: null
            }));
            resetForm();
            loadPlanillas();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: result.error || 'Error al actualizar planilla'
            });
        }
    };

    // Handle delete planilla
    const handleDelete = (planilla: Planilla) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta planilla?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await dispatch(deletePlanilla(planilla._id) as any);
                        if (result.success) {
                            Toast.show({
                                type: 'success',
                                text1: 'Éxito',
                                text2: 'Planilla eliminada correctamente'
                            });
                            loadPlanillas();
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: result.error || 'Error al eliminar planilla'
                            });
                        }
                    }
                }
            ]
        );
    };

    // Gastos management
    const handleAddGasto = () => {
        if (!currentGasto.concepto.trim() || currentGasto.valor <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Completa concepto y valor'
            });
            return;
        }

        setFormData(prev => ({
            ...prev,
            gastos: [...prev.gastos, { ...currentGasto }]
        }));
        setCurrentGasto({ concepto: '', valor: 0 });
        setValorFormateado('');
        Toast.show({
            type: 'success',
            text1: 'Gasto agregado',
            text2: 'El gasto se ha agregado correctamente'
        });
    };

    const handleEditGasto = (index: number) => {
        const gasto = formData.gastos[index];
        setCurrentGasto(gasto);
        setValorFormateado(formatearNumero(gasto.valor));
        setFormData(prev => ({
            ...prev,
            gastos: prev.gastos.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteGasto = (index: number) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este gasto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setFormData(prev => ({
                            ...prev,
                            gastos: prev.gastos.filter((_, i) => i !== index)
                        }));
                    }
                }
            ]
        );
    };

    const handleEditPlanilla = (planilla: Planilla) => {
        const esDiaAnterior = esPlanillaDiaAnterior(planilla);
        const puedeEditar = acceso === 'admin' || !esDiaAnterior;

        setFormData({
            ruta: planilla.ruta || '',
            guia: planilla.guia || '',
            no_planilla: planilla.no_planilla,
            placa_vehiculo: planilla.placa_vehiculo || vehiculo?.placa || '',
            kilometraje_inicial: planilla.kilometraje_inicial,
            kilometraje_final: planilla.kilometraje_final,
            remision_inicial: planilla.remision_inicial || '',
            remision_final: planilla.remision_final || '',
            inventario_inicial_porcentaje: planilla.inventario_inicial_porcentaje,
            inventario_final_porcentaje: planilla.inventario_final_porcentaje,
            inventario_inicial_kl: planilla.inventario_inicial_kl,
            inventario_final_kl: planilla.inventario_final_kl,
            novedades: planilla.novedades || '',
            gastos: planilla.gastos || [],
            user_id: planilla.user_id
        });
        setState(prev => ({
            ...prev,
            editingPlanilla: planilla,
            showEditModal: true
        }));

        // Si es conductor y es día anterior, mostrar mensaje informativo
        if (acceso === 'conductor' && esDiaAnterior) {
            Toast.show({
                type: 'info',
                text1: 'Solo lectura',
                text2: 'No puedes editar planillas de días anteriores'
            });
        }
    };

    const resetForm = () => {
        setFormData({
            ruta: '',
            guia: '',
            no_planilla: getNextPlanillaNumber(),
            placa_vehiculo: vehiculo?.placa || '',
            kilometraje_inicial: undefined,
            kilometraje_final: undefined,
            remision_inicial: '',
            remision_final: '',
            inventario_inicial_porcentaje: undefined,
            inventario_final_porcentaje: undefined,
            inventario_inicial_kl: undefined,
            inventario_final_kl: undefined,
            novedades: '',
            gastos: [],
            user_id: parseInt(userId || '0')
        });
        setCurrentGasto({ concepto: '', valor: 0 });
        setValorFormateado('');
    };

    // Función para verificar si una planilla es del día actual
    const esPlanillaHoy = (planilla: Planilla): boolean => {
        const fechaPlanilla = planilla.fecha || planilla.creado;
        if (!fechaPlanilla) return false;
        try {
            const fecha = new Date(fechaPlanilla);
            if (isNaN(fecha.getTime())) return false;
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fecha.setHours(0, 0, 0, 0);
            return fecha.getTime() === hoy.getTime();
        } catch {
            return false;
        }
    };

    // Función para verificar si una planilla NO es del día actual (es anterior o futura)
    const esPlanillaDiaAnterior = (planilla: Planilla): boolean => {
        // Si no hay fecha, asumimos que no es del día actual
        const fechaPlanilla = planilla.fecha || planilla.creado;
        if (!fechaPlanilla) return true;
        return !esPlanillaHoy(planilla);
    };

    // Función para verificar si ya existe una planilla del día actual para el conductor
    const existePlanillaHoy = (): boolean => {
        if (acceso !== 'conductor') return false;
        return state.planillas.some(planilla => esPlanillaHoy(planilla));
    };

    const filteredPlanillas = state.planillas.filter(planilla =>
        planilla.ruta?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        planilla.guia?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        planilla.placa_vehiculo?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    const renderPlanillaItem = (planilla: Planilla) => {
        const totalGastos = planilla.gastos?.reduce((sum, g) => sum + (g.valor || 0), 0) || 0;
        const esDiaAnterior = esPlanillaDiaAnterior(planilla);
        const puedeEditar = acceso === 'admin' || !esDiaAnterior;
        const puedeEliminar = acceso === 'admin';

        return (
            <TouchableOpacity
                key={planilla._id}
                style={style.planillaItem}
                onPress={() => {
                    // Siempre cargar los datos de la planilla, independientemente de si se puede editar
                    handleEditPlanilla(planilla);
                }}
            >
                <View style={style.planillaHeader}>
                    <Text style={style.planillaTitle}>
                        {planilla.ruta || 'Sin ruta'} - {planilla.guia || 'Sin guía'}
                    </Text>
                    <View style={style.planillaActions}>
                        {puedeEditar && (
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleEditPlanilla(planilla);
                                }}
                                style={style.actionButton}
                            >
                                <FontAwesome name="edit" style={style.actionIcon} />
                            </TouchableOpacity>
                        )}
                        {puedeEliminar && (
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleDelete(planilla);
                                }}
                                style={style.actionButton}
                            >
                                <FontAwesome name="trash" style={[style.actionIcon, { color: '#dc3545' }]} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={style.planillaContent}>
                    <Text style={style.planillaText}>No. Planilla: {planilla.no_planilla || 'N/A'}</Text>
                    <Text style={style.planillaText}>Placa: {planilla.placa_vehiculo || 'N/A'}</Text>
                    <Text style={style.planillaText}>Total Gastos: ${totalGastos.toLocaleString()}</Text>
                    {(planilla.fecha || planilla.creado) && (
                        <Text style={style.planillaText}>
                            Fecha: {formatearFecha(planilla.fecha || planilla.creado)}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderPedidosList = () => {
        if (acceso !== 'conductor' || state.pedidos.length === 0) return null;

        return (
            <View style={style.pedidosSection}>
                <Text style={style.sectionTitle}>Pedidos Entregados Hoy (Crédito)</Text>
                {state.pedidos.map((pedido) => (
                    <View key={pedido.pedido_id} style={style.pedidoItem}>
                        <Text style={style.pedidoText}>
                            Remisión: {pedido.remision || 'N/A'}
                        </Text>
                        <Text style={style.pedidoText}>
                            Valor Total: ${Number(pedido.valor_total || 0).toLocaleString()}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderCreateEditModal = () => {
        const isEdit = !!state.editingPlanilla;
        const isLoading = loadingCreate || loadingUpdate;
        const esDiaAnterior = isEdit && state.editingPlanilla ? esPlanillaDiaAnterior(state.editingPlanilla) : false;
        const puedeEditar = acceso === 'admin' || !esDiaAnterior;
        const esSoloLectura = isEdit && acceso === 'conductor' && esDiaAnterior;

        return (
            <Modal
                visible={state.showCreateModal || state.showEditModal}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    setState(prev => ({
                        ...prev,
                        showCreateModal: false,
                        showEditModal: false,
                        editingPlanilla: null
                    }));
                    resetForm();
                }}
            >
                <View style={style.modalOverlay}>
                    <View style={[style.modalContent, { maxHeight: '90%', alignSelf: 'center' }]}>
                        {/* Selector de zonas como overlay dentro del modal */}
                        {state.showZonasModal && (() => {
                            // Filtrar zonas basado en el término de búsqueda
                            const zonasFiltradas = zonas.filter((zona: any) =>
                                zona.nombre.toLowerCase().includes(zonaSearchTerm.toLowerCase())
                            );

                            return (
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    zIndex: 1000,
                                    elevation: 1000,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 20,
                                    borderRadius: 12
                                }}>
                                    <View style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 12,
                                        width: '100%',
                                        maxWidth: 400,
                                        maxHeight: '80%',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 20,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#e9ecef'
                                        }}>
                                            <Text style={{
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                color: '#002587'
                                            }}>Seleccionar Zona</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setZonaSearchTerm('');
                                                    setState(prev => ({ ...prev, showZonasModal: false }));
                                                }}
                                                style={{ padding: 5 }}
                                            >
                                                <FontAwesome name="times" style={{ fontSize: 24, color: '#6c757d' }} />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Barra de búsqueda */}
                                        <View style={{
                                            paddingHorizontal: 20,
                                            paddingVertical: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#e9ecef'
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 8,
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                borderWidth: 1,
                                                borderColor: '#e9ecef'
                                            }}>
                                                <FontAwesome name="search" style={{ fontSize: 16, color: '#6c757d', marginRight: 10 }} />
                                                <TextInput
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 14,
                                                        color: '#333',
                                                        padding: 0
                                                    }}
                                                    placeholder="Buscar zona..."
                                                    placeholderTextColor="#999"
                                                    value={zonaSearchTerm}
                                                    onChangeText={setZonaSearchTerm}
                                                    autoFocus={true}
                                                />
                                                {zonaSearchTerm.length > 0 && (
                                                    <TouchableOpacity
                                                        onPress={() => setZonaSearchTerm('')}
                                                        style={{ padding: 5 }}
                                                    >
                                                        <FontAwesome name="times-circle" style={{ fontSize: 16, color: '#6c757d' }} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>

                                        <ScrollView
                                            style={{ maxHeight: 350 }}
                                            showsVerticalScrollIndicator={true}
                                            nestedScrollEnabled={true}
                                        >
                                            {zonasFiltradas.length === 0 ? (
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    padding: 20,
                                                    fontSize: 14
                                                }}>
                                                    {zonaSearchTerm ? 'No se encontraron zonas' : 'No hay zonas disponibles'}
                                                </Text>
                                            ) : (
                                                zonasFiltradas.map((zona: any) => (
                                                    <TouchableOpacity
                                                        key={zona._id}
                                                        style={{
                                                            paddingVertical: 15,
                                                            paddingHorizontal: 20,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: '#e9ecef',
                                                            backgroundColor: formData.ruta === zona.nombre ? '#e6f7ff' : '#fff',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                        onPress={() => {
                                                            setFormData(prev => ({ ...prev, ruta: zona.nombre }));
                                                            setZonaSearchTerm('');
                                                            setState(prev => ({ ...prev, showZonasModal: false }));
                                                        }}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={{
                                                            fontSize: 16,
                                                            color: '#333',
                                                            flex: 1
                                                        }}>{zona.nombre}</Text>
                                                        {formData.ruta === zona.nombre && (
                                                            <FontAwesome name="check" style={{ fontSize: 18, color: '#002587', marginLeft: 10 }} />
                                                        )}
                                                    </TouchableOpacity>
                                                ))
                                            )}
                                        </ScrollView>
                                    </View>
                                </View>
                            );
                        })()}

                        <View style={style.modalHeader}>
                            <Text style={style.modalTitle}>
                                {esSoloLectura ? 'Ver Planilla' : (isEdit ? 'Editar Planilla' : 'Nueva Planilla')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setState(prev => ({
                                        ...prev,
                                        showCreateModal: false,
                                        showEditModal: false,
                                        editingPlanilla: null
                                    }));
                                    resetForm();
                                }}
                            >
                                <FontAwesome name="times" style={style.closeIcon} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={{ maxHeight: '75%' }}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={true}
                        >
                            <View style={style.formContainer}>
                                {/* Listado de pedidos entregados hoy (solo para conductores en modal) */}
                                {acceso === 'conductor' && renderPedidosList()}

                                {/* Campos del formulario principal */}
                                <Text style={style.formLabel}>No. Planilla</Text>
                                <TextInput
                                    style={[style.input, { backgroundColor: '#f0f0f0' }]}
                                    value={isEdit ? formData.no_planilla?.toString() : getNextPlanillaNumber().toString()}
                                    editable={false}
                                />

                                <Text style={style.formLabel}>Ruta</Text>
                                <TouchableOpacity
                                    style={[
                                        style.input,
                                        esSoloLectura && { backgroundColor: '#f0f0f0' },
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingVertical: 10,
                                            minHeight: 40,
                                            paddingHorizontal: 10
                                        }
                                    ]}
                                    onPress={() => {
                                        if (!esSoloLectura) {
                                            setState(prev => ({ ...prev, showZonasModal: true }));
                                        }
                                    }}
                                    disabled={esSoloLectura}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{ color: formData.ruta ? '#333' : '#999', flex: 1, fontSize: 14 }}>
                                        {formData.ruta || 'Seleccionar zona...'}
                                    </Text>
                                    {!esSoloLectura && (
                                        <FontAwesome name="chevron-down" style={{ fontSize: 14, color: '#666', marginLeft: 10 }} />
                                    )}
                                </TouchableOpacity>


                                <Text style={style.formLabel}>Guía</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    value={formData.guia}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, guia: text }))}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Placa Vehículo</Text>
                                <TextInput
                                    style={[style.input, { backgroundColor: '#f0f0f0' }]}
                                    value={formData.placa_vehiculo}
                                    editable={false}
                                />

                                <Text style={style.formLabel}>Kilometraje Inicial</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    keyboardType="decimal-pad"
                                    value={formData.kilometraje_inicial !== undefined && formData.kilometraje_inicial !== null ? formData.kilometraje_inicial.toString() : ''}
                                    onChangeText={(text) => {
                                        const valor = parseFloat(text) || undefined;
                                        setFormData(prev => {
                                            // Si el kilometraje final existe y es mayor al nuevo inicial, ajustarlo
                                            const nuevoFinal = prev.kilometraje_final !== undefined && prev.kilometraje_final !== null && valor !== undefined && prev.kilometraje_final > valor
                                                ? valor
                                                : prev.kilometraje_final;
                                            return {
                                                ...prev,
                                                kilometraje_inicial: valor,
                                                kilometraje_final: nuevoFinal
                                            };
                                        });
                                    }}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Kilometraje Final</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    keyboardType="decimal-pad"
                                    value={formData.kilometraje_final !== undefined && formData.kilometraje_final !== null ? formData.kilometraje_final.toString() : ''}
                                    onChangeText={(text) => {
                                        const valor = parseFloat(text) || undefined;
                                        setFormData(prev => {
                                            // Validar que el final no sea mayor al inicial
                                            if (valor !== undefined && prev.kilometraje_inicial !== undefined && prev.kilometraje_inicial !== null) {
                                                if (valor > prev.kilometraje_inicial) {
                                                    Toast.show({
                                                        type: 'error',
                                                        text1: 'Error',
                                                        text2: 'El kilometraje final no puede ser mayor al inicial'
                                                    });
                                                    return prev;
                                                }
                                            }
                                            return { ...prev, kilometraje_final: valor };
                                        });
                                    }}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Remisión Inicial</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    value={formData.remision_inicial}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, remision_inicial: text }))}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Remisión Final</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    value={formData.remision_final}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, remision_final: text }))}
                                    editable={!esSoloLectura}
                                />

                                {/* Campos de inventario */}
                                <Text style={style.formLabel}>Inventario Inicial % (máx. 100)</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    keyboardType="decimal-pad"
                                    value={formData.inventario_inicial_porcentaje !== undefined && formData.inventario_inicial_porcentaje !== null ? formData.inventario_inicial_porcentaje.toString() : ''}
                                    onChangeText={(text) => {
                                        const valor = parseFloat(text) || undefined;
                                        if (valor !== undefined && valor > 100) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'El inventario no puede ser mayor a 100'
                                            });
                                            return;
                                        }
                                        setFormData(prev => ({ ...prev, inventario_inicial_porcentaje: valor }));
                                    }}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Inventario Final % (máx. 100)</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    keyboardType="decimal-pad"
                                    value={formData.inventario_final_porcentaje !== undefined && formData.inventario_final_porcentaje !== null ? formData.inventario_final_porcentaje.toString() : ''}
                                    onChangeText={(text) => {
                                        const valor = parseFloat(text) || undefined;
                                        if (valor !== undefined && valor > 100) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'El inventario no puede ser mayor a 100'
                                            });
                                            return;
                                        }
                                        setFormData(prev => ({ ...prev, inventario_final_porcentaje: valor }));
                                    }}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Inventario Inicial KL (máx. 100)</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    keyboardType="decimal-pad"
                                    value={formData.inventario_inicial_kl !== undefined && formData.inventario_inicial_kl !== null ? formData.inventario_inicial_kl.toString() : ''}
                                    onChangeText={(text) => {
                                        const valor = parseFloat(text) || undefined;
                                        if (valor !== undefined && valor > 100) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'El inventario no puede ser mayor a 100'
                                            });
                                            return;
                                        }
                                        setFormData(prev => ({ ...prev, inventario_inicial_kl: valor }));
                                    }}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Inventario Final KL (máx. 100)</Text>
                                <TextInput
                                    style={[style.input, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    keyboardType="decimal-pad"
                                    value={formData.inventario_final_kl !== undefined && formData.inventario_final_kl !== null ? formData.inventario_final_kl.toString() : ''}
                                    onChangeText={(text) => {
                                        const valor = parseFloat(text) || undefined;
                                        if (valor !== undefined && valor > 100) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'El inventario no puede ser mayor a 100'
                                            });
                                            return;
                                        }
                                        setFormData(prev => ({ ...prev, inventario_final_kl: valor }));
                                    }}
                                    editable={!esSoloLectura}
                                />

                                <Text style={style.formLabel}>Novedades</Text>
                                <TextInput
                                    style={[style.input, style.textArea, esSoloLectura && { backgroundColor: '#f0f0f0' }]}
                                    multiline
                                    numberOfLines={4}
                                    value={formData.novedades}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, novedades: text }))}
                                    editable={!esSoloLectura}
                                />

                                {/* Gestión de gastos */}
                                <View style={style.gastosSection}>
                                    <View style={style.gastosHeader}>
                                        <Text style={style.formLabel}>Gastos ({formData.gastos.length})</Text>
                                        {!esSoloLectura && (
                                            <TouchableOpacity
                                                style={style.gastosButton}
                                                onPress={() => {
                                                    setState(prev => ({ ...prev, showGastosModal: !prev.showGastosModal }));
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <FontAwesome name={state.showGastosModal ? "times" : "list"} style={style.gastosIcon} />
                                                <Text style={style.gastosButtonText}>
                                                    {state.showGastosModal ? 'Cerrar' : 'Gestionar'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={style.gastosTotal}>
                                        Total: ${formData.gastos.reduce((sum, g) => sum + (g.valor || 0), 0).toLocaleString()}
                                    </Text>

                                    {/* Formulario de gastos expandible */}
                                    {state.showGastosModal && (
                                        <View style={style.gastosFormContainer}>
                                            <View style={style.gastoForm}>
                                                <Text style={style.formLabel}>Concepto</Text>
                                                <TextInput
                                                    style={style.input}
                                                    placeholder="Concepto"
                                                    value={currentGasto.concepto}
                                                    onChangeText={(text) => setCurrentGasto(prev => ({ ...prev, concepto: text }))}
                                                />
                                                <Text style={style.formLabel}>Valor</Text>
                                                <TextInput
                                                    style={style.input}
                                                    placeholder="Valor"
                                                    keyboardType="numeric"
                                                    value={valorFormateado}
                                                    onChangeText={(text) => {
                                                        // Actualizar el valor formateado para mostrar
                                                        setValorFormateado(text);
                                                        // Convertir a número y guardar en el estado
                                                        const valorNumerico = desformatearNumero(text);
                                                        setCurrentGasto(prev => ({ ...prev, valor: valorNumerico }));
                                                    }}
                                                />
                                                <TouchableOpacity
                                                    style={style.addButton}
                                                    onPress={handleAddGasto}
                                                >
                                                    <FontAwesome name="plus" style={style.addIcon} />
                                                    <Text style={style.addButtonText}>Agregar Gasto</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Lista de gastos */}
                                            {formData.gastos.length === 0 ? (
                                                <Text style={style.emptyText}>No hay gastos registrados</Text>
                                            ) : (
                                                formData.gastos.map((gasto, index) => (
                                                    <View key={index} style={style.gastoItem}>
                                                        <View style={style.gastoInfo}>
                                                            <Text style={style.gastoConcepto}>{gasto.concepto}</Text>
                                                            <Text style={style.gastoValor}>${gasto.valor.toLocaleString()}</Text>
                                                        </View>
                                                        <View style={style.gastoActions}>
                                                            <TouchableOpacity
                                                                onPress={() => handleEditGasto(index)}
                                                                style={style.gastoActionButton}
                                                            >
                                                                <FontAwesome name="edit" style={style.gastoActionIcon} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => handleDeleteGasto(index)}
                                                                style={style.gastoActionButton}
                                                            >
                                                                <FontAwesome name="trash" style={[style.gastoActionIcon, { color: '#dc3545' }]} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))
                                            )}
                                        </View>
                                    )}
                                </View>

                                {!esSoloLectura && (
                                    <TouchableOpacity
                                        style={style.saveButton}
                                        onPress={isEdit ? handleUpdate : handleCreate}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={style.saveButtonText}>
                                                {isEdit ? 'Actualizar' : 'Crear'}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    // Initialize form when opening create modal
    useEffect(() => {
        if (state.showCreateModal && !state.showEditModal) {
            resetForm();
        }
    }, [state.showCreateModal]);


    if (!userId || !acceso || (acceso !== 'admin' && acceso !== 'conductor')) {
        return (
            <View style={style.container}>
                <Text style={style.errorText}>No tienes acceso a esta sección</Text>
                <Footer navigation={navigation} />
            </View>
        );
    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <Text style={style.title}>Planillas</Text>
                {acceso === 'conductor' && !existePlanillaHoy() && (
                    <TouchableOpacity
                        style={style.addButton}
                        onPress={() => {
                            if (existePlanillaHoy()) {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    text2: 'Ya existe una planilla para el día de hoy'
                                });
                                return;
                            }
                            resetForm();
                            setState(prev => ({ ...prev, showCreateModal: true }));
                        }}
                    >
                        <FontAwesome name="plus" style={style.addIcon} />
                        <Text style={style.addButtonText}>Nueva</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={style.searchContainer}>
                <FontAwesome name="search" style={style.searchIcon} />
                <TextInput
                    style={style.searchInput}
                    placeholder="Buscar planillas..."
                    value={state.searchTerm}
                    onChangeText={(text) => setState(prev => ({ ...prev, searchTerm: text }))}
                />
            </View>

            <ScrollView
                style={style.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={state.loading}
                        onRefresh={loadPlanillas}
                    />
                }
            >
                {state.loading && filteredPlanillas.length === 0 ? (
                    <ActivityIndicator size="large" color="#002587" style={style.loader} />
                ) : filteredPlanillas.length === 0 ? (
                    <Text style={style.emptyText}>No hay planillas registradas</Text>
                ) : (
                    filteredPlanillas.map(planilla => renderPlanillaItem(planilla))
                )}
            </ScrollView>

            {renderCreateEditModal()}
            <Footer navigation={navigation} />
        </View>
    );
};

export default Planillas;
