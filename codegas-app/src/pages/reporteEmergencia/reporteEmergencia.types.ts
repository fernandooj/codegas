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
