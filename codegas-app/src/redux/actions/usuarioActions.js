import {
  GET_PERFIL,
  GET_USUARIOS,
  GET_USUARIO,
  GET_USUARIOS_ACCESO,
} from "./constants/actionsTypes";
import axios from "axios";



const getPerfil = data => {
  return dispatch => {
    return axios
      .get(`user/perfil/`)
      .then(res => {
        dispatch({
          type: GET_PERFIL,
          usuario: res.data
        });
      })
      .catch(err => {
        console.error('Error en getPerfil:', {
          function: 'getPerfil',
          error: err,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
      });
  };
};

const getUsuario = userId => {
  return dispatch => {
    return axios
      .get(`/users/ById/${userId}/${null}`)
      .then(res => {
        dispatch({
          type: GET_USUARIO,
          usuario: res.data.info
        });
      })
      .catch(err => {
        console.error('Error en getUsuario:', {
          function: 'getUsuario',
          userId: userId,
          error: err,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
      });
  };
};

const getUsuarios = (limit, start, acceso, search, id) => {
  return async dispatch => {
    try {
      // Construir la URL correctamente basada en si search está vacío o no
      const searchParam = search && search.trim() !== '' ? search : 'undefined';
      const res = await axios.get(`/users/acceso/${limit}/${start}/${acceso}/${searchParam}/${id}`);
      dispatch({
        type: GET_USUARIOS,
        usuarios: res.data.user || []
      });
    } catch (err) {
      console.error('Error en getUsuarios:', {
        function: 'getUsuarios',
        parameters: { limit, start, acceso, search, id },
        error: err,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      dispatch({
        type: GET_USUARIOS,
        usuarios: []
      });
    }
  };
};

const getUsuariosAcceso = (limit, start, acceso) => {
  return dispatch => {
    return axios
      .get(`/users/acceso/${limit}/${start}/${acceso}/undefined`)
      .then(res => {
        dispatch({
          type: GET_USUARIOS_ACCESO,
          usuariosAcceso: res.data.user || []
        });
      })
      .catch(err => {
        dispatch({
          type: GET_USUARIOS_ACCESO,
          usuariosAcceso: []
        });
        console.error('Error en getUsuariosAcceso:', {
          function: 'getUsuariosAcceso',
          parameters: { limit, start, acceso },
          error: err,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
      });
  };
};


const getUserByUid = async (uid) => {
  try {
    const response = await axios.get(`/users/uid/${uid}`);

    if (response.status !== 200) {
      throw new Error(`Ruquest failed with status ${response.status}`)
    }

    return response.data;
  } catch (error) {
    console.error('Error en getUserByUid:', {
      function: 'getUserByUid',
      uid: uid,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return null
  }
};


const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`/users/email/${email}`);

    if (response.status !== 200) {
      throw new Error(`Ruquest failed with status ${response.status}`)
    }

    return response.data;
  } catch (error) {
    console.error('Error en getUserByEmail:', {
      function: 'getUserByEmail',
      email: email,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return null
  }
};

const sendNewPassword = async (email, pass) => {
  const data = { email, pass }
  try {
    // const response = await axios.get(`/users/newPassword/${email, pass}`);
    const response = await axios({
      method: 'post',
      url: `users/sendPassword`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (response.status !== 200) {
      throw new Error(`Ruquest failed with status ${response.status}`)
    }

    return response.data;
  } catch (error) {
    console.error('Error en sendNewPassword:', {
      function: 'sendNewPassword',
      parameters: { email, pass },
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return null;
  }
};

const updateUid = async (email, uid) => {
  const data = { email, uid }
  try {
    const response = await axios({
      method: 'post',
      url: `users/updateUid`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (response.status !== 200) {
      throw new Error(`Ruquest failed with status ${response.status}`)
    }

    return response.data;
  } catch (error) {
    console.error('Error en updateUid:', {
      function: 'updateUid',
      parameters: { email, uid },
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return null
  }
};

const signUpUser = async (userData) => {
  try {
    const response = await axios.post("users", userData);
    return response.data;
  } catch (error) {
    console.error('Error en signUpUser:', {
      function: 'signUpUser',
      userData: userData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`users/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error en updateUser:', {
      function: 'updateUser',
      userId: userId,
      userData: userData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const checkEmail = async (email) => {
  try {
    // Convertir email a minúsculas para verificación consistente
    const emailLower = email.toLowerCase();
    const response = await axios.get(`users/email/${emailLower}`);
    // Si la respuesta es exitosa, significa que el email existe
    return response
  } catch (error) {
    // Si hay error 404, significa que el email no existe
    if (error.response?.status === 404) {
      return {
        exists: false,
        user: null
      };
    }
    // Para otros errores, los logueamos
    console.error('Error en checkEmail:', {
      function: 'checkEmail',
      email: email,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const changePassword = async (email, password) => {
  try {
    const response = await axios.post("user/CambiarPassword", { email, password });
    return response.data;
  } catch (error) {
    console.error('Error en changePassword:', {
      function: 'changePassword',
      email: email,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const createMultipleUsers = async (clientes, idPadre, nombrePadre) => {
  try {
    const response = await axios.post("user/crea_varios", { clientes, idPadre, nombrePadre });
    return response.data;
  } catch (error) {
    console.error('Error en createMultipleUsers:', {
      function: 'createMultipleUsers',
      clientes: clientes,
      idPadre: idPadre,
      nombrePadre: nombrePadre,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const updateMultipleUsers = async (clientes, idPadre, nombrePadre) => {
  try {
    const response = await axios.put("user/update_varios", { clientes, idPadre, nombrePadre });
    return response.data;
  } catch (error) {
    console.error('Error en updateMultipleUsers:', {
      function: 'updateMultipleUsers',
      clientes: clientes,
      idPadre: idPadre,
      nombrePadre: nombrePadre,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const createMultiplePoints = async (puntos, idPadre) => {
  try {
    const response = await axios.post("pun/punto/create-varios", { puntos, idPadre });
    return response.data;
  } catch (error) {
    console.error('Error en createMultiplePoints:', {
      function: 'createMultiplePoints',
      puntos: puntos,
      idPadre: idPadre,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const assignCommercial = async (userId, veoId) => {
  try {
    // Usar la función update en lugar de la función específica de asignar comercial
    const response = await axios.put(`/users/${userId}`, {
      idpadre: veoId
    });
    return response.data;
  } catch (error) {
    console.error('Error en assignCommercial:', {
      function: 'assignCommercial',
      userId: userId,
      veoId: veoId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const uploadAvatar = async (formData) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'user/avatar',
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error('Error en uploadAvatar:', {
      function: 'uploadAvatar',
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/users/eliminar/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteUser:', {
      function: 'deleteUser',
      userId: userId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const changeUserStatus = async (userId, isActive) => {
  try {
    const response = await axios.put(`/users/cambiarEstado/${userId}/${isActive}`);
    return response.data;
  } catch (error) {
    console.error('Error en changeUserStatus:', {
      function: 'changeUserStatus',
      userId: userId,
      isActive: isActive,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const changeValorUnitario = async (valorUnitario, userId) => {
  try {
    const response = await axios.put(`users/cambiarValor/${valorUnitario}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error en changeValorUnitario:', {
      function: 'changeValorUnitario',
      valorUnitario: valorUnitario,
      userId: userId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`users/id/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getUserById:', {
      function: 'getUserById',
      userId: userId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const getPointsByClient = async (clientId) => {
  try {
    const response = await axios.get(`pun/punto/byCliente/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getPointsByClient:', {
      function: 'getPointsByClient',
      clientId: clientId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const createPoints = async (pointsData) => {
  try {
    const response = await axios.post(`pun/punto/create-varios`, pointsData);
    return response.data;
  } catch (error) {
    console.error('Error en createPoints:', {
      function: 'createPoints',
      pointsData: pointsData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const updatePoints = async (pointsData) => {
  try {
    const response = await axios.post(`pun/punto/update-varios`, pointsData);
    return response.data;
  } catch (error) {
    console.error('Error en updatePoints:', {
      function: 'updatePoints',
      pointsData: pointsData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const signUp = async (userData) => {
  try {
    const response = await axios.post("users", userData);
    return response.data;
  } catch (error) {
    console.error('Error en signUp:', {
      function: 'signUp',
      userData: userData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(`users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error en updateUserProfile:', {
      function: 'updateUserProfile',
      userId: userId,
      userData: userData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const getVeos = async (limit = 100, start = 0, searchParam = 'undefined', id) => {
  try {
    const response = await axios.get(`/users/acceso/${limit}/${start}/veo/${searchParam}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en getVeos:', {
      function: 'getVeos',
      parameters: { limit, start, searchParam, id },
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const getActiveZones = async () => {
  try {
    const response = await axios.get('zon/zona/activos');
    return response.data;
  } catch (error) {
    console.error('Error en getActiveZones:', {
      function: 'getActiveZones',
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};


// Enviar token FCM al backend
const sendFCMToken = (userId, fcmToken) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('user/fcm-token', {
        userId,
        fcmToken
      });

      if (response.data.code === 1) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Error sending FCM token:', error);
      return { success: false, error: error.message };
    }
  };
};


export {
  getPerfil,
  getUsuarios,
  getUsuario,
  getUsuariosAcceso,
  getUserByUid,
  getUserByEmail,
  sendNewPassword,
  updateUid,
  signUpUser,
  updateUser,
  checkEmail,
  changePassword,
  createMultipleUsers,
  updateMultipleUsers,
  createMultiplePoints,
  assignCommercial,
  uploadAvatar,
  deleteUser,
  changeUserStatus,
  changeValorUnitario,
  getUserById,
  getPointsByClient,
  createPoints,
  updatePoints,
  signUp,
  updateUserProfile,
  getVeos,
  getActiveZones,
  sendFCMToken
};
