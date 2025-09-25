import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import { View, Text, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { BarChart } from "react-native-chart-kit"
import { connect } from "react-redux"
import Footer from '../components/footer'
import { DataContext } from "../../context/context"
import { getPedidosChart } from '../../redux/actions/pedidoActions'
import { style } from './style'
import { ChartData, GroupedData, ChartProps, ChartState, PedidoData, GroupFunction } from './chart.types'

// Utility functions
const groupBy = (array: ChartData[], groupFn: GroupFunction): GroupedData[] => {
    const hash: { [key: string]: GroupedData } = {};
    const result: GroupedData[] = [];

    array.forEach((o) => {
        const key = groupFn(o);
        if (!hash[key]) {
            hash[key] = { date: key, count: 0 };
            result.push(hash[key]);
        }
        hash[key].count += o.count;
    });
    return result;
};

const month: GroupFunction = (o) => o.date.slice(0, 7);

const week: GroupFunction = (o) => {
    const d = new Date(o.date);
    const day = 1000 * 60 * 60 * 24;
    const offset = 4 * day;

    d.setTime(Math.floor((d.valueOf() - offset) / 7 / day) * 7 * day + offset);
    return d.toISOString().slice(0, 10);
};

const screenData = Dimensions.get('window');

// Función para formatear números con separadores de miles
const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES');
};

const Chart: React.FC<ChartProps> = ({ navigation, pedidos, getPedidosChart }) => {
    const context = useContext(DataContext) as any;
    const { acceso, userId } = context;

    const [state, setState] = useState<ChartState>({
        placa: "",
        centroEditar: "",
        bodegaEditar: "",
        modalConductor: false,
        modalEditar: false,
        conductores: [],
        fechas: [],
        total: [],
        pedidos: [],
        loading: true,
        error: null,
    });

    // Load chart data on component mount
    useEffect(() => {
        const loadChartData = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }));

                const targetUserId = acceso === "cliente"
                    ? userId
                    : navigation.state?.params?.idUsuario || userId;

                if (targetUserId) {
                    getPedidosChart(targetUserId);
                } else {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        error: "No se pudo determinar el usuario"
                    }));
                }
            } catch (error) {
                console.error('Error loading chart data:', error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Error al cargar los datos del gráfico"
                }));
            }
        };

        loadChartData();
    }, [acceso, userId, navigation.state?.params?.idUsuario, getPedidosChart]);

    // Process pedidos data when it changes
    useEffect(() => {
        if (pedidos && pedidos.length > 0) {
            try {
                const filteredPedidos = pedidos
                    .filter((e: PedidoData) => e.kilos)
                    .map((e: PedidoData) => ({
                        ...e,
                        kilos: e.kilos.replace(',', '.')
                    }));

                const chartData: ChartData[] = filteredPedidos.map((e: PedidoData) => ({
                    date: e.fechaentrega,
                    count: parseInt(e.kilos) || 0
                }));

                const groupedData = groupBy(chartData, month);
                const fechas = groupedData.map(e => e.date);
                const total = groupedData.map(e => e.count);

                setState(prev => ({
                    ...prev,
                    fechas,
                    total,
                    pedidos: filteredPedidos,
                    loading: false,
                    error: null
                }));
            } catch (error) {
                console.error('Error processing chart data:', error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Error al procesar los datos"
                }));
            }
        } else if (pedidos && pedidos.length === 0) {
            setState(prev => ({
                ...prev,
                fechas: [],
                total: [],
                pedidos: [],
                loading: false,
                error: null
            }));
        }
    }, [pedidos]);

    // Memoized chart configuration
    const chartConfig = useMemo(() => ({
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#4CAF50",
        backgroundGradientTo: "#2E7D32",
        fillShadowGradientOpacity: 0.8,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffffff"
        },
        formatYLabel: (value: string) => formatNumber(parseInt(value)),
        formatTopBarValue: (value: number) => formatNumber(value)
    }), []);

    // Render loading state
    const renderLoading = () => (
        <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={style.loadingText}>Cargando datos del gráfico...</Text>
        </View>
    );

    // Render error state
    const renderError = () => (
        <View style={style.errorContainer}>
            <Text style={style.errorIcon}>⚠️</Text>
            <Text style={style.errorTitle}>Error al cargar los datos</Text>
            <Text style={style.errorMessage}>{state.error}</Text>
        </View>
    );

    // Render empty state
    const renderEmpty = () => (
        <View style={style.emptyContainer}>
            <Text style={style.emptyIcon}>📊</Text>
            <Text style={style.emptyTitle}>No hay datos disponibles</Text>
            <Text style={style.emptyMessage}>
                Este usuario no tiene pedidos entregados en los últimos 6 meses
            </Text>
        </View>
    );

    // Render chart
    const renderChart = () => {
        const { total, fechas } = state;

        if (fechas.length === 0 || total.length === 0) {
            return renderEmpty();
        }

        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={style.chartContainer}
                contentContainerStyle={style.chartContent}
            >
                <BarChart
                    data={{
                        labels: fechas.map(date => {
                            const [year, month] = date.split('-');
                            const monthNames = [
                                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
                            ];
                            return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
                        }),
                        datasets: [
                            {
                                data: total
                            }
                        ]
                    }}
                    width={Math.max(screenData.width, fechas.length * 60)}
                    height={screenData.height * 0.5}
                    yAxisLabel=""
                    yAxisSuffix=" kg"
                    yAxisInterval={1}
                    chartConfig={chartConfig}
                    style={style.chartStyle}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    withInnerLines={false}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                />
            </ScrollView>
        );
    };

    // Main render
    return (
        <View style={style.container}>
            <View style={style.header}>
                <Text style={style.title}>📈 Gráfico de Pedidos</Text>
                <Text style={style.subtitle}>
                    Últimos 6 meses • {state.pedidos.length} pedidos
                </Text>
            </View>

            <View style={style.content}>
                {state.loading && renderLoading()}
                {state.error && !state.loading && renderError()}
                {!state.loading && !state.error && state.pedidos.length === 0 && renderEmpty()}
                {!state.loading && !state.error && state.pedidos.length > 0 && renderChart()}
            </View>

            <Footer navigation={navigation} />
        </View>
    );
};

const mapStateToProps = (state: any) => ({
    pedidos: state.pedido.pedidosChart || [],
});

const mapDispatchToProps = (dispatch: any) => ({
    getPedidosChart: (idUser: string) => {
        dispatch(getPedidosChart(idUser));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chart);
