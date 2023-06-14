import {fetchZonas} from '../store/fetch-zona' 

export const RenderZonas = async() =>{
    const {zona} = await fetchZonas();
    return {
        zona
    };
  }  
