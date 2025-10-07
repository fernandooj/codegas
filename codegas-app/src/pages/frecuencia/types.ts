export interface PedidoFrecuencia {
    id?: string;
    pedido_id: string;
    usuarioid: string;
    nombre: string;
    codt: string;
    razon_social?: string;
    forma: 'cantidad' | 'monto' | 'lleno';
    cantidadKl?: number;
    cantidadPrecio?: number;
    frecuencia: 'semanal' | 'quincenal' | 'mensual';
    dia1?: string | number;
    dia2?: string | number;
    fecha_creacion?: string;
    punto_direccion?: string;
    punto_capacidad?: string;
    puntoId?: number;
}

export interface FrecuenciaState {
    terminoBuscador: string;
    pedidos: PedidoFrecuencia[];
    pedidosFiltrados: PedidoFrecuencia[];
    inicio: number;
    final: number;
    showSpin: boolean;
    loading: boolean;
    showEditModal: boolean;
    editingFrecuencia: PedidoFrecuencia | null;
    initialLoading: boolean;
}

export interface FrecuenciaEditData {
    forma: 'cantidad' | 'monto' | 'lleno';
    cantidadKl?: number;
    cantidadPrecio?: number;
    frecuencia: 'semanal' | 'quincenal' | 'mensual';
    dia1?: string | number;
    dia2?: string | number;
}

export interface FrecuenciaResponse {
    status: boolean;
    message: string;
    data?: PedidoFrecuencia | PedidoFrecuencia[];
}

export interface EditFrecuenciaRequest {
    pedido_id: string;
    forma: 'cantidad' | 'monto' | 'lleno';
    cantidadKl?: number;
    cantidadPrecio?: number;
    frecuencia: 'semanal' | 'quincenal' | 'mensual';
    dia1?: string;
    dia2?: string;
}

export interface EditarFrecuenciaModalProps {
    visible: boolean;
    onClose: () => void;
    frecuencia: PedidoFrecuencia | null;
    onSuccess: (updatedData?: PedidoFrecuencia) => void;
}