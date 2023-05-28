import {fetchZonasByUser} from './fetchZona' 
import RenderTable from './table'
// export const RenderZonasUsers = async function RenderZonasUsers({limit, page, idZona, type, search}) {
//   let zona = await fetchZonasByUser(limit, page, idZona, type, search);
//   return zona.map((row: any, index: any): any => <RenderTable key={index} {...row} />);
// } as unknown as () => JSX.Element;


export const RenderZonasUsers = async function RenderZonasUsers({limit, page, idZona, type, search}: any) {
  let zona = await fetchZonasByUser(limit, page, idZona, type, search);
  return <RenderTable zona={zona} />;
} as unknown as () => JSX.Element;