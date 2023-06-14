export interface ParamsProps {
    searchParams: {
      page?: number;
      search?: string;
    };
}
   
export type RenderUsersProps = {
  page: number;
  limit: number;
  access: string;
  search: string;
}
