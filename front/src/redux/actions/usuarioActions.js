import {
  GET_PERFIL,
  GET_USUARIOS,
  GET_USUARIO,
  GET_USUARIOS_ACCESO,
  GET_USUARIOS_ZONAS
} from "./constants/actionsTypes";
import axios from "axios";

 

const getPerfil = data => {
  return dispatch => {
    return axios
      .get(`user/perfil/`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_PERFIL,
          usuario: res.data
        });
      })
      .catch(err => {
        console.log(err);
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
        console.log(err);
      });
  };
};

const getUsuarios = data => {
  return dispatch => {
    return axios
      .get(`users/`)
      .then(res => {
        dispatch({
          type: GET_USUARIOS,
          usuarios: res.data.usuarios
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const getUsuariosZonas = data => {
  return dispatch => {
    return axios
      .get(`users/zonas`)
      .then(res => {
        dispatch({
          type: GET_USUARIOS_ZONAS,
          usuariosZonas: res.data.usuarios
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};


const getUsuariosAcceso = acceso => {
  console.log(acceso)
  return dispatch => {
    return axios
      .get(`users/acceso/${acceso}`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_USUARIOS_ACCESO,
          usuariosAcceso: res.data.usuarios
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
  

export {
  getPerfil,
  getUsuarios,
  getUsuario,
  getUsuariosAcceso,
  getUsuariosZonas
};
