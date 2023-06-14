import { getUsers } from '../store/fetch-user';
import SelectUser from './SelectUser';
import type {RenderUsersProps} from "./crear-usuario.types"


export const RenderUsers = async function RenderUsers({
  page,
  limit,
  access,
  search,
}: RenderUsersProps) {
  const user = await getUsers(page, limit, access, search);
  return <SelectUser data={user} />;
}
