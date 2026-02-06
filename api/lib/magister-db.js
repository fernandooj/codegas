/**
 * @fileoverview Módulo para la conexión y consulta a la base de datos Magister Firebird.
 * Utiliza la librería 'node-firebird' para interactuar con la base de datos.
 */

const Firebird = require('node-firebird');

/**
 * Construye las opciones de conexión a Firebird a partir de las variables de entorno.
 * @returns {object} Objeto con las opciones de conexión.
 */
const buildOptions = () => {
    // Para conexión directa, usa la IP pública del router (181.63.224.174)
    // que debe tener port forwarding configurado al servidor secundario (192.168.10.61:3050)
    const host = process.env.MAGISTER_DB_HOST || '181.63.224.174';
    // Puerto externo expuesto por el router (debe mapear a 3050 del servidor secundario)
    const port = parseInt(process.env.MAGISTER_DB_PORT || '3050', 10);
    const database = process.env.MAGISTER_DB_NAME || 'C:\\MaGister\\Datos\\MaGisterZ.Mgt';
    const user = process.env.MAGISTER_DB_USER || 'SYSDBA';
    const password = process.env.MAGISTER_DB_PASSWORD || 'masterqey';

    return {
        host,
        port,
        database,
        user,
        password,
        lowercase_keys: true,
        role: null,
        pageSize: 4096,
    };
};

/**
 * Valida que las opciones de conexión esenciales estén presentes.
 * @param {object} options - Opciones de conexión a validar.
 * @throws {Error} Si falta alguna opción de configuración crítica.
 */
const validateOptions = (options) => {
    const missing = [];
    if (!options.database) missing.push('MAGISTER_DB_NAME');
    if (!options.user) missing.push('MAGISTER_DB_USER');
    if (!options.password) missing.push('MAGISTER_DB_PASSWORD');
    if (missing.length) {
        throw new Error(`Falta configuración de la base de datos Magister: ${missing.join(', ')}`);
    }
};

/**
 * Intenta establecer una conexión a la base de datos Firebird usando es-node-firebird.
 * @returns {Promise<object>} Objeto `db` de la librería.
 * @throws {Error} Si ocurre un error durante la conexión.
 */
const attach = async () => {
    const options = buildOptions();
    validateOptions(options);

    console.log('🔌 [MagisterDB] ==================== INICIO DE CONEXIÓN DIRECTA ====================');
    console.log('🔌 [MagisterDB] Host:', options.host);
    console.log('🔌 [MagisterDB] Port:', options.port);
    console.log('🔌 [MagisterDB] Database:', options.database);
    console.log('🔌 [MagisterDB] User:', options.user);
    console.log('⚠️  [MagisterDB] NOTA: Conexión directa requiere port forwarding en el router');

    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        Firebird.attach(options, (err, db) => {
            const elapsed = Date.now() - startTime;
            console.log(`🔌 [MagisterDB] Tiempo transcurrido: ${elapsed}ms`);

            if (err) {
                console.error('❌ [MagisterDB] ==================== ERROR DE CONEXIÓN ====================');
                console.error('❌ [MagisterDB] Contexto de conexión:', {
                    host: options.host,
                    port: options.port,
                    database: options.database,
                    user: options.user,
                });
                console.error('❌ [MagisterDB] Error message:', err.message);
                console.error('❌ [MagisterDB] Error name:', err.name);
                console.error('❌ [MagisterDB] Error code:', err.code);
                console.error('❌ [MagisterDB] Error errno:', err.errno);
                console.error('❌ [MagisterDB] Error syscall:', err.syscall);
                console.error('❌ [MagisterDB] Error gdscode:', err.gdscode);
                console.error('❌ [MagisterDB] Stack:', err.stack);
                console.error('❌ [MagisterDB] Objeto de error completo:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
                console.error('❌ [MagisterDB] ==================== FIN ERROR ====================');
                return reject(err);
            }

            console.log('✅ [MagisterDB] ==================== CONEXIÓN EXITOSA ====================');
            console.log('✅ [MagisterDB] Conexión establecida correctamente');
            console.log('✅ [MagisterDB] Tiempo de conexión:', elapsed, 'ms');
            return resolve(db);
        });
    });
};

/**
 * Ejecuta una consulta SQL en la base de datos Magister.
 * @param {string} sql - La consulta SQL a ejecutar.
 * @param {Array<any>} [params=[]] - Parámetros para la consulta.
 * @returns {Promise<Array<object>>} Una promesa que resuelve con los resultados de la consulta.
 * @throws {Error} Si ocurre un error durante la conexión o la consulta.
 */
const queryMagister = async (sql, params = []) => {
    console.log('🧪 [MagisterDB] Ejecutando query (firebirdsql):', sql);
    const db = await attach();
    try {
        return await new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.error('❌ [MagisterDB] Error en query:', err.message);
                    console.error('❌ [MagisterDB] Error completo:', JSON.stringify(err, null, 2));
                    if (err.code) {
                        console.error('❌ [MagisterDB] Code:', err.code);
                    }
                    if (err.errno) {
                        console.error('❌ [MagisterDB] Errno:', err.errno);
                    }
                    if (err.syscall) {
                        console.error('❌ [MagisterDB] Syscall:', err.syscall);
                    }
                    if (err.gdscode) {
                        console.error('❌ [MagisterDB] GDScode:', err.gdscode);
                    }
                    return reject(err);
                }
                console.log(`✅ [MagisterDB] Query ejecutada: ${result ? result.length : 0} filas`);
                return resolve(result || []);
            });
        });
    } finally {
        db.detach();
        console.log('🔌 [MagisterDB] Conexión cerrada');
    }
};

const testConnection = async () => {
    console.log('🧪 [MagisterDB] Probando conexión básica (sin ejecutar SQL)...');
    const db = await attach();
    try {
        console.log('✅ [MagisterDB] Conexión básica establecida, cerrando...');
        return { ok: true };
    } finally {
        db.detach();
        console.log('🔌 [MagisterDB] Conexión cerrada (testConnection)');
    }
};

module.exports = {
    queryMagister,
    testConnection,
};

