import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSyncQueue } from '../hooks/useSyncQueue';

export const SyncStatusIndicator = () => {
  const { pendingCount, failedCount, isOnline, isSyncing, forceSync } = useSyncQueue();

  if (pendingCount === 0 && failedCount === 0) {
    return null; // No mostrar nada si no hay pendientes
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Indicador de conexión */}
        <View style={[styles.dot, isOnline ? styles.dotOnline : styles.dotOffline]} />

        {/* Estado de sincronización */}
        {isSyncing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.text}>
            {isOnline
              ? '✅ Todo sincronizado'
              : `⏳ ${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''}`}
          </Text>
        )}

        {/* Botón de sincronización manual */}
        {!isOnline && pendingCount > 0 && (
          <Text style={styles.offlineText}>(se sincronizará cuando haya internet)</Text>
        )}

        {isOnline && pendingCount > 0 && (
          <TouchableOpacity onPress={forceSync} style={styles.syncButton}>
            <Text style={styles.syncButtonText}>Sincronizar ahora</Text>
          </TouchableOpacity>
        )}

        {/* Errores */}
        {failedCount > 0 && (
          <Text style={styles.errorText}>
            ❌ {failedCount} error{failedCount !== 1 ? 'es' : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: '#2ecc71',
  },
  dotOffline: {
    backgroundColor: '#e74c3c',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  offlineText: {
    color: '#95a5a6',
    fontSize: 10,
    fontStyle: 'italic',
  },
  syncButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
});

