import {getUsers} from '../store/fetch-user' 
import {getPuntos} from '../store/fetch-punto
import CrearPedido from './create-pedido'
export const RenderCrearPedido = async function RenderCrearPedido({idUser}) {
    const {users} = await getUsers();
    const {puntos} = await getPuntos(idUser);
    console.log(puntos)
    return <CrearPedido data={users} puntos={puntos} />;
  } as unknown as () => JSX.Element;
