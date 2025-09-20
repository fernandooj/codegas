// Tipos para Reporte de Emergencia

export interface ReporteEmergencia {
    _id: string;
    tanque: boolean;
    red: boolean;
    puntos: boolean;
    fuga: boolean;
    pqr: boolean;
    otrosText: string;
    cerradoText?: string;
    usuarioId: string;
    puntoId: string;
    usuarioCrea: string;
    creado: string;
    activo: boolean;
    estado: number;
    solicitudServicio?: string;
    ruta?: string[];
    documento?: string[];
    rutacerrar?: string[];
    usuarionombre?: string;
    usuariorazonsocial?: string;
    usuariocreanombre?: string;
    usuariocrearazonsocial?: string;
    puntodireccion?: string;
    usuariocodt?: string;
}

export interface ReporteEmergenciaFormData {
    tanque: boolean;
    red: boolean;
    puntos: boolean;
    fuga: boolean;
    pqr: boolean;
    otrosText: string;
    usuarioId: string;
    puntoId: string;
    usuarioCrea: string;
    razonSocial?: string;
    nombre?: string;
    codt?: string;
}

export interface ReporteEmergenciaCerrarData {
    idRevision: string;
    cerradoText: string;
    tanque: boolean;
    red: boolean;
    puntos: boolean;
    fuga: boolean;
    pqr: boolean;
    usuarioCierra: string;
}

export interface ReporteEmergenciaImagenData {
    mime: string;
    imagen: string;
    idReporte: string;
    type: string;
    name: string;
}

export interface ReporteEmergenciaState {
    reportes: ReporteEmergencia[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    start: number;
    limit: number;
}

export interface NavigationParams {
    reporteId?: string;
    usuarioId?: string;
    puntoId?: string;
    codt?: string;
    razon_social?: string;
}

export interface ImagenData {
    imagen: string;
    name: string;
}
