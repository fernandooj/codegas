// Pedido Reducer - Maneja todos los estados del componente Pedido
export const PEDIDO_ACTIONS = {
    // Modal states
    SET_OPEN_MODAL: 'SET_OPEN_MODAL',
    SET_MODAL_CONDUCTOR: 'SET_MODAL_CONDUCTOR',
    SET_MODAL_FECHA_ENTREGA: 'SET_MODAL_FECHA_ENTREGA',
    SET_MODAL_ZONA: 'SET_MODAL_ZONA',
    SET_MODAL_NOVEDAD: 'SET_MODAL_NOVEDAD',
    SET_MODAL_PERFILES: 'SET_MODAL_PERFILES',
    SET_MODAL_CARROS_FILTRO: 'SET_MODAL_CARROS_FILTRO',
    SET_MODAL_ZONAS: 'SET_MODAL_ZONAS',
    SET_MODAL_CERRAR_PEDIDO: 'SET_MODAL_CERRAR_PEDIDO',
    SET_MODAL_ORDENAMIENTO: 'SET_MODAL_ORDENAMIENTO',
    SET_MODAL_RESET_PEDIDO: 'SET_MODAL_RESET_PEDIDO',
    SET_ESTADO_CHANGED_CLICKED: 'SET_ESTADO_CHANGED_CLICKED',

    // Search and filter states
    SET_TERMINO_BUSCADOR: 'SET_TERMINO_BUSCADOR',
    SET_FECHAS_FILTRO: 'SET_FECHAS_FILTRO',
    SET_FECHA_ENTREGA_FILTRO: 'SET_FECHA_ENTREGA_FILTRO',
    SET_FECHA_SOLICITUD_FILTRO: 'SET_FECHA_SOLICITUD_FILTRO',
    SET_SHOW_SEARCH: 'SET_SHOW_SEARCH',
    SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
    SET_ESTADO_FILTRO: 'SET_ESTADO_FILTRO',
    SET_ORDEN_POR: 'SET_ORDEN_POR',
    SET_TIPO_ORDEN: 'SET_TIPO_ORDEN',

    // Pagination states
    SET_INICIO: 'SET_INICIO',
    SET_FINAL: 'SET_FINAL',
    SET_LIMIT: 'SET_LIMIT',

    // Data states
    SET_PEDIDOS_FILTRO: 'SET_PEDIDOS_FILTRO',
    SET_ZONA_PEDIDOS: 'SET_ZONA_PEDIDOS',
    SET_AVATAR: 'SET_AVATAR',
    SET_NOVEDADES: 'SET_NOVEDADES',
    SET_ZONAS: 'SET_ZONAS',

    // UI states
    SET_ELEVATION: 'SET_ELEVATION',
    SET_KEYBOARD: 'SET_KEYBOARD',
    SET_SHOW_NOVEDADES: 'SET_SHOW_NOVEDADES',
    SET_SHOW_SPIN: 'SET_SHOW_SPIN',
    SET_SHOW_SPIN1: 'SET_SHOW_SPIN1',
    SET_BOUNCES: 'SET_BOUNCES',
    SET_SHOW_CALENDAR: 'SET_SHOW_CALENDAR',
    SET_HEIGHT: 'SET_HEIGHT',

    // Form states
    SET_KILOS_TEXTO: 'SET_KILOS_TEXTO',
    SET_REMISION_TEXTO: 'SET_REMISION_TEXTO',
    SET_FACTURA_TEXTO: 'SET_FACTURA_TEXTO',
    SET_VALOR_TOTAL_TEXTO: 'SET_VALOR_TOTAL_TEXTO',
    SET_FORMA_PAGO_TEXTO: 'SET_FORMA_PAGO_TEXTO',
    SET_NOVEDAD: 'SET_NOVEDAD',

    // Selected pedido states
    SET_PEDIDO_DATA: 'SET_PEDIDO_DATA',
    RESET_PEDIDO_DATA: 'RESET_PEDIDO_DATA',

    // Multiple field update
    UPDATE_MULTIPLE: 'UPDATE_MULTIPLE',
};

// Estado inicial
export const initialState = {
    // Modal states
    openModal: false,
    modalConductor: false,
    modalFechaEntrega: false,
    modalZona: false,
    modalNovedad: false,
    modalPerfiles: false,
    modalCarrosFiltro: false,
    modalZonas: false,
    modalCerrarPedido: false,
    modalOrdenamiento: false,
    modalResetPedido: false,
    estadoChangedClicked: false,

    // Search and filter states
    terminoBuscador: undefined,
    fechasFiltro: ["0", "1"],
    fechaEntregaFiltro: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    fechaSolicitudFiltro: undefined,
    showSearch: false,
    searchLoading: false,
    estadoFiltro: 'todos', // Estado para filtrar pedidos (se cambiará dinámicamente según el acceso)
    ordenPor: 'fecha_creacion', // Campo por el cual ordenar
    tipoOrden: 'DESC', // ASC o DESC

    // Pagination states
    inicio: 0,
    final: false,
    limit: 10,

    // Data states
    pedidosFiltro: [],
    zonaPedidos: [],
    avatar: [],
    novedades: [],
    zonas: undefined,

    // UI states
    elevation: 7,
    keyboard: false,
    showNovedades: false,
    showSpin: false,
    showSpin1: false,
    bounces: undefined,
    showCalendar: false,
    height: undefined,

    // Form states
    kilosTexto: "",
    remisionTexto: "",
    facturaTexto: "",
    valor_totalTexto: "",
    forma_pagoTexto: "",
    novedad: "",

    // Selected pedido data (todos los campos del pedido seleccionado)
    selectedPedido: {
        id: undefined,
        estado: undefined,
        estadoEntrega: undefined,
        usuarioId: undefined,
        nombre: undefined,
        razon_social: undefined,
        codt: undefined,
        email: undefined,
        tokenPhone: undefined,
        cedula: undefined,
        forma: undefined,
        cantidad: undefined,
        entregado: undefined,
        imagenCerrar: undefined,
        pedidopadre: undefined,
        factura: undefined,
        kilos: undefined,
        remision: undefined,
        forma_pago: undefined,
        valor_total: undefined,
        nPedido: undefined,
        estadoInicial: undefined,
        capacidad: undefined,
        cantidadKl: undefined,
        cantidadPrecio: undefined,
        observacion_pedido: undefined,
        observacion: undefined,
        puntoId: undefined,
        usuarioCrea: undefined,
        creado: undefined,
        motivo_no_cierre: undefined,
        perfil_novedad: undefined,
        placaPedido: undefined,
        conductorPedido: undefined,
        valor_unitarioUsuario: undefined,
        imagenPedido: undefined,
        fechaEntrega: undefined,
        idVehiculo: undefined,
        placa: undefined,
        textEstado: undefined,
        imagen: undefined,
        perfil: undefined,
        idZona: undefined,
        coordenadas: undefined,
        punto_email: undefined,
        punto_celular: undefined,
        punto_nombre: undefined,
        checklist: [],
        firma_conductor: undefined,
        firma_usuario: undefined,
        firma_conductor_checklist: undefined,
        firma_usuario_checklist: undefined,
        presion_inicial: undefined,
        presion_final: undefined,
        porcentaje_inicial: undefined,
        porcentaje_final: undefined,
    }
};

// Reducer function
export const pedidoReducer = (state, action) => {
    switch (action.type) {
        // Modal states
        case PEDIDO_ACTIONS.SET_OPEN_MODAL:
            return { ...state, openModal: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_CONDUCTOR:
            return { ...state, modalConductor: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_FECHA_ENTREGA:
            return { ...state, modalFechaEntrega: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_ZONA:
            return { ...state, modalZona: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_NOVEDAD:
            return { ...state, modalNovedad: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_PERFILES:
            return { ...state, modalPerfiles: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_CARROS_FILTRO:
            return { ...state, modalCarrosFiltro: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_ZONAS:
            return { ...state, modalZonas: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_CERRAR_PEDIDO:
            return { ...state, modalCerrarPedido: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_ORDENAMIENTO:
            return { ...state, modalOrdenamiento: action.payload };
        case PEDIDO_ACTIONS.SET_MODAL_RESET_PEDIDO:
            return { ...state, modalResetPedido: action.payload };
        case PEDIDO_ACTIONS.SET_ESTADO_CHANGED_CLICKED:
            return { ...state, estadoChangedClicked: action.payload };

        // Search and filter states
        case PEDIDO_ACTIONS.SET_TERMINO_BUSCADOR:
            return { ...state, terminoBuscador: action.payload };
        case PEDIDO_ACTIONS.SET_FECHAS_FILTRO:
            return { ...state, fechasFiltro: action.payload };
        case PEDIDO_ACTIONS.SET_FECHA_ENTREGA_FILTRO:
            return { ...state, fechaEntregaFiltro: action.payload };
        case PEDIDO_ACTIONS.SET_FECHA_SOLICITUD_FILTRO:
            return { ...state, fechaSolicitudFiltro: action.payload };
        case PEDIDO_ACTIONS.SET_SHOW_SEARCH:
            return { ...state, showSearch: action.payload };
        case PEDIDO_ACTIONS.SET_SEARCH_LOADING:
            return { ...state, searchLoading: action.payload };
        case PEDIDO_ACTIONS.SET_ESTADO_FILTRO:
            return { ...state, estadoFiltro: action.payload };
        case PEDIDO_ACTIONS.SET_ORDEN_POR:
            return { ...state, ordenPor: action.payload };
        case PEDIDO_ACTIONS.SET_TIPO_ORDEN:
            return { ...state, tipoOrden: action.payload };

        // Pagination states
        case PEDIDO_ACTIONS.SET_INICIO:
            return { ...state, inicio: action.payload };
        case PEDIDO_ACTIONS.SET_FINAL:
            return { ...state, final: action.payload };
        case PEDIDO_ACTIONS.SET_LIMIT:
            return { ...state, limit: action.payload };

        // Data states
        case PEDIDO_ACTIONS.SET_PEDIDOS_FILTRO:
            return { ...state, pedidosFiltro: action.payload };
        case PEDIDO_ACTIONS.SET_ZONA_PEDIDOS:
            return { ...state, zonaPedidos: action.payload };
        case PEDIDO_ACTIONS.SET_AVATAR:
            return { ...state, avatar: action.payload };
        case PEDIDO_ACTIONS.SET_NOVEDADES:
            return { ...state, novedades: action.payload };
        case PEDIDO_ACTIONS.SET_ZONAS:
            return { ...state, zonas: action.payload };

        // UI states
        case PEDIDO_ACTIONS.SET_ELEVATION:
            return { ...state, elevation: action.payload };
        case PEDIDO_ACTIONS.SET_KEYBOARD:
            return { ...state, keyboard: action.payload };
        case PEDIDO_ACTIONS.SET_SHOW_NOVEDADES:
            return { ...state, showNovedades: action.payload };
        case PEDIDO_ACTIONS.SET_SHOW_SPIN:
            return { ...state, showSpin: action.payload };
        case PEDIDO_ACTIONS.SET_SHOW_SPIN1:
            return { ...state, showSpin1: action.payload };
        case PEDIDO_ACTIONS.SET_BOUNCES:
            return { ...state, bounces: action.payload };
        case PEDIDO_ACTIONS.SET_SHOW_CALENDAR:
            return { ...state, showCalendar: action.payload };
        case PEDIDO_ACTIONS.SET_HEIGHT:
            return { ...state, height: action.payload };

        // Form states
        case PEDIDO_ACTIONS.SET_KILOS_TEXTO:
            return { ...state, kilosTexto: action.payload };
        case PEDIDO_ACTIONS.SET_REMISION_TEXTO:
            return { ...state, remisionTexto: action.payload };
        case PEDIDO_ACTIONS.SET_FACTURA_TEXTO:
            return { ...state, facturaTexto: action.payload };
        case PEDIDO_ACTIONS.SET_VALOR_TOTAL_TEXTO:
            return { ...state, valor_totalTexto: action.payload };
        case PEDIDO_ACTIONS.SET_FORMA_PAGO_TEXTO:
            return { ...state, forma_pagoTexto: action.payload };
        case PEDIDO_ACTIONS.SET_NOVEDAD:
            return { ...state, novedad: action.payload };

        // Selected pedido data
        case PEDIDO_ACTIONS.SET_PEDIDO_DATA:
            return {
                ...state,
                selectedPedido: {
                    ...state.selectedPedido,
                    ...action.payload
                }
            };
        case PEDIDO_ACTIONS.RESET_PEDIDO_DATA:
            return {
                ...state,
                selectedPedido: initialState.selectedPedido
            };

        // Multiple field update
        case PEDIDO_ACTIONS.UPDATE_MULTIPLE:
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;
    }
};

// Action creators para facilitar el uso
export const pedidoActions = {
    // Modal actions
    setOpenModal: (value) => ({ type: PEDIDO_ACTIONS.SET_OPEN_MODAL, payload: value }),
    setModalConductor: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_CONDUCTOR, payload: value }),
    setModalFechaEntrega: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_FECHA_ENTREGA, payload: value }),
    setModalZona: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_ZONA, payload: value }),
    setModalNovedad: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_NOVEDAD, payload: value }),
    setModalPerfiles: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_PERFILES, payload: value }),
    setModalCarrosFiltro: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_CARROS_FILTRO, payload: value }),
    setModalZonas: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_ZONAS, payload: value }),
    setModalCerrarPedido: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_CERRAR_PEDIDO, payload: value }),
    setModalOrdenamiento: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_ORDENAMIENTO, payload: value }),
    setModalResetPedido: (value) => ({ type: PEDIDO_ACTIONS.SET_MODAL_RESET_PEDIDO, payload: value }),
    setEstadoChangedClicked: (value) => ({ type: PEDIDO_ACTIONS.SET_ESTADO_CHANGED_CLICKED, payload: value }),

    // Search and filter actions
    setTerminoBuscador: (value) => ({ type: PEDIDO_ACTIONS.SET_TERMINO_BUSCADOR, payload: value }),
    setFechasFiltro: (value) => ({ type: PEDIDO_ACTIONS.SET_FECHAS_FILTRO, payload: value }),
    setFechaEntregaFiltro: (value) => ({ type: PEDIDO_ACTIONS.SET_FECHA_ENTREGA_FILTRO, payload: value }),
    setFechaSolicitudFiltro: (value) => ({ type: PEDIDO_ACTIONS.SET_FECHA_SOLICITUD_FILTRO, payload: value }),
    setShowSearch: (value) => ({ type: PEDIDO_ACTIONS.SET_SHOW_SEARCH, payload: value }),
    setSearchLoading: (value) => ({ type: PEDIDO_ACTIONS.SET_SEARCH_LOADING, payload: value }),
    setEstadoFiltro: (value) => ({ type: PEDIDO_ACTIONS.SET_ESTADO_FILTRO, payload: value }),
    setOrdenPor: (value) => ({ type: PEDIDO_ACTIONS.SET_ORDEN_POR, payload: value }),
    setTipoOrden: (value) => ({ type: PEDIDO_ACTIONS.SET_TIPO_ORDEN, payload: value }),

    // Pagination actions
    setInicio: (value) => ({ type: PEDIDO_ACTIONS.SET_INICIO, payload: value }),
    setFinal: (value) => ({ type: PEDIDO_ACTIONS.SET_FINAL, payload: value }),
    setLimit: (value) => ({ type: PEDIDO_ACTIONS.SET_LIMIT, payload: value }),

    // Data actions
    setPedidosFiltro: (value) => ({ type: PEDIDO_ACTIONS.SET_PEDIDOS_FILTRO, payload: value }),
    setZonaPedidos: (value) => ({ type: PEDIDO_ACTIONS.SET_ZONA_PEDIDOS, payload: value }),
    setAvatar: (value) => ({ type: PEDIDO_ACTIONS.SET_AVATAR, payload: value }),
    setNovedades: (value) => ({ type: PEDIDO_ACTIONS.SET_NOVEDADES, payload: value }),
    setZonas: (value) => ({ type: PEDIDO_ACTIONS.SET_ZONAS, payload: value }),

    // UI actions
    setElevation: (value) => ({ type: PEDIDO_ACTIONS.SET_ELEVATION, payload: value }),
    setKeyboard: (value) => ({ type: PEDIDO_ACTIONS.SET_KEYBOARD, payload: value }),
    setShowNovedades: (value) => ({ type: PEDIDO_ACTIONS.SET_SHOW_NOVEDADES, payload: value }),
    setShowSpin: (value) => ({ type: PEDIDO_ACTIONS.SET_SHOW_SPIN, payload: value }),
    setShowSpin1: (value) => ({ type: PEDIDO_ACTIONS.SET_SHOW_SPIN1, payload: value }),
    setBounces: (value) => ({ type: PEDIDO_ACTIONS.SET_BOUNCES, payload: value }),
    setShowCalendar: (value) => ({ type: PEDIDO_ACTIONS.SET_SHOW_CALENDAR, payload: value }),
    setHeight: (value) => ({ type: PEDIDO_ACTIONS.SET_HEIGHT, payload: value }),

    // Form actions
    setKilosTexto: (value) => ({ type: PEDIDO_ACTIONS.SET_KILOS_TEXTO, payload: value }),
    setRemisionTexto: (value) => ({ type: PEDIDO_ACTIONS.SET_REMISION_TEXTO, payload: value }),
    setFacturaTexto: (value) => ({ type: PEDIDO_ACTIONS.SET_FACTURA_TEXTO, payload: value }),
    setValorTotalTexto: (value) => ({ type: PEDIDO_ACTIONS.SET_VALOR_TOTAL_TEXTO, payload: value }),
    setFormaPagoTexto: (value) => ({ type: PEDIDO_ACTIONS.SET_FORMA_PAGO_TEXTO, payload: value }),
    setNovedad: (value) => ({ type: PEDIDO_ACTIONS.SET_NOVEDAD, payload: value }),

    // Selected pedido actions
    setPedidoData: (data) => ({ type: PEDIDO_ACTIONS.SET_PEDIDO_DATA, payload: data }),
    resetPedidoData: () => ({ type: PEDIDO_ACTIONS.RESET_PEDIDO_DATA }),

    // Multiple update action
    updateMultiple: (data) => ({ type: PEDIDO_ACTIONS.UPDATE_MULTIPLE, payload: data }),
};
