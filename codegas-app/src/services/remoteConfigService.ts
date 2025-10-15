import remoteConfig from '@react-native-firebase/remote-config';
import { getApps } from '@react-native-firebase/app';

interface RemoteConfigValues {
    URL_END_POINT: string;
}

class RemoteConfigService {
    private initialized: boolean = false;
    private configValues: RemoteConfigValues = {
        URL_END_POINT: 'https://jl80ynfaa9.execute-api.us-east-1.amazonaws.com' // Valor por defecto
    };

    /**
     * Inicializa Firebase Remote Config
     */
    async initialize(): Promise<void> {
        try {
            if (this.initialized) {
                return;
            }

            // Verificar que Firebase esté inicializado
            if (getApps().length === 0) {
                console.warn('⚠️ Firebase not initialized, using default values');
                this.initialized = true;
                return;
            }

            // Configurar valores por defecto
            await remoteConfig().setDefaults({
                URL_END_POINT: 'https://jl80ynfaa9.execute-api.us-east-1.amazonaws.com'
            });

            // Configurar el intervalo mínimo de fetch (en desarrollo: 0, en producción: 3600)
            await remoteConfig().setConfigSettings({
                minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000, // 0 en dev, 1 hora en prod
            });

            // Fetch y activar los valores remotos
            await remoteConfig().fetchAndActivate();

            // Obtener los valores
            this.configValues.URL_END_POINT = remoteConfig().getValue('URL_END_POINT').asString();

            console.log('✅ Remote Config initialized successfully');
            console.log('📡 URL_END_POINT:', this.configValues.URL_END_POINT);

            this.initialized = true;
        } catch (error) {
            console.error('❌ Error initializing Remote Config:', error);
            console.log('⚠️ Using default values');
            this.initialized = true; // Marcar como inicializado para no bloquear la app
        }
    }

    /**
     * Obtiene el valor de URL_END_POINT
     */
    getEndpointUrl(): string {
        return this.configValues.URL_END_POINT;
    }

    /**
     * Fuerza una actualización de los valores remotos
     */
    async refresh(): Promise<void> {
        try {
            if (getApps().length === 0) {
                console.warn('⚠️ Firebase not initialized');
                return;
            }

            await remoteConfig().fetchAndActivate();
            this.configValues.URL_END_POINT = remoteConfig().getValue('URL_END_POINT').asString();

            console.log('✅ Remote Config refreshed');
            console.log('📡 New URL_END_POINT:', this.configValues.URL_END_POINT);
        } catch (error) {
            console.error('❌ Error refreshing Remote Config:', error);
        }
    }

    /**
     * Obtiene todos los valores de configuración
     */
    getAllValues(): RemoteConfigValues {
        return { ...this.configValues };
    }
}

// Exportar una instancia única (singleton)
export default new RemoteConfigService();

