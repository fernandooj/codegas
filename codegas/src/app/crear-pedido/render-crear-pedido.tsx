import {getUsers} from '../store/fetch-user' 
import {getPuntos} from '../store/fetch-punto'
import CrearPedido from './create-pedido'
export const RenderCrearPedido = async function RenderCrearPedido({start, limit, access, search, tanqueId, idUser}: any) {
    const user = await getUsers(start, limit, access, search);
    const {puntos} = await getPuntos(idUser);
    return <CrearPedido data={user} puntos={puntos} />;
  } as unknown as () => JSX.Element;
