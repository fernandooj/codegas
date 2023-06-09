import {fetchPedido} from '../store/fetch-pedido' 
import RenderTable from './table'
export const RenderPedidos = async function RenderPedidos({page, search, idUser}) {
    const {pedido} = await fetchPedido(idUser, page, search);
    return <RenderTable data={pedido} />;
  } as unknown as () => JSX.Element;
