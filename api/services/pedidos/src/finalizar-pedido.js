const { poolConection } = require('../../../lib/connection-pg.js')
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image')
const { enviarWhatsAppPedidoEntregado } = require('../../../lib/whatsapp-pedido-entregado')
/** FINALIZAR PEDIDO */
const FINALIZAR_PEDIDO = 'SELECT * FROM finalizar_pedidos($1, $2, $3, $4, $5, $6, $7, $8, $9)';

/** OBTENER DATOS DEL PEDIDO Y CLIENTE PARA WHATSAPP */
const GET_PEDIDO_CLIENTE = `
  SELECT 
    p._id,
    p.factura,
    p.remision,
    p.kilos,
    p.valor_total,
    p.forma_pago,
    u.razon_social,
    u.nombre,
    u.celular AS cliente_celular,
    pt.celular AS punto_celular
  FROM pedidos p
  LEFT JOIN users u ON p.usuarioId = u._id
  LEFT JOIN puntos pt ON p.puntoId = pt._id
  WHERE p._id = $1
`;

/**
 * Inserts a pedido into the database.
 *
 * @param {object} pedido - Object containing the data of the pedido to insert.
 * @param {string} pedido._id - Identifier of the pedido in SQL.
 * @param {string} pedido.kilos - Observation of the pedido.
 * @param {number} pedido.factura - Capacity of the pedido.
 * @param {number} pedido.valor_total - Identifier of the zone where the pedido is located.
 * @param {number} pedido.forma_pago - Identifier of the client associated with the pedido.
 * @param {number} pedido.remision - Identifier of the client associated with the pedido.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const {
    idConductor,
  } = event.pathParameters;
  const body = JSON.parse(event.body);
  const {
    _id, kilos, factura, valor_total, forma_pago, remision, fechaEntrega
  } = body;

  const client = await poolConection.connect();
  try {
    const image_url = await uploadImage(body);

    await client.query(FINALIZAR_PEDIDO, [
      _id, kilos, factura, valor_total, forma_pago, remision, fechaEntrega, image_url, idConductor
    ])

    // Enviar notificación de WhatsApp al cliente (no bloquea si falla)
    try {
      const { rows } = await client.query(GET_PEDIDO_CLIENTE, [_id]);
      if (rows && rows.length > 0) {
        const pedidoData = rows[0];
        // TEMPORAL PARA PRUEBAS: Enviar solo al número de prueba
        // TODO: Después de pruebas, cambiar para usar el número del cliente
        const numeroTelefono = 'whatsapp:+573162479980'; // Número de prueba
        // const numeroTelefono = pedidoData.punto_celular || pedidoData.cliente_celular; // Código original

        if (numeroTelefono) {
          console.log('📱 [PRUEBAS] Enviando WhatsApp de pedido entregado a:', numeroTelefono);
          await enviarWhatsAppPedidoEntregado(numeroTelefono, pedidoData);
        } else {
          console.warn('⚠️ No se encontró número de teléfono para enviar WhatsApp del pedido:', _id);
        }
      }
    } catch (whatsappError) {
      // No fallar la finalización del pedido si falla el WhatsApp
      console.error('❌ Error al enviar WhatsApp (no crítico):', whatsappError);
    }

    return {
      status: true
    }
  } catch (error) {
    console.error(error)
    throw new DatabaseError(error);
  } finally {
    client.release();
  }
};