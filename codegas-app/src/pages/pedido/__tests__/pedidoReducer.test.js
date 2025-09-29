import { pedidoReducer, initialState, PEDIDO_ACTIONS, pedidoActions } from '../pedidoReducer';

describe('pedidoReducer', () => {
    describe('initialState', () => {
        it('should have correct initial state', () => {
            expect(initialState).toEqual({
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

                // Search and filter states
                terminoBuscador: undefined,
                fechasFiltro: ["0", "1"],
                fechaEntregaFiltro: expect.any(String), // Date string
                fechaSolicitudFiltro: undefined,
                showSearch: false,
                estadoFiltro: 'todos',
                ordenPor: 'fecha_creacion',
                tipoOrden: 'DESC',

                // Pagination states
                inicio: 0,
                final: false,
                limit: 20,

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

                // Selected pedido data
                selectedPedido: expect.objectContaining({
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
                })
            });
        });
    });

    describe('Modal actions', () => {
        it('should handle SET_OPEN_MODAL', () => {
            const action = { type: PEDIDO_ACTIONS.SET_OPEN_MODAL, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.openModal).toBe(true);
        });

        it('should handle SET_MODAL_CONDUCTOR', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_CONDUCTOR, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalConductor).toBe(true);
        });

        it('should handle SET_MODAL_FECHA_ENTREGA', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_FECHA_ENTREGA, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalFechaEntrega).toBe(true);
        });

        it('should handle SET_MODAL_ZONA', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_ZONA, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalZona).toBe(true);
        });

        it('should handle SET_MODAL_NOVEDAD', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_NOVEDAD, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalNovedad).toBe(true);
        });

        it('should handle SET_MODAL_PERFILES', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_PERFILES, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalPerfiles).toBe(true);
        });

        it('should handle SET_MODAL_CARROS_FILTRO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_CARROS_FILTRO, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalCarrosFiltro).toBe(true);
        });

        it('should handle SET_MODAL_ZONAS', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_ZONAS, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalZonas).toBe(true);
        });

        it('should handle SET_MODAL_CERRAR_PEDIDO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_CERRAR_PEDIDO, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalCerrarPedido).toBe(true);
        });

        it('should handle SET_MODAL_ORDENAMIENTO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_ORDENAMIENTO, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalOrdenamiento).toBe(true);
        });

        it('should handle SET_MODAL_RESET_PEDIDO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_MODAL_RESET_PEDIDO, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.modalResetPedido).toBe(true);
        });
    });

    describe('Search and filter actions', () => {
        it('should handle SET_TERMINO_BUSCADOR', () => {
            const action = { type: PEDIDO_ACTIONS.SET_TERMINO_BUSCADOR, payload: 'test search' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.terminoBuscador).toBe('test search');
        });

        it('should handle SET_FECHAS_FILTRO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_FECHAS_FILTRO, payload: ['2023-01-01', '2023-12-31'] };
            const newState = pedidoReducer(initialState, action);
            expect(newState.fechasFiltro).toEqual(['2023-01-01', '2023-12-31']);
        });

        it('should handle SET_FECHA_ENTREGA_FILTRO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_FECHA_ENTREGA_FILTRO, payload: '2023-06-15' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.fechaEntregaFiltro).toBe('2023-06-15');
        });

        it('should handle SET_FECHA_SOLICITUD_FILTRO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_FECHA_SOLICITUD_FILTRO, payload: '2023-06-10' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.fechaSolicitudFiltro).toBe('2023-06-10');
        });

        it('should handle SET_SHOW_SEARCH', () => {
            const action = { type: PEDIDO_ACTIONS.SET_SHOW_SEARCH, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.showSearch).toBe(true);
        });

        it('should handle SET_ESTADO_FILTRO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_ESTADO_FILTRO, payload: 'activo' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.estadoFiltro).toBe('activo');
        });

        it('should handle SET_ORDEN_POR', () => {
            const action = { type: PEDIDO_ACTIONS.SET_ORDEN_POR, payload: 'nombre' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.ordenPor).toBe('nombre');
        });

        it('should handle SET_TIPO_ORDEN', () => {
            const action = { type: PEDIDO_ACTIONS.SET_TIPO_ORDEN, payload: 'ASC' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.tipoOrden).toBe('ASC');
        });
    });

    describe('Pagination actions', () => {
        it('should handle SET_INICIO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_INICIO, payload: 10 };
            const newState = pedidoReducer(initialState, action);
            expect(newState.inicio).toBe(10);
        });

        it('should handle SET_FINAL', () => {
            const action = { type: PEDIDO_ACTIONS.SET_FINAL, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.final).toBe(true);
        });

        it('should handle SET_LIMIT', () => {
            const action = { type: PEDIDO_ACTIONS.SET_LIMIT, payload: 50 };
            const newState = pedidoReducer(initialState, action);
            expect(newState.limit).toBe(50);
        });
    });

    describe('Data actions', () => {
        it('should handle SET_PEDIDOS_FILTRO', () => {
            const pedidos = [{ id: '1', nombre: 'Test' }];
            const action = { type: PEDIDO_ACTIONS.SET_PEDIDOS_FILTRO, payload: pedidos };
            const newState = pedidoReducer(initialState, action);
            expect(newState.pedidosFiltro).toEqual(pedidos);
        });

        it('should handle SET_ZONA_PEDIDOS', () => {
            const zonas = [{ id: '1', nombre: 'Zona 1' }];
            const action = { type: PEDIDO_ACTIONS.SET_ZONA_PEDIDOS, payload: zonas };
            const newState = pedidoReducer(initialState, action);
            expect(newState.zonaPedidos).toEqual(zonas);
        });

        it('should handle SET_AVATAR', () => {
            const avatars = ['avatar1.jpg', 'avatar2.jpg'];
            const action = { type: PEDIDO_ACTIONS.SET_AVATAR, payload: avatars };
            const newState = pedidoReducer(initialState, action);
            expect(newState.avatar).toEqual(avatars);
        });

        it('should handle SET_NOVEDADES', () => {
            const novedades = [{ id: '1', novedad: 'Test novedad' }];
            const action = { type: PEDIDO_ACTIONS.SET_NOVEDADES, payload: novedades };
            const newState = pedidoReducer(initialState, action);
            expect(newState.novedades).toEqual(novedades);
        });

        it('should handle SET_ZONAS', () => {
            const zonas = [{ id: '1', nombre: 'Zona 1' }];
            const action = { type: PEDIDO_ACTIONS.SET_ZONAS, payload: zonas };
            const newState = pedidoReducer(initialState, action);
            expect(newState.zonas).toEqual(zonas);
        });
    });

    describe('UI actions', () => {
        it('should handle SET_ELEVATION', () => {
            const action = { type: PEDIDO_ACTIONS.SET_ELEVATION, payload: 5 };
            const newState = pedidoReducer(initialState, action);
            expect(newState.elevation).toBe(5);
        });

        it('should handle SET_KEYBOARD', () => {
            const action = { type: PEDIDO_ACTIONS.SET_KEYBOARD, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.keyboard).toBe(true);
        });

        it('should handle SET_SHOW_NOVEDADES', () => {
            const action = { type: PEDIDO_ACTIONS.SET_SHOW_NOVEDADES, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.showNovedades).toBe(true);
        });

        it('should handle SET_SHOW_SPIN', () => {
            const action = { type: PEDIDO_ACTIONS.SET_SHOW_SPIN, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.showSpin).toBe(true);
        });

        it('should handle SET_SHOW_SPIN1', () => {
            const action = { type: PEDIDO_ACTIONS.SET_SHOW_SPIN1, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.showSpin1).toBe(true);
        });

        it('should handle SET_BOUNCES', () => {
            const action = { type: PEDIDO_ACTIONS.SET_BOUNCES, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.bounces).toBe(true);
        });

        it('should handle SET_SHOW_CALENDAR', () => {
            const action = { type: PEDIDO_ACTIONS.SET_SHOW_CALENDAR, payload: true };
            const newState = pedidoReducer(initialState, action);
            expect(newState.showCalendar).toBe(true);
        });

        it('should handle SET_HEIGHT', () => {
            const action = { type: PEDIDO_ACTIONS.SET_HEIGHT, payload: 500 };
            const newState = pedidoReducer(initialState, action);
            expect(newState.height).toBe(500);
        });
    });

    describe('Form actions', () => {
        it('should handle SET_KILOS_TEXTO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_KILOS_TEXTO, payload: '100' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.kilosTexto).toBe('100');
        });

        it('should handle SET_REMISION_TEXTO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_REMISION_TEXTO, payload: 'REM001' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.remisionTexto).toBe('REM001');
        });

        it('should handle SET_FACTURA_TEXTO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_FACTURA_TEXTO, payload: 'FAC001' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.facturaTexto).toBe('FAC001');
        });

        it('should handle SET_VALOR_TOTAL_TEXTO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_VALOR_TOTAL_TEXTO, payload: '50000' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.valor_totalTexto).toBe('50000');
        });

        it('should handle SET_FORMA_PAGO_TEXTO', () => {
            const action = { type: PEDIDO_ACTIONS.SET_FORMA_PAGO_TEXTO, payload: 'Efectivo' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.forma_pagoTexto).toBe('Efectivo');
        });

        it('should handle SET_NOVEDAD', () => {
            const action = { type: PEDIDO_ACTIONS.SET_NOVEDAD, payload: 'Novedad test' };
            const newState = pedidoReducer(initialState, action);
            expect(newState.novedad).toBe('Novedad test');
        });
    });

    describe('Selected pedido actions', () => {
        it('should handle SET_PEDIDO_DATA', () => {
            const pedidoData = {
                id: '123',
                nombre: 'Test Pedido',
                estado: 'activo'
            };
            const action = { type: PEDIDO_ACTIONS.SET_PEDIDO_DATA, payload: pedidoData };
            const newState = pedidoReducer(initialState, action);
            expect(newState.selectedPedido).toEqual({
                ...initialState.selectedPedido,
                ...pedidoData
            });
        });

        it('should handle RESET_PEDIDO_DATA', () => {
            // First set some data
            const stateWithData = {
                ...initialState,
                selectedPedido: {
                    ...initialState.selectedPedido,
                    id: '123',
                    nombre: 'Test'
                }
            };

            const action = { type: PEDIDO_ACTIONS.RESET_PEDIDO_DATA };
            const newState = pedidoReducer(stateWithData, action);
            expect(newState.selectedPedido).toEqual(initialState.selectedPedido);
        });
    });

    describe('Multiple update action', () => {
        it('should handle UPDATE_MULTIPLE', () => {
            const updates = {
                openModal: true,
                modalConductor: true,
                terminoBuscador: 'test'
            };
            const action = { type: PEDIDO_ACTIONS.UPDATE_MULTIPLE, payload: updates };
            const newState = pedidoReducer(initialState, action);
            expect(newState.openModal).toBe(true);
            expect(newState.modalConductor).toBe(true);
            expect(newState.terminoBuscador).toBe('test');
        });
    });

    describe('Default case', () => {
        it('should return current state for unknown action', () => {
            const action = { type: 'UNKNOWN_ACTION', payload: 'test' };
            const newState = pedidoReducer(initialState, action);
            expect(newState).toBe(initialState);
        });
    });

    describe('Action creators', () => {
        it('should create correct action for setOpenModal', () => {
            const action = pedidoActions.setOpenModal(true);
            expect(action).toEqual({ type: PEDIDO_ACTIONS.SET_OPEN_MODAL, payload: true });
        });

        it('should create correct action for setTerminoBuscador', () => {
            const action = pedidoActions.setTerminoBuscador('test');
            expect(action).toEqual({ type: PEDIDO_ACTIONS.SET_TERMINO_BUSCADOR, payload: 'test' });
        });

        it('should create correct action for setPedidoData', () => {
            const data = { id: '123', nombre: 'Test' };
            const action = pedidoActions.setPedidoData(data);
            expect(action).toEqual({ type: PEDIDO_ACTIONS.SET_PEDIDO_DATA, payload: data });
        });

        it('should create correct action for resetPedidoData', () => {
            const action = pedidoActions.resetPedidoData();
            expect(action).toEqual({ type: PEDIDO_ACTIONS.RESET_PEDIDO_DATA });
        });

        it('should create correct action for updateMultiple', () => {
            const data = { openModal: true, terminoBuscador: 'test' };
            const action = pedidoActions.updateMultiple(data);
            expect(action).toEqual({ type: PEDIDO_ACTIONS.UPDATE_MULTIPLE, payload: data });
        });
    });
});
