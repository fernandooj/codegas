import {fetchPedido} from './fetchPedido' 
import RenderTable from './table'
export const RenderPedidos = async function RenderPedidos({page, search}) {
    const pedidos = await fetchPedido(page, search);
    return pedidos.pedido.map((row: any, index: any): any => <RenderTable key={index} {...row} />);
  } as unknown as () => JSX.Element;
