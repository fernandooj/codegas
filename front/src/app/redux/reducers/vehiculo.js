import {
  GET_VEHICULO,
  GET_VEHICULOS,
} from "../actions/constants/actionsTypes";
 
 
const getVehiculo = (state = [], action) => {
  switch (action.type) {
    case GET_VEHICULO:
      return action.vehiculo;
    default:
      return state;
  }
};
const getVehiculos = (state = [], action) => {
  switch (action.type) {
    case GET_VEHICULOS:
      return action.vehiculos;
    default:
      return state;
  }
};
 
export default function authServiceReducer(state = {}, action) {
  return {   
    vehiculo: getVehiculo(state.vehiculo, action),
    vehiculos: getVehiculos(state.vehiculos, action),
  };
}
