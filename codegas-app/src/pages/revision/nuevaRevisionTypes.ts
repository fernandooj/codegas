// Types for NuevaRevision component

export interface NuevaRevisionState {
    // Modal states
    modalCliente: boolean;
    modalSectores: boolean;
    modalZona: boolean;
    modalDpto: boolean;
    modalCiudad: boolean;
    modalPoblado: boolean;
    modalPropiedad: boolean;
    modalUbicacion: boolean;
    modalM3: boolean;
    modalPlacas: boolean;
    modalCapacidad: boolean;
    modalAlerta: boolean;

    // Switch states
    extintores: boolean;
    avisos: boolean;
    distancias: boolean;
    electricas: boolean;
    accesorios: boolean;

    // Data arrays
    clientes: ClienteOption[];
    puntos: Punto[];
    placas: PlacaOption[];
    imgIsometrico: string[];
    imgOtrosComodato: string[];
    imgSoporteEntrega: string[];
    imgAlerta: string[];
    imgDepTecnico: string[];
    imgNMedidor: string[];
    imgNComodato: string[];
    otrosComodato: string[];
    imgOtrosSi: string[];
    soporteEntrega: string[];
    imgPuntoConsumo: string[];
    imgProtocoloLlenado: string[];
    imgHojaSeguridad: string[];
    imgVisual: string[];
    tanqueArray: Tanque[];
    tanqueIdArray: string[];

    // Location data
    dptos: Option[];
    ciudades: Option[];
    poblados: Option[];
    lat: number;
    lng: number;

    // IDs
    revisionId: string | null;
    puntoId: string | null;
    usuarioId: string | null;
    accesoPerfil: string;
    idUsuario: string;

    // Loading state
    loading: boolean;

    // Form fields
    nControl?: string;
    capacidad?: string;
    fabricante?: string;
    barrio?: string;
    sector?: string;
    m3?: string;
    usuariosAtendidos?: string;
    propiedad?: string;
    nMedidorText?: string;
    ubicacion?: string;
    nComodatoText?: string;
    direccion?: string;
    observacion?: string;
    observaciones?: string;
    estado?: number;
    solicitudServicio?: string;
    alertaText?: string;
    alertaFecha?: string;
    nActa?: string;
    depTecnicoText?: string;
    depTecnicoEstado?: string;
    poblado?: string;
    ciudad?: string;
    dpto?: string;

    // Client data
    cliente?: string;
    idCliente?: string;
    cedulaCliente?: string;
    codtCliente?: string;
    emailCliente?: string;
    razon_socialCliente?: string;
    direccion_facturaCliente?: string;
    celularCliente?: string;
    nombreCliente?: string;

    // Other fields
    placaText?: string;
    zonaId?: string;
}

export interface ClienteOption {
    key: string;
    label: string;
    email: string;
    direccion_factura: string;
    nombre: string;
    razon_social: string;
    cedula: string;
    celular: string;
    codt: string;
}

export interface PlacaOption {
    key: string;
    label: string;
}

export interface Option {
    key: string;
    label: string;
}

export interface Tanque {
    _id: string;
    placaText: string;
    capacidad: string;
    propiedad: string;
    usuarioId?: {
        codt: string;
        razon_social: string;
    };
}

export interface Punto {
    _id: string;
    direccion: string;
    capacidad: string;
    observacion: string;
}

export interface Revision {
    _id: string;
    nControl: string;
    capacidad: string;
    fabricante: string;
    barrio: string;
    sector: string;
    m3: string;
    usuariosAtendidos: string;
    propiedad: string;
    nMedidorText: string;
    ubicacion: string;
    nComodatoText: string;
    razon_social: string;
    codt: string;
    cedula: string;
    direccion_factura: string;
    nombre: string;
    celular: string;
    email: string;
    puntoId: Punto;
    zonaId: {
        _id: string;
    };
    observaciones: string;
    estado: number;
    solicitudServicio: string;
    alerta: string[];
    alertaText: string;
    alertaFecha: string;
    nActa: string;
    avisos: boolean;
    extintores: boolean;
    distancias: boolean;
    electricas: boolean;
    accesorios: boolean;
    depTecnico: string[];
    depTecnicoText: string;
    depTecnicoEstado: string;
    soporteentrega: string[];
    puntoconsumo: string[];
    visual: string[];
    ncomodato: string[];
    isometrico: string[];
    otroscomodato: string[];
    protocolollenado: string[];
    hojaseguridad: string[];
    otrossi: string[];
    documento: string[];
    poblado: string;
    ciudad: string;
    dpto: string;
    coordenadas: {
        coordinates: [number, number];
    };
    tanqueid: Tanque[];
}

export interface NuevaRevisionProps {
    navigation: any; // Replace with proper navigation type
    route: any; // Replace with proper route type
}

export interface ContextType {
    acceso: string;
    userId: string;
}

export interface RootState {
    tanque: {
        tanques: Tanque[];
    };
    usuario: {
        usuariosAcceso: any[];
    };
    vehiculo: {
        vehiculos: any[];
    };
}

export interface ApiResponse<T> {
    status: boolean;
    data?: T;
    message?: string;
}

export interface TanquesByPuntoResponse {
    tanque: Tanque[];
}

export interface PuntoByIdResponse {
    punto: Punto;
}

export interface RevisionByIdResponse {
    revision: Revision;
}

export interface ClientesResponse {
    usuarios: ClienteOption[];
}

export interface AddUserToTanqueData {
    tanqueId: string;
    usuarioId: string;
    puntoId: string;
}

export interface SendSolicitudServicioData {
    solicitudServicio: string;
    nControl: string;
    codtCliente: string;
    direccion: string;
    razon_socialCliente: string;
}

export interface CreateRevisionData {
    tanqueId: string[];
    usuarioId: string;
    puntoId: string;
    usuarioCrea: string;
}

export interface UpdateRevisionData {
    tanqueId?: string[];
    sector?: string;
    barrio?: string;
    usuariosAtendidos?: string;
    m3?: string;
    zonaId?: string;
    usuarioId?: string;
    puntoId?: string;
    nComodatoText?: string;
    nMedidorText?: string;
    ubicacion?: string;
}

export interface UpdateRevisionInstalacionData {
    observaciones: string;
    avisos: boolean;
    extintores: boolean;
    distancias: boolean;
    electricas: boolean;
    accesorios: boolean;
}

export interface UpdateRevisionCoordenadasData {
    lat: number;
    lng: number;
    poblado: string;
    ciudad: string;
    dpto: string;
}

export interface AddImagesToRevisionData {
    mime: string;
    imagen: string;
    revisionId: string;
    type: string;
    name: string;
}

// Function types
export type UpdateStateFunction = (updates: Partial<NuevaRevisionState>) => void;
export type FiltroClientesFunction = (idCliente: string) => void;
export type BuscarTanqueFunction = (id: { key: string }) => void;
export type AlertaEliminarTanqueFunction = (placaText: string, codt: string, razon_social: string) => void;
export type BuscarRevisionFunction = () => void;
export type BuscarDeptoFunction = () => void;
export type BuscarCiudadFunction = (ciudad: string) => void;
export type BuscarPobladoFunction = (ciudad: string) => void;
export type SolicitudServicioFunction = () => void;
export type CrearStep1Function = () => void;
export type EditarStep1Function = () => void;
export type EditarStep2Function = () => void;
export type EditarStep3Function = () => void;
export type EditarStep5Function = () => void;
export type UploadImagenFunction = (imagen: any, type: string, mime: string) => void;
export type AddTanqueFunction = (nombre: string, cantidad: number) => void;

// Step render functions
export type Step1Function = () => JSX.Element;
export type Step2Function = () => JSX.Element;
export type Step3Function = () => JSX.Element;
export type Step4Function = () => JSX.Element;
export type Step5Function = () => JSX.Element;
export type ModalAlertaFunction = () => JSX.Element;
export type RenderStepsFunction = () => JSX.Element;
