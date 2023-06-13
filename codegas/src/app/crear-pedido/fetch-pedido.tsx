import URL from '../utils/url' 
 
export const getClients = async () => {
    try {
        const response = await fetch(`${URL}/users/administradores`, {
            next: { revalidate: 100 } 
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};


export const getPuntos = async (id: any) => {
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


export const createPedido = async(date: any) =>{
    console.log(date)
    try {
        const response = await fetch(`${URL}/ped/pedido`, {
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

 