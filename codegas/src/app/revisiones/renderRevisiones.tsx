import {fetchRevisiones} from './fetchRevisiones'
import RenderTable from './table'

export const RenderRevisiones = async function RenderRevisiones({limit, page, search}: any) {
  let {revision} = await fetchRevisiones(limit, page, search);
  return <RenderTable revision={revision} />;
} as unknown as () => JSX.Element;