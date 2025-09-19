// Types for Clientes component
import { NavigationProp } from '@react-navigation/native';

// Base User interface
export interface Usuario {
    _id: string;
    nombre?: string;
    email?: string;
    celular?: string;
    acceso?: string;
    activo?: boolean;
    razon_social?: string;
    valorUnitario?: string | number;
    idPadre?: string;
    padre?: UsuarioPadre;
    children?: Usuario[];
}

export interface UsuarioPadre {
    _id: string;
    nombre: string;
    email?: string;
    celular?: string;
}

// State interfaces
export interface ClienteSearchState {
    terminoBuscador: string;
    inicio: number;
    final: boolean;
    limit: number;
    showSearch: boolean;
    scrollPosition: number;
}

export interface ClienteState {
    usuarios: Usuario[];
    loading: boolean;
    error: string | null;
}

// Navigation interfaces
export interface ClienteNavigationParams {
    idUsuario?: string;
    scrollPosition?: number;
    tipoAcceso?: string;
}

export interface ClienteProps {
    navigation: NavigationProp<any>;
    route?: {
        params?: ClienteNavigationParams;
    };
}

// Redux interfaces
export interface RootState {
    usuario: ClienteState;
}

// Context interfaces
export interface DataContextType {
    userId: string;
    acceso?: string;
    nombre?: string;
    email?: string;
}

// API interfaces
export interface ClienteApiResponse {
    success: boolean;
    data: Usuario[];
    message?: string;
}

export interface ClienteApiError {
    success: false;
    error: string;
    message: string;
}

// Form interfaces
export interface ClienteFormData {
    terminoBuscador: string;
}

// Scroll event interface
export interface ScrollEvent {
    nativeEvent: {
        contentOffset: {
            y: number;
        };
        layoutMeasurement: {
            height: number;
        };
        contentSize: {
            height: number;
        };
    };
}

// Action types for Redux
export interface GetUsuariosAction {
    type: string;
    payload: Usuario[];
}

export interface SetLoadingAction {
    type: string;
    payload: boolean;
}

export interface SetErrorAction {
    type: string;
    payload: string | null;
}

// Component render props
export interface ClienteRenderProps {
    usuario: Usuario;
    key: number;
    navigateToUser: (userId: string) => void;
}

// Search and filter interfaces
export interface ClienteSearchParams {
    limit: number;
    inicio: number;
    acceso: string;
    terminoBuscador: string;
    userId: string;
}

// Validation interfaces
export interface ClienteValidation {
    isValidSearchTerm: (term: string) => boolean;
    hasMinimumLength: (term: string, minLength: number) => boolean;
}

// Style interfaces
export interface ClienteStyleProps {
    isInactive?: boolean;
    isSelected?: boolean;
    isHighlighted?: boolean;
}

// Event handler interfaces
export interface ClienteEventHandlers {
    onSearch: () => void;
    onClearSearch: () => void;
    onUserPress: (userId: string) => void;
    onScroll: (event: ScrollEvent) => void;
    onRefresh: () => void;
}

// Constants
export const CLIENTE_CONSTANTS = {
    ACCESO: 'cliente' as const,
    DEFAULT_LIMIT: 10,
    MIN_SEARCH_LENGTH: 2,
    SCROLL_THRESHOLD: 0.8,
} as const;

// Type guards
export const isUsuario = (obj: any): obj is Usuario => {
    return obj && typeof obj._id === 'string';
};

export const isUsuarioPadre = (obj: any): obj is UsuarioPadre => {
    return obj && typeof obj._id === 'string' && typeof obj.nombre === 'string';
};

export const isClienteApiResponse = (obj: any): obj is ClienteApiResponse => {
    return obj && typeof obj.success === 'boolean' && Array.isArray(obj.data);
};

export const isScrollEvent = (obj: any): obj is ScrollEvent => {
    return obj &&
        obj.nativeEvent &&
        typeof obj.nativeEvent.contentOffset === 'object' &&
        typeof obj.nativeEvent.layoutMeasurement === 'object' &&
        typeof obj.nativeEvent.contentSize === 'object';
};

// Utility types
export type ClienteStatus = 'active' | 'inactive';
export type ClienteAccessLevel = 'cliente' | 'admin' | 'veo' | 'conductor';
export type ClienteSortOrder = 'asc' | 'desc';
export type ClienteSortField = 'nombre' | 'fecha_creacion' | 'razon_social';

// Hook return types
export interface UseClienteSearchReturn {
    state: ClienteSearchState;
    updateState: (updates: Partial<ClienteSearchState>) => void;
    searchUser: (clean?: boolean) => void;
    handleSearch: () => void;
}

export interface UseClienteNavigationReturn {
    navigateToUser: (userId: string) => void;
    handleBackNavigation: () => void;
}

export interface UseClienteScrollReturn {
    onScroll: (event: ScrollEvent) => void;
    scrollToPosition: (position: number) => void;
    restoreScrollPosition: () => void;
}

// Error handling interfaces
export interface ClienteError {
    code: string;
    message: string;
    details?: any;
}

export interface ClienteErrorHandler {
    handleError: (error: ClienteError) => void;
    showErrorMessage: (message: string) => void;
    clearError: () => void;
}

// Performance interfaces
export interface ClientePerformanceMetrics {
    renderTime: number;
    searchTime: number;
    scrollPerformance: number;
}

export interface ClienteOptimization {
    memoizedComponents: boolean;
    virtualizedList: boolean;
    lazyLoading: boolean;
}
