import {fetchPedido} from '../store/fetch-pedido'
import RenderTable from './table'

export const RenderTanques = async function RenderTanques({limit, page, search}: any) {
  let tanque = await fetchPedido(2, page, search, 'admin', limit);

  return <RenderTable tanques={tanque} />;
}  