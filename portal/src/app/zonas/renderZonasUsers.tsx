import {fetchZonasByUser} from '../store/fetch-zona' 
import RenderTable from './table'

export const RenderZonasUsers = async function RenderZonasUsers({limit, page, idZone, type, search}: any) {
  let zona = await fetchZonasByUser(limit, page, idZone, type, search);
  return <RenderTable zona={zona} />;
}