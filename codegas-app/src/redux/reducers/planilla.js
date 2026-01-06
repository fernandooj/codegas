import {
    PLANILLA_LOADING,
    PLANILLA_SUCCESS,
    PLANILLA_ERROR,
    PLANILLA_CREATE_LOADING,
    PLANILLA_CREATE_SUCCESS,
    PLANILLA_CREATE_ERROR,
    PLANILLA_UPDATE_LOADING,
    PLANILLA_UPDATE_SUCCESS,
    PLANILLA_UPDATE_ERROR,
    PLANILLA_DELETE_LOADING,
    PLANILLA_DELETE_SUCCESS,
    PLANILLA_DELETE_ERROR,
    PLANILLA_PEDIDOS_LOADING,
    PLANILLA_PEDIDOS_SUCCESS,
    PLANILLA_PEDIDOS_ERROR
} from '../actions/planillaActions';

const initialState = {
    planillas: [],
    pedidos: [],
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingPedidos: false,
    error: null,
    errorCreate: null,
    errorUpdate: null,
    errorDelete: null,
    errorPedidos: null
};

const planillaReducer = (state = initialState, action) => {
    switch (action.type) {
        case PLANILLA_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case PLANILLA_SUCCESS:
            return {
                ...state,
                loading: false,
                planillas: action.payload,
                error: null
            };

        case PLANILLA_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                planillas: []
            };

        case PLANILLA_CREATE_LOADING:
            return {
                ...state,
                loadingCreate: true,
                errorCreate: null
            };

        case PLANILLA_CREATE_SUCCESS:
            return {
                ...state,
                loadingCreate: false,
                planillas: [...state.planillas, action.payload],
                errorCreate: null
            };

        case PLANILLA_CREATE_ERROR:
            return {
                ...state,
                loadingCreate: false,
                errorCreate: action.payload
            };

        case PLANILLA_UPDATE_LOADING:
            return {
                ...state,
                loadingUpdate: true,
                errorUpdate: null
            };

        case PLANILLA_UPDATE_SUCCESS:
            return {
                ...state,
                loadingUpdate: false,
                planillas: state.planillas.map(planilla =>
                    planilla._id === action.payload._id ? action.payload : planilla
                ),
                errorUpdate: null
            };

        case PLANILLA_UPDATE_ERROR:
            return {
                ...state,
                loadingUpdate: false,
                errorUpdate: action.payload
            };

        case PLANILLA_DELETE_LOADING:
            return {
                ...state,
                loadingDelete: true,
                errorDelete: null
            };

        case PLANILLA_DELETE_SUCCESS:
            return {
                ...state,
                loadingDelete: false,
                planillas: state.planillas.filter(planilla => planilla._id !== action.payload),
                errorDelete: null
            };

        case PLANILLA_DELETE_ERROR:
            return {
                ...state,
                loadingDelete: false,
                errorDelete: action.payload
            };

        case PLANILLA_PEDIDOS_LOADING:
            return {
                ...state,
                loadingPedidos: true,
                errorPedidos: null
            };

        case PLANILLA_PEDIDOS_SUCCESS:
            return {
                ...state,
                loadingPedidos: false,
                pedidos: action.payload,
                errorPedidos: null
            };

        case PLANILLA_PEDIDOS_ERROR:
            return {
                ...state,
                loadingPedidos: false,
                errorPedidos: action.payload,
                pedidos: []
            };

        default:
            return state;
    }
};

export default planillaReducer;

