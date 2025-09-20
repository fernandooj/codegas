import axios from 'axios';

// Action types
export const REPORTE_EMERGENCIA_LOADING = 'REPORTE_EMERGENCIA_LOADING';
export const REPORTE_EMERGENCIA_SUCCESS = 'REPORTE_EMERGENCIA_SUCCESS';
export const REPORTE_EMERGENCIA_ERROR = 'REPORTE_EMERGENCIA_ERROR';
export const REPORTE_EMERGENCIA_SEARCH = 'REPORTE_EMERGENCIA_SEARCH';
export const REPORTE_EMERGENCIA_BY_ID_LOADING = 'REPORTE_EMERGENCIA_BY_ID_LOADING';
export const REPORTE_EMERGENCIA_BY_ID_SUCCESS = 'REPORTE_EMERGENCIA_BY_ID_SUCCESS';
export const REPORTE_EMERGENCIA_BY_ID_ERROR = 'REPORTE_EMERGENCIA_BY_ID_ERROR';
export const REPORTE_EMERGENCIA_CREATE_LOADING = 'REPORTE_EMERGENCIA_CREATE_LOADING';
export const REPORTE_EMERGENCIA_CREATE_SUCCESS = 'REPORTE_EMERGENCIA_CREATE_SUCCESS';
export const REPORTE_EMERGENCIA_CREATE_ERROR = 'REPORTE_EMERGENCIA_CREATE_ERROR';
export const REPORTE_EMERGENCIA_CLOSE_LOADING = 'REPORTE_EMERGENCIA_CLOSE_LOADING';
export const REPORTE_EMERGENCIA_CLOSE_SUCCESS = 'REPORTE_EMERGENCIA_CLOSE_SUCCESS';
export const REPORTE_EMERGENCIA_CLOSE_ERROR = 'REPORTE_EMERGENCIA_CLOSE_ERROR';
export const REPORTE_EMERGENCIA_UPLOAD_LOADING = 'REPORTE_EMERGENCIA_UPLOAD_LOADING';
export const REPORTE_EMERGENCIA_UPLOAD_SUCCESS = 'REPORTE_EMERGENCIA_UPLOAD_SUCCESS';
export const REPORTE_EMERGENCIA_UPLOAD_ERROR = 'REPORTE_EMERGENCIA_UPLOAD_ERROR';

// Action creators
export const getReportesEmergencia = (start = 0, limit = 100, search = '') => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_LOADING });

        try {
            const response = await axios.get(`/rep/reporte-emergencia/${start}/${limit}/${search}`);
            dispatch({
                type: REPORTE_EMERGENCIA_SUCCESS,
                payload: response.data.reporte || []
            });
        } catch (error) {
            console.error('Error fetching reportes emergencia:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_ERROR,
                payload: error.message
            });
        }
    };
};

export const getReporteEmergenciaById = (reporteId) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_BY_ID_LOADING });

        try {
            const response = await axios.get(`/rep/reporte-emergencia/byId/${reporteId}`);
            dispatch({
                type: REPORTE_EMERGENCIA_BY_ID_SUCCESS,
                payload: response.data.reporte
            });
        } catch (error) {
            console.error('Error fetching reporte by id:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_BY_ID_ERROR,
                payload: error.message
            });
        }
    };
};

export const createReporteEmergencia = (reporteData) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_CREATE_LOADING });

        try {
            const response = await axios({
                method: 'post',
                url: `/rep/reporte-emergencia`,
                data: JSON.stringify(reporteData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            dispatch({
                type: REPORTE_EMERGENCIA_CREATE_SUCCESS,
                payload: response.data.reporte
            });
        } catch (error) {
            console.error('Error creating reporte emergencia:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_CREATE_ERROR,
                payload: error.message
            });
        }
    };
};

export const closeReporteEmergencia = (closeData) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_CLOSE_LOADING });

        try {
            const response = await axios({
                method: 'put',
                url: `/rep/reporte-emergencia/cerrar`,
                data: JSON.stringify(closeData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            dispatch({
                type: REPORTE_EMERGENCIA_CLOSE_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            console.error('Error closing reporte emergencia:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_CLOSE_ERROR,
                payload: error.message
            });
        }
    };
};

export const uploadImagenReporteEmergencia = (imagenData) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_UPLOAD_LOADING });

        try {
            const response = await axios({
                method: 'PUT',
                url: `/rep/reporte-emergencia/add-images-reporte-emergencia`,
                data: JSON.stringify(imagenData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            dispatch({
                type: REPORTE_EMERGENCIA_UPLOAD_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            console.error('Error uploading imagen:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_UPLOAD_ERROR,
                payload: error.message
            });
        }
    };
};

export const searchReportesEmergencia = (searchTerm) => {
    return (dispatch) => {
        dispatch({
            type: REPORTE_EMERGENCIA_SEARCH,
            payload: searchTerm
        });
    };
};
