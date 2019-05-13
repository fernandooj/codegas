 
import usuario from "./usuario";
import pedido from "./pedido";
 

import { combineReducers } from "redux";

const reducerMap = {
  usuario,
  pedido,
};

export default combineReducers(reducerMap);
