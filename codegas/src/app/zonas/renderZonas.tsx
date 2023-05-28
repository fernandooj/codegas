import {fetchZonas} from './fetchZona' 

export const RenderZonas = async() =>{
    const {zona} = await fetchZonas();
    return {
        zona
    };
  }  
