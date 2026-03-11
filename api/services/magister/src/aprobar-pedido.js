const { poolConection } = require('../../../lib/connection-pg.js');
const { postCotizacion } = require('../../../lib/magister-api');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Formatea COT_NUMERO / COE_NUMERO: "0000GL" + remision, máx 12 caracteres.
 * Si al concatenar se pasa de 12, se quita un cero a la izquierda del prefijo.
 */
function formatNumeroDocumento(remision) {
  const remisionStr = String(remision ?? '').trim();
  if (!remisionStr) return null;
  let prefix = '0000GL';
  let full = prefix + remisionStr;
  while (full.length > 12 && prefix.length > 0) {
    prefix = prefix.slice(0, -1) || '';
    full = prefix + remisionStr;
  }
  return full.length <= 12 ? full : (prefix + remisionStr).slice(0, 12);
}

/**
 * Convierte fecha (Date o string ISO) a entero tipo fecha Firebird/Excel (días desde 1899-12-30).
 */
function fechaToInteger(fecha) {
  if (fecha == null) return null;
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  if (isNaN(d.getTime())) return null;
  const epoch = new Date(1899, 11, 30);
  return Math.floor((d.getTime() - epoch.getTime()) / 86400000);
}

/**
 * Cedula sin dígito de verificación (quita todo después de "-" y convierte a número).
 */
function cedulaSinDigitoVerificacion(cedula) {
  if (cedula == null || cedula === '') return null;
  const str = String(cedula).replace(/-.*$/, '').replace(/\D/g, '');
  const n = parseInt(str, 10);
  return isNaN(n) ? null : n;
}

/**
 * POST /magister/pedido/{pedidoId}/aprobar
 * Obtiene pedido + user + punto + carro, arma payload y envía a MaGister POST /cotizacion.
 */
module.exports.main = async (event) => {
  const pedidoId = event.pathParameters?.pedidoId;
  if (!pedidoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'pedidoId es requerido' }),
    };
  }

  let client;
  try {
    client = await poolConection.connect();

    const sql = `
      SELECT
        p._id AS pedido_id,
        p.kilos,
        p.valorunitario,
        p.remision,
        p.fechaentrega,
        p.usuarioid,
        p.puntoid,
        p.carroid,
        u.cedula,
        u.descuento,
        pt.punto AS punto_numero,
        c.bodega AS carro_bodega,
        c.centro AS carro_centro
      FROM pedidos p
      INNER JOIN users u ON u._id = p.usuarioid
      LEFT JOIN puntos pt ON pt._id = p.puntoid
      LEFT JOIN carros c ON c._id = p.carroid
      WHERE p._id = $1 AND COALESCE(p.eliminado, false) = false
    `;
    const { rows } = await client.query(sql, [pedidoId]);
    client.release();
    client = null;

    if (!rows || rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Pedido no encontrado' }),
      };
    }

    const row = rows[0];
    const numero = formatNumeroDocumento(row.remision);
    if (!numero) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'El pedido no tiene remisión' }),
      };
    }

    const kilos = Number(row.kilos);
    const valorUnitario = Number(row.valorunitario);
    const descuento = row.descuento != null ? Number(row.descuento) : 0;
    const bodega = row.carro_bodega != null ? Number(row.carro_bodega) : 40;
    const centro = row.carro_centro != null ? String(row.carro_centro) : '53';
    const cliente = cedulaSinDigitoVerificacion(row.cedula);
    const clienteSucursal = row.punto_numero != null ? Number(row.punto_numero) : null;
    const coeFecha = fechaToInteger(row.fechaentrega);

    const payload = {
      encabezado: {
        COE_EMPRESA: 1,
        COE_DOCUMENTO: 'RM',
        COE_NUMERO: numero,
        COE_FECHA: coeFecha,
        COE_CLIENTE: cliente,
        COE_CLIENTE_SUCURSAL: clienteSucursal,
        COE_OBSERVACIONES: `APP${row.pedido_id}`,
      },
      items: [
        {
          COT_EMPRESA: 1,
          COT_DOCUMENTO: 'RM',
          COT_NUMERO: numero,
          COT_ITEM: 1,
          COT_TIPO_ITEM: 1,
          COT_DESCRIPCION_ITEM: 'GAS PROPANO',
          COT_REFERENCIA: '1',
          COT_BODEGA: bodega,
          COT_CANTIDAD: kilos,
          COT_VALOR_UNITARIO: valorUnitario,
          COT_VR_DTO: descuento,
          COT_CENTRO_COSTO: centro,
          COT_PROYECTO: 0,
        },
      ],
    };

    const result = await postCotizacion(payload);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Pedido aprobado y enviado a MaGister',
        magister: result,
      }),
    };
  } catch (err) {
    if (client) client.release();
    console.error('[aprobar-pedido]', err);
    const message = err.message || 'Error al aprobar pedido';
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message }),
    };
  }
};
