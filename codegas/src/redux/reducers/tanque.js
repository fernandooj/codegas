import {
  GET_TANQUES
} from "../actions/constants/actionsTypes";
 
 
const getTanques = (state = [], action) => {
 
  switch (action.type) {
    case GET_TANQUES:
      return action.tanques;
    default:
      return state;
  }
};
 
 
export default function authServiceReducer(state = {}, action) {
  return {   
    tanques: getTanques(state.tanques, action)
  };
}
