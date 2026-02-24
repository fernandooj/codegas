import { GET_CARTERA, GET_CARTERA_REQUEST, CLEAR_CARTERA } from "../actions/constants/actionsTypes";

const initialState = {
  cartera: [],
  nit: null,
  total: 0,
  error: null,
  loading: false
};

const magisterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CARTERA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_CARTERA:
      return {
        ...state,
        cartera: action.cartera || [],
        nit: action.nit || null,
        total: action.total || 0,
        error: action.error || null,
        loading: false
      };
    
    case CLEAR_CARTERA:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

export default magisterReducer;

