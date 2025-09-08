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
      .get(`/users/acceso/${limit}/${start}/${acceso}/${search}`)
      .then(res => {
        dispatch({
          type: GET_USUARIOS,
          usuarios: res.data.user
        });
      })
      .catch(err => {
        console.error(err);
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
        console.log(err);
      });
  };
};
  

const getUserByUid = async (uid) => {
  try {
      const response = await axios.get(`/users/uid/${uid}`);

      if(response.status!==200 ){
          throw new Error(`Ruquest failed with status ${response.status}`)
      }
      
      return response.data;
  } catch (error) {
      console.error(error);
      return []
  }
};


const getUserByEmail = async (email) => {
  try {
      const response = await axios.get(`/users/email/${email}`);

      if(response.status!==200 ){
          throw new Error(`Ruquest failed with status ${response.status}`)
      }
      
      return response.data;
  } catch (error) {
      console.error(error);
      return []
  }
};

const sendNewPassword = async (email, pass) => {
  const data = {email, pass}
  try {
      // const response = await axios.get(`/users/newPassword/${email, pass}`);
      const response = await axios({
        method: 'post',  
        url: `users/sendPassword`,
        data:  JSON.stringify(data),
        headers: { 
            'Content-Type': 'application/json'
        },
      })

      if(response.status!==200 ){
          throw new Error(`Ruquest failed with status ${response.status}`)
      }
      
      return response.data;
  } catch (error) {
      console.error(error);
      return []
  }
};

const updateUid = async (email, uid) => {
  const data = {email, uid}
  try {
      const response = await axios({
        method: 'post',  
        url: `users/updateUid`,
        data:  JSON.stringify(data),
        headers: { 
            'Content-Type': 'application/json'
        },
      })

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
  getUserByUid,
  getUserByEmail,
  sendNewPassword,
  updateUid
};
