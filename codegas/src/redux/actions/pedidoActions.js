import {
    GET_PEDIDO,
    GET_PEDIDOS,
    GET_VEHICULOS_PEDIDOS,
    GET_ZONA_PEDIDOS,
    GET_PEDIDOS_FRECUENCIA,
    GET_PEDIDOS_USER,
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

const getPedidoByUser = userId => {
  return dispatch => {
    return axios
      .get(`/ped/pedido/byUser/${userId}`)
      .then(res => {
        dispatch({
          type: GET_PEDIDOS_USER,
          pedidosUser: res.data.pedido
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};


const getPedidos = (idUser, start, limit, acceso, search) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/ped/pedido/todos/app/${idUser}/${limit}/${start}/${acceso}/${search}`);
      if(response.status!==200){
        throw new Error(`Ruquest failed with status ${response.status}`)
      }
      dispatch({
        type: GET_PEDIDOS,
        pedidos: response.data.pedido,
      });
    } catch (err) {
      dispatch({
        type: GET_PEDIDOS,
        pedidos: [] ,
      });
    }
  };
};


const getVehiculosConPedidos = (data) => {
  return dispatch => {
    return axios
      .get(`ped/pedido/vehiculosConPedidos/${data}`)
      .then(res => {
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
  return dispatch => {
    return axios
      .get(`zon/zona/pedido/${fechaEntrega}`)
      .then(res => {
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
    getFrecuencia,
    getPedidoByUser
};
