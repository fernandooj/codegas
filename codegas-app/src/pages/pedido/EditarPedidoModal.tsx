import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated, Image, Linking, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import moment from 'moment';
import { style } from './style';
import { formatCurrency } from '../../utils/number';
import { estadoColors } from '../../utils/colors';
import { EstadoPedido, AccesoUsuario, SelectedPedidoData } from './types';
import CambiarEstadoModal from './CambiarEstadoModal';
import VehiculosModal from './VehiculosModal';
import FechaEntregaModal from './FechaEntregaModal';
import CerrarPedidoModal from './CerrarPedidoModal';
import LlenadoTanquesModal from './LlenadoTanquesModal';
import SafetyChecklistModal from './SafetyChecklistModal';
import { updateLlenadoTanquesHTTP, shareFacturaPedidoPdf, obtenerFirmas } from '../../redux/actions/pedidoActions';
import { getTanquesByPunto } from '../../redux/actions/tanqueActions';
import { tanqueStorageService } from '../../services/tanqueStorageService';
import NetInfo from '@react-native-community/netinfo';
import { safetyChecklistQuestions } from '../../utils/constants';

interface EditarPedidoModalProps {
    visible: boolean;
    onClose: () => void;
    modalMainScale: Animated.Value;
    modalMainOpacity: Animated.Value;
    pedidoData: SelectedPedidoData;
    acceso?: AccesoUsuario;
    getEstadoColor: (estado: EstadoPedido) => string;
    getEstadoBackgroundColor: (estado: EstadoPedido) => string;
    onChangeState: () => void;
    onAssignVehicle: () => void;
    onCancelOrder: () => void;
    onClosePedido: () => void;
    onEditClosedPedido?: () => void;
    onResetPedido: () => void;
    navigation?: any;
    // Props para CambiarEstadoModal
    modalPerfiles: boolean;
    estadoChangedClicked?: boolean; // Nuevo prop para rastrear si se hizo click en cambiar estado
    onEstadoChange: (nuevoEstado: EstadoPedido) => void;
    onConfirmStateChange: () => void;
    onCancelStateChange: () => void;
    // Props para VehiculosModal y FechaEntregaModal
    modalConductor: boolean;
    modalFechaEntrega: boolean;
    vehiculos: any[];
    showCalendar: boolean;
    fechaEntregaModal?: string;
    idVehiculo?: string;
    placa?: string;
    onCloseConductor: () => void;
    onToggleCalendar: (show: boolean) => void;
    onDateSelect: (date: string) => void;
    onSaveDate: () => void;
    onVehicleSelect: (vehiculo: any) => void;
    onAssignVehicleAction: (vehiculo?: any) => void;
    onCloseFechaEntrega: () => void;
    onSaveFecha: () => void;
    // Props para CerrarPedidoModal
    modalCerrarPedido: boolean;
    onCloseCerrarPedido: () => void;
    onCerrarPedido: (data: any, pedidoId?: string) => void;
    onGuardarNovedad: (novedad: string, pedidoId?: string, motivoKey?: string) => void;
    valorUnitario?: string;
    onAprobarMaGister?: (pedidoId: number) => void;
    aprobarPedidoId?: number | null;
    modoEdicionCierre?: boolean;
}

const EditarPedidoModal: React.FC<EditarPedidoModalProps> = ({
    visible,
    onClose,
    modalMainScale,
    modalMainOpacity,
    pedidoData,
    acceso,
    getEstadoColor,
    getEstadoBackgroundColor,
    onChangeState,
    onAssignVehicle,
    onCancelOrder,
    onClosePedido,
    onEditClosedPedido,
    onResetPedido,
    navigation,
    modalPerfiles,
    estadoChangedClicked = false,
    onEstadoChange,
    onConfirmStateChange,
    onCancelStateChange,
    modalConductor,
    modalFechaEntrega,
    vehiculos,
    showCalendar,
    fechaEntregaModal,
    idVehiculo,
    placa,
    onCloseConductor,
    onToggleCalendar,
    onDateSelect,
    onSaveDate,
    onVehicleSelect,
    onAssignVehicleAction,
    onCloseFechaEntrega,
    onSaveFecha,
    modalCerrarPedido,
    onCloseCerrarPedido,
    onCerrarPedido,
    onGuardarNovedad,
    valorUnitario,
    onAprobarMaGister,
    aprobarPedidoId,
    modoEdicionCierre
}) => {
    const {
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
        codt,
        entregado,
        placaPedido,
        conductorPedido,
        kilos,
        factura,
        valor_total,
        forma_pago,
        motivo_no_cierre,
        perfil_novedad
    } = pedidoData;
    // Estado para el modal de navegación
    const [showNavigationModal, setShowNavigationModal] = useState(false);
    // Estado para el modal de llenado de tanques
    const [showLlenadoTanquesModal, setShowLlenadoTanquesModal] = useState(false);
    // Estado para el modal de checklist de seguridad
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    // Estado para el modal de selección de tanques
    const [showTanquesModal, setShowTanquesModal] = useState(false);
    const [tanques, setTanques] = useState<any[]>([]);
    const [selectedTanque, setSelectedTanque] = useState<any | null>(null);
    // Track si el checklist fue abierto desde el modal de tanques
    const [checklistOpenedFromTanques, setChecklistOpenedFromTanques] = useState(false);
    // Track si el modal de llenado fue abierto desde el modal de selección de tanques
    const [llenadoOpenedFromTanques, setLlenadoOpenedFromTanques] = useState(false);
    // Tanque seleccionado para llenado (puede ser diferente del selectedTanque del modal de selección)
    const [selectedTanqueForLlenado, setSelectedTanqueForLlenado] = useState<any | null>(null);
    const [loadingTanques, setLoadingTanques] = useState(false);
    // Estado local para los datos de tanques (se actualiza cuando se guarda)
    const [localTanquesData, setLocalTanquesData] = useState<any[]>(pedidoData.tanques || []);
    const [downloadingRemisionPdf, setDownloadingRemisionPdf] = useState(false);
    const [firmaUsuarioDebug, setFirmaUsuarioDebug] = useState<string | null>(pedidoData.firma_usuario || null);
    const [firmaDebugStatus, setFirmaDebugStatus] = useState('sin consultar');
    const [firmaImgError, setFirmaImgError] = useState(false);

    // Actualizar localTanquesData cuando cambia pedidoData.tanques
    useEffect(() => {
        setLocalTanquesData(pedidoData.tanques || []);
    }, [pedidoData.tanques]);

    useEffect(() => {
        let cancelled = false;
        const loadFirmas = async () => {
            if (!visible || !id || !entregado) {
                return;
            }
            setFirmaImgError(false);
            if (pedidoData.firma_usuario) {
                setFirmaUsuarioDebug(pedidoData.firma_usuario);
                setFirmaDebugStatus('en el pedido');
            } else {
                setFirmaDebugStatus('consultando API...');
            }
            const res = await obtenerFirmas(String(id));
            if (cancelled) {
                return;
            }
            const url =
                res?.data?.firma_usuario_datauri
                || res?.data?.firma_usuario_url
                || null;
            setFirmaUsuarioDebug(url);
            setFirmaDebugStatus(
                res?.data?.firma_usuario_datauri
                    ? 'API: firma en data URI (ok)'
                    : url
                        ? `API firmada: ${String(url).slice(0, 90)}`
                        : res?.data?.firma_usuario
                            ? 'API: hay URL privada pero no se pudo firmar/leer S3'
                            : 'API: este pedido no tiene firma_usuario'
            );
        };
        loadFirmas();
        return () => {
            cancelled = true;
        };
    }, [visible, id, entregado, pedidoData.firma_usuario]);

    // Funciones para navegación
    const openNavigationModal = () => {
        if (pedidoData.coordenadas) {
            setShowNavigationModal(true);
        } else {
            Alert.alert('Sin coordenadas', 'Este punto no tiene coordenadas disponibles para navegación');
        }
    };

    const closeNavigationModal = () => {
        setShowNavigationModal(false);
    };

    const openInWaze = () => {
        const { lat, lng } = pedidoData.coordenadas || {};
        const realLat = lat;
        const realLng = lng;

        if (realLat && realLng) {
            const url = `waze://?ll=${realLat},${realLng}&navigate=yes`;

            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    // Si Waze no está instalado, abrir en el navegador
                    const webUrl = `https://waze.com/ul?ll=${realLat},${realLng}&navigate=yes`;
                    Linking.openURL(webUrl);
                }
            });
        } else {
            Alert.alert('Error', 'No se encontraron coordenadas válidas para este pedido');
        }
        closeNavigationModal();
    };

    const openInGoogleMaps = () => {
        const { lat, lng } = pedidoData.coordenadas || {};
        const realLat = lat;
        const realLng = lng;

        if (realLat && realLng) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${realLat},${realLng}`;
            Linking.openURL(url);
        } else {
            Alert.alert('Error', 'No se encontraron coordenadas válidas para este pedido');
        }
        closeNavigationModal();
    };

    const openInAppleMaps = () => {
        const { lat, lng } = pedidoData.coordenadas || {};
        const realLat = lat;
        const realLng = lng;

        if (realLat && realLng) {
            const url = `http://maps.apple.com/?daddr=${realLat},${realLng}&dirflg=d`;
            Linking.openURL(url);
        } else {
            Alert.alert('Error', 'No se encontraron coordenadas válidas para este pedido');
        }
        closeNavigationModal();
    };

    // Función para cargar tanques
    const loadTanques = async () => {
        if (!pedidoData.puntoId) {
            Alert.alert('Error', 'No se encontró el punto de servicio');
            return;
        }

        try {
            setLoadingTanques(true);
            const puntoId = pedidoData.puntoId.toString();

            // Primero intentar cargar desde cache
            try {
                const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);
                if (cachedTanques && cachedTanques.length > 0) {
                    setTanques(cachedTanques);
                    setLoadingTanques(false);

                    // Verificar conexión para intentar actualizar en segundo plano
                    const netInfo = await NetInfo.fetch();
                    const isOnline = netInfo.isConnected ?? false;

                    if (isOnline) {
                        // Intentar actualizar desde servidor en segundo plano
                        (async () => {
                            try {
                                const response = await getTanquesByPunto(puntoId);
                                if (response?.tanque && Array.isArray(response.tanque) && response.tanque.length > 0) {
                                    setTanques(response.tanque);
                                }
                            } catch (updateError) {
                                console.warn('⚠️ Error actualizando tanques desde servidor (no crítico):', updateError);
                            }
                        })();
                    }
                    return;
                }
            } catch (cacheError: any) {
                console.warn('⚠️ Error cargando desde cache, intentando desde servidor:', cacheError);
            }

            // Si no hay cache o falló, intentar desde servidor
            const netInfo = await NetInfo.fetch();
            const isOnline = netInfo.isConnected ?? false;

            if (!isOnline) {
                setTanques([]);
                setLoadingTanques(false);
                return;
            }

            // Online: cargar desde servidor
            const response = await getTanquesByPunto(puntoId);

            if (response?.tanque && Array.isArray(response.tanque)) {
                setTanques(response.tanque);
            } else {
                setTanques([]);
            }
        } catch (error: any) {
            console.error('❌ Error cargando tanques:', error);
            // Intentar cargar desde cache como último recurso
            try {
                const cachedTanques = await tanqueStorageService.getTanquesByPunto(pedidoData.puntoId?.toString() || '');
                if (cachedTanques && cachedTanques.length > 0) {
                    setTanques(cachedTanques);
                    return;
                }
            } catch (cacheError: any) {
                console.error('❌ Error cargando desde cache:', cacheError);
            }
            setTanques([]);
        } finally {
            setLoadingTanques(false);
        }
    };

    // Abrir modal de tanques y cargar
    const openTanquesModal = () => {
        setShowTanquesModal(true);
        setSelectedTanque(null);
        loadTanques();
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={style.editarModalOverlay}>
                <Animated.View style={[
                    style.editarModalContainer,
                    {
                        transform: [{ scale: modalMainScale }],
                        opacity: modalMainOpacity,
                    }
                ]}>
                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        {/* Header mejorado del modal */}
                        <View style={style.editarModalHeader}>
                            <View style={style.editarModalHeaderContent}>
                                <Text style={style.editarModalHeaderTitle}>
                                    {razon_social}
                                </Text>
                                <View style={style.editarModalHeaderSubtitle}>
                                    <FontAwesome name="hashtag" style={style.editarModalHashtagIcon} />
                                    <Text style={style.editarModalPedidoId}>
                                        Pedido {id}
                                    </Text>
                                </View>
                            </View>

                            {/* Botón de resetear */}
                            {acceso === 'admin' && (
                                <TouchableOpacity
                                    onPress={onResetPedido}
                                    style={style.editarModalResetButton}
                                    activeOpacity={0.7}
                                >
                                    <FontAwesome name="undo" style={style.editarModalResetIcon} />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={onClose}
                                style={style.editarModalCloseButton}
                                activeOpacity={0.7}
                            >
                                <FontAwesome name="times" style={style.editarModalCloseIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Información del pedido organizada */}
                        <View style={style.editarModalBody}>
                            {/* Información básica */}
                            <View style={style.editarModalInfoCard}>
                                <Text style={style.editarModalInfoCardTitle}>
                                    Información del Cliente
                                </Text>

                                <View style={style.editarModalInfoCardContent}>
                                    <View style={style.editarModalInfoRow}>
                                        <FontAwesome name="id-card" style={[style.editarModalInfoIcon, style.editarModalInfoIconBlue]} />
                                        <Text style={style.editarModalInfoText}>
                                            <Text style={style.editarModalInfoTextBold}>Cédula/NIT: </Text>{cedula}
                                        </Text>
                                    </View>
                                    <View style={style.editarModalInfoRow}>
                                        <FontAwesome name="code" style={[style.editarModalInfoIcon, style.editarModalInfoIconPurple]} />
                                        <Text style={style.editarModalInfoText}>
                                            <Text style={style.editarModalInfoTextBold}>Codt: </Text>{codt}
                                        </Text>
                                    </View>
                                    <View style={style.editarModalInfoRow}>
                                        <FontAwesome name="list-alt" style={[style.editarModalInfoIcon, style.editarModalInfoIconGreen]} />
                                        <Text style={style.editarModalInfoText}>
                                            <Text style={style.editarModalInfoTextBold}>Forma: </Text>{forma}
                                        </Text>
                                    </View>
                                    {forma !== "lleno" && (
                                        <View style={style.editarModalInfoRow}>
                                            <FontAwesome name="cubes" style={[style.editarModalInfoIcon, style.editarModalInfoIconPurple]} />
                                            <Text style={style.editarModalInfoText}>
                                                <Text style={style.editarModalInfoTextBold}>
                                                    {forma == "cantidad" ? "Cantidad Kg: " : "Monto $: "}
                                                </Text>
                                                {forma == "cantidad" ? cantidadKl : cantidadPrecio}
                                            </Text>
                                        </View>
                                    )}
                                    {/* Motivo de no cierre */}
                                    {pedidoData.motivo_no_cierre && (
                                        <View style={style.editarModalInfoRow}>
                                            <FontAwesome name="exclamation-triangle" style={[style.editarModalInfoIcon, style.editarModalInfoIconRed]} />
                                            <Text style={style.editarModalInfoText}>
                                                <Text style={style.editarModalInfoTextBold}>Motivo: </Text>
                                                {pedidoData.motivo_no_cierre}
                                            </Text>
                                        </View>
                                    )}

                                    {fechaEntrega && (
                                        <View style={style.editarModalInfoRow}>
                                            <FontAwesome name="calendar" style={[style.editarModalInfoIcon, style.editarModalInfoIconRed]} />
                                            <Text style={style.editarModalInfoText}>
                                                <Text style={style.editarModalInfoTextBold}>Fecha entrega: </Text>
                                                {moment(fechaEntrega).format('YYYY-MM-DD')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Información adicional */}
                            {(creado || usuarioCrea || capacidad || observacion || observacion_pedido) && (
                                <View style={style.editarModalInfoCard}>
                                    <Text style={style.editarModalInfoCardTitle}>
                                        Detalles Adicionales
                                    </Text>

                                    <View style={style.editarModalAdditionalInfo}>
                                        {creado && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="clock-o" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Creado: </Text>
                                                {moment(creado).format("YYYY-MM-DD hh:mm")}
                                            </Text>
                                        )}
                                        {usuarioCrea && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="user" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Por: </Text>
                                                {usuarioCrea}
                                            </Text>
                                        )}
                                        {capacidad && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="database" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Almacenamiento: </Text>
                                                {capacidad} Galones
                                            </Text>
                                        )}
                                        {pedidoData.punto_email && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="envelope" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Email punto: </Text>
                                                {pedidoData.punto_email}
                                            </Text>
                                        )}
                                        {pedidoData.punto_nombre && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="user" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Encargado: </Text>
                                                {pedidoData.punto_nombre}
                                            </Text>
                                        )}
                                        {pedidoData.punto_celular && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="phone" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Celular: </Text>
                                                {pedidoData.punto_celular}
                                            </Text>
                                        )}
                                        {observacion && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="comment" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Obs. punto: </Text>
                                                {observacion}
                                            </Text>
                                        )}
                                        {observacion_pedido && (
                                            <Text style={style.editarModalAdditionalInfoText}>
                                                <FontAwesome name="sticky-note" style={style.editarModalAdditionalInfoIcon} />
                                                <Text style={style.editarModalInfoTextBold}>Obs. pedido: </Text>
                                                {observacion_pedido}
                                            </Text>
                                        )}

                                        {/* Botones de navegación y emergencia */}
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            {pedidoData.coordenadas && (
                                                <TouchableOpacity
                                                    onPress={openNavigationModal}
                                                    style={style.editarModalNavigateButton}
                                                >
                                                    <FontAwesome name="map-marker" style={style.editarModalNavigateIcon} />
                                                    <Text style={style.editarModalNavigateText}>
                                                        Navega al punto
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {/* Botón para Reporte de Emergencia */}
                                            <TouchableOpacity
                                                style={style.editarModalEmergencyButton}
                                                onPress={() => {
                                                    // Cerrar el modal actual

                                                    onClose();
                                                    // Navegar a la página de reporte de emergencia con el ID del pedido
                                                    if (navigation) {
                                                        navigation.navigate('nuevoReporteEmergencia', {
                                                            usuarioId: pedidoData.usuarioId,
                                                            puntoId: pedidoData.puntoId,
                                                            codt: pedidoData.codt,
                                                            razon_social: pedidoData.razon_social,
                                                            nombre: pedidoData.nombre
                                                        });
                                                    } else {
                                                    }
                                                }}
                                            >
                                                <FontAwesome
                                                    name="exclamation-triangle"
                                                    style={style.editarModalEmergencyIcon}
                                                />
                                                <Text style={style.editarModalEmergencyText}>
                                                    Reporte Emergencia
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Botón para Tanques - Solo si el pedido está activo y tiene conductor */}
                                        {(acceso === 'conductor' || acceso === 'admin') && estado === 'activo' && conductorPedido && (
                                            <TouchableOpacity
                                                style={style.editarModalChecklistButton}
                                                onPress={openTanquesModal}
                                            >
                                                <FontAwesome
                                                    name="database"
                                                    style={style.editarModalChecklistIcon}
                                                />
                                                <Text style={style.editarModalChecklistText}>
                                                    Tanques
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}


                            {/* CAMBIAR ESTADO - Mejorado con modal secundario */}
                            {(acceso == "admin" || acceso == "solucion" || acceso == "comercial") && !modalPerfiles && (
                                <View style={style.editarModalEstadoSection}>
                                    <Text style={style.editarModalEstadoTitle}>
                                        Gestión de Estado
                                    </Text>

                                    {/* Estado actual */}
                                    <View style={[
                                        style.editarModalEstadoActual,
                                        { flexDirection: 'row', gap: 10, borderColor: getEstadoColor(estado || "activo") }
                                    ]}>
                                        <Text style={style.editarModalEstadoLabel}>Estado actual:  </Text>
                                        <View style={style.editarModalEstadoRow}>
                                            <FontAwesome
                                                name={estado === "activo" ? "check-circle" : estado === "innactivo" ? "times-circle" : "pause-circle"}
                                                style={[
                                                    style.editarModalEstadoIcon,
                                                    { color: getEstadoColor(estado || "activo") }
                                                ]}
                                            />
                                            <Text style={style.editarModalEstadoText}>
                                                {estado === "activo" ? "Activo" : estado === "innactivo" ? "Inactivo" : estado === "espera" ? "En Espera" : estado}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Botón para cambiar estado - Oculto para despacho */}
                                    {(entregado == true && estado == "activo" ? (
                                        <View style={style.editarModalEstadoLocked}>
                                            <FontAwesome name="lock" style={style.editarModalEstadoLockedIcon} />
                                            <Text style={style.editarModalEstadoLockedText}>
                                                Pedido entregado, no se puede modificar.
                                            </Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={style.editarModalEstadoChangeButton}
                                            onPress={onChangeState}
                                            activeOpacity={0.8}
                                        >
                                            <FontAwesome name="edit" style={style.editarModalEstadoChangeIcon} />
                                            <Text style={style.editarModalEstadoChangeText}>
                                                Cambiar Estado
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                    )}
                                </View>
                            )}
                            {/* Renderizar CambiarEstadoModal cuando modalPerfiles es true - Oculto para despacho */}
                            {(acceso == "admin" || acceso == "solucion" || acceso == "comercial") && modalPerfiles && (
                                <CambiarEstadoModal
                                    visible={modalPerfiles}
                                    estado={estado}
                                    entregado={entregado}
                                    acceso={acceso}
                                    getEstadoColor={getEstadoColor}
                                    getEstadoBackgroundColor={getEstadoBackgroundColor}
                                    onEstadoChange={onEstadoChange}
                                    onConfirm={onConfirmStateChange}
                                    onCancel={onCancelStateChange}
                                />
                            )}
                            {/* Asignar Vehículo y fecha - Mejorado con mejor diseño */}
                            {/* Solo mostrar si el estado es activo Y se hizo click en cambiar estado */}
                            {
                                (acceso == "admin" || acceso == "despacho") && estado == "activo" && estadoChangedClicked
                                    ? <View style={style.contenedorEspera}>
                                        <View style={style.separador}></View>
                                        <Text style={[style.tituloModal, { marginBottom: 15, fontSize: 16, fontWeight: '500' }]}>Asignación de Vehículo</Text>

                                        {/* Información del vehículo asignado */}
                                        {placaPedido ? (
                                            <View style={[
                                                style.editarModalVehiculoAsignado,
                                                { borderLeftColor: getEstadoColor("activo") }
                                            ]}>
                                                <Text style={style.editarModalVehiculoLabel}>Vehículo asignado:</Text>
                                                <View style={style.editarModalVehiculoRowAsignado}>
                                                    <FontAwesome name="truck" style={[
                                                        style.editarModalVehiculoIconAsignado,
                                                        { color: getEstadoColor("activo") }
                                                    ]} />
                                                    <Text style={style.editarModalVehiculoTextAsignado}>
                                                        {placaPedido} - {conductorPedido}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={[
                                                style.editarModalVehiculoNoAsignado,
                                                { borderLeftColor: getEstadoColor("espera") }
                                            ]}>
                                                <View style={style.editarModalVehiculoRowNoAsignado}>
                                                    <FontAwesome name="exclamation-triangle" style={style.editarModalVehiculoIconNoAsignado} />
                                                    <Text style={style.editarModalVehiculoTextNoAsignado}>
                                                        Sin vehículo asignado
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {/* Botón para asignar vehículo - Oculto para despacho */}
                                        {
                                            acceso !== "despacho" && (
                                                entregado == true && estado == "activo"
                                                    ? null
                                                    : <TouchableOpacity
                                                        style={style.editarModalVehiculoButton}
                                                        onPress={onAssignVehicle}
                                                        activeOpacity={0.8}
                                                    >
                                                        <FontAwesome name="truck" style={style.editarModalVehiculoButtonIcon} />
                                                        <Text style={style.editarModalVehiculoButtonText}>
                                                            {placaPedido ? 'Cambiar Vehículo' : 'Asignar Vehículo'}
                                                        </Text>
                                                    </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                    : null
                            }

                            {/* Botón de cancelar pedido solo para clientes - Mejorado */}
                            {acceso === "cliente" && estado && estado !== "innactivo" && !entregado && (
                                <View style={style.editarModalCancelarSection}>
                                    <View style={style.separador}></View>
                                    <Text style={[style.tituloModal, { marginBottom: 15, fontSize: 18, fontWeight: '600' }]}>Opciones del Cliente</Text>

                                    {/* Advertencia antes del botón */}
                                    <View style={style.editarModalCancelarWarning}>
                                        <View style={style.editarModalCancelarWarningRow}>
                                            <FontAwesome name="exclamation-triangle" style={style.editarModalCancelarWarningIcon} />
                                            <Text style={style.editarModalCancelarWarningText}>
                                                Al cancelar el pedido, no podrá revertir esta acción
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={style.editarModalCancelarButton}
                                        onPress={onCancelOrder}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesome name="times-circle" style={style.editarModalCancelarButtonIcon} />
                                        <Text style={style.editarModalCancelarButtonText}>
                                            Cancelar Pedido
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Mostrar información del pedido entregado/cerrado - DISEÑO MEJORADO */}
                            {entregado && (
                                <View style={style.editarModalEntregadoContainer}>
                                    {/* Header con icono de éxito */}
                                    <View style={style.editarModalEntregadoHeader}>
                                        <View style={style.editarModalEntregadoIconContainer}>
                                            <FontAwesome name="check-circle" style={style.editarModalEntregadoIcon} />
                                        </View>
                                        <Text style={style.editarModalEntregadoTitle}>
                                            🎉 Pedido Finalizado
                                        </Text>
                                        {estado != "noentregado" && (<Text style={style.editarModalEntregadoSubtitle}>
                                            Completado y entregado exitosamente
                                        </Text>)}
                                    </View>

                                    {/* Imagen de la factura si existe */}
                                    {pedidoData.imagenCerrar && (
                                        <View style={style.editarModalImageSection}>
                                            <View style={style.editarModalImageWrapper}>
                                                <Image
                                                    source={{ uri: pedidoData.imagenCerrar }}
                                                    style={style.editarModalImage}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            <View style={style.editarModalImageBadge}>
                                                <FontAwesome name="camera" style={style.editarModalImageBadgeIcon} />
                                                <Text style={style.editarModalImageBadgeText}>
                                                    Imagen registrada exitosamente
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Cards de información mejoradas */}

                                    <View style={style.editarModalCardsContainer}>
                                        {/* Card principal con total */}
                                        {estado != "noentregado" && (
                                            <View style={style.editarModalMainCard}>
                                                <View style={style.editarModalMainCardRow}>
                                                    <Text style={style.editarModalMainCardTitle}>
                                                        💰 Total Facturado
                                                    </Text>
                                                    <Text style={style.editarModalMainCardValue}>
                                                        {valor_total ? formatCurrency(valor_total) : 'N/A'}
                                                    </Text>
                                                </View>
                                                {forma_pago && (
                                                    <View style={style.editarModalMainCardDivider}>
                                                        <Text style={style.editarModalMainCardLabel}>Forma de pago:</Text>
                                                        <View style={[
                                                            style.editarModalFormaPagoBadge,
                                                            forma_pago === 'Contado' ? style.editarModalFormaPagoBadgeContado : style.editarModalFormaPagoBadgeCredito
                                                        ]}>
                                                            <Text style={[
                                                                style.editarModalFormaPagoText,
                                                                forma_pago === 'Contado' ? style.editarModalFormaPagoTextContado : style.editarModalFormaPagoTextCredito
                                                            ]}>
                                                                {forma_pago === 'Contado' ? '💵 Contado' : '💳 Crédito'}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                        {/* Card de detalles */}
                                        <View style={style.editarModalDetailsCard}>
                                            <Text style={style.editarModalDetailsCardTitle}>
                                                📋 Información del Pedido
                                            </Text>

                                            <View style={style.editarModalDetailsCardContent}>
                                                {kilos && (
                                                    <View style={style.editarModalDetailsRow}>
                                                        <View style={style.editarModalDetailsRowLeft}>
                                                            <FontAwesome name="balance-scale" style={style.editarModalDetailsIcon} />
                                                            <Text style={style.editarModalDetailsLabel}>Kilos:</Text>
                                                        </View>
                                                        <Text style={style.editarModalDetailsValue}>{kilos}</Text>
                                                    </View>
                                                )}

                                                {factura && (
                                                    <View style={style.editarModalDetailsRow}>
                                                        <View style={style.editarModalDetailsRowLeft}>
                                                            <FontAwesome name="file-text" style={style.editarModalDetailsIcon} />
                                                            <Text style={style.editarModalDetailsLabel}>Consecutivo:</Text>
                                                        </View>
                                                        <Text style={style.editarModalDetailsValue}>{factura}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        {entregado && id && estado !== 'noentregado' && (
                                            <>
                                            <View
                                                style={{
                                                    marginTop: 12,
                                                    alignSelf: 'center',
                                                    width: '92%',
                                                    borderWidth: 2,
                                                    borderColor: '#e11d48',
                                                    borderRadius: 12,
                                                    backgroundColor: '#fff7ed',
                                                    padding: 8
                                                }}
                                            >
                                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#9f1239', marginBottom: 6 }}>
                                                    DEBUG firma cliente (temporal)
                                                </Text>
                                                <Text style={{ fontSize: 10, color: '#7f1d1d', marginBottom: 2 }}>
                                                    Nombre: {pedidoData.nombre || pedidoData.razon_social || '—'}
                                                </Text>
                                                <Text style={{ fontSize: 10, color: '#7f1d1d', marginBottom: 6 }}>
                                                    C.C.: {pedidoData.cedula || '—'}
                                                </Text>
                                                <Text style={{ fontSize: 10, color: '#7f1d1d', marginBottom: 6 }}>
                                                    {firmaDebugStatus}
                                                </Text>
                                                {firmaUsuarioDebug && !firmaImgError ? (
                                                    <Image
                                                        source={{ uri: firmaUsuarioDebug }}
                                                        style={{
                                                            width: '100%',
                                                            height: 90,
                                                            backgroundColor: '#fff',
                                                            resizeMode: 'contain'
                                                        }}
                                                        onError={() => setFirmaImgError(true)}
                                                    />
                                                ) : (
                                                    <View
                                                        style={{
                                                            height: 90,
                                                            backgroundColor: '#fff',
                                                            borderWidth: 1,
                                                            borderColor: '#fda4af',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            paddingHorizontal: 8
                                                        }}
                                                    >
                                                        <Text style={{ fontStyle: 'italic', fontSize: 22, color: '#be123c' }}>
                                                            Firma cliente
                                                        </Text>
                                                        <Text style={{ fontSize: 11, color: '#9f1239', textAlign: 'center', marginTop: 4 }}>
                                                            {firmaUsuarioDebug
                                                                ? 'Hay URL pero la imagen no carga (S3 privado)'
                                                                : 'No hay firma_usuario en este pedido'}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    marginTop: 8,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                    paddingVertical: 12,
                                                    paddingHorizontal: 20,
                                                    borderRadius: 12,
                                                    borderWidth: 1.5,
                                                    borderColor: '#002587',
                                                    backgroundColor: '#fff',
                                                    minWidth: 220
                                                }}
                                                disabled={downloadingRemisionPdf}
                                                onPress={async () => {
                                                    if (!id) return;
                                                    try {
                                                        setDownloadingRemisionPdf(true);
                                                        await shareFacturaPedidoPdf(String(id));
                                                    } catch (e) {
                                                        console.error('shareFacturaPedidoPdf', e);
                                                        Alert.alert(
                                                            'Error',
                                                            'No se pudo obtener el PDF. Compruebe su conexión o que el pedido esté cerrado en el servidor.'
                                                        );
                                                    } finally {
                                                        setDownloadingRemisionPdf(false);
                                                    }
                                                }}
                                                activeOpacity={0.85}
                                            >
                                                {downloadingRemisionPdf ? (
                                                    <ActivityIndicator size="small" color="#002587" />
                                                ) : (
                                                    <FontAwesome name="file-pdf-o" style={{ fontSize: 18, color: '#002587', marginRight: 8 }} />
                                                )}
                                                <Text style={{ fontSize: 15, fontWeight: '700', color: '#002587' }}>
                                                    Descargar remisión PDF
                                                </Text>
                                            </TouchableOpacity>
                                            </>
                                        )}

                                        {estado === 'activo' && entregado && (acceso === 'admin' || acceso === 'facturacion') && (
                                            <TouchableOpacity
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    borderWidth: 1,
                                                    borderColor: estadoColors.activo,
                                                    borderRadius: 20,
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 24,
                                                    alignSelf: 'center',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onPress={() => {
                                                    const pedidoId = Number(id);
                                                    if (Number.isNaN(pedidoId)) {
                                                        return;
                                                    }

                                                    Alert.alert(
                                                        'Confirmar aprobación',
                                                        `¿Deseas aprobar el pedido #${pedidoId} y enviarlo a MaGister?`,
                                                        [
                                                            { text: 'Cancelar', style: 'cancel' },
                                                            {
                                                                text: 'Sí, aprobar',
                                                                style: 'default',
                                                                onPress: () => onAprobarMaGister?.(pedidoId)
                                                            }
                                                        ]
                                                    );
                                                }}
                                                disabled={Number.isNaN(Number(id)) || aprobarPedidoId === Number(id)}
                                            >
                                                {aprobarPedidoId === Number(id) ? (
                                                    <ActivityIndicator size="small" color={estadoColors.activo} />
                                                ) : (
                                                    <Text style={{ color: estadoColors.activo, fontWeight: '700', fontSize: 16, textAlign: 'center' }}>
                                                        Aprobar
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        )}

                                        {entregado && acceso === 'admin' && (
                                            <TouchableOpacity
                                                style={[
                                                    style.editarModalCerrarButton,
                                                    {
                                                        marginTop: 6,
                                                        alignSelf: 'center',
                                                        minWidth: 180,
                                                        backgroundColor: '#f59e0b'
                                                    }
                                                ]}
                                                onPress={() => {
                                                    if (onEditClosedPedido) {
                                                        onEditClosedPedido();
                                                        return;
                                                    }
                                                    onClosePedido();
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <FontAwesome name="edit" style={style.editarModalCerrarButtonIcon} />
                                                <Text style={style.editarModalCerrarButtonText}>
                                                    Editar Cierre
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        {/* Card de Firmas Digitales */}
                                        {(pedidoData.firma_conductor || pedidoData.firma_usuario) && (
                                            <View style={style.editarModalDetailsCard}>
                                                <Text style={style.editarModalDetailsCardTitle}>
                                                    ✍️ Firmas Digitales
                                                </Text>

                                                <View style={style.editarModalDetailsCardContent}>
                                                    {pedidoData.firma_conductor && (
                                                        <View style={{ marginBottom: 16 }}>
                                                            <Text style={[style.editarModalDetailsLabel, { marginBottom: 8 }]}>
                                                                Firma del Conductor
                                                            </Text>
                                                            <View style={{
                                                                borderRadius: 12,
                                                                overflow: 'hidden',
                                                                borderWidth: 2,
                                                                borderColor: '#007bff',
                                                                backgroundColor: '#f8f9fa',
                                                                minHeight: 150
                                                            }}>
                                                                <Image
                                                                    source={{
                                                                        uri: pedidoData.firma_conductor,
                                                                        cache: 'force-cache'
                                                                    }}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: 150,
                                                                        resizeMode: 'contain',
                                                                        backgroundColor: '#fff'
                                                                    }}
                                                                    onLoad={() => {
                                                                        console.log('✅ [EditarPedidoModal] Firma conductor cargada');
                                                                    }}
                                                                    onError={(error) => {
                                                                        console.error('❌ [EditarPedidoModal] Error cargando firma conductor:', error);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {pedidoData.firma_usuario && (
                                                        <View>
                                                            <Text style={[style.editarModalDetailsLabel, { marginBottom: 8 }]}>
                                                                Firma del Usuario/Cliente
                                                            </Text>
                                                            <View style={{
                                                                borderRadius: 12,
                                                                overflow: 'hidden',
                                                                borderWidth: 2,
                                                                borderColor: '#28a745',
                                                                backgroundColor: '#f8f9fa',
                                                                minHeight: 150
                                                            }}>
                                                                <Image
                                                                    source={{
                                                                        uri: pedidoData.firma_usuario,
                                                                        cache: 'force-cache'
                                                                    }}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: 150,
                                                                        resizeMode: 'contain',
                                                                        backgroundColor: '#fff'
                                                                    }}
                                                                    onLoad={() => {
                                                                        console.log('✅ [EditarPedidoModal] Firma usuario cargada');
                                                                    }}
                                                                    onError={(error) => {
                                                                        console.error('❌ [EditarPedidoModal] Error cargando firma usuario:', error);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        )}

                                        {/* Card de información adicional si existen otros campos */}
                                        {(motivo_no_cierre || perfil_novedad) && (
                                            <View style={style.editarModalWarningCard}>
                                                <Text style={style.editarModalWarningCardTitle}>
                                                    ℹ️ Información Adicional
                                                </Text>
                                                {motivo_no_cierre && (
                                                    <View style={style.editarModalWarningRow}>
                                                        <Text style={style.editarModalWarningLabel}>Motivo no cierre:</Text>
                                                        <Text style={style.editarModalWarningValue}>
                                                            {motivo_no_cierre}
                                                        </Text>
                                                    </View>
                                                )}
                                                {perfil_novedad && (
                                                    <View style={style.editarModalWarningRow}>
                                                        <Text style={style.editarModalWarningLabel}>Perfil novedad:</Text>
                                                        <Text style={style.editarModalWarningValue}>
                                                            {perfil_novedad}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* Sección de cerrar pedido - Oculto para despacho */}
                            {(acceso === "admin" || acceso === "conductor") && fechaEntrega && !entregado && (
                                <View style={style.editarModalCerrarSection}>
                                    <View style={style.editarModalCerrarHeader}>
                                        <FontAwesome name="check-circle" style={style.editarModalCerrarIcon} />
                                        <Text style={style.editarModalCerrarTitle}>
                                            Finalización del Pedido
                                        </Text>
                                    </View>

                                    <Text style={style.editarModalCerrarDescription}>
                                        Complete la información para finalizar este pedido.
                                    </Text>

                                    <TouchableOpacity
                                        style={style.editarModalCerrarButton}
                                        onPress={onClosePedido}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesome name="edit" style={style.editarModalCerrarButtonIcon} />
                                        <Text style={style.editarModalCerrarButtonText}>
                                            Cerrar Pedido
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Modales internos que aparecen encima del modal principal */}
                <VehiculosModal
                    visible={modalConductor}
                    onClose={onCloseConductor}
                    vehiculos={vehiculos}
                    showCalendar={showCalendar}
                    onToggleCalendar={onToggleCalendar}
                    fechaEntrega={fechaEntregaModal}
                    onDateSelect={onDateSelect}
                    onSaveDate={onSaveDate}
                    idVehiculo={idVehiculo}
                    placa={placa}
                    onVehicleSelect={onVehicleSelect}
                    onAssignVehicle={onAssignVehicleAction}
                />

                <FechaEntregaModal
                    visible={modalFechaEntrega}
                    onClose={onCloseFechaEntrega}
                    fechaEntrega={fechaEntregaModal}
                    onDateSelect={onDateSelect}
                    onSave={onSaveFecha}
                />

                {modalCerrarPedido && (
                    <CerrarPedidoModal
                        key={`cerrar-pedido-${pedidoData.id || 'default'}`}
                        visible={modalCerrarPedido}
                        pedidoId={pedidoData.id}
                        onClose={onCloseCerrarPedido}
                        entregado={pedidoData.entregado}
                        modoEdicion={modoEdicionCierre}
                        imagenCerrar={pedidoData.imagenCerrar}
                        kilos={pedidoData.kilos}
                        factura={pedidoData.factura}
                        valor_total={pedidoData.valor_total}
                        remision={pedidoData.remision}
                        forma_pago={pedidoData.forma_pago}
                        valor_unitario={valorUnitario}
                        firma_conductor={pedidoData.firma_conductor}
                        firma_usuario={pedidoData.firma_usuario}
                        puntoId={pedidoData.puntoId?.toString()}
                        usuarioId={pedidoData.usuarioId?.toString()}
                        email={pedidoData.email}
                        onCerrarPedido={onCerrarPedido}
                        onGuardarNovedad={onGuardarNovedad}
                    />
                )}

                {/* Modal de Navegación */}
                <Modal
                    transparent={true}
                    visible={showNavigationModal}
                    animationType="fade"
                    onRequestClose={closeNavigationModal}
                >
                    <View style={style.navModalOverlay}>
                        <View style={style.navModalContainer}>
                            {/* Header */}
                            <View style={style.navModalHeader}>
                                <Text style={style.navModalTitle}>
                                    Navegar al punto
                                </Text>
                                <TouchableOpacity
                                    onPress={closeNavigationModal}
                                    style={style.navModalCloseButton}
                                >
                                    <FontAwesome name="times" size={14} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Coordenadas */}
                            {pedidoData.coordenadas && (
                                <View style={style.navModalCoordBox}>
                                    <Text style={style.navModalCoordText}>
                                        <FontAwesome name="map-pin" style={style.navModalCoordIcon} />
                                        Lat: {pedidoData.coordenadas.lat}, Lng: {pedidoData.coordenadas.lng}
                                    </Text>
                                </View>
                            )}

                            {/* Opciones de navegación */}
                            <View style={style.navModalOptions}>
                                {/* Waze */}
                                <TouchableOpacity
                                    onPress={openInWaze}
                                    style={style.navModalWazeButton}
                                >
                                    <View style={style.navModalButtonIconBox}>
                                        <FontAwesome name="road" size={20} color="#fff" />
                                    </View>
                                    <View style={style.navModalButtonContent}>
                                        <Text style={style.navModalButtonTitle}>
                                            Waze
                                        </Text>
                                        <Text style={style.navModalButtonSubtitle}>
                                            Navegación en tiempo real
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>

                                {/* Google Maps */}
                                <TouchableOpacity
                                    onPress={openInGoogleMaps}
                                    style={style.navModalGoogleButton}
                                >
                                    <View style={style.navModalButtonIconBox}>
                                        <FontAwesome name="globe" size={20} color="#fff" />
                                    </View>
                                    <View style={style.navModalButtonContent}>
                                        <Text style={style.navModalButtonTitle}>
                                            Google Maps
                                        </Text>
                                        <Text style={style.navModalButtonSubtitle}>
                                            Mapas de Google
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>

                                {/* Apple Maps */}
                                <TouchableOpacity
                                    onPress={openInAppleMaps}
                                    style={style.navModalAppleButton}
                                >
                                    <View style={style.navModalButtonIconBox}>
                                        <FontAwesome name="apple" size={20} color="#fff" />
                                    </View>
                                    <View style={style.navModalButtonContent}>
                                        <Text style={style.navModalButtonTitle}>
                                            Apple Maps
                                        </Text>
                                        <Text style={style.navModalButtonSubtitle}>
                                            Mapas de Apple
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>
                            </View>

                            {/* Botón cancelar */}
                            <TouchableOpacity
                                onPress={closeNavigationModal}
                                style={style.navModalCancelButton}
                            >
                                <Text style={style.navModalCancelText}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal de Llenado de Tanques */}
                <LlenadoTanquesModal
                    visible={showLlenadoTanquesModal}
                    onClose={() => {
                        // Cerrar el modal de llenado
                        setShowLlenadoTanquesModal(false);
                        // Si el modal de llenado fue abierto desde el modal de selección, reabrirlo
                        if (llenadoOpenedFromTanques) {
                            setLlenadoOpenedFromTanques(false);
                            setShowTanquesModal(true);
                        }
                    }}
                    pedidoId={id || ''}
                    tanqueId={Number(selectedTanqueForLlenado?._id ?? selectedTanqueForLlenado?.id) || 0}
                    puntoId={pedidoData.puntoId?.toString()}
                    usuarioId={pedidoData.usuarioId?.toString()}
                    email={pedidoData.email}
                    showSaveButton={true}
                    showTanqueSelection={false}
                    tanquesData={localTanquesData}
                    initialData={(() => {
                        // Obtener datos del tanque desde el campo tanques del pedido si existe
                        if (localTanquesData && Array.isArray(localTanquesData) && selectedTanqueForLlenado) {
                            const lid = Number(selectedTanqueForLlenado._id ?? selectedTanqueForLlenado.id);
                            const tanqueData = localTanquesData.find((t: any) => Number(t.tanque_id) === lid);
                            if (tanqueData) {
                                return {
                                    presion_inicial: tanqueData.presion_inicial,
                                    presion_final: tanqueData.presion_final,
                                    porcentaje_inicial: tanqueData.porcentaje_inicial,
                                    porcentaje_final: tanqueData.porcentaje_final,
                                    estado: tanqueData.estado
                                };
                            }
                        }
                        return {};
                    })()}
                    onSave={async (data) => {
                        // Actualizar el estado local de tanques con los nuevos datos guardados
                        if (selectedTanqueForLlenado) {
                            const lid = Number(selectedTanqueForLlenado._id ?? selectedTanqueForLlenado.id);
                            setLocalTanquesData((prevTanques: any[]) => {
                                const updatedTanques = [...(prevTanques || [])];
                                const tanqueIndex = updatedTanques.findIndex((t: any) => Number(t.tanque_id) === lid);

                                const updatedTanqueData = {
                                    tanque_id: lid,
                                    presion_inicial: data.presion_inicial,
                                    presion_final: data.presion_final,
                                    porcentaje_inicial: data.porcentaje_inicial,
                                    porcentaje_final: data.porcentaje_final,
                                    estado: data.estado,
                                    // Mantener otros campos existentes si los hay
                                    ...(tanqueIndex >= 0 ? {
                                        tipo_suministro: updatedTanques[tanqueIndex].tipo_suministro,
                                        observacion: updatedTanques[tanqueIndex].observacion,
                                        checklist: updatedTanques[tanqueIndex].checklist
                                    } : {})
                                };

                                if (tanqueIndex >= 0) {
                                    // Actualizar tanque existente
                                    updatedTanques[tanqueIndex] = updatedTanqueData;
                                } else {
                                    // Agregar nuevo tanque
                                    updatedTanques.push(updatedTanqueData);
                                }

                                return updatedTanques;
                            });
                        }

                        // Cerrar el modal de llenado
                        setShowLlenadoTanquesModal(false);
                        // Si el modal de llenado fue abierto desde el modal de selección, reabrirlo
                        if (llenadoOpenedFromTanques) {
                            setLlenadoOpenedFromTanques(false);
                            setShowTanquesModal(true);
                        }
                    }}
                />

                {/* Modal de Checklist de Seguridad */}
                <SafetyChecklistModal
                    visible={showChecklistModal}
                    onClose={() => {
                        setShowChecklistModal(false);
                        // Si el checklist fue abierto desde el modal de tanques, reabrirlo
                        if (checklistOpenedFromTanques) {
                            setChecklistOpenedFromTanques(false);
                            setShowTanquesModal(true);
                        }
                    }}
                    pedidoId={id || ''}
                    tanqueId={Number(selectedTanque?._id ?? selectedTanque?.id) || 0}
                    initialChecklist={(() => {
                        if (!selectedTanque) return [];
                        const tid = Number(selectedTanque._id ?? selectedTanque.id);
                        if (!Number.isFinite(tid) || tid <= 0) return [];
                        const tanqueData = localTanquesData.find((t: any) => Number(t.tanque_id) === tid);
                        if (tanqueData?.checklist && Array.isArray(tanqueData.checklist)) {
                            const byPregunta = new Map(
                                tanqueData.checklist.map((item: any) => [
                                    item.pregunta,
                                    item.respuesta === 'Sí'
                                ])
                            );
                            return safetyChecklistQuestions.map((q) => ({
                                id: q.id,
                                status: byPregunta.has(q.question) ? Boolean(byPregunta.get(q.question)) : false
                            }));
                        }
                        return [];
                    })()}
                    initialObservacion={(() => {
                        if (!selectedTanque) return null;
                        const tid = Number(selectedTanque._id ?? selectedTanque.id);
                        if (!Number.isFinite(tid) || tid <= 0) return null;
                        const tanqueData = localTanquesData.find((t: any) => Number(t.tanque_id) === tid);
                        return tanqueData?.observacion ?? null;
                    })()}
                    checklistPdfMeta={(() => {
                        const tid = selectedTanque
                            ? Number(selectedTanque._id ?? selectedTanque.id)
                            : NaN;
                        const tanqueData =
                            Number.isFinite(tid) && tid > 0
                                ? localTanquesData.find((t: any) => Number(t.tanque_id) === tid)
                                : undefined;
                        const cap =
                            selectedTanque?.capacidad ??
                            selectedTanque?.kilos ??
                            pedidoData.capacidad;
                        return {
                            cliente: pedidoData.razon_social || pedidoData.nombre,
                            codt: pedidoData.codt,
                            direccion: pedidoData.punto_nombre || '',
                            telefono: pedidoData.punto_celular,
                            fecha: pedidoData.fechaEntrega || pedidoData.creado,
                            presionInicial:
                                tanqueData?.presion_inicial != null && tanqueData.presion_inicial !== ''
                                    ? String(tanqueData.presion_inicial)
                                    : '',
                            presionFinal:
                                tanqueData?.presion_final != null && tanqueData.presion_final !== ''
                                    ? String(tanqueData.presion_final)
                                    : '',
                            planillaDiariaNo: '',
                            placaVehiculo: pedidoData.placaPedido || pedidoData.placa,
                            noRemision: pedidoData.remision,
                            capTanque: cap != null && cap !== '' ? String(cap) : '',
                            noPedido: pedidoData.nPedido || pedidoData.factura,
                            noTanque:
                                Number.isFinite(tid) && tid > 0
                                    ? String(selectedTanque?.codigo ?? selectedTanque?.numero ?? tid)
                                    : '',
                            pctInicial:
                                tanqueData?.porcentaje_inicial != null && tanqueData.porcentaje_inicial !== ''
                                    ? String(tanqueData.porcentaje_inicial)
                                    : '',
                            pctFinal:
                                tanqueData?.porcentaje_final != null && tanqueData.porcentaje_final !== ''
                                    ? String(tanqueData.porcentaje_final)
                                    : '',
                            conductorNombre: pedidoData.conductorPedido,
                            pedidoId: pedidoData.id
                        };
                    })()}
                    onSave={(_checklist, _observacion, savedPatch) => {
                        if (savedPatch && selectedTanque) {
                            const tid = Number(selectedTanque._id ?? selectedTanque.id);
                            if (Number.isFinite(tid) && tid > 0) {
                                setLocalTanquesData((prevTanques: any[]) => {
                                    const updatedTanques = [...(prevTanques || [])];
                                    const tanqueIndex = updatedTanques.findIndex((t: any) => Number(t.tanque_id) === tid);
                                    const base = tanqueIndex >= 0 ? updatedTanques[tanqueIndex] : {};
                                    const merged = {
                                        ...base,
                                        tanque_id: tid,
                                        checklist: savedPatch.checklist,
                                        observacion: savedPatch.observacion
                                    };
                                    if (tanqueIndex >= 0) {
                                        updatedTanques[tanqueIndex] = merged;
                                    } else {
                                        updatedTanques.push(merged);
                                    }
                                    return updatedTanques;
                                });
                            }
                        }
                        setShowChecklistModal(false);
                        if (checklistOpenedFromTanques) {
                            setChecklistOpenedFromTanques(false);
                            setShowTanquesModal(true);
                        }
                    }}
                />

                {/* Modal de Selección de Tanques */}
                <Modal
                    transparent={true}
                    visible={showTanquesModal}
                    animationType="slide"
                    onRequestClose={() => {
                        setShowTanquesModal(false);
                        setSelectedTanque(null);
                    }}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            width: '90%',
                            maxHeight: '80%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            elevation: 25
                        }}>
                            {/* Header */}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: '#e9ecef',
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                backgroundColor: '#f8f9fa'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        backgroundColor: '#007bff',
                                        borderRadius: 10,
                                        padding: 8,
                                        marginRight: 12
                                    }}>
                                        <FontAwesome name="database" style={{ fontSize: 20, color: '#fff' }} />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                                            Seleccionar Tanque
                                        </Text>
                                        <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                                            Elige un tanque para continuar
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowTanquesModal(false);
                                        setSelectedTanque(null);
                                    }}
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 20,
                                        width: 36,
                                        height: 36,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome name="times" style={{ fontSize: 16, color: '#666' }} />
                                </TouchableOpacity>
                            </View>

                            {/* Contenido */}
                            <ScrollView style={{ maxHeight: '60%' }} showsVerticalScrollIndicator={true}>
                                {loadingTanques ? (
                                    <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator size="large" color="#007bff" />
                                        <Text style={{ marginTop: 16, color: '#666', fontSize: 14 }}>
                                            Cargando tanques...
                                        </Text>
                                    </View>
                                ) : tanques.length === 0 ? (
                                    <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesome name="exclamation-circle" style={{ fontSize: 48, color: '#ffc107', marginBottom: 16 }} />
                                        <Text style={{ color: '#666', fontSize: 14, textAlign: 'center' }}>
                                            No se encontraron tanques para este punto
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ padding: 20 }}>
                                        {tanques.map((tanque) => (
                                            <TouchableOpacity
                                                key={tanque._id}
                                                style={{
                                                    padding: 18,
                                                    marginBottom: 12,
                                                    borderRadius: 14,
                                                    borderWidth: selectedTanque?._id === tanque._id ? 2.5 : 1.5,
                                                    borderColor: selectedTanque?._id === tanque._id ? '#007bff' : '#e9ecef',
                                                    backgroundColor: selectedTanque?._id === tanque._id ? '#e3f2fd' : '#ffffff',
                                                    shadowColor: selectedTanque?._id === tanque._id ? '#007bff' : '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: selectedTanque?._id === tanque._id ? 0.15 : 0.05,
                                                    shadowRadius: 4,
                                                    elevation: selectedTanque?._id === tanque._id ? 4 : 2
                                                }}
                                                onPress={() => setSelectedTanque(tanque)}
                                                activeOpacity={0.7}
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
                                                                backgroundColor: selectedTanque?._id === tanque._id ? '#007bff' : '#6c757d',
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
                                                                color: selectedTanque?._id === tanque._id ? '#007bff' : '#212529',
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
                                                            backgroundColor: '#007bff',
                                                            borderRadius: 20,
                                                            width: 32,
                                                            height: 32,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            shadowColor: '#007bff',
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
                                )}
                            </ScrollView>

                            {/* Botones de acción - Solo se muestran cuando hay un tanque seleccionado */}
                            {selectedTanque && (
                                <View style={{
                                    padding: 20,
                                    borderTopWidth: 1,
                                    borderTopColor: '#e9ecef',
                                    gap: 12
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#007bff',
                                            borderRadius: 12,
                                            paddingVertical: 16,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                            elevation: 3
                                        }}
                                        onPress={() => {
                                            console.log('🔵 [EditarPedidoModal] Abriendo checklist modal, tanque seleccionado:', selectedTanque);
                                            setChecklistOpenedFromTanques(true);
                                            // Cerrar temporalmente el modal de tanques para que el checklist se muestre correctamente
                                            setShowTanquesModal(false);
                                            // Usar setTimeout para asegurar que el modal de tanques se cierre antes de abrir el checklist
                                            setTimeout(() => {
                                                setShowChecklistModal(true);
                                            }, 100);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesome name="shield" style={{ fontSize: 18, color: '#fff', marginRight: 10 }} />
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                            Lista de Chequeo de Seguridad
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#28a745',
                                            borderRadius: 12,
                                            paddingVertical: 16,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                            elevation: 3
                                        }}
                                        onPress={() => {
                                            // Al hacer click en "Llenado de Tanques", abrir el modal de llenado
                                            if (selectedTanque) {
                                                setLlenadoOpenedFromTanques(true);
                                                setSelectedTanqueForLlenado(selectedTanque);
                                                setShowTanquesModal(false);
                                                setShowLlenadoTanquesModal(true);
                                            }
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesome name="tint" style={{ fontSize: 18, color: '#fff', marginRight: 10 }} />
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                            Llenado de Tanques
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    );
};

export default EditarPedidoModal;
