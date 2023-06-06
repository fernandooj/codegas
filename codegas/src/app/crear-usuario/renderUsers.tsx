import {getUsersAdministradores} from '../store/fetch-user' 
import SelectUser from './SelectUser'
export const RenderUsers = async function RenderUsers() {
    const {users} = await getUsersAdministradores();
    return <SelectUser data={users} />;
  } as unknown as () => JSX.Element;
