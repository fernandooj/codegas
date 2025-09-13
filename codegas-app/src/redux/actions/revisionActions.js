import {
  GET_REVISIONES,
  GET_REVISION_BY_PUNTO
} from "./constants/actionsTypes";
import axios from "axios";



const getRevisiones = (start, limit, search) => {
  return dispatch => {
    return axios
      .get(`/rev/revision/${limit}/${start}/${search}`)
      .then(res => {

        dispatch({
          type: GET_REVISIONES,
          revisiones: res.data.revision
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
};

const getRevisionByPunto = (idPunto) => {
  return dispatch => {
    return axios
      .get(`/rev/revision/byPunto/${idPunto}`)
      .then(res => {
        dispatch({
          type: GET_REVISION_BY_PUNTO,
          revision_by_punto: res.data.revision
        });
      })
      .catch(err => {
        dispatch({
          type: GET_REVISION_BY_PUNTO,
          usuariosAcceso: []
        });
        console.error(err);
      });
  };
};


// Obtener tanques por punto
const getTanquesByPunto = async (puntoId) => {
  try {
    const response = await axios.get(`tan/tanque/byPunto/${puntoId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting tanques by punto:', error);
    throw error;
  }
};

// Obtener punto por ID
const getPuntoById = async (puntoId) => {
  try {
    const response = await axios.get(`pun/punto/byId/${puntoId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting punto by id:', error);
    throw error;
  }
};

// Obtener revisión por ID
const getRevisionById = async (revisionId) => {
  try {
    const response = await axios.get(`rev/revision/byId/${revisionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting revision by id:', error);
    throw error;
  }
};


// Agregar usuario a tanque
const addUserToTanque = async (data) => {
  try {
    const response = await axios.put('/tan/tanque/add-user', data);
    return response.data;
  } catch (error) {
    console.error('Error adding user to tanque:', error);
    throw error;
  }
};

// Enviar notificación desvincular usuario
const sendNotificationDesvincularUsuario = async (placaText, codt, razon_social) => {
  try {
    const response = await axios.get(`tan/tanque/notificacionDesvincularUsuario/${placaText}/${codt}/${razon_social}`);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Obtener departamentos
const getDepartamentos = async () => {
  try {
    const response = await axios.get(`https://resources-codegas.s3.amazonaws.com/departamentos.json`);
    return response.data;
  } catch (error) {
    console.error('Error getting departamentos:', error);
    throw error;
  }
};

// Obtener ciudades
const getCiudades = async () => {
  try {
    const response = await axios.get(`https://resources-codegas.s3.amazonaws.com/ciudades.json`);
    return response.data;
  } catch (error) {
    console.error('Error getting ciudades:', error);
    throw error;
  }
};

// Obtener poblados
const getPoblados = async () => {
  try {
    const response = await axios.get(`https://resources-codegas.s3.amazonaws.com/poblado.json`);
    return response.data;
  } catch (error) {
    console.error('Error getting poblados:', error);
    throw error;
  }
};

// Enviar solicitud de servicio
const sendSolicitudServicio = async (revisionId, data) => {
  try {
    const response = await axios.post(`rev/revision/solicitudServicio/${revisionId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending solicitud servicio:', error);
    throw error;
  }
};

// Crear revisión
const createRevision = async (data) => {
  try {
    const response = await axios.post(`rev/revision/`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating revision:', error);
    throw error;
  }
};

// Actualizar revisión
const updateRevision = async (revisionId, data) => {
  try {
    const response = await axios.put(`rev/revision/${revisionId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating revision:', error);
    throw error;
  }
};

// Actualizar instalación de revisión
const updateRevisionInstalacion = async (revisionId, data) => {
  try {
    const response = await axios.put(`rev/revision/instalacion/${revisionId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating revision instalacion:', error);
    throw error;
  }
};

// Actualizar coordenadas de revisión
const updateRevisionCoordenadas = async (revisionId, data) => {
  try {
    const response = await axios.put(`rev/revision/coordenadas/${revisionId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating revision coordenadas:', error);
    throw error;
  }
};

// Agregar imágenes a revisión
const addImagesToRevision = async (data) => {
  try {
    const response = await axios.put(`rev/revision/add-images`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding images to revision:', error);
    throw error;
  }
};

export {
  getRevisiones,
  getRevisionByPunto,
  getTanquesByPunto,
  getPuntoById,
  getRevisionById,
  addUserToTanque,
  sendNotificationDesvincularUsuario,
  getDepartamentos,
  getCiudades,
  getPoblados,
  sendSolicitudServicio,
  createRevision,
  updateRevision,
  updateRevisionInstalacion,
  updateRevisionCoordenadas,
  addImagesToRevision
};
