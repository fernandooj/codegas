 
import usuario  from "./usuario";
import pedido   from "./pedido";
import mensaje  from "./mensaje";
import vehiculo from "./vehiculo";
import revision from "./revision";

import { combineReducers } from "redux";

const reducerMap = {
  usuario,
  pedido,
  mensaje,
  vehiculo,
  revision
};

export default combineReducers(reducerMap);
