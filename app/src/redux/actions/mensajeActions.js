import {
    GET_CONVERSACION,
    GET_CONVERSACIONES,
    GET_MENSAJES
  } from "./constants/actionsTypes";
import axios from "axios";
  
const getConversaciones = () => {
    return dispatch => {
        return axios
          .get(`con/conversacion/byUser`)
          .then(res => {
              
              dispatch({
                  type: GET_CONVERSACIONES,
                  conversaciones: res.data.conversaciones
              });
          })
          .catch(err => {
            console.log(err);
          });
      };
}

const getConversacion = idConversacion => {
    return dispatch => {
      return axios
        .get(`con/conversacion/${idConversacion}`)
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_CONVERSACION,
                conversacion: res.data.conversacion,
            });
        })
        .catch(err => {
          console.log(err);
        });
    };
};

const getMensajes = idConversacion => {
    return dispatch => {
      return axios
        .get(`men/mensaje/${idConversacion}`)
        .then(res => {
            console.log(res.data)
            // let mensaje = res.data.mensaje.map((e)=>{
            //     return {
            //         mensajeId: e._id,
            //         mensaje:e.mensaje,
            //         username:e.usuarioId.username,
            //         tokenPhone:e.usuarioId.tokenPhone,
            //         usuarioId:e.usuarioId._id,
            //         nombre:e.usuarioId.nombre,
            //         avatar:e.usuarioId.avatar
            //     }
            // })
            dispatch({
                type: GET_MENSAJES,
                mensajes: res.data.mensaje
            });
        })
        .catch(err => {
          console.log(err);
        });
    };
};
  
export {
    getConversacion,
    getMensajes,
    getConversaciones
};
  