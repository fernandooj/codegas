const URL = "https://mv5j5mmtck.execute-api.us-east-1.amazonaws.com/veh/vehiculo/"
export const fetchVehiculos = async () => {
    try {
        const response = await fetch(`${URL}no_eliminados/30`, {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};