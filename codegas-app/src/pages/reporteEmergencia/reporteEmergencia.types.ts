export interface ReporteEmergenciaItem {
    _id: string;
    creado: string;
    estado: number;
    activo: boolean;
    tanque: boolean;
    red: boolean;
    puntos: boolean;
    fuga: boolean;
    pqr: boolean;
    cerradoText?: string;
    solicitudServicio?: string;
    documento: string[];
    usuariocierranombre?: string; // Nombre del usuario que cerró el reporte
    usuarioid?: number; // ID del usuario del reporte
    usuarionombre?: string; // Nombre del usuario del reporte
    usuariocodt?: string; // CODT del usuario del reporte
    usuariorazonsocial?: string; // Razón social del usuario del reporte
    puntodireccion?: string; // Dirección del punto
}

export interface ReporteEmergenciaProps {
    navigation: any;
}

export interface ReporteEmergenciaState {
    searchTerm: string;
    start: number;
    limit: number;
}

export interface ReduxState {
    reportes: ReporteEmergenciaItem[];
    loading: boolean;
    error: string | null;
}

export interface DocumentItem {
    uri: string;
    name: string;
}
