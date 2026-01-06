import axios from 'axios';

// Action types
export const PLANILLA_LOADING = 'PLANILLA_LOADING';
export const PLANILLA_SUCCESS = 'PLANILLA_SUCCESS';
export const PLANILLA_ERROR = 'PLANILLA_ERROR';
export const PLANILLA_CREATE_LOADING = 'PLANILLA_CREATE_LOADING';
export const PLANILLA_CREATE_SUCCESS = 'PLANILLA_CREATE_SUCCESS';
export const PLANILLA_CREATE_ERROR = 'PLANILLA_CREATE_ERROR';
export const PLANILLA_UPDATE_LOADING = 'PLANILLA_UPDATE_LOADING';
export const PLANILLA_UPDATE_SUCCESS = 'PLANILLA_UPDATE_SUCCESS';
export const PLANILLA_UPDATE_ERROR = 'PLANILLA_UPDATE_ERROR';
export const PLANILLA_DELETE_LOADING = 'PLANILLA_DELETE_LOADING';
export const PLANILLA_DELETE_SUCCESS = 'PLANILLA_DELETE_SUCCESS';
export const PLANILLA_DELETE_ERROR = 'PLANILLA_DELETE_ERROR';
export const PLANILLA_PEDIDOS_LOADING = 'PLANILLA_PEDIDOS_LOADING';
export const PLANILLA_PEDIDOS_SUCCESS = 'PLANILLA_PEDIDOS_SUCCESS';
export const PLANILLA_PEDIDOS_ERROR = 'PLANILLA_PEDIDOS_ERROR';

// Action creators
export const getPlanillas = (userId, acceso) => {
    return async (dispatch) => {
        dispatch({ type: PLANILLA_LOADING });

        try {
            const response = await axios.get(`pla/planilla/${userId}/${acceso}`);
            if (response.data.status) {
                dispatch({
                    type: PLANILLA_SUCCESS,
                    payload: response.data.planillas || []
                });
            } else {
                dispatch({
                    type: PLANILLA_ERROR,
                    payload: response.data.message || 'Error al cargar planillas'
                });
            }
        } catch (error) {
            console.error('Error fetching planillas:', error);
            dispatch({
                type: PLANILLA_ERROR,
                payload: error.message || 'Error de conexión'
            });
        }
    };
};

export const createPlanilla = (planillaData) => {
    return async (dispatch) => {
        dispatch({ type: PLANILLA_CREATE_LOADING });

        try {
            const response = await axios.post('pla/planilla', planillaData);
            if (response.data.status) {
                dispatch({
                    type: PLANILLA_CREATE_SUCCESS,
                    payload: response.data.planilla
                });
                return { success: true, planilla: response.data.planilla };
            } else {
                dispatch({
                    type: PLANILLA_CREATE_ERROR,
                    payload: response.data.message || 'Error al crear planilla'
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error creating planilla:', error);
            dispatch({
                type: PLANILLA_CREATE_ERROR,
                payload: error.message || 'Error de conexión'
            });
            return { success: false, error: error.message };
        }
    };
};

export const updatePlanilla = (planillaId, planillaData) => {
    return async (dispatch) => {
        dispatch({ type: PLANILLA_UPDATE_LOADING });

        try {
            const response = await axios.put(`pla/planilla/${planillaId}`, planillaData);
            if (response.data.status) {
                dispatch({
                    type: PLANILLA_UPDATE_SUCCESS,
                    payload: response.data.planilla
                });
                return { success: true, planilla: response.data.planilla };
            } else {
                dispatch({
                    type: PLANILLA_UPDATE_ERROR,
                    payload: response.data.message || 'Error al actualizar planilla'
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error updating planilla:', error);
            dispatch({
                type: PLANILLA_UPDATE_ERROR,
                payload: error.message || 'Error de conexión'
            });
            return { success: false, error: error.message };
        }
    };
};

export const deletePlanilla = (planillaId) => {
    return async (dispatch) => {
        dispatch({ type: PLANILLA_DELETE_LOADING });

        try {
            const response = await axios.delete(`pla/planilla/${planillaId}`);
            if (response.data.status) {
                dispatch({
                    type: PLANILLA_DELETE_SUCCESS,
                    payload: planillaId
                });
                return { success: true };
            } else {
                dispatch({
                    type: PLANILLA_DELETE_ERROR,
                    payload: response.data.message || 'Error al eliminar planilla'
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error deleting planilla:', error);
            dispatch({
                type: PLANILLA_DELETE_ERROR,
                payload: error.message || 'Error de conexión'
            });
            return { success: false, error: error.message };
        }
    };
};

export const getPedidosConductorDia = (conductorId) => {
    return async (dispatch) => {
        dispatch({ type: PLANILLA_PEDIDOS_LOADING });

        try {
            const response = await axios.get(`pla/pedidos-conductor-dia/${conductorId}`);
            if (response.data.status) {
                dispatch({
                    type: PLANILLA_PEDIDOS_SUCCESS,
                    payload: response.data.pedidos || []
                });
            } else {
                dispatch({
                    type: PLANILLA_PEDIDOS_ERROR,
                    payload: response.data.message || 'Error al cargar pedidos'
                });
            }
        } catch (error) {
            console.error('Error fetching pedidos:', error);
            dispatch({
                type: PLANILLA_PEDIDOS_ERROR,
                payload: error.message || 'Error de conexión'
            });
        }
    };
};

