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

    // Función para calcular las fechas de ejecución del pedido
    const calcularFechasEjecucion = (pedido: any): string[] => {
        if (!grupo || !pedido) return [];

        const fechas: string[] = [];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Fecha límite: 3 meses desde hoy
        const fechaLimite = new Date(hoy);
        fechaLimite.setMonth(fechaLimite.getMonth() + 3);

        // Obtener fecha de creación del pedido
        let fechaCreacionPedido: Date;
        if (pedido.fecha_creacion || pedido.fechaCreacionOriginal || pedido.creado) {
            const fechaStr = pedido.fecha_creacion || pedido.fechaCreacionOriginal || pedido.creado;
            fechaCreacionPedido = new Date(fechaStr);
        } else {
            // Si no hay fecha de creación, usar la fecha actual como referencia
            fechaCreacionPedido = new Date(hoy);
        }
        fechaCreacionPedido.setHours(0, 0, 0, 0);

        if (grupo.tipo_frecuencia === 'semanal' && grupo.dia_semana) {
            const diaSemanaGrupo = grupo.dia_semana; // 1=Lunes, 7=Domingo
            const intervaloSemanas = grupo.intervalo_semanas || 1;

            // Convertir día de la semana: 1=Lunes -> 1, 7=Domingo -> 0
            const diaObjetivoJS = diaSemanaGrupo === 7 ? 0 : diaSemanaGrupo;

            // Encontrar la primera fecha desde la creación del pedido que coincida con el día
            let primeraFecha = new Date(fechaCreacionPedido);
            while (primeraFecha.getDay() !== diaObjetivoJS) {
                primeraFecha.setDate(primeraFecha.getDate() + 1);
            }

            // Calcular todas las fechas desde la primera hasta 3 meses adelante
            let fechaActual = new Date(primeraFecha);

            while (fechaActual <= fechaLimite) {
                // Solo incluir fechas que sean múltiplos del intervalo desde la primera fecha
                const semanasDesdePrimera = Math.floor((fechaActual.getTime() - primeraFecha.getTime()) / (1000 * 60 * 60 * 24 * 7));

                if (semanasDesdePrimera % intervaloSemanas === 0 && fechaActual >= hoy) {
                    const dia = String(fechaActual.getDate()).padStart(2, '0');
                    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
                    fechas.push(`${dia}-${mes}`);
                }

                // Avanzar al siguiente día de la semana
                fechaActual.setDate(fechaActual.getDate() + 7);
            }
        } else if (grupo.tipo_frecuencia === 'mensual' && grupo.dia_mes) {
            // Para frecuencia mensual, usar el día del mes
            let fechaActual = new Date(hoy);
            fechaActual.setDate(grupo.dia_mes);

            // Si ya pasó este mes, avanzar al siguiente
            if (fechaActual < hoy) {
                fechaActual.setMonth(fechaActual.getMonth() + 1);
                fechaActual.setDate(grupo.dia_mes);
            }

            while (fechaActual <= fechaLimite) {
                const dia = String(fechaActual.getDate()).padStart(2, '0');
                const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
                fechas.push(`${dia}-${mes}`);
                fechaActual.setMonth(fechaActual.getMonth() + 1);
                fechaActual.setDate(grupo.dia_mes);
            }
        }

        return fechas.slice(0, 12); // Limitar a las primeras 12 fechas
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
                            {grupo && grupo.tipo_frecuencia && (
                                <Text style={{
                                    fontSize: 13,
                                    color: '#002587',
                                    marginTop: 6,
                                    fontWeight: '600'
                                }}>
                                    {grupo.tipo_frecuencia === 'semanal' && grupo.dia_semana ? (
                                        (() => {
                                            const diaSemanaNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                                            const intervaloText = grupo.intervalo_semanas === 1
                                                ? 'Semanal'
                                                : grupo.intervalo_semanas === 2
                                                    ? 'Cada 2 semanas'
                                                    : grupo.intervalo_semanas === 3
                                                        ? 'Cada 3 semanas'
                                                        : `Cada ${grupo.intervalo_semanas} semanas`;
                                            return `${diaSemanaNames[grupo.dia_semana]} - ${intervaloText}`;
                                        })()
                                    ) : grupo.tipo_frecuencia === 'mensual' && grupo.dia_mes ? (
                                        `Día ${grupo.dia_mes} de cada mes`
                                    ) : (
                                        grupo.tipo_frecuencia.charAt(0).toUpperCase() + grupo.tipo_frecuencia.slice(1)
                                    )}
                                </Text>
                            )}
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

                                            {/* Fecha de creación del pedido */}
                                            {(pedido.fecha_creacion || pedido.fechaCreacionOriginal || pedido.creado) && (
                                                <View style={{
                                                    marginTop: 12,
                                                    paddingTop: 12,
                                                    borderTopWidth: 1,
                                                    borderTopColor: '#e0e0e0'
                                                }}>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}>
                                                        <FontAwesome name="clock-o" style={{
                                                            fontSize: 14,
                                                            color: '#666',
                                                            marginRight: 8,
                                                            width: 20
                                                        }} />
                                                        <Text style={{
                                                            fontSize: 13,
                                                            color: '#666'
                                                        }}>
                                                            Pedido creado: {(() => {
                                                                const fechaStr = pedido.fecha_creacion || pedido.fechaCreacionOriginal || pedido.creado;
                                                                const fecha = new Date(fechaStr);
                                                                const dia = String(fecha.getDate()).padStart(2, '0');
                                                                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                                                                const año = fecha.getFullYear();
                                                                return `${dia}-${mes}-${año}`;
                                                            })()}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}

                                            {/* Sección de fechas de ejecución */}
                                            {grupo && grupo.tipo_frecuencia && (
                                                <View style={{
                                                    marginTop: 12,
                                                    paddingTop: 12,
                                                    paddingBottom: 12,
                                                    borderTopWidth: 1,
                                                    borderTopColor: '#e0e0e0',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: '#e0e0e0'
                                                }}>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginBottom: 8
                                                    }}>
                                                        <FontAwesome name="calendar-check-o" style={{
                                                            fontSize: 14,
                                                            color: '#002587',
                                                            marginRight: 8,
                                                            width: 20
                                                        }} />
                                                        <Text style={{
                                                            fontSize: 14,
                                                            fontWeight: '600',
                                                            color: '#002587'
                                                        }}>
                                                            Próximas fechas de ejecución:
                                                        </Text>
                                                    </View>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        marginTop: 8
                                                    }}>
                                                        {calcularFechasEjecucion(pedido).length > 0 ? (
                                                            calcularFechasEjecucion(pedido).map((fecha, idx) => (
                                                                <View
                                                                    key={idx}
                                                                    style={{
                                                                        backgroundColor: '#e3f2fd',
                                                                        paddingHorizontal: 10,
                                                                        paddingVertical: 6,
                                                                        borderRadius: 6,
                                                                        marginRight: 8,
                                                                        marginBottom: 6
                                                                    }}
                                                                >
                                                                    <Text style={{
                                                                        fontSize: 12,
                                                                        fontWeight: '600',
                                                                        color: '#002587'
                                                                    }}>
                                                                        {fecha}
                                                                    </Text>
                                                                </View>
                                                            ))
                                                        ) : (
                                                            <Text style={{
                                                                fontSize: 12,
                                                                color: '#999',
                                                                fontStyle: 'italic'
                                                            }}>
                                                                No hay fechas programadas en los próximos 3 meses
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            )}

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

