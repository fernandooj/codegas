import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const PEDIDOS_STORAGE_KEY = '@pedidos_storage';
const PEDIDOS_METADATA_KEY = '@pedidos_metadata';

interface PedidosStorage {
    pedidos: any[];
    filters: {
        idUser: string;
        acceso: string;
        estado: string;
        search?: string;
        ordenPor: string;
        tipoOrden: string;
    };
    lastUpdated: number;
}

interface PedidosMetadata {
    [key: string]: {
        lastUpdated: number;
        count: number;
    };
}

class PedidoStorageService {
    /**
     * Generar clave única para los filtros
     */
    private generateStorageKey(idUser: string, acceso: string, estado: string, search?: string, ordenPor?: string, tipoOrden?: string): string {
        const searchParam = search || 'all';
        const ordenPorParam = ordenPor || 'fecha_creacion';
        const tipoOrdenParam = tipoOrden || 'DESC';
        const key = `${idUser}_${acceso}_${estado}_${searchParam}_${ordenPorParam}_${tipoOrdenParam}`;
        console.log(`🔑 [PedidoStorage] Clave generada: ${key}`);
        return key;
    }

    /**
     * Listar todas las claves de storage (para debug)
     */
    async listAllKeys(): Promise<string[]> {
        try {
            const metadata = await this.getMetadata();
            const keys = Object.keys(metadata);
            console.log(`📋 [PedidoStorage] Claves disponibles:`, keys);
            return keys;
        } catch (error) {
            console.error('❌ [PedidoStorage] Error listando claves:', error);
            return [];
        }
    }

    /**
     * Guardar pedidos en AsyncStorage
     */
    async savePedidos(
        pedidos: any[],
        idUser: string,
        acceso: string,
        estado: string,
        search?: string,
        ordenPor?: string,
        tipoOrden?: string
    ): Promise<void> {
        try {
            const storageKey = this.generateStorageKey(idUser, acceso, estado, search, ordenPor, tipoOrden);
            const pedidosStorage: PedidosStorage = {
                pedidos,
                filters: {
                    idUser,
                    acceso,
                    estado,
                    search,
                    ordenPor: ordenPor || 'fecha_creacion',
                    tipoOrden: tipoOrden || 'DESC',
                },
                lastUpdated: Date.now(),
            };

            await AsyncStorage.setItem(`${PEDIDOS_STORAGE_KEY}_${storageKey}`, JSON.stringify(pedidosStorage));

            // Actualizar metadata
            const metadata = await this.getMetadata();
            metadata[storageKey] = {
                lastUpdated: Date.now(),
                count: pedidos.length,
            };
            await AsyncStorage.setItem(PEDIDOS_METADATA_KEY, JSON.stringify(metadata));

            console.log(`💾 [PedidoStorage] Pedidos guardados para filtro: ${storageKey}`, pedidos.length);
        } catch (error) {
            console.error('❌ [PedidoStorage] Error guardando pedidos:', error);
        }
    }

    /**
     * Obtener pedidos desde AsyncStorage
     */
    async getPedidos(
        idUser: string,
        acceso: string,
        estado: string,
        search?: string,
        ordenPor?: string,
        tipoOrden?: string
    ): Promise<any[] | null> {
        try {
            const storageKey = this.generateStorageKey(idUser, acceso, estado, search, ordenPor, tipoOrden);
            console.log(`🔍 [PedidoStorage] Buscando pedidos con clave: ${storageKey}`);

            const storedData = await AsyncStorage.getItem(`${PEDIDOS_STORAGE_KEY}_${storageKey}`);

            if (!storedData) {
                console.log(`⚠️ [PedidoStorage] No se encontraron datos para clave: ${storageKey}`);

                // Listar todas las claves disponibles para debug
                const allKeys = await this.listAllKeys();
                console.log(`📋 [PedidoStorage] Claves disponibles en storage:`, allKeys);

                // Intentar con filtro más genérico (sin search)
                if (search) {
                    const genericKey = this.generateStorageKey(idUser, acceso, estado, undefined, ordenPor, tipoOrden);
                    console.log(`🔄 [PedidoStorage] Intentando con clave genérica (sin search): ${genericKey}`);
                    const genericData = await AsyncStorage.getItem(`${PEDIDOS_STORAGE_KEY}_${genericKey}`);
                    if (genericData) {
                        const pedidosStorage: PedidosStorage = JSON.parse(genericData);
                        console.log(`✅ [PedidoStorage] Pedidos cargados desde cache (sin search) para filtro: ${genericKey}`, pedidosStorage.pedidos.length);
                        return pedidosStorage.pedidos;
                    }
                }

                // Intentar con estado "todos" si el estado actual no es "todos"
                if (estado !== 'todos') {
                    const todosKey = this.generateStorageKey(idUser, acceso, 'todos', search, ordenPor, tipoOrden);
                    console.log(`🔄 [PedidoStorage] Intentando con estado "todos": ${todosKey}`);
                    const todosData = await AsyncStorage.getItem(`${PEDIDOS_STORAGE_KEY}_${todosKey}`);
                    if (todosData) {
                        const pedidosStorage: PedidosStorage = JSON.parse(todosData);
                        console.log(`✅ [PedidoStorage] Pedidos cargados desde cache (estado "todos"): ${todosKey}`, pedidosStorage.pedidos.length);
                        return pedidosStorage.pedidos;
                    }
                }

                return null;
            }

            const pedidosStorage: PedidosStorage = JSON.parse(storedData);
            console.log(`✅ [PedidoStorage] Pedidos cargados desde cache para filtro: ${storageKey}`, pedidosStorage.pedidos.length);
            return pedidosStorage.pedidos;
        } catch (error) {
            console.error('❌ [PedidoStorage] Error cargando pedidos:', error);
            return null;
        }
    }

    /**
     * Obtener metadata de pedidos almacenados
     */
    async getMetadata(): Promise<PedidosMetadata> {
        try {
            const metadataData = await AsyncStorage.getItem(PEDIDOS_METADATA_KEY);
            return metadataData ? JSON.parse(metadataData) : {};
        } catch (error) {
            console.error('❌ [PedidoStorage] Error cargando metadata:', error);
            return {};
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
     * Limpiar todos los pedidos almacenados (útil para desarrollo/debug)
     */
    async clearAll(): Promise<void> {
        try {
            const metadata = await this.getMetadata();
            const keys = Object.keys(metadata).map(key => `${PEDIDOS_STORAGE_KEY}_${key}`);
            keys.push(PEDIDOS_METADATA_KEY);
            await AsyncStorage.multiRemove(keys);
            console.log('🗑️ [PedidoStorage] Todos los pedidos eliminados');
        } catch (error) {
            console.error('❌ [PedidoStorage] Error limpiando pedidos:', error);
        }
    }
}

// Singleton
export const pedidoStorageService = new PedidoStorageService();

