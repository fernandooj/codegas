/**
 * Componente Toggle para activar/desactivar tracking de vehículo
 * 
 * Uso:
 * <TrackingToggle carroId={123} conductorId={456} />
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import useVehicleTracking from '../hooks/useVehicleTracking';

interface TrackingToggleProps {
  carroId: number;
  conductorId: number;
  enPedido?: boolean;
  style?: any;
}

const TrackingToggle: React.FC<TrackingToggleProps> = ({
  carroId,
  conductorId,
  enPedido = false,
  style,
}) => {
  const { isTracking, startTracking, stopTracking, updatePedidoStatus } =
    useVehicleTracking();
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar estado de pedido cuando cambia
  useEffect(() => {
    if (isTracking) {
      updatePedidoStatus(enPedido);
    }
  }, [enPedido, isTracking, updatePedidoStatus]);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isTracking) {
        // Detener tracking
        Alert.alert(
          'Detener Tracking',
          '¿Estás seguro de que deseas detener el seguimiento de ubicación?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => setIsLoading(false),
            },
            {
              text: 'Detener',
              style: 'destructive',
              onPress: () => {
                stopTracking();
                setIsLoading(false);
              },
            },
          ]
        );
      } else {
        // Iniciar tracking
        const success = await startTracking(carroId, conductorId, enPedido);
        setIsLoading(false);

        if (success) {
          Alert.alert(
            'Tracking Activado',
            'Tu ubicación está siendo rastreada para optimizar entregas'
          );
        }
      }
    } catch (error) {
      console.error('Error en toggle:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name="map-marker"
            style={[styles.icon, isTracking && styles.iconActive]}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Tracking GPS</Text>
          <Text style={[styles.status, isTracking && styles.statusActive]}>
            {isTracking ? '🟢 Activo' : '⚪ Inactivo'}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color="#002587" />
        ) : (
          <Switch
            value={isTracking}
            onValueChange={handleToggle}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={isTracking ? '#ffffff' : '#f3f4f6'}
            ios_backgroundColor="#d1d5db"
          />
        )}
      </View>

      {isTracking && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            Alert.alert(
              'Tracking Activo',
              'Tu ubicación se actualiza cada 30 segundos. El seguimiento continuará mientras conduces.\n\nPara optimizar la batería, puedes desactivarlo cuando termines tu turno.',
              [{ text: 'Entendido' }]
            );
          }}
        >
          <FontAwesome name="info-circle" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Actualizando cada 30 segundos
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
    color: '#6b7280',
  },
  iconActive: {
    color: '#10b981',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Comfortaa-Bold',
  },
  status: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'Comfortaa-Regular',
  },
  statusActive: {
    color: '#10b981',
    fontWeight: '500',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoIcon: {
    fontSize: 14,
    color: '#002587',
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Comfortaa-Light',
  },
});

export default TrackingToggle;

