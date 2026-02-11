import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { style } from './style';
import { GrupoFrecuencia } from './types';
import { PedidoFrecuencia } from './EditarFrecuenciaModal.types';

interface VerPedidosGrupoModalProps {
    visible: boolean;
    onClose: () => void;
    grupo: GrupoFrecuencia | null;
    pedidos: PedidoFrecuencia[];
    onPedidoRemoved?: () => void; // Callback para notificar cuando se remueve un pedido
}

const VerPedidosGrupoModal: React.FC<VerPedidosGrupoModalProps> = ({
    visible,
    onClose,
    grupo,
    pedidos,
    onPedidoRemoved
}) => {
    const [pedidosDelGrupo, setPedidosDelGrupo] = useState<PedidoFrecuencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [removingPedidoId, setRemovingPedidoId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pedidoToRemove, setPedidoToRemove] = useState<PedidoFrecuencia | null>(null);

    // Cargar pedidos del grupo cuando se abre el modal
    useEffect(() => {
        if (visible && grupo?._id) {
            loadPedidosGrupo();
        } else {
            setPedidosDelGrupo([]);
        }
    }, [visible, grupo?._id]);

    const loadPedidosGrupo = async () => {
        if (!grupo?._id) return;

        try {
            setLoading(true);
            console.log('🔍 Cargando pedidos del grupo:', grupo._id);
            const response = await axios.get(`fre/grupos/${grupo._id}/pedidos`);
            
            console.log('📦 Respuesta del API:', response.data);
            
            // Verificar diferentes formatos de respuesta
            const pedidosData = response.data?.pedidos || response.data?.data?.pedidos || response.data;
            
            if (response.data?.status && pedidosData && Array.isArray(pedidosData)) {
                console.log('✅ Pedidos recibidos:', pedidosData.length);
                console.log('📋 Primer pedido:', pedidosData[0]);
                setPedidosDelGrupo(pedidosData);
            } else if (response.data?.status && Array.isArray(response.data)) {
                // Si la respuesta es directamente un array
                console.log('✅ Pedidos recibidos (array directo):', response.data.length);
                setPedidosDelGrupo(response.data);
            } else {
                console.warn('⚠️ No se recibieron pedidos o formato incorrecto');
                console.log('Response completa:', response);
                console.log('Response data:', response.data);
                setPedidosDelGrupo([]);
            }
        } catch (error: any) {
            console.error('❌ Error cargando pedidos del grupo:', error);
            console.error('Error response:', error.response?.data);
            Toast.show({
                type: 'error',
                text1: 'Error al cargar pedidos',
                text2: error.response?.data?.message || 'No se pudieron cargar los pedidos del grupo'
            });
            setPedidosDelGrupo([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePedido = (pedido: PedidoFrecuencia) => {
        setPedidoToRemove(pedido);
        setShowConfirmModal(true);
    };

    const confirmRemovePedido = async () => {
        if (!pedidoToRemove) return;

        try {
            setRemovingPedidoId(pedidoToRemove.pedido_id);
            const response = await axios.delete(`fre/grupos/pedidos/${pedidoToRemove.pedido_id}`);

            if (response.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Pedido removido',
                    text2: 'El pedido ha sido removido del grupo correctamente'
                });
                
                // Remover el pedido de la lista local
                setPedidosDelGrupo(prev => 
                    prev.filter(p => p.pedido_id !== pedidoToRemove.pedido_id)
                );

                // Notificar al componente padre para que actualice los grupos
                if (onPedidoRemoved) {
                    onPedidoRemoved();
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.data.message || 'No se pudo remover el pedido del grupo'
                });
            }
        } catch (error: any) {
            console.error('Error removiendo pedido del grupo:', error);
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: error.response?.data?.message || 'Verifica tu conexión a internet'
            });
        } finally {
            setRemovingPedidoId(null);
            setShowConfirmModal(false);
            setPedidoToRemove(null);
        }
    };

    const cancelRemovePedido = () => {
        setShowConfirmModal(false);
        setPedidoToRemove(null);
    };

    // Función para formatear el día
    const formatDay = (dayValue: string | number, frecuencia: string = 'semanal'): string => {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        if (frecuencia === 'mensual') {
            return String(dayValue);
        }

        if (typeof dayValue === 'number') {
            return `${dayValue} ${dayNames[dayValue - 1] || ''}`;
        } else if (typeof dayValue === 'string' && !isNaN(Number(dayValue))) {
            const num = Number(dayValue);
            return `${num} ${dayNames[num - 1] || ''}`;
        } else if (typeof dayValue === 'string') {
            const index = dayNames.indexOf(dayValue);
            if (index !== -1) {
                return `${index + 1} ${dayValue}`;
            }
            return dayValue;
        }
        return String(dayValue);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'flex-end'
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    maxHeight: '90%',
                    paddingBottom: 20,
                    flex: 1
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0'
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: '#002587',
                                marginBottom: 4
                            }}>
                                {grupo?.nombre || 'Pedidos del Grupo'}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                marginTop: 4
                            }}>
                                {loading ? 'Cargando...' : `${pedidosDelGrupo.length} ${pedidosDelGrupo.length === 1 ? 'pedido asignado' : 'pedidos asignados'}`}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                padding: 8,
                                borderRadius: 20,
                                backgroundColor: '#f0f0f0'
                            }}
                        >
                            <FontAwesome name="times" style={{ fontSize: 20, color: '#666' }} />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de pedidos */}
                    <ScrollView 
                        style={{ flex: 1 }} 
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={true}
                    >
                        {loading ? (
                            <View style={{
                                padding: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ActivityIndicator size="large" color="#002587" />
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    marginTop: 16
                                }}>
                                    Cargando pedidos...
                                </Text>
                            </View>
                        ) : pedidosDelGrupo.length > 0 ? (
                            <View style={{ padding: 20 }}>
                                {pedidosDelGrupo.map((pedido: any, index: number) => {
                                    console.log('📝 Renderizando pedido:', index, pedido);
                                    return (
                                    <View
                                        key={pedido.pedido_id || index}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 12,
                                            borderLeftWidth: 4,
                                            borderLeftColor: '#002587'
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: 8
                                        }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    fontWeight: '700',
                                                    color: '#002587',
                                                    marginBottom: 4
                                                }}>
                                                    {pedido.razon_social || pedido.nombre}
                                                </Text>
                                                {pedido.nombre && pedido.razon_social && (
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#666',
                                                        marginBottom: 4
                                                    }}>
                                                        {pedido.nombre}
                                                    </Text>
                                                )}
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: '#999',
                                                    marginTop: 2
                                                }}>
                                                    Código: {pedido.codt}
                                                </Text>
                                            </View>
                                            <View style={{
                                                backgroundColor: '#002587',
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 6
                                            }}>
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: '600'
                                                }}>
                                                    #{pedido.pedido_id}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{
                                            borderTopWidth: 1,
                                            borderTopColor: '#e0e0e0',
                                            paddingTop: 12,
                                            marginTop: 8
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 6
                                            }}>
                                                <FontAwesome name="shopping-cart" style={{
                                                    fontSize: 14,
                                                    color: '#666',
                                                    marginRight: 8,
                                                    width: 20
                                                }} />
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: '#333'
                                                }}>
                                                    {pedido.forma === "cantidad"
                                                        ? `${pedido.cantidadKl} KL`
                                                        : pedido.forma === "monto"
                                                            ? `$${pedido.cantidadPrecio}`
                                                            : pedido.forma}
                                                </Text>
                                            </View>

                                            {pedido.frecuencia && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <FontAwesome name="repeat" style={{
                                                        fontSize: 14,
                                                        color: '#666',
                                                        marginRight: 8,
                                                        width: 20
                                                    }} />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#333',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {pedido.frecuencia}
                                                    </Text>
                                                </View>
                                            )}

                                            {pedido.frecuencia === "semanal" && pedido.dia1 && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <FontAwesome name="calendar" style={{
                                                        fontSize: 14,
                                                        color: '#666',
                                                        marginRight: 8,
                                                        width: 20
                                                    }} />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#333'
                                                    }}>
                                                        Día: {formatDay(pedido.dia1, 'semanal')}
                                                    </Text>
                                                </View>
                                            )}

                                            {pedido.frecuencia === "quincenal" && pedido.dia1 && pedido.dia2 && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <FontAwesome name="calendar" style={{
                                                        fontSize: 14,
                                                        color: '#666',
                                                        marginRight: 8,
                                                        width: 20
                                                    }} />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#333'
                                                    }}>
                                                        Días: {formatDay(pedido.dia1, 'quincenal')} - {formatDay(pedido.dia2, 'quincenal')}
                                                    </Text>
                                                </View>
                                            )}

                                            {pedido.frecuencia === "mensual" && pedido.dia1 && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <FontAwesome name="calendar" style={{
                                                        fontSize: 14,
                                                        color: '#666',
                                                        marginRight: 8,
                                                        width: 20
                                                    }} />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#333'
                                                    }}>
                                                        Día del mes: {formatDay(pedido.dia1, 'mensual')}
                                                    </Text>
                                                </View>
                                            )}

                                            {pedido.punto_direccion && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'flex-start',
                                                    marginTop: 6
                                                }}>
                                                    <FontAwesome name="map-marker" style={{
                                                        fontSize: 14,
                                                        color: '#666',
                                                        marginRight: 8,
                                                        width: 20,
                                                        marginTop: 2
                                                    }} />
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#333',
                                                        flex: 1
                                                    }}>
                                                        {pedido.punto_direccion}
                                                        {pedido.punto_capacidad && ` (${pedido.punto_capacidad} kg)`}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Botón para remover del grupo */}
                                        <View style={{
                                            marginTop: 12,
                                            paddingTop: 12,
                                            borderTopWidth: 1,
                                            borderTopColor: '#e0e0e0',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => handleRemovePedido(pedido)}
                                                disabled={removingPedidoId === pedido.pedido_id}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#dc3545',
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 8,
                                                    borderRadius: 8,
                                                    opacity: removingPedidoId === pedido.pedido_id ? 0.6 : 1
                                                }}
                                            >
                                                {removingPedidoId === pedido.pedido_id ? (
                                                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                                                ) : (
                                                    <FontAwesome name="times-circle" style={{
                                                        fontSize: 14,
                                                        color: '#fff',
                                                        marginRight: 8
                                                    }} />
                                                )}
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 14,
                                                    fontWeight: '600'
                                                }}>
                                                    Remover del grupo
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={{
                                padding: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FontAwesome name="inbox" style={{
                                    fontSize: 48,
                                    color: '#ccc',
                                    marginBottom: 16
                                }} />
                                <Text style={{
                                    fontSize: 16,
                                    color: '#666',
                                    fontWeight: '600',
                                    marginBottom: 8
                                }}>
                                    No hay pedidos asignados
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#999',
                                    textAlign: 'center'
                                }}>
                                    Este grupo aún no tiene pedidos asignados
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>

            {/* Modal de confirmación para remover pedido */}
            <Modal
                visible={showConfirmModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelRemovePedido}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 24,
                        width: '100%',
                        maxWidth: 400
                    }}>
                        <View style={{
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
                            <View style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: '#fee',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <FontAwesome name="exclamation-triangle" style={{
                                    fontSize: 32,
                                    color: '#dc3545'
                                }} />
                            </View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: 8,
                                textAlign: 'center'
                            }}>
                                Remover pedido del grupo
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                textAlign: 'center',
                                lineHeight: 20
                            }}>
                                ¿Estás seguro de que deseas remover este pedido del grupo "{grupo?.nombre}"?
                            </Text>
                            {pedidoToRemove && (
                                <View style={{
                                    marginTop: 16,
                                    padding: 12,
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 8,
                                    width: '100%'
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#002587',
                                        marginBottom: 4
                                    }}>
                                        {pedidoToRemove.razon_social || pedidoToRemove.nombre}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#666'
                                    }}>
                                        Pedido #{pedidoToRemove.pedido_id} • {pedidoToRemove.codt}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 12
                        }}>
                            <TouchableOpacity
                                onPress={cancelRemovePedido}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 8,
                                    backgroundColor: '#f0f0f0',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#666'
                                }}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmRemovePedido}
                                disabled={removingPedidoId !== null}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 8,
                                    backgroundColor: '#dc3545',
                                    alignItems: 'center',
                                    opacity: removingPedidoId !== null ? 0.6 : 1
                                }}
                            >
                                {removingPedidoId !== null ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: '#fff'
                                    }}>
                                        Remover
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
};

export default VerPedidosGrupoModal;

