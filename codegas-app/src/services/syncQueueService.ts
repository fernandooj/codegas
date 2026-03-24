import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { uploadImageToS3 } from '../utils/s3Upload';
import RNFS from 'react-native-fs';
import { updateChecklistHTTP, finalizarPedidoHTTP, guardarFirmas, updateLlenadoTanquesHTTP, updateTanquesHTTP, sendFacturaEmail } from '../redux/actions/pedidoActions';

// Tipos de operaciones que se pueden sincronizar
export enum SyncOperationType {
  CREATE_PEDIDO = 'CREATE_PEDIDO',
  UPDATE_PEDIDO = 'UPDATE_PEDIDO',
  UPLOAD_IMAGE = 'UPLOAD_IMAGE',
  CREATE_REPORTE = 'CREATE_REPORTE',
  UPDATE_CHECKLIST = 'UPDATE_CHECKLIST',
  CERRAR_PEDIDO = 'CERRAR_PEDIDO',
}

export interface SyncQueueItem {
  id: string;
  type: SyncOperationType;
  data: any;
  imageUris?: string[]; // Rutas locales de imágenes
  localImagePaths?: string[]; // Rutas donde se guardaron localmente
  retries: number;
  maxRetries: number;
  createdAt: number;
  status: 'pending' | 'processing' | 'failed' | 'completed';
  error?: string;
}

const SYNC_QUEUE_KEY = '@sync_queue';
const MAX_RETRIES = 3;

class SyncQueueService {
  private queue: SyncQueueItem[] = [];
  private isProcessing: boolean = false;
  private listeners: ((queue: SyncQueueItem[]) => void)[] = [];
  private onSyncCompleteListeners: (() => void)[] = [];
  private lastForceAtMs: number = 0;

  constructor() {
    this.init();
  }

  // Inicializar el servicio
  async init() {
    await this.loadQueue();
    this.setupNetworkListener();
  }

  // Cargar cola desde AsyncStorage
  private async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (queueData) {
        this.queue = JSON.parse(queueData);
        console.log('📥 [SyncQueue] Cola cargada:', this.queue.length, 'items');

        // Normalizar tipos (pueden venir como strings desde AsyncStorage)
        let normalizedCount = 0;
        this.queue.forEach((item, idx) => {
          // Normalizar el tipo al valor del enum si es un string válido
          if (typeof item.type === 'string') {
            const typeValue = item.type as string;
            // Verificar si el string coincide con algún valor del enum
            if (Object.values(SyncOperationType).includes(typeValue as SyncOperationType)) {
              item.type = typeValue as SyncOperationType;
              normalizedCount++;
            }
          }
          
          // Resetear items que quedaron en 'processing' (probablemente por crash/reinicio)
          if (item.status === 'processing') {
            console.log(`  ⚠️ [${idx}] Item en 'processing' detectado, reseteando a 'pending': ${item.id.substring(0, 20)}...`);
            item.status = 'pending';
          }
          console.log(`  [${idx}] id: ${item.id.substring(0, 20)}..., type: ${item.type}, status: ${item.status}, retries: ${item.retries}/${item.maxRetries}`);
        });

        if (normalizedCount > 0) {
          console.log(`🔄 [SyncQueue] ${normalizedCount} items normalizados`);
        }
        
        const resetCount = this.queue.filter(item => item.status === 'pending' && item.retries === 0).length;
        if (resetCount > 0) {
          console.log(`🔄 [SyncQueue] ${resetCount} items reseteados de 'processing' a 'pending'`);
          await this.saveQueue(); // Guardar los cambios
        }
      }
    } catch (error) {
      console.error('❌ [SyncQueue] Error cargando cola:', error);
    }
  }

  // Guardar cola en AsyncStorage
  private async saveQueue() {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Error guardando cola:', error);
    }
  }

  // Escuchar cambios de conectividad
  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      console.log('🌐 [SyncQueue] Estado de red:', state.isConnected ? 'ONLINE' : 'OFFLINE');
      if (state.isConnected && !this.isProcessing) {
        const pending = this.queue.filter(
          item => item.status === 'pending' || item.status === 'failed'
        ).length;
        console.log(`✅ [SyncQueue] Internet detectado, ${pending} items pendientes, iniciando sincronización...`);
        // Pequeño delay para asegurar que la red está estable
        setTimeout(() => this.processQueue(), 500);
      }
    });
  }

  // Agregar item a la cola
  async addToQueue(
    type: SyncOperationType,
    data: any,
    imageUris?: string[]
  ): Promise<string> {
    console.log('➕ [SyncQueue] addToQueue called', { type, hasImages: !!(imageUris && imageUris.length), dataKeys: Object.keys(data || {}) });
    const itemId = `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Si hay imágenes, guardarlas localmente primero (soporta base64 y URIs locales)
    let localImagePaths: string[] | undefined;
    if (imageUris && imageUris.length > 0) {
      // Ahora soportamos base64 y URIs locales
      localImagePaths = await this.saveImagesLocally(imageUris, itemId);
      if (localImagePaths.length === 0) {
        console.log('⚠️ [SyncQueue] No se pudieron guardar imágenes localmente');
      }
    }

    const item: SyncQueueItem = {
      id: itemId,
      type,
      data,
      imageUris,
      localImagePaths,
      retries: 0,
      maxRetries: MAX_RETRIES,
      createdAt: Date.now(),
      status: 'pending',
    };

    this.queue.push(item);
    await this.saveQueue();

    console.log('➕ [SyncQueue] Item agregado a la cola:', item.id);
    console.log('📋 [SyncQueue] Total items en cola:', this.queue.length);
    console.log('📋 [SyncQueue] Item data:', {
      type: item.type,
      pedidoId: item.data?.pedidoId,
      pedidoDataId: item.data?.pedidoData?._id,
      status: item.status
    });

    // Notificar listeners inmediatamente para que la UI se actualice
    this.notifyListeners();

    // Intentar procesar inmediatamente si hay internet
    const netInfo = await NetInfo.fetch();
    console.log('🌐 [SyncQueue] Net at enqueue:', netInfo.isConnected);
    if (netInfo.isConnected) {
      console.log('🔄 [SyncQueue] Internet disponible, iniciando sincronización...');
      this.processQueue();
    } else {
      console.log('📴 [SyncQueue] Sin internet, el item se sincronizará cuando vuelva la conexión');
    }

    return itemId;
  }

  // Guardar imágenes localmente (soporta URIs locales y base64)
  private async saveImagesLocally(imageUris: string[], itemId: string): Promise<string[]> {
    const localPaths: string[] = [];
    const localDir = `${RNFS.DocumentDirectoryPath}/pending_sync`;

    // Crear directorio si no existe
    const dirExists = await RNFS.exists(localDir);
    if (!dirExists) {
      await RNFS.mkdir(localDir);
    }

    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];

      // Determinar extensión
      let extension = 'jpg';
      if (uri.startsWith('data:')) {
        // Extraer mime type de data:image/jpeg;base64,...
        const mimeMatch = uri.match(/data:image\/([^;]+);base64,/);
        if (mimeMatch) {
          extension = mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1];
        }
      } else {
        extension = uri.split('.').pop() || 'jpg';
      }

      const localPath = `${localDir}/${itemId}_${i}.${extension}`;

      try {
        if (uri.startsWith('data:')) {
          // Es base64, convertir a buffer y escribir archivo
          const base64Data = uri.split(',')[1] || uri.replace(/^data:image\/[^;]+;base64,/, '');
          await RNFS.writeFile(localPath, base64Data, 'base64');
          console.log('💾 [SyncQueue] Imagen base64 guardada localmente:', localPath);
        } else if (uri.startsWith('file://') || uri.startsWith('/')) {
          // Es una ruta local, copiar archivo
          await RNFS.copyFile(uri, localPath);
          console.log('💾 [SyncQueue] Imagen copiada localmente:', localPath);
        } else {
          console.warn('⚠️ [SyncQueue] URI no reconocida, omitiendo:', uri);
          continue;
        }
        localPaths.push(localPath);
      } catch (error) {
        console.error('❌ [SyncQueue] Error guardando imagen localmente:', error);
      }
    }

    return localPaths;
  }

  // Procesar cola de sincronización
  async processQueue() {
    if (this.isProcessing) {
      console.log('⏳ [SyncQueue] processQueue called but already processing');
      return;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('📴 [SyncQueue] No internet, abort processQueue');
      return;
    }

    this.isProcessing = true;
    console.log('🔄 [SyncQueue] Processing queue...');
    console.log(`[SyncQueue] Total items in queue: ${this.queue.length}`);

    // Log del estado de todos los items antes de filtrar
    this.queue.forEach((item, idx) => {
      console.log(`  [${idx}] id: ${item.id.substring(0, 20)}..., type: ${item.type}, status: ${item.status}`);
    });

    const pendingItems = this.queue.filter(
      item => item.status === 'pending' || item.status === 'failed'
    );
    console.log(`[SyncQueue] Pending items to process: ${pendingItems.length}`);

    for (const item of pendingItems) {
      try {
        item.status = 'processing';
        await this.saveQueue();

        console.log(`🔄 [SyncQueue] Processing item: ${item.id} (${item.type})`);
        console.log(`🔍 [SyncQueue] DEBUG - Iniciando procesamiento del item`);

        // Procesar según el tipo
        let processedData = { ...item.data };

        // Validar tipo de forma robusta (puede venir como string desde AsyncStorage)
        const itemTypeString = String(item.type);
        const isCerrarPedido = itemTypeString === SyncOperationType.CERRAR_PEDIDO || itemTypeString === 'CERRAR_PEDIDO';
        
        console.log(`🔍 [SyncQueue] Item type check:`, {
          itemType: item.type,
          itemTypeString: itemTypeString,
          isCerrarPedido: isCerrarPedido,
          CERRAR_PEDIDO: SyncOperationType.CERRAR_PEDIDO,
          hasLocalImages: !!(item.localImagePaths && item.localImagePaths.length > 0),
          hasImageUris: !!(item.imageUris && item.imageUris.length > 0)
        });

        // Para CERRAR_PEDIDO, NO subir imágenes a S3 primero
        // El backend espera base64 y se encargará de subirlas a S3
        if (isCerrarPedido) {
          console.log(`🚫 [SyncQueue] CERRAR_PEDIDO detectado - BLOQUEANDO subida a S3, se enviará como base64 al backend`);
          console.log(`📸 [SyncQueue] CERRAR_PEDIDO - Preparando imagen como base64 para el backend...`);
          
          // Si hay imágenes guardadas localmente, convertirlas a base64
          if (item.localImagePaths && item.localImagePaths.length > 0) {
            try {
              // Leer la primera imagen (imagen de cerrar pedido) y convertirla a base64
              const localPath = item.localImagePaths[0];
              const exists = await RNFS.exists(localPath);
              
              if (exists) {
                console.log(`📸 [SyncQueue] Leyendo imagen local: ${localPath}`);
                const base64Data = await RNFS.readFile(localPath, 'base64');
                
                // Determinar mime type de la extensión
                const extension = localPath.split('.').pop()?.toLowerCase() || 'jpg';
                const mimeType = extension === 'jpg' || extension === 'jpeg' 
                  ? 'image/jpeg' 
                  : extension === 'png' 
                  ? 'image/png' 
                  : `image/${extension}`;
                
                // Crear data URI con base64
                const dataUri = `data:${mimeType};base64,${base64Data}`;
                
                console.log(`✅ [SyncQueue] Imagen convertida a base64 (tamaño: ${base64Data.length} bytes, mime: ${mimeType})`);
                
                // Actualizar pedidoData con la imagen en base64
                if (processedData.pedidoData) {
                  processedData.pedidoData = {
                    ...processedData.pedidoData,
                    imagen: dataUri,
                  };
                }
              } else {
                console.warn(`⚠️ [SyncQueue] Imagen local no existe: ${localPath}`);
              }
            } catch (imageError: any) {
              console.error(`❌ [SyncQueue] Error convirtiendo imagen a base64:`, imageError);
              // Continuar sin imagen si hay error
            }
          } else if (item.imageUris && item.imageUris.length > 0) {
            // Si las imágenes están en imageUris (base64 directo), usarlas directamente
            const imagenBase64 = item.imageUris[0];
            if (imagenBase64.startsWith('data:')) {
              console.log(`📸 [SyncQueue] Usando imagen base64 directamente de imageUris`);
              if (processedData.pedidoData) {
                processedData.pedidoData = {
                  ...processedData.pedidoData,
                  imagen: imagenBase64,
                };
              }
            }
          }

          // Las firmas se mantienen como base64 en processedData.firmas
          // El backend guardarFirmas las subirá automáticamente
        } else {
          // Para otros tipos de operaciones, subir imágenes a S3 primero si es necesario
          console.log(`ℹ️ [SyncQueue] NO es CERRAR_PEDIDO (tipo: ${itemTypeString}), se pueden subir imágenes a S3 si es necesario`);
        let uploadedImageUrls: string[] = [];
        if (item.localImagePaths && item.localImagePaths.length > 0) {
          console.log(`📤 [SyncQueue] Uploading ${item.localImagePaths.length} images...`);
          try {
            uploadedImageUrls = await this.uploadImages(item.localImagePaths);
            console.log('✅ [SyncQueue] Images uploaded:', uploadedImageUrls);
          } catch (uploadError: any) {
              console.error('❌ [SyncQueue] Error uploading images:', uploadError);
            const isNetworkError =
              uploadError?.message?.includes('Network request failed') ||
              uploadError?.message?.includes('timeout') ||
              uploadError?.code === 'NETWORK_ERROR' ||
              uploadError?.code === 'ECONNREFUSED';

            if (isNetworkError) {
              throw uploadError; // Reintentar el item completo
            }
            }
          }
        }

        // Guardar el pedidoId antes de procesar el item, porque después puede cambiar
        const pedidoIdAntes = processedData.pedidoId?.toString() || 
                              processedData.pedidoData?._id?.toString() ||
                              item.data?.pedidoId?.toString();
        
        console.log(`🔍 [SyncQueue] pedidoId antes de cerrar: ${pedidoIdAntes}`);

        await this.processItem(item.type, processedData);

        // Si es CERRAR_PEDIDO y hay firmas, guardarlas también
        // Validar tipo de forma robusta (puede venir como string desde AsyncStorage)
        const itemTypeStringForFirmas = String(item.type);
        const isCerrarPedidoForFirmas = itemTypeStringForFirmas === SyncOperationType.CERRAR_PEDIDO || itemTypeStringForFirmas === 'CERRAR_PEDIDO';
        
        if (isCerrarPedidoForFirmas) {
          console.log(`🔍 [SyncQueue] Verificando firmas para CERRAR_PEDIDO...`);
          console.log(`🔍 [SyncQueue] processedData completo:`, {
            keys: Object.keys(processedData),
            tieneFirmas: !!processedData.firmas,
            firmasKeys: processedData.firmas ? Object.keys(processedData.firmas) : []
          });
          console.log(`🔍 [SyncQueue] item.data completo:`, {
            keys: Object.keys(item.data || {}),
            tieneFirmas: !!item.data?.firmas,
            firmasKeys: item.data?.firmas ? Object.keys(item.data.firmas) : []
          });
          
          // Intentar obtener firmas de processedData o item.data
          const firmasData = processedData.firmas || item.data?.firmas;
          
          console.log(`🔍 [SyncQueue] firmasData obtenido:`, {
            existe: !!firmasData,
            keys: firmasData ? Object.keys(firmasData) : [],
            tieneConductor: !!(firmasData?.conductor),
            tieneUsuario: !!(firmasData?.usuario)
          });
          
          if (firmasData) {
            const { conductor: firmaConductor, usuario: firmaUsuario } = firmasData;
            
            // Usar el pedidoId guardado antes de procesar, o intentar obtenerlo de nuevo
            const pedidoId = pedidoIdAntes || 
                            processedData.pedidoId?.toString() || 
                            processedData.pedidoData?._id?.toString() ||
                            item.data?.pedidoId?.toString();
            
            console.log(`🔍 [SyncQueue] Datos de firmas:`, {
              pedidoId: pedidoId,
              tieneFirmas: !!(firmaConductor || firmaUsuario),
              firmaConductor: !!firmaConductor,
              firmaUsuario: !!firmaUsuario,
              firmaConductorLength: firmaConductor ? firmaConductor.length : 0,
              firmaUsuarioLength: firmaUsuario ? firmaUsuario.length : 0,
              processedDataKeys: Object.keys(processedData),
              itemDataKeys: Object.keys(item.data || {})
            });
            
          if (pedidoId && (firmaConductor || firmaUsuario)) {
            console.log(`✍️ [SyncQueue] Guardando firmas para pedido ${pedidoId}...`);
              console.log(`📝 [SyncQueue] Firma conductor (base64): ${firmaConductor ? `Sí (${firmaConductor.substring(0, 50)}...)` : 'No'}`);
              console.log(`📝 [SyncQueue] Firma usuario (base64): ${firmaUsuario ? `Sí (${firmaUsuario.substring(0, 50)}...)` : 'No'}`);
            try {
              // Las firmas se mantienen como base64 y el backend guardarFirmas las subirá a S3 automáticamente
              await guardarFirmas(pedidoId, firmaConductor || null, firmaUsuario || null);
                console.log(`✅ [SyncQueue] Firmas guardadas correctamente para pedido ${pedidoId}`);
              } catch (error: any) {
                console.error(`❌ [SyncQueue] Error guardando firmas para pedido ${pedidoId}:`, error);
                console.error(`❌ [SyncQueue] Error details:`, {
                  message: error?.message,
                  response: error?.response?.data,
                  status: error?.response?.status,
                  url: error?.config?.url
                });
              // No marcar como fallido solo por las firmas, el pedido ya se cerró
              // Las firmas pueden guardarse manualmente más tarde
              }
            } else {
              console.warn(`⚠️ [SyncQueue] No se pueden guardar firmas:`, {
                pedidoId: pedidoId,
                tieneFirmas: !!(firmaConductor || firmaUsuario),
                firmaConductor: !!firmaConductor,
                firmaUsuario: !!firmaUsuario
              });
            }
          } else {
            console.log(`ℹ️ [SyncQueue] No hay firmas para guardar en este pedido`);
          }
        }

        // Marcar como completado
        item.status = 'completed';

        // Limpiar imágenes locales
        if (item.localImagePaths) {
          await this.cleanupLocalImages(item.localImagePaths);
        }

        console.log(`✅ [SyncQueue] Item completed: ${item.id}`);
      } catch (error: any) {
        console.error(`❌ [SyncQueue] Error processing item ${item.id}:`, error);

        item.retries += 1;
        item.error = error.message;

        if (item.retries >= item.maxRetries) {
          item.status = 'failed';
          console.error(`❌ [SyncQueue] Item failed after ${item.retries} retries:`, item.id);
        } else {
          item.status = 'pending';
          console.log(`🔄 [SyncQueue] Will retry item (${item.retries}/${item.maxRetries}):`, item.id);
        }
      }

      await this.saveQueue();
    }

    // Limpiar items completados (opcional: mantenerlos por un tiempo)
    const completedCount = this.queue.filter(item => item.status === 'completed').length;
    this.queue = this.queue.filter(item => item.status !== 'completed');
    await this.saveQueue();

    this.isProcessing = false;
    console.log('✅ [SyncQueue] Processing done');

    // Notificar que se completó la sincronización si hubo items completados
    if (completedCount > 0) {
      console.log(`📢 [SyncQueue] ${completedCount} items sincronizados, notificando listeners...`);
      this.onSyncCompleteListeners.forEach(listener => {
        try {
          listener();
        } catch (error) {
          console.error('❌ [SyncQueue] Error en listener de sync complete:', error);
        }
      });
    }
  }

  // Suscribirse a eventos de sincronización completada
  onSyncComplete(callback: () => void) {
    this.onSyncCompleteListeners.push(callback);
    return () => {
      this.onSyncCompleteListeners = this.onSyncCompleteListeners.filter(cb => cb !== callback);
    };
  }

  // Subir imágenes a S3
  private async uploadImages(localPaths: string[]): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < localPaths.length; i++) {
      const localPath = localPaths[i];
      try {
        // Verificar que el archivo existe antes de intentar subirlo
        const exists = await RNFS.exists(localPath);
        if (!exists) {
          console.error(`❌ [SyncQueue] El archivo no existe: ${localPath}`);
          throw new Error(`Archivo no encontrado: ${localPath}`);
        }

        // Obtener información del archivo para determinar el mime type
        const fileExtension = localPath.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = fileExtension === 'jpg' || fileExtension === 'jpeg' 
          ? 'image/jpeg' 
          : fileExtension === 'png' 
          ? 'image/png' 
          : `image/${fileExtension}`;

        console.log(`📤 [SyncQueue] Subiendo imagen ${i + 1}/${localPaths.length}:`, {
          localPath: localPath,
          fileExtension: fileExtension,
          mimeType: mimeType,
          fileExists: exists
        });

        // uploadImageToS3 espera una URI, convertimos la ruta local a URI
        const fileUri = `file://${localPath}`;
        const url = await uploadImageToS3(fileUri);
        urls.push(url);
        console.log(`✅ [SyncQueue] Imagen ${i + 1}/${localPaths.length} subida exitosamente: ${url}`);
      } catch (error: any) {
        console.error(`❌ [SyncQueue] Error subiendo imagen ${i + 1}/${localPaths.length}:`, error);
        console.error(`❌ [SyncQueue] Error details:`, {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
          localPath: localPath
        });

        // Si es un error de red, reintentar más tarde
        const isNetworkError =
          error?.message?.includes('Network request failed') ||
          error?.message?.includes('timeout') ||
          error?.code === 'NETWORK_ERROR' ||
          error?.code === 'ECONNREFUSED';

        if (isNetworkError) {
          console.warn(`⚠️ [SyncQueue] Error de red al subir imagen, se reintentará más tarde`);
          throw error; // Propagar error para que se reintente
        }

        // Para otros errores, también reintentar
        throw error;
      }
    }

    return urls;
  }

  // Procesar item según su tipo
  private async processItem(type: SyncOperationType, data: any) {
    switch (type) {
      case SyncOperationType.UPDATE_CHECKLIST:
        await this.updateChecklist(data);
        break;
      case SyncOperationType.CERRAR_PEDIDO:
        await this.cerrarPedido(data);
        break;
      case SyncOperationType.UPDATE_PEDIDO:
        await this.updatePedido(data);
        break;
      default:
        console.warn('⚠️ Tipo de operación no manejado:', type);
    }
  }

  // Actualizar checklist en el backend usando la acción de Redux
  private async updateChecklist(data: any) {
    const { pedidoId, checklist, firmaConductor, firmaUsuario } = data;
    return await updateChecklistHTTP(pedidoId, checklist, firmaConductor || null, firmaUsuario || null);
  }

  // Cerrar pedido en el backend usando la acción de Redux
  private async cerrarPedido(data: any) {
    // data puede venir como { pedidoId, pedidoData } o { conductorId, pedidoData }
    const pedidoId = data.pedidoId?.toString() || data.pedidoData?._id?.toString();
    const pedidoData = data.pedidoData || data;

    console.log(`🔍 [SyncQueue] cerrarPedido - Datos recibidos:`, {
      pedidoId: pedidoId,
      pedidoIdType: typeof pedidoId,
      tienePedidoData: !!pedidoData,
      dataKeys: Object.keys(data),
      pedidoDataKeys: pedidoData ? Object.keys(pedidoData) : []
    });

    if (!pedidoId) {
      console.error(`❌ [SyncQueue] pedidoId no encontrado en data:`, data);
      throw new Error('pedidoId es requerido para cerrar pedido');
    }

    // Log para debug: verificar que los campos de llenado estén presentes
    console.log(`🔄 [SyncQueue] Cerrando pedido ${pedidoId} con datos:`, {
      tienePresionInicial: pedidoData.presion_inicial !== undefined,
      tienePresionFinal: pedidoData.presion_final !== undefined,
      tienePorcentajeInicial: pedidoData.porcentaje_inicial !== undefined,
      tienePorcentajeFinal: pedidoData.porcentaje_final !== undefined,
      presion_inicial: pedidoData.presion_inicial,
      presion_final: pedidoData.presion_final,
      porcentaje_inicial: pedidoData.porcentaje_inicial,
      porcentaje_final: pedidoData.porcentaje_final,
      tieneImagen: !!pedidoData.imagen,
      imagenType: typeof pedidoData.imagen
    });

    // Asegurar que pedidoData tenga idUsuario para finalizarPedidoHTTP
    if (!pedidoData.idUsuario) {
      // Intentar obtenerlo del contexto o usar un valor por defecto
      pedidoData.idUsuario = 1; // Valor por defecto, debería venir del contexto
      console.warn(`⚠️ [SyncQueue] idUsuario no encontrado, usando valor por defecto: 1`);
    }

    const result = await finalizarPedidoHTTP(pedidoId, pedidoData);
    console.log(`✅ [SyncQueue] Pedido ${pedidoId} cerrado exitosamente, resultado:`, result);
    
    // Enviar email con factura si hay email en pedidoData
    if (result.status && pedidoData.email) {
      try {
        console.log(`📧 [SyncQueue] Enviando email con factura para pedido ${pedidoId} a:`, pedidoData.email);
        await sendFacturaEmail(pedidoId, pedidoData.email);
        console.log(`✅ [SyncQueue] Email con factura enviado exitosamente para pedido ${pedidoId}`);
      } catch (emailError: any) {
        // No fallar el proceso si el email falla, solo loguear
        console.error(`❌ [SyncQueue] Error enviando email con factura (no crítico):`, emailError);
      }
    } else if (result.status && !pedidoData.email) {
      console.log(`ℹ️ [SyncQueue] No hay email para enviar factura del pedido ${pedidoId}`);
    }
    
    return result;
  }

  // Actualizar pedido (puede incluir llenado de tanques u otros campos)
  private async updatePedido(data: any) {
    const { pedidoId, llenadoTanques, updateTanques } = data;

    if (!pedidoId) {
      throw new Error('pedidoId es requerido para actualizar pedido');
    }

    // Checklist / JSONB tanques (SafetyChecklistModal, LlenadoTanquesModal offline)
    if (updateTanques) {
      console.log(`🔄 [SyncQueue] Actualizando campo tanques (JSONB) para pedido ${pedidoId}...`);
      return await updateTanquesHTTP(pedidoId, updateTanques);
    }

    if (llenadoTanques) {
      console.log(`🔄 [SyncQueue] Actualizando llenado de tanques para pedido ${pedidoId}...`);
      return await updateLlenadoTanquesHTTP(pedidoId, llenadoTanques);
    }

    throw new Error('No se especificó qué actualizar del pedido');
  }

  // Limpiar imágenes locales después de sincronizar
  private async cleanupLocalImages(localPaths: string[]) {
    for (const path of localPaths) {
      try {
        const exists = await RNFS.exists(path);
        if (exists) {
          await RNFS.unlink(path);
          console.log('🗑️ Imagen local eliminada:', path);
        }
      } catch (error) {
        console.error('❌ Error eliminando imagen local:', error);
      }
    }
  }

  // Obtener estado de la cola
  getQueue(): SyncQueueItem[] {
    return [...this.queue];
  }

  // Obtener items pendientes
  getPendingCount(): number {
    return this.queue.filter(item => item.status === 'pending' || item.status === 'processing').length;
  }

  // Subscribirse a cambios en la cola
  subscribe(listener: (queue: SyncQueueItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.queue]));
  }

  // Forzar sincronización manual
  async forceSyncNow() {
    console.log('🔄 [SyncQueue] forceSyncNow invoked');
    if (this.isProcessing) {
      console.log('⏳ [SyncQueue] Skip forceSyncNow: already processing');
      return;
    }
    const pending = this.getPendingCount();
    const now = Date.now();
    if (pending === 0 && now - this.lastForceAtMs < 3000) {
      console.log('⏭️ [SyncQueue] Skip forceSyncNow: no pending and called too soon');
      return;
    }
    this.lastForceAtMs = now;
    await this.processQueue();
  }

  // Limpiar cola completamente (solo para desarrollo/debug)
  async clearQueue() {
    this.queue = [];
    await this.saveQueue();
    console.log('🗑️ Cola limpiada');
  }
}

// Singleton
export const syncQueueService = new SyncQueueService();

