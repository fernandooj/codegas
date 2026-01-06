import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getTanquesByPunto } from '../../redux/actions/tanqueActions';
import { updateTanquesHTTP } from '../../redux/actions/pedidoActions';
import { tanqueStorageService } from '../../services/tanqueStorageService';
import NetInfo from '@react-native-community/netinfo';
import { debugLogger } from '../../components/DebugPanel';
import { useSyncQueue } from '../../hooks/useSyncQueue';
import { syncQueueService, SyncOperationType } from '../../services/syncQueueService';
import { style } from './style';

interface LlenadoTanquesModalProps {
    visible: boolean;
    onClose: () => void;
    pedidoId: string;
    tanqueId: number; // ID del tanque seleccionado
    puntoId?: string;
    usuarioId?: string;
    email?: string; // Email del cliente para enviar la factura
    onSave: (data: {
        presion_inicial: number | null;
        presion_final: number | null;
        porcentaje_inicial: number | null;
        porcentaje_final: number | null;
        estado: string | null;
    }) => void;
    initialData?: {
        presion_inicial?: number | null;
        presion_final?: number | null;
        porcentaje_inicial?: number | null;
        porcentaje_final?: number | null;
        estado?: string | null;
    };
    showSaveButton?: boolean; // Controla si se muestra el botón de guardar
    fromFirmas?: boolean; // Indica si viene del flujo de firmas (readonly mode)
    showTanqueSelection?: boolean; // Si es true, muestra la selección de tanques, si es false, solo muestra los inputs
    tanquesData?: Array<{
        tanque_id: number;
        presion_inicial?: number | null;
        presion_final?: number | null;
        porcentaje_inicial?: number | null;
        porcentaje_final?: number | null;
        estado?: string | null;
    }>; // Datos de todos los tanques del pedido para cargar datos específicos
}

interface Tanque {
    _id: number;
    capacidad?: string;
    codigo_activo?: string;
    fabricante?: string;
    registro_onac?: string;
    n_placa?: string;
    direccion?: string;
}

const LlenadoTanquesModal: React.FC<LlenadoTanquesModalProps> = ({
    visible,
    onClose,
    pedidoId,
    tanqueId,
    puntoId,
    usuarioId,
    email,
    onSave,
    initialData,
    showSaveButton = true, // Por defecto mostrar el botón, pero ahora siempre activo para pruebas
    fromFirmas = false, // Por defecto no viene de firmas
    showTanqueSelection = false, // Por defecto no mostrar selección de tanques
    tanquesData = [] // Datos de tanques del pedido
}) => {
    const { isOnline, addToQueue } = useSyncQueue();
    const [tanques, setTanques] = useState<Tanque[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTanque, setSelectedTanque] = useState<Tanque | null>(null);
    const [presionInicial, setPresionInicial] = useState<string>('');
    const [presionFinal, setPresionFinal] = useState<string>('');
    const [porcentajeInicial, setPorcentajeInicial] = useState<string>('');
    const [porcentajeFinal, setPorcentajeFinal] = useState<string>('');
    const [estado, setEstado] = useState<string>('');
    const [saving, setSaving] = useState(false);

    // Refs para rastrear si ya se inicializaron los datos y evitar resetear mientras el usuario escribe
    const lastTanqueIdRef = useRef<number>(0);
    const initializedRef = useRef<boolean>(false);

    // Cargar tanques cuando se abre el modal (solo si showTanqueSelection es true)
    useEffect(() => {
        if (visible && puntoId && showTanqueSelection) {
            // Inicializar debug logger
            debugLogger.init();
            loadTanques();
        }
    }, [visible, puntoId, showTanqueSelection]);

    // Cargar datos del tanque seleccionado solo cuando el modal se abre o cambia el tanqueId
    useEffect(() => {
        if (visible && tanqueId && !showTanqueSelection) {
            // Solo inicializar si es un nuevo tanque o si es la primera vez que se abre el modal
            const isNewTanque = lastTanqueIdRef.current !== tanqueId;
            const shouldInitialize = isNewTanque || !initializedRef.current;

            if (shouldInitialize) {
                // Buscar datos del tanque específico en tanquesData
                const tanqueData = tanquesData.find((t: any) => t.tanque_id === tanqueId);

                if (tanqueData) {
                    // Cargar datos del tanque específico
                    setPresionInicial(tanqueData.presion_inicial?.toString() || '');
                    setPresionFinal(tanqueData.presion_final?.toString() || '');
                    setPorcentajeInicial(tanqueData.porcentaje_inicial?.toString() || '');
                    setPorcentajeFinal(tanqueData.porcentaje_final?.toString() || '');
                    setEstado(tanqueData.estado || '');
                } else if (initialData) {
                    // Si no hay datos del tanque, usar initialData
                    setPresionInicial(initialData.presion_inicial?.toString() || '');
                    setPresionFinal(initialData.presion_final?.toString() || '');
                    setPorcentajeInicial(initialData.porcentaje_inicial?.toString() || '');
                    setPorcentajeFinal(initialData.porcentaje_final?.toString() || '');
                    setEstado(initialData.estado || '');
                } else {
                    // Si no hay datos, resetear los campos
                    setPresionInicial('');
                    setPresionFinal('');
                    setPorcentajeInicial('');
                    setPorcentajeFinal('');
                    setEstado('');
                }

                // Actualizar refs
                lastTanqueIdRef.current = tanqueId;
                initializedRef.current = true;
            }
        } else if (!visible) {
            // Cuando el modal se cierra, resetear el flag de inicialización
            initializedRef.current = false;
            lastTanqueIdRef.current = 0;
        }
    }, [visible, tanqueId, showTanqueSelection]); // Removido tanquesData e initialData de las dependencias

    const loadTanques = async () => {
        if (!puntoId) {
            Alert.alert('Error', 'No se encontró el punto de servicio');
            return;
        }

        try {
            setLoading(true);

            console.log(`🔄 [LlenadoTanquesModal] Cargando tanques para punto ${puntoId}`);
            debugLogger.info('Iniciando carga de tanques en modal', { puntoId });

            // Primero intentar cargar desde cache (más rápido y funciona offline)
            try {
                const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);
                if (cachedTanques && cachedTanques.length > 0) {
                    console.log(`✅ [LlenadoTanquesModal] Tanques cargados desde cache: ${cachedTanques.length}`);
                    debugLogger.info('Tanques cargados desde cache en modal', { puntoId, count: cachedTanques.length });
                    setTanques(cachedTanques);
                    // Si solo hay un tanque, seleccionarlo automáticamente
                    if (cachedTanques.length === 1) {
                        setSelectedTanque(cachedTanques[0]);
                    }
                    setLoading(false);

                    // Verificar conexión para intentar actualizar en segundo plano
                    const netInfo = await NetInfo.fetch();
                    const isOnline = netInfo.isConnected ?? false;

                    if (isOnline) {
                        // Intentar actualizar desde servidor en segundo plano (no bloquea)
                        (async () => {
                            try {
                                console.log(`🔄 [LlenadoTanquesModal] Actualizando tanques desde servidor en segundo plano...`);
                                const response = await getTanquesByPunto(puntoId);
                                if (response?.tanque && Array.isArray(response.tanque) && response.tanque.length > 0) {
                                    console.log(`✅ [LlenadoTanquesModal] Tanques actualizados desde servidor: ${response.tanque.length}`);
                                    debugLogger.info('Tanques actualizados desde servidor', { puntoId, count: response.tanque.length });
                                    setTanques(response.tanque);
                                    if (response.tanque.length === 1) {
                                        setSelectedTanque(response.tanque[0]);
                                    }
                                }
                            } catch (updateError) {
                                console.warn('⚠️ [LlenadoTanquesModal] Error actualizando desde servidor (no crítico):', updateError);
                                // No mostrar error, ya tenemos los datos del cache
                            }
                        })();
                    }
                    return;
                }
            } catch (cacheError: any) {
                console.warn('⚠️ [LlenadoTanquesModal] Error cargando desde cache, intentando desde servidor:', cacheError);
                debugLogger.warn('Error cargando desde cache, intentando servidor', { puntoId, error: cacheError?.message || String(cacheError) });
            }

            // Si no hay cache o falló, intentar desde servidor
            // Verificar conexión
            const netInfo = await NetInfo.fetch();
            const isOnline = netInfo.isConnected ?? false;

            if (!isOnline) {
                console.log('📴 [LlenadoTanquesModal] Offline y no hay tanques en cache');
                debugLogger.warn('Offline y sin tanques en cache', { puntoId });
                setTanques([]);
                // No mostrar alert, permitir que el usuario llene los campos offline
                // setLoading(false); // Ya se hace en el finally
                return;
            }

            // Online: cargar desde servidor
            console.log('📡 [LlenadoTanquesModal] Cargando tanques desde servidor...');
            debugLogger.info('Cargando tanques desde servidor', { puntoId });

            // getTanquesByPunto ahora maneja offline automáticamente
            const response = await getTanquesByPunto(puntoId);

            if (response?.tanque && Array.isArray(response.tanque)) {
                setTanques(response.tanque);
                // Si solo hay un tanque, seleccionarlo automáticamente
                if (response.tanque.length === 1) {
                    setSelectedTanque(response.tanque[0]);
                }
                console.log(`✅ [LlenadoTanquesModal] Tanques cargados desde servidor: ${response.tanque.length}`);
                debugLogger.info('Tanques cargados desde servidor', { puntoId, count: response.tanque.length });
            } else {
                setTanques([]);
                console.warn('⚠️ [LlenadoTanquesModal] No se recibieron tanques del servidor');
                debugLogger.warn('No se recibieron tanques del servidor', { puntoId });
            }
        } catch (error: any) {
            console.error('❌ [LlenadoTanquesModal] Error cargando tanques:', error);
            debugLogger.error('Error cargando tanques en modal', { puntoId, error: error?.message || String(error) });

            // Intentar cargar desde cache como último recurso
            try {
                const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);
                if (cachedTanques && cachedTanques.length > 0) {
                    console.log('✅ [LlenadoTanquesModal] Tanques cargados desde cache como fallback:', cachedTanques.length);
                    debugLogger.info('Tanques cargados desde cache como fallback', { puntoId, count: cachedTanques.length });
                    setTanques(cachedTanques);
                    if (cachedTanques.length === 1) {
                        setSelectedTanque(cachedTanques[0]);
                    }
                    return;
                }
            } catch (cacheError: any) {
                console.error('❌ [LlenadoTanquesModal] Error cargando desde cache:', cacheError);
                debugLogger.error('Error cargando desde cache como fallback', { puntoId, error: cacheError?.message || String(cacheError) });
            }

            // No mostrar alert, permitir que el usuario llene los campos igualmente
            setTanques([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Verificar conexión
        const netInfo = await NetInfo.fetch();
        const isOnlineNow = netInfo.isConnected ?? false;

        try {
            setSaving(true);

            // Validar que el estado esté seleccionado
            if (!estado || estado === '') {
                Alert.alert('Error', 'Por favor seleccione el estado del tanque');
                setSaving(false);
                return;
            }

            // Si el estado es "Funciona", validar que al menos haya algún dato de llenado
            if (estado === 'Funciona' && !presionInicial && !presionFinal && !porcentajeInicial && !porcentajeFinal) {
                Alert.alert('Error', 'Si el tanque funciona, debe ingresar al menos un dato de llenado');
                setSaving(false);
                return;
            }

            // Si no hay valores, guardar con null
            // Si hay valores, validar que sean números válidos
            let datosLlenado = {
                presion_inicial: null as number | null,
                presion_final: null as number | null,
                porcentaje_inicial: null as number | null,
                porcentaje_final: null as number | null,
                estado: estado || null
            };

            // Si hay valores, intentar parsearlos
            if (presionInicial || presionFinal || porcentajeInicial || porcentajeFinal) {
                const presionInicialNum = presionInicial ? parseFloat(presionInicial) : null;
                const presionFinalNum = presionFinal ? parseFloat(presionFinal) : null;
                const porcentajeInicialNum = porcentajeInicial ? parseFloat(porcentajeInicial) : null;
                const porcentajeFinalNum = porcentajeFinal ? parseFloat(porcentajeFinal) : null;

                // Validar que los valores parseados sean números válidos
                if (presionInicial && (isNaN(presionInicialNum!) || presionInicialNum === null)) {
                    Alert.alert('Error', 'La presión inicial debe ser un número válido');
                    setSaving(false);
                    return;
                }
                if (presionFinal && (isNaN(presionFinalNum!) || presionFinalNum === null)) {
                    Alert.alert('Error', 'La presión final debe ser un número válido');
                    setSaving(false);
                    return;
                }
                if (porcentajeInicial && (isNaN(porcentajeInicialNum!) || porcentajeInicialNum === null)) {
                    Alert.alert('Error', 'El porcentaje inicial debe ser un número válido');
                    setSaving(false);
                    return;
                }
                if (porcentajeFinal && (isNaN(porcentajeFinalNum!) || porcentajeFinalNum === null)) {
                    Alert.alert('Error', 'El porcentaje final debe ser un número válido');
                    setSaving(false);
                    return;
                }

                // Validar rangos de porcentajes (0-100) si están presentes
                if (porcentajeInicialNum !== null && (porcentajeInicialNum < 0 || porcentajeInicialNum > 100)) {
                    Alert.alert('Error', 'El porcentaje inicial debe estar entre 0 y 100');
                    setSaving(false);
                    return;
                }
                if (porcentajeFinalNum !== null && (porcentajeFinalNum < 0 || porcentajeFinalNum > 100)) {
                    Alert.alert('Error', 'El porcentaje final debe estar entre 0 y 100');
                    setSaving(false);
                    return;
                }

                datosLlenado = {
                    presion_inicial: presionInicialNum,
                    presion_final: presionFinalNum,
                    porcentaje_inicial: porcentajeInicialNum,
                    porcentaje_final: porcentajeFinalNum,
                    estado: estado || null
                };
            }

            // Preparar datos para actualizar el campo tanques
            const tanqueData = {
                tanque_id: tanqueId,
                tipo_suministro: null, // Se puede agregar después si es necesario
                presion_inicial: datosLlenado.presion_inicial,
                presion_final: datosLlenado.presion_final,
                porcentaje_inicial: datosLlenado.porcentaje_inicial,
                porcentaje_final: datosLlenado.porcentaje_final,
                observacion: null, // Se puede agregar después si es necesario
                checklist: [], // Se actualiza desde SafetyChecklistModal
                estado: datosLlenado.estado
            };

            if (isOnlineNow) {
                // Online: actualizar campo tanques directamente
                await updateTanquesHTTP(pedidoId, tanqueData);

                // También llamar a onSave para mantener compatibilidad
                await onSave(datosLlenado);

                // Mostrar alerta de éxito
                Alert.alert(
                    'Éxito',
                    'Los datos de llenado de tanques se guardaron correctamente',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setSaving(false);
                                onClose();
                            }
                        }
                    ]
                );
                return;
            } else {
                // Offline: guardar en cola de sincronización
                console.log('📴 [LlenadoTanquesModal] Offline - Guardando en cola de sincronización');
                debugLogger.info('Guardando llenado de tanques offline', { pedidoId, datosLlenado });

                // Guardar en cola para sincronización
                await addToQueue(
                    SyncOperationType.UPDATE_PEDIDO,
                    {
                        pedidoId: pedidoId,
                        updateTanques: tanqueData
                    }
                );

                // IMPORTANTE: También llamar a onSave para que el componente padre (CerrarPedidoModal) 
                // pueda actualizar dataCierrePendiente con estos datos antes de cerrar el pedido
                // Esto asegura que cuando se cierre el pedido offline, los datos de llenado estén incluidos
                try {
                    await onSave(datosLlenado);
                    console.log('✅ [LlenadoTanquesModal] Datos de llenado pasados al componente padre para incluir en cierre de pedido');
                } catch (saveError) {
                    console.warn('⚠️ [LlenadoTanquesModal] Error pasando datos al componente padre (no crítico):', saveError);
                    // Continuar aunque falle, ya que los datos están en la cola
                }

                // Mostrar alerta de éxito offline
                Alert.alert(
                    '📴 Sin Conexión',
                    'Los datos de llenado de tanques se guardaron localmente y se enviarán automáticamente cuando haya internet',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setSaving(false);
                                onClose();
                            }
                        }
                    ]
                );
                return;
            }
        } catch (error) {
            console.error('Error guardando datos:', error);
            Alert.alert('Error', 'No se pudieron guardar los datos');
            setSaving(false);
        }
    };

    const renderModalContent = () => (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            {/* Header mejorado */}
            <View style={{
                backgroundColor: '#002587',
                paddingVertical: 16,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 8,
                        padding: 8,
                        marginRight: 12
                    }}>
                        <FontAwesome name="tint" style={{ fontSize: 20, color: '#fff' }} />
                    </View>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: '#fff',
                        flex: 1
                    }}>
                        Llenado de Tanques
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 20,
                        width: 36,
                        height: 36,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="times" style={{ fontSize: 16, color: '#fff' }} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: '#fff'
                }}
                contentContainerStyle={{
                    paddingBottom: 100,
                    paddingTop: 20
                }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
            >
                {/* Información del punto mejorada */}
                {puntoId && (
                    <View style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: 12,
                        padding: 16,
                        marginHorizontal: 20,
                        marginTop: 20,
                        marginBottom: 16,
                        borderLeftWidth: 4,
                        borderLeftColor: '#002587'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <FontAwesome name="map-marker" style={{ fontSize: 14, color: '#002587', marginRight: 8 }} />
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                Punto de servicio
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#212529',
                            marginTop: 4
                        }}>
                            ID: {puntoId}
                        </Text>
                    </View>
                )}

                {/* Lista de tanques mejorada - Solo se muestra si showTanqueSelection es true */}
                {showTanqueSelection && (loading ? (
                    <View style={{
                        padding: 40,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#002587" />
                        <Text style={{
                            marginTop: 16,
                            color: '#6c757d',
                            fontSize: 14,
                            fontWeight: '500'
                        }}>
                            Cargando tanques...
                        </Text>
                    </View>
                ) : tanques.length === 0 ? (
                    <View style={{
                        padding: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 10,
                        marginHorizontal: 20,
                        backgroundColor: '#fff3cd',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#ffc107'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8
                        }}>
                            <FontAwesome name="info-circle" size={18} color="#856404" style={{ marginRight: 8 }} />
                            <Text style={{
                                color: '#856404',
                                textAlign: 'center',
                                fontSize: 13,
                                fontWeight: '600',
                                flex: 1
                            }}>
                                No se encontraron tanques para este punto
                            </Text>
                        </View>
                        <Text style={{
                            color: '#856404',
                            textAlign: 'center',
                            fontSize: 12,
                            fontWeight: '400',
                            marginTop: 4
                        }}>
                            Puedes llenar los datos de llenado de tanques igualmente. {!isOnline ? 'Se guardarán offline y se sincronizarán cuando haya internet.' : 'Se guardarán cuando presiones Guardar.'}
                        </Text>
                    </View>
                ) : (
                    <View style={{ marginBottom: 24, paddingHorizontal: 20 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 16
                        }}>
                            <FontAwesome name="database" style={{ fontSize: 16, color: '#002587', marginRight: 8 }} />
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: '#212529'
                            }}>
                                Tanques disponibles
                            </Text>
                        </View>
                        {tanques.map((tanque) => (
                            <TouchableOpacity
                                key={tanque._id}
                                activeOpacity={0.7}
                                disabled={fromFirmas}
                                style={{
                                    padding: 18,
                                    marginBottom: 12,
                                    borderRadius: 14,
                                    borderWidth: selectedTanque?._id === tanque._id ? 2.5 : 1.5,
                                    borderColor: selectedTanque?._id === tanque._id ? '#002587' : '#e9ecef',
                                    backgroundColor: selectedTanque?._id === tanque._id ? '#f0f4ff' : '#ffffff',
                                    shadowColor: selectedTanque?._id === tanque._id ? '#002587' : '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: selectedTanque?._id === tanque._id ? 0.15 : 0.05,
                                    shadowRadius: 4,
                                    elevation: selectedTanque?._id === tanque._id ? 4 : 2,
                                    opacity: fromFirmas ? 0.6 : 1
                                }}
                                onPress={() => !fromFirmas && setSelectedTanque(tanque)}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{ flex: 1, marginRight: 12 }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 8
                                        }}>
                                            <View style={{
                                                backgroundColor: selectedTanque?._id === tanque._id ? '#002587' : '#6c757d',
                                                borderRadius: 6,
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                marginRight: 10
                                            }}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: '700',
                                                    color: '#fff'
                                                }}>
                                                    #{tanque._id}
                                                </Text>
                                            </View>
                                            <Text style={{
                                                fontSize: 17,
                                                fontWeight: '700',
                                                color: selectedTanque?._id === tanque._id ? '#002587' : '#212529',
                                                flex: 1
                                            }}>
                                                {tanque.codigo_activo || `Tanque ${tanque._id}`}
                                            </Text>
                                        </View>

                                        <View style={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 8,
                                            padding: 12,
                                            marginTop: 8
                                        }}>
                                            {tanque.capacidad && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <FontAwesome name="balance-scale" style={{ fontSize: 12, color: '#6c757d', marginRight: 8, width: 16 }} />
                                                    <Text style={{ fontSize: 13, color: '#495057', flex: 1 }}>
                                                        <Text style={{ fontWeight: '600' }}>Capacidad: </Text>
                                                        {tanque.capacidad} Kg
                                                    </Text>
                                                </View>
                                            )}
                                            {tanque.fabricante && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <FontAwesome name="industry" style={{ fontSize: 12, color: '#6c757d', marginRight: 8, width: 16 }} />
                                                    <Text style={{ fontSize: 13, color: '#495057', flex: 1 }}>
                                                        <Text style={{ fontWeight: '600' }}>Fabricante: </Text>
                                                        {tanque.fabricante}
                                                    </Text>
                                                </View>
                                            )}
                                            {tanque.n_placa && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <FontAwesome name="tag" style={{ fontSize: 12, color: '#6c757d', marginRight: 8, width: 16 }} />
                                                    <Text style={{ fontSize: 13, color: '#495057', flex: 1 }}>
                                                        <Text style={{ fontWeight: '600' }}>Placa: </Text>
                                                        {tanque.n_placa}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    {selectedTanque?._id === tanque._id && (
                                        <View style={{
                                            backgroundColor: '#002587',
                                            borderRadius: 20,
                                            width: 32,
                                            height: 32,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#002587',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 4,
                                            elevation: 4
                                        }}>
                                            <FontAwesome name="check" size={16} color="#fff" />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Select de Estado - Solo se muestra si NO es modo de selección de tanques */}
                {!showTanqueSelection && (
                    <View style={{ marginTop: 8, marginBottom: 20, paddingHorizontal: 20 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10
                        }}>
                            <FontAwesome name="info-circle" style={{ fontSize: 12, color: '#002587', marginRight: 6 }} />
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: '#495057'
                            }}>
                                Estado del Tanque
                            </Text>
                            <Text style={{ color: '#dc3545', marginLeft: 4 }}>*</Text>
                        </View>
                        <View style={{
                            borderWidth: 1.5,
                            borderColor: estado ? '#002587' : '#dee2e6',
                            borderRadius: 10,
                            backgroundColor: '#fff',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                            opacity: fromFirmas ? 0.6 : 1
                        }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{
                                    flexDirection: 'row',
                                    padding: 6
                                }}>
                                    {['Funciona', 'No Funciona', 'No Aplica'].map((opcion) => {
                                        let buttonColor = '#f8f9fa';
                                        let borderColor = '#dee2e6';
                                        let textColor = '#495057';

                                        if (estado === opcion) {
                                            if (opcion === 'Funciona') {
                                                buttonColor = '#28a745';
                                                borderColor = '#28a745';
                                                textColor = '#fff';
                                            } else if (opcion === 'No Funciona') {
                                                buttonColor = '#dc3545';
                                                borderColor = '#dc3545';
                                                textColor = '#fff';
                                            } else if (opcion === 'No Aplica') {
                                                buttonColor = '#6c757d';
                                                borderColor = '#6c757d';
                                                textColor = '#fff';
                                            }
                                        }

                                        return (
                                            <TouchableOpacity
                                                key={opcion}
                                                disabled={fromFirmas}
                                                onPress={() => setEstado(opcion)}
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 16,
                                                    marginRight: 6,
                                                    borderRadius: 8,
                                                    backgroundColor: buttonColor,
                                                    borderWidth: 1.5,
                                                    borderColor: borderColor,
                                                    minWidth: 100,
                                                    alignItems: 'center'
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: '600',
                                                    color: textColor
                                                }}>
                                                    {opcion}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Campos de llenado mejorados - Solo se muestran si estado === 'Funciona' y NO es modo selección */}
                {!showTanqueSelection && estado === 'Funciona' && (
                    <View style={{
                        marginTop: 8,
                        paddingHorizontal: 20
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 20,
                            paddingTop: 8,
                            borderTopWidth: 1,
                            borderTopColor: '#e9ecef'
                        }}>
                            <FontAwesome name="tachometer" style={{ fontSize: 16, color: '#002587', marginRight: 8 }} />
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: '#212529'
                            }}>
                                Datos de llenado
                            </Text>
                        </View>

                        {/* Grid de 2 columnas para las presiones */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 20
                        }}>
                            {/* Presión inicial */}
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <FontAwesome name="arrow-up" style={{ fontSize: 12, color: '#28a745', marginRight: 6 }} />
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        Presión inicial
                                    </Text>
                                    <Text style={{ color: '#dc3545', marginLeft: 4 }}>*</Text>
                                </View>
                                <View style={{
                                    borderWidth: 1.5,
                                    borderColor: presionInicial ? '#28a745' : '#dee2e6',
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1
                                }}>
                                    <TextInput
                                        style={{
                                            padding: 14,
                                            fontSize: 15,
                                            color: '#212529',
                                            fontWeight: '500',
                                            opacity: fromFirmas ? 0.6 : 1
                                        }}
                                        placeholder="PSI"
                                        placeholderTextColor="#adb5bd"
                                        value={presionInicial}
                                        onChangeText={setPresionInicial}
                                        keyboardType="numeric"
                                        editable={!fromFirmas}
                                    />
                                </View>
                            </View>

                            {/* Presión final */}
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <FontAwesome name="arrow-down" style={{ fontSize: 12, color: '#dc3545', marginRight: 6 }} />
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        Presión final
                                    </Text>
                                    <Text style={{ color: '#dc3545', marginLeft: 4 }}>*</Text>
                                </View>
                                <View style={{
                                    borderWidth: 1.5,
                                    borderColor: presionFinal ? '#dc3545' : '#dee2e6',
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1
                                }}>
                                    <TextInput
                                        style={{
                                            padding: 14,
                                            fontSize: 15,
                                            color: '#212529',
                                            fontWeight: '500',
                                            opacity: fromFirmas ? 0.6 : 1
                                        }}
                                        placeholder="PSI"
                                        placeholderTextColor="#adb5bd"
                                        value={presionFinal}
                                        onChangeText={setPresionFinal}
                                        keyboardType="numeric"
                                        editable={!fromFirmas}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Grid de 2 columnas para los porcentajes */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 20
                        }}>
                            {/* Porcentaje inicial */}
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <FontAwesome name="percent" style={{ fontSize: 12, color: '#007bff', marginRight: 6 }} />
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        % Inicial
                                    </Text>
                                    <Text style={{ color: '#dc3545', marginLeft: 4 }}>*</Text>
                                </View>
                                <View style={{
                                    borderWidth: 1.5,
                                    borderColor: porcentajeInicial ? '#007bff' : '#dee2e6',
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1
                                }}>
                                    <TextInput
                                        style={{
                                            padding: 14,
                                            fontSize: 15,
                                            color: '#212529',
                                            fontWeight: '500',
                                            opacity: fromFirmas ? 0.6 : 1
                                        }}
                                        placeholder="0-100"
                                        placeholderTextColor="#adb5bd"
                                        value={porcentajeInicial}
                                        onChangeText={setPorcentajeInicial}
                                        keyboardType="numeric"
                                        maxLength={5}
                                        editable={!fromFirmas}
                                    />
                                </View>
                            </View>

                            {/* Porcentaje final */}
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <FontAwesome name="percent" style={{ fontSize: 12, color: '#6f42c1', marginRight: 6 }} />
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: '#495057'
                                    }}>
                                        % Final
                                    </Text>
                                    <Text style={{ color: '#dc3545', marginLeft: 4 }}>*</Text>
                                </View>
                                <View style={{
                                    borderWidth: 1.5,
                                    borderColor: porcentajeFinal ? '#6f42c1' : '#dee2e6',
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1
                                }}>
                                    <TextInput
                                        style={{
                                            padding: 14,
                                            fontSize: 15,
                                            color: '#212529',
                                            fontWeight: '500',
                                            opacity: fromFirmas ? 0.6 : 1
                                        }}
                                        placeholder="0-100"
                                        placeholderTextColor="#adb5bd"
                                        value={porcentajeFinal}
                                        onChangeText={setPorcentajeFinal}
                                        keyboardType="numeric"
                                        maxLength={5}
                                        editable={!fromFirmas}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer con botones mejorado - Fixed at bottom */}
            {/* Mostrar botones si showSaveButton es true o si viene de firmas */}
            {/* Si es modo selección de tanques, mostrar botón para continuar */}
            {showTanqueSelection && selectedTanque && (
                <SafeAreaView style={{ backgroundColor: '#f8f9fa' }} edges={['bottom']}>
                    <View style={{
                        borderTopWidth: 1,
                        borderTopColor: '#e9ecef',
                        backgroundColor: '#f8f9fa',
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                borderWidth: 1.5,
                                borderColor: '#dee2e6',
                                borderRadius: 12,
                                paddingVertical: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1
                            }}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#6c757d'
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#002587',
                                borderRadius: 12,
                                paddingVertical: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 8,
                                shadowColor: '#002587',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                                elevation: 4
                            }}
                            onPress={() => {
                                // Cerrar este modal y abrir el modal de llenado con el tanque seleccionado
                                // Esto se manejará desde el componente padre
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="arrow-right" style={{ fontSize: 16, color: '#fff', marginRight: 8 }} />
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: '#fff'
                                }}>
                                    Continuar
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}
            {/* Mostrar botones si showSaveButton es true o si viene de firmas */}
            {!showTanqueSelection && (showSaveButton || fromFirmas) && (
                <SafeAreaView style={{ backgroundColor: '#f8f9fa' }} edges={['bottom']}>
                    <View style={{
                        borderTopWidth: 1,
                        borderTopColor: '#e9ecef',
                        backgroundColor: '#f8f9fa',
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                borderWidth: 1.5,
                                borderColor: '#dee2e6',
                                borderRadius: 12,
                                paddingVertical: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1
                            }}
                            onPress={onClose}
                            disabled={saving}
                            activeOpacity={0.7}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#6c757d'
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: saving ? '#adb5bd' : '#002587',
                                borderRadius: 12,
                                paddingVertical: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 8,
                                shadowColor: '#002587',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: saving ? 0 : 0.3,
                                shadowRadius: 6,
                                elevation: saving ? 0 : 4
                            }}
                            onPress={handleSave}
                            disabled={saving}
                            activeOpacity={0.8}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome name="save" style={{ fontSize: 16, color: '#fff', marginRight: 8 }} />
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        color: '#fff'
                                    }}>
                                        Guardar
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}
        </KeyboardAvoidingView>
    );

    return (
        <Modal
            visible={visible}
            transparent={Platform.OS === 'android'}
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
        >
            {Platform.OS === 'android' ? (
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'flex-end'
                }}>
                    <View style={{
                        flex: 1,
                        maxHeight: '90%',
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 10
                    }}>
                        {renderModalContent()}
                    </View>
                </View>
            ) : (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
                    {renderModalContent()}
                </SafeAreaView>
            )}
        </Modal>
    );
};

export default LlenadoTanquesModal;

