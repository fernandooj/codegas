import URL from '../utils/url' 

export const fetchPedido = async (idUser: any, start: any, search: string) => {
    start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/ped/pedido/todos/app/${idUser}/10/${start}/admin/${search}`, {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
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

export const addCarPedido = async(idPedido: any, idCar: any, date: any) =>{
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