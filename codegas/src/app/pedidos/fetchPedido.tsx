import URL from '../utils/url' 
const idUser=1

export const fetchPedido = async (start: any, search: string) => {
    start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/todos/app/${idUser}/10/${start}/admin/${search}`, {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
 
export const UpdateDatePedido = async(id: any, date: any) =>{
    try {
        const response = await fetch(`${URL}/asignarFechaEntrega/${id}/${date}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

export const addCarPedido = async(idPedido: any, idCar: any, date: any) =>{
    try {
        const response = await fetch(`${URL}/asignarConductor/${idPedido}/${idCar}/${date}/${idUser}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

export const UpdateStatePedido = async(id: any, state: any) =>{
    try {
        const response = await fetch(`${URL}/cambiarEstado/${id}/${state}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}