const crearFrecuenciaSemanal = require('./crear-frecuencia-semanal');
const crearFrecuenciaQuincenal = require('./crear-frecuencia-quincenal');
const crearFrecuenciaMensual = require('./crear-frecuencia-mensual');
const crearPedidosFrecuencia = require('./crear-pedidos-frecuencia');
const getFrecuencias = require('./get-frecuencias');
const getTodasFrecuencias = require('./get-todas-frecuencias');
const editarFrecuencia = require('./editar-frecuencia');
const eliminarFrecuencias = require('./eliminar-frecuencias');
const notificarPedidos3Dias = require('./notificar-pedidos-3-dias');
const getGruposFrecuencias = require('./get-grupos-frecuencias');
const createGrupoFrecuencia = require('./create-grupo-frecuencia');
const updateGrupoFrecuencia = require('./update-grupo-frecuencia');
const deleteGrupoFrecuencia = require('./delete-grupo-frecuencia');
const getPedidosPorGrupo = require('./get-pedidos-por-grupo');
const removerPedidoDeGrupo = require('./remover-pedido-de-grupo');

// Ejecuta el flujo completo de creación de pedidos (individuales + grupos)
// y envío de correo de reporte, usando get-frecuencias.
const runCrearPedidosDiarios = async (event, context) => {
  return getFrecuencias.main(event, context);
};

const getMethodAndPath = (event) => {
  const method =
    event.requestContext?.http?.method ||
    event.httpMethod ||
    event.requestContext?.httpMethod;

  const rawPath =
    event.requestContext?.http?.path ||
    event.rawPath ||
    event.path ||
    event.resourcePath;

  return {
    method: method ? method.toUpperCase() : undefined,
    path: rawPath,
  };
};

module.exports.main = async (event, context) => {
  // Manejo de eventos programados (CloudWatch Events / EventBridge)
  if (event.source === 'aws.events' || event['detail-type'] === 'Scheduled Event') {
    const action =
      event.action ||
      event.detail?.action ||
      event.detailType ||
      event['detail-type'];

    console.log('Scheduled event received with action:', action);

    switch (action) {
      case 'createFrecuenciaSemanal':
        return crearFrecuenciaSemanal.main(event, context);
      case 'createFrecuenciaQuincenal':
        return crearFrecuenciaQuincenal.main(event, context);
      case 'createFrecuenciaMensual':
        return crearFrecuenciaMensual.main(event, context);
      case 'crearPedidosFrecuencia':
        return runCrearPedidosDiarios(event, context);
      case 'getFrecuencias':
        return getFrecuencias.main(event, context);
      case 'notificarPedidos3Dias':
        return notificarPedidos3Dias.main(event, context);
      default:
        console.log('Unhandled scheduled action for frecuencias:', action);
        return;
    }
  }

  // Manejo de eventos HTTP API
  const { method, path } = getMethodAndPath(event);

  console.log('HTTP event received:', { method, path });

  if (!method || !path) {
    console.log('Missing method or path on event:', event);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad request' }),
    };
  }

  // Normalizar path (sin querystring)
  const cleanPath = path.split('?')[0];

  // Rutas HTTP sin parámetros
  if (method === 'GET' && cleanPath === '/fre/frecuencia/semanal') {
    return crearFrecuenciaSemanal.main(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/frecuencia/quincenal') {
    return crearFrecuenciaQuincenal.main(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/frecuencia/mensual') {
    return crearFrecuenciaMensual.main(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/crear-pedidos-frecuencia') {
    return runCrearPedidosDiarios(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/frecuencia') {
    return getFrecuencias.main(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/frecuencia/todas') {
    return getTodasFrecuencias.main(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/notificar-pedidos-3-dias') {
    return notificarPedidos3Dias.main(event, context);
  }

  if (method === 'GET' && cleanPath === '/fre/grupos') {
    return getGruposFrecuencias.main(event, context);
  }

  if (method === 'POST' && cleanPath === '/fre/grupos') {
    return createGrupoFrecuencia.main(event, context);
  }

  // Rutas HTTP con parámetros en el path
  if (method === 'PUT' && cleanPath.startsWith('/fre/frecuencia/')) {
    return editarFrecuencia.main(event, context);
  }

  if (method === 'DELETE' && cleanPath.startsWith('/fre/frecuencia/')) {
    return eliminarFrecuencias.main(event, context);
  }

  if (method === 'PUT' && cleanPath.startsWith('/fre/grupos/')) {
    return updateGrupoFrecuencia.main(event, context);
  }

  if (method === 'DELETE' && cleanPath.startsWith('/fre/grupos/')) {
    // DELETE /fre/grupos/{id}
    if (!cleanPath.startsWith('/fre/grupos/pedidos/')) {
      return deleteGrupoFrecuencia.main(event, context);
    }
  }

  // GET /fre/grupos/{grupoId}/pedidos
  if (
    method === 'GET' &&
    (cleanPath.startsWith('/fre/grupos/') && cleanPath.endsWith('/pedidos'))
  ) {
    return getPedidosPorGrupo.main(event, context);
  }

  // DELETE /fre/grupos/pedidos/{pedidoId}
  if (method === 'DELETE' && cleanPath.startsWith('/fre/grupos/pedidos/')) {
    return removerPedidoDeGrupo.main(event, context);
  }

  console.log('Unhandled HTTP route for frecuencias:', { method, cleanPath });

  return {
    statusCode: 404,
    body: JSON.stringify({
      status: false,
      message: 'Ruta no encontrada en servicio de frecuencias',
    }),
  };
};

