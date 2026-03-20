const getUsers = require('./get-users');
const getPedidos = require('./get-pedidos');
const getVehiculos = require('./get-vehiculos');
const getTanques = require('./get-tanques');
const getRevisiones = require('./get-revisiones');
const getFrecuenciasInforme = require('./get-frecuencias-informe');

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
  const { method, path } = getMethodAndPath(event);

  if (!method || !path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: false, message: 'Bad request' }),
    };
  }

  const cleanPath = path.split('?')[0];

  if (method === 'GET' && cleanPath.startsWith('/informe/users/')) {
    return getUsers.main(event, context);
  }

  if (method === 'GET' && cleanPath.startsWith('/informe/pedidos/')) {
    return getPedidos.main(event, context);
  }

  if (method === 'GET' && cleanPath.startsWith('/informe/vehiculos/')) {
    return getVehiculos.main(event, context);
  }

  if (method === 'GET' && cleanPath.startsWith('/informe/tanques/')) {
    return getTanques.main(event, context);
  }

  if (method === 'GET' && cleanPath.startsWith('/informe/revisiones/')) {
    return getRevisiones.main(event, context);
  }

  if (method === 'GET' && cleanPath.startsWith('/informe/frecuencias/')) {
    return getFrecuenciasInforme.main(event, context);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ status: false, message: 'Ruta no encontrada en informes' }),
  };
};
