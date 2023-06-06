import {getClients, getPuntos} from './fetch-pedido' 
import CrearPedido from './create-pedido'
export const RenderCrearPedido = async function RenderCrearPedido({idUser}) {
    const {users} = await getClients();
    const {puntos} = await getPuntos(idUser);
    return <CrearPedido data={users} puntos={puntos} />;
  } as unknown as () => JSX.Element;
