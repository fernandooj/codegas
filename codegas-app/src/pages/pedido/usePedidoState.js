import { useReducer, useCallback } from 'react';
import { pedidoReducer, initialState, pedidoActions } from './pedidoReducer';

// Hook personalizado para manejar el estado del pedido
export const usePedidoState = () => {
    const [state, dispatch] = useReducer(pedidoReducer, initialState);

    // Funciones helper para actualizar el estado
    const updateState = useCallback((action) => {
        dispatch(action);
    }, []);

    // Función para actualizar múltiples campos a la vez
    const updateMultiple = useCallback((updates) => {
        dispatch(pedidoActions.updateMultiple(updates));
    }, []);

    // Función para establecer datos de un pedido seleccionado
    const setPedidoData = useCallback((pedidoData) => {
        dispatch(pedidoActions.setPedidoData(pedidoData));
    }, []);

    // Función para resetear datos del pedido seleccionado
    const resetPedidoData = useCallback(() => {
        dispatch(pedidoActions.resetPedidoData());
    }, []);

    // Función para abrir modal y establecer datos del pedido
    const openPedidoModal = useCallback((pedidoData) => {
        dispatch(pedidoActions.setOpenModal(true));
        dispatch(pedidoActions.setElevation(0));
        dispatch(pedidoActions.setPedidoData(pedidoData));

        // Si el pedido ya está activo, establecer estadoChangedClicked a true
        // para que se muestre el botón de asignar vehículo
        if (pedidoData.estado === 'activo') {
            dispatch(pedidoActions.setEstadoChangedClicked(true));
        }
    }, []);

    // Función para cerrar modal y resetear datos
    const closePedidoModal = useCallback(() => {
        dispatch(pedidoActions.setOpenModal(false));
        dispatch(pedidoActions.setElevation(7));
        dispatch(pedidoActions.resetPedidoData());
        dispatch(pedidoActions.setEstadoChangedClicked(false)); // Resetear el flag
    }, []);

    // Función para manejar el teclado
    const handleKeyboardShow = useCallback(() => {
        dispatch(pedidoActions.setKeyboard(true));
    }, []);

    const handleKeyboardHide = useCallback(() => {
        dispatch(pedidoActions.setKeyboard(false));
    }, []);

    // Función para manejar búsqueda
    const handleSearch = useCallback((termino) => {
        if (termino && termino.length > 1) {
            dispatch(pedidoActions.setTerminoBuscador(termino));
            dispatch(pedidoActions.setShowSearch(true));
            return true; // Indica que se puede hacer la búsqueda
        } else {
            return false; // Indica que no se puede hacer la búsqueda
        }
    }, []);

    const clearSearch = useCallback(() => {
        dispatch(pedidoActions.setShowSearch(false));
        dispatch(pedidoActions.setTerminoBuscador(undefined));
    }, []);

    // Función para manejar paginación
    const handleScroll = useCallback((event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const reachedEnd = contentOffset.y + layoutMeasurement.height >= contentSize.height;

        if (reachedEnd && !state.final) {
            dispatch(pedidoActions.setFinal(true));
            dispatch(pedidoActions.setLimit(state.limit + 10));
            return true; // Indica que se debe cargar más datos
        } else if (!reachedEnd && state.final) {
            dispatch(pedidoActions.setFinal(false));
        }
        return false; // No se necesita cargar más datos
    }, [state.final, state.limit]);

    // Función para resetear formularios
    const resetForm = useCallback(() => {
        dispatch(pedidoActions.setKilosTexto(""));
        dispatch(pedidoActions.setRemisionTexto(""));
        dispatch(pedidoActions.setFacturaTexto(""));
        dispatch(pedidoActions.setValorTotalTexto(""));
        dispatch(pedidoActions.setFormaPagoTexto(""));
        dispatch(pedidoActions.setNovedad(""));
    }, []);

    // Función para resetear filtros
    const resetFilters = useCallback(() => {
        dispatch(pedidoActions.setTerminoBuscador(undefined));
        dispatch(pedidoActions.setFechasFiltro(["0", "1"]));
        dispatch(pedidoActions.setFechaEntregaFiltro(new Date().toISOString().split('T')[0]));
        dispatch(pedidoActions.setFechaSolicitudFiltro(undefined));
        dispatch(pedidoActions.setShowSearch(false));
    }, []);

    return {
        // Estado
        state,

        // Funciones de actualización individual
        updateState,

        // Funciones helper específicas
        updateMultiple,
        setPedidoData,
        resetPedidoData,
        openPedidoModal,
        closePedidoModal,
        handleKeyboardShow,
        handleKeyboardHide,
        handleSearch,
        clearSearch,
        handleScroll,
        resetForm,
        resetFilters,

        // Acciones directas (para casos específicos)
        actions: pedidoActions,
    };
};
