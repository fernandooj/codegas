const { transporter } = require('./nodemailer-config');

const DESTINATARIO = 'coord.comercial@codegascolombia.com';

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const generateEmailTemplate = ({
    usuarioNombre,
    usuarioEmail,
    clienteNombre,
    clienteCodt,
    puntoConsumo,
    fechaIntento
}) => {
    const usuarioSafe = escapeHtml(usuarioNombre || 'N/A');
    const usuarioEmailSafe = escapeHtml(usuarioEmail || 'N/A');
    const clienteSafe = escapeHtml(clienteNombre || 'N/A');
    const codtSafe = escapeHtml(clienteCodt || 'N/A');
    const puntoSafe = escapeHtml(puntoConsumo || 'N/A');
    const fechaSafe = escapeHtml(fechaIntento || new Date().toLocaleString('es-CO'));

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Intento de pedido a cliente inactivo</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8fafc;line-height:1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafc;">
            <tr>
                <td align="center" style="padding:20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background-color:#dc2626;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                                <h1 style="color:#ffffff;margin:0;font-size:22px;">Cliente inactivo</h1>
                                <p style="color:#fecaca;margin:8px 0 0 0;font-size:14px;">Intento de creación de pedido bloqueado</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:28px;">
                                <p style="color:#1e293b;margin:0 0 16px 0;">
                                    El usuario <strong>${usuarioSafe}</strong> intentó subir un pedido al cliente
                                    <strong>${clienteSafe}</strong> de punto de consumo <strong>${puntoSafe}</strong>
                                    y no se realizó porque el cliente está inactivo.
                                </p>
                                <div style="background-color:#f1f5f9;padding:20px;border-radius:10px;">
                                    <table role="presentation" cellspacing="0" cellpadding="8" border="0" width="100%">
                                        <tr>
                                            <td style="font-weight:600;color:#475569;width:160px;">Usuario:</td>
                                            <td style="color:#1e293b;">${usuarioSafe}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight:600;color:#475569;">Email usuario:</td>
                                            <td style="color:#1e293b;">${usuarioEmailSafe}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight:600;color:#475569;">Cliente:</td>
                                            <td style="color:#1e293b;font-weight:700;">${clienteSafe}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight:600;color:#475569;">CODT:</td>
                                            <td style="color:#1e293b;">${codtSafe}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight:600;color:#475569;">Punto de consumo:</td>
                                            <td style="color:#1e293b;">${puntoSafe}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight:600;color:#475569;">Fecha intento:</td>
                                            <td style="color:#1e293b;">${fechaSafe}</td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#f8fafc;padding:16px 28px;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;text-align:center;">
                                <p style="color:#94a3b8;margin:0;font-size:12px;">
                                    Mensaje automático de CodeGas Colombia. No responda a este correo.
                                </p>
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

const sendClienteInactivoEmail = async (payload) => {
    const {
        usuarioNombre,
        usuarioEmail,
        clienteNombre,
        clienteCodt,
        puntoConsumo
    } = payload;

    const fechaIntento = new Date().toLocaleString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [DESTINATARIO],
        subject: 'Intento de pedido a cliente inactivo - CodeGas Colombia',
        html: generateEmailTemplate({
            usuarioNombre,
            usuarioEmail,
            clienteNombre,
            clienteCodt,
            puntoConsumo,
            fechaIntento
        }),
        text: `
Intento de pedido a cliente inactivo

El usuario ${usuarioNombre || 'N/A'} intentó subir un pedido al cliente ${clienteNombre || 'N/A'}
de punto de consumo ${puntoConsumo || 'N/A'} y no se realizó porque el cliente está inactivo.

Usuario: ${usuarioNombre || 'N/A'} (${usuarioEmail || 'N/A'})
Cliente: ${clienteNombre || 'N/A'}
CODT: ${clienteCodt || 'N/A'}
Punto de consumo: ${puntoConsumo || 'N/A'}
Fecha: ${fechaIntento}
        `.trim()
    };

    try {
        console.log('📧 [EmailClienteInactivo] Enviando a:', DESTINATARIO);
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('❌ [EmailClienteInactivo] Error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code || 'UNKNOWN'
        };
    }
};

module.exports = {
    sendClienteInactivoEmail,
    DESTINATARIO
};
