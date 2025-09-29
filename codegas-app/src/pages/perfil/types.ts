import { NavigationProp } from '@react-navigation/native';

// Navigation types
export interface NavigationProps {
    navigation: NavigationProp<any>;
}

// User access levels
export type UserAccess =
    | 'admin'
    | 'solucion'
    | 'comercial'
    | 'veo'
    | 'despacho'
    | 'depTecnico'
    | 'insSeguridad'
    | 'adminTanque'
    | 'cliente';

// User data interface
export interface UserData {
    _id: string;
    nombre: string;
    email: string;
    acceso: UserAccess;
    avatar?: string | null;
}

// User data from AsyncStorage
export interface StoredUserData {
    nombre: string | null;
    email: string | null;
    avatar: string | null;
}

// API response for user search
export interface UserSearchResponse {
    data: {
        users: UserData;
    };
}

// Profile component props
export interface PerfilProps extends NavigationProps {
    // Additional props can be added here if needed
}

// Menu button configuration
export interface MenuButtonConfig {
    text: string;
    icon: string;
    iconSize?: number;
    iconColor?: string;
    onPress: () => void;
    backgroundColor?: string;
    textColor?: string;
}

// Navigation parameters for different screens
export interface NavigationParams {
    tipoAcceso?: UserAccess | null;
    revision?: boolean;
}

// Component state interfaces
export interface ProfileState {
    idUsuarioSearch: string;
    currentNombre: string;
    currentEmail: string;
}

// Context interface (from DataContext)
export interface DataContextType {
    nombre: string;
    avatar: string | null;
    email: string;
    userInfo: any;
    acceso: UserAccess;
    cerrarSesion: () => void;
    updateUserData: (data: StoredUserData) => Promise<void>;
}

// AsyncStorage keys
export type AsyncStorageKeys =
    | 'userId'
    | 'nombre'
    | 'email'
    | 'acceso'
    | 'avatar'
    | 'tokenPhone';

// Toast message types
export interface ToastMessage {
    text1: string;
    text2?: string;
}

// API error response
export interface ApiError {
    message: string;
    status?: number;
}

// Version information
export interface VersionInfo {
    version: string;
    build?: string;
}

// Menu item visibility rules
export interface MenuVisibilityRule {
    accessLevels: UserAccess[];
    emailCondition?: string;
    customCondition?: boolean;
}
