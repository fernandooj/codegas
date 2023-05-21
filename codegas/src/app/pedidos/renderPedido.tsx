import {fetchPedido} from './fetchPedido' 
import RenderTable from '../components/table'
export const RenderPedidos = async function RenderPedidos() {
    const pedidos = await fetchPedido();
    return pedidos.pedido.map((row: any, index: any) => <RenderTable key={index} data={row} />);
  } as unknown as () => JSX.Element;
  


 