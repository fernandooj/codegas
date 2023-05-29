const URL = "https://7838wgxv44.execute-api.us-east-1.amazonaws.com"
const idUser=1
export const fetchZonasByUser = async (limit, start, idZona, type, search) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/users/zonas/${limit}/${start}/${idZona}/${type}/${search}`, {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
 
export const fetchZonas = async() =>{
    try {
        const response = await fetch(`${URL}/zon/zona`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

export const ChangeValorUnitario = async(valor: any, idUser: any) =>{
    try {
        const response = await fetch(`${URL}/users/cambiarValor/${valor}/${idUser}`, {cache: 'no-store'});
        const data = await response.json();
        return data
    } catch (error){
        console.error(error)
    }
}

export const ChangeValorUnitarioAll = async(data: any) =>{
    const newData = {
        seleccionados: data
    }
    console.log(newData)
    try {
        const response = await fetch(`${URL}/users/cambiarValorTodos`, {
            method: 'PUT', 
            body: JSON.stringify(newData),
            cache: 'no-store'
        });
        const dataReponse = await response.json();
        return dataReponse
    } catch (error){
        console.error(error)
    }
}