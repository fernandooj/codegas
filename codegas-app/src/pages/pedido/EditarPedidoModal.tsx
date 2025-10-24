import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated, Image, Linking, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import moment from 'moment';
import { style } from './style';
import { formatCurrency } from '../../utils/number';
import { EstadoPedido, AccesoUsuario, SelectedPedidoData } from './types';
import CambiarEstadoModal from './CambiarEstadoModal';
import VehiculosModal from './VehiculosModal';
import FechaEntregaModal from './FechaEntregaModal';
import CerrarPedidoModal from './CerrarPedidoModal';

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
    valorUnitario
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
    } = pedidoData;
    // Estado para el modal de navegación
    const [showNavigationModal, setShowNavigationModal] = useState(false);

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

        // Intercambiar coordenadas: lat del backend es realmente lng, y lng del backend es realmente lat
        const realLat = lng; // La latitud real está en el campo lng
        const realLng = lat; // La longitud real está en el campo lat

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

        // Intercambiar coordenadas: lat del backend es realmente lng, y lng del backend es realmente lat
        const realLat = lng; // La latitud real está en el campo lng
        const realLng = lat; // La longitud real está en el campo lat

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

        // Intercambiar coordenadas: lat del backend es realmente lng, y lng del backend es realmente lat
        const realLat = lng; // La latitud real está en el campo lng
        const realLng = lat; // La longitud real está en el campo lat

        if (realLat && realLng) {
            const url = `http://maps.apple.com/?daddr=${realLat},${realLng}&dirflg=d`;
            Linking.openURL(url);
        } else {
            Alert.alert('Error', 'No se encontraron coordenadas válidas para este pedido');
        }
        closeNavigationModal();
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
                                        <FontAwesome name="list-alt" style={[style.editarModalInfoIcon, style.editarModalInfoIconGreen]} />
                                        <Text style={style.editarModalInfoText}>
                                            <Text style={style.editarModalInfoTextBold}>Forma: </Text>{forma}
                                        </Text>
                                    </View>

                                    <View style={style.editarModalInfoRow}>
                                        <FontAwesome name="cubes" style={[style.editarModalInfoIcon, style.editarModalInfoIconPurple]} />
                                        <Text style={style.editarModalInfoText}>
                                            <Text style={style.editarModalInfoTextBold}>
                                                {forma == "cantidad" ? "Cantidad: " : forma == "monto" ? "Monto: " : "Valor: "}
                                            </Text>
                                            {forma == "cantidad" ? cantidadKl : forma == "monto" ? cantidadPrecio : "N/A"}
                                        </Text>
                                    </View>

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

                                        {/* Botón de navegación */}
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
                                    {flexDirection: 'row', gap: 10 , borderColor: getEstadoColor(estado || "activo") }
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
                                    {estado!="noentregado"&&(<Text style={style.editarModalEntregadoSubtitle}>
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
                                {estado!="noentregado"&&(
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

                <CerrarPedidoModal
                    visible={modalCerrarPedido}
                    pedidoId={pedidoData.id}
                    onClose={onCloseCerrarPedido}
                    entregado={pedidoData.entregado}
                    imagenCerrar={pedidoData.imagenCerrar}
                    kilos={pedidoData.kilos}
                    factura={pedidoData.factura}
                    valor_total={pedidoData.valor_total}
                    remision={undefined}
                    forma_pago={pedidoData.forma_pago}
                    valor_unitario={valorUnitario}
                    onCerrarPedido={onCerrarPedido}
                    onGuardarNovedad={onGuardarNovedad}
                />

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
                                        Lat: {pedidoData.coordenadas.lng}, Lng: {pedidoData.coordenadas.lat}
                                        <Text style={style.navModalCoordNote}>
                                            {'\n'}(coordenadas corregidas)
                                        </Text>
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
            </View>
        </Modal>
    );
};

export default EditarPedidoModal;
