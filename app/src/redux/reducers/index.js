 
import usuario  from "./usuario";
import pedido   from "./pedido";
import mensaje  from "./mensaje";
import vehiculo from "./vehiculo";

import { combineReducers } from "redux";

const reducerMap = {
  usuario,
  pedido,
  mensaje,
  vehiculo
};

export default combineReducers(reducerMap);
