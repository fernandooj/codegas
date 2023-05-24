import {fetchVehiculos} from '../vehiculos/fetchVehiculo' 
import VehiculosDialog from '../components/vehiculosDialog'
export const RenderVehiculosDialog = async function RenderVehiculosDialog() {
    const vehiculos = await fetchVehiculos();
    return vehiculos.carro.map((row: any, index: any) => <VehiculosDialog key={index} {...row} />);
  } as unknown as () => JSX.Element;
  


 