import {getUsers} from '../store/fetch-user' 
import {getPuntos} from '../store/fetch-punto'
import CrearPedido from './create-pedido'
import type {RenderPedidoProps} from "./crear-pedido.types"

export const RenderCrearPedido = async function RenderCrearPedido({page, limit, access, search, idUser}: RenderPedidoProps) {
  const user = await getUsers(page, limit, access, search);
  const {puntos} = await getPuntos(idUser);
  return <CrearPedido data={user} puntos={puntos}  />;
}  
