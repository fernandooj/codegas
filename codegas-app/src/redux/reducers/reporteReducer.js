import {
    REPORTE_EMERGENCIA_LOADING,
    REPORTE_EMERGENCIA_SUCCESS,
    REPORTE_EMERGENCIA_ERROR,
    REPORTE_EMERGENCIA_SEARCH,
    REPORTE_EMERGENCIA_BY_ID_LOADING,
    REPORTE_EMERGENCIA_BY_ID_SUCCESS,
    REPORTE_EMERGENCIA_BY_ID_ERROR,
    REPORTE_EMERGENCIA_CREATE_LOADING,
    REPORTE_EMERGENCIA_CREATE_SUCCESS,
    REPORTE_EMERGENCIA_CREATE_ERROR,
    REPORTE_EMERGENCIA_CLOSE_LOADING,
    REPORTE_EMERGENCIA_CLOSE_SUCCESS,
    REPORTE_EMERGENCIA_CLOSE_ERROR,
    REPORTE_EMERGENCIA_UPLOAD_LOADING,
    REPORTE_EMERGENCIA_UPLOAD_SUCCESS,
    REPORTE_EMERGENCIA_UPLOAD_ERROR
} from '../actions/reporteActions';

const initialState = {
    reportes: [],
    currentReporte: null,
    loading: false,
    loadingById: false,
    loadingCreate: false,
    loadingClose: false,
    loadingUpload: false,
    error: null,
    errorById: null,
    errorCreate: null,
    errorClose: null,
    errorUpload: null,
    searchTerm: '',
    start: 0,
    limit: 100
};

const reporteReducer = (state = initialState, action) => {
    switch (action.type) {
        case REPORTE_EMERGENCIA_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case REPORTE_EMERGENCIA_SUCCESS:
            return {
                ...state,
                loading: false,
                reportes: action.payload,
                error: null
            };

        case REPORTE_EMERGENCIA_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                reportes: []
            };

        case REPORTE_EMERGENCIA_BY_ID_LOADING:
            return {
                ...state,
                loadingById: true,
                errorById: null
            };

        case REPORTE_EMERGENCIA_BY_ID_SUCCESS:
            return {
                ...state,
                loadingById: false,
                currentReporte: action.payload,
                errorById: null
            };

        case REPORTE_EMERGENCIA_BY_ID_ERROR:
            return {
                ...state,
                loadingById: false,
                errorById: action.payload,
                currentReporte: null
            };

        case REPORTE_EMERGENCIA_CREATE_LOADING:
            return {
                ...state,
                loadingCreate: true,
                errorCreate: null
            };

        case REPORTE_EMERGENCIA_CREATE_SUCCESS:
            return {
                ...state,
                loadingCreate: false,
                currentReporte: action.payload,
                errorCreate: null
            };

        case REPORTE_EMERGENCIA_CREATE_ERROR:
            return {
                ...state,
                loadingCreate: false,
                errorCreate: action.payload
            };

        case REPORTE_EMERGENCIA_CLOSE_LOADING:
            return {
                ...state,
                loadingClose: true,
                errorClose: null
            };

        case REPORTE_EMERGENCIA_CLOSE_SUCCESS:
            return {
                ...state,
                loadingClose: false,
                errorClose: null
            };

        case REPORTE_EMERGENCIA_CLOSE_ERROR:
            return {
                ...state,
                loadingClose: false,
                errorClose: action.payload
            };

        case REPORTE_EMERGENCIA_UPLOAD_LOADING:
            return {
                ...state,
                loadingUpload: true,
                errorUpload: null
            };

        case REPORTE_EMERGENCIA_UPLOAD_SUCCESS:
            return {
                ...state,
                loadingUpload: false,
                errorUpload: null
            };

        case REPORTE_EMERGENCIA_UPLOAD_ERROR:
            return {
                ...state,
                loadingUpload: false,
                errorUpload: action.payload
            };

        case REPORTE_EMERGENCIA_SEARCH:
            return {
                ...state,
                searchTerm: action.payload
            };

        case 'CLEAR_REPORTE_STATE':
            return {
                ...initialState,
                searchTerm: state.searchTerm, // Mantener el término de búsqueda
                start: state.start,
                limit: state.limit
            };

        default:
            return state;
    }
};

export default reporteReducer;
