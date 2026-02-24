import { GET_CARTERA, GET_CARTERA_REQUEST, CLEAR_CARTERA } from "./constants/actionsTypes";
import axios from "axios";

/**
 * Obtiene la cartera de un cliente por NIT desde Magister
 * @param {string|number} nit - NIT del cliente (usualmente viene del campo 'cedula' del usuario)
 */
/**
 * Normaliza NIT para Magister: si viene como "numero-digito" (ej. 3138282366-6017434211),
 * usa solo la primera parte numérica que es la que suele tener Magister.
 */
const normalizeNitForMagister = (nit) => {
  if (nit == null || nit === '') return '';
  const s = String(nit).trim();
  if (s.includes('-')) {
    const first = s.split('-')[0].trim();
    return first || s;
  }
  return s;
};

export const getCartera = (nit) => {
  return async (dispatch) => {
    const nitNorm = normalizeNitForMagister(nit);
    if (!nitNorm) {
      console.error('❌ [getCartera] El NIT es obligatorio');
      return dispatch({
        type: GET_CARTERA,
        cartera: [],
        error: 'El NIT es obligatorio'
      });
    }

    try {
      dispatch({ type: GET_CARTERA_REQUEST });
      console.log(`🔍 [getCartera] Obteniendo cartera para NIT: ${nitNorm} (original: ${nit})`);
      
      // Llamar al endpoint Lambda: GET /magister/cartera/{nit}
      const response = await axios.get(`/magister/cartera/${encodeURIComponent(nitNorm)}`, {
        timeout: 15000
      });

      if (response.data && response.data.status === true) {
        console.log(`✅ [getCartera] Cartera obtenida: ${response.data.total || 0} registros`);
        
        dispatch({
          type: GET_CARTERA,
          cartera: response.data.data || [],
          nit: response.data.nit ?? nitNorm,
          total: response.data.total || 0,
          error: null
        });
      } else {
        throw new Error(response.data?.error?.message || 'Error desconocido al obtener la cartera');
      }
    } catch (error) {
      console.error('❌ [getCartera] Error obteniendo cartera:', {
        nit,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      dispatch({
        type: GET_CARTERA,
        cartera: [],
        nit: nitNorm,
        total: 0,
        error: error.response?.data?.error?.message || error.message || 'Error al obtener la cartera'
      });
    }
  };
};

/**
 * Limpia la cartera del estado
 */
export const clearCartera = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_CARTERA
    });
  };
};

