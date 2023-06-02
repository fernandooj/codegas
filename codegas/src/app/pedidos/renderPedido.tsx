import {fetchPedido} from './fetchPedido' 
import RenderTable from './table'
export const RenderPedidos = async function RenderPedidos({page, search}) {
    const {pedido} = await fetchPedido(page, search);
    return <RenderTable data={pedido} />;
  } as unknown as () => JSX.Element;
