const twilio = require('twilio');

/**
 * Configuración de Twilio para envío de WhatsApp
 * 
 * Variables de entorno requeridas:
 * - TWILIO_ACCOUNT_SID: Account SID de tu cuenta Twilio
 * - TWILIO_AUTH_TOKEN: Auth Token de tu cuenta Twilio
 * - TWILIO_WHATSAPP_NUMBER: Número de WhatsApp de Twilio (formato: whatsapp:+14155238886)
 */

let twilioClient = null;

const getTwilioClient = () => {
  console.log('🔧 [TwilioConfig] Configuración de Twilio:');
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
  console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
  console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER);
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.');
    }

    twilioClient = twilio(accountSid, authToken);
  }

  return twilioClient;
};

/**
 * Envía un mensaje de WhatsApp usando Twilio
 * 
 * @param {string} to - Número de destino en formato: whatsapp:+573001234567
 * @param {string} message - Mensaje a enviar
 * @returns {Promise<object>} - Promise que resuelve con la información del mensaje enviado
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    const client = getTwilioClient();
    const from = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!from) {
      throw new Error('TWILIO_WHATSAPP_NUMBER not configured');
    }

    // Validar formato del número de destino
    if (!to.startsWith('whatsapp:+')) {
      // Si no tiene el prefijo, agregarlo
      if (to.startsWith('+')) {
        to = `whatsapp:${to}`;
      } else {
        // Si no tiene +, asumir código de país de Colombia (+57)
        to = `whatsapp:+57${to.replace(/\D/g, '')}`;
      }
    }

    const messageResult = await client.messages.create({
      from: from,
      to: to,
      body: message
    });

    console.log('✅ WhatsApp message sent successfully:', messageResult.sid);
    return {
      success: true,
      messageSid: messageResult.sid,
      status: messageResult.status
    };
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    throw error;
  }
};

module.exports = {
  getTwilioClient,
  sendWhatsAppMessage
};



