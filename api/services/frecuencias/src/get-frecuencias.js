const nodemailer = require('nodemailer');
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_FRECUENCIAL_SEMANAL = 'SELECT * FROM get_frecuencias_semanal($1)';
const GET_FRECUENCIAL_QUINCENAL = 'SELECT * FROM get_frecuencias_quincenal($1)';
const GET_FRECUENCIAL_MENSUAL = 'SELECT * FROM get_frecuencias_mensual($1)';

const TYPE_SEMANAL = 'semanal'
const TYPE_QUINCENAL = 'quincenal'
const TYPE_MENSUAL = 'mensual'

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const recipients = [
  'gestioncalidad@codegascolombia.com',
  'coord.logistica@codegascolombia.com',
  'gerencia@codegascolombia.com',
  'fernandooj@ymail.com'
];

/**
 * Genera una tabla HTML estilizada para mostrar los datos
 */
const generateTable = (data, title, color) => {
  if (!data || data.length === 0) {
    return `
            <div class="section">
                <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    📊 ${title}
                </h3>
                <div class="no-data">
                    <p style="margin: 0; color: #666; font-style: italic;">No hay datos disponibles</p>
                </div>
            </div>
        `;
  }

  const headers = Object.keys(data[0]);

  return `
        <div class="section">
            <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                📊 ${title} (${data.length} registros)
            </h3>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: linear-gradient(135deg, ${color}, ${color}dd);">
                            ${headers.map(header => `
                                <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${header.replace(/_/g, ' ')}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((row, index) => `
                            <tr style="border-bottom: 1px solid #eee; background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};">
                                ${headers.map(header => `
                                    <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">
                                        ${row[header] || '-'}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

/**
 * Genera el HTML completo del email con diseño moderno
 */
const generateEmailHTML = (semanal, quincenal, mensual) => {
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte de Pedidos Frecuencias</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
            <div style="max-width: 1000px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        📈 Reporte de Pedidos Frecuencias
                    </h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                        CodeGas Colombia - ${currentDate}
                    </p>
                </div>

                <!-- Summary Cards -->
                <div style="padding: 30px; background: #f8f9fa;">
                    <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #28a745; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #28a745; font-size: 16px; font-weight: 600;">Semanal</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #28a745;">${semanal.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #ffc107; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #ffc107; font-size: 16px; font-weight: 600;">Quincenal</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffc107;">${quincenal.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #17a2b8; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 16px; font-weight: 600;">Mensual</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #17a2b8;">${mensual.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                    </div>
                </div>

                <!-- Data Tables -->
                <div style="padding: 30px;">
                    ${generateTable(semanal, 'Pedidos Semanales', '#28a745')}
                    ${generateTable(quincenal, 'Pedidos Quincenales', '#ffc107')}
                    ${generateTable(mensual, 'Pedidos Mensuales', '#17a2b8')}
                </div>

                <!-- Footer -->
                <div style="background: #343a40; color: white; padding: 25px; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.8;">
                        Este es un reporte automático generado por el sistema
                    </p>
                    <p style="margin: 0; font-size: 12px; opacity: 0.6;">
                        © ${new Date().getFullYear()} CodeGas Colombia. Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </body>
        </html>
    `;
};

/**
 * Función principal para enviar el reporte de frecuencias
 */
module.exports.main = async (event) => {
  let client;

  try {
    client = await poolConection.connect();

    // Obtener datos de las consultas
    const { rows: semanal } = await client.query(GET_FRECUENCIAL_SEMANAL, [TYPE_SEMANAL]);
    const { rows: quincenal } = await client.query(GET_FRECUENCIAL_QUINCENAL, [TYPE_QUINCENAL]);
    const { rows: mensual } = await client.query(GET_FRECUENCIAL_MENSUAL, [TYPE_MENSUAL]);

    // Configurar el email
    const mailOptions = {
      from: {
        name: 'CodeGas Colombia - Sistema Automático',
        address: EMAIL_USER
      },
      to: recipients,
      subject: `📊 Reporte de Pedidos Frecuencias - ${new Date().toLocaleDateString('es-CO')}`,
      html: generateEmailHTML(semanal, quincenal, mensual),
      attachments: []
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email enviado exitosamente:', info.messageId);

    return {
      status: true,
      message: 'Email enviado exitosamente',
      messageId: info.messageId,
      totalSemanal: semanal.length,
      totalQuincenal: quincenal.length,
      totalMensual: mensual.length,
      semanal,
      quincenal,
      mensual
    };

  } catch (error) {
    console.error('Error al enviar el email:', error);
    throw new DatabaseError(error);
  } finally {
    if (client) {
      client.release();
    }
  }
};