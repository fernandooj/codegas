import { NavigationProp } from '@react-navigation/native';

// Tipos para el estado principal del componente
export interface NuevoPedidoState {
    imagen: any[];
    terminoBuscador: string;
    inicio: number;
    final: number;
    categoriaUser: any[];
    clientes: any[];
    puntos: PuntoEntrega[];
    modalCliente: boolean;
    modalFechaEntrega: boolean;
    email: string;
    nombre: string;
    acceso: AccesoUsuario | '';
    usuarios: any[];
    showRenderUsuarios: boolean;
    showClientes: boolean;
    showFrecuencia: boolean;
    showFechaEntrega: boolean;
    showPedidosExistentes: boolean;
    forma: FormaPedido | null;
    cantidad: string;
    frecuencia: FrecuenciaPedido | null;
    diaSeleccionado1: DiaSemana | null;
    diaSeleccionado2: DiaSemana | null;
    franja: string | null;
    idCliente: string | null;
    cliente: string | null;
    emailCliente: string;
    puntoId: string | null;
    solicitud: boolean;
    fechaSolicitud: string;
    novedad: string;
    guardando: boolean;
    idUsuario: string | null;
    pedidosExistentes: PedidoExistente[];
}

// Tipos para las props del componente
export interface NuevoPedidoProps {
    navigation: NavigationProp<any>;
}

// Tipos para datos de usuarios/clientes
export interface Cliente {
    _id: string;
    nombre: string;
    email: string;
    razon_social?: string;
    codt?: string;
    acceso: AccesoUsuario;
    activo: boolean;
}

// Tipos para puntos de entrega
export interface PuntoEntrega {
    _id: string;
    direccion: string;
    email: string;
    nombre: string;
    celular: string;
    capacidad: number;
    observacion?: string;
    activo?: boolean;
    
}

// Tipos para datos del pedido a crear
export interface PedidoData {
    forma: FormaPedido;
    dia1?: DiaSemana;
    dia2?: DiaSemana;
    frecuencia?: FrecuenciaPedido;
    puntoId: string;
    fechaSolicitud: string;
    cantidadKl: number;
    cantidadPrecio: number;
    usuarioCrea: string;
    usuarioId: string;
    observacion: string;
}

// Tipos para respuesta de verificación de pedido
export interface VerificacionPedidoResponse {
    status: boolean;
    pedidos: PedidoExistente[];
    total: number;
    message?: {
        path: string;
    };
}

// Tipos para pedidos existentes
export interface PedidoExistente {
    _id: number;
    fechasolicitud: string;
    creado: string;
    forma: string;
    cantidadkl: number;
    cantidadprecio: number;
    usuarioCrea: number;
    nombre_usuario: string;
    razon_social_usuario: string;
}

// Tipos para respuesta de creación de pedido
export interface CrearPedidoResponse {
    status: boolean;
    message?: string;
    pedido?: any;
}

// Tipos para respuesta de puntos por cliente
export interface PuntosPorClienteResponse {
    status: boolean;
    puntos: PuntoEntrega[];
    message?: string;
}

// Tipos para las opciones de forma de pedido
export type FormaPedido = 'monto' | 'cantidad' | 'lleno';

// Tipos para frecuencia de pedido
export type FrecuenciaPedido = 'semanal' | 'mensual' | 'quincenal';

// Tipos para días de la semana
export type DiaSemana =
    | 'lunes'
    | 'martes'
    | 'miércoles'
    | 'jueves'
    | 'viernes'
    | 'sábado'
    | 'domingo'
    | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
    | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
    | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';

// Tipos para acceso de usuario
export type AccesoUsuario =
    | 'admin'
    | 'cliente'
    | 'conductor'
    | 'veo'
    | 'solucion'
    | 'comercial'
    | 'despacho';

// Tipos para opciones de modal selector
export interface ModalSelectorOption {
    key: string;
    label: string;
}

// Tipos para datos del calendario
export interface CalendarDay {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
}

// Tipos para datos marcados del calendario
export interface MarkedDates {
    [date: string]: {
        selected?: boolean;
        marked?: boolean;
        selectedColor?: string;
        selectedTextColor?: string;
    };
}

// Tipos para el contexto de datos
export interface DataContextType {
    acceso: AccesoUsuario;
    userId: string;
    email: string;
    nombre: string;
    user?: {
        nombre: string;
    };
}

// Tipos para el estado de Redux
export interface RootState {
    usuario: {
        usuarios: Cliente[];
        usuariosAcceso: any[];
    };
    pedido: {
        pedidos: any[];
    };
}

// Tipos para acciones de Redux
export interface ReduxAction {
    type: string;
    payload?: any;
}

// Tipos para referencias
export interface TextInputRef {
    getRawValue(): number;
    focus(): void;
    blur(): void;
}

// Tipos para TextInputMask
export interface TextInputMaskRef {
    getRawValue(): number;
    focus(): void;
    blur(): void;
}

// Tipos para animaciones
export interface AnimationValue {
    setValue(value: number): void;
    interpolate(config: {
        inputRange: number[];
        outputRange: number[];
    }): any;
}

// Tipos para validación de formulario
export interface FormValidation {
    isValid: boolean;
    errors: string[];
}

// Tipos para el modal de cliente
export interface ModalClienteProps {
    visible: boolean;
    clientes: Cliente[];
    terminoBuscador: string;
    showRenderUsuarios: boolean;
    onClose: () => void;
    onSearch: (termino: string) => void;
    onSelectClient: (cliente: Cliente) => void;
}

// Tipos para el modal de fecha de entrega
export interface ModalFechaEntregaProps {
    visible: boolean;
    fechaSolicitud: string;
    onClose: () => void;
    onDateSelect: (date: string) => void;
}

// Tipos para el modal de pedidos existentes
export interface ModalPedidosExistentesProps {
    visible: boolean;
    pedidos: PedidoExistente[];
    onClose: () => void;
    onConfirmCreate: () => void;
}

// Tipos para la función de filtro de clientes
export interface FiltroClientesParams {
    _id: string;
    email: string;
    nombre: string;
}

// Tipos para la función de verificación de pedido
export interface VerificacionPedidoParams {
    id: string;
    puntoId: string;
}

// Tipos para la función de creación de pedido
export interface CrearPedidoParams {
    data: PedidoData;
}

// Tipos para la función de obtención de puntos
export interface GetPuntosParams {
    id: string;
}

// Tipos para la función de obtención de clientes
export interface GetClientesParams {
    terminoBuscador: string;
    idUsuario: string;
    acceso: AccesoUsuario;
}

// Tipos para los estilos del componente
export interface StyleSheet {
    container: any;
    containerNuevo: any;
    subContainerNuevo: any;
    contenedorMonto: any;
    tituloForm: any;
    btnFormaLlenar: any;
    icon: any;
    textForma: any;
    iconCheck: any;
    input: any;
    nuevaFrecuencia: any;
    eliminarFrecuencia: any;
    iconFrecuencia: any;
    textGuardar: any;
    contenedorFrecuencia: any;
    btnFrecuencia: any;
    modalSelectorStyle: any;
    modalSelectorText: any;
    modalSelectorItem: any;
    modalSelectorItemText: any;
    modalSelectorList: any;
    puntosEntregaContainer: any;
    puntosEntregaTitle: any;
    puntoEntregaCard: any;
    puntoEntregaCardSelected: any;
    puntoEntregaCardSingle: any;
    puntoEntregaHeader: any;
    puntoEntregaIcon: any;
    puntoEntregaIconSelected: any;
    puntoEntregaIconImage: any;
    puntoEntregaInfo: any;
    puntoEntregaDireccion: any;
    puntoEntregaCapacidad: any;
    puntoEntregaObservacion: any;
    puntoEntregaCheckContainer: any;
    puntoEntregaCheckIcon: any;
    puntoEntregaBadge: any;
    puntoEntregaBadgeText: any;
    inputNovedades: any;
    btnGuardar: any;
    btnGuardarDisable: any;
    iconGuardar: any;
    iconGuardarDisable: any;
    textGuardarDisable: any;
    contenedorModalCliente: any;
    subContenedorModalCliente: any;
    btnModalClose: any;
    iconCerrar: any;
    tituloModal: any;
    calendar: any;
    modalOverlay: any;
    modalContainer: any;
    modalHeader: any;
    modalTitle: any;
    modalCloseButton: any;
    modalCloseIcon: any;
    modalSearchContainer: any;
    modalSearchInputContainer: any;
    modalSearchInput: any;
    modalSearchButton: any;
    modalSearchIcon: any;
    modalContent: any;
    modalScrollView: any;
    modalEmptyState: any;
    modalEmptyIcon: any;
    modalEmptyText: any;
    modalEmptySubtext: any;
    modalFooter: any;
    modalCancelButton: any;
    modalCancelText: any;
    clienteCard: any;
    clienteCardInactive: any;
    clienteCardContent: any;
    clienteAvatar: any;
    clienteAvatarInactive: any;
    clienteAvatarIcon: any;
    clienteAvatarIconInactive: any;
    clienteInfo: any;
    clienteRazonSocial: any;
    clienteNombre: any;
    clienteCodt: any;
    clienteTextInactive: any;
    clienteStatusBadge: any;
    clienteStatusBadgeActive: any;
    clienteStatusBadgeInactive: any;
    clienteStatusText: any;
    clienteStatusTextActive: any;
    clienteStatusTextInactive: any;
    clienteArrowContainer: any;
    clienteArrowIcon: any;
    clienteArrowIconInactive: any;
}
