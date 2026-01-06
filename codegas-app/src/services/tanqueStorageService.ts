import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const TANQUES_BY_PUNTO_KEY = '@tanques_by_punto';

interface Tanque {
    _id: number;
    capacidad?: string;
    codigo_activo?: string;
    fabricante?: string;
    registro_onac?: string;
    n_placa?: string;
    direccion?: string;
}

interface TanquesByPunto {
    [puntoId: string]: {
        tanques: Tanque[];
        lastUpdated: number;
    };
}

class TanqueStorageService {
    /**
     * Guardar tanques por punto en AsyncStorage
     */
    async saveTanquesByPunto(puntoId: string, tanques: Tanque[]): Promise<void> {
        try {
            const storedData = await AsyncStorage.getItem(TANQUES_BY_PUNTO_KEY);
            const tanquesByPunto: TanquesByPunto = storedData ? JSON.parse(storedData) : {};

            tanquesByPunto[puntoId] = {
                tanques,
                lastUpdated: Date.now(),
            };

            await AsyncStorage.setItem(TANQUES_BY_PUNTO_KEY, JSON.stringify(tanquesByPunto));
            console.log(`💾 [TanqueStorage] Tanques guardados para punto ${puntoId}:`, tanques.length);
        } catch (error) {
            console.error('❌ [TanqueStorage] Error guardando tanques:', error);
        }
    }

    /**
     * Obtener tanques por punto desde AsyncStorage
     */
    async getTanquesByPunto(puntoId: string): Promise<Tanque[] | null> {
        try {
            const storedData = await AsyncStorage.getItem(TANQUES_BY_PUNTO_KEY);
            if (!storedData) {
                return null;
            }

            const tanquesByPunto: TanquesByPunto = JSON.parse(storedData);
            const puntoData = tanquesByPunto[puntoId];

            if (!puntoData) {
                return null;
            }

            console.log(`📥 [TanqueStorage] Tanques cargados desde cache para punto ${puntoId}:`, puntoData.tanques.length);
            return puntoData.tanques;
        } catch (error) {
            console.error('❌ [TanqueStorage] Error cargando tanques:', error);
            return null;
        }
    }

    /**
     * Guardar múltiples puntos de tanques a la vez
     */
    async saveMultipleTanquesByPunto(tanquesByPuntoMap: Map<string, Tanque[]>): Promise<void> {
        try {
            const storedData = await AsyncStorage.getItem(TANQUES_BY_PUNTO_KEY);
            const tanquesByPunto: TanquesByPunto = storedData ? JSON.parse(storedData) : {};

            tanquesByPuntoMap.forEach((tanques, puntoId) => {
                tanquesByPunto[puntoId] = {
                    tanques,
                    lastUpdated: Date.now(),
                };
            });

            await AsyncStorage.setItem(TANQUES_BY_PUNTO_KEY, JSON.stringify(tanquesByPunto));
            console.log(`💾 [TanqueStorage] ${tanquesByPuntoMap.size} puntos de tanques guardados`);
        } catch (error) {
            console.error('❌ [TanqueStorage] Error guardando múltiples tanques:', error);
        }
    }

    /**
     * Verificar si hay conexión a internet
     */
    async isOnline(): Promise<boolean> {
        const netInfo = await NetInfo.fetch();
        return netInfo.isConnected ?? false;
    }

    /**
     * Limpiar todos los tanques almacenados (útil para desarrollo/debug)
     */
    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TANQUES_BY_PUNTO_KEY);
            console.log('🗑️ [TanqueStorage] Todos los tanques eliminados');
        } catch (error) {
            console.error('❌ [TanqueStorage] Error limpiando tanques:', error);
        }
    }
}

// Singleton
export const tanqueStorageService = new TanqueStorageService();

