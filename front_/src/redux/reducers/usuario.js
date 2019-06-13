import {
  GET_PERFIL,
  GET_USUARIO,
  GET_USUARIOS,
  GET_USUARIOS_ACCESO
} from "../actions/constants/actionsTypes";
 
 

const getPerfil = (state = {}, action) => {
  switch (action.type) {
    case GET_PERFIL:
      return action.usuario;
    default:
      return state;
  }
};
const getUsuario = (state = [], action) => {
  switch (action.type) {
    case GET_USUARIO:
      return action.usuario;
    default:
      return state;
  }
};
const getUsuarios = (state = [], action) => {
  switch (action.type) {
    case GET_USUARIOS:
      return action.usuarios;
    default:
      return state;
  }
};
const getUsuariosAcceso = (state = [], action) => {
  switch (action.type) {
    case GET_USUARIOS_ACCESO:
      return action.usuariosAcceso;
    default:
      return state;
  }
};
 
 
export default function authServiceReducer(state = {}, action) {
  return {   
    usuariosAcceso: getUsuariosAcceso(state.usuariosAcceso, action),
    usuario:        getUsuario(state.usuario, action),
    usuarios:       getUsuarios(state.usuarios, action),
    perfil:         getPerfil(state.usuario, action),
  };
}
