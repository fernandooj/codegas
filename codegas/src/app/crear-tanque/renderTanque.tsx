import {getUsers} from '../store/fetch-user' 
import {getPuntos} from '../store/fetch-punto' 
import CreateTanque from './create-tanque'
export const RenderCrearTanque = async function RenderCrearTanque({start, limit, access, search, tanqueId, idUser}) {
    const {user} = await getUsers(start, limit, access, search);
    const {puntos} = await getPuntos(idUser);
    return <CreateTanque data={user} tanqueId={tanqueId} puntos={puntos} />;
  } as unknown as () => JSX.Element;
