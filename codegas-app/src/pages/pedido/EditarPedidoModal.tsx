import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
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
                    backgroundColor: 'white',
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

                        {/* Mostrar información del pedido entregado/cerrado */}
                        {entregado && (
                            <View>
                                <View style={style.separador}></View>
                                <Text style={style.tituloModal}>Pedido Finalizado</Text>
                                {kilos && (
                                    <View style={style.pedido}>
                                        <Text style={style.txtPedidoFinalizado}>Kilos: </Text>
                                        <Text style={style.txtPedidoFinalizado}>{kilos}</Text>
                                    </View>
                                )}
                                {factura && (
                                    <View style={style.pedido}>
                                        <Text style={style.txtPedidoFinalizado}>Factura: </Text>
                                        <Text style={style.txtPedidoFinalizado}>{factura}</Text>
                                    </View>
                                )}
                                {valor_total && (
                                    <View style={style.pedido}>
                                        <Text style={style.txtPedidoFinalizado}>Total: </Text>
                                        <Text style={style.txtPedidoFinalizado}>
                                            {formatCurrency(valor_total)}
                                        </Text>
                                    </View>
                                )}
                                {forma_pago && (
                                    <View style={style.pedido}>
                                        <Text style={style.txtPedidoFinalizado}>Forma de pago: </Text>
                                        <Text style={style.txtPedidoFinalizado}>{forma_pago}</Text>
                                    </View>
                                )}
                                {motivo_no_cierre && (
                                    <View style={style.pedido}>
                                        <Text style={style.txtPedidoFinalizado}>Motivo no cierre: </Text>
                                        <Text style={style.txtPedidoFinalizado}>{motivo_no_cierre}</Text>
                                    </View>
                                )}
                                {perfil_novedad && (
                                    <View style={style.pedido}>
                                        <Text style={style.txtPedidoFinalizado}>Perfil novedad: </Text>
                                        <Text style={style.txtPedidoFinalizado}>{perfil_novedad}</Text>
                                    </View>
                                )}
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
            </View>
        </Modal>
    );
};

export default EditarPedidoModal;
