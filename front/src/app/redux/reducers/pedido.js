import {
  GET_PEDIDO,
  GET_PEDIDOS,
} from "../actions/constants/actionsTypes";
 
 
const getPedido = (state = [], action) => {
  switch (action.type) {
    case GET_PEDIDO:
      return action.pedido;
    default:
      return state;
  }
};
const getPedidos = (state = [], action) => {
  switch (action.type) {
    case GET_PEDIDOS:
      return action.pedidos;
    default:
      return state;
  }
};
 
 
export default function authServiceReducer(state = {}, action) {
  return {   
    pedido:  getPedido(state.pedido, action),
    pedidos: getPedidos(state.pedidos, action),
  };
}
