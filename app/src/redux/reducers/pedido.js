import {
  GET_PEDIDO,
  GET_PEDIDOS,
  GET_VEHICULOS_PEDIDOS,
  GET_ZONA_PEDIDOS,
  GET_PEDIDOS_FRECUENCIA,
  GET_PEDIDOS_USER
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
 
const getVehiculosConPedidos = (state = [], action) => {
  switch (action.type) {
    case GET_VEHICULOS_PEDIDOS:
      return action.vehiculosPedidos;
    default:
      return state;
  }
};

const getZonasPedidos = (state = [], action) => {
  switch (action.type) {
    case GET_ZONA_PEDIDOS:
      return action.zonaPedidos;
    default:
      return state;
  }
};

const getFrecuencia = (state = [], action) => {
  switch (action.type) {
    case GET_PEDIDOS_FRECUENCIA:
      return action.pedidosFrecuencia;
    default:
      return state;
  }
};

const getPedidosUser = (state = [], action) => {
  switch (action.type) {
    case GET_PEDIDOS_USER:
      return action.pedidosUser;
    default:
      return state;
  }
};


export default function authServiceReducer(state = {}, action) {
  return {   
    pedido:           getPedido(state.pedido, action),
    pedidos:          getPedidos(state.pedidos, action),
    pedidosUser:      getPedidosUser(state.pedidosUser, action),
    vehiculosPedidos: getVehiculosConPedidos(state.vehiculosPedidos, action),
    zonaPedidos:      getZonasPedidos(state.zonaPedidos, action),
    pedidosFrecuencia:getFrecuencia(state.pedidosFrecuencia, action),
  };
}
