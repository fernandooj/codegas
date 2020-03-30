import {
    GET_VEHICULO,
    GET_VEHICULOS,
} from "./constants/actionsTypes";
import axios from "axios";


const getVehiculo = vehiculoId => {
  return dispatch => {
    return axios
      .get(`/veh/vehiculo/${vehiculoId}`)
      .then(res => {
        dispatch({
          type: GET_VEHICULO,
          vehiculo: res.data.carro
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const getVehiculos = data => {
  return dispatch => {
    return axios
      .get(`veh/vehiculo/no_eliminados`)
      .then(res => {
        
        dispatch({
          type: GET_VEHICULOS,
          vehiculos: res.data.carro
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};  

export {
    getVehiculo,
    getVehiculos
};
