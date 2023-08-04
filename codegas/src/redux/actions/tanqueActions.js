import {
    GET_TANQUES
} from "./constants/actionsTypes";
import axios from "axios";

 

const getTanques = (start, limit, search) => {
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

 
export {
    getTanques
};
