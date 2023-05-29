const URL = "https://7838wgxv44.execute-api.us-east-1.amazonaws.com"
 
export const getUsersAdministradores = async () => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/users/administradores`, {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};


export const createUser = async(date: any) =>{
    try {
        const response = await fetch(`${URL}/users`, {
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

 