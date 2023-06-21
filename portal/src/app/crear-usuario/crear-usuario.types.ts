export interface ParamsProps {
    searchParams: {
      page?: number;
      search?: string;
      userId?: string;
    };
}
   
export type RenderUsersProps = {
  page: number;
  limit: number;
  access: string;
  search: string | undefined;
  userId: string | undefined;
}
