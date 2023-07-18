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
  console.log(idPunto)
  return dispatch => {
    return axios
      .get(`/rev/revision/byPunto/${idPunto}`)
      .then(res => {
        console.log("res.data")
        console.log(res.data)
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

 
export {
    getRevisiones,
    getRevisionByPunto
};
