/**
 * @fileoverview Cliente HTTP para la API REST de Firebird/Magister
 */

const axios = require('axios');

const API_BASE_URL = process.env.MAGISTER_API_URL || 'http://181.63.224.174:65432';

/**
 * Prueba la conexión a la API
 */
const ping = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ping`, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al conectar con Magister API: ${error.message}`);
    }
};

/**
 * Ejecuta una query SQL
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros
 */
const query = async (sql, params = []) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/query`, {
            sql,
            params
        }, {
            timeout: 30000
        });
        return response.data.data;
    } catch (error) {
        throw new Error(`Error ejecutando query: ${error.message}`);
    }
};

/**
 * Lista las tablas de la base de datos
 */
const listTables = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables`, {
            timeout: 10000
        });
        return response.data.data;
    } catch (error) {
        throw new Error(`Error listando tablas: ${error.message}`);
    }
};

/**
 * Obtiene la cartera de un cliente por NIT usando el endpoint /cartera/:nit
 * en la API REST intermedia.
 * @param {string|number} nit - NIT del cliente
 */
const getCarteraByNit = async (nit) => {
    if (!nit) {
        throw new Error('El NIT es obligatorio para consultar la cartera');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/cartera/${encodeURIComponent(nit)}`, {
            timeout: 15000
        });
        // Estructura esperada: { success: true, nit, count, data: [...] }
        if (!response.data || response.data.error) {
            const msg = response.data?.message || 'Respuesta inválida de la API de Magister';
            throw new Error(msg);
        }
        return response.data;
    } catch (error) {
        throw new Error(`Error obteniendo cartera por NIT: ${error.message}`);
    }
};

/**
 * Envía una cotización (encabezado + items) a la API de MaGister (POST /cotizacion).
 * @param {object} payload - { encabezado: {...}, items: [...] }
 */
const postCotizacion = async (payload) => {
    if (!payload || !payload.encabezado || !Array.isArray(payload.items)) {
        throw new Error('Payload debe tener encabezado e items (array)');
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/cotizacion`, payload, {
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        throw new Error(`Error enviando cotización a MaGister: ${msg}`);
    }
};

module.exports = {
    ping,
    query,
    listTables,
    getCarteraByNit,
    postCotizacion
};



