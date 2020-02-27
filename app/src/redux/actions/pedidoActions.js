import {
    GET_PEDIDO,
    GET_PEDIDOS,
    GET_VEHICULOS_PEDIDOS,
    GET_ZONA_PEDIDOS,
    GET_PEDIDOS_FRECUENCIA,
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

const getPedidos = fechaEntrega => {
  console.log({fechaEntrega})
  return dispatch => {
    return axios
      .get(`ped/pedido/todos/${fechaEntrega}`,)
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
  console.log({data})
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

const getZonasPedidos = (fechaEntrega) => {
  console.log({fechaEntrega})
  return dispatch => {
    return axios
      .get(`zon/zona/pedido/${fechaEntrega}`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_ZONA_PEDIDOS,
          zonaPedidos: res.data.zona
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const getFrecuencia = () => {
  return dispatch => {
    return axios
      .get(`ped/pedido/ver_frecuencia/todos`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_PEDIDOS_FRECUENCIA,
          pedidosFrecuencia: res.data.pedidos
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
    getVehiculosConPedidos,
    getZonasPedidos,
    getFrecuencia
};
