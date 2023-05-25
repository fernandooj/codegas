import {fetchPedido} from './fetchPedido' 
import RenderTable from '../components/table'
export const RenderPedidos = async function RenderPedidos({page}) {
    const pedidos = await fetchPedido(page);
    return pedidos.pedido.map((row: any, index: any): any => <RenderTable key={index} {...row} />);
  } as unknown as () => JSX.Element;
