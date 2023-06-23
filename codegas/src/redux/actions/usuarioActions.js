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

const getUsuarios = (limit, start, acceso, search) => {
  return dispatch => {
    return axios
      .get(`users/acceso/${limit}/${start}/${acceso}/${search}`)
      .then(res => {
        console.log(res.data)
        dispatch({
          type: GET_USUARIOS,
          usuarios: res.data.user
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
  

export const getUserByUid = async (uid) => {
  try {
      const response = await axios.get(`/users/uid/${uid}`, {
          next: { revalidate: 10 } 
      });

      if(response.status!==200 ){
          throw new Error(`Ruquest failed with status ${response.status}`)
      }
      
      return response.data;
  } catch (error) {
      console.error(error);
      return []
  }
};

export {
  getPerfil,
  getUsuarios,
  getUsuario,
  getUsuariosAcceso,
};
