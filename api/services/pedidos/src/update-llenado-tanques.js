const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * NOTA: Este endpoint ha sido deprecado.
 * Los campos de llenado de tanques (presion_inicial, presion_final, porcentaje_inicial, porcentaje_final)
 * ahora se manejan en una nueva tabla separada.
 */
module.exports.updateLlenadoTanques = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    return {
        statusCode: 410,
        headers,
        body: JSON.stringify({
            status: false,
            message: 'Este endpoint ha sido deprecado. Los campos de llenado de tanques ahora se manejan en una nueva tabla separada.'
        })
    };
};
