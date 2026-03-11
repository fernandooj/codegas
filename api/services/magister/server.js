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

// --- POST: Insertar cotización (encabezado + detalle) en COTIZACION_ENCABEZADO y COTIZACIONES ---
// Body: { encabezado: { COE_EMPRESA, COE_DOCUMENTO, COE_NUMERO, COE_FECHA?, COE_CLIENTE?, COE_CLIENTE_SUCURSAL?, COE_NUMERO_MG, COE_SINCRONIZADO?, COE_OBSERVACIONES? }, items: [ { COT_TIPO_ITEM?, COT_DESCRIPCION_ITEM?, COT_REFERENCIA?, COT_BODEGA?, COT_CANTIDAD, COT_VALOR_UNITARIO, COT_VR_DTO? } ] }
app.post('/cotizacion', (req, res) => {
  const { encabezado, items } = req.body || {};

  if (!encabezado || !encabezado.COE_EMPRESA || !encabezado.COE_DOCUMENTO || encabezado.COE_NUMERO == null) {
    return res.status(400).json({
      error: true,
      message: 'encabezado con COE_EMPRESA, COE_DOCUMENTO y COE_NUMERO es requerido'
    });
  }

  const empresa = encabezado.COE_EMPRESA;
  const documento = String(encabezado.COE_DOCUMENTO).trim().substring(0, 7);
  const numero = String(encabezado.COE_NUMERO).trim().substring(0, 12);

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: true,
      message: 'items (array con al menos un ítem) es requerido'
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

    const sqlEncabezado = `
      INSERT INTO COTIZACION_ENCABEZADO (COE_EMPRESA, COE_DOCUMENTO, COE_NUMERO, COE_FECHA, COE_CLIENTE, COE_CLIENTE_SUCURSAL, COE_SINCRONIZADO, COE_OBSERVACIONES, COE_NUMERO_MG, COE_ANTICIPO, COE_FORMA_PAGO)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const coeFecha = encabezado.COE_FECHA != null ? encabezado.COE_FECHA : null;
    const coeCliente = encabezado.COE_CLIENTE != null ? encabezado.COE_CLIENTE : null;
    const coeSincronizado = encabezado.COE_SINCRONIZADO != null ? encabezado.COE_SINCRONIZADO : 0;
    const coeObservaciones = encabezado.COE_OBSERVACIONES != null ? String(encabezado.COE_OBSERVACIONES) : null;
    const coeClienteSucursal = encabezado.COE_CLIENTE_SUCURSAL != null ? encabezado.COE_CLIENTE_SUCURSAL : 1;
    const coeNumeroMg = String(encabezado.COE_NUMERO_MG).trim().substring(0, 12);
    // -const coeAnticipo  = encabezado.COE_ANTICIPO != null ? encabezado.COE_ANTICIPO : 0;
    // -const coeFraPrefijo = encabezado.COE_FRA_PREFIJO != null ? String(encabezado.COE_FRA_PREFIJO).trim().substring(0, 7) : null ;    -COE_FRA_PREFIJO, COE_FRA_NUMERO,COE_DEV_CONCEPTO,
    // -const coeFraNumero  = encabezado.COE_FRA_NUMERO != null ? String(encabezado.COE_FRA_NUMERO).trim().substring(0, 12) : null ;     - coeFraPrefijo, coeFraNumero,  coeAnticipo,
    const coeDevConcepto = encabezado.COE_DEV_CONCEPTO != null ? encabezado.COE_DEV_CONCEPTO : 0;
    const coeFormaPago = encabezado.COE_FORMA_PAGO != null ? encabezado.COE_FORMA_PAGO : 3;

    const sqlDetalle = `
      INSERT INTO COTIZACIONES (COT_EMPRESA, COT_DOCUMENTO, COT_NUMERO, COT_ITEM, COT_TIPO_ITEM, COT_DESCRIPCION_ITEM, COT_REFERENCIA, COT_BODEGA, COT_CANTIDAD, COT_VALOR_UNITARIO, COT_VR_DTO, COT_CENTRO_COSTO, COT_PROYECTO)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    let pending = items.length;
    let done = 0;
    let lastError = null;

    const insertarEncabezado = () => {
      if (lastError) {
        db.detach();
        console.error('Error insertando COTIZACIONES:', lastError);
        return res.status(500).json({
          error: true,
          message: lastError.message
        });
      }

      db.query(sqlEncabezado, [empresa, documento, numero, coeFecha, coeCliente, coeClienteSucursal, coeSincronizado, coeObservaciones, coeNumeroMg, coeDevConcepto, coeFormaPago], (errEnc) => {
        db.detach();
        if (errEnc) {
          console.error('Error insertando COTIZACION_ENCABEZADO:', errEnc);
          return res.status(500).json({
            error: true,
            message: errEnc.message
          });
        }

        res.status(201).json({
          success: true,
          message: 'Cotización creada',
          encabezado: { COE_EMPRESA: empresa, COE_DOCUMENTO: documento, COE_NUMERO: numero },
          itemsInsertados: items.length
        });
      });
    };

    const onItemDone = (errItem) => {
      if (errItem) lastError = errItem;
      done++;
      if (done === pending) {
        insertarEncabezado();
      }
    };

    // Primero insertar detalle en COTIZACIONES, luego encabezado
    items.forEach((item, index) => {
      const cotItem = index + 1;
      const tipoItem = item.COT_TIPO_ITEM != null ? item.COT_TIPO_ITEM : 1;
      const descripcion = item.COT_DESCRIPCION_ITEM != null ? String(item.COT_DESCRIPCION_ITEM) : null;
      const referencia = item.COT_REFERENCIA != null ? String(item.COT_REFERENCIA).substring(0, 40) : null;
      const bodega = item.COT_BODEGA != null ? item.COT_BODEGA : null;
      const cantidad = Number(item.COT_CANTIDAD);
      const valorUnitario = Number(item.COT_VALOR_UNITARIO);
      const vrDto = item.COT_VR_DTO != null ? Number(item.COT_VR_DTO) : 0;
      const centroCosto = item.COT_CENTRO_COSTO != null ? String(item.COT_CENTRO_COSTO).substring(0, 40) : null;
      const proyecto = item.COT_PROYECTO != null ? Number(item.COT_PROYECTO) : 0;

      if (isNaN(cantidad) || isNaN(valorUnitario) || isNaN(proyecto)) {
        return onItemDone(new Error(`Item ${cotItem}: COT_CANTIDAD, COT_PROYECTO y COT_VALOR_UNITARIO deben ser numéricos`));
      }

      db.query(
        sqlDetalle,
        [empresa, documento, numero, cotItem, tipoItem, descripcion, referencia, bodega, cantidad, valorUnitario, vrDto, centroCosto, proyecto],
        onItemDone
      );
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
  console.log(`   POST /cotizacion   - Insertar cotización (encabezado + items)`);
  console.log(`   POST /query         - Ejecutar query (body: {sql, params})`);
});

