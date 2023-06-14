export interface ParamsProps {
    searchParams: {
      page?: number;
      idUser?: number;
      search?: string;
    };
}
   
export type RenderPedidoProps = {
  page: number;
  limit: number;
  access: string;
  search: string;
  idUser?: number;
}
