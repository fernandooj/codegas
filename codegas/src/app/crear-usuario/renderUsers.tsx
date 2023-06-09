import {getUsers} from '../store/fetch-user' 
import SelectUser from './SelectUser'
export const RenderUsers = async function RenderUsers({start, limit, access, search}: any) {
    const user = await getUsers(start, limit, access, search);
    return <SelectUser data={user} />;
  } as unknown as () => JSX.Element;
