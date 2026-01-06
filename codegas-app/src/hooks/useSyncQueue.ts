import { useState, useEffect, useCallback, useRef } from 'react';
import { syncQueueService, SyncQueueItem, SyncOperationType } from '../services/syncQueueService';
import NetInfo from '@react-native-community/netinfo';

export const useSyncQueue = () => {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    // Subscribirse a cambios en la cola
    const unsubscribe = syncQueueService.subscribe(updatedQueue => {
      setQueue(updatedQueue);
    });

    // Cargar cola inicial
    setQueue(syncQueueService.getQueue());

    // Escuchar estado de red
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
      unsubscribeNetInfo();
    };
  }, []);

  // Disparar sync SOLO en transición OFFLINE -> ONLINE
  const prevIsOnlineRef = useRef<boolean>(isOnline);
  useEffect(() => {
    const wasOnline = prevIsOnlineRef.current;
    prevIsOnlineRef.current = isOnline;
    if (!wasOnline && isOnline) {
      // fire-and-forget; el servicio maneja locks internos
      setTimeout(() => syncQueueService.forceSyncNow(), 200);
    }
  }, [isOnline]);

  // Agregar a la cola
  const addToQueue = useCallback(
    async (type: SyncOperationType, data: any, imageUris?: string[]) => {
      return await syncQueueService.addToQueue(type, data, imageUris);
    },
    []
  );

  // Forzar sincronización
  const forceSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncQueueService.forceSyncNow();
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Obtener contadores
  const pendingCount = queue.filter(
    item => item.status === 'pending' || item.status === 'processing'
  ).length;

  const failedCount = queue.filter(item => item.status === 'failed').length;

  return {
    queue,
    pendingCount,
    failedCount,
    isOnline,
    isSyncing,
    addToQueue,
    forceSync,
  };
};

