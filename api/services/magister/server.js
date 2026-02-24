const express = require('express');
const Firebird = require('node-firebird');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 65432;

// Configuración de Firebird (conexión local)
const options = {
  host: 'localhost',  // Conexión local
  port: 3050,
  database: 'C:\\MaGister\\Datos\\MaGisterZ.Mgt',
  user: 'SYSDBA',
  password: 'masterkey'
};

// Endpoint para probar la conexión
app.get('/ping', (req, res) => {
  Firebird.attach(options, (err, db) => {
    if (err) {
      console.error('Error conectando a Firebird:', err);
      return res.status(500).json({
        error: true,
        message: err.message
      });
    }
    
    db.query('SELECT 1 AS ok FROM RDB$DATABASE', [], (err, result) => {
      db.detach();
      
      if (err) {
        console.error('Error ejecutando ping:', err);
        return res.status(500).json({
          error: true,
          message: err.message
        });
      }
      
      res.json({
        success: true,
        message: 'Conexión exitosa a Firebird',
        data: result
      });
    });
  });
});

// Endpoint para listar tablas
app.get('/tables', (req, res) => {
  const sql = `
    SELECT RDB$RELATION_NAME AS table_name
    FROM RDB$RELATIONS
    WHERE RDB$SYSTEM_FLAG = 0
    ORDER BY RDB$RELATION_NAME
  `;

  Firebird.attach(options, (err, db) => {
    if (err) {
      console.error('Error conectando a Firebird:', err);
      return res.status(500).json({
        error: true,
        message: err.message
      });
    }

    db.query(sql, [], (err, result) => {
      db.detach();

      if (err) {
        console.error('Error ejecutando query:', err);
        return res.status(500).json({
          error: true,
          message: err.message
        });
      }

      // Limpiar nombres de tablas (remover espacios)
      const tables = result.map(row => ({
        name: row.table_name ? row.table_name.trim() : null
      })).filter(row => row.name);

      res.json({
        success: true,
        count: tables.length,
        data: tables
      });
    });
  });
});

// --- Obtener cartera de un cliente por NIT ---
// Ejemplo: GET /cartera/900123456
app.get('/cartera/:nit', (req, res) => {
  const nit = req.params.nit;

  if (!nit) {
    return res.status(400).json({
      error: true,
      message: 'El NIT del cliente es requerido'
    });
  }

  // Query SQL para obtener la cartera filtrada por NIT
  const sql = `
    SELECT
      CAR_EMPRESA,
      CAR_DOCUMENTO,
      CAR_NUMERO,
      CAR_FECHA,
      CAR_NIT,
      CAR_FECHA_VENCE,
      CAR_SALDO
    FROM CARTERA
    WHERE CAR_NIT = ?
    ORDER BY CAR_FECHA DESC, CAR_NUMERO
  `;

  Firebird.attach(options, (err, db) => {
    if (err) {
      console.error('Error conectando a Firebird:', err);
      return res.status(500).json({
        error: true,
        message: err.message
      });
    }

    db.query(sql, [nit], (err, result) => {
      db.detach();

      if (err) {
        console.error('Error ejecutando query CARTERA:', err);
        return res.status(500).json({
          error: true,
          message: err.message
        });
      }

      res.json({
        success: true,
        nit,
        count: result.length,
        data: result
      });
    });
  });
});

// Endpoint genérico para ejecutar queries
app.post('/query', (req, res) => {
  const { sql, params = [] } = req.body;

  if (!sql) {
    return res.status(400).json({
      error: true,
      message: 'SQL query is required'
    });
  }

  Firebird.attach(options, (err, db) => {
    if (err) {
      console.error('Error conectando a Firebird:', err);
      return res.status(500).json({
        error: true,
        message: err.message
      });
    }

    db.query(sql, params, (err, result) => {
      db.detach();

      if (err) {
        console.error('Error ejecutando query:', err);
        return res.status(500).json({
          error: true,
          message: err.message
        });
      }

      res.json({
        success: true,
        data: result
      });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Firebird API corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   GET  /ping          - Probar conexión`);
  console.log(`   GET  /tables        - Listar tablas`);
  console.log(`   GET  /cartera/:nit  - Cartera del cliente por NIT`);
  console.log(`   POST /query         - Ejecutar query (body: {sql, params})`);
});

