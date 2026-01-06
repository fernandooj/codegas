const { sendWhatsAppMessage } = require('./twilio-config');

/**
 * Genera el mensaje de WhatsApp para notificar al cliente que su pedido fue entregado
 * 
 * @param {object} pedidoData - Datos del pedido entregado
 * @param {number} pedidoData._id - ID del pedido
 * @param {string} pedidoData.factura - Número de factura
 * @param {string} pedidoData.remision - Número de remisión
 * @param {string} pedidoData.kilos - Kilos entregados
 * @param {string} pedidoData.valor_total - Valor total del pedido
 * @param {string} pedidoData.forma_pago - Forma de pago
 * @param {string} pedidoData.razon_social - Razón social del cliente
 * @param {string} pedidoData.nombre - Nombre del cliente
 * @returns {string} - Mensaje formateado para WhatsApp
 */
const generateWhatsAppMessage = (pedidoData) => {
  const {
    _id,
    factura,
    remision,
    kilos,
    valor_total,
    forma_pago,
    razon_social,
    nombre
  } = pedidoData;

  const clienteNombre = razon_social || nombre || 'Cliente';
  
  // Formatear valor total con separadores de miles
  const valorFormateado = valor_total 
    ? new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        minimumFractionDigits: 0 
      }).format(parseFloat(valor_total))
    : 'N/A';

  const mensaje = `✅ *Pedido Entregado - Codegas*

Hola ${clienteNombre},

Nos complace informarle que su pedido ha sido entregado exitosamente.

📋 *Detalles del Pedido:*
• Pedido #${_id}
${factura ? `• Factura: ${factura}` : ''}
${remision ? `• Remisión: ${remision}` : ''}
${kilos ? `• Kilos: ${kilos} kg` : ''}
${valor_total ? `• Valor Total: ${valorFormateado}` : ''}
${forma_pago ? `• Forma de Pago: ${forma_pago}` : ''}

Gracias por confiar en Codegas. Si tiene alguna consulta, puede contactarnos a través de nuestra app.

¡Que tenga un excelente día! 🚀`;

  return mensaje;
};

/**
 * Envía notificación de WhatsApp al cliente cuando un pedido es entregado
 * 
 * @param {string} numeroTelefono - Número de teléfono del cliente (con o sin formato)
 * @param {object} pedidoData - Datos del pedido entregado
 * @returns {Promise<object>} - Resultado del envío del mensaje
 */
const enviarWhatsAppPedidoEntregado = async (numeroTelefono, pedidoData) => {
  try {
    if (!numeroTelefono) {
      console.warn('⚠️ No se proporcionó número de teléfono para enviar WhatsApp');
      return {
        success: false,
        error: 'Número de teléfono no proporcionado'
      };
    }

    const mensaje = generateWhatsAppMessage(pedidoData);
    const resultado = await sendWhatsAppMessage(numeroTelefono, mensaje);

    return {
      success: true,
      messageSid: resultado.messageSid,
      status: resultado.status
    };
  } catch (error) {
    console.error('❌ Error al enviar WhatsApp de pedido entregado:', error);
    // No lanzar el error para que no falle la finalización del pedido
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  generateWhatsAppMessage,
  enviarWhatsAppPedidoEntregado
};



