import URL from '../utils/url' 
 

export const getPuntos = async (id: any) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/pun/punto/byCliente/${id}`, {
            next: { revalidate: 100 } 
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

 