const URL = "https://mv5j5mmtck.execute-api.us-east-1.amazonaws.com/ped/pedido"
export const fetchPedido = async () => {
    try {
        const response = await fetch(`${URL}/todos/app/1/10/1/admin`, {cache: 'no-store'});
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

export const addCarPedido = async(idPedido: any, idCar: any, date: any, idUser=1) =>{
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