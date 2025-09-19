import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated, Image, Dimensions, Linking, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import moment from 'moment';
import { style } from './style';
import { formatCurrency } from '../../utils/number';
import { EstadoPedido, AccesoUsuario, SelectedPedidoData } from './types';
import CambiarEstadoModal from './CambiarEstadoModal';
import VehiculosModal from './VehiculosModal';
import FechaEntregaModal from './FechaEntregaModal';

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
    // Props para CambiarEstadoModal
    modalPerfiles: boolean;
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
    modalPerfiles,
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
    onSaveFecha
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
        if (lat && lng) {
            const url = `waze://?ll=${lat},${lng}&navigate=yes`;
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    // Si Waze no está instalado, abrir en el navegador
                    Linking.openURL(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`);
                }
            });
        }
        closeNavigationModal();
    };

    const openInGoogleMaps = () => {
        const { lat, lng } = pedidoData.coordenadas || {};
        if (lat && lng) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            Linking.openURL(url);
        }
        closeNavigationModal();
    };

    const openInAppleMaps = () => {
        const { lat, lng } = pedidoData.coordenadas || {};
        if (lat && lng) {
            const url = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
            Linking.openURL(url);
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
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}>
                <Animated.View style={{
                    backgroundColor: '#ffffff', // Color de fondo más específico
                    borderRadius: 16,
                    width: '100%',
                    maxHeight: '90%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    elevation: 10,
                    transform: [{ scale: modalMainScale }],
                    opacity: modalMainOpacity,
                }}>
                    <ScrollView>
                        {/* Header mejorado del modal */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e9ecef',
                            backgroundColor: '#f8f9fa',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: '#333',
                                    marginBottom: 4,
                                }}>
                                    {razon_social}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesome name="hashtag" style={{ fontSize: 12, color: '#007bff', marginRight: 4 }} />
                                    <Text style={{ fontSize: 14, color: '#6c757d' }}>
                                        Pedido #{id}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                                activeOpacity={0.7}
                            >
                                <FontAwesome name="times" style={{ fontSize: 18, color: '#666' }} />
                            </TouchableOpacity>
                        </View>

                        {/* Información del pedido organizada */}
                        <View style={{ padding: 20 }}>
                            {/* Información básica */}
                            <View style={{
                                backgroundColor: '#f8f9fa',
                                padding: 15,
                                borderRadius: 8,
                                marginBottom: 15,
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 10,
                                }}>
                                    Información del Cliente
                                </Text>

                                <View style={{ gap: 8 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome name="id-card" style={{ fontSize: 14, color: '#007bff', marginRight: 8, width: 20 }} />
                                        <Text style={{ fontSize: 14, color: '#333' }}>
                                            <Text style={{ fontWeight: '600' }}>Cédula/NIT: </Text>{cedula}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome name="list-alt" style={{ fontSize: 14, color: '#28a745', marginRight: 8, width: 20 }} />
                                        <Text style={{ fontSize: 14, color: '#333' }}>
                                            <Text style={{ fontWeight: '600' }}>Forma: </Text>{forma}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome name="cubes" style={{ fontSize: 14, color: '#6f42c1', marginRight: 8, width: 20 }} />
                                        <Text style={{ fontSize: 14, color: '#333' }}>
                                            <Text style={{ fontWeight: '600' }}>
                                                {forma == "cantidad" ? "Cantidad: " : forma == "monto" ? "Monto: " : "Valor: "}
                                            </Text>
                                            {forma == "cantidad" ? cantidadKl : forma == "monto" ? cantidadPrecio : "N/A"}
                                        </Text>
                                    </View>

                                    {fechaEntrega && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesome name="calendar" style={{ fontSize: 14, color: '#dc3545', marginRight: 8, width: 20 }} />
                                            <Text style={{ fontSize: 14, color: '#333' }}>
                                                <Text style={{ fontWeight: '600' }}>Fecha entrega: </Text>
                                                {moment(fechaEntrega).format('YYYY-MM-DD')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Información adicional */}
                            {(creado || usuarioCrea || capacidad || observacion || observacion_pedido) && (
                                <View style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: 15,
                                    borderRadius: 8,
                                    marginBottom: 15,
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: 10,
                                    }}>
                                        Detalles Adicionales
                                    </Text>

                                    <View style={{ gap: 6 }}>
                                        {creado && (
                                            <Text style={{ fontSize: 13, color: '#666' }}>
                                                <FontAwesome name="clock-o" style={{ fontSize: 12, marginRight: 6 }} />
                                                <Text style={{ fontWeight: '600' }}>Creado: </Text>
                                                {moment(creado).format("YYYY-MM-DD")}
                                            </Text>
                                        )}
                                        {usuarioCrea && (
                                            <Text style={{ fontSize: 13, color: '#666' }}>
                                                <FontAwesome name="user" style={{ fontSize: 12, marginRight: 6 }} />
                                                <Text style={{ fontWeight: '600' }}>Por: </Text>
                                                {usuarioCrea}
                                            </Text>
                                        )}
                                        {capacidad && (
                                            <Text style={{ fontSize: 13, color: '#666' }}>
                                                <FontAwesome name="database" style={{ fontSize: 12, marginRight: 6 }} />
                                                <Text style={{ fontWeight: '600' }}>Almacenamiento: </Text>
                                                {capacidad} galones
                                            </Text>
                                        )}

                                        {/* Botón de navegación */}
                                        {pedidoData.coordenadas && (
                                            <TouchableOpacity
                                                onPress={openNavigationModal}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#007bff',
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 8,
                                                    borderRadius: 6,
                                                    marginTop: 8,
                                                    alignSelf: 'flex-start'
                                                }}
                                            >
                                                <FontAwesome name="map-marker" style={{ fontSize: 12, color: '#fff', marginRight: 6 }} />
                                                <Text style={{ fontSize: 13, color: '#fff', fontWeight: '600' }}>
                                                    Navegar al punto
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {observacion && (
                                            <Text style={{ fontSize: 13, color: '#666' }}>
                                                <FontAwesome name="comment" style={{ fontSize: 12, marginRight: 6 }} />
                                                <Text style={{ fontWeight: '600' }}>Obs. punto: </Text>
                                                {observacion}
                                            </Text>
                                        )}
                                        {observacion_pedido && (
                                            <Text style={{ fontSize: 13, color: '#666' }}>
                                                <FontAwesome name="sticky-note" style={{ fontSize: 12, marginRight: 6 }} />
                                                <Text style={{ fontWeight: '600' }}>Obs. pedido: </Text>
                                                {observacion_pedido}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* CAMBIAR ESTADO - Mejorado con modal secundario */}
                        {(acceso == "admin" || acceso == "solucion" || acceso == "comercial" || acceso == "despacho") && !modalPerfiles && (
                            <View style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 12,
                                padding: 20,
                                marginTop: 20,
                                borderLeftWidth: 4,
                                borderLeftColor: '#007bff',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: '#333',
                                    marginBottom: 16,
                                    textAlign: 'center'
                                }}>
                                    Gestión de Estado
                                </Text>

                                {/* Estado actual */}
                                <View style={{
                                    backgroundColor: 'white',
                                    padding: 15,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                    borderWidth: 1,
                                    borderColor: getEstadoColor(estado || "activo"),
                                }}>
                                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Estado actual:</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome
                                            name={estado === "activo" ? "check-circle" : estado === "innactivo" ? "times-circle" : "pause-circle"}
                                            style={{
                                                fontSize: 16,
                                                color: getEstadoColor(estado || "activo"),
                                                marginRight: 8
                                            }}
                                        />
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                            {estado === "activo" ? "Activo" : estado === "innactivo" ? "Inactivo" : estado === "espera" ? "En Espera" : estado}
                                        </Text>
                                    </View>
                                </View>

                                {/* Botón para cambiar estado */}
                                {entregado == true && estado == "activo" ? (
                                    <View style={{
                                        backgroundColor: '#e9ecef',
                                        padding: 15,
                                        borderRadius: 8,
                                        alignItems: 'center'
                                    }}>
                                        <FontAwesome name="lock" style={{ fontSize: 20, color: '#6c757d', marginBottom: 8 }} />
                                        <Text style={{ color: '#6c757d', textAlign: 'center' }}>
                                            El pedido está entregado y no se puede modificar
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#007bff',
                                            paddingVertical: 12,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}
                                        onPress={onChangeState}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesome name="edit" style={{ fontSize: 14, color: 'white', marginRight: 6 }} />
                                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                            Cambiar Estado
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Renderizar CambiarEstadoModal cuando modalPerfiles es true */}
                        {(acceso == "admin" || acceso == "solucion" || acceso == "comercial" || acceso == "despacho") && modalPerfiles && (
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
                        {
                            (acceso == "admin" || acceso == "despacho") && estadoEntrega == "asignado"
                                ? <View style={style.contenedorEspera}>
                                    <View style={style.separador}></View>
                                    <Text style={[style.tituloModal, { marginBottom: 15, fontSize: 18, fontWeight: '600' }]}>Asignación de Vehículo</Text>

                                    {/* Información del vehículo asignado */}
                                    {placaPedido ? (
                                        <View style={{
                                            backgroundColor: '#e8f5e8',
                                            padding: 12,
                                            borderRadius: 8,
                                            marginBottom: 15,
                                            borderLeftWidth: 4,
                                            borderLeftColor: getEstadoColor("activo")
                                        }}>
                                            <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Vehículo asignado:</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesome name="truck" style={{ fontSize: 16, color: getEstadoColor("activo"), marginRight: 8 }} />
                                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                                    {placaPedido} - {conductorPedido}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{
                                            backgroundColor: '#fff3cd',
                                            padding: 12,
                                            borderRadius: 8,
                                            marginBottom: 15,
                                            borderLeftWidth: 4,
                                            borderLeftColor: getEstadoColor("espera")
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesome name="exclamation-triangle" style={{ fontSize: 16, color: '#856404', marginRight: 8 }} />
                                                <Text style={{ fontSize: 14, color: '#856404' }}>
                                                    Sin vehículo asignado
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Botón para asignar vehículo */}
                                    {
                                        entregado == true && estado == "activo"
                                            ? null
                                            : <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#28a745',
                                                    paddingVertical: 15,
                                                    paddingHorizontal: 20,
                                                    borderRadius: 8,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 4,
                                                    elevation: 3,
                                                }}
                                                onPress={onAssignVehicle}
                                                activeOpacity={0.8}
                                            >
                                                <FontAwesome name="truck" style={{ fontSize: 16, color: 'white', marginRight: 10 }} />
                                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                                    {placaPedido ? 'Cambiar Vehículo' : 'Asignar Vehículo'}
                                                </Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                : null
                        }

                        {/* Botón de cancelar pedido solo para clientes - Mejorado */}
                        {acceso === "cliente" && estado && estado !== "innactivo" && !entregado && (
                            <View style={style.contenedorEspera}>
                                <View style={style.separador}></View>
                                <Text style={[style.tituloModal, { marginBottom: 15, fontSize: 18, fontWeight: '600' }]}>Opciones del Cliente</Text>

                                {/* Advertencia antes del botón */}
                                <View style={{
                                    backgroundColor: '#f8d7da',
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 15,
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#dc3545'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome name="exclamation-triangle" style={{ fontSize: 16, color: '#721c24', marginRight: 8 }} />
                                        <Text style={{ fontSize: 14, color: '#721c24', flex: 1 }}>
                                            Al cancelar el pedido, no podrá revertir esta acción
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#dc3545',
                                        paddingVertical: 15,
                                        paddingHorizontal: 20,
                                        borderRadius: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                    onPress={onCancelOrder}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome name="times-circle" style={{ fontSize: 16, color: 'white', marginRight: 10 }} />
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                        Cancelar Pedido
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Mostrar información del pedido entregado/cerrado - DISEÑO MEJORADO */}
                        {entregado && (
                            <View style={{ marginBottom: 20 }}>
                                {/* Header con icono de éxito */}
                                <View style={{
                                    alignItems: 'center',
                                    marginBottom: 24,
                                    paddingVertical: 20,
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 16,
                                    marginHorizontal: 20
                                }}>
                                    <View style={{
                                        backgroundColor: '#d4edda',
                                        borderRadius: 40,
                                        width: 60,
                                        height: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                        shadowColor: '#28a745',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 6,
                                        elevation: 4
                                    }}>
                                        <FontAwesome name="check-circle" style={{ fontSize: 28, color: '#28a745' }} />
                                    </View>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#28a745',
                                        marginBottom: 6
                                    }}>
                                        🎉 Pedido Finalizado
                                    </Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: '#666',
                                        textAlign: 'center'
                                    }}>
                                        Completado y entregado exitosamente
                                    </Text>
                                </View>

                                {/* Imagen de la factura si existe */}
                                {pedidoData.imagenCerrar && (
                                    <View style={{
                                        marginBottom: 20,
                                        marginHorizontal: 20,
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: 12,
                                            textAlign: 'center'
                                        }}>
                                            📷 Imagen de la Factura
                                        </Text>
                                        <View style={{
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 8,
                                            elevation: 5,
                                            backgroundColor: '#fff'
                                        }}>
                                            <Image
                                                source={{ uri: pedidoData.imagenCerrar }}
                                                style={{
                                                    width: 280,
                                                    height: 200,
                                                    borderRadius: 12
                                                }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View style={{
                                            backgroundColor: '#e8f5e8',
                                            borderRadius: 8,
                                            padding: 8,
                                            marginTop: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <FontAwesome name="camera" style={{ fontSize: 12, color: '#28a745', marginRight: 6 }} />
                                            <Text style={{ color: '#28a745', fontSize: 12, fontWeight: '500' }}>
                                                Imagen registrada exitosamente
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Cards de información mejoradas */}
                                <View style={{ marginHorizontal: 20, gap: 12 }}>
                                    {/* Card principal con total */}
                                    <View style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 12,
                                        padding: 16,
                                        borderLeftWidth: 4,
                                        borderLeftColor: '#28a745',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 12
                                        }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                                                💰 Total Facturado
                                            </Text>
                                            <Text style={{ fontSize: 20, color: '#28a745', fontWeight: 'bold' }}>
                                                {valor_total ? formatCurrency(valor_total) : 'N/A'}
                                            </Text>
                                        </View>
                                        {forma_pago && (
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingTop: 12,
                                                borderTopWidth: 1,
                                                borderTopColor: '#e9ecef'
                                            }}>
                                                <Text style={{ fontSize: 14, color: '#666' }}>Forma de pago:</Text>
                                                <View style={{
                                                    backgroundColor: forma_pago === 'Contado' ? '#e3f2fd' : '#e8f5e8',
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 4,
                                                    borderRadius: 16
                                                }}>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: forma_pago === 'Contado' ? '#2196f3' : '#4caf50',
                                                        fontWeight: '600'
                                                    }}>
                                                        {forma_pago === 'Contado' ? '💵 Contado' : '💳 Crédito'}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Card de detalles */}
                                    <View style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 12,
                                        padding: 16,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: 12,
                                            textAlign: 'center'
                                        }}>
                                            📋 Información del Pedido
                                        </Text>

                                        <View style={{ gap: 8 }}>
                                            {kilos && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingVertical: 6
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name="balance-scale" style={{ fontSize: 14, color: '#666', marginRight: 8 }} />
                                                        <Text style={{ fontSize: 13, color: '#666' }}>Kilos:</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 13, color: '#333', fontWeight: '600' }}>{kilos}</Text>
                                                </View>
                                            )}

                                            {factura && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingVertical: 6
                                                }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <FontAwesome name="file-text" style={{ fontSize: 14, color: '#666', marginRight: 8 }} />
                                                        <Text style={{ fontSize: 13, color: '#666' }}>Factura:</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 13, color: '#333', fontWeight: '600' }}>{factura}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {/* Card de información adicional si existen otros campos */}
                                    {(motivo_no_cierre || perfil_novedad) && (
                                        <View style={{
                                            backgroundColor: '#fff3cd',
                                            borderRadius: 12,
                                            padding: 16,
                                            borderLeftWidth: 4,
                                            borderLeftColor: '#ffc107'
                                        }}>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#856404',
                                                marginBottom: 8,
                                                textAlign: 'center'
                                            }}>
                                                ℹ️ Información Adicional
                                            </Text>
                                            {motivo_no_cierre && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 6
                                                }}>
                                                    <Text style={{ fontSize: 12, color: '#856404', flex: 1 }}>Motivo no cierre:</Text>
                                                    <Text style={{ fontSize: 12, color: '#856404', fontWeight: '600', flex: 2, textAlign: 'right' }}>
                                                        {motivo_no_cierre}
                                                    </Text>
                                                </View>
                                            )}
                                            {perfil_novedad && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Text style={{ fontSize: 12, color: '#856404', flex: 1 }}>Perfil novedad:</Text>
                                                    <Text style={{ fontSize: 12, color: '#856404', fontWeight: '600', flex: 2, textAlign: 'right' }}>
                                                        {perfil_novedad}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Sección de cerrar pedido */}
                        {(acceso === "admin" || acceso === "conductor" || acceso === "despacho") && fechaEntrega && !entregado && (
                            <View style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 10,
                                padding: 16,
                                marginTop: 20,
                                borderLeftWidth: 4,
                                borderLeftColor: '#28a745'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <FontAwesome name="check-circle" style={{ fontSize: 18, color: '#28a745', marginRight: 10 }} />
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                        Finalización del Pedido
                                    </Text>
                                </View>

                                <Text style={{ fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 }}>
                                    Complete la información de entrega para finalizar este pedido.
                                </Text>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#28a745',
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        borderRadius: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                    onPress={onClosePedido}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome name="edit" style={{ fontSize: 16, color: 'white', marginRight: 10 }} />
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                        Cerrar Pedido
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Botón cancelar pedido para clientes */}
                        {acceso === "cliente" && (
                            <View style={{
                                backgroundColor: '#fff3cd',
                                borderRadius: 10,
                                padding: 16,
                                marginTop: 20,
                                borderLeftWidth: 4,
                                borderLeftColor: '#dc3545'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <FontAwesome name="exclamation-triangle" style={{ fontSize: 18, color: '#dc3545', marginRight: 10 }} />
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                                        Cancelación de Pedido
                                    </Text>
                                </View>

                                <Text style={{ fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 }}>
                                    ¿Necesita cancelar este pedido? Esta acción no se puede deshacer.
                                </Text>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#dc3545',
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        borderRadius: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                    onPress={onCancelOrder}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome name="times-circle" style={{ fontSize: 16, color: 'white', marginRight: 10 }} />
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                        Cancelar Pedido
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
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

                {/* Modal de Navegación */}
                <Modal
                    transparent={true}
                    visible={showNavigationModal}
                    animationType="fade"
                    onRequestClose={closeNavigationModal}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 15,
                            padding: 20,
                            width: '90%',
                            maxWidth: 350,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8
                        }}>
                            {/* Header */}
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: '#333'
                                }}>
                                    Navegar al punto
                                </Text>
                                <TouchableOpacity
                                    onPress={closeNavigationModal}
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 15,
                                        width: 30,
                                        height: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome name="times" size={14} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Coordenadas */}
                            {pedidoData.coordenadas && (
                                <View style={{
                                    backgroundColor: '#f8f9fa',
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 20
                                }}>
                                    <Text style={{ fontSize: 13, color: '#666', textAlign: 'center' }}>
                                        <FontAwesome name="map-pin" style={{ marginRight: 6 }} />
                                        Lat: {pedidoData.coordenadas.lat}, Lng: {pedidoData.coordenadas.lng}
                                    </Text>
                                </View>
                            )}

                            {/* Opciones de navegación */}
                            <View style={{ gap: 12 }}>
                                {/* Waze */}
                                <TouchableOpacity
                                    onPress={openInWaze}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#00d4ff',
                                        padding: 15,
                                        borderRadius: 12,
                                        shadowColor: '#00d4ff',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: 8,
                                        padding: 8,
                                        marginRight: 12
                                    }}>
                                        <FontAwesome name="road" size={20} color="#fff" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                                            Waze
                                        </Text>
                                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                                            Navegación en tiempo real
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>

                                {/* Google Maps */}
                                <TouchableOpacity
                                    onPress={openInGoogleMaps}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#4285f4',
                                        padding: 15,
                                        borderRadius: 12,
                                        shadowColor: '#4285f4',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: 8,
                                        padding: 8,
                                        marginRight: 12
                                    }}>
                                        <FontAwesome name="globe" size={20} color="#fff" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                                            Google Maps
                                        </Text>
                                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                                            Mapas de Google
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>

                                {/* Apple Maps */}
                                <TouchableOpacity
                                    onPress={openInAppleMaps}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#007aff',
                                        padding: 15,
                                        borderRadius: 12,
                                        shadowColor: '#007aff',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: 8,
                                        padding: 8,
                                        marginRight: 12
                                    }}>
                                        <FontAwesome name="apple" size={20} color="#fff" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                                            Apple Maps
                                        </Text>
                                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                                            Mapas de Apple
                                        </Text>
                                    </View>
                                    <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>
                            </View>

                            {/* Botón cancelar */}
                            <TouchableOpacity
                                onPress={closeNavigationModal}
                                style={{
                                    backgroundColor: '#6c757d',
                                    padding: 15,
                                    borderRadius: 12,
                                    marginTop: 15,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
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
