// Tipos para el módulo de Usuarios

export interface Usuario {
    _id: number;
    uid?: string;
    created: string;
    razon_social?: string;
    cedula?: string;
    direccion_factura?: string;
    email?: string;
    nombre?: string;
    celular?: string;
    tipo?: string;
    descuento?: string;
    acceso?: string;
    tokenPhone?: string;
    token?: string;
    codMagister?: string;
    avatar?: string;
    codt?: string;
    codigoRegistro?: string;
    valorUnitario?: number;
    editado?: string;
    activo: boolean;
    eliminado: boolean;
    idPadre?: number;
    padre?: Usuario | null;
    children?: Usuario[];
}

export interface UsuarioPadre {
    _id: number;
    uid?: string;
    nombre?: string;
    email?: string;
    celular?: string;
    acceso?: string;
    razon_social?: string;
    cedula?: string;
}

export interface UsuarioState {
    usuarios: Usuario[];
    loading: boolean;
    error?: string;
}

export interface UsuarioSearchState {
    terminoBuscador: string;
    inicio: number;
    final: boolean;
    limit: number;
    showSearch: boolean;
}

export interface UsuarioActions {
    getUsuarios: (limit: number, start: number, acceso: string, search?: string, userId?: number) => Promise<void>;
}

export interface UsuarioProps {
    navigation: any;
}

export interface DataContextType {
    userId: number;
    acceso: string;
}

export interface UsuarioNavigationParams {
    tipoAcceso: 'editar' | 'admin';
    idUsuario?: number;
}

export interface UsuarioHierarchyLevel {
    nivel: number;
    esPadre: boolean;
    tieneHijos: boolean;
}

export interface UsuarioRenderProps extends Usuario, UsuarioHierarchyLevel {
    isInactive: boolean;
}

export interface UsuarioBadgeProps {
    tipo: 'acceso' | 'estado';
    valor: string;
    activo?: boolean;
}

export interface UsuarioSearchProps {
    terminoBuscador: string;
    showSearch: boolean;
    onSearchChange: (text: string) => void;
    onSearchToggle: () => void;
    onClearSearch: () => void;
}

export interface UsuarioHeaderProps {
    usuarios: Usuario[];
    onRefresh: () => void;
}

export interface UsuarioItemProps {
    usuario: Usuario;
    nivel: number;
    onPress: (userId: number) => void;
    disabled?: boolean;
}

export interface UsuarioStatusProps {
    activo: boolean;
    showLabel?: boolean;
}

export interface UsuarioAccessProps {
    acceso: string;
    activo: boolean;
}

export interface UsuarioInactiveIndicatorProps {
    show: boolean;
}

// Tipos para Redux
export interface RootState {
    usuario: UsuarioState;
}

export interface GetUsuariosAction {
    type: 'GET_USUARIOS';
    usuarios: Usuario[];
}

export interface SetUsuariosLoadingAction {
    type: 'SET_USUARIOS_LOADING';
    loading: boolean;
}

export interface SetUsuariosErrorAction {
    type: 'SET_USUARIOS_ERROR';
    error: string;
}

export type UsuarioActionTypes =
    | GetUsuariosAction
    | SetUsuariosLoadingAction
    | SetUsuariosErrorAction;

// Tipos para la función SQL
export interface GetUsuariosParams {
    limit: number;
    start: number;
    acceso: string;
    search?: string;
    userId?: number;
    requesterId?: number;
}

export interface GetUsuariosResponse {
    users: Usuario[];
}

// Tipos para jerarquía de usuarios
export interface UsuarioHierarchy {
    usuario: Usuario;
    nivel: number;
    esPadre: boolean;
    tieneHijos: boolean;
    isInactive: boolean;
}

// Tipos para filtros y búsqueda
export interface UsuarioFilters {
    acceso?: string[];
    activo?: boolean;
    eliminado?: boolean;
    search?: string;
}

export interface UsuarioSortOptions {
    field: 'nombre' | 'email' | 'created' | 'acceso';
    direction: 'asc' | 'desc';
}

// Tipos para navegación
export interface UsuarioNavigationStack {
    Usuarios: undefined;
    editarPerfil: UsuarioNavigationParams;
    verPerfil: UsuarioNavigationParams;
}

// Tipos para componentes específicos
export interface UsuarioCardProps {
    usuario: Usuario;
    onPress: () => void;
    disabled?: boolean;
}

export interface UsuarioListProps {
    usuarios: Usuario[];
    onUsuarioPress: (userId: number) => void;
    onRefresh: () => void;
    loading?: boolean;
}

export interface UsuarioSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onSearch: () => void;
    onClear: () => void;
    placeholder?: string;
    showSearch: boolean;
}

// Tipos para estadísticas
export interface UsuarioStats {
    total: number;
    activos: number;
    inactivos: number;
    porAcceso: Record<string, number>;
}

// Tipos para permisos
export interface UsuarioPermissions {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCreate: boolean;
}

export interface UsuarioAccessLevel {
    level: 'admin' | 'veo' | 'comercial' | 'conductor' | 'cliente';
    permissions: UsuarioPermissions;
}

// Tipos para validación
export interface UsuarioValidation {
    nombre?: string;
    email?: string;
    celular?: string;
    cedula?: string;
}

export interface UsuarioFormData {
    nombre: string;
    email: string;
    celular: string;
    cedula?: string;
    acceso: string;
    activo: boolean;
    idPadre?: number;
}

// Tipos para errores
export interface UsuarioError {
    field: keyof Usuario;
    message: string;
    code: string;
}

export interface UsuarioApiError {
    message: string;
    code: string;
    details?: any;
}

// Tipos para paginación
export interface UsuarioPagination {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
}

export interface UsuarioPaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    loading: boolean;
    hasMore: boolean;
}
