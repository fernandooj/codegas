const URL = "https://7838wgxv44.execute-api.us-east-1.amazonaws.com"

export const fetchTanques = async (limit, start, search) => {
    // start = start==0 ?0 :(start-1)*10
    try {
        const response = await fetch(`${URL}/tan/tanque/${limit}/${start}/${search}`, {cache: 'no-store'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
 
 