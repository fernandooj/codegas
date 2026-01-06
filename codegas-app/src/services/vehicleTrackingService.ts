/**
 * Servicio de Tracking de Vehículos en Tiempo Real
 * 
 * Este servicio maneja el seguimiento GPS de los conductores
 * y envía las actualizaciones al backend vía Socket.IO
 */

import Geolocation from '@react-native-community/geolocation';
import { Platform, AppState, AppStateStatus } from 'react-native';
import axios from 'axios';

interface LocationData {
    carroId: number;
    conductorId: number;
    latitud: number;
    longitud: number;
    velocidad: number;
    precision: number;
    heading: number;
    timestamp: string;
    enPedido: boolean;
}

class VehicleTrackingService {
    private watchId: number | null = null;
    private isTracking: boolean = false;
    private updateInterval: NodeJS.Timeout | null = null;
    private lastLocation: LocationData | null = null;
    private carroId: number | null = null;
    private conductorId: number | null = null;
    private enPedido: boolean = false;
    private appState: AppStateStatus = AppState.currentState;

    // Configuración
    private readonly CONFIG = {
        UPDATE_INTERVAL: 30000, // 30 segundos
        MIN_DISTANCE: 10, // metros - distancia mínima para actualizar
        HIGH_ACCURACY: true,
        TIMEOUT: 15000, // 15 segundos
        MAXIMUM_AGE: 10000, // 10 segundos
        DISTANCE_FILTER: 10, // metros
    };

    constructor() {
        // Escuchar cambios de estado de la app
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    /**
     * Maneja cambios en el estado de la aplicación
     */
    private handleAppStateChange = (nextAppState: AppStateStatus) => {
        console.log('📱 App state cambió:', this.appState, '->', nextAppState);

        if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
            // App volvió a primer plano
            if (this.isTracking) {
                this.resumeTracking();
            }
        } else if (nextAppState.match(/inactive|background/)) {
            // App fue a segundo plano
            if (this.isTracking) {
                this.pauseTracking();
            }
        }

        this.appState = nextAppState;
    };

    /**
     * Iniciar tracking de ubicación
     */
    public startTracking(carroId: number, conductorId: number, enPedido: boolean = false): void {
        if (this.isTracking) {
            console.warn('⚠️ Tracking ya está activo');
            return;
        }

        // Validar que los datos requeridos estén presentes
        if (!carroId || !conductorId) {
            console.error('❌ Error: carroId y conductorId son requeridos', {
                carroId,
                conductorId
            });
            return;
        }

        console.log('🚀 Iniciando tracking:', {
            carroId,
            conductorId,
            enPedido
        });

        // Guardar datos antes de activar tracking
        this.carroId = carroId;
        this.conductorId = conductorId;
        this.enPedido = enPedido;
        this.isTracking = true;

        // Configurar geolocalización
        this.setupGeolocation();

        // Iniciar envío periódico
        this.startPeriodicUpdates();
    }

    /**
     * Detener tracking de ubicación
     */
    public stopTracking(): void {
        if (!this.isTracking) {
            return;
        }

        console.log('🛑 Deteniendo tracking');
        this.isTracking = false;

        // Limpiar watch de geolocalización
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        // Limpiar interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        // Enviar última actualización marcando como inactivo
        if (this.lastLocation) {
            this.sendLocationUpdate({ ...this.lastLocation, velocidad: 0 });
        }

        this.lastLocation = null;
    }

    /**
     * Actualizar estado de pedido
     */
    public updatePedidoStatus(enPedido: boolean): void {
        this.enPedido = enPedido;
        console.log('📦 Estado de pedido actualizado:', enPedido);
    }

    /**
     * Configurar seguimiento de geolocalización
     */
    private setupGeolocation(): void {
        const options = {
            enableHighAccuracy: this.CONFIG.HIGH_ACCURACY,
            timeout: this.CONFIG.TIMEOUT,
            maximumAge: this.CONFIG.MAXIMUM_AGE,
            distanceFilter: this.CONFIG.DISTANCE_FILTER,
            interval: this.CONFIG.UPDATE_INTERVAL,
            fastestInterval: 10000, // 10 segundos mínimo
            showLocationDialog: true,
            forceRequestLocation: true,
        };

        // Obtener ubicación inicial
        Geolocation.getCurrentPosition(
            (position) => {
                this.handleLocationUpdate(position);
            },
            (error) => {
                console.error('❌ Error obteniendo ubicación inicial:', error);
            },
            options
        );

        // Observar cambios de ubicación
        this.watchId = Geolocation.watchPosition(
            (position) => {
                this.handleLocationUpdate(position);
            },
            (error) => {
                console.error('❌ Error en watchPosition:', error);
            },
            options
        );
    }

    /**
     * Manejar actualización de ubicación
     */
    private handleLocationUpdate(position: any): void {
        if (!this.isTracking) {
            console.warn('⚠️ Tracking no está activo, ignorando ubicación');
            return;
        }

        if (!this.carroId || !this.conductorId) {
            console.error('❌ Faltan datos requeridos:', {
                carroId: this.carroId,
                conductorId: this.conductorId,
                isTracking: this.isTracking
            });
            return;
        }

        const { latitude, longitude, accuracy, speed, heading } = position.coords;

        // Filtrar ubicaciones con baja precisión (>100 metros)
        if (accuracy > 100) {
            console.warn('⚠️ Ubicación con baja precisión, ignorando');
            return;
        }

        // Calcular distancia desde última ubicación
        if (this.lastLocation) {
            const distance = this.calculateDistance(
                this.lastLocation.latitud,
                this.lastLocation.longitud,
                latitude,
                longitude
            );

            // Si la distancia es muy pequeña, no actualizar
            if (distance < this.CONFIG.MIN_DISTANCE && !this.enPedido) {
                return;
            }
        }

        const locationData: LocationData = {
            carroId: this.carroId,
            conductorId: this.conductorId,
            latitud: latitude,
            longitud: longitude,
            velocidad: speed ? speed * 3.6 : 0, // m/s a km/h
            precision: Math.round(accuracy),
            heading: heading || 0,
            timestamp: new Date().toISOString(),
            enPedido: this.enPedido,
        };

        this.lastLocation = locationData;
        console.log('📍 Nueva ubicación capturada:', {
            carroId: this.carroId,
            conductorId: this.conductorId,
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            vel: locationData.velocidad.toFixed(1),
            enPedido: this.enPedido,
        });
    }

    /**
     * Iniciar envíos periódicos al servidor
     */
    private startPeriodicUpdates(): void {
        this.updateInterval = setInterval(() => {
            if (this.lastLocation && this.isTracking) {
                this.sendLocationUpdate(this.lastLocation);
            }
        }, this.CONFIG.UPDATE_INTERVAL);
    }

    /**
     * Enviar actualización de ubicación al servidor
     */
    private async sendLocationUpdate(locationData: LocationData): Promise<void> {
        // Validar que todos los campos requeridos estén presentes
        if (!locationData.carroId || !locationData.conductorId || !locationData.latitud || !locationData.longitud) {
            console.error('❌ Datos incompletos para enviar ubicación:', {
                carroId: locationData.carroId,
                conductorId: locationData.conductorId,
                latitud: locationData.latitud,
                longitud: locationData.longitud
            });
            return;
        }

        try {
            console.log('📤 Enviando ubicación al servidor:', {
                carroId: locationData.carroId,
                conductorId: locationData.conductorId,
                lat: locationData.latitud.toFixed(6),
                lng: locationData.longitud.toFixed(6)
            });

            // Enviar al endpoint de tracking (API Gateway de AWS)
            const response = await axios.post('/trk/tracking/update-location', locationData);

            console.log('✅ Ubicación enviada al servidor correctamente:', {
                carroId: locationData.carroId,
                conductorId: locationData.conductorId,
                response: response.data
            });
        } catch (error: any) {
            console.error('❌ Error enviando ubicación:', {
                error: error.message,
                carroId: locationData.carroId,
                conductorId: locationData.conductorId,
                response: error.response?.data,
                status: error.response?.status
            });

            // Intentar enviar directamente si falla
            this.sendLocationToSocket(locationData);
        }
    }

    /**
     * Enviar ubicación directamente por Socket (backup)
     */
    private sendLocationToSocket(locationData: LocationData): void {
        // Este método será implementado cuando integres socket.io-client
        console.log('🔌 Enviando ubicación por Socket.IO (backup)');
        // socket.emit('updateVehicleLocation', locationData);
    }

    /**
     * Pausar tracking (cuando app va a background)
     */
    private pauseTracking(): void {
        console.log('⏸️  Pausando tracking (background)');

        if (Platform.OS === 'ios') {
            // En iOS, pausar updates para ahorrar batería
            if (this.watchId !== null) {
                Geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        }
    }

    /**
     * Resumir tracking (cuando app vuelve a foreground)
     */
    private resumeTracking(): void {
        console.log('▶️  Resumiendo tracking (foreground)');

        if (Platform.OS === 'ios' && this.watchId === null) {
            this.setupGeolocation();
        }
    }

    /**
     * Calcular distancia entre dos coordenadas (Haversine)
     */
    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distancia en metros
    }

    /**
     * Obtener estado actual del tracking
     */
    public getTrackingStatus(): {
        isTracking: boolean;
        carroId: number | null;
        lastLocation: LocationData | null;
    } {
        return {
            isTracking: this.isTracking,
            carroId: this.carroId,
            lastLocation: this.lastLocation,
        };
    }

    /**
     * Limpiar recursos
     */
    public destroy(): void {
        this.stopTracking();
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
}

// Exportar instancia singleton
export default new VehicleTrackingService();

