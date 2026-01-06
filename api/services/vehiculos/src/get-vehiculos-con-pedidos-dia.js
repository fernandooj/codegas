const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Obtener vehículos con sus pedidos asignados del día actual
 *
 * @returns {Promise<object>} - Promise que resuelve con la lista de vehículos y sus pedidos
 * @throws {DatabaseError} - Lanza un error si la operación falla
 */
const GET_VEHICULOS_CON_PEDIDOS = 'SELECT * FROM get_vehiculos_con_pedidos_dia()';

module.exports.main = async (event) => {
  let client;
  const startTime = Date.now();
  try {
    console.log('🔍 [get-vehiculos-con-pedidos-dia] Iniciando obtención de vehículos con pedidos...');
    client = await poolConection.connect();
    console.log('✅ [get-vehiculos-con-pedidos-dia] Conexión a BD establecida');

    console.log('🔍 [get-vehiculos-con-pedidos-dia] Ejecutando query SQL...');
    const queryStartTime = Date.now();
    const { rows: vehiculos } = await client.query(GET_VEHICULOS_CON_PEDIDOS);
    const queryDuration = Date.now() - queryStartTime;
    console.log(`✅ [get-vehiculos-con-pedidos-dia] Query completada en ${queryDuration}ms, se encontraron ${vehiculos.length} vehículos con pedidos`);

    // Log del tamaño de datos para debugging
    const totalPedidos = vehiculos.reduce((sum, v) => {
      const pedidos = Array.isArray(v.pedidos) ? v.pedidos : [];
      return sum + pedidos.length;
    }, 0);
    console.log(`📊 [get-vehiculos-con-pedidos-dia] Total de pedidos asignados: ${totalPedidos}`);

    if (vehiculos.length > 0) {
      const firstVehiculo = vehiculos[0];
      const pedidosCount = Array.isArray(firstVehiculo.pedidos) ? firstVehiculo.pedidos.length : 0;
      console.log(`📊 [get-vehiculos-con-pedidos-dia] Primer vehículo (${firstVehiculo.placa}): ${pedidosCount} pedidos`);

      // Log de kilos de los primeros pedidos para debug
      if (pedidosCount > 0) {
        const firstPedidos = Array.isArray(firstVehiculo.pedidos) ? firstVehiculo.pedidos.slice(0, 3) : [];
        const kilosInfo = firstPedidos.map((p) => ({
          _id: p._id,
          kilos: p.kilos,
          cantidadkl: p.cantidadkl,
          kilosType: typeof p.kilos
        }));
        console.log(`📊 [get-vehiculos-con-pedidos-dia] Primeros 3 pedidos del vehículo ${firstVehiculo.placa} (kilos):`, kilosInfo);
      }
    }

    // Transformar los datos para el frontend
    const resultado = vehiculos.map(vehiculo => {
      // Asegurar que pedidos sea un array válido (JSONB puede venir como objeto o string)
      let pedidos = vehiculo.pedidos || [];

      // Si pedidos es un string, parsearlo
      if (typeof pedidos === 'string') {
        try {
          pedidos = JSON.parse(pedidos);
        } catch (e) {
          console.error('❌ [get-vehiculos-con-pedidos-dia] Error parseando pedidos JSONB:', e);
          pedidos = [];
        }
      }

      // Asegurar que sea un array
      if (!Array.isArray(pedidos)) {
        console.warn('⚠️ [get-vehiculos-con-pedidos-dia] pedidos no es un array para vehículo', vehiculo.vehiculo_id, typeof pedidos);
        pedidos = [];
      }

      return {
        _id: vehiculo.vehiculo_id,
        placa: vehiculo.placa,
        capacidad: Number(vehiculo.capacidad) || 0,
        conductor: vehiculo.conductor_id ? {
          _id: vehiculo.conductor_id,
          nombre: vehiculo.conductor_nombre,
          avatar: vehiculo.conductor_avatar
        } : null,
        total_pedidos: Number(vehiculo.total_pedidos) || 0,
        pedidos_entregados: Number(vehiculo.pedidos_entregados) || 0,
        pedidos: pedidos
      };
    });

    const totalDuration = Date.now() - startTime;
    console.log(`✅ [get-vehiculos-con-pedidos-dia] Función completada exitosamente en ${totalDuration}ms`);

    return {
      status: true,
      vehiculos: resultado,
      total: resultado.length
    };
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [get-vehiculos-con-pedidos-dia] Error después de ${totalDuration}ms:`, error);
    console.error('❌ [get-vehiculos-con-pedidos-dia] Mensaje de error:', error.message);
    console.error('❌ [get-vehiculos-con-pedidos-dia] Stack trace:', error.stack);

    // Si es un error de timeout o conexión, agregar más contexto
    if (error.message && (error.message.includes('timeout') || error.message.includes('connection'))) {
      console.error('❌ [get-vehiculos-con-pedidos-dia] Error de timeout o conexión detectado');
    }

    throw new DatabaseError(error);
  } finally {
    if (client) {
      client.release();
      console.log('🔌 [get-vehiculos-con-pedidos-dia] Conexión a BD liberada');
    }
  }
};

