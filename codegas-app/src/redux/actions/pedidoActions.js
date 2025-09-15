import {
  GET_PEDIDO,
  GET_PEDIDOS,
  GET_VEHICULOS_PEDIDOS,
  GET_ZONA_PEDIDOS,
  GET_PEDIDOS_FRECUENCIA,
  GET_PEDIDOS_USER,
  GET_PEDIDOS_CHART
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
      // Validar parámetros antes de hacer la petición
      const validIdUser = idUser && idUser !== 'undefined' ? idUser : '0';
      const validStart = start && start !== 'undefined' ? start : '0';
      const validLimit = limit && limit !== 'undefined' ? limit : '10';
      const validAcceso = acceso && acceso !== 'undefined' ? acceso : 'all';
      const validSearch = search && search !== 'undefined' ? search : '';

      console.log('Parámetros validados:', { validIdUser, validStart, validLimit, validAcceso, validSearch });

      const response = await axios.get(`/ped/pedido/todos/app/${validIdUser}/${validLimit}/${validStart}/${validAcceso}/${validSearch}`);
      if (response.status !== 200) {
        throw new Error(`Ruquest failed with status ${response.status}`)
      }
      dispatch({
        type: GET_PEDIDOS,
        pedidos: response.data.pedido,
      });
    } catch (err) {
      console.error('Error en getPedidos:', err);
      dispatch({
        type: GET_PEDIDOS,
        pedidos: [],
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
      .get(`fre/frecuencia/todas`)
      .then(res => {
        dispatch({
          type: GET_PEDIDOS_FRECUENCIA,
          pedidosFrecuencia: res.data.frecuencias
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const getPedidosChart = (idUser) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/ped/pedido/chart/${idUser}`);
      if (response.status !== 200) {
        throw new Error(`Ruquest failed with status ${response.status}`)
      }
      console.log("response.data")
      console.log(response.data)
      dispatch({
        type: GET_PEDIDOS_CHART,
        pedidosChart: response.data.pedido,
      });
    } catch (err) {
      dispatch({
        type: GET_PEDIDOS_CHART,
        pedidos: [],
      });
    }
  };
};

// Nueva acción para verificar pedidos del día
const verificarPedidoHoy = async (userId, puntoId) => {
  try {
    const response = await axios.get(`ped/pedido/today/${userId}/${puntoId}`);
    return response.data;
  } catch (error) {
    console.error('Error en verificarPedidoHoy:', {
      function: 'verificarPedidoHoy',
      userId: userId,
      puntoId: puntoId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Nueva acción para crear pedido
const crearPedido = async (pedidoData) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'ped/pedido',
      data: JSON.stringify(pedidoData),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en crearPedido:', {
      function: 'crearPedido',
      pedidoData: pedidoData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};


export {
  getPedido,
  getPedidos,
  getVehiculosConPedidos,
  getZonasPedidos,
  getFrecuencia,
  getPedidoByUser,
  getPedidosChart,
  verificarPedidoHoy,
  crearPedido
};
