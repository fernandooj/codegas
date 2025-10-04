import {
    GET_CONVERSACION,
    GET_CONVERSACIONES,
    GET_MENSAJES,
  } from "../actions/constants/actionsTypes";

const getConversacion = (state = {usuarioId1:{}, usuarioId2:{} }, action) => {
  switch (action.type) {
    case GET_CONVERSACION:
      return action.conversacion;
    default:
      return state;
  }
};


const getConversaciones = (state = [], action) => {
    switch (action.type) {
      case GET_CONVERSACIONES:
        return action.conversaciones;
      default:
        return state;
    }
  };

const getMensaje = (state = [], action) => {
  switch (action.type) {
    case GET_MENSAJES:
      return action.mensajes;
    default:
      return state;
  }
};

  
export default function reducer(state = {}, action) {
    return {
      mensaje:        getMensaje(state.mensaje, action),
      conversacion:   getConversacion(state.conversacion, action),
      conversaciones: getConversaciones(state.conversaciones, action),
    };
}
  