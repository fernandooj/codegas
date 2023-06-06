import URL from '../utils/url' 
 
export const getUsers = async (start: any, limit: any, access: any, search: any) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/users/acceso/${start}/${limit}/${access}/${search}`, {
            next: { revalidate: 10 } 
        });
        const data = await response.json();

        if(response.status !==200){
            throw new Error(`Ruquest failed with status ${response.status}`)
        }
        return data;
    } catch (error) {
        console.error(error);
        return []
    }
};



export const createUser = async(date: any) =>{
    try {
        const response = await fetch(`${URL}/users`, {
            method: 'POST', 
            body: JSON.stringify(date),
            cache: 'no-store'
        });
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

 