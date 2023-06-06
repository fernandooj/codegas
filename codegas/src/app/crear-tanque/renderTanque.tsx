import {getUsers} from '../store/fetch-user' 
import CreateTanque from './create-tanque'
export const RenderCrearTanque = async function RenderCrearTanque({start, limit, access, search}) {
    const {user} = await getUsers(start, limit, access, search);
    console.log(user)
    return <CreateTanque data={user} />;
  } as unknown as () => JSX.Element;
