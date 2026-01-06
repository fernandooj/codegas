// Types for Planillas component

import { NavigationProp } from '@react-navigation/native';

// Gasto interface
export interface Gasto {
    concepto: string;
    valor: number;
}

// Planilla interface
export interface Planilla {
    _id: string;
    creado: string;
    // Campos de la primera imagen (Formulario principal)
    ruta?: string;
    guia?: string;
    no_planilla?: number;
    placa_vehiculo?: string;
    fecha?: string;
    kilometraje_inicial?: number;
    kilometraje_final?: number;
    remision_inicial?: string;
    remision_final?: string;
    // Campos de la segunda imagen (Inventario)
    inventario_inicial_porcentaje?: number;
    inventario_final_porcentaje?: number;
    inventario_inicial_kl?: number;
    inventario_final_kl?: number;
    novedades?: string;
    // Campos adicionales
    gastos: Gasto[];
    user_id: number;
    // Información del usuario
    usuario_nombre?: string;
    usuario_email?: string;
}

// Pedido interface for conductor deliveries
export interface PedidoConductor {
    pedido_id: string;
    remision?: string;
    valor_total?: string | number;
    fechaEntregado?: string;
    razon_social?: string;
    cliente_nombre?: string;
}

// State interfaces
export interface PlanillaState {
    planillas: Planilla[];
    pedidos: PedidoConductor[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    showCreateModal: boolean;
    showEditModal: boolean;
    editingPlanilla: Planilla | null;
    selectedPlanilla: Planilla | null;
    showGastosModal: boolean;
    editingGastos: Gasto[];
    showZonasModal: boolean;
}

// Navigation interfaces
export interface PlanillaNavigationParams {
    planillaId?: string;
    scrollPosition?: number;
}

export interface PlanillaProps {
    navigation: NavigationProp<any>;
    route?: {
        params?: PlanillaNavigationParams;
    };
}

// Context interfaces
export interface DataContextType {
    userId: string;
    acceso?: string;
    nombre?: string;
    email?: string;
}

// API interfaces
export interface PlanillaApiResponse {
    status: boolean;
    planillas?: Planilla[];
    planilla?: Planilla;
    message?: string;
}

export interface PlanillaApiError {
    status: false;
    error: string;
    message: string;
}

export interface PedidosConductorApiResponse {
    status: boolean;
    pedidos: PedidoConductor[];
    message?: string;
}

// Form interfaces
export interface PlanillaFormData {
    ruta?: string;
    guia?: string;
    no_planilla?: number;
    placa_vehiculo?: string;
    fecha?: string;
    kilometraje_inicial?: number;
    kilometraje_final?: number;
    remision_inicial?: string;
    remision_final?: string;
    inventario_inicial_porcentaje?: number;
    inventario_final_porcentaje?: number;
    inventario_inicial_kl?: number;
    inventario_final_kl?: number;
    novedades?: string;
    gastos: Gasto[];
    user_id: number;
}

// Gasto form interface
export interface GastoFormData {
    concepto: string;
    valor: number;
}

// Constants
export const PLANILLA_CONSTANTS = {
    ACCESO_ADMIN: 'admin' as const,
    ACCESO_CONDUCTOR: 'conductor' as const,
    DEFAULT_GASTOS: [] as Gasto[],
} as const;

// Type guards
export const isPlanilla = (obj: any): obj is Planilla => {
    return obj && typeof obj._id === 'string';
};

export const isGasto = (obj: any): obj is Gasto => {
    return obj && typeof obj.concepto === 'string' && typeof obj.valor === 'number';
};

export const isPlanillaApiResponse = (obj: any): obj is PlanillaApiResponse => {
    return obj && typeof obj.status === 'boolean';
};

// Utility types
export type PlanillaAccessLevel = 'admin' | 'conductor';
export type PlanillaSortOrder = 'asc' | 'desc';

