import URL from '../utils/url' 

export const fetchPedido = async (idUser: any, start: any, search: string, acceso: string) => {
    start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/ped/pedido/todos/app/${idUser}/10/${start}/${acceso}/${search}`, {cache: 'no-store'});
        if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const {pedido} = await response.json();
        return pedido;
    } catch (error) {
        console.error(error);
        return []
    }
};
 
export const UpdateDatePedido = async(id: any, date: any) =>{
    try {
        const response = await fetch(`${URL}/ped/pedido/asignarFechaEntrega/${id}/${date}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

export const addCarPedido = async(idPedido: any, idCar: any, date: any, idUser: any) =>{
    try {
        const response = await fetch(`${URL}/ped/pedido/asignarConductor/${idPedido}/${idCar}/${date}/${idUser}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

export const UpdateStatePedido = async(id: any, state: any) =>{
    try {
        const response = await fetch(`${URL}/ped/pedido/cambiarEstado/${id}/${state}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}


export const createPedido = async(date: any) =>{
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
