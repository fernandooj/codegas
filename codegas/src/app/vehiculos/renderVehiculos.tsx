import {fetchVehiculos} from './fetchVehiculo' 
import Vehiculos from './vehiculos'
export const RenderVehiculos = async function RenderVehiculos(params) {
    const vehiculos = await fetchVehiculos();
    return vehiculos.carro.map((row: any, index: any) => <Vehiculos key={index} {...row} {...params} />);
} as unknown as () => JSX.Element;
  