export interface ChartData {
    date: string;
    count: number;
}

export interface GroupedData {
    date: string;
    count: number;
}

export interface ChartProps {
    navigation: any;
    route: any;
    pedidos: any[];
    getPedidosChart: (idUser: string) => void;
}

export interface ChartState {
    placa: string;
    centroEditar: string;
    bodegaEditar: string;
    modalConductor: boolean;
    modalEditar: boolean;
    conductores: any[];
    fechas: string[];
    total: number[];
    pedidos: any[];
    loading: boolean;
    error: string | null;
}

export interface PedidoData {
    fechaentrega: string;
    kilos: string;
    [key: string]: any;
}

export interface ChartConfig {
    backgroundColor: string;
    backgroundGradientFrom: string;
    backgroundGradientTo: string;
    fillShadowGradientOpacity: number;
    decimalPlaces: number;
    color: (opacity?: number) => string;
    labelColor: (opacity?: number) => string;
    style: {
        borderRadius: number;
    };
    propsForDots: {
        r: string;
        strokeWidth: string;
        stroke: string;
    };
}

export type GroupFunction = (item: ChartData) => string;
