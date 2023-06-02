import URL from '../utils/url' 

export const fetchRevisiones = async (limit:any, start:any, search:any) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/rev/revision/${limit}/${start}/${search}`, {cache: 'no-store'});
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
    }
};
 
 