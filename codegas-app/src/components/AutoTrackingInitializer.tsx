/**
 * Componente que inicia automáticamente el tracking cuando un conductor inicia sesión
 * y tiene un vehículo asignado
 */

import React, { useEffect, useContext, useRef } from 'react';
import { DataContext } from '../context/context';
import VehicleTrackingService from '../services/vehicleTrackingService';
import axios from 'axios';

const AutoTrackingInitializer: React.FC = () => {
    const { userId, acceso } = useContext(DataContext) as any;
    const trackingInitializedRef = useRef(false);

    useEffect(() => {
        const initializeTracking = async () => {
            // Solo para conductores
            if (acceso !== 'conductor' || !userId) {
                // Si no es conductor, detener tracking si estaba activo
                const status = VehicleTrackingService.getTrackingStatus();
                if (status.isTracking) {
                    console.log('🛑 Deteniendo tracking (no es conductor)');
                    VehicleTrackingService.stopTracking();
                }
                trackingInitializedRef.current = false;
                return;
            }

            // Evitar inicialización múltiple
            if (trackingInitializedRef.current) {
                return;
            }

            try {
                console.log('🔍 Buscando vehículo asignado para conductor:', userId);

                // Obtener vehículo asignado al conductor
                const response = await axios.get(`veh/vehiculo/byConductor/${userId}`);

                if (response.data.status && response.data.carro) {
                    const vehiculo = response.data.carro;
                    const carroId = parseInt(vehiculo._id);
                    const conductorId = parseInt(userId);

                    if (carroId && conductorId) {
                        console.log('✅ Vehículo encontrado, iniciando tracking automáticamente:', {
                            carroId,
                            conductorId,
                            placa: vehiculo.placa
                        });

                        // Iniciar tracking automáticamente
                        VehicleTrackingService.startTracking(carroId, conductorId, false);
                        trackingInitializedRef.current = true;

                        console.log('🚀 Tracking iniciado automáticamente');
                    } else {
                        console.warn('⚠️ Datos de vehículo incompletos:', { carroId, conductorId });
                    }
                } else {
                    console.log('ℹ️ No se encontró vehículo asignado para este conductor');
                }
            } catch (error: any) {
                console.error('❌ Error obteniendo vehículo del conductor:', {
                    error: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                // No marcar como inicializado si hay error para poder reintentar
                trackingInitializedRef.current = false;
            }
        };

        // Esperar un poco para asegurar que la app está completamente cargada
        const timer = setTimeout(() => {
            initializeTracking();
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, [userId, acceso]);

    // Limpiar al desmontar o cuando cambia el usuario
    useEffect(() => {
        return () => {
            if (acceso !== 'conductor') {
                trackingInitializedRef.current = false;
            }
        };
    }, [acceso]);

    // Este componente no renderiza nada
    return null;
};

export default AutoTrackingInitializer;

