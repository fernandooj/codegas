import {
    GET_PEDIDO,
    GET_PEDIDOS,
    GET_VEHICULOS_PEDIDOS,
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

const getVehiculosConPedidos = (data) => {
  return dispatch => {
    return axios
      .get(`ped/pedido/vehiculosConPedidos/${data}`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_VEHICULOS_PEDIDOS,
          vehiculosPedidos: res.data.carro
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
    getVehiculosConPedidos
};
