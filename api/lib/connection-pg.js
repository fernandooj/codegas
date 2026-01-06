const { Pool } = require('pg');

const { RDS_HOSTNAME, RDS_DB, RDS_PORT, RDS_USERNAME, RDS_PASSWORD } = process.env;

const poolConection = new Pool({
  host: RDS_HOSTNAME,
  database: RDS_DB,
  port: RDS_PORT,
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
  // Configuración del pool para evitar agotar conexiones
  max: 10, // Máximo de clientes en el pool
  min: 2, // Mínimo de clientes en el pool
  idleTimeoutMillis: 30000, // Cerrar clientes inactivos después de 30 segundos
  connectionTimeoutMillis: 10000, // Timeout para obtener una conexión (10 segundos)
  // Manejar errores del pool
  allowExitOnIdle: false, // No cerrar el pool cuando no hay clientes activos
});

// Manejar errores del pool
poolConection.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err);
});

// Manejar advertencias de conexión
poolConection.on('connect', (client) => {
  console.log('✅ Nueva conexión establecida al pool');
});

poolConection.on('remove', (client) => {
  console.log('🔌 Cliente removido del pool');
});

module.exports = { poolConection }