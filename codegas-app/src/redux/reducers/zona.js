import {
    GET_ZONAS,
    CREATE_ZONA,
    UPDATE_ZONA,
    DELETE_ZONA
} from "../actions/constants/actionsTypes";

const initialState = {
    zonas: []
};

const zona = (state = initialState, action) => {
    switch (action.type) {
        case GET_ZONAS:
            return {
                ...state,
                zonas: action.zonas
            };

        case CREATE_ZONA:
            return {
                ...state,
                zonas: [...state.zonas, action.zona]
            };

        case UPDATE_ZONA:
            return {
                ...state,
                zonas: state.zonas.map(zona =>
                    zona._id === action.zona._id ? action.zona : zona
                )
            };

        case DELETE_ZONA:
            return {
                ...state,
                zonas: state.zonas.filter(zona => zona._id !== action.zonaId)
            };

        default:
            return state;
    }
};

export default zona;
