const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const nodemailer = require('nodemailer');
const path = require('path');

const NOVEDAD_PEDIDO = 'SELECT * FROM novedad_pedidos($1, $2, $3, $4, $5)';

/**
 * Procesa novedad de pedido en la base de datos y envía email de notificación.
 * 
 * @param {object} event - Evento de AWS Lambda con los datos del pedido
 * @param {object} event.body - Cuerpo del evento parseado como JSON
 * @param {string} event.body._id - ID del pedido
 * @param {string} event.body.novedad - Tipo de novedad
 * @param {string} event.body.perfil_novedad - Perfil de la novedad
 * @param {string} event.body.fechaEntrega - Fecha de entrega programada
 * @param {string} event.body.conductorId - ID del conductor
 * @returns {Promise<object>} - Promise que resuelve con el estado de la operación
 * @throws {DatabaseError} - Lanza error si la operación falla
 */

// Configuración de Nodemailer
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log('🔧 [NovedadPedido] Configuración de email:');
console.log('📧 EMAIL_USER:', EMAIL_USER ? '✅ Configurado' : '❌ No configurado');
console.log('🔑 EMAIL_PASS:', EMAIL_PASS ? '✅ Configurado' : '❌ No configurado');

// Verificar que las credenciales estén disponibles
if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ [NovedadPedido] Error: Credenciales de email no configuradas');
    throw new Error('Credenciales de email no configuradas');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    // Configuración adicional para mejorar la compatibilidad
    tls: {
        rejectUnauthorized: false
    },
    // Configuración de timeout
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
});

// Destinatarios del email
const email1 = 'atencionalcliente3@codegascolombia.com'
const email2 = 'coord.logistica@codegascolombia.com'
const email3 = 'atencionalcliente4@codegascolombia.com'
const email4 = 'atencionalcliente2@codegascolombia.com'

// Función para generar el template HTML del email
const generateEmailTemplate = (pedidoData) => {
    const {
        pedidoId,
        novedad,
        perfilNovedad,
        fechaEntrega,
        conductorId,
        fechaReporte
    } = pedidoData;

    // Determinar el nivel de urgencia basado en el tipo de novedad
    const urgenciaColor = '#dc2626'; // Rojo para pedidos no entregados
    const urgenciaTexto = '🚨 PEDIDO NO ENTREGADO';

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novedad de Pedido - CodeGas Colombia</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #3b82f6; padding: 25px; text-align: center; border-radius: 12px 12px 0 0;">
                                <!-- Logo -->
                                <div style="margin-bottom: 15px;">
                                    <img src="cid:logo" alt="CodeGas Colombia" style="max-width: 400px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" />
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                                    📦 Novedad de Pedido
                                </h1>
                                <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">
                                    CodeGas Colombia - Sistema de Gestión de Pedidos
                                </p>
                            </td>
                        </tr>

                        <!-- Urgencia Badge -->
                        <tr>
                            <td style="padding: 20px 30px 0 30px;">
                                <div style="background-color: ${urgenciaColor}; color: #ffffff; padding: 12px 20px; border-radius: 25px; text-align: center; font-weight: 700; font-size: 14px; display: inline-block; width: 100%; box-sizing: border-box;">
                                    ${urgenciaTexto}
                                </div>
                            </td>
                        </tr>

                        <!-- Información del Pedido -->
                        <tr>
                            <td style="padding: 30px;">
                                <div style="background-color: #f1f5f9; padding: 24px; border-radius: 10px; margin-bottom: 24px;">
                                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        📊 Información del Pedido
                                    </h2>
                                    <table role="presentation" cellspacing="0" cellpadding="8" border="0" width="100%">
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; width: 140px;">Número:</td>
                                            <td style="color: #1e293b; font-weight: 700; font-size: 16px;">#${pedidoId}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Fecha Reporte:</td>
                                            <td style="color: #1e293b;">${fechaReporte || new Date().toLocaleString('es-CO')}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Fecha Entrega:</td>
                                            <td style="color: #1e293b;">${fechaEntrega || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Conductor ID:</td>
                                            <td style="color: #1e293b;">${conductorId || 'N/A'}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Detalles de la Novedad -->
                                <div style="margin-bottom: 24px;">
                                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        ⚠️ Detalles de la Novedad
                                    </h2>
                                    
                                    <!-- Tipo de Novedad -->
                                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 12px 0; border-radius: 6px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 18px;">📋</span>
                                            <span style="font-weight: 600; color: #dc2626;">Novedad:</span>
                                            <span style="color: #991b1b; font-weight: 700;">${novedad}</span>
                                        </div>
                                    </div>

                                    <!-- Perfil de la Novedad -->
                                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 12px 0; border-radius: 6px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 18px;">👤</span>
                                            <span style="font-weight: 600; color: #f59e0b;">Perfil de Novedad:</span>
                                            <span style="color: #92400e; font-weight: 700;">${perfilNovedad}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Call to Action -->
                                <div style="background-color: #dc2626; padding: 24px; border-radius: 10px; text-align: center; margin-top: 30px;">
                                    <h3 style="color: #ffffff; margin: 0 0 12px 0; font-size: 18px;">
                                        🚀 Acción Requerida
                                    </h3>
                                    <p style="color: #fecaca; margin: 0 0 16px 0;">
                                        Este pedido ha sido cerrado sin entregar. Se requiere revisión inmediata y seguimiento con el cliente.
                                    </p>
                                    <a href="#" style="background-color: #ffffff; color: #dc2626; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                                        Ver Detalles del Pedido
                                    </a>
                                </div>

                                <!-- Instrucciones -->
                                <div style="background-color: #eff6ff; border: 1px solid #dbeafe; padding: 20px; border-radius: 8px; margin-top: 24px;">
                                    <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">
                                        📋 Próximos Pasos
                                    </h3>
                                    <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                                        <li>Contactar al cliente para reprogramar entrega</li>
                                        <li>Revisar causas de la no entrega</li>
                                        <li>Actualizar estado del pedido en el sistema</li>
                                        <li>Coordinar nueva fecha de entrega</li>
                                        <li>Informar al departamento de logística</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 20px 30px; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="text-align: center;">
                                            <p style="color: #64748b; margin: 0; font-size: 14px;">
                                                <strong>CodeGas Colombia</strong><br>
                                                Sistema de Gestión de Pedidos<br>
                                                📧 app@codegascolombia.com | 📞 +57 311 5192038
                                            </p>
                                            <p style="color: #94a3b8; margin: 12px 0 0 0; font-size: 12px;">
                                                Este es un mensaje automático generado por el sistema. No responda a este correo.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};
module.exports.main = async (event) => {
    const body = JSON.parse(event.body);
    const {
        _id, novedad, perfil_novedad, motivo_key, fechaEntrega, conductorId
    } = body;
    console.log({ _id, novedad, perfil_novedad, motivo_key, fechaEntrega, conductorId });
    // Determinar asunto del email
    const asunto = "🚨 URGENTE: Pedido cerrado sin entregar - CodeGas Colombia";

    try {
        const client = await poolConection.connect();

        // Ejecutar la consulta a la base de datos
        await client.query(NOVEDAD_PEDIDO, [
            _id, novedad, motivo_key, fechaEntrega, conductorId
        ]);

        // Datos para el template del email
        const pedidoData = {
            pedidoId: _id,
            novedad,
            perfilNovedad: perfil_novedad,
            fechaEntrega,
            conductorId,
            fechaReporte: new Date().toLocaleString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // Generar el HTML del email
        const emailHtml = generateEmailTemplate(pedidoData);

        // Configuración del email con el nuevo template
        const mailOptions = {
            from: EMAIL_USER,
            to: [email1, email2, email3, email4],
            subject: asunto,
            html: emailHtml,
            attachments: [
                {
                    filename: 'logo.jpg',
                    path: path.join(__dirname, '../../../assets/img/logo.jpg'),
                    cid: 'logo'
                }
            ],
            // Versión en texto plano como fallback
            text: `
        Novedad de Pedido - CodeGas Colombia
        
        Número de Pedido: ${_id}
        Fecha Reporte: ${pedidoData.fechaReporte}
        Fecha Entrega: ${fechaEntrega || 'N/A'}
        Conductor ID: ${conductorId || 'N/A'}
        
        Novedad: ${novedad}
        Perfil de Novedad: ${perfil_novedad}
        
        Este pedido ha sido cerrado sin entregar. Se requiere revisión inmediata.
        
        Próximos pasos:
        - Contactar al cliente para reprogramar entrega
        - Revisar causas de la no entrega
        - Actualizar estado del pedido en el sistema
        - Coordinar nueva fecha de entrega
        - Informar al departamento de logística
      `
        };

        // Enviar email con manejo de errores mejorado
        try {
            console.log('📧 [NovedadPedido] Enviando email...');
            await transporter.sendMail(mailOptions);
            console.log('✅ [NovedadPedido] Email enviado exitosamente');
        } catch (emailError) {
            console.error('❌ [NovedadPedido] Error enviando email:', emailError);

            // Si el email falla, pero la BD se actualizó correctamente, 
            // no fallar completamente la operación
            if (emailError.code === 'EAUTH') {
                console.error('🔑 [NovedadPedido] Error de autenticación de email - verificar credenciales');
                return {
                    status: true,
                    pedido: _id,
                    warning: 'Email no enviado - error de autenticación'
                };
            }

            // Para otros errores de email, continuar pero registrar el error
            console.error('📧 [NovedadPedido] Error de email, pero continuando con la operación');
        }

        return {
            status: true,
            pedido: _id
        };
    } catch (error) {
        console.error('❌ [NovedadPedido] Error al procesar novedad de pedido:', error);
        throw new DatabaseError(error);
    }
};