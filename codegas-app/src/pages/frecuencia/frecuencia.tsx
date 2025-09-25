import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { AppDispatch } from '../../redux/types';

import { style } from './style';
import { getFrecuencia } from '../../redux/actions/pedidoActions';
import Footer from '../components/footer';
import { FrecuenciaState, PedidoFrecuencia } from './types';
import EditarFrecuenciaModal from './EditarFrecuenciaModal';

const Frecuencia: React.FC = ({ navigation }: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const pedidos = useSelector((state: any) => state.pedido.pedidosFrecuencia);

    const [state, setState] = useState<FrecuenciaState>({
        terminoBuscador: "",
        pedidos: [],
        pedidosFiltrados: [],
        inicio: 0,
        final: 10,
        showSpin: false,
        loading: false,
        showEditModal: false,
        editingFrecuencia: null,
        initialLoading: true
    });

    useEffect(() => {
        const loadFrecuencias = async () => {
            try {
                await dispatch(getFrecuencia());
            } catch (error) {
                console.error('Error loading frecuencias:', error);
                setState(prev => ({
                    ...prev,
                    initialLoading: false
                }));
            }
        };

        loadFrecuencias();
    }, [dispatch]);

    useEffect(() => {
        setState(prev => ({
            ...prev,
            pedidos,
            pedidosFiltrados: pedidos,
            initialLoading: false
        }));
    }, [pedidos]);

    const filtrarPedidos = useCallback((termino: string) => {
        if (!termino.trim()) {
            setState(prev => ({
                ...prev,
                pedidosFiltrados: pedidos
            }));
            return;
        }

        const pedidosFiltrados = pedidos.filter((pedido: PedidoFrecuencia) => {
            const busqueda = termino.toLowerCase();
            return (
                String(pedido.nombre || '').toLowerCase().includes(busqueda) ||
                String(pedido.codt || '').toLowerCase().includes(busqueda) ||
                String(pedido.pedido_id || '').toLowerCase().includes(busqueda) ||
                String(pedido.forma || '').toLowerCase().includes(busqueda) ||
                String(pedido.frecuencia || '').toLowerCase().includes(busqueda) ||
                String(pedido.razon_social || '').toLowerCase().includes(busqueda) ||
                String(pedido.dia1 || '').toLowerCase().includes(busqueda) ||
                String(pedido.dia2 || '').toLowerCase().includes(busqueda)
            );
        });

        setState(prev => ({
            ...prev,
            pedidosFiltrados
        }));
    }, [pedidos]);

    const handleSearch = (terminoBuscador: string) => {
        setState(prev => ({ ...prev, terminoBuscador }));
        filtrarPedidos(terminoBuscador);
    };

    const onScroll = (e: any) => {
        const { final } = state;
        let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;

        if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            setState(prev => ({
                ...prev,
                final: final + 5,
                showSpin: true
            }));

            setTimeout(() => {
                setState(prev => ({ ...prev, showSpin: false }));
            }, 2000);
        }
    };

    const eliminarFrecuencia = (id: string) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de que deseas eliminar la frecuencia ${id}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => confirmarEliminacion(id),
                    style: 'destructive'
                }
            ],
            { cancelable: false }
        );
    };

    const confirmarEliminacion = async (id: string) => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            const res = await axios.delete(`fre/frecuencia/${id}`);

            if (res.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Frecuencia Eliminada',
                    text2: 'La frecuencia se ha eliminado correctamente'
                });
                dispatch(getFrecuencia());
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error al eliminar',
                    text2: 'Tenemos un problema, inténtalo más tarde'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: 'Verifica tu conexión a internet'
            });
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const onRefresh = useCallback(() => {
        dispatch(getFrecuencia());
    }, [dispatch]);

    const handleEditFrecuencia = (pedido: PedidoFrecuencia) => {
        setState(prev => ({
            ...prev,
            showEditModal: true,
            editingFrecuencia: pedido
        }));
    };

    const handleCloseEditModal = () => {
        setState(prev => ({
            ...prev,
            showEditModal: false,
            editingFrecuencia: null
        }));
    };

    // Función para formatear el día (número + nombre)
    const formatDay = (dayValue: string | number, frecuencia: string = 'semanal'): string => {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        if (frecuencia === 'mensual') {
            // Para mensual, solo mostrar el número del día
            return String(dayValue);
        }

        if (typeof dayValue === 'number') {
            return `${dayValue} ${dayNames[dayValue - 1] || ''}`;
        } else if (typeof dayValue === 'string' && !isNaN(Number(dayValue))) {
            const num = Number(dayValue);
            return `${num} ${dayNames[num - 1] || ''}`;
        } else if (typeof dayValue === 'string') {
            // Si ya es un nombre, encontrar su número
            const index = dayNames.indexOf(dayValue);
            if (index !== -1) {
                return `${index + 1} ${dayValue}`;
            }
            return dayValue;
        }
        return String(dayValue);
    };

    const handleEditSuccess = (updatedData?: PedidoFrecuencia) => {
        if (updatedData) {
            // Actualizar el listado localmente sin llamar al backend
            setState(prev => ({
                ...prev,
                pedidos: prev.pedidos.map(pedido =>
                    pedido.pedido_id === updatedData.pedido_id ? updatedData : pedido
                ),
                pedidosFiltrados: prev.pedidosFiltrados.map(pedido =>
                    pedido.pedido_id === updatedData.pedido_id ? updatedData : pedido
                ),
                showEditModal: false,
                editingFrecuencia: null
            }));
        } else {
            // Fallback: llamar al backend si no hay datos actualizados
            dispatch(getFrecuencia());
            setState(prev => ({
                ...prev,
                showEditModal: false,
                editingFrecuencia: null
            }));
        }
    };

    const { terminoBuscador, pedidosFiltrados, showSpin, loading, showEditModal, editingFrecuencia, initialLoading } = state;

    // Mostrar preloading inicial
    if (initialLoading) {
        return (
            <View style={style.container}>
                <View style={style.header}>
                    <View style={style.headerContent}>
                        <View style={style.headerTextContainer}>
                            <Text style={style.titulo}>Pedidos Frecuentes</Text>
                            <Text style={style.subtitulo}>Cargando...</Text>
                        </View>
                    </View>
                </View>
                <View style={style.preloadingContainer}>
                    <ActivityIndicator size="large" color="#002587" />
                    <Text style={style.preloadingText}>Cargando pedidos frecuentes...</Text>
                    <Text style={style.preloadingSubtext}>Esto puede tomar unos momentos</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={style.container}>
            {/* Header mejorado */}
            <View style={style.header}>
                <View style={style.headerContent}>
                    <View style={style.headerTextContainer}>
                        <Text style={style.titulo}>Pedidos Frecuentes</Text>
                        <Text style={style.subtitulo}>
                            {initialLoading ? 'Cargando...' : `${pedidosFiltrados.length} pedidos encontrados`}
                        </Text>
                    </View>
                    <View style={style.headerStats}>
                        <View style={style.statItem}>
                            <Text style={style.statNumber}>
                                {initialLoading ? '...' : pedidosFiltrados.filter(p => p.frecuencia === 'semanal').length}
                            </Text>
                            <Text style={style.statLabel}>Semanal</Text>
                        </View>
                        <View style={style.statItem}>
                            <Text style={style.statNumber}>
                                {initialLoading ? '...' : pedidosFiltrados.filter(p => p.frecuencia === 'quincenal').length}
                            </Text>
                            <Text style={style.statLabel}>Quincenal</Text>
                        </View>
                        <View style={style.statItem}>
                            <Text style={style.statNumber}>
                                {initialLoading ? '...' : pedidosFiltrados.filter(p => p.frecuencia === 'mensual').length}
                            </Text>
                            <Text style={style.statLabel}>Mensual</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Buscador mejorado */}
            <View style={style.searchContainer}>
                <FontAwesome name="search" style={style.searchIcon} />
                <TextInput
                    placeholder="Buscar por: cliente, razón social, forma, frecuencia..."
                    autoCapitalize='none'
                    placeholderTextColor="#aaa"
                    onChangeText={handleSearch}
                    value={terminoBuscador}
                    style={style.searchInput}
                />
                {terminoBuscador.length > 0 && (
                    <TouchableOpacity
                        onPress={() => handleSearch('')}
                        style={style.clearButton}
                    >
                        <FontAwesome name="times" style={style.clearIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Lista mejorada */}
            <ScrollView
                style={style.scrollContainer}
                onScroll={onScroll}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                        colors={['#002587']}
                        tintColor="#002587"
                    />
                }
            >
                {pedidosFiltrados.length === 0 ? (
                    <View style={style.emptyContainer}>
                        <FontAwesome name="search" style={style.emptyIcon} />
                        <Text style={style.emptyText}>
                            {terminoBuscador ? 'No se encontraron resultados' : 'No hay pedidos frecuentes'}
                        </Text>
                        {terminoBuscador && (
                            <Text style={style.emptySubtext}>
                                Intenta con otros términos de búsqueda
                            </Text>
                        )}
                    </View>
                ) : (
                    pedidosFiltrados.map((pedido: PedidoFrecuencia, key: number) => (
                        <View key={key} style={style.cardContainer}>
                            <TouchableOpacity
                                style={style.cardContent}
                                onPress={() => navigation.navigate("verPerfil", {
                                    tipoAcceso: "editar",
                                    idUsuario: pedido.usuarioid
                                })}
                            >
                                <View style={style.cardHeader}>
                                    <Text style={style.clienteName}>{pedido.nombre}</Text>
                                    <Text style={style.codigoText}>#{pedido.codt}</Text>
                                </View>

                                {pedido.razon_social && (
                                    <Text style={style.razonSocial}>{pedido.razon_social}</Text>
                                )}

                                <View style={style.cardDetails}>
                                    <View style={style.detailRow}>
                                        <FontAwesome name="file-text-o" style={style.detailIcon} />
                                        <Text style={style.detailText}>Pedido: {pedido.pedido_id}</Text>
                                    </View>

                                    <View style={style.detailRow}>
                                        <FontAwesome name="shopping-cart" style={style.detailIcon} />
                                        <Text style={style.detailText}>
                                            {pedido.forma}: {
                                                pedido.forma === "cantidad"
                                                    ? `${pedido.cantidadKl} KL`
                                                    : pedido.forma === "monto"
                                                        ? `$${pedido.cantidadPrecio}`
                                                        : pedido.forma
                                            }
                                        </Text>
                                    </View>

                                    <View style={style.detailRow}>
                                        <FontAwesome name="repeat" style={style.detailIcon} />
                                        <Text style={style.detailText}>
                                            Frecuencia: {pedido.frecuencia}
                                        </Text>
                                    </View>

                                    {pedido.frecuencia === "semanal" && pedido.dia1 && (
                                        <View style={style.detailRow}>
                                            <FontAwesome name="calendar" style={style.detailIcon} />
                                            <Text style={style.detailText}>Día: {formatDay(pedido.dia1, 'semanal')}</Text>
                                        </View>
                                    )}

                                    {pedido.frecuencia === "quincenal" && pedido.dia1 && pedido.dia2 && (
                                        <View style={style.detailRow}>
                                            <FontAwesome name="calendar" style={style.detailIcon} />
                                            <Text style={style.detailText}>
                                                Días: {formatDay(pedido.dia1, 'quincenal')} - {formatDay(pedido.dia2, 'quincenal')}
                                            </Text>
                                        </View>
                                    )}

                                    {pedido.frecuencia === "mensual" && pedido.dia1 && (
                                        <View style={style.detailRow}>
                                            <FontAwesome name="calendar" style={style.detailIcon} />
                                            <Text style={style.detailText}>Día del mes: {formatDay(pedido.dia1, 'mensual')}</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>

                            <View style={style.cardActions}>
                                <TouchableOpacity
                                    onPress={() => handleEditFrecuencia(pedido)}
                                    style={style.actionButton}
                                >
                                    <FontAwesome name="edit" style={style.actionIcon} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => eliminarFrecuencia(pedido.pedido_id)}
                                    style={[style.actionButton, style.deleteButton]}
                                >
                                    <FontAwesome name="trash" style={[style.actionIcon, style.deleteIcon]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}

                {showSpin && (
                    <View style={style.loadingContainer}>
                        <ActivityIndicator size="small" color="#002587" />
                        <Text style={style.loadingText}>Cargando más...</Text>
                    </View>
                )}
            </ScrollView>

            <Footer navigation={navigation} />
            <Toast />

            {/* Modal de edición */}
            <EditarFrecuenciaModal
                visible={showEditModal}
                onClose={handleCloseEditModal}
                frecuencia={editingFrecuencia}
                onSuccess={handleEditSuccess}
            />
        </View>
    );
};

export default Frecuencia; 
