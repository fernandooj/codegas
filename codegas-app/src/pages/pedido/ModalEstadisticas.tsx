import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getEstadisticas } from '../../redux/actions/pedidoActions';
import { formatCurrency } from '../../utils/number';
import { Estadistica, DetallePedido, ModalEstadisticasProps } from './types';

const { width } = Dimensions.get('window');

const ModalEstadisticas: React.FC<ModalEstadisticasProps> = ({
    visible,
    onClose,
    conductorId,
    acceso
}) => {
    const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);
    const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes' | 'año'>('dia');
    const [tipoVista, setTipoVista] = useState<'resumen' | 'detalle'>('resumen');

    // Refs para sincronizar scroll
    const headerScrollRef = useRef<ScrollView>(null);
    const subHeaderScrollRef = useRef<ScrollView>(null);
    const dataScrollRef = useRef<ScrollView>(null);
    const placaScrollRef = useRef<ScrollView>(null);
    const dataVerticalScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (visible) {
            cargarEstadisticas(periodo);
        }
    }, [visible, periodo]);

    const cargarEstadisticas = async (periodoSeleccionado: string) => {
        setLoading(true);
        try {
            // Si es conductor, enviar su ID, si es admin enviar null para ver todos
            const idConductor = acceso === 'conductor' ? conductorId : null;
            const resultado = await getEstadisticas(idConductor, periodoSeleccionado);

            if (resultado.status) {
                // Detectar el tipo de vista según la respuesta del API
                const tipoVistaRecibido = (resultado as any).tipoVista || 'resumen';
                setTipoVista(tipoVistaRecibido);

                if (tipoVistaRecibido === 'detalle') {
                    // Vista de detalle para conductores
                    setDetallePedidos(resultado.estadisticas || []);
                    setEstadisticas([]);
                } else {
                    // Vista de resumen para admin
                    setEstadisticas(resultado.estadisticas || []);
                    setDetallePedidos([]);
                }
            } else {
                setEstadisticas([]);
                setDetallePedidos([]);
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setEstadisticas([]);
            setDetallePedidos([]);
        } finally {
            setLoading(false);
        }
    };

    const getPeriodoLabel = () => {
        const labels = {
            dia: 'Hoy',
            semana: 'Esta Semana',
            mes: 'Este Mes',
            año: 'Este Año'
        };
        return labels[periodo] || 'Hoy';
    };

    const handleHeaderScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (subHeaderScrollRef.current) {
            subHeaderScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
        if (dataScrollRef.current) {
            dataScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
    };

    const handleDataScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (headerScrollRef.current) {
            headerScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
        if (subHeaderScrollRef.current) {
            subHeaderScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
    };

    const handleVerticalScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (placaScrollRef.current) {
            placaScrollRef.current.scrollTo({ y: offsetY, animated: false });
        }
    };

    const handlePlacaScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (dataVerticalScrollRef.current) {
            dataVerticalScrollRef.current.scrollTo({ y: offsetY, animated: false });
        }
    };

    const formatKilos = (value: any): string => {
        if (value === null || value === undefined || value === '') {
            return '0';
        }
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0' : num.toFixed(0);
    };

    const renderPlacaColumn = (item: Estadistica, isTotal: boolean = false) => (
        <View
            key={`placa-${item.placa}`}
            style={[
                styles.placaRow,
                isTotal && styles.placaRowTotal
            ]}
        >
            <Text style={[styles.tablaCell, styles.placaFixed, isTotal && styles.totalText]}>
                {item.placa}
            </Text>
        </View>
    );

    const renderDataRow = (item: Estadistica, isTotal: boolean = false) => (
        <View
            key={`data-${item.placa}`}
            style={[
                styles.dataRow,
                isTotal && styles.dataRowTotal
            ]}
        >
            {/* Crédito */}
            <View style={styles.tablaSectionWide}>
                <Text
                    style={[styles.tablaCell, styles.dataText, isTotal && styles.totalText]}
                    numberOfLines={1}
                >
                    {formatKilos(item.total_kilos_credito)} Kg
                </Text>
                <Text
                    style={[styles.tablaCell, styles.dataText, isTotal && styles.totalText]}
                    numberOfLines={1}
                >
                    {formatCurrency(item.total_valor_credito || 0, 0)}
                </Text>
            </View>

            {/* Contado */}
            <View style={styles.tablaSectionWide}>
                <Text
                    style={[styles.tablaCell, styles.dataText, isTotal && styles.totalText]}
                    numberOfLines={1}
                >
                    {formatKilos(item.total_kilos_contado)} Kg
                </Text>
                <Text
                    style={[styles.tablaCell, styles.dataText, isTotal && styles.totalText]}
                    numberOfLines={1}
                >
                    {formatCurrency(item.total_valor_contado || 0, 0)}
                </Text>
            </View>

            {/* Total */}
            <View style={styles.tablaSectionWide}>
                <Text
                    style={[styles.tablaCell, styles.dataText, isTotal && styles.totalText]}
                    numberOfLines={1}
                >
                    {formatKilos(item.total_kilos)} Kg
                </Text>
                <Text
                    style={[styles.tablaCell, styles.dataText, isTotal && styles.totalText]}
                    numberOfLines={1}
                >
                    {formatCurrency(item.total_valor || 0, 0)}
                </Text>
            </View>

            <Text
                style={[styles.tablaCell, styles.cantidadCellWide, isTotal && styles.totalText]}
                numberOfLines={1}
            >
                {item.cantidad_pedidos || 0}
            </Text>
        </View>
    );

    // Renderizar fila de detalle de pedido para conductores
    const renderDetallePedidoRow = (item: DetallePedido, index: number, isTotal: boolean = false) => (
        <View
            key={`detalle-${item.remision || 'total'}-${index}`}
            style={[
                styles.detalleRow,
                isTotal && styles.detalleRowTotal
            ]}
        >
            <Text style={[styles.detalleCell, styles.remisionCell, isTotal && styles.totalText]}>
                {item.remision || ''}
            </Text>
            <Text style={[styles.detalleCell, styles.pedidoCell, isTotal && styles.totalText]}>
                {item.pedido}
            </Text>
            <Text style={[styles.detalleCell, styles.codtCell, isTotal && styles.totalText]}>
                {item.codt}
            </Text>
            <Text style={[styles.detalleCell, styles.kilosCell, isTotal && styles.totalText]}>
                {formatKilos(item.total_kilos)}
            </Text>
            <Text style={[styles.detalleCell, styles.contadoCell, isTotal && styles.totalText]}>
                {item.vlr_contado ? formatCurrency(item.vlr_contado, 0) : '-'}
            </Text>
            <Text style={[styles.detalleCell, styles.valorCell, isTotal && styles.totalText]}>
                {formatCurrency(item.valor_total || 0, 0)}
            </Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>📊 Estadísticas de Entregas</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="times" style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Filtros de Periodo */}
                    <View style={styles.filtrosContainer}>
                        {(['dia', 'semana', 'mes', 'año'] as const).map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.filtroButton,
                                    periodo === p && styles.filtroButtonActive
                                ]}
                                onPress={() => setPeriodo(p)}
                            >
                                <Text style={[
                                    styles.filtroText,
                                    periodo === p && styles.filtroTextActive
                                ]}>
                                    {p === 'dia' ? 'Hoy' : p === 'semana' ? 'Semana' : p === 'mes' ? 'Mes' : 'Año'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Periodo seleccionado */}
                    <Text style={styles.periodoLabel}>{getPeriodoLabel()}</Text>

                    {/* Tabla de estadísticas */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>Cargando estadísticas...</Text>
                        </View>
                    ) : tipoVista === 'detalle' ? (
                        /* Vista de Detalle para Conductores */
                        <View style={styles.tableWrapper}>
                            {/* Header de la tabla de detalle */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View>
                                    <View style={styles.detalleHeaderRow}>
                                        <Text style={[styles.detalleHeaderCell, styles.remisionCell]}>Remisión</Text>
                                        <Text style={[styles.detalleHeaderCell, styles.pedidoCell]}>Pedido</Text>
                                        <Text style={[styles.detalleHeaderCell, styles.codtCell]}>Codt</Text>
                                        <Text style={[styles.detalleHeaderCell, styles.kilosCell]}>Total Kilos</Text>
                                        <Text style={[styles.detalleHeaderCell, styles.contadoCell]}>Vlr Contado</Text>
                                        <Text style={[styles.detalleHeaderCell, styles.valorCell]}>Valor Total</Text>
                                    </View>

                                    {/* Datos */}
                                    {detallePedidos.length > 0 ? (
                                        <ScrollView style={styles.detalleScrollContainer} showsVerticalScrollIndicator={true}>
                                            {detallePedidos.map((item, index) =>
                                                renderDetallePedidoRow(item, index, item.pedido === 'TOTAL')
                                            )}
                                        </ScrollView>
                                    ) : (
                                        <View style={styles.emptyContainer}>
                                            <FontAwesome name="inbox" style={styles.emptyIcon} />
                                            <Text style={styles.emptyText}>
                                                No hay entregas registradas en este periodo
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    ) : (
                        /* Vista de Resumen para Admin */
                        <View style={styles.tableWrapper}>
                            {/* Header de la tabla */}
                            <View style={styles.headerRow}>
                                <View style={styles.placaFixedContainer}>
                                    <Text style={[styles.tablaHeaderCell, styles.placaFixed]}>Placa</Text>
                                </View>
                                <ScrollView
                                    ref={headerScrollRef}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    scrollEventThrottle={16}
                                    onScroll={handleHeaderScroll}
                                    style={styles.headerScrollContainer}
                                >
                                    <View style={styles.scrollableContent}>
                                        <View style={styles.tablaSectionWide}>
                                            <Text style={styles.tablaHeaderCell}>Crédito</Text>
                                        </View>
                                        <View style={styles.tablaSectionWide}>
                                            <Text style={styles.tablaHeaderCell}>Contado</Text>
                                        </View>
                                        <View style={styles.tablaSectionWide}>
                                            <Text style={styles.tablaHeaderCell}>Total</Text>
                                        </View>
                                        <Text style={[styles.tablaHeaderCell, styles.cantidadCellWide]}>Cant Ped</Text>
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Subheader (Kg / Valor) */}
                            <View style={styles.subHeaderRow}>
                                <View style={[styles.placaFixedContainer, { backgroundColor: '#0056b3' }]}>
                                    <Text style={[styles.tablaHeaderCell, styles.placaFixed]}></Text>
                                </View>
                                <ScrollView
                                    ref={subHeaderScrollRef}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    scrollEnabled={false}
                                    scrollEventThrottle={16}
                                    style={styles.headerScrollContainer}
                                >
                                    <View style={styles.scrollableContent}>
                                        <View style={styles.tablaSectionWide}>
                                            <Text style={styles.subHeaderText}>Kg</Text>
                                            <Text style={styles.subHeaderText}>Valor</Text>
                                        </View>
                                        <View style={styles.tablaSectionWide}>
                                            <Text style={styles.subHeaderText}>Kg</Text>
                                            <Text style={styles.subHeaderText}>Valor</Text>
                                        </View>
                                        <View style={styles.tablaSectionWide}>
                                            <Text style={styles.subHeaderText}>Kg</Text>
                                            <Text style={styles.subHeaderText}>Valor</Text>
                                        </View>
                                        <Text style={[styles.tablaHeaderCell, styles.cantidadCellWide]}></Text>
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Datos con scroll sincronizado */}
                            {estadisticas.length > 0 ? (
                                <View style={styles.tableBody}>
                                    {/* Columna fija de placas */}
                                    <View style={styles.placaColumn}>
                                        <ScrollView
                                            ref={placaScrollRef}
                                            style={styles.scrollContainer}
                                            scrollEnabled={false}
                                            showsVerticalScrollIndicator={false}
                                            scrollEventThrottle={16}
                                            onScroll={handlePlacaScroll}
                                        >
                                            {estadisticas.map((item) =>
                                                renderPlacaColumn(item, item.placa === 'TOTAL')
                                            )}
                                        </ScrollView>
                                    </View>

                                    {/* Contenido scrollable horizontal */}
                                    <ScrollView
                                        ref={dataScrollRef}
                                        horizontal
                                        showsHorizontalScrollIndicator={true}
                                        scrollEventThrottle={16}
                                        onScroll={handleDataScroll}
                                        style={styles.dataScrollContainer}
                                    >
                                        <ScrollView
                                            ref={dataVerticalScrollRef}
                                            style={styles.scrollContainer}
                                            showsVerticalScrollIndicator={true}
                                            scrollEventThrottle={16}
                                            onScroll={handleVerticalScroll}
                                        >
                                            {estadisticas.map((item) =>
                                                renderDataRow(item, item.placa === 'TOTAL')
                                            )}
                                        </ScrollView>
                                    </ScrollView>
                                </View>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <FontAwesome name="inbox" style={styles.emptyIcon} />
                                    <Text style={styles.emptyText}>
                                        No hay entregas registradas en este periodo
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: width * 0.95,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        fontSize: 24,
        color: '#666',
    },
    filtrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        gap: 8,
    },
    filtroButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    filtroButtonActive: {
        backgroundColor: '#007bff',
    },
    filtroText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filtroTextActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    periodoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007bff',
        textAlign: 'center',
        marginBottom: 15,
    },
    tableWrapper: {
        maxHeight: 420,
    },
    scrollContainer: {
        maxHeight: 320,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
    },
    subHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#0056b3',
        paddingVertical: 8,
        overflow: 'hidden',
    },
    tablaHeaderCell: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
    },
    subHeaderText: {
        color: 'white',
        fontSize: 11,
        textAlign: 'center',
        flex: 1,
    },
    tableBody: {
        flexDirection: 'row',
    },
    placaColumn: {
        width: 90,
    },
    headerScrollContainer: {
        flex: 1,
    },
    dataScrollContainer: {
        flex: 1,
    },
    placaRow: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        justifyContent: 'center',
        borderRightWidth: 2,
        borderRightColor: '#e0e0e0',
    },
    placaRowTotal: {
        backgroundColor: '#f8f9fa',
        borderTopWidth: 2,
        borderTopColor: '#007bff',
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    dataRowTotal: {
        backgroundColor: '#f8f9fa',
        borderTopWidth: 2,
        borderTopColor: '#007bff',
    },
    tablaCell: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    placaFixedContainer: {
        width: 90,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRightWidth: 2,
        borderRightColor: 'white',
    },
    placaFixed: {
        width: '100%',
        fontWeight: '600',
        color: '#333',
    },
    scrollableContent: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    tablaSectionWide: {
        width: 180,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dataText: {
        fontSize: 10,
        flex: 1,
        flexWrap: 'nowrap',
    },
    cantidadCellWide: {
        width: 60,
    },
    totalText: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        color: '#ccc',
        marginBottom: 10,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
    },
    // Estilos para vista de detalle de conductor
    detalleHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#0056b3',
    },
    detalleHeaderCell: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    detalleScrollContainer: {
        maxHeight: 360,
    },
    detalleRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    detalleRowTotal: {
        backgroundColor: '#f8f9fa',
        borderTopWidth: 2,
        borderTopColor: '#007bff',
    },
    detalleCell: {
        fontSize: 11,
        color: '#333',
        textAlign: 'center',
    },
    remisionCell: {
        width: 80,
    },
    pedidoCell: {
        width: 90,
    },
    codtCell: {
        width: 75,
    },
    kilosCell: {
        width: 95,
    },
    contadoCell: {
        width: 110,
    },
    valorCell: {
        width: 110,
    },
});

export default ModalEstadisticas;
