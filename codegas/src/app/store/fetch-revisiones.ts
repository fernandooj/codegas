import URL from '../utils/url' 

export const fetchRevisiones = async (limit:any, start:any, search:any) => {
    start = start==0 ?0 :(start-1)*10
    console.log(`${URL}/rev/revisiones/${limit}/${start}/${search}`)
    try {
        const response = await fetch(`${URL}/rev/revision/${limit}/${start}/${search}`, {cache: 'no-store'});
        if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`);
          }
        const {revision} = await response.json();
        return revision;
    } catch (error) {
        console.error(error);
        return []
    }
};
 
 