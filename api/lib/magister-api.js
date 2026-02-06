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

module.exports = {
    ping,
    query,
    listTables
};



