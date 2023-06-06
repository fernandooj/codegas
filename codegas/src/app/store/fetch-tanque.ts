import URL from '../utils/url' 

export const fetchTanques = async (limit, start, search) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/tan/tanque/${limit}/${start}/${search}`, {cache: 'no-store'});
        const {tanque} = await response.json();
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return tanque;
    } catch (error) {
        console.error(error);
        return [];
    }
};
 
 
export const createTanque = async(date: any) =>{
    try {
        const response = await fetch(`${URL}/tan/tanque`, {
            method: 'POST', 
            body: JSON.stringify(date),
            cache: 'no-store'
        });
        const data = await response.json();
        if (response.status !==200) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        return data
    } catch (error){
        console.error(error)
        return []
    }
}
