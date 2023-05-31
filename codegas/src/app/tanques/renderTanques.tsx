import {fetchTanques} from './fetchTanque'
import RenderTable from './table'

export const RenderTanques = async function RenderTanques({limit, page, search}: any) {
  let {tanque} = await fetchTanques(limit, page, search);

  return <RenderTable tanques={tanque} />;
} as unknown as () => JSX.Element;