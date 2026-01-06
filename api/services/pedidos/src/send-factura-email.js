const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { transporter, EMAIL_USER } = require('../../../lib/nodemailer-config');
const { generateFacturaPDF } = require('./generate-factura-pdf');
const axios = require('axios');

/**
 * Genera el template HTML del email de factura
 */
const generateEmailTemplate = (pedidoData) => {
    const {
        pedidoId,
        razonSocial,
        nombreCliente,
        codt,
        fechaEntrega,
        factura,
        remision,
        valorTotal,
        formaPago
    } = pedidoData;

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura de Pedido - CodeGas Colombia</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #002587; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                                    ✅ Pedido Entregado con Éxito
                                </h1>
                                <p style="color: #bfdbfe; margin: 12px 0 0 0; font-size: 16px;">
                                    CodeGas Colombia - Sistema de Gestión de Pedidos
                                </p>
                            </td>
                        </tr>

                        <!-- Mensaje Principal -->
                        <tr>
                            <td style="padding: 30px;">
                                <div style="background-color: #f0f9ff; border-left: 4px solid #002587; padding: 20px; margin-bottom: 24px; border-radius: 6px;">
                                    <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.8;">
                                        Estimado/a <strong>${razonSocial || nombreCliente || 'Cliente'}</strong>,
                                    </p>
                                    <p style="margin: 16px 0 0 0; color: #1e293b; font-size: 16px; line-height: 1.8;">
                                        Nos complace informarle que su pedido <strong>#${pedidoId}</strong> ha sido entregado exitosamente.
                                    </p>
                                    <p style="margin: 16px 0 0 0; color: #1e293b; font-size: 16px; line-height: 1.8;">
                                        Adjunto encontrará la <strong>remisión</strong> con todos los detalles de la entrega.
                                    </p>
                                </div>

                                <!-- Información del Pedido -->
                                <div style="background-color: #f1f5f9; padding: 24px; border-radius: 10px; margin-bottom: 24px;">
                                    <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        📋 Resumen del Pedido
                                    </h2>
                                    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px;">
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; width: 40%; border-bottom: 1px solid #e2e8f0; padding: 10px;">Número de Pedido:</td>
                                            <td style="color: #1e293b; font-weight: 700; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding: 10px;">#${pedidoId}</td>
                                        </tr>
                                        ${codt ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; padding: 10px;">Código Cliente:</td>
                                            <td style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding: 10px;">${codt}</td>
                                        </tr>
                                        ` : ''}
                                        ${factura ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; padding: 10px;">Factura:</td>
                                            <td style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding: 10px;">${factura}</td>
                                        </tr>
                                        ` : ''}
                                        ${remision ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; padding: 10px;">Remisión:</td>
                                            <td style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding: 10px;">${remision}</td>
                                        </tr>
                                        ` : ''}
                                        ${fechaEntrega ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; padding: 10px;">Fecha de Entrega:</td>
                                            <td style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding: 10px;">${fechaEntrega}</td>
                                        </tr>
                                        ` : ''}
                                        ${valorTotal ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; padding: 10px;">Valor Total:</td>
                                            <td style="color: #002587; font-weight: 700; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding: 10px;">$${parseFloat(valorTotal).toLocaleString('es-CO')}</td>
                                        </tr>
                                        ` : ''}
                                        ${formaPago ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; padding: 10px;">Forma de Pago:</td>
                                            <td style="color: #1e293b; padding: 10px;">${formaPago}</td>
                                        </tr>
                                        ` : ''}
                                    </table>
                                </div>

                                <!-- Información Adicional -->
                                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 6px;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                                        <strong>📎 Documento Adjunto:</strong> En el archivo PDF adjunto encontrará la información completa de su pedido, incluyendo detalles del servicio, datos de llenado de tanques (si aplica), y lista de chequeo de seguridad.
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                                    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                                        Si tiene alguna pregunta o requiere asistencia adicional, no dude en contactarnos.
                                    </p>
                                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                        © ${new Date().getFullYear()} CodeGas Colombia. Todos los derechos reservados.
                                    </p>
                                </div>
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

/**
 * Envía el email con la factura PDF adjunta
 */
const sendFacturaEmail = async (pedidoId, emailDestinatario) => {
    const client = await poolConection.connect();

    try {
        // Obtener información del pedido
        const GET_PEDIDO = `
            SELECT 
                p._id,
                p.factura,
                p.remision,
                p.valor_total,
                p.forma_pago,
                p.fechaEntrega,
                u.email,
                u.codt,
                u.razon_social,
                u.nombre
            FROM pedidos p
            LEFT JOIN users u ON p.usuarioId = u._id
            WHERE p._id = $1
        `;

        const { rows } = await client.query(GET_PEDIDO, [pedidoId]);

        if (!rows || rows.length === 0) {
            throw new Error('Pedido no encontrado');
        }

        const pedido = rows[0];

        // Usar el email del destinatario pasado como parámetro, o el email del pedido
        const emailToSend = emailDestinatario || pedido.email;

        if (!emailToSend) {
            throw new Error('No se encontró un email de destinatario');
        }

        // Generar el PDF de la factura
        console.log('📄 [SendFacturaEmail] Generando PDF de factura para pedido:', pedidoId);
        const pdfResult = await generateFacturaPDF(pedidoId);

        if (!pdfResult.status || !pdfResult.pdfUrl) {
            throw new Error('Error al generar el PDF de factura');
        }

        // Descargar el PDF desde S3 para adjuntarlo
        console.log('📥 [SendFacturaEmail] Descargando PDF desde S3:', pdfResult.pdfUrl);
        const pdfResponse = await axios.get(pdfResult.pdfUrl, {
            responseType: 'arraybuffer'
        });

        const pdfBuffer = Buffer.from(pdfResponse.data);

        // Preparar datos para el template del email
        const emailData = {
            pedidoId: pedido._id,
            razonSocial: pedido.razon_social,
            nombreCliente: pedido.nombre,
            codt: pedido.codt,
            fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : null,
            factura: pedido.factura,
            remision: pedido.remision,
            valorTotal: pedido.valor_total,
            formaPago: pedido.forma_pago
        };

        // Generar el HTML del email
        const emailHtml = generateEmailTemplate(emailData);

        // Configurar el email
        const mailOptions = {
            from: {
                name: 'CodeGas Colombia - Sistema Automático',
                address: EMAIL_USER
            },
            to: emailToSend,
            subject: `✅ Pedido #${pedido._id} Entregado Exitosamente - Remisión Adjunta`,
            html: emailHtml,
            attachments: [
                {
                    filename: `Remision_Pedido_${pedido._id}_${pedido.remision || 'N/A'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        // Enviar el email
        console.log('📧 [SendFacturaEmail] Enviando email a:', emailToSend);
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ [SendFacturaEmail] Email enviado exitosamente:', info.messageId);

        return {
            status: true,
            message: 'Email con factura enviado exitosamente',
            messageId: info.messageId,
            email: emailToSend,
            pdfUrl: pdfResult.pdfUrl
        };

    } catch (error) {
        console.error('❌ [SendFacturaEmail] Error enviando email:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

module.exports.main = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    try {
        const pedidoId = event.pathParameters?.id;
        const body = JSON.parse(event.body || '{}');
        const { email } = body;

        if (!pedidoId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'ID del pedido es requerido'
                })
            };
        }

        const result = await sendFacturaEmail(pedidoId, email);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Error en send-factura-email:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                status: false,
                message: error.message || 'Error al enviar el email con la factura'
            })
        };
    }
};

module.exports.sendFacturaEmail = sendFacturaEmail;

