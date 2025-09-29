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
import moment from "moment";


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
      });
  };
};


const getPedidos = (idUser, start, limit, acceso, search, estado = 'todos', ordenPor = 'fecha_creacion', tipoOrden = 'DESC') => {
  return async (dispatch) => {
    try {
      // Validar parámetros antes de hacer la petición
      const validIdUser = idUser && idUser !== 'undefined' ? idUser : '0';
      const validStart = start && start !== 'undefined' ? start : '0';
      const validLimit = limit && limit !== 'undefined' ? limit : '10';
      const validAcceso = acceso && acceso !== 'undefined' ? acceso : 'all';
      const validSearch = search && search !== 'undefined' && search !== '' ? search : 'all';
      const validEstado = estado && estado !== 'undefined' ? estado : 'todos';
      const validOrdenPor = ordenPor && ordenPor !== 'undefined' ? ordenPor : 'fecha_creacion';
      const validTipoOrden = tipoOrden && tipoOrden !== 'undefined' ? tipoOrden : 'DESC';


      // Construir URL y mostrarla para debug
      const newUrl = `/ped/pedido/todos/app/${validIdUser}/${validLimit}/${validStart}/${validAcceso}/${validSearch}/${validEstado}/${validOrdenPor}/${validTipoOrden}`;

      // Usar la nueva ruta con todos los parámetros (backend debe estar actualizado)
      const response = await axios.get(newUrl);

      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`)
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
          pedidosFrecuencia: res.data.frecuencias || []
        });
      })
      .catch(err => {
        console.error('Error loading frecuencias:', err);
        dispatch({
          type: GET_PEDIDOS_FRECUENCIA,
          pedidosFrecuencia: []
        });
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

// Acción para obtener novedades por pedido
const getNovedadesByPedido = async (pedidoId) => {
  try {
    const response = await axios.get(`nov/novedad/byPedido/${pedidoId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getNovedadesByPedido:', {
      function: 'getNovedadesByPedido',
      pedidoId: pedidoId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para guardar novedad inactivo
const guardarNovedadInactivo = async (pedidoId, novedad, conductorId = null) => {
  try {
    const response = await axios.post(`ped/pedido/novedad`, {
      _id: pedidoId,
      novedad,
      perfil_novedad: 'inactivo',
      fechaEntrega: moment().format('YYYY-MM-DD HH:mm:ss'),
      conductorId: conductorId
    });
    return response.data;
  } catch (error) {
    console.error('Error en guardarNovedadInactivo:', {
      function: 'guardarNovedadInactivo',
      pedidoId: pedidoId,
      novedad: novedad,
      conductorId: conductorId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para asignar conductor
const asignarConductor = async (id, idVehiculo, fechaEntrega, usuarioAsigna) => {
  try {
    const response = await axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}/${fechaEntrega}/${usuarioAsigna}`);
    return response.data;
  } catch (error) {
    console.error('Error en asignarConductor:', {
      function: 'asignarConductor',
      id: id,
      idVehiculo: idVehiculo,
      fechaEntrega: fechaEntrega,
      usuarioAsigna: usuarioAsigna,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para asignar fecha de entrega
const asignarFechaEntrega = async (seleccionados) => {
  try {
    const data = { seleccionados };
    const response = await axios({
      method: 'post',
      url: `ped/pedido/asignarFechaEntrega`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en asignarFechaEntrega:', {
      function: 'asignarFechaEntrega',
      seleccionados: seleccionados,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para guardar novedad al cerrar pedido
const guardarNovedadCerrarPedido = async (id, fechaEntrega, novedad, perfil_novedad, conductorId = null) => {
  try {
    const response = await axios.post('ped/pedido/novedad', {
      _id: id,
      fechaEntrega,
      novedad,
      perfil_novedad,
      conductorId
    });
    return response.data;
  } catch (error) {
    console.error('Error en guardarNovedadCerrarPedido:', {
      function: 'guardarNovedadCerrarPedido',
      id: id,
      fechaEntrega: fechaEntrega,
      novedad: novedad,
      perfil_novedad: perfil_novedad,
      conductorId: conductorId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para finalizar pedido
const finalizarPedido = async (id, pedidoData) => {
  try {
    // Extraer mime type de la imagen base64 si existe
    let mimeType = null;
    let imagenFinal = pedidoData.imagen;

    if (pedidoData.imagen && pedidoData.imagen.startsWith('data:')) {
      // Extraer mime type del formato: data:image/jpeg;base64,/9j/4AAQ...
      const mimeMatch = pedidoData.imagen.match(/data:([^;]+);base64,/);
      mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    }

    // Enviar como JSON (como el backend espera con JSON.parse)
    const data = {
      email: pedidoData.email || '',
      _id: id,
      kilos: pedidoData.kilos,
      factura: pedidoData.factura,
      valor_total: pedidoData.valor_total,
      forma_pago: pedidoData.forma_pago,
      fechaEntrega: pedidoData.fechaEntrega,
      remision: pedidoData.remision,
      imagen: imagenFinal, // Enviar imagen en base64 si existe
      mime: mimeType       // Mime type extraído de la imagen
    };


    const response = await axios({
      method: 'post',
      url: `ped/pedido/finalizar/${pedidoData.idUsuario || 1}`, // Usar idUsuario como idConductor
      data: data, // Enviar como JSON object (axios lo convertirá automáticamente)
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en finalizarPedido:', {
      function: 'finalizarPedido',
      id: id,
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

// Acción para cambiar estado del pedido
const cambiarEstadoPedido = async (seleccionados) => {
  try {
    const data = { seleccionados };
    const response = await axios({
      method: 'post',
      url: `ped/pedido/cambiarEstado`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en cambiarEstadoPedido:', {
      function: 'cambiarEstadoPedido',
      seleccionados: seleccionados,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const resetPedido = async (pedidoId) => {
  try {
    console.log('🔍 resetPedido action - pedidoId:', pedidoId);
    console.log('🔍 URL endpoint:', `/ped/pedido/reset/${pedidoId}`);

    const response = await axios.post(`/ped/pedido/reset/${pedidoId}`);
    console.log('🔍 Respuesta del servidor:', response.data);

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Error al resetear el pedido');
    }
  } catch (error) {
    console.error('Error reseteando pedido:', error);
    console.error('Error response:', error.response);
    return {
      status: false,
      message: error.response?.data?.message || 'Error al resetear el pedido'
    };
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
  crearPedido,
  getNovedadesByPedido,
  guardarNovedadInactivo,
  asignarConductor,
  asignarFechaEntrega,
  guardarNovedadCerrarPedido,
  finalizarPedido,
  cambiarEstadoPedido,
  resetPedido
};
