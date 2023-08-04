import {
    GET_REVISIONES,
    GET_REVISION_BY_PUNTO
} from "../actions/constants/actionsTypes";
 
 

const getRevisiones = (state = [], action) => {
  switch (action.type) {
    case GET_REVISIONES:
      return action.revisiones;
    default:
      return state;
  }
};

const getRevisionByPunto = (state = [], action) => {
  switch (action.type) {
    case GET_REVISION_BY_PUNTO:
      return action.revision_by_punto;
    default:
      return state;
  }
};
 
 
 
export default function authServiceReducer(state = {}, action) {
  return {   
    revisiones: getRevisiones(state.revisiones, action),
    revision_by_punto: getRevisionByPunto(state.revision_by_punto, action),
  };
}
