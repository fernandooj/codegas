import axios from 'axios';
import {
  GET_TANQUES
} from './constants/actionsTypes';

export const getTanques = (start, limit, search) => {
  return dispatch => {
    return axios
      .get(`/tan/tanque/${limit}/${start}/${search}`)
      .then(res => {
        dispatch({
          type: GET_TANQUES,
          tanques: res.data.tanque
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
};

export const createTanque = async (payload) => {
  try {
    const response = await axios.post('/tan/tanque', payload);
    return { data: response.data };
  } catch (error) {
    console.error('Error en createTanque:', {
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

export const uploadTanqueImages = async (data) => {
  try {
    console.log('[tanqueActions] uploadTanqueImages called with:', {
      idTanque: data.idTanque,
      type: data.type,
      imagesCount: data.images?.length || 0
    });
    const response = await axios.put('/tan/tanque/add-images', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('[tanqueActions] uploadTanqueImages response:', {
      status: response.status,
      data: response.data
    });
    return response;
  } catch (error) {
    console.error('Error en uploadTanqueImages:', {
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      config: error.config
    });
    throw error;
  }
};

export const addUserTanque = async (data) => {
  try {
    console.log('[tanqueActions] addUserTanque called with:', {
      usuarioId: data.usuarioId,
      puntoId: data.puntoId,
      tanqueId: data.tanqueId
    });
    const response = await axios.put('/tan/tanque/add-user', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('[tanqueActions] addUserTanque response:', {
      status: response.status,
      data: response.data
    });
    // Si la respuesta viene parseada desde axios, retornar directamente
    // Si viene como string en body, axios lo parsea automáticamente
    return { data: response.data };
  } catch (error) {
    console.error('Error en addUserTanque:', {
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      config: error.config
    });
    throw error;
  }
};

// Obtener tanques por punto
export const getTanquesByPunto = async (puntoId) => {
  try {
    console.log('[tanqueActions] getTanquesByPunto called with:', { puntoId });

    // Importar servicios necesarios
    const { tanqueStorageService } = require('../../services/tanqueStorageService');
    const NetInfo = require('@react-native-community/netinfo').default;

    // Verificar conexión
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected ?? false;

    if (isOnline) {
      // Intentar cargar desde el servidor
      try {
        const response = await axios.get(`tan/tanque/byPunto/${puntoId}`);
        console.log('[tanqueActions] getTanquesByPunto response:', {
          status: response.status,
          dataCount: response.data?.tanque?.length || 0
        });

        // Guardar en almacenamiento local para uso offline
        if (response.data?.tanque && Array.isArray(response.data.tanque)) {
          await tanqueStorageService.saveTanquesByPunto(puntoId, response.data.tanque);
        }

        return response.data;
      } catch (networkError) {
        console.warn('⚠️ [tanqueActions] Error de red, intentando cargar desde cache:', networkError.message);
        // Si falla la red, intentar cargar desde cache
        const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);
        if (cachedTanques && cachedTanques.length > 0) {
          console.log('✅ [tanqueActions] Tanques cargados desde cache:', cachedTanques.length);
          return { tanque: cachedTanques };
        }
        throw networkError;
      }
    } else {
      // Offline: cargar desde almacenamiento local
      console.log('📴 [tanqueActions] Offline - Cargando tanques desde cache');
      const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);

      if (cachedTanques && cachedTanques.length > 0) {
        console.log('✅ [tanqueActions] Tanques cargados desde cache:', cachedTanques.length);
        return { tanque: cachedTanques };
      } else {
        console.warn('⚠️ [tanqueActions] No hay tanques en cache para punto:', puntoId);
        return { tanque: [] };
      }
    }
  } catch (error) {
    console.error('Error getting tanques by punto:', {
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });

    // Como último recurso, intentar cargar desde cache
    try {
      const { tanqueStorageService } = require('../../services/tanqueStorageService');
      const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);
      if (cachedTanques && cachedTanques.length > 0) {
        console.log('✅ [tanqueActions] Tanques cargados desde cache como fallback:', cachedTanques.length);
        return { tanque: cachedTanques };
      }
    } catch (cacheError) {
      console.error('❌ [tanqueActions] Error cargando desde cache:', cacheError);
    }

    throw error;
  }
};

// Obtener todos los tanques con búsqueda
export const getAllTanques = async (limit = 0, start = 0, search = 'undefined') => {
  try {
    const searchParam = search && search.trim().length > 0 ? search.trim() : 'undefined';
    console.log('[tanqueActions] getAllTanques called with:', { limit, start, search: searchParam });
    const response = await axios.get(`tan/tanque/${limit}/${start}/${searchParam}`);
    console.log('[tanqueActions] getAllTanques response:', {
      status: response.status,
      dataCount: response.data?.tanque?.length || 0
    });
    return response.data;
  } catch (error) {
    console.error('Error getting all tanques:', {
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

