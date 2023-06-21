import {getUsers} from '../store/fetch-user' 
import {getPuntos} from '../store/fetch-punto'
import {getAlerts} from '../store/fetch-tanque'
import CreateTanque from './create-tanque'
export const RenderCrearTanque = async function RenderCrearTanque({page, limit, access, search, tanqueId, userId}: any) {
  const user = await getUsers(page, limit, access, search);
  const alerts = await getAlerts(tanqueId);
  let puntos = {puntos: null}
  if(userId){
    puntos = await getPuntos(userId);
  }
  
  return (
    <CreateTanque 
      data={user} 
      tanqueId={tanqueId} 
      puntos={puntos.puntos} 
      alerts={alerts}
    />
  )
};
