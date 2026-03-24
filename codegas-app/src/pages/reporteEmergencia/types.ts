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
    usuarioCierranombre?: string; // Nombre del usuario que cerró el reporte
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
    imgUrlsS3?: string[]; // URLs de las imágenes subidas a S3
    documentosUrlsS3?: string[]; // URLs de los documentos subidos a S3
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
    rutaCerrar?: string[]; // URLs de las imágenes de solución subidas a S3
    documentosUrlsS3?: string[]; // URLs de los documentos subidos a S3
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
    nombre?: string;
}

export interface ImagenData {
    imagen: string;
    name: string;
}
