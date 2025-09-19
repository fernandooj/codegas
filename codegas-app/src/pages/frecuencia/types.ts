export interface PedidoFrecuencia {
    usuarioid: string;
    nombre?: string;
    codt?: string;
    pedido_id?: string | number;
    forma?: string;
    cantidadKl?: string;
    cantidadPrecio?: string;
    frecuencia?: 'semanal' | 'quincenal' | 'mensual';
    dia1?: string;
    dia2?: string;
    activo: boolean;
    razon_social?: string;
}

export interface FrecuenciaState {
    terminoBuscador: string;
    pedidos: PedidoFrecuencia[];
    pedidosFiltrados: PedidoFrecuencia[];
    inicio: number;
    final: number;
    showSpin: boolean;
    loading: boolean;
}

export interface FrecuenciaProps {
    navigation: any;
    pedidos: PedidoFrecuencia[];
    getFrecuencia: () => void;
}

export interface SearchParams {
    cliente?: string;
    fecha?: string;
    forma?: string;
    razon_social?: string;
}
