import URL from '../utils/url' 
 

export const getPuntos = async (id: any) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/pun/punto/byCliente/${id}`, {
            next: { revalidate: 100 } 
        });
        if(!response.ok){
            throw new Error(`Ruquest failed with status ${response.status}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return []
    }
};

 