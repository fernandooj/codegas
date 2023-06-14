import {fetchRevisiones} from '../store/fetch-revisiones'
import RenderTable from './table'

export const RenderRevisiones = async function RenderRevisiones({limit, page, search}: any) {
  let revision = await fetchRevisiones(limit, page, search);
  return <RenderTable revision={revision} />;
}