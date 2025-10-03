const { poolConection } = require('../../../lib/connection-pg.js')
const nodemailer = require('nodemailer');
const path = require('path');

const CREATE_REPORT = 'select * from save_reporte_emergencia($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
const GET_USER_BY_ID = 'SELECT * FROM users WHERE _id = $1';

// Configuración de Nodemailer
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Función para generar el template HTML del email
const generateEmailTemplate = (reporteData) => {
    const {
        reporteId,
        tanque,
        red,
        puntos,
        fuga,
        pqr,
        otrosText,
        codtCliente,
        razonSocial,
        nombreCliente,
        usuarioReporta,
        fechaReporte,
        imgUrlsS3
    } = reporteData;

    // Determinar el nivel de urgencia
    const tieneEmergencia = tanque || red || puntos || fuga;
    const urgenciaColor = tieneEmergencia ? '#dc2626' : pqr ? '#f59e0b' : '#16a34a';
    const urgenciaTexto = tieneEmergencia ? '🚨 ALTA URGENCIA' : pqr ? '⚠️ URGENCIA MEDIA' : '✅ NORMAL';

    // Construir lista de problemas
    const problemas = [];
    if (tanque) problemas.push({ tipo: 'Tanque en mal estado', icono: '🛢️', color: '#dc2626' });
    if (red) problemas.push({ tipo: 'Red en mal estado', icono: '🔧', color: '#dc2626' });
    if (puntos) problemas.push({ tipo: 'Puntos de ignición cerca', icono: '🔥', color: '#dc2626' });
    if (fuga) problemas.push({ tipo: 'Fuga detectada', icono: '💧', color: '#2563eb' });
    if (pqr) problemas.push({ tipo: 'PQR', icono: '📋', color: '#16a34a' });

    const problemasHtml = problemas.map(problema => `
    <div style="background-color: ${problema.color}15; border-left: 4px solid ${problema.color}; padding: 12px; margin: 8px 0; border-radius: 6px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">${problema.icono}</span>
        <span style="font-weight: 600; color: ${problema.color};">${problema.tipo}</span>
      </div>
    </div>
  `).join('');

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Emergencia - CodeGas Colombia</title>
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
                                    🚨 Reporte de Emergencia
                                </h1>
                                <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">
                                    CodeGas Colombia - Sistema de Alertas
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

                        <!-- Información del Reporte -->
                        <tr>
                            <td style="padding: 30px;">
                                <div style="background-color: #f1f5f9; padding: 24px; border-radius: 10px; margin-bottom: 24px;">
                                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        📊 Información del Reporte
                                    </h2>
                                    <table role="presentation" cellspacing="0" cellpadding="8" border="0" width="100%">
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; width: 140px;">Número:</td>
                                            <td style="color: #1e293b; font-weight: 700; font-size: 16px;">#${reporteId}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Fecha:</td>
                                            <td style="color: #1e293b;">${fechaReporte || new Date().toLocaleString('es-CO')}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Código Cliente:</td>
                                            <td style="color: #1e293b;">${codtCliente || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Cliente:</td>
                                            <td style="color: #1e293b;">${razonSocial || 'N/A'} / ${nombreCliente || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Reportado por:</td>
                                            <td style="color: #1e293b;">${usuarioReporta}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Problemas Detectados -->
                                <div style="margin-bottom: 24px;">
                                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        ⚠️ Problemas Detectados
                                    </h2>
                                    ${problemasHtml}
                                </div>

                                <!-- Observaciones adicionales -->
                                ${otrosText ? `
                                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                                    <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                                        📝 Observaciones Adicionales
                                    </h3>
                                    <p style="color: #78350f; margin: 0; font-style: italic;">
                                        "${otrosText}"
                                    </p>
                                </div>
                                ` : ''}

                                <!-- Imágenes adjuntas -->
                                ${imgUrlsS3 && imgUrlsS3.length > 0 ? `
                                <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                                    <h3 style="color: #0c4a6e; margin: 0 0 16px 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                                        📸 Imágenes Adjuntas
                                    </h3>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                                        ${imgUrlsS3.map((url, index) => `
                                            <div style="text-align: center;">
                                                <img src="${url}" alt="Imagen ${index + 1}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" />
                                                <p style="color: #0c4a6e; margin: 8px 0 0 0; font-size: 12px; font-weight: 500;">
                                                    Imagen ${index + 1}
                                                </p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                ` : ''}

                                <!-- Call to Action -->
                                <div style="background-color: #dc2626; padding: 24px; border-radius: 10px; text-align: center; margin-top: 30px;">
                                    <h3 style="color: #ffffff; margin: 0 0 12px 0; font-size: 18px;">
                                        🚀 Acción Requerida
                                    </h3>
                                    <p style="color: #fecaca; margin: 0 0 16px 0;">
                                        Este reporte requiere atención inmediata. Por favor revise y tome las acciones correspondientes.
                                    </p>
                                    <a href="#" style="background-color: #ffffff; color: #dc2626; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                                        Ver Reporte Completo
                                    </a>
                                </div>

                                <!-- Instrucciones -->
                                <div style="background-color: #eff6ff; border: 1px solid #dbeafe; padding: 20px; border-radius: 8px; margin-top: 24px;">
                                    <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">
                                        📋 Próximos Pasos
                                    </h3>
                                    <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                                        <li>Verificar la ubicación y condiciones del reporte</li>
                                        <li>Asignar técnico especializado si es necesario</li>
                                        <li>Actualizar el estado en el sistema</li>
                                        <li>Notificar resolución al cliente</li>
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
                                                Sistema de Gestión de Emergencias<br>
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

/**
 * Inserts reporte emergencia into the database and sends styled notification email.
 */
module.exports.main = async (event) => {
    const body = JSON.parse(event.body);
    let {
        tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea, razonSocial, nombre: nombreCliente, codt: codtCliente, imgUrlsS3
    } = body;

    // Determinar asunto del email basado en el tipo de reporte
    const tieneEmergencia = tanque || red || puntos || fuga;
    let asunto = tieneEmergencia ?
        "🚨 URGENTE: Nuevo reporte de emergencia - CodeGas Colombia" :
        pqr ? "⚠️ Nuevo reporte (PQR) - CodeGas Colombia" :
            "📋 Nuevo reporte - CodeGas Colombia";

    try {
        const client = await poolConection.connect();

        const { rows: user } = await client.query(CREATE_REPORT, [tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea, imgUrlsS3 || []]);
        const _id = user[0].save_reporte_emergencia;

        const { rows: userReporta } = await client.query(GET_USER_BY_ID, [usuarioCrea]);
        const { nombre } = userReporta[0];

        // Datos para el template
        const reporteData = {
            reporteId: _id,
            tanque,
            red,
            puntos,
            fuga,
            pqr,
            otrosText,
            codtCliente,
            razonSocial,
            nombreCliente,
            usuarioReporta: nombre,
            fechaReporte: new Date().toLocaleString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            imgUrlsS3: imgUrlsS3 || [] // Incluir las URLs de S3
        };

        // Generar el HTML del email
        const emailHtml = generateEmailTemplate(reporteData);

        let email1 = "fernandooj@ymail.com";
        let email2 = "dptotecnico@codegascolombia.com";

        // Configuración del email con el nuevo template
        const mailOptions = {
            from: EMAIL_USER,
            to: [email1, email2],
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
        Nuevo Reporte de Emergencia - CodeGas Colombia
        
        Número de Reporte: ${_id}
        Fecha: ${reporteData.fechaReporte}
        Cliente: ${razonSocial || 'N/A'} / ${nombreCliente || 'N/A'}
        Código Cliente: ${codtCliente || 'N/A'}
        Reportado por: ${nombre}
        
        Problemas detectados:
        ${tanque ? '- Tanque en mal estado\n' : ''}
        ${red ? '- Red en mal estado\n' : ''}
        ${puntos ? '- Puntos de ignición cerca\n' : ''}
        ${fuga ? '- Fuga detectada\n' : ''}
        ${pqr ? '- PQR\n' : ''}
        
        ${otrosText ? `Observaciones adicionales: ${otrosText}` : ''}
        
        ${imgUrlsS3 && imgUrlsS3.length > 0 ? `Imágenes adjuntas:\n${imgUrlsS3.map((url, index) => `${index + 1}. ${url}`).join('\n')}\n` : ''}
        
        Este reporte requiere atención inmediata.
      `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        return {
            status: true,
            reporte: _id
        };
    } catch (error) {
        console.error('Error al procesar reporte:', error);
        throw JSON.stringify(error);
    }
};