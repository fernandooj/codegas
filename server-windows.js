/**
 * @fileoverview API REST intermedia para Firebird
 * Este archivo debe ejecutarse en el servidor principal (181.63.224.174)
 * y se conecta al servidor secundario (192.168.10.61) donde está Firebird
 */

console.log(`[${new Date().toISOString()}] 🚀 Iniciando servidor...`);

try {
    console.log(`[${new Date().toISOString()}] 📦 Cargando módulos...`);
    const express = require('express');
    console.log(`[${new Date().toISOString()}] ✅ express cargado`);
    
    const Firebird = require('node-firebird');
    console.log(`[${new Date().toISOString()}] ✅ node-firebird cargado`);
    
    const cors = require('cors');
    console.log(`[${new Date().toISOString()}] ✅ cors cargado`);

    const app = express();
    console.log(`[${new Date().toISOString()}] ✅ Express app creado`);

    app.use(cors());
    console.log(`[${new Date().toISOString()}] ✅ CORS configurado`);

    app.use(express.json());
    console.log(`[${new Date().toISOString()}] ✅ JSON parser configurado`);

    const PORT = process.env.PORT || 2020;
    console.log(`[${new Date().toISOString()}] ✅ Puerto configurado: ${PORT}`);

    // Configuración de Firebird (conexión al servidor secundario)
    const options = {
        host: '192.168.10.61',  // IP del servidor secundario donde está Firebird
        port: 3050,              // Puerto de Firebird en el servidor secundario
        database: 'C:\\MaGister\\Datos\\MaGisterZ.Mgt', // Ruta en el servidor secundario
        user: 'SYSDBA',
        password: 'masterqey',
        lowercase_keys: true,
        role: null,
        pageSize: 4096
    };
    console.log(`[${new Date().toISOString()}] ✅ Opciones de Firebird configuradas`);

    /**
     * Helper para manejar conexiones a Firebird de forma segura
     */
    const safeFirebirdQuery = (callback) => {
        let db = null;
        const timeout = setTimeout(() => {
            if (db) {
                try {
                    db.detach();
                } catch (e) {
                    console.error(`[${new Date().toISOString()}] Error al cerrar conexión timeout:`, e.message);
                }
            }
        }, 30000); // Timeout de 30 segundos

        try {
            Firebird.attach(options, (err, database) => {
                clearTimeout(timeout);
                
                if (err) {
                    console.error(`[${new Date().toISOString()}] ❌ Error conectando a Firebird:`, err.message);
                    console.error(`[${new Date().toISOString()}] Detalles:`, {
                        code: err.code,
                        errno: err.errno,
                        syscall: err.syscall
                    });
                    return callback(err, null);
                }

                db = database;
                callback(null, db);
            });
        } catch (error) {
            clearTimeout(timeout);
            console.error(`[${new Date().toISOString()}] ❌ Error inesperado en safeFirebirdQuery:`, error.message);
            callback(error, null);
        }
    };

    /**
     * Helper para ejecutar queries de forma segura
     */
    const executeQuery = (db, sql, params, callback) => {
        try {
            db.query(sql, params || [], (err, result) => {
                // Siempre cerrar la conexión
                try {
                    db.detach();
                } catch (detachErr) {
                    console.error(`[${new Date().toISOString()}] Error al cerrar conexión:`, detachErr.message);
                }

                if (err) {
                    console.error(`[${new Date().toISOString()}] ❌ Error ejecutando query:`, err.message);
                    return callback(err, null);
                }

                callback(null, result);
            });
        } catch (error) {
            // Cerrar conexión en caso de error
            try {
                db.detach();
            } catch (detachErr) {
                console.error(`[${new Date().toISOString()}] Error al cerrar conexión (catch):`, detachErr.message);
            }
            console.error(`[${new Date().toISOString()}] ❌ Error inesperado en executeQuery:`, error.message);
            callback(error, null);
        }
    };

    // Endpoint de salud (sin conexión a DB) - PRIMERO para verificar que el servidor funciona
    app.get('/health', (req, res) => {
        console.log(`[${new Date().toISOString()}] GET /health`);
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });
    console.log(`[${new Date().toISOString()}] ✅ Endpoint /health registrado`);

    // Endpoint de prueba
    app.get('/ping', (req, res) => {
        console.log(`[${new Date().toISOString()}] GET /ping - Iniciando conexión a Firebird...`);
        console.log(`[${new Date().toISOString()}] Conectando a: ${options.host}:${options.port}`);
        
        try {
            safeFirebirdQuery((err, db) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        message: err.message,
                        details: {
                            code: err.code,
                            errno: err.errno,
                            syscall: err.syscall
                        }
                    });
                }

                if (!db) {
                    return res.status(500).json({
                        error: true,
                        message: 'No se pudo establecer conexión con la base de datos'
                    });
                }

                console.log(`[${new Date().toISOString()}] ✅ Conexión establecida, ejecutando query...`);

                executeQuery(db, 'SELECT 1 AS ok FROM RDB$DATABASE', [], (queryErr, result) => {
                    if (queryErr) {
                        return res.status(500).json({
                            error: true,
                            message: queryErr.message
                        });
                    }

                    console.log(`[${new Date().toISOString()}] ✅ Query ejecutada exitosamente`);
                    res.json({
                        success: true,
                        data: result
                    });
                });
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ❌ Error inesperado en /ping:`, error.message);
            console.error(`[${new Date().toISOString()}] Stack:`, error.stack);
            res.status(500).json({
                error: true,
                message: 'Error interno del servidor: ' + error.message
            });
        }
    });
    console.log(`[${new Date().toISOString()}] ✅ Endpoint /ping registrado`);

    // Endpoint para ejecutar queries
    app.post('/query', (req, res) => {
        const { sql, params = [] } = req.body;

        if (!sql) {
            return res.status(400).json({
                error: true,
                message: 'SQL query is required'
            });
        }

        console.log(`[${new Date().toISOString()}] POST /query - SQL: ${sql.substring(0, 100)}...`);

        try {
            safeFirebirdQuery((err, db) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        message: err.message
                    });
                }

                if (!db) {
                    return res.status(500).json({
                        error: true,
                        message: 'No se pudo establecer conexión con la base de datos'
                    });
                }

                executeQuery(db, sql, params, (queryErr, result) => {
                    if (queryErr) {
                        return res.status(500).json({
                            error: true,
                            message: queryErr.message
                        });
                    }

                    res.json({
                        success: true,
                        data: result
                    });
                });
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ❌ Error inesperado en /query:`, error.message);
            console.error(`[${new Date().toISOString()}] Stack:`, error.stack);
            res.status(500).json({
                error: true,
                message: 'Error interno del servidor: ' + error.message
            });
        }
    });
    console.log(`[${new Date().toISOString()}] ✅ Endpoint /query registrado`);

    // Endpoint para listar tablas
    app.get('/tables', (req, res) => {
        const sql = `
            SELECT RDB$RELATION_NAME as table_name
            FROM RDB$RELATIONS
            WHERE RDB$SYSTEM_FLAG = 0
            ORDER BY RDB$RELATION_NAME
        `;

        console.log(`[${new Date().toISOString()}] GET /tables - Listando tablas...`);

        try {
            safeFirebirdQuery((err, db) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        message: err.message
                    });
                }

                if (!db) {
                    return res.status(500).json({
                        error: true,
                        message: 'No se pudo establecer conexión con la base de datos'
                    });
                }

                executeQuery(db, sql, [], (queryErr, result) => {
                    if (queryErr) {
                        return res.status(500).json({
                            error: true,
                            message: queryErr.message
                        });
                    }

                    console.log(`[${new Date().toISOString()}] ✅ Tablas listadas: ${result ? result.length : 0} encontradas`);
                    res.json({
                        success: true,
                        data: result || []
                    });
                });
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ❌ Error inesperado en /tables:`, error.message);
            console.error(`[${new Date().toISOString()}] Stack:`, error.stack);
            res.status(500).json({
                error: true,
                message: 'Error interno del servidor: ' + error.message
            });
        }
    });
    console.log(`[${new Date().toISOString()}] ✅ Endpoint /tables registrado`);

    // Manejo de errores no capturados
    process.on('uncaughtException', (error) => {
        console.error(`[${new Date().toISOString()}] ❌ UNCAUGHT EXCEPTION:`, error.message);
        console.error(`[${new Date().toISOString()}] Stack:`, error.stack);
        // No salir del proceso, solo loguear
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error(`[${new Date().toISOString()}] ❌ UNHANDLED REJECTION:`, reason);
        console.error(`[${new Date().toISOString()}] Promise:`, promise);
        // No salir del proceso, solo loguear
    });

    // Manejo de errores de Express
    app.use((err, req, res, next) => {
        console.error(`[${new Date().toISOString()}] ❌ Express Error:`, err.message);
        console.error(`[${new Date().toISOString()}] Stack:`, err.stack);
        res.status(500).json({
            error: true,
            message: 'Error interno del servidor: ' + err.message
        });
    });

    console.log(`[${new Date().toISOString()}] ✅ Todos los endpoints registrados`);
    console.log(`[${new Date().toISOString()}] 🔌 Intentando iniciar servidor en puerto ${PORT}...`);

    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`[${new Date().toISOString()}] 🚀 Firebird API corriendo en http://0.0.0.0:${PORT}`);
        console.log(`[${new Date().toISOString()}] 📊 Endpoints disponibles:`);
        console.log(`   GET  /health  - Estado del servidor (sin DB)`);
        console.log(`   GET  /ping    - Probar conexión`);
        console.log(`   GET  /tables  - Listar tablas`);
        console.log(`   POST /query   - Ejecutar query (body: {sql, params})`);
        console.log(`[${new Date().toISOString()}] 🔗 Conectando a Firebird en: ${options.host}:${options.port}`);
    });

    server.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] ❌ ERROR AL INICIAR SERVIDOR:`, error.message);
        console.error(`[${new Date().toISOString()}] Código:`, error.code);
        if (error.code === 'EADDRINUSE') {
            console.error(`[${new Date().toISOString()}] ⚠️  El puerto ${PORT} ya está en uso`);
            console.error(`[${new Date().toISOString()}] 💡 Solución: Cierra el proceso que usa el puerto o cambia el puerto`);
        }
        process.exit(1);
    });

    // Manejo de cierre graceful
    process.on('SIGTERM', () => {
        console.log(`[${new Date().toISOString()}] SIGTERM recibido, cerrando servidor...`);
        server.close(() => {
            console.log(`[${new Date().toISOString()}] Servidor cerrado`);
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log(`[${new Date().toISOString()}] SIGINT recibido, cerrando servidor...`);
        server.close(() => {
            console.log(`[${new Date().toISOString()}] Servidor cerrado`);
            process.exit(0);
        });
    });

    console.log(`[${new Date().toISOString()}] ✅ Servidor configurado correctamente`);

} catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ ERROR FATAL AL INICIAR:`, error.message);
    console.error(`[${new Date().toISOString()}] Stack:`, error.stack);
    process.exit(1);
}
