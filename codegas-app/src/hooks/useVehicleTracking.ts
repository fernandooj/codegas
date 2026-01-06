/**
 * Hook para manejar el tracking de vehículos
 * 
 * Uso:
 * const { startTracking, stopTracking, isTracking } = useVehicleTracking();
 * 
 * startTracking(carroId, conductorId);
 * stopTracking();
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import VehicleTrackingService from '../services/vehicleTrackingService';
import { DataContext } from '../context/context';

interface TrackingStatus {
    isTracking: boolean;
    carroId: number | null;
    lastUpdate: Date | null;
}

export const useVehicleTracking = () => {
    const { userId, acceso } = useContext(DataContext);
    const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>({
        isTracking: false,
        carroId: null,
        lastUpdate: null,
    });

    /**
     * Solicitar permisos de ubicación
     */
    const requestLocationPermissions = async (): Promise<boolean> => {
        try {
            if (Platform.OS === 'android') {
                // Android
                const fineLocation = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permiso de Ubicación',
                        message: 'Codegas necesita acceder a tu ubicación para rastrear entregas',
                        buttonPositive: 'Aceptar',
                        buttonNegative: 'Cancelar',
                    }
                );

                if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert(
                        'Permiso Requerido',
                        'Necesitamos acceso a tu ubicación para el seguimiento de entregas'
                    );
                    return false;
                }

                // Android 10+ - Ubicación en background
                if (Platform.Version >= 29) {
                    const backgroundLocation = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                        {
                            title: 'Permiso de Ubicación en Segundo Plano',
                            message: 'Para mantener el seguimiento activo cuando la app está en segundo plano',
                            buttonPositive: 'Aceptar',
                            buttonNegative: 'Cancelar',
                        }
                    );

                    if (backgroundLocation !== PermissionsAndroid.RESULTS.GRANTED) {
                        console.warn('⚠️ Permiso de ubicación en background no concedido');
                    }
                }

                return true;
            } else {
                // iOS - Los permisos se solicitan automáticamente
                return true;
            }
        } catch (error) {
            console.error('❌ Error solicitando permisos:', error);
            return false;
        }
    };

    /**
     * Iniciar tracking
     */
    const startTracking = useCallback(
        async (carroId: number, conductorId: number, enPedido: boolean = false) => {
            try {
                // Validar que sea conductor
                if (acceso !== 'conductor') {
                    Alert.alert('Error', 'Solo los conductores pueden activar el tracking');
                    return false;
                }

                // Solicitar permisos
                const hasPermissions = await requestLocationPermissions();
                if (!hasPermissions) {
                    return false;
                }

                // Iniciar servicio de tracking
                VehicleTrackingService.startTracking(carroId, conductorId, enPedido);

                setTrackingStatus({
                    isTracking: true,
                    carroId,
                    lastUpdate: new Date(),
                });

                console.log('✅ Tracking iniciado correctamente');
                return true;
            } catch (error) {
                console.error('❌ Error iniciando tracking:', error);
                Alert.alert('Error', 'No se pudo iniciar el tracking de ubicación');
                return false;
            }
        },
        [acceso]
    );

    /**
     * Detener tracking
     */
    const stopTracking = useCallback(() => {
        try {
            VehicleTrackingService.stopTracking();

            setTrackingStatus({
                isTracking: false,
                carroId: null,
                lastUpdate: null,
            });

            console.log('🛑 Tracking detenido correctamente');
        } catch (error) {
            console.error('❌ Error deteniendo tracking:', error);
        }
    }, []);

    /**
     * Actualizar estado de pedido
     */
    const updatePedidoStatus = useCallback((enPedido: boolean) => {
        VehicleTrackingService.updatePedidoStatus(enPedido);
    }, []);

    /**
     * Limpiar al desmontar
     */
    useEffect(() => {
        return () => {
            if (trackingStatus.isTracking) {
                VehicleTrackingService.stopTracking();
            }
        };
    }, [trackingStatus.isTracking]);

    return {
        isTracking: trackingStatus.isTracking,
        carroId: trackingStatus.carroId,
        lastUpdate: trackingStatus.lastUpdate,
        startTracking,
        stopTracking,
        updatePedidoStatus,
        requestLocationPermissions,
    };
};

export default useVehicleTracking;

