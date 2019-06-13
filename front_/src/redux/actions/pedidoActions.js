import {
    GET_PEDIDO,
    GET_PEDIDOS,
} from "./constants/actionsTypes";
import axios from "axios";


const getPedido = pedidoId => {
  return dispatch => {
    return axios
      .get(`/ped/pedido/${pedidoId}`)
      .then(res => {
        dispatch({
          type: GET_PEDIDO,
          pedido: res.data.pedido
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const getPedidos = data => {
  return dispatch => {
    return axios
      .get(`ped/pedido`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_PEDIDOS,
          pedidos: res.data.pedido
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
  

export {
    getPedido,
    getPedidos,
};
