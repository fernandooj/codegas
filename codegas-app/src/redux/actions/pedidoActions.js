import {
  GET_PEDIDO,
  GET_PEDIDOS,
  GET_VEHICULOS_PEDIDOS,
  GET_ZONA_PEDIDOS,
  GET_PEDIDOS_FRECUENCIA,
  GET_GRUPOS_FRECUENCIA,
  GET_PEDIDOS_USER,
  GET_PEDIDOS_CHART,
  UPDATE_PEDIDO_CHECKLIST
} from "./constants/actionsTypes";
import axios from "axios";
import moment from "moment";

// Importar debug logger (se inicializará cuando se use)
let debugLogger = null;
const getDebugLogger = () => {
  if (!debugLogger) {
    try {
      debugLogger = require('../../components/DebugPanel').debugLogger;
      debugLogger.init();
    } catch (e) {
      // Si no está disponible, usar console normal
      debugLogger = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.log
      };
    }
  }
  return debugLogger;
};

// Función auxiliar para cargar tanques desde cache cuando se cargan pedidos desde cache
const loadTanquesFromCache = async (pedidos) => {
  if (!pedidos || pedidos.length === 0) return;

  try {
    const { tanqueStorageService } = require('../../services/tanqueStorageService');

    // Obtener puntos únicos de los pedidos
    const puntosUnicos = [...new Set(pedidos.map(p => p.puntoId?.toString()).filter(Boolean))];

    if (puntosUnicos.length === 0) {
      console.log('📋 [getPedidos] No hay puntos únicos en pedidos cacheados');
      return;
    }

    console.log(`🔄 [getPedidos] Verificando tanques en cache para ${puntosUnicos.length} puntos...`);
    getDebugLogger().info('Verificando tanques en cache', { puntos: puntosUnicos });

    // Verificar qué tanques ya están en cache
    const tanquesEnCache = await Promise.all(
      puntosUnicos.map(async (puntoId) => {
        try {
          const cachedTanques = await tanqueStorageService.getTanquesByPunto(puntoId);
          return { puntoId, tieneCache: cachedTanques && cachedTanques.length > 0, count: cachedTanques?.length || 0 };
        } catch (error) {
          return { puntoId, tieneCache: false, error: error.message };
        }
      })
    );

    const puntosConTanques = tanquesEnCache.filter(t => t.tieneCache).length;
    console.log(`✅ [getPedidos] Tanques en cache: ${puntosConTanques}/${puntosUnicos.length} puntos tienen tanques guardados`);
    getDebugLogger().info('Verificación de tanques en cache completada', {
      total: puntosUnicos.length,
      conTanques: puntosConTanques,
      detalles: tanquesEnCache
    });
  } catch (error) {
    console.error('❌ [getPedidos] Error verificando tanques en cache:', error);
    getDebugLogger().error('Error verificando tanques en cache', error);
  }
};

const getPedido = pedidoId => {
  return dispatch => {
    return axios
      .get(`/ped/pedido/${pedidoId}`)
      .then(res => {
        dispatch({
          type: GET_PEDIDO,
          pedido: res.data.pedido
        });
      })
      .catch(err => {
      });
  };
};

const getPedidoByUser = userId => {
  return dispatch => {
    return axios
      .get(`/ped/pedido/byUser/${userId}`)
      .then(res => {
        dispatch({
          type: GET_PEDIDOS_USER,
          pedidosUser: res.data.pedido
        });
      })
      .catch(err => {
      });
  };
};


const getPedidos = (idUser, start, limit, acceso, search, estado = 'todos', ordenPor = 'fecha_creacion', tipoOrden = 'DESC', append = false) => {
  return async (dispatch) => {
    try {
      // Validar parámetros antes de hacer la petición
      const validIdUser = idUser && idUser !== 'undefined' ? idUser : '0';
      const validStart = start && start !== 'undefined' ? start : '0';
      const validLimit = limit && limit !== 'undefined' ? limit : '10';
      const validAcceso = acceso && acceso !== 'undefined' ? acceso : 'all';
      const validSearch = search && search !== 'undefined' && search !== '' ? search : 'all';
      const validEstado = estado && estado !== 'undefined' ? estado : 'todos';
      const validOrdenPor = ordenPor && ordenPor !== 'undefined' ? ordenPor : 'fecha_creacion';
      const validTipoOrden = tipoOrden && tipoOrden !== 'undefined' ? tipoOrden : 'DESC';

      // Importar servicios necesarios
      const { pedidoStorageService } = require('../../services/pedidoStorageService');
      const NetInfo = require('@react-native-community/netinfo').default;

      // Verificar conexión
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected ?? false;

      const netInfoData = {
        isConnected: netInfo.isConnected,
        type: netInfo.type,
        isInternetReachable: netInfo.isInternetReachable,
        isOnline: isOnline
      };
      console.log('🌐 [getPedidos] Estado de red:', netInfoData);
      getDebugLogger().info('Estado de red en getPedidos', netInfoData);

      if (isOnline) {
        // Online: cargar desde el servidor
        try {
          // Construir URL y mostrarla para debug
          const newUrl = `/ped/pedido/todos/app/${validIdUser}/${validLimit}/${validStart}/${validAcceso}/${validSearch}/${validEstado}/${validOrdenPor}/${validTipoOrden}`;

          console.log('📡 [getPedidos] Intentando cargar desde servidor:', newUrl);

          // Usar la nueva ruta con todos los parámetros (backend debe estar actualizado)
          const response = await axios.get(newUrl, {
            timeout: 10000 // 10 segundos de timeout
          });

          if (response.status !== 200) {
            throw new Error(`Request failed with status ${response.status}`)
          }

          const pedidos = response.data.pedido || [];

          console.log('✅ [getPedidos] Pedidos recibidos del servidor:', pedidos.length);
          getDebugLogger().info('Pedidos recibidos del servidor', { count: pedidos.length });

          // Guardar en almacenamiento local
          try {
            await pedidoStorageService.savePedidos(
              pedidos,
              validIdUser,
              validAcceso,
              validEstado,
              validSearch !== 'all' ? validSearch : undefined,
              validOrdenPor,
              validTipoOrden
            );
            console.log('💾 [getPedidos] Pedidos guardados en storage');
            getDebugLogger().info('Pedidos guardados en storage', { count: pedidos.length });
          } catch (saveError) {
            console.error('❌ [getPedidos] Error guardando pedidos en storage:', saveError);
            getDebugLogger().error('Error guardando pedidos en storage', saveError);
            // Continuar aunque falle el guardado
          }

          dispatch({
            type: GET_PEDIDOS,
            pedidos: pedidos,
            append: append, // Si es true, agregar a los existentes; si es false, reemplazar
          });

          // Cargar tanques de cada punto cuando está online (en segundo plano, no bloquea)
          if (pedidos.length > 0) {
            // Importar dinámicamente para evitar dependencias circulares
            const { tanqueStorageService } = require('../../services/tanqueStorageService');
            const { getTanquesByPunto } = require('./tanqueActions');

            // Cargar tanques en segundo plano (fire and forget)
            (async () => {
              try {
                console.log('📡 [getPedidos] Online - Cargando tanques de puntos en segundo plano...');
                getDebugLogger().info('Iniciando carga de tanques para puntos', { pedidosCount: pedidos.length });

                // Obtener puntos únicos de los pedidos
                const puntosUnicos = [...new Set(pedidos.map(p => p.puntoId?.toString()).filter(Boolean))];
                console.log(`🔍 [getPedidos] Puntos únicos encontrados: ${puntosUnicos.length}`, puntosUnicos);
                getDebugLogger().info('Puntos únicos para cargar tanques', { puntos: puntosUnicos });

                // Cargar tanques de cada punto en paralelo (sin bloquear)
                const resultados = await Promise.allSettled(
                  puntosUnicos.map(async (puntoId) => {
                    try {
                      console.log(`🔄 [getPedidos] Cargando tanques para punto ${puntoId}...`);
                      const tanquesResponse = await getTanquesByPunto(puntoId);
                      if (tanquesResponse?.tanque && Array.isArray(tanquesResponse.tanque)) {
                        // Ya se guarda en getTanquesByPunto, pero asegurémonos
                        await tanqueStorageService.saveTanquesByPunto(puntoId, tanquesResponse.tanque);
                        console.log(`✅ [getPedidos] Tanques guardados para punto ${puntoId}: ${tanquesResponse.tanque.length}`);
                        getDebugLogger().info(`Tanques guardados para punto ${puntoId}`, { count: tanquesResponse.tanque.length });
                        return { puntoId, success: true, count: tanquesResponse.tanque.length };
                      } else {
                        console.warn(`⚠️ [getPedidos] No se recibieron tanques para punto ${puntoId}`);
                        return { puntoId, success: false, reason: 'No tanques in response' };
                      }
                    } catch (error) {
                      console.error(`❌ [getPedidos] Error cargando tanques para punto ${puntoId}:`, error);
                      getDebugLogger().error(`Error cargando tanques para punto ${puntoId}`, error);
                      return { puntoId, success: false, error: error.message };
                    }
                  })
                );

                const exitosos = resultados.filter(r => r.status === 'fulfilled' && r.value?.success).length;
                console.log(`✅ [getPedidos] Tanques cargados: ${exitosos}/${puntosUnicos.length} puntos exitosos`);
                getDebugLogger().info('Carga de tanques completada', {
                  total: puntosUnicos.length,
                  exitosos: exitosos,
                  resultados: resultados.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason })
                });
              } catch (error) {
                console.error('❌ [getPedidos] Error en carga de tanques:', error);
                getDebugLogger().error('Error general en carga de tanques', error);
              }
            })();
          }
        } catch (networkError) {
          console.warn('⚠️ [getPedidos] Error de red, intentando cargar desde cache:', {
            message: networkError.message,
            code: networkError.code,
            isNetworkError: networkError.message?.includes('Network') || networkError.code === 'NETWORK_ERROR' || networkError.code === 'ECONNREFUSED'
          });

          // Si falla la red, intentar cargar desde cache
          try {
            const cachedPedidos = await pedidoStorageService.getPedidos(
              validIdUser,
              validAcceso,
              validEstado,
              validSearch !== 'all' ? validSearch : undefined,
              validOrdenPor,
              validTipoOrden
            );

            if (cachedPedidos && cachedPedidos.length > 0) {
              console.log('✅ [getPedidos] Pedidos cargados desde cache después de error de red:', cachedPedidos.length);
              getDebugLogger().info('Pedidos cargados desde cache después de error de red', { count: cachedPedidos.length });

              dispatch({
                type: GET_PEDIDOS,
                pedidos: cachedPedidos,
                append: append,
              });

              // También cargar tanques desde cache si están disponibles
              await loadTanquesFromCache(cachedPedidos);

              // Retornar un flag para indicar que se usó cache
              return { fromCache: true };
            } else {
              console.warn('⚠️ [getPedidos] No hay pedidos en cache después de error de red');
              getDebugLogger().warn('No hay pedidos en cache después de error de red');
            }
          } catch (cacheError) {
            console.error('❌ [getPedidos] Error cargando desde cache:', cacheError);
          }

          // Si no hay cache, lanzar el error pero también intentar cargar cualquier cache disponible
          throw networkError;
        }
      } else {
        // Offline: cargar desde almacenamiento local
        const filtersData = {
          validIdUser,
          validAcceso,
          validEstado,
          validSearch: validSearch !== 'all' ? validSearch : undefined,
          validOrdenPor,
          validTipoOrden
        };
        console.log('📴 [getPedidos] Offline detectado - Cargando pedidos desde cache');
        console.log('📋 [getPedidos] Filtros:', filtersData);
        getDebugLogger().warn('Modo offline - Cargando desde cache', filtersData);

        try {
          const cachedPedidos = await pedidoStorageService.getPedidos(
            validIdUser,
            validAcceso,
            validEstado,
            validSearch !== 'all' ? validSearch : undefined,
            validOrdenPor,
            validTipoOrden
          );

          if (cachedPedidos && cachedPedidos.length > 0) {
            console.log('✅ [getPedidos] Pedidos cargados desde cache:', cachedPedidos.length);
            getDebugLogger().info('Pedidos cargados desde cache', { count: cachedPedidos.length });

            dispatch({
              type: GET_PEDIDOS,
              pedidos: cachedPedidos,
            });

            // También cargar tanques desde cache si están disponibles
            await loadTanquesFromCache(cachedPedidos);

            return { fromCache: true };
          } else {
            console.warn('⚠️ [getPedidos] No hay pedidos en cache para estos filtros específicos');
            getDebugLogger().warn('No hay pedidos en cache para estos filtros', filtersData);

            // Intentar cargar con filtros más genéricos (sin search)
            if (validSearch !== 'all') {
              console.log('🔄 [getPedidos] Intentando cargar sin filtro de búsqueda...');
              const cachedPedidosSinSearch = await pedidoStorageService.getPedidos(
                validIdUser,
                validAcceso,
                validEstado,
                undefined, // Sin search
                validOrdenPor,
                validTipoOrden
              );

              if (cachedPedidosSinSearch && cachedPedidosSinSearch.length > 0) {
                console.log('✅ [getPedidos] Pedidos cargados desde cache (sin search):', cachedPedidosSinSearch.length);
                dispatch({
                  type: GET_PEDIDOS,
                  pedidos: cachedPedidosSinSearch,
                });
                return { fromCache: true };
              }
            }

            dispatch({
              type: GET_PEDIDOS,
              pedidos: [],
            });
            return { fromCache: false, empty: true };
          }
        } catch (cacheError) {
          console.error('❌ [getPedidos] Error cargando desde cache:', cacheError);
          dispatch({
            type: GET_PEDIDOS,
            pedidos: [],
          });
          return { fromCache: false, empty: true, error: cacheError.message };
        }
      }
    } catch (err) {
      console.error('Error en getPedidos:', err);

      // Como último recurso, intentar cargar desde cache
      try {
        const { pedidoStorageService } = require('../../services/pedidoStorageService');
        const validIdUser = idUser && idUser !== 'undefined' ? idUser : '0';
        const validAcceso = acceso && acceso !== 'undefined' ? acceso : 'all';
        const validSearch = search && search !== 'undefined' && search !== '' ? search : 'all';
        const validEstado = estado && estado !== 'undefined' ? estado : 'todos';
        const validOrdenPor = ordenPor && ordenPor !== 'undefined' ? ordenPor : 'fecha_creacion';
        const validTipoOrden = tipoOrden && tipoOrden !== 'undefined' ? tipoOrden : 'DESC';

        const cachedPedidos = await pedidoStorageService.getPedidos(
          validIdUser,
          validAcceso,
          validEstado,
          validSearch !== 'all' ? validSearch : undefined,
          validOrdenPor,
          validTipoOrden
        );

        if (cachedPedidos && cachedPedidos.length > 0) {
          console.log('✅ [getPedidos] Pedidos cargados desde cache como fallback:', cachedPedidos.length);
          getDebugLogger().info('Pedidos cargados desde cache como fallback', { count: cachedPedidos.length });

          dispatch({
            type: GET_PEDIDOS,
            pedidos: cachedPedidos,
          });

          // También cargar tanques desde cache si están disponibles
          await loadTanquesFromCache(cachedPedidos);

          return { fromCache: true };
        }
      } catch (cacheError) {
        console.error('❌ [getPedidos] Error cargando desde cache:', cacheError);
      }

      dispatch({
        type: GET_PEDIDOS,
        pedidos: [],
      });
      throw err;
    }
  };
};


const getVehiculosConPedidos = (data) => {
  return dispatch => {
    return axios
      .get(`ped/pedido/vehiculosConPedidos/${data}`)
      .then(res => {
        dispatch({
          type: GET_VEHICULOS_PEDIDOS,
          vehiculosPedidos: res.data.carro
        });
      })
      .catch(err => {
      });
  };
};

const getZonasPedidos = (fechaEntrega) => {
  return dispatch => {
    return axios
      .get(`zon/zona/pedido/${fechaEntrega}`)
      .then(res => {
        dispatch({
          type: GET_ZONA_PEDIDOS,
          zonaPedidos: res.data.zona
        });
      })
      .catch(err => {
      });
  };
};

const getFrecuencia = () => {
  return dispatch => {
    return axios
      .get(`fre/frecuencia/todas`)
      .then(res => {
        dispatch({
          type: GET_PEDIDOS_FRECUENCIA,
          pedidosFrecuencia: res.data.frecuencias || []
        });
        // También dispatch grupos si vienen en la respuesta
        if (res.data.grupos) {
          dispatch({
            type: GET_GRUPOS_FRECUENCIA,
            gruposFrecuencia: res.data.grupos || []
          });
        }
      })
      .catch(err => {
        console.error('Error loading frecuencias:', err);
        dispatch({
          type: GET_PEDIDOS_FRECUENCIA,
          pedidosFrecuencia: []
        });
        dispatch({
          type: GET_GRUPOS_FRECUENCIA,
          gruposFrecuencia: []
        });
      });
  };
};

const getPedidosChart = (idUser) => {
  return async (dispatch) => {
    try {
      console.log('🔄 getPedidosChart - Llamando API con userId:', idUser);
      const response = await axios.get(`/ped/pedido/chart/${idUser}`);
      console.log('✅ getPedidosChart - Respuesta del API:', response.data);
      console.log('📊 getPedidosChart - Cantidad de pedidos:', response.data.pedido?.length || 0);

      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      dispatch({
        type: GET_PEDIDOS_CHART,
        pedidosChart: response.data.pedido || [],
      });
    } catch (err) {
      console.error('❌ getPedidosChart - Error:', err);
      console.error('❌ getPedidosChart - Error message:', err.message);
      console.error('❌ getPedidosChart - Error response:', err.response?.data);
      dispatch({
        type: GET_PEDIDOS_CHART,
        pedidosChart: [],
      });
    }
  };
};

// Nueva acción para verificar pedidos del día
const verificarPedidoHoy = async (userId, puntoId) => {
  try {
    const response = await axios.get(`ped/pedido/today/${userId}/${puntoId}`);
    return response.data;
  } catch (error) {
    console.error('Error en verificarPedidoHoy:', {
      function: 'verificarPedidoHoy',
      userId: userId,
      puntoId: puntoId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Nueva acción para crear pedido
const crearPedido = async (pedidoData) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'ped/pedido',
      data: JSON.stringify(pedidoData),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en crearPedido:', {
      function: 'crearPedido',
      pedidoData: pedidoData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para obtener novedades por pedido
const getNovedadesByPedido = async (pedidoId) => {
  try {
    const response = await axios.get(`nov/novedad/byPedido/${pedidoId}`);
    return response.data;
  } catch (error) {
    console.error('Error en getNovedadesByPedido:', {
      function: 'getNovedadesByPedido',
      pedidoId: pedidoId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para guardar novedad inactivo
const guardarNovedadInactivo = async (pedidoId, novedad, conductorId = null, motivoKey = null) => {
  try {
    const response = await axios.post(`ped/pedido/novedad`, {
      _id: pedidoId,
      novedad,
      perfil_novedad: motivoKey || 'inactivo',
      motivo_key: motivoKey || 'inactivo',
      fechaEntrega: moment().format('YYYY-MM-DD HH:mm:ss'),
      conductorId: conductorId
    });
    return response.data;
  } catch (error) {
    console.error('Error en guardarNovedadInactivo:', {
      function: 'guardarNovedadInactivo',
      pedidoId: pedidoId,
      novedad: novedad,
      conductorId: conductorId,
      motivoKey: motivoKey,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para asignar conductor
// El backend espera: /ped/pedido/asignarConductor/{pedidoId}/{carroId}/{nPedido}
// donde nPedido es el usuarioAsigna (el backend maneja la fecha como null)
const asignarConductor = async (id, idVehiculo, fechaEntrega, usuarioAsigna) => {
  try {
    // El backend solo espera 3 parámetros: pedidoId, carroId, nPedido (usuarioAsigna)
    // La fecha no se envía en la URL, el backend la maneja como null
    const response = await axios.get(`ped/pedido/asignarConductor/${id}/${idVehiculo}/${usuarioAsigna}`);
    return response.data;
  } catch (error) {
    console.error('Error en asignarConductor:', {
      function: 'asignarConductor',
      id: id,
      idVehiculo: idVehiculo,
      fechaEntrega: fechaEntrega,
      usuarioAsigna: usuarioAsigna,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para asignar fecha de entrega
const asignarFechaEntrega = async (seleccionados) => {
  try {
    const data = { seleccionados };
    const response = await axios({
      method: 'post',
      url: `ped/pedido/asignarFechaEntrega`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en asignarFechaEntrega:', {
      function: 'asignarFechaEntrega',
      seleccionados: seleccionados,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para guardar novedad al cerrar pedido
const guardarNovedadCerrarPedido = async (id, fechaEntrega, novedad, perfil_novedad, conductorId = null) => {
  try {
    const response = await axios.post('ped/pedido/novedad', {
      _id: id,
      fechaEntrega,
      novedad,
      perfil_novedad,
      conductorId
    });
    return response.data;
  } catch (error) {
    console.error('Error en guardarNovedadCerrarPedido:', {
      function: 'guardarNovedadCerrarPedido',
      id: id,
      fechaEntrega: fechaEntrega,
      novedad: novedad,
      perfil_novedad: perfil_novedad,
      conductorId: conductorId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para finalizar pedido
const finalizarPedido = async (id, pedidoData) => {
  try {
    // Extraer mime type de la imagen base64 si existe
    let mimeType = null;
    let imagenFinal = pedidoData.imagen;

    if (pedidoData.imagen && pedidoData.imagen.startsWith('data:')) {
      // Extraer mime type del formato: data:image/jpeg;base64,/9j/4AAQ...
      const mimeMatch = pedidoData.imagen.match(/data:([^;]+);base64,/);
      mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    }

    // Enviar como JSON (como el backend espera con JSON.parse)
    const data = {
      email: pedidoData.email || '',
      _id: id,
      kilos: pedidoData.kilos,
      factura: pedidoData.factura,
      valor_total: pedidoData.valor_total,
      forma_pago: pedidoData.forma_pago,
      fechaEntrega: pedidoData.fechaEntrega,
      remision: pedidoData.remision,
      imagen: imagenFinal, // Enviar imagen en base64 si existe
      mime: mimeType,       // Mime type extraído de la imagen
      presion_inicial: pedidoData.presion_inicial || null,
      presion_final: pedidoData.presion_final || null,
      porcentaje_inicial: pedidoData.porcentaje_inicial || null,
      porcentaje_final: pedidoData.porcentaje_final || null
    };


    const response = await axios({
      method: 'post',
      url: `ped/pedido/finalizar/${pedidoData.idUsuario || 1}`, // Usar idUsuario como idConductor
      data: data, // Enviar como JSON object (axios lo convertirá automáticamente)
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en finalizarPedido:', {
      function: 'finalizarPedido',
      id: id,
      pedidoData: pedidoData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para cambiar estado del pedido
const cambiarEstadoPedido = async (seleccionados) => {
  try {
    const data = { seleccionados };
    const response = await axios({
      method: 'post',
      url: `ped/pedido/cambiarEstado`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en cambiarEstadoPedido:', {
      function: 'cambiarEstadoPedido',
      seleccionados: seleccionados,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

const resetPedido = async (pedidoId) => {
  try {
    console.log('🔍 resetPedido action - pedidoId:', pedidoId);
    console.log('🔍 URL endpoint:', `/ped/pedido/reset/${pedidoId}`);

    const response = await axios.post(`/ped/pedido/reset/${pedidoId}`);
    console.log('🔍 Respuesta del servidor:', response.data);

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Error al resetear el pedido');
    }
  } catch (error) {
    console.error('Error reseteando pedido:', error);
    console.error('Error response:', error.response);
    return {
      status: false,
      message: error.response?.data?.message || 'Error al resetear el pedido'
    };
  }
};

const getEstadisticas = async (conductorId, periodo, acceso) => {
  try {
    const params = {
      conductorId: conductorId || null,
      periodo: periodo || 'dia',
      acceso: acceso || undefined
    };

    const response = await axios.get('/ped/pedido/estadisticas', { params });

    if (response.data.status) {
      return {
        status: true,
        estadisticas: response.data.estadisticas,
        periodo: response.data.periodo,
        tipoVista: response.data.tipoVista,
        conductorId: response.data.conductorId
      };
    } else {
      throw new Error(response.data.message || 'Error al obtener estadísticas');
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      status: false,
      message: error.response?.data?.message || 'Error al obtener estadísticas',
      estadisticas: []
    };
  }
};

// Acción para actualizar checklist localmente (sin llamar al backend)
const updateChecklistLocal = (pedidoId, checklist) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PEDIDO_CHECKLIST,
      pedidoId: pedidoId,
      checklist: checklist
    });
  };
};

// Acción para actualizar checklist de un pedido (guarda en backend Y actualiza local)
const updateChecklist = (pedidoId, checklist, firmaConductor = null, firmaUsuario = null) => {
  return async (dispatch) => {
    try {
      console.log('🔍 updateChecklist - pedidoId:', pedidoId);
      console.log('🔍 updateChecklist - checklist:', checklist);
      console.log('🔍 updateChecklist - firmaConductor:', firmaConductor ? 'Presente' : 'No presente');
      console.log('🔍 updateChecklist - firmaUsuario:', firmaUsuario ? 'Presente' : 'No presente');

      const data = { checklist };

      // Agregar firmas si están presentes
      if (firmaConductor) {
        data.firmaConductor = firmaConductor;
      }
      if (firmaUsuario) {
        data.firmaUsuario = firmaUsuario;
      }

      const response = await axios({
        method: 'put',
        url: `/ped/pedido/${pedidoId}/checklist`,
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ updateChecklist - Respuesta:', response.data);

      if (response.data.status) {
        // Actualizar el checklist localmente en Redux
        dispatch({
          type: UPDATE_PEDIDO_CHECKLIST,
          pedidoId: pedidoId,
          checklist: checklist
        });

        return {
          status: true,
          message: response.data.message || 'Checklist actualizado correctamente',
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Error al actualizar checklist');
      }
    } catch (error) {
      console.error('❌ Error en updateChecklist:', {
        function: 'updateChecklist',
        pedidoId: pedidoId,
        checklist: checklist,
        error: error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Error al actualizar checklist'
      };
    }
  };
};

// Acción para obtener checklist de un pedido
const getChecklist = async (pedidoId) => {
  try {
    const response = await axios.get(`/ped/pedido/${pedidoId}/checklist`);

    if (response.data.status) {
      return {
        status: true,
        checklist: response.data.data?.checklist || []
      };
    } else {
      return {
        status: false,
        checklist: []
      };
    }
  } catch (error) {
    console.error('Error obteniendo checklist:', error);
    return {
      status: false,
      checklist: []
    };
  }
};

// Funciones auxiliares para el servicio de sincronización offline
// Estas funciones hacen solo las llamadas HTTP sin dispatch

// Actualizar checklist (solo HTTP, sin dispatch)
const updateChecklistHTTP = async (pedidoId, checklist, firmaConductor = null, firmaUsuario = null) => {
  try {
    const data = { checklist };

    // Agregar firmas si están presentes
    if (firmaConductor) {
      data.firmaConductor = firmaConductor;
    }
    if (firmaUsuario) {
      data.firmaUsuario = firmaUsuario;
    }

    const response = await axios({
      method: 'put',
      url: `/ped/pedido/${pedidoId}/checklist`,
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message || 'Checklist actualizado correctamente',
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Error al actualizar checklist');
    }
  } catch (error) {
    console.error('❌ Error en updateChecklistHTTP:', {
      function: 'updateChecklistHTTP',
      pedidoId: pedidoId,
      checklist: checklist,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Actualizar campos de llenado de tanques (solo HTTP, sin dispatch)
const updateLlenadoTanquesHTTP = async (pedidoId, datosLlenado) => {
  try {
    const { presion_inicial, presion_final, porcentaje_inicial, porcentaje_final } = datosLlenado;

    const data = {
      presion_inicial: presion_inicial !== undefined ? presion_inicial : null,
      presion_final: presion_final !== undefined ? presion_final : null,
      porcentaje_inicial: porcentaje_inicial !== undefined ? porcentaje_inicial : null,
      porcentaje_final: porcentaje_final !== undefined ? porcentaje_final : null
    };

    const response = await axios({
      method: 'put',
      url: `/ped/pedido/${pedidoId}/llenado-tanques`,
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message || 'Campos de llenado de tanques actualizados correctamente',
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Error al actualizar campos de llenado de tanques');
    }
  } catch (error) {
    console.error('❌ Error en updateLlenadoTanquesHTTP:', {
      function: 'updateLlenadoTanquesHTTP',
      pedidoId: pedidoId,
      datosLlenado: datosLlenado,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Actualizar campo tanques de un pedido (solo HTTP, sin dispatch)
const updateTanquesHTTP = async (pedidoId, tanqueData) => {
  try {
    const response = await axios({
      method: 'put',
      url: `/ped/pedido/${pedidoId}/tanques`,
      data: tanqueData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message || 'Campo tanques actualizado correctamente',
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Error al actualizar campo tanques');
    }
  } catch (error) {
    console.error('❌ Error en updateTanquesHTTP:', {
      function: 'updateTanquesHTTP',
      pedidoId: pedidoId,
      tanqueData: tanqueData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Cerrar pedido (solo HTTP, sin dispatch)
const finalizarPedidoHTTP = async (id, pedidoData) => {
  try {
    // El backend espera imagen como base64 y mime type
    // NO debe ser URL, debe ser base64 para que uploadImage lo procese
    let mimeType = null;
    let imagenFinal = pedidoData.imagen;

    // Verificar si la imagen es una URL (no debería pasar si viene de syncQueue)
    const isUrl = imagenFinal && (imagenFinal.startsWith('http://') || imagenFinal.startsWith('https://'));
    
    if (isUrl) {
      console.error('❌ [finalizarPedidoHTTP] ERROR: Imagen es URL, pero el backend espera base64');
      throw new Error('La imagen debe ser base64, no URL. El backend se encargará de subirla a S3.');
    }
    
    if (imagenFinal && imagenFinal.startsWith('data:')) {
      // Extraer mime type del formato: data:image/jpeg;base64,/9j/4AAQ...
      const mimeMatch = imagenFinal.match(/data:image\/([^;]+);base64,/);
      if (mimeMatch) {
        mimeType = `image/${mimeMatch[1]}`;
        // Normalizar: 'image/jpg' -> 'image/jpeg' (el estándar es jpeg)
        if (mimeType === 'image/jpg') {
          mimeType = 'image/jpeg';
        }
      } else {
        mimeType = 'image/jpeg'; // Por defecto
      }
      console.log('📸 [finalizarPedidoHTTP] Imagen base64 detectada, mime type:', mimeType);
    } else if (imagenFinal) {
      // Si la imagen no tiene prefijo data:, asumir que es base64 puro
      console.log('📸 [finalizarPedidoHTTP] Imagen sin prefijo data:, asumiendo base64 puro');
      mimeType = 'image/jpeg'; // Por defecto
    }

    // Validar que si hay imagen, también haya mime type
    if (imagenFinal && !mimeType) {
      console.warn('⚠️ [finalizarPedidoHTTP] Imagen presente pero sin mime type, usando image/jpeg por defecto');
      mimeType = 'image/jpeg';
    }

    // Enviar como JSON (como el backend espera con JSON.parse)
    // El backend uploadImage espera: { imagen: base64, mime: 'image/jpeg' }
    const data = {
      email: pedidoData.email || '',
      _id: id,
      kilos: pedidoData.kilos,
      factura: pedidoData.factura,
      valor_total: pedidoData.valor_total,
      forma_pago: pedidoData.forma_pago,
      fechaEntrega: pedidoData.fechaEntrega,
      remision: pedidoData.remision,
      imagen: imagenFinal || null, // Enviar imagen en base64 (con o sin prefijo data:)
      mime: mimeType || null,      // Mime type es REQUERIDO si hay imagen
      presion_inicial: pedidoData.presion_inicial || null,
      presion_final: pedidoData.presion_final || null,
      porcentaje_inicial: pedidoData.porcentaje_inicial || null,
      porcentaje_final: pedidoData.porcentaje_final || null
    };
    
    console.log('📤 [finalizarPedidoHTTP] Enviando datos al backend:', {
      _id: id,
      tieneImagen: !!imagenFinal,
      imagenLength: imagenFinal ? imagenFinal.length : 0,
      imagenPreview: imagenFinal ? imagenFinal.substring(0, 50) + '...' : null,
      mimeType: mimeType,
      tieneMime: !!mimeType
    });

    const response = await axios({
      method: 'post',
      url: `ped/pedido/finalizar/${pedidoData.idUsuario || 1}`, // Usar idUsuario como idConductor
      data: data, // Enviar como JSON object (axios lo convertirá automáticamente)
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en finalizarPedidoHTTP:', {
      function: 'finalizarPedidoHTTP',
      id: id,
      pedidoData: pedidoData,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para guardar firmas digitales
const guardarFirmas = async (pedidoId, firmaConductor, firmaUsuario) => {
  try {
    console.log('📝 [guardarFirmas] Iniciando guardado de firmas...');
    console.log('📝 [guardarFirmas] pedidoId:', pedidoId, 'tipo:', typeof pedidoId);
    console.log('📝 [guardarFirmas] firmaConductor existe:', !!firmaConductor);
    console.log('📝 [guardarFirmas] firmaUsuario existe:', !!firmaUsuario);
    
    if (firmaConductor) {
      console.log('📝 [guardarFirmas] firmaConductor preview:', firmaConductor.substring(0, 50) + '...');
      console.log('📝 [guardarFirmas] firmaConductor es base64:', firmaConductor.startsWith('data:') || firmaConductor.length > 100);
    }
    if (firmaUsuario) {
      console.log('📝 [guardarFirmas] firmaUsuario preview:', firmaUsuario.substring(0, 50) + '...');
      console.log('📝 [guardarFirmas] firmaUsuario es base64:', firmaUsuario.startsWith('data:') || firmaUsuario.length > 100);
    }

    if (!pedidoId) {
      throw new Error('pedidoId es requerido para guardar firmas');
    }

    if (!firmaConductor && !firmaUsuario) {
      console.warn('⚠️ [guardarFirmas] No hay firmas para guardar');
      return {
        status: false,
        message: 'No hay firmas para guardar'
      };
    }

    const requestData = {
      firmaConductor: firmaConductor || null,
      firmaUsuario: firmaUsuario || null
    };

    console.log('📤 [guardarFirmas] Enviando request:', {
      url: `/ped/pedido/${pedidoId}/firmas`,
      tieneFirmaConductor: !!requestData.firmaConductor,
      tieneFirmaUsuario: !!requestData.firmaUsuario
    });

    const response = await axios({
      method: 'post',
      url: `/ped/pedido/${pedidoId}/firmas`,
      data: requestData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ guardarFirmas - Respuesta:', response.data);

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message || 'Firmas guardadas correctamente',
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Error al guardar firmas');
    }
  } catch (error) {
    console.error('❌ Error en guardarFirmas:', {
      function: 'guardarFirmas',
      pedidoId: pedidoId,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};

// Acción para obtener firmas digitales de un pedido
const obtenerFirmas = async (pedidoId) => {
  try {
    const response = await axios.get(`/ped/pedido/${pedidoId}/firmas`);

    if (response.data.status) {
      return {
        status: true,
        data: response.data.data
      };
    } else {
      return {
        status: false,
        data: null
      };
    }
  } catch (error) {
    console.error('❌ Error en obtenerFirmas:', error);
    return {
      status: false,
      data: null
    };
  }
};

// Acción para enviar email con factura PDF adjunta
const sendFacturaEmail = async (pedidoId, email) => {
  try {
    const response = await axios.post(`/ped/pedido/${pedidoId}/send-factura-email`, {
      email: email
    });

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message || 'Email con factura enviado exitosamente',
        messageId: response.data.messageId,
        email: response.data.email,
        pdfUrl: response.data.pdfUrl
      };
    } else {
      // No lanzar error, solo retornar status false para evitar Toast duplicado
      console.error('❌ Error en sendFacturaEmail (no crítico):', response.data.message || 'Error al enviar email con factura');
      return {
        status: false,
        message: response.data.message || 'Error al enviar email con factura'
      };
    }
  } catch (error) {
    // No lanzar error, solo retornar status false para evitar Toast duplicado
    console.error('❌ Error en sendFacturaEmail (no crítico):', {
      function: 'sendFacturaEmail',
      pedidoId: pedidoId,
      email: email,
      error: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    return {
      status: false,
      message: error.message || 'Error al enviar email con factura'
    };
  }
};

export {
  getPedido,
  getPedidos,
  getVehiculosConPedidos,
  getZonasPedidos,
  getFrecuencia,
  getPedidoByUser,
  getPedidosChart,
  verificarPedidoHoy,
  crearPedido,
  getNovedadesByPedido,
  guardarNovedadInactivo,
  asignarConductor,
  asignarFechaEntrega,
  guardarNovedadCerrarPedido,
  finalizarPedido,
  cambiarEstadoPedido,
  resetPedido,
  getEstadisticas,
  updateChecklist,
  updateChecklistLocal,
  getChecklist,
  updateChecklistHTTP,
  updateLlenadoTanquesHTTP,
  updateTanquesHTTP,
  finalizarPedidoHTTP,
  guardarFirmas,
  obtenerFirmas,
  sendFacturaEmail
};
