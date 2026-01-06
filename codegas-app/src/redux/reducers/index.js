
import usuario from "./usuario";
import pedido from "./pedido";
import mensaje from "./mensaje";
import vehiculo from "./vehiculo";
import revision from "./revision";
import tanque from "./tanque";
import zona from "./zona";
import reporte from "./reporteReducer";
import planilla from "./planilla";

import { combineReducers } from "redux";

const reducerMap = {
  usuario,
  pedido,
  mensaje,
  vehiculo,
  revision,
  tanque,
  zona,
  reporte,
  planilla
};

export default combineReducers(reducerMap);
