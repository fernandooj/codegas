import {getUsers} from '../store/fetch-user' 
import CreateTanque from './create-tanque'
export const RenderCrearTanque = async function RenderCrearTanque({start, limit, access, search, tanqueId}) {
    const {user} = await getUsers(start, limit, access, search);
    return <CreateTanque data={user} tanqueId={tanqueId} />;
  } as unknown as () => JSX.Element;
