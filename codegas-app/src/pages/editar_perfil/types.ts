// Types for editarPerfil component

export interface Ubicacion {
    direccion?: string;
    nombre?: string;
    email?: string;
    celular?: string;
    idZona?: string;
    nombreZona?: string;
    capacidad?: string;
    nuevo?: boolean;
    acceso?: string;
    observacion?: string;
    idCliente?: string;
    _id?: string;
    location?: any;
    place_name?: string;
    activo?: boolean;
    lat?: string;
    lng?: string;
}

export interface Veo {
    key: string;
    label: string;
}

export interface Zona {
    _id: string;
    nombre: string;
}

export interface User {
    _id: string;
    razon_social?: string;
    cedula?: string;
    direccion_factura?: string;
    email?: string;
    nombre?: string;
    password?: string;
    celular?: string;
    tipo?: string;
    acceso?: string;
    codt?: string;
    codMagister?: string;
    valorunitario?: string;
    avatar?: string[];
    activo?: boolean;
    editado?: boolean;
    nombrepadre?: string;
    veos?: {
        nombre: string;
    };
}

export interface EditarPerfilState {
    // User data
    razon_social: string;
    cedula: string;
    direccion_factura: string;
    email: string;
    nombre: string;
    password: string;
    celular: string;
    tipo: string;
    acceso: string;
    codt: string;
    codMagister: string;
    terminoBuscador: string;
    valorUnitario: string;

    // UI state
    modalUbicacion: boolean;
    modalZona: boolean;
    modalCliente: boolean;
    showPass: boolean;
    cargando: boolean;
    showLoading: boolean;
    activeScroll: boolean;
    editaAvatar: boolean;
    activo: boolean;

    // Data arrays
    userId: string | null;
    zonas: Zona[];
    puntos: any[];
    imagen: string[];
    veos: Veo[];
    ubicaciones: Ubicacion[];
    ubicacionesEliminadas: string[];

    // Form data
    idUsuario: string;
    veo: string;
    editado: boolean;
    idZona: string;
    key: number;
    idVeo: string;
    tipoAcceso: string;
    accesoPerfil: string;
    observacion: string;
    direccion: string;
    emailUbicacion: string;
    celularUbicacion: string;
    nombreUbicacion: string;
    nombreZona: string;
    confirmar: string;
}

export interface EditarPerfilProps {
    navigation: {
        navigate: (screen: string, params?: any) => void;
    };
    route?: {
        params?: {
            tipoAcceso?: string;
            idUsuario?: string;
            scrollPosition?: number;
        };
    };
}

export interface ContextType {
    acceso: string;
    userId: string;
    updateUserData?: (userData: { nombre?: string; email?: string; avatar?: string }) => Promise<void>;
}

export interface ApiResponse<T = any> {
    status: boolean;
    data?: T;
    user?: User;
    puntos?: Ubicacion[];
    usuarios?: User[];
    zona?: Zona[];
}

export interface SignUpData {
    razon_social: string;
    cedula: string;
    direccion_factura: string;
    nombre: string;
    email: string;
    celular: string;
    tipo: string;
    acceso: string;
    codt: string;
    puntos: Array<{
        direccion: string;
        idZona: string;
        observacion: string;
        capacidad: string;
    }>;
    codMagister?: string;
    valorUnitario?: string;
}

export interface UpdateUserData {
    editado: boolean;
    puntos: Array<{
        direccion: string;
        idZona: string;
        observacion: string;
        _id?: string;
        capacidad: string;
    }>;
    puntosNuevos: Array<{
        direccion: string;
        idZona: string;
        observacion: string;
        capacidad: string;
    }>;
    razon_social: string;
    cedula: string;
    direccion_factura: string;
    nombre: string;
    email: string;
    celular: string;
    tipo: string;
    acceso: string;
    codt: string;
    ubicacionesEliminadas: string[];
    codMagister?: string;
    valorUnitario?: string;
}

export interface MultipleUsersData {
    direccion: string;
    email: string;
    celular: string;
    nombre: string;
    observacion: string;
    idZona: string;
    capacidad: string;
    idCliente?: string;
}

export interface MultiplePointsData {
    direccion: string;
    idZona: string;
    observacion: string;
    capacidad: string;
}

export interface FormDataUpload {
    imagen: File | Blob;
    imagenOtroUsuario: boolean;
    idUser: string;
    crear?: boolean;
}

export interface AccesoOption {
    label: string;
    value: string;
    key: string;
}

export interface TipoOption {
    label: string;
    value: string;
    key: string;
}

// Redux state types
export interface UsuarioState {
    perfil: {
        user: User;
    };
}

export interface RootState {
    usuario: UsuarioState;
}

// Function types
export type UpdateStateFunction = (updates: Partial<EditarPerfilState>) => void;

export type RenderPerfilFunction = () => JSX.Element;
export type RenderFormPassFunction = () => JSX.Element;
export type ModalZonasFunction = () => JSX.Element;
export type ModalUbicacionFunction = () => JSX.Element;

export type CambiarValorUnitarioFunction = () => void;
export type VerificaEmailFunction = () => void;
export type AsignarVeoFunction = (idVeo: string) => void;
export type EliminarUsuarioFunction = () => void;
export type CambiarEstadoUsuarioFunction = () => void;
export type ActualizaUbicacionFunction = () => void;
export type ActualizaArrayUbicacionFunction = (type: string, value: string, key: number) => void;
export type ActualizaZonaFunction = (id: string, nombre: string) => void;
export type GuardarUbicacionFunction = () => void;
export type AvatarFunction = (imagen: string[], idUser: string) => void;
export type HandleSubmitFunction = (esEditar?: string) => void;
export type EliminarUbicacionFunction = (key: number) => void;
export type GuardarUsuarioFunction = (e?: any) => void;
export type EditarUsuarioFunction = (e?: any) => void;
export type CambiarPassFunction = () => void;
export type EdicionExitosaFunction = (nombre: string) => void;
export type LoginExitosoFunction = (user: User) => void;
