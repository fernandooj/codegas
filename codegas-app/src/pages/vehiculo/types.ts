// Types for Vehiculo component
import { NavigationProp } from '@react-navigation/native';

// Base interfaces
export interface Vehiculo {
    _id: string;
    placa: string;
    centro: string;
    bodega: string;
    capacidad?: number;
    conductor?: Conductor;
    fechaCreacion?: string;
    activo?: boolean;
}

export interface Conductor {
    _id: string;
    nombre: string;
    avatar?: string;
    email?: string;
    celular?: string;
}

export interface Usuario {
    _id: string;
    nombre: string;
    avatar?: string;
    email?: string;
    celular?: string;
    acceso?: string;
}

// State interfaces
export interface VehiculoState {
    placa: string;
    centro: string;
    bodega: string;
    capacidad: string;
    modalConductor: boolean;
    modalEditar: boolean;
    modalCrear: boolean;
    conductores: Usuario[];
    conductor: string;
    placaVehiculo: string;
    idVehiculo: string;
    placaEditar: string;
    centroEditar: string;
    bodegaEditar: string;
    capacidadEditar: string;
    activoEditar: boolean;
    idUsuario: string;
    acceso: string;
    sortBy: VehiculoSortField;
    sortOrder: VehiculoSortOrder;
}

// Navigation interfaces
export interface VehiculoNavigationParams {
    idVehiculo?: string;
    scrollPosition?: number;
}

export interface VehiculoProps {
    navigation: NavigationProp<any>;
    route?: {
        params?: VehiculoNavigationParams;
    };
}

// Redux interfaces
export interface RootState {
    vehiculo: {
        vehiculos: Vehiculo[];
    };
    usuario: {
        usuariosAcceso: Usuario[];
        usuarios: Usuario[];
        usuario: Usuario | null;
        perfil: Usuario | null;
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
export interface VehiculoApiResponse {
    status: boolean;
    data?: Vehiculo;
    message?: string;
}

export interface VehiculoApiError {
    status: false;
    error: string;
    message: string;
}

// Form interfaces
export interface VehiculoFormData {
    placa: string;
    centro: string;
    bodega: string;
    capacidad: number;
}

export interface EditarVehiculoFormData {
    placa: string;
    centro: string;
    bodega: string;
    capacidad: number;
    activo: boolean;
}

// Action types for Redux
export interface GetVehiculosAction {
    type: string;
    payload: Vehiculo[];
}

export interface GetUsuariosAccesoAction {
    type: string;
    payload: Usuario[];
}

// Component render props
export interface VehiculoRenderProps {
    vehiculo: Vehiculo;
    key: number;
    onDesvincularConductor: (nombre: string, idVehiculo: string, placa: string) => void;
    onAsignarConductor: (placa: string, conductor: Conductor | null, idVehiculo: string) => void;
    onEditarVehiculo: (idVehiculo: string, placa: string, centro: string, bodega: string) => void;
    onEliminarVehiculo: (placa: string, idVehiculo: string) => void;
    acceso: string;
}

export interface ConductorRenderProps {
    conductor: Usuario;
    key: string;
    isSelected: boolean;
    onSelect: (conductor: Usuario) => void;
    onDeselect: (conductor: Usuario) => void;
}

// Modal interfaces
export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export interface ConductorModalProps extends ModalProps {
    conductores: Usuario[];
    selectedConductor: string;
    onSelectConductor: (conductor: Usuario) => void;
    onDeselectConductor: (conductor: Usuario) => void;
    onConfirm: () => void;
    placaVehiculo: string;
}

export interface EditarModalProps extends ModalProps {
    placaEditar: string;
    centroEditar: string;
    bodegaEditar: string;
    capacidadEditar: string;
    activoEditar: boolean;
    onPlacaChange: (placa: string) => void;
    onCentroChange: (centro: string) => void;
    onBodegaChange: (bodega: string) => void;
    onCapacidadChange: (capacidad: string) => void;
    onActivoChange: (activo: boolean) => void;
    onSave: () => void;
}

// Validation interfaces
export interface VehiculoValidation {
    isValidPlaca: (placa: string) => boolean;
    isValidCentro: (centro: string) => boolean;
    isValidBodega: (bodega: string) => boolean;
}

// Event handler interfaces
export interface VehiculoEventHandlers {
    onCreateVehiculo: () => void;
    onEditVehiculo: (idVehiculo: string) => void;
    onDeleteVehiculo: (idVehiculo: string) => void;
    onAsignarConductor: (idVehiculo: string, idConductor: string) => void;
    onDesvincularConductor: (idVehiculo: string) => void;
    onSortChange: (field: VehiculoSortField, order: VehiculoSortOrder) => void;
}

// Constants
export const VEHICULO_CONSTANTS = {
    MIN_PLACA_LENGTH: 5,
    CONDUCTOR_ACCESO: 'conductor' as const,
    DEFAULT_LIMIT: 100,
    DEFAULT_START: 0,
} as const;

// Type guards
export const isVehiculo = (obj: any): obj is Vehiculo => {
    return obj && typeof obj._id === 'string' && typeof obj.placa === 'string';
};

export const isConductor = (obj: any): obj is Conductor => {
    return obj && typeof obj._id === 'string' && typeof obj.nombre === 'string';
};

export const isUsuario = (obj: any): obj is Usuario => {
    return obj && typeof obj._id === 'string' && typeof obj.nombre === 'string';
};

export const isVehiculoApiResponse = (obj: any): obj is VehiculoApiResponse => {
    return obj && typeof obj.status === 'boolean';
};

// Utility types
export type VehiculoStatus = 'active' | 'inactive';
export type VehiculoAccessLevel = 'admin' | 'conductor' | 'user';
export type VehiculoSortOrder = 'asc' | 'desc';
export type VehiculoSortField = 'placa' | 'fechaCreacion' | 'centro' | 'bodega' | 'conductor';

// Hook return types
export interface UseVehiculoStateReturn {
    state: VehiculoState;
    updateState: (updates: Partial<VehiculoState>) => void;
    resetForm: () => void;
    resetEditForm: () => void;
}

export interface UseVehiculoActionsReturn {
    crearVehiculo: () => void;
    editarVehiculo: () => void;
    eliminarVehiculo: (placa: string, idVehiculo: string) => void;
    asignarConductor: (nombreConductor: string, idConductor: string) => void;
    desvincularConductor: (nombreConductor: string, idVehiculo: string, placaVehiculo?: string) => void;
    handleSort: (field: VehiculoSortField) => void;
}

export interface UseVehiculoModalsReturn {
    openConductorModal: (placaVehiculo: string, conductor: string, idVehiculo: string) => void;
    closeConductorModal: () => void;
    openEditModal: (idVehiculo: string, placa: string, centro: string, bodega: string) => void;
    closeEditModal: () => void;
}

// Error handling interfaces
export interface VehiculoError {
    code: string;
    message: string;
    details?: any;
}

export interface VehiculoErrorHandler {
    handleError: (error: VehiculoError) => void;
    showErrorMessage: (message: string) => void;
    showSuccessMessage: (message: string) => void;
    clearError: () => void;
}

// Performance interfaces
export interface VehiculoPerformanceMetrics {
    renderTime: number;
    apiCallTime: number;
    modalAnimationTime: number;
}

export interface VehiculoOptimization {
    memoizedComponents: boolean;
    virtualizedList: boolean;
    lazyLoading: boolean;
}

// Filter and search interfaces
export interface VehiculoFilterOptions {
    placa?: string;
    centro?: string;
    bodega?: string;
    conductor?: string;
    activo?: boolean;
}

export interface VehiculoSearchParams {
    query: string;
    filters: VehiculoFilterOptions;
    sortBy: VehiculoSortField;
    sortOrder: VehiculoSortOrder;
}

// Animation interfaces
export interface VehiculoAnimationProps {
    visible: boolean;
    duration?: number;
    easing?: string;
}

export interface ModalAnimationState {
    scale: any;
    opacity: any;
    translateY: any;
}
