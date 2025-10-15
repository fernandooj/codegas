import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getEstadisticas } from '../../redux/actions/pedidoActions';
import { formatCurrency } from '../../utils/number';
import { Estadistica, DetallePedido, ModalEstadisticasProps } from './types';
import { style } from './style';

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
    const [tipoVista, setTipoVista] = useState<'resumen' | 'detalle' | 'por_dia' | 'listado_pedidos'>('resumen');

    // Refs para sincronizar scroll
    const headerScrollRef = useRef<ScrollView>(null);
    const subHeaderScrollRef = useRef<ScrollView>(null);
    const dataScrollRef = useRef<ScrollView>(null);
    const placaScrollRef = useRef<ScrollView>(null);
    const dataVerticalScrollRef = useRef<ScrollView>(null);

    // Refs para la nueva implementación de tabla
    const mainHeaderScrollRef = useRef<ScrollView>(null);
    const subHeaderScrollRefNew = useRef<ScrollView>(null);
    const dataHorizontalScrollRef = useRef<ScrollView>(null);

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

            const resultado = await getEstadisticas(idConductor, periodoSeleccionado, acceso);

            if (resultado.status) {
                // Para admin, forzar siempre resumen por placa en semana/mes/año
                const tipoVistaRecibido = acceso === 'admin' && periodoSeleccionado !== 'dia'
                    ? 'resumen'
                    : (resultado as any).tipoVista || 'resumen';
                setTipoVista(tipoVistaRecibido);

                if (tipoVistaRecibido === 'listado_pedidos') {
                    // Vista de listado de pedidos (normalmente para conductores en día)
                    setDetallePedidos(resultado.estadisticas || []);
                    setEstadisticas([]);
                } else if (tipoVistaRecibido === 'detalle') {
                    // Vista de detalle por fecha
                    setEstadisticas(resultado.estadisticas || []);
                    setDetallePedidos([]);
                } else if (tipoVistaRecibido === 'por_dia') {
                    // Vista por día para períodos largos (semana/mes/año)
                    setEstadisticas(resultado.estadisticas || []);
                    setDetallePedidos([]);
                } else {
                    // Vista de resumen (por placa)
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

    // Funciones de sincronización para la nueva tabla
    const handleMainHeaderScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (subHeaderScrollRefNew.current) {
            subHeaderScrollRefNew.current.scrollTo({ x: offsetX, animated: false });
        }
        if (dataHorizontalScrollRef.current) {
            dataHorizontalScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
    };

    const handleSubHeaderScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (mainHeaderScrollRef.current) {
            mainHeaderScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
        if (dataHorizontalScrollRef.current) {
            dataHorizontalScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
    };

    const handleDataHorizontalScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (mainHeaderScrollRef.current) {
            mainHeaderScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
        if (subHeaderScrollRefNew.current) {
            subHeaderScrollRefNew.current.scrollTo({ x: offsetX, animated: false });
        }
    };

    const formatKilos = (value: any): string => {
        if (value === null || value === undefined || value === '') {
            return '0,0';
        }
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0,0' : num.toFixed(1).replace('.', ',');
    };

    const renderPlacaColumn = (item: Estadistica, isTotal: boolean = false) => (
        <View
            key={`placa-${item.placa}`}
            style={[
                style.modalEstadisticasPlacaRow,
                isTotal && style.modalEstadisticasPlacaRowTotal
            ]}
        >
            <Text style={[style.modalEstadisticasTablaCell, style.modalEstadisticasPlacaFixed, isTotal && style.modalEstadisticasTotalText]}>
                {item.placa}
            </Text>
        </View>
    );

    const renderDataRow = (item: Estadistica, isTotal: boolean = false) => (
        <View
            key={`data-${item.placa}`}
            style={[
                style.modalEstadisticasDataRow,
                isTotal && style.modalEstadisticasDataRowTotal
            ]}
        >
            {/* Crédito */}
            <View style={style.modalEstadisticasTablaSectionWide}>
                <Text
                    style={[style.modalEstadisticasTablaCell, style.modalEstadisticasDataText, isTotal && style.modalEstadisticasTotalText]}
                    numberOfLines={1}
                >
                    {formatKilos(item.total_kilos_credito)} Kg
                </Text>
                <Text
                    style={[style.modalEstadisticasTablaCell, style.modalEstadisticasDataText, isTotal && style.modalEstadisticasTotalText]}
                    numberOfLines={1}
                >
                    {formatCurrency(item.total_valor_credito || 0, 0)}
                </Text>
            </View>

            {/* Contado */}
            <View style={style.modalEstadisticasTablaSectionWide}>
                <Text
                    style={[style.modalEstadisticasTablaCell, style.modalEstadisticasDataText, isTotal && style.modalEstadisticasTotalText]}
                    numberOfLines={1}
                >
                    {formatKilos(item.total_kilos_contado)} Kg
                </Text>
                <Text
                    style={[style.modalEstadisticasTablaCell, style.modalEstadisticasDataText, isTotal && style.modalEstadisticasTotalText]}
                    numberOfLines={1}
                >
                    {formatCurrency(item.total_valor_contado || 0, 0)}
                </Text>
            </View>

            {/* Total */}
            <View style={style.modalEstadisticasTablaSectionWide}>
                <Text
                    style={[style.modalEstadisticasTablaCell, style.modalEstadisticasDataText, isTotal && style.modalEstadisticasTotalText]}
                    numberOfLines={1}
                >
                    {formatKilos(item.total_kilos)} Kg
                </Text>
                <Text
                    style={[style.modalEstadisticasTablaCell, style.modalEstadisticasDataText, isTotal && style.modalEstadisticasTotalText]}
                    numberOfLines={1}
                >
                    {formatCurrency(item.total_valor || 0, 0)}
                </Text>
            </View>

            <Text
                style={[style.modalEstadisticasTablaCell, style.modalEstadisticasCantidadCellWide, isTotal && style.modalEstadisticasTotalText]}
                numberOfLines={1}
            >
                {item.cantidad_pedidos || 0}
            </Text>
        </View>
    );

    // Renderizar fila de estadísticas por día
    const renderEstadisticaPorDiaRow = (item: any, index: number) => (
        <View
            key={`dia-${item.fechaentrega}-${index}`}
            style={style.modalEstadisticasPorDiaRow}
        >
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasFechaCell]}>
                {item.fechaentrega}
            </Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasCantidadCell]}>
                {item.cantidad_pedidos || 0}
            </Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasKilosCell]}>
                {formatKilos(item.total_kilos)}
            </Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasContadoCell]}>
                {formatCurrency(item.vlr_contado || 0, 0)}
            </Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasCreditoCell]}>
                {formatCurrency(item.vlr_credito || 0, 0)}
            </Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasValorCell]}>
                {formatCurrency(item.valor_total || 0, 0)}
            </Text>
        </View>
    );

    // Renderizar fila de detalle de pedido para conductores
    const renderDetallePedidoRow = (item: DetallePedido, index: number, isTotal: boolean = false) => (
        <View
            key={`detalle-${item.remision || 'total'}-${index}`}
            style={[
                style.modalEstadisticasDetalleRow,
                isTotal && style.modalEstadisticasDetalleRowTotal
            ]}
        >
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasRemisionCell, isTotal && style.modalEstadisticasTotalText]}>
                {item.remision}
            </Text>
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasPedidoCell, isTotal && style.modalEstadisticasTotalText]}>
                {item.pedido || ''}
            </Text>
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasCodtCell, isTotal && style.modalEstadisticasTotalText]}>
                {item.codt}
            </Text>
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasKilosCell, isTotal && style.modalEstadisticasTotalText]}>
                {formatKilos(item.total_kilos)}
            </Text>
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasContadoCell, isTotal && style.modalEstadisticasTotalText]}>
                {item.vlr_contado ? formatCurrency(item.vlr_contado, 0) : '-'}
            </Text>
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasCreditoCell, isTotal && style.modalEstadisticasTotalText]}>
                {item.vlr_credito ? formatCurrency(item.vlr_credito, 0) : '-'}
            </Text>
            <Text style={[style.modalEstadisticasDetalleCell, style.modalEstadisticasValorCell, isTotal && style.modalEstadisticasTotalText]}>
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
            <View style={style.modalEstadisticasOverlay}>
                <View style={style.modalEstadisticasContainer}>
                    {/* Header */}
                    <View style={style.modalEstadisticasHeader}>
                        <Text style={style.modalEstadisticasTitle}>📊 Estadísticas de Entregas</Text>
                        <TouchableOpacity onPress={onClose} style={style.modalEstadisticasCloseButton}>
                            <FontAwesome name="times" style={style.modalEstadisticasCloseIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Filtros de Periodo */}
                    <View style={style.modalEstadisticasFiltrosContainer}>
                        {(['dia', 'semana', 'mes', 'año'] as const).map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    style.modalEstadisticasFiltroButton,
                                    periodo === p && style.modalEstadisticasFiltroButtonActive
                                ]}
                                onPress={() => setPeriodo(p)}
                            >
                                <Text style={[
                                    style.modalEstadisticasFiltroText,
                                    periodo === p && style.modalEstadisticasFiltroTextActive
                                ]}>
                                    {p === 'dia' ? 'Hoy' : p === 'semana' ? 'Semana' : p === 'mes' ? 'Mes' : 'Año'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Periodo seleccionado */}
                    <Text style={style.modalEstadisticasPeriodoLabel}>{getPeriodoLabel()}</Text>

                    {/* Tabla de estadísticas */}
                    {loading ? (
                        <View style={style.modalEstadisticasLoadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={style.modalEstadisticasLoadingText}>Cargando estadísticas...</Text>
                        </View>
                    ) : tipoVista === 'listado_pedidos' ? (
                        /* Vista de Tabla de Pedidos para Conductores */
                        <View style={style.modalEstadisticasTableWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            >
                                <ScrollView
                                    showsVerticalScrollIndicator={true}
                                    nestedScrollEnabled={true}
                                    style={{ maxHeight: 400 }}
                                >
                                    {detallePedidos.length > 0 ? (
                                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                                            {/* Header de la tabla */}
                                            <View style={{
                                                flexDirection: 'row',
                                                backgroundColor: '#007bff',
                                                padding: 10,
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8
                                            }}>
                                                <Text style={{ width: 65, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Remision</Text>
                                                <Text style={{ width: 55, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Pedido</Text>
                                                <Text style={{ width: 50, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Codt</Text>
                                                <Text style={{ width: 70, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Total Kilos</Text>
                                                <Text style={{ width: 85, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Vlr Contado</Text>
                                                <Text style={{ width: 85, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Vlr Crédito</Text>
                                                <Text style={{ width: 90, fontSize: 9, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Valor Total</Text>
                                            </View>

                                            {/* Filas de datos */}
                                            {detallePedidos.map((pedido: any, index: number) => (
                                                <View
                                                    key={`total-row-${index}`}
                                                    style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                                        padding: 8,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: '#e0e0e0'
                                                    }}
                                                >
                                                    <Text style={{ width: 65, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {pedido.remision || ''}
                                                    </Text>
                                                    <Text style={{ width: 55, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {pedido._id}
                                                    </Text>
                                                    <Text style={{ width: 50, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {pedido.codt || ''}
                                                    </Text>
                                                    <Text style={{ width: 70, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {parseFloat(pedido.kilos || '0').toFixed(1)}
                                                    </Text>
                                                    <Text style={{ width: 85, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {pedido.vlr_contado ? formatCurrency(parseFloat(pedido.vlr_contado), 0) : ''}
                                                    </Text>
                                                    <Text style={{ width: 85, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {pedido.vlr_credito ? formatCurrency(parseFloat(pedido.vlr_credito), 0) : ''}
                                                    </Text>
                                                    <Text style={{ width: 90, fontSize: 8, color: '#333', textAlign: 'center' }}>
                                                        {formatCurrency(parseFloat(pedido.valor_total || '0'), 0)}
                                                    </Text>
                                                </View>
                                            ))}

                                            {/* Fila de totales */}
                                            <View style={{
                                                flexDirection: 'row',
                                                backgroundColor: '#007bff',
                                                padding: 10,
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8
                                            }}>
                                                <Text style={{ width: 65, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}></Text>
                                                <Text style={{ width: 55, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}></Text>
                                                <Text style={{ width: 50, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}></Text>
                                                <Text style={{ width: 70, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                    {detallePedidos.reduce((sum, p: any) => sum + parseFloat(p.kilos || '0'), 0).toFixed(1)}
                                                </Text>
                                                <Text style={{ width: 85, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                    {formatCurrency(
                                                        detallePedidos.reduce((sum, p: any) => sum + parseFloat(p.vlr_contado || '0'), 0),
                                                        0
                                                    )}
                                                </Text>
                                                <Text style={{ width: 85, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                    {formatCurrency(
                                                        detallePedidos.reduce((sum, p: any) => sum + parseFloat(p.vlr_credito || '0'), 0),
                                                        0
                                                    )}
                                                </Text>
                                                <Text style={{ width: 90, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                    {formatCurrency(
                                                        detallePedidos.reduce((sum, p: any) => sum + parseFloat(p.valor_total || '0'), 0),
                                                        0
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={style.modalEstadisticasEmptyContainer}>
                                            <FontAwesome name="inbox" style={style.modalEstadisticasEmptyIcon} />
                                            <Text style={style.modalEstadisticasEmptyText}>
                                                No hay pedidos entregados hoy
                                            </Text>
                                        </View>
                                    )}
                                </ScrollView>
                            </ScrollView>
                        </View>
                    ) : (tipoVista === 'detalle' || tipoVista === 'por_dia') ? (
                        /* Vista por Día para conductores y períodos largos */
                        <View style={style.modalEstadisticasTableWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            >
                                <View>
                                    <View style={style.modalEstadisticasPorDiaHeaderRow}>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasFechaCell]}>Fecha Entrega</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasCantidadCell]}>Pedidos</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasKilosCell]}>Total Kilos</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasContadoCell]}>Vlr Contado</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasCreditoCell]}>Vlr Crédito</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasValorCell]}>Valor Total</Text>
                                    </View>

                                    {/* Datos */}
                                    {estadisticas.length > 0 ? (
                                        <ScrollView
                                            style={style.modalEstadisticasPorDiaScrollContainer}
                                            showsVerticalScrollIndicator={true}
                                            nestedScrollEnabled={true}
                                        >
                                            {estadisticas.map((item, index) =>
                                                renderEstadisticaPorDiaRow(item, index)
                                            )}
                                        </ScrollView>
                                    ) : (
                                        <View style={style.modalEstadisticasEmptyContainer}>
                                            <FontAwesome name="inbox" style={style.modalEstadisticasEmptyIcon} />
                                            <Text style={style.modalEstadisticasEmptyText}>
                                                No hay entregas registradas en este periodo
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    ) : (
                        /* Vista de Resumen por placa */
                        <View style={style.modalEstadisticasTableWrapper}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                nestedScrollEnabled={true}
                                style={{ maxHeight: 400 }}
                            >
                                <View>
                                    {/* Headers */}
                                    <View style={{ flexDirection: 'row', backgroundColor: '#007bff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                        <View style={{ width: 90, paddingVertical: 12, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                Placa
                                            </Text>
                                        </View>
                                        <View style={{ width: 180, paddingVertical: 8, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                Crédito
                                            </Text>
                                        </View>
                                        <View style={{ width: 180, paddingVertical: 8, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                Contado
                                            </Text>
                                        </View>
                                        <View style={{ width: 180, paddingVertical: 8, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                Total
                                            </Text>
                                        </View>
                                        <View style={{ width: 60, paddingVertical: 12, paddingHorizontal: 8 }}>
                                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                Cant Ped
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Subheaders */}
                                    <View style={{ flexDirection: 'row', backgroundColor: '#0056b3' }}>
                                        <View style={{ width: 90, paddingVertical: 6, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <Text style={{ fontSize: 10, color: 'white', textAlign: 'center' }}></Text>
                                        </View>
                                        <View style={{ width: 180, paddingVertical: 6, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', flex: 1 }}>Kg</Text>
                                                <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', flex: 1 }}>Valor</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: 180, paddingVertical: 6, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', flex: 1 }}>Kg</Text>
                                                <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', flex: 1 }}>Valor</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: 180, paddingVertical: 6, paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.3)' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', flex: 1 }}>Kg</Text>
                                                <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', flex: 1 }}>Valor</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: 60, paddingVertical: 6, paddingHorizontal: 8 }}>
                                            <Text style={{ fontSize: 10, color: 'white', textAlign: 'center' }}></Text>
                                        </View>
                                    </View>

                                    {/* Datos */}
                                    {estadisticas.length > 0 ? (
                                        <ScrollView
                                            style={{ maxHeight: 300 }}
                                            showsVerticalScrollIndicator={true}
                                            nestedScrollEnabled={true}
                                        >
                                            {estadisticas.map((item, index) => {
                                                // Debug log para cada item
                                                console.log(`🔍 ModalEstadisticas - Item ${index}:`, {
                                                    placa: item.placa,
                                                    total_kilos_credito: item.total_kilos_credito,
                                                    total_valor_credito: item.total_valor_credito,
                                                    total_kilos_contado: item.total_kilos_contado,
                                                    total_valor_contado: item.total_valor_contado,
                                                    total_kilos: item.total_kilos,
                                                    total_valor: item.total_valor,
                                                    cantidad_pedidos: item.cantidad_pedidos
                                                });

                                                return (
                                                    <View
                                                        key={`row-${index}`}
                                                        style={{
                                                            flexDirection: 'row',
                                                            backgroundColor: item.placa === 'TOTAL' ? '#f8f9fa' : (index % 2 === 0 ? 'white' : '#f8f9fa'),
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: '#e0e0e0',
                                                            borderTopWidth: item.placa === 'TOTAL' ? 2 : 0,
                                                            borderTopColor: '#007bff'
                                                        }}
                                                    >
                                                        {/* Placa */}
                                                        <View style={{
                                                            width: 90,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 8,
                                                            borderRightWidth: 2,
                                                            borderRightColor: '#e0e0e0',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 12,
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : '600',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                textAlign: 'center'
                                                            }}>
                                                                {item.placa || 'N/A'}
                                                            </Text>
                                                        </View>

                                                        {/* Crédito */}
                                                        <View style={{
                                                            width: 180,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 4,
                                                            borderRightWidth: 1,
                                                            borderRightColor: '#e0e0e0',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {formatKilos(item.total_kilos_credito)} Kg
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {formatCurrency(item.total_valor_credito || 0, 0)}
                                                            </Text>
                                                        </View>

                                                        {/* Contado */}
                                                        <View style={{
                                                            width: 180,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 4,
                                                            borderRightWidth: 1,
                                                            borderRightColor: '#e0e0e0',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {formatKilos(item.total_kilos_contado)} Kg
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {formatCurrency(item.total_valor_contado || 0, 0)}
                                                            </Text>
                                                        </View>

                                                        {/* Total */}
                                                        <View style={{
                                                            width: 180,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 4,
                                                            borderRightWidth: 1,
                                                            borderRightColor: '#e0e0e0',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {formatKilos(item.total_kilos)} Kg
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {formatCurrency(item.total_valor || 0, 0)}
                                                            </Text>
                                                        </View>

                                                        {/* Cantidad Pedidos */}
                                                        <View style={{
                                                            width: 60,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 8,
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 12,
                                                                textAlign: 'center',
                                                                color: item.placa === 'TOTAL' ? '#007bff' : '#333',
                                                                fontWeight: item.placa === 'TOTAL' ? 'bold' : 'normal'
                                                            }}>
                                                                {item.cantidad_pedidos || 0}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                );
                                            })}

                                            {/* Fila de Total General */}
                                            {estadisticas.length > 0 && (() => {
                                                const totalKilosCredito = estadisticas.reduce((sum, item) => sum + (parseFloat(item.total_kilos_credito?.toString() || '0') || 0), 0);
                                                const totalKilosContado = estadisticas.reduce((sum, item) => sum + (parseFloat(item.total_kilos_contado?.toString() || '0') || 0), 0);
                                                const totalKilosGeneral = estadisticas.reduce((sum, item) => sum + (parseFloat(item.total_kilos?.toString() || '0') || 0), 0);
                                                const totalValorCredito = estadisticas.reduce((sum, item) => sum + (item.total_valor_credito || 0), 0);
                                                const totalValorContado = estadisticas.reduce((sum, item) => sum + (item.total_valor_contado || 0), 0);
                                                const totalValorGeneral = estadisticas.reduce((sum, item) => sum + (item.total_valor || 0), 0);
                                                const totalPedidos = estadisticas.reduce((sum, item) => sum + (item.cantidad_pedidos || 0), 0);

                                                return (
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            backgroundColor: '#007bff',
                                                            borderBottomLeftRadius: 8,
                                                            borderBottomRightRadius: 8,
                                                            paddingVertical: 12,
                                                            borderTopWidth: 2,
                                                            borderTopColor: '#0056b3'
                                                        }}
                                                    >
                                                        {/* Placa Total */}
                                                        <View style={{
                                                            width: 90,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 8,
                                                            borderRightWidth: 2,
                                                            borderRightColor: 'rgba(255,255,255,0.3)',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 12,
                                                                fontWeight: 'bold',
                                                                color: 'white',
                                                                textAlign: 'center'
                                                            }}>
                                                                TOTAL
                                                            </Text>
                                                        </View>

                                                        {/* Crédito Total */}
                                                        <View style={{
                                                            width: 180,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 4,
                                                            borderRightWidth: 1,
                                                            borderRightColor: 'rgba(255,255,255,0.3)',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {totalKilosCredito.toFixed(1).replace('.', ',')} Kg
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {formatCurrency(totalValorCredito, 0)}
                                                            </Text>
                                                        </View>

                                                        {/* Contado Total */}
                                                        <View style={{
                                                            width: 180,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 4,
                                                            borderRightWidth: 1,
                                                            borderRightColor: 'rgba(255,255,255,0.3)',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {totalKilosContado.toFixed(1).replace('.', ',')} Kg
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {formatCurrency(totalValorContado, 0)}
                                                            </Text>
                                                        </View>

                                                        {/* Total General */}
                                                        <View style={{
                                                            width: 180,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 4,
                                                            borderRightWidth: 1,
                                                            borderRightColor: 'rgba(255,255,255,0.3)',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {totalKilosGeneral.toFixed(1).replace('.', ',')} Kg
                                                            </Text>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {formatCurrency(totalValorGeneral, 0)}
                                                            </Text>
                                                        </View>

                                                        {/* Cantidad Pedidos Total */}
                                                        <View style={{
                                                            width: 60,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 8,
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 12,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {totalPedidos}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                );
                                            })()}
                                        </ScrollView>
                                    ) : (
                                        <View style={style.modalEstadisticasEmptyContainer}>
                                            <FontAwesome name="inbox" style={style.modalEstadisticasEmptyIcon} />
                                            <Text style={style.modalEstadisticasEmptyText}>
                                                No hay entregas registradas en este periodo
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </View>
        </Modal >
    );
};

export default ModalEstadisticas;
