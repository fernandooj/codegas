import React, { useState, useEffect, useRef } from 'react';
import {View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { getEstadisticas } from '../../redux/actions/pedidoActions';
import { formatCurrency } from '../../utils/number';
import { Estadistica, DetallePedido, ModalEstadisticasProps } from './types';
import { style } from './style';

const ModalEstadisticas: React.FC<ModalEstadisticasProps> = ({visible, onClose, conductorId, acceso}) => {
    const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);
    const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes' | 'año'>('dia');
    const [tipoVista, setTipoVista] = useState<'resumen' | 'detalle' | 'por_dia' | 'listado_pedidos'>('resumen');

    // Refs para sincronizar scroll
    const headerScrollRef = useRef<ScrollView>(null);
    const bodyScrollRef = useRef<ScrollView>(null);

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
                const tipoVistaRecibido = (resultado as any).tipoVista || 'resumen';
                setTipoVista(tipoVistaRecibido);
                const esListado = tipoVistaRecibido === 'listado_pedidos';
                setDetallePedidos(esListado ? resultado.estadisticas || [] : []);
                setEstadisticas(esListado ? [] : resultado.estadisticas || []);
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

     const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (headerScrollRef.current) {
        headerScrollRef.current.scrollTo({ x: offsetX, animated: false });
        }
    };

    const handleHeaderScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        if (bodyScrollRef.current) {
        bodyScrollRef.current.scrollTo({ x: offsetX, animated: false });
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
    const renderFixedHeaders = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasKilosCell]}>Total Kilos</Text>
        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasContadoCell]}>Vlr Contado</Text>
        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasCreditoCell]}>Vlr Crédito</Text>
        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasValorCell]}>Valor Total</Text>
        </View>
        );
        };

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
                    {formatCurrency(item.total_valor_credito || 0, 0)}
                </Text>
            </View>

            {/* Contado */}
            <View style={style.modalEstadisticasTablaSectionWide}>
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
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasFechaCell]}>{item.fechaentrega}</Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasCantidadCell]}>{item.cantidad_pedidos || 0}</Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasKilosCell]}>{formatKilos(item.total_kilos)}</Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasContadoCell]}>{formatCurrency(item.vlr_contado || 0, 0)}</Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasCreditoCell]}>{formatCurrency(item.vlr_credito || 0, 0)}</Text>
            <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasValorCell]}>{formatCurrency(item.valor_total || 0, 0)}</Text>
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
                                            <View style={[style.modalEstadisticasPorDiaHeaderRow]}>
                                                <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasRemisionCell]}>Remisión</Text>
                                                <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasPedidoCell]}>Pedido</Text>
                                                <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasCodtCell]}>Codt</Text>
                                                {renderFixedHeaders()}
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
                                                    <Text style={{ width: 70, fontSize: 8, color: '#333', textAlign: 'right' }}>
                                                        {parseFloat(pedido.kilos || '0').toFixed(1)}
                                                    </Text>
                                                    <Text style={{ width: 85, fontSize: 8, color: '#333', textAlign: 'right' }}>
                                                        {pedido.vlr_contado ? formatCurrency(parseFloat(pedido.vlr_contado), 0) : ''}
                                                    </Text>
                                                    <Text style={{ width: 85, fontSize: 8, color: '#333', textAlign: 'right' }}>
                                                        {pedido.vlr_credito ? formatCurrency(parseFloat(pedido.vlr_credito), 0) : ''}
                                                    </Text>
                                                    <Text style={{ width: 90, fontSize: 8, color: '#333', textAlign: 'right' }}>
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
                                                <Text style={{ width: 65, fontSize: 10, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>TOTAL</Text>
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
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasFechaCell]}>Fecha</Text>
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
                            >
                                <View>
                                    {/* Headers */}
                                    <View style={style.modalEstadisticasPorDiaHeaderRow}>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasFechaCell]}>Placa</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasCantidadCell]}>Pedidos</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasKilosCell]}>Total Kilos</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasContadoCell]}>Vlr Contado</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasCreditoCell]}>Vlr Crédito</Text>
                                        <Text style={[style.modalEstadisticasPorDiaHeaderCell, style.modalEstadisticasValorCell]}>Valor Total</Text>
                                    </View>

                                    {/* Datos */}
                                    {estadisticas.length > 0 ? (
                                        <ScrollView
                                            style={{ maxHeight: 300 }}
                                            showsVerticalScrollIndicator={true}
                                            nestedScrollEnabled={true}
                                        >
                                            {estadisticas.map((item, index) => {
                                                return (
                                                    <View
                                                        key={`row-${index}`}
                                                        style={{
                                                            paddingVertical: 6,
                                                            flexDirection: 'row',
                                                            backgroundColor: item.placa === 'TOTAL' ? '#f8f9fa' : (index % 2 === 0 ? 'white' : '#f8f9fa'),
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: '#e0e0e0',
                                                            borderTopWidth: item.placa === 'TOTAL' ? 2 : 0,
                                                            borderTopColor: '#007bff'
                                                        }}
                                                    >
                                                        {/* Placa */}
                                                        <Text style={[style.modalEstadisticasFechaCell, style.modalEstadisticasFechaCell]}>
                                                             {item.placa || 'N/A'}
                                                        </Text>
                                                        <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasCantidadCell]}>
                                                            {item.cantidad_pedidos || 0}
                                                        </Text>
                                                        <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasKilosCell]}>
                                                            {formatKilos(item.total_kilos)}
                                                        </Text>
                                                        <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasContadoCell]}>
                                                            {formatCurrency(item.total_valor_contado || 0, 0)}
                                                        </Text>
                                                        <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasCreditoCell]}>
                                                            {formatCurrency(item.total_valor_credito || 0, 0)}
                                                        </Text>
                                                        <Text style={[style.modalEstadisticasPorDiaCell, style.modalEstadisticasValorCell]}>
                                                            {formatCurrency(item.total_valor || 0, 0)}
                                                        </Text>
                                                    </View>
                                                );
                                            })}

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