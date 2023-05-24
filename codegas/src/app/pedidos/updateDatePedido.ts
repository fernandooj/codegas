export const fetchPedido = async () => {
    try {
        const response = await fetch('https://mv5j5mmtck.execute-api.us-east-1.amazonaws.com/ped/pedido/todos/app/1/10/1/admin', {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
 
 