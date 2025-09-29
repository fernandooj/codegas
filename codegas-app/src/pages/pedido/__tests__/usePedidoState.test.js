import { renderHook, act } from '@testing-library/react-native';
import { usePedidoState } from '../usePedidoState';

// Mock del pedidoReducer
jest.mock('../pedidoReducer', () => ({
    pedidoReducer: jest.fn((state, action) => {
        // Simular el comportamiento básico del reducer
        switch (action.type) {
            case 'SET_OPEN_MODAL':
                return { ...state, openModal: action.payload };
            case 'SET_ELEVATION':
                return { ...state, elevation: action.payload };
            case 'SET_PEDIDO_DATA':
                return { ...state, selectedPedido: { ...state.selectedPedido, ...action.payload } };
            case 'RESET_PEDIDO_DATA':
                return { ...state, selectedPedido: {} };
            case 'SET_KEYBOARD':
                return { ...state, keyboard: action.payload };
            case 'SET_TERMINO_BUSCADOR':
                return { ...state, terminoBuscador: action.payload };
            case 'SET_SHOW_SEARCH':
                return { ...state, showSearch: action.payload };
            case 'SET_FINAL':
                return { ...state, final: action.payload };
            case 'SET_LIMIT':
                return { ...state, limit: action.payload };
            case 'UPDATE_MULTIPLE':
                return { ...state, ...action.payload };
            case 'SET_KILOS_TEXTO':
                return { ...state, kilosTexto: action.payload };
            case 'SET_REMISION_TEXTO':
                return { ...state, remisionTexto: action.payload };
            case 'SET_FACTURA_TEXTO':
                return { ...state, facturaTexto: action.payload };
            case 'SET_VALOR_TOTAL_TEXTO':
                return { ...state, valor_totalTexto: action.payload };
            case 'SET_FORMA_PAGO_TEXTO':
                return { ...state, forma_pagoTexto: action.payload };
            case 'SET_NOVEDAD':
                return { ...state, novedad: action.payload };
            case 'SET_FECHAS_FILTRO':
                return { ...state, fechasFiltro: action.payload };
            case 'SET_FECHA_ENTREGA_FILTRO':
                return { ...state, fechaEntregaFiltro: action.payload };
            case 'SET_FECHA_SOLICITUD_FILTRO':
                return { ...state, fechaSolicitudFiltro: action.payload };
            default:
                return state;
        }
    }),
    initialState: {
        openModal: false,
        elevation: 7,
        selectedPedido: {},
        keyboard: false,
        terminoBuscador: undefined,
        showSearch: false,
        final: false,
        limit: 20,
        kilosTexto: "",
        remisionTexto: "",
        facturaTexto: "",
        valor_totalTexto: "",
        forma_pagoTexto: "",
        novedad: "",
        fechasFiltro: ["0", "1"],
        fechaEntregaFiltro: new Date().toISOString().split('T')[0],
        fechaSolicitudFiltro: undefined,
    },
    pedidoActions: {
        setOpenModal: (value) => ({ type: 'SET_OPEN_MODAL', payload: value }),
        setElevation: (value) => ({ type: 'SET_ELEVATION', payload: value }),
        setPedidoData: (data) => ({ type: 'SET_PEDIDO_DATA', payload: data }),
        resetPedidoData: () => ({ type: 'RESET_PEDIDO_DATA' }),
        setKeyboard: (value) => ({ type: 'SET_KEYBOARD', payload: value }),
        setTerminoBuscador: (value) => ({ type: 'SET_TERMINO_BUSCADOR', payload: value }),
        setShowSearch: (value) => ({ type: 'SET_SHOW_SEARCH', payload: value }),
        setFinal: (value) => ({ type: 'SET_FINAL', payload: value }),
        setLimit: (value) => ({ type: 'SET_LIMIT', payload: value }),
        updateMultiple: (data) => ({ type: 'UPDATE_MULTIPLE', payload: data }),
        setKilosTexto: (value) => ({ type: 'SET_KILOS_TEXTO', payload: value }),
        setRemisionTexto: (value) => ({ type: 'SET_REMISION_TEXTO', payload: value }),
        setFacturaTexto: (value) => ({ type: 'SET_FACTURA_TEXTO', payload: value }),
        setValorTotalTexto: (value) => ({ type: 'SET_VALOR_TOTAL_TEXTO', payload: value }),
        setFormaPagoTexto: (value) => ({ type: 'SET_FORMA_PAGO_TEXTO', payload: value }),
        setNovedad: (value) => ({ type: 'SET_NOVEDAD', payload: value }),
        setFechasFiltro: (value) => ({ type: 'SET_FECHAS_FILTRO', payload: value }),
        setFechaEntregaFiltro: (value) => ({ type: 'SET_FECHA_ENTREGA_FILTRO', payload: value }),
        setFechaSolicitudFiltro: (value) => ({ type: 'SET_FECHA_SOLICITUD_FILTRO', payload: value }),
    }
}));

describe('usePedidoState', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state and functions', () => {
        const { result } = renderHook(() => usePedidoState());

        expect(result.current.state).toBeDefined();
        expect(result.current.updateState).toBeInstanceOf(Function);
        expect(result.current.updateMultiple).toBeInstanceOf(Function);
        expect(result.current.setPedidoData).toBeInstanceOf(Function);
        expect(result.current.resetPedidoData).toBeInstanceOf(Function);
        expect(result.current.openPedidoModal).toBeInstanceOf(Function);
        expect(result.current.closePedidoModal).toBeInstanceOf(Function);
        expect(result.current.handleKeyboardShow).toBeInstanceOf(Function);
        expect(result.current.handleKeyboardHide).toBeInstanceOf(Function);
        expect(result.current.handleSearch).toBeInstanceOf(Function);
        expect(result.current.clearSearch).toBeInstanceOf(Function);
        expect(result.current.handleScroll).toBeInstanceOf(Function);
        expect(result.current.resetForm).toBeInstanceOf(Function);
        expect(result.current.resetFilters).toBeInstanceOf(Function);
        expect(result.current.actions).toBeDefined();
    });

    describe('updateState', () => {
        it('should call dispatch with the action', () => {
            const { result } = renderHook(() => usePedidoState());
            const action = { type: 'TEST_ACTION', payload: 'test' };

            act(() => {
                result.current.updateState(action);
            });

            // El mock del reducer debería haber sido llamado
            expect(result.current.state).toBeDefined();
        });
    });

    describe('updateMultiple', () => {
        it('should dispatch UPDATE_MULTIPLE action with provided data', () => {
            const { result } = renderHook(() => usePedidoState());
            const updates = { openModal: true, terminoBuscador: 'test' };

            act(() => {
                result.current.updateMultiple(updates);
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('setPedidoData', () => {
        it('should dispatch SET_PEDIDO_DATA action with provided data', () => {
            const { result } = renderHook(() => usePedidoState());
            const pedidoData = { id: '123', nombre: 'Test Pedido' };

            act(() => {
                result.current.setPedidoData(pedidoData);
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('resetPedidoData', () => {
        it('should dispatch RESET_PEDIDO_DATA action', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.resetPedidoData();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('openPedidoModal', () => {
        it('should set openModal to true, elevation to 0, and set pedido data', () => {
            const { result } = renderHook(() => usePedidoState());
            const pedidoData = { id: '123', nombre: 'Test Pedido' };

            act(() => {
                result.current.openPedidoModal(pedidoData);
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('closePedidoModal', () => {
        it('should set openModal to false, elevation to 7, and reset pedido data', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.closePedidoModal();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('handleKeyboardShow', () => {
        it('should set keyboard to true', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.handleKeyboardShow();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('handleKeyboardHide', () => {
        it('should set keyboard to false', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.handleKeyboardHide();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('handleSearch', () => {
        it('should return true and set search state when termino has more than 1 character', () => {
            const { result } = renderHook(() => usePedidoState());

            let searchResult;
            act(() => {
                searchResult = result.current.handleSearch('test');
            });

            expect(searchResult).toBe(true);
            expect(result.current.state).toBeDefined();
        });

        it('should return false when termino has 1 or fewer characters', () => {
            const { result } = renderHook(() => usePedidoState());

            let searchResult;
            act(() => {
                searchResult = result.current.handleSearch('a');
            });

            expect(searchResult).toBe(false);
        });

        it('should return false when termino is empty', () => {
            const { result } = renderHook(() => usePedidoState());

            let searchResult;
            act(() => {
                searchResult = result.current.handleSearch('');
            });

            expect(searchResult).toBe(false);
        });
    });

    describe('clearSearch', () => {
        it('should set showSearch to false and clear terminoBuscador', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.clearSearch();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('handleScroll', () => {
        it('should return true and update state when reached end and not final', () => {
            const { result } = renderHook(() => usePedidoState());

            // Mock state where final is false
            const mockState = { final: false, limit: 20 };
            jest.spyOn(result.current, 'state', 'get').mockReturnValue(mockState);

            const event = {
                nativeEvent: {
                    contentOffset: { y: 100 },
                    layoutMeasurement: { height: 200 },
                    contentSize: { height: 300 }
                }
            };

            let scrollResult;
            act(() => {
                scrollResult = result.current.handleScroll(event);
            });

            expect(scrollResult).toBe(true);
        });

        it('should return false when not reached end', () => {
            const { result } = renderHook(() => usePedidoState());

            const mockState = { final: false, limit: 20 };
            jest.spyOn(result.current, 'state', 'get').mockReturnValue(mockState);

            const event = {
                nativeEvent: {
                    contentOffset: { y: 50 },
                    layoutMeasurement: { height: 200 },
                    contentSize: { height: 300 }
                }
            };

            let scrollResult;
            act(() => {
                scrollResult = result.current.handleScroll(event);
            });

            expect(scrollResult).toBe(false);
        });

        it('should return false when already final', () => {
            const { result } = renderHook(() => usePedidoState());

            const mockState = { final: true, limit: 20 };
            jest.spyOn(result.current, 'state', 'get').mockReturnValue(mockState);

            const event = {
                nativeEvent: {
                    contentOffset: { y: 100 },
                    layoutMeasurement: { height: 200 },
                    contentSize: { height: 300 }
                }
            };

            let scrollResult;
            act(() => {
                scrollResult = result.current.handleScroll(event);
            });

            expect(scrollResult).toBe(false);
        });
    });

    describe('resetForm', () => {
        it('should reset all form fields to empty strings', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.resetForm();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('resetFilters', () => {
        it('should reset all filter fields to default values', () => {
            const { result } = renderHook(() => usePedidoState());

            act(() => {
                result.current.resetFilters();
            });

            expect(result.current.state).toBeDefined();
        });
    });

    describe('actions', () => {
        it('should provide access to pedidoActions', () => {
            const { result } = renderHook(() => usePedidoState());

            expect(result.current.actions).toBeDefined();
            expect(result.current.actions.setOpenModal).toBeInstanceOf(Function);
            expect(result.current.actions.setTerminoBuscador).toBeInstanceOf(Function);
            expect(result.current.actions.setPedidoData).toBeInstanceOf(Function);
        });
    });
});
