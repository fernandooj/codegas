import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'
import { View, Text, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { BarChart, PieChart } from "react-native-chart-kit"
import { connect } from "react-redux"
import Footer from '../components/footer'
import { DataContext } from "../../context/context"
import { getPedidosChart } from '../../redux/actions/pedidoActions'
import { style } from './style'
import { ChartData, GroupedData, ChartProps, ChartState, PedidoData, GroupFunction } from './chart.types'

// Error Boundary Component
class ChartErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('📊 Chart - Error Boundary capturó un error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={style.errorContainer}>
                    <Text style={style.errorIcon}>💥</Text>
                    <Text style={style.errorTitle}>Error crítico en el gráfico</Text>
                    <Text style={style.errorMessage}>
                        La aplicación encontró un error inesperado al mostrar el gráfico.
                        Por favor, intenta nuevamente.
                    </Text>
                </View>
            );
        }

        return this.props.children;
    }
}

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

const Chart: React.FC<ChartProps> = ({ navigation, route, pedidos, getPedidosChart }) => {
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
        valores: [],
        pedidos: [],
        loading: true,
        error: null,
    });

    // Load chart data on component mount
    useEffect(() => {
        const loadChartData = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }));

                console.log('📊 Chart - Parámetros de navegación (route.params):', route?.params);
                console.log('📊 Chart - userId del contexto:', userId);
                console.log('📊 Chart - acceso:', acceso);

                const targetUserId = acceso === "cliente"
                    ? userId
                    : route?.params?.idUsuario || userId;

                console.log('📊 Chart - targetUserId calculado:', targetUserId);

                if (targetUserId) {
                    console.log('📊 Chart - Llamando getPedidosChart con:', targetUserId);
                    getPedidosChart(targetUserId);
                } else {
                    console.log('❌ Chart - No se pudo determinar el usuario');
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
    }, [acceso, userId, route?.params?.idUsuario, getPedidosChart]);

    // Process pedidos data when it changes
    useEffect(() => {
        console.log('📊 Chart - Datos recibidos desde SQL:', pedidos);
        console.log('📊 Chart - Cantidad de registros:', pedidos?.length || 0);

        if (pedidos && pedidos.length > 0) {
            try {
                console.log('📊 Chart - Iniciando procesamiento de datos agrupados...');

                // Los datos ya vienen agrupados desde SQL con formato { mes: 'YYYY-MM', total_kilos: number, total_valor: number, total_kilos_general: number, total_valor_general: number }
                const chartData = pedidos
                    .filter((item: any) => {
                        return item &&
                            item.mes &&
                            item.mes !== null &&
                            item.mes !== '' &&
                            item.total_kilos !== null &&
                            item.total_kilos !== undefined &&
                            item.total_valor !== null &&
                            item.total_valor !== undefined;
                    })
                    .map((item: any) => ({
                        mes: String(item.mes), // Asegurar que sea string
                        total_kilos: Number(item.total_kilos) || 0,
                        total_valor: Number(item.total_valor) || 0,
                        total_kilos_general: Number(item.total_kilos_general) || 0,
                        total_valor_general: Number(item.total_valor_general) || 0
                    }));

                console.log('📊 Chart - Datos filtrados:', chartData.length);

                if (chartData.length === 0) {
                    console.log('📊 Chart - No hay datos válidos después del filtrado');
                    setState(prev => ({
                        ...prev,
                        fechas: [],
                        total: [],
                        pedidos: [],
                        loading: false,
                        error: null
                    }));
                    return;
                }

                // Ordenar por mes (cronológicamente)
                chartData.sort((a, b) => a.mes.localeCompare(b.mes));

                const fechas = chartData.map(item => item.mes);
                const total = chartData.map(item => item.total_kilos);
                const valores = chartData.map(item => item.total_valor);
                const totalKilosGeneral = chartData.length > 0 ? chartData[0].total_kilos_general : 0;
                const totalValorGeneral = chartData.length > 0 ? chartData[0].total_valor_general : 0;

                console.log('📊 Chart - Fechas procesadas:', fechas);
                console.log('📊 Chart - Totales procesados:', total);

                // Validación final de los datos
                if (fechas.length !== total.length) {
                    console.error('📊 Chart - Error: fechas y totales no coinciden');
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        error: "Error en el procesamiento de datos"
                    }));
                    return;
                }

                setState(prev => ({
                    ...prev,
                    fechas,
                    total,
                    valores, // Agregamos los valores totales
                    pedidos: chartData, // Guardamos los datos procesados
                    totalKilosGeneral, // Total general de kilos desde backend
                    totalValorGeneral, // Total general de valores desde backend
                    loading: false,
                    error: null
                }));

                console.log('📊 Chart - Estado actualizado exitosamente con datos de SQL');
            } catch (error) {
                console.error('📊 Chart - Error processing chart data:', error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Error al procesar los datos del gráfico"
                }));
            }
        } else if (pedidos && pedidos.length === 0) {
            console.log('📊 Chart - No hay datos (array vacío)');
            setState(prev => ({
                ...prev,
                fechas: [],
                total: [],
                pedidos: [],
                loading: false,
                error: null
            }));
        } else {
            console.log('📊 Chart - pedidos es null o undefined');
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
        formatTopBarValue: (value: number) => `${formatNumber(value)} kg`,
        propsForLabels: {
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#ffffff'
        }
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

    // Render pie chart for values
    const renderPieChart = () => {
        const { valores, fechas } = state;

        if (valores.length === 0 || fechas.length === 0) {
            return null;
        }

        const pieData = fechas.map((fecha, index) => {
            const value = valores[index];
            const [year, month] = fecha.split('-');
            const monthNames = [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ];
            const monthIndex = parseInt(month) - 1;
            const monthName = monthIndex >= 0 && monthIndex <= 11 ? monthNames[monthIndex] : month;

            return {
                name: `${monthName} ${year.slice(2)}\n$${formatNumber(value)}`,
                population: value, // Mantener el valor real para las proporciones
                color: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                legendFontColor: '#7F7F7F',
                legendFontSize: 11,
            };
        });

        const totalValores = state.totalValorGeneral || valores.reduce((sum, val) => sum + val, 0);

        return (
            <View style={style.pieChartContainer}>
                <Text style={style.pieChartTitle}>
                    Distribución de Valores por Mes
                </Text>
                <Text style={style.pieChartTotal}>
                    Total Valor: ${formatNumber(totalValores)}
                </Text>
                <PieChart
                    data={pieData}
                    width={screenData.width - 20}
                    height={250}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="5"
                    absolute={false}
                />
            </View>
        );
    };

    // Render simple chart as fallback
    const renderSimpleChart = () => {
        const { total, fechas } = state;
        const maxValue = total.length > 0 ? Math.max(...total) : 0;

        return (
            <ScrollView style={style.chartContainer}>
                <View style={style.simpleChartContainer}>
                    <Text style={style.simpleChartTitle}>Resumen de Pedidos por Mes (Últimos 6 meses)</Text>
                    {fechas.map((fecha, index) => {
                        const value = total[index];
                        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                        return (
                            <View key={fecha} style={style.simpleChartItem}>
                                <View style={style.simpleChartLabelContainer}>
                                    <Text style={style.simpleChartLabel}>
                                        {fecha.split('-')[1]}/{fecha.split('-')[0]}
                                    </Text>
                                    <Text style={style.simpleChartValue}>
                                        {formatNumber(value)} kg
                                    </Text>
                                </View>
                                <View style={style.simpleChartBarContainer}>
                                    <View
                                        style={[
                                            style.simpleChartBar,
                                            { width: `${percentage}%` }
                                        ]}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        );
    };

    // Render chart
    const renderChart = () => {
        const { total, fechas } = state;

        if (fechas.length === 0 || total.length === 0) {
            return renderEmpty();
        }

        // Validaciones adicionales para prevenir crashes
        if (!Array.isArray(fechas) || !Array.isArray(total)) {
            console.error('📊 Chart - Datos no son arrays válidos:', { fechas, total });
            return renderError();
        }

        if (fechas.length !== total.length) {
            console.error('📊 Chart - Arrays de fechas y totales no coinciden:', {
                fechasLength: fechas.length,
                totalLength: total.length
            });
            return renderError();
        }

        // Los datos ya vienen limitados a 6 meses desde SQL
        console.log('📊 Chart - Renderizando gráfico con datos de SQL (últimos 6 meses):', {
            fechasLength: fechas.length,
            fechas,
            total
        });

        try {
            // Intentar usar el gráfico avanzado primero
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
                                try {
                                    const [year, month] = date.split('-');
                                    if (!year || !month) {
                                        console.warn('📊 Chart - Fecha inválida:', date);
                                        return date;
                                    }
                                    const monthNames = [
                                        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
                                    ];
                                    const monthIndex = parseInt(month) - 1;
                                    if (monthIndex < 0 || monthIndex > 11) {
                                        console.warn('📊 Chart - Mes inválido:', month);
                                        return date;
                                    }
                                    return `${monthNames[monthIndex]} ${year.slice(2)}`;
                                } catch (error) {
                                    console.error('📊 Chart - Error procesando fecha:', date, error);
                                    return date;
                                }
                            }),
                            datasets: [
                                {
                                    data: total.map(value => {
                                        const numValue = Number(value);
                                        return isNaN(numValue) ? 0 : numValue;
                                    })
                                }
                            ]
                        }}
                        width={Math.max(screenData.width, fechas.length * 35)}
                        height={Math.min(screenData.height * 0.5, 300)}
                        yAxisLabel=""
                        yAxisSuffix=""
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
        } catch (error) {
            console.error('📊 Chart - Error renderizando BarChart, usando fallback:', error);
            // Usar el gráfico simple como fallback
            return renderSimpleChart();
        }
    };

    // Main render
    return (
        <View style={style.container}>
            <ScrollView style={style.scrollContainer} showsVerticalScrollIndicator={true}>
                <View style={style.header}>
                    <Text style={style.title}>📈 Gráfico de Kilos por Mes</Text>
                    <Text style={style.subtitle}>
                        Últimos 6 meses • {state.fechas.length} períodos • {state.pedidos.length} pedidos
                    </Text>
                    {state.totalKilosGeneral && state.totalKilosGeneral > 0 && (
                        <Text style={style.totalTitle}>
                            Total Kilos: {formatNumber(state.totalKilosGeneral)} kg
                        </Text>
                    )}
                </View>

                <View style={style.content}>
                    {state.loading && renderLoading()}
                    {state.error && !state.loading && renderError()}
                    {!state.loading && !state.error && state.pedidos.length === 0 && renderEmpty()}
                    {!state.loading && !state.error && state.pedidos.length > 0 && (
                        <>
                            {renderChart()}
                            {renderPieChart()}
                        </>
                    )}
                </View>
            </ScrollView>

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

const ConnectedChart = connect(
    mapStateToProps,
    mapDispatchToProps
)(Chart);

// Exportar el componente envuelto en Error Boundary
const ChartWithErrorBoundary: React.FC<ChartProps> = (props) => (
    <ChartErrorBoundary>
        <ConnectedChart {...props} />
    </ChartErrorBoundary>
);

export default ChartWithErrorBoundary;
