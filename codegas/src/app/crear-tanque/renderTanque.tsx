import {getUsers} from '../store/fetch-user' 
import {getPuntos} from '../store/fetch-punto'
import {getAlerts} from '../store/fetch-tanque'
import CreateTanque from './create-tanque'
export const RenderCrearTanque = async function RenderCrearTanque({page, limit, access, search, tanqueId, idUser}: any) {
  const user = await getUsers(page, limit, access, search);
  const {puntos} = await getPuntos(idUser);
  const alerts = await getAlerts(tanqueId);
  return (
    <CreateTanque 
      data={user} 
      tanqueId={tanqueId} 
      puntos={puntos} 
      alerts={alerts}
    />
  )
};
