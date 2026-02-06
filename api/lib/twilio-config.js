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
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    // Log de configuración sin exponer credenciales sensibles
    console.log('🔧 [TwilioConfig] Configuración de Twilio:');
    console.log('TWILIO_ACCOUNT_SID:', accountSid ? `${accountSid.substring(0, 4)}...${accountSid.substring(accountSid.length - 4)}` : '❌ No configurado');
    console.log('TWILIO_AUTH_TOKEN:', authToken ? '✅ Configurado' : '❌ No configurado');
    console.log('TWILIO_WHATSAPP_NUMBER:', whatsappNumber || '❌ No configurado');

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.');
    }

    // Validar formato del Account SID (debe empezar con AC)
    if (!accountSid.startsWith('AC')) {
      console.warn('⚠️ [TwilioConfig] El Account SID no tiene el formato correcto (debe empezar con AC)');
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
    console.error('❌ Error sending WhatsApp message:', error.message);

    // Proporcionar información más útil según el tipo de error
    if (error.status === 401 || error.code === 20003) {
      console.error('🔐 [TwilioConfig] Error de autenticación. Verifica que:');
      console.error('   1. TWILIO_ACCOUNT_SID sea correcto');
      console.error('   2. TWILIO_AUTH_TOKEN sea correcto y no haya expirado');
      console.error('   3. Las credenciales estén activas en tu cuenta de Twilio');
      console.error('   Más info: https://www.twilio.com/docs/errors/20003');
    } else if (error.code === 21211) {
      console.error('📱 [TwilioConfig] Número de destino inválido:', to);
    } else if (error.code === 21608) {
      console.error('📱 [TwilioConfig] El número de origen no está verificado para WhatsApp');
    }

    throw error;
  }
};

module.exports = {
  getTwilioClient,
  sendWhatsAppMessage
};



