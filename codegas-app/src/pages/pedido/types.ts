// Types para el módulo de Pedidos

export interface Usuario {
    _id: string;
    nombre: string;
    email: string;
    cedula: string;
    activo: boolean;
    eliminado: boolean;
    tokenphone?: string;
}

export interface Vehiculo {
    _id: string;
    placa: string;
    conductor?: {
        _id: string;
        nombre: string;
        avatar?: string;
    };
    activo: boolean;
}

export interface Zona {
    _id: string;
    nombre: string;
    codigo: string;
}

export interface Pedido {
    _id: string;
    usuarioid: string;
    nombre: string;
    razon_social: string;
    cedula: string;
    email: string;
    tokenPhone?: string;
    direccion?: string;
    codt?: string;
    zona?: string;
    forma: 'cantidad' | 'monto';
    cantidad?: number;
    cantidadkl?: number;
    cantidadprecio?: number;
    capacidad?: number;
    valorunitario?: number;
    valorunitariousuario?: number;
    valor_total?: number;
    estado: 'activo' | 'innactivo' | 'espera' | 'noentregado';
    entregado: boolean;
    fechasolicitud?: string;
    fechaentrega?: string;
    creado?: string;
    usuariocrea?: string;
    observacion?: string;
    observacion_pedido?: string;
    puntoid?: string;
    carroId?: string;
    placa?: string;
    conductor?: string;
    kilos?: number;
    factura?: string;
    remision?: string;
    forma_pago?: string;
    imagen?: string;
    imagencerrar?: string;
    pedidopadre: string;
    motivo_no_cierre?: string;
    perfil_novedad?: string;
    coordenadas?: {
        x?: number;
        y?: number;
    };
    lat?: number;
    lng?: number;
    eliminado: boolean;
    // Nuevos campos del punto
    punto_email?: string;
    punto_celular?: string;
    punto_nombre?: string;
    // Campo del vehículo
    idVehiculo?: string;
}

export interface Novedad {
    _id: string;
    pedido_id: string;
    novedad: string;
    nombre: string;
    creado: string;
    usuario_id: string;
}

export interface PedidoState {
    // Modal states
    openModal: boolean;
    modalConductor: boolean;
    modalFechaEntrega: boolean;
    modalZona: boolean;
    modalNovedad: boolean;
    modalPerfiles: boolean;
    modalCarrosFiltro: boolean;
    modalZonas: boolean;

    // Search and filter states
    terminoBuscador?: string;
    fechasFiltro: [string, string];
    fechaEntregaFiltro?: string;
    fechaSolicitudFiltro?: string;
    showSearch: boolean;

    // Pagination states
    inicio: number;
    final: boolean;
    limit: number;

    // Data states
    pedidosFiltro: Pedido[];
    zonaPedidos: Zona[];
    avatar: string[];
    novedades: Novedad[];
    zonas: Zona[];

    // UI states
    elevation: number;
    keyboard: boolean;
    showNovedades: boolean;
    showSpin: boolean;
    showSpin1: boolean;
    bounces?: boolean;
    showCalendar: boolean;
    height?: number;

    // Form states
    kilosTexto: string;
    remisionTexto: string;
    facturaTexto: string;
    valor_totalTexto: string;
    forma_pagoTexto: string;
    novedad: string;

    // Selected pedido data
    selectedPedido: SelectedPedidoData;
}

export interface SelectedPedidoData {
    id?: string;
    estado?: 'activo' | 'innactivo' | 'espera' | 'noentregado';
    estadoEntrega?: string;
    usuarioId?: string;
    nombre?: string;
    razon_social?: string;
    codt?: string;
    email?: string;
    tokenPhone?: string;
    cedula?: string;
    forma?: 'cantidad' | 'monto';
    cantidad?: number;
    entregado?: boolean;
    imagenCerrar?: string;
    factura?: string;
    kilos?: number;
    remision?: string;
    forma_pago?: string;
    valor_total?: number;
    nPedido?: string;
    estadoInicial?: string;
    capacidad?: number;
    cantidadKl?: number;
    cantidadPrecio?: number;
    observacion_pedido?: string;
    observacion?: string;
    puntoId?: string;
    usuarioCrea?: string;
    creado?: string;
    motivo_no_cierre?: string;
    perfil_novedad?: string;
    placaPedido?: string;
    conductorPedido?: string;
    valor_unitarioUsuario?: number;
    imagenPedido?: string;
    fechaEntrega?: string;
    idVehiculo?: string;
    placa?: string;
    textEstado?: string;
    imagen?: string;
    perfil?: string;
    idZona?: string;
    coordenadas?: {
        x?: number;
        y?: number;
        lat?: number;
        lng?: number;
    };
    punto_email?: string;
    punto_celular?: string;
    punto_nombre?: string;
}

// Action Types para el reducer
export type PedidoAction =
    | { type: 'SET_OPEN_MODAL'; payload: boolean }
    | { type: 'SET_MODAL_CONDUCTOR'; payload: boolean }
    | { type: 'SET_MODAL_FECHA_ENTREGA'; payload: boolean }
    | { type: 'SET_MODAL_ZONA'; payload: boolean }
    | { type: 'SET_TERMINO_BUSCADOR'; payload?: string }
    | { type: 'SET_KILOS_TEXTO'; payload: string }
    | { type: 'SET_REMISION_TEXTO'; payload: string }
    | { type: 'SET_FACTURA_TEXTO'; payload: string }
    | { type: 'SET_VALOR_TOTAL_TEXTO'; payload: string }
    | { type: 'SET_FORMA_PAGO_TEXTO'; payload: string }
    | { type: 'SET_NOVEDAD'; payload: string }
    | { type: 'SET_FECHAS_FILTRO'; payload: [string, string] }
    | { type: 'SET_INICIO'; payload: number }
    | { type: 'SET_FINAL'; payload: boolean }
    | { type: 'SET_LIMIT'; payload: number }
    | { type: 'SET_ZONA_PEDIDOS'; payload: Zona[] }
    | { type: 'SET_AVATAR'; payload: string[] }
    | { type: 'SET_NOVEDADES'; payload: Novedad[] }
    | { type: 'SET_ELEVATION'; payload: number }
    | { type: 'SET_FECHA_ENTREGA_FILTRO'; payload?: string }
    | { type: 'SET_PEDIDOS_FILTRO'; payload: Pedido[] }
    | { type: 'SET_PLACA_PEDIDO'; payload?: string }
    | { type: 'SET_CONDUCTOR_PEDIDO'; payload?: string }
    | { type: 'SET_VALOR_UNITARIO_USUARIO'; payload?: number }
    | { type: 'SET_IMAGEN_PEDIDO'; payload?: string }
    | { type: 'SET_FECHA_ENTREGA'; payload?: string }
    | { type: 'SET_ID'; payload?: string }
    | { type: 'SET_ESTADO'; payload?: 'activo' | 'innactivo' | 'espera' }
    | { type: 'SET_ESTADO_ENTREGA'; payload?: string }
    | { type: 'SET_USUARIO_ID'; payload?: string }
    | { type: 'SET_NOMBRE'; payload?: string }
    | { type: 'SET_RAZON_SOCIAL'; payload?: string }
    | { type: 'SET_CODT'; payload?: string }
    | { type: 'SET_EMAIL'; payload?: string }
    | { type: 'SET_TOKEN_PHONE'; payload?: string }
    | { type: 'SET_CEDULA'; payload?: string }
    | { type: 'SET_FORMA'; payload?: 'cantidad' | 'monto' }
    | { type: 'SET_CANTIDAD'; payload?: number }
    | { type: 'SET_ENTREGADO'; payload?: boolean }
    | { type: 'SET_IMAGEN_CERRAR'; payload?: string }
    | { type: 'SET_FACTURA'; payload?: string }
    | { type: 'SET_KILOS'; payload?: number }
    | { type: 'SET_REMISION'; payload?: string }
    | { type: 'SET_FORMA_PAGO'; payload?: string }
    | { type: 'SET_VALOR_TOTAL'; payload?: number }
    | { type: 'SET_N_PEDIDO'; payload?: string }
    | { type: 'SET_ESTADO_INICIAL'; payload?: string }
    | { type: 'SET_CAPACIDAD'; payload?: number }
    | { type: 'SET_CANTIDAD_KL'; payload?: number }
    | { type: 'SET_CANTIDAD_PRECIO'; payload?: number }
    | { type: 'SET_OBSERVACION_PEDIDO'; payload?: string }
    | { type: 'SET_OBSERVACION'; payload?: string }
    | { type: 'SET_PUNTO_ID'; payload?: string }
    | { type: 'SET_USUARIO_CREA'; payload?: string }
    | { type: 'SET_CREADO'; payload?: string }
    | { type: 'SET_MOTIVO_NO_CIERRE'; payload?: string }
    | { type: 'SET_PERFIL_NOVEDAD'; payload?: string }
    | { type: 'SET_KEYBOARD'; payload: boolean }
    | { type: 'SET_SHOW_NOVEDADES'; payload: boolean }
    | { type: 'SET_MODAL_NOVEDAD'; payload: boolean }
    | { type: 'SET_MODAL_PERFILES'; payload: boolean }
    | { type: 'SET_MODAL_CARROS_FILTRO'; payload: boolean }
    | { type: 'SET_SHOW_SPIN'; payload: boolean }
    | { type: 'SET_SHOW_SPIN1'; payload: boolean }
    | { type: 'SET_BOUNCES'; payload?: boolean }
    | { type: 'SET_SHOW_CALENDAR'; payload: boolean }
    | { type: 'SET_ID_VEHICULO'; payload?: string }
    | { type: 'SET_PLACA'; payload?: string }
    | { type: 'SET_TEXT_ESTADO'; payload?: string }
    | { type: 'SET_FECHA_SOLICITUD_FILTRO'; payload?: string }
    | { type: 'SET_ZONAS'; payload: Zona[] }
    | { type: 'SET_ID_ZONA'; payload?: string }
    | { type: 'SET_IMAGEN'; payload?: string }
    | { type: 'SET_PERFIL'; payload?: string }
    | { type: 'SET_SHOW_SEARCH'; payload: boolean }
    | { type: 'SET_HEIGHT'; payload?: number }
    | { type: 'SET_PEDIDO_DATA'; payload: Partial<SelectedPedidoData> }
    | { type: 'RESET_PEDIDO_DATA' }
    | { type: 'RESET_FORM' }
    | { type: 'RESET_FILTERS' };

// Props types
export interface PedidoProps {
    navigation: any; // Navigation type from React Navigation
    pedidos?: Pedido[];
    vehiculos?: Vehiculo[];
}

// Context types
export interface DataContextType {
    user?: Usuario;
    userId?: string;
    acceso?: 'admin' | 'cliente' | 'conductor' | 'solucion' | 'comercial' | 'despacho';
    nombre?: string;
    email?: string;
    fcmToken?: string;
    login: (credentials: { email: string; password: string }) => Promise<{ response: boolean; status?: number }>;
    logout: () => void;
}

// Redux State types
export interface RootState {
    pedido: {
        pedidos: Pedido[];
        loading: boolean;
        error?: string;
    };
    vehiculo: {
        vehiculos: Vehiculo[];
        loading: boolean;
        error?: string;
    };
}

// API Response types
export interface ApiResponse<T = any> {
    status: boolean;
    message?: string;
    data?: T;
    code?: number;
}

export interface PedidoApiResponse extends ApiResponse {
    data?: Pedido[];
}

export interface VehiculoApiResponse extends ApiResponse {
    data?: Vehiculo[];
}

export interface NovedadApiResponse extends ApiResponse {
    data?: Novedad[];
}

// Hook return types
export interface UsePedidoStateReturn {
    state: PedidoState;
    dispatch: React.Dispatch<PedidoAction>;
    updateState: (action: PedidoAction) => void;
    updateMultiple: (payload: any) => void;
    setPedidoData: (data: Partial<SelectedPedidoData>) => void;
    resetPedidoData: () => void;
    openPedidoModal: (data: Partial<SelectedPedidoData>) => void;
    closePedidoModal: () => void;
    handleKeyboardShow: () => void;
    handleKeyboardHide: () => void;
    handleSearch: (terminoBuscador?: string) => boolean;
    clearSearch: () => void;
    handleScroll: (event: any) => boolean;
    resetForm: () => void;
    resetFilters: () => void;
    actions: PedidoActions;
}

export interface PedidoActions {
    setOpenModal: (payload: boolean) => PedidoAction;
    setModalConductor: (payload: boolean) => PedidoAction;
    setModalFechaEntrega: (payload: boolean) => PedidoAction;
    setModalZona: (payload: boolean) => PedidoAction;
    setTerminoBuscador: (payload?: string) => PedidoAction;
    setKilosTexto: (payload: string) => PedidoAction;
    setRemisionTexto: (payload: string) => PedidoAction;
    setFacturaTexto: (payload: string) => PedidoAction;
    setValorTotalTexto: (payload: string) => PedidoAction;
    setFormaPagoTexto: (payload: string) => PedidoAction;
    setNovedad: (payload: string) => PedidoAction;
    setFechasFiltro: (payload: [string, string]) => PedidoAction;
    setInicio: (payload: number) => PedidoAction;
    setFinal: (payload: boolean) => PedidoAction;
    setLimit: (payload: number) => PedidoAction;
    setZonaPedidos: (payload: Zona[]) => PedidoAction;
    setAvatar: (payload: string[]) => PedidoAction;
    setNovedades: (payload: Novedad[]) => PedidoAction;
    setElevation: (payload: number) => PedidoAction;
    setFechaEntregaFiltro: (payload?: string) => PedidoAction;
    setPedidosFiltro: (payload: Pedido[]) => PedidoAction;
    setPlacaPedido: (payload?: string) => PedidoAction;
    setConductorPedido: (payload?: string) => PedidoAction;
    setValorUnitarioUsuario: (payload?: number) => PedidoAction;
    setImagenPedido: (payload?: string) => PedidoAction;
    setFechaEntrega: (payload?: string) => PedidoAction;
    setId: (payload?: string) => PedidoAction;
    setEstado: (payload?: 'activo' | 'innactivo' | 'espera') => PedidoAction;
    setEstadoEntrega: (payload?: string) => PedidoAction;
    setUsuarioId: (payload?: string) => PedidoAction;
    setNombre: (payload?: string) => PedidoAction;
    setRazonSocial: (payload?: string) => PedidoAction;
    setCodt: (payload?: string) => PedidoAction;
    setEmail: (payload?: string) => PedidoAction;
    setTokenPhone: (payload?: string) => PedidoAction;
    setCedula: (payload?: string) => PedidoAction;
    setForma: (payload?: 'cantidad' | 'monto') => PedidoAction;
    setCantidad: (payload?: number) => PedidoAction;
    setEntregado: (payload?: boolean) => PedidoAction;
    setImagenCerrar: (payload?: string) => PedidoAction;
    setFactura: (payload?: string) => PedidoAction;
    setKilos: (payload?: number) => PedidoAction;
    setRemision: (payload?: string) => PedidoAction;
    setFormaPago: (payload?: string) => PedidoAction;
    setValorTotal: (payload?: number) => PedidoAction;
    setNPedido: (payload?: string) => PedidoAction;
    setEstadoInicial: (payload?: string) => PedidoAction;
    setCapacidad: (payload?: number) => PedidoAction;
    setCantidadKl: (payload?: number) => PedidoAction;
    setCantidadPrecio: (payload?: number) => PedidoAction;
    setObservacionPedido: (payload?: string) => PedidoAction;
    setObservacion: (payload?: string) => PedidoAction;
    setPuntoId: (payload?: string) => PedidoAction;
    setUsuarioCrea: (payload?: string) => PedidoAction;
    setCreado: (payload?: string) => PedidoAction;
    setMotivoNoCierre: (payload?: string) => PedidoAction;
    setPerfilNovedad: (payload?: string) => PedidoAction;
    setKeyboard: (payload: boolean) => PedidoAction;
    setShowNovedades: (payload: boolean) => PedidoAction;
    setModalNovedad: (payload: boolean) => PedidoAction;
    setModalPerfiles: (payload: boolean) => PedidoAction;
    setModalCarrosFiltro: (payload: boolean) => PedidoAction;
    setShowSpin: (payload: boolean) => PedidoAction;
    setShowSpin1: (payload: boolean) => PedidoAction;
    setBounces: (payload?: boolean) => PedidoAction;
    setShowCalendar: (payload: boolean) => PedidoAction;
    setIdVehiculo: (payload?: string) => PedidoAction;
    setPlaca: (payload?: string) => PedidoAction;
    setTextEstado: (payload?: string) => PedidoAction;
    setFechaSolicitudFiltro: (payload?: string) => PedidoAction;
    setZonas: (payload: Zona[]) => PedidoAction;
    setIdZona: (payload?: string) => PedidoAction;
    setImagen: (payload?: string) => PedidoAction;
    setPerfil: (payload?: string) => PedidoAction;
    setShowSearch: (payload: boolean) => PedidoAction;
    setHeight: (payload?: number) => PedidoAction;
}

// Calendar types
export interface CalendarDay {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
}

export interface MarkedDates {
    [date: string]: {
        selected?: boolean;
        marked?: boolean;
        selectedColor?: string;
        dotColor?: string;
    };
}

export interface CerrarPedidoData {
    kilos: string;
    factura: string;
    valor_total: string;
    remision: string;
    forma_pago: string;
    novedad: string;
    imagen?: string;
}

export interface CerrarPedidoModalProps {
    visible: boolean;
    onClose: () => void;
    pedidoId?: string;
    entregado: boolean|undefined;
    imagenCerrar?: string;
    kilos?: number;
    factura?: string;
    valor_total?: number;
    remision?: string;
    forma_pago?: string;
    valor_unitario?: string;
    onCerrarPedido: (data: CerrarPedidoData, pedidoId?: string) => void;
    onGuardarNovedad: (novedad: string, pedidoId?: string, motivoKey?: string) => void;
}

// Utility types
export type EstadoPedido = 'activo' | 'innactivo' | 'espera' | 'noentregado';
export type FormaPedido = 'cantidad' | 'monto';
export type AccesoUsuario = 'admin' | 'cliente' | 'conductor' | 'solucion' | 'comercial' | 'despacho';

// Event types
export interface ScrollEvent {
    nativeEvent: {
        contentOffset: {
            x: number;
            y: number;
        };
        layoutMeasurement: {
            height: number;
            width: number;
        };
        contentSize: {
            height: number;
            width: number;
        };
    };
}

// Estadísticas types
export interface Estadistica {
    placa: string;
    cantidad_pedidos: number;
    total_kilos: number;
    total_valor_contado: number;
    total_valor_credito: number;
    total_valor: number;
}

export interface DetallePedido {
    remision: string;
    pedido: number | null;
    codt: string;
    total_kilos: number;
    vlr_contado: number | null;
    vlr_credito: number | null;
    valor_total: number;
}

export interface ModalEstadisticasProps {
    visible: boolean;
    onClose: () => void;
    conductorId?: number | null;
    acceso?: 'admin' | 'conductor' | 'cliente' | 'solucion' | 'comercial' | 'despacho';
}
