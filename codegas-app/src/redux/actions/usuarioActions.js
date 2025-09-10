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

const getUsuarios = (limit, start, acceso, search) => {
  return dispatch => {
    return axios
      .get(`/users/acceso/${limit}/${start}/${acceso}/${search}`)
      .then(res => {
        dispatch({
          type: GET_USUARIOS,
          usuarios: res.data.user
        });
      })
      .catch(err => {
        console.error('Error en getUsuarios:', {
          function: 'getUsuarios',
          parameters: { limit, start, acceso, search },
          error: err,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
      });
  };
};

const getUsuariosAcceso = (limit, start, acceso) => {
  console.log(acceso)
  return dispatch => {
    return axios
      .get(`/users/acceso/${limit}/${start}/${acceso}/undefined`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_USUARIOS_ACCESO,
          usuariosAcceso: res.data.user
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
    const response = await axios.put(`user/update/${userId}`, userData);
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
    // console.log(response.data)
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
    const response = await axios.post("pun/punto/varios", { puntos, idPadre });
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
    const response = await axios.get(`/users/asignarComercial/${userId}/${veoId}`);
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
    const response = await axios.get(`/users/eliminar/${userId}`);
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
    const response = await axios.get(`/users/cambiarEstado/${userId}/${isActive}`);
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
    const response = await axios.get(`users/cambiarValor/${valorUnitario}/${userId}`);
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
  changeValorUnitario
};
