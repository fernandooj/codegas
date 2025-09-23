const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const nodemailer = require('nodemailer');
const path = require('path');

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

/** create user */
const SAVE_USER = 'SELECT * FROM save_users($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)';
// Función para generar el template HTML del email
const generateWelcomeEmailTemplate = (userData) => {
  const {
    nombre,
    email,
    password,
    razonSocial,
    tipo,
    acceso,
    fechaCreacion
  } = userData;

  // Determinar el tipo de usuario y su color
  const getTipoInfo = (acceso) => {
    switch (acceso) {
      case 'cliente':
        return {
          label: 'Cliente',
          icono: '🏢',
          color: '#3b82f6',
          descripcion: 'Acceso completo a pedidos y reportes'
        };
      case 'admin':
        return {
          label: 'Administrador',
          icono: '👑',
          color: '#dc2626',
          descripcion: 'Acceso completo al sistema'
        };
      case 'veo':
        return {
          label: 'VEO Comercial',
          icono: '💼',
          color: '#059669',
          descripcion: 'Gestión comercial y seguimiento'
        };
      case 'despacho':
        return {
          label: 'Despacho',
          icono: '🚚',
          color: '#7c3aed',
          descripcion: 'Gestión de pedidos y entregas'
        };
      default:
        return {
          label: 'Usuario',
          icono: '👤',
          color: '#6b7280',
          descripcion: 'Acceso básico al sistema'
        };
    }
  };

  const tipoInfo = getTipoInfo(acceso);

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a CodeGas Colombia</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #3b82f6; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                <!-- Logo -->
                                <div style="margin-bottom: 20px;">
                                    <img src="cid:logo" alt="CodeGas Colombia" style="max-width: 480px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" />
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                                    🎉 ¡Bienvenido a CodeGas!
                                </h1>
                                <p style="color: #bfdbfe; margin: 12px 0 0 0; font-size: 16px;">
                                    Tu cuenta ha sido creada exitosamente
                                </p>
                            </td>
                        </tr>

                        <!-- Tipo de Usuario Badge -->
                        <tr>
                            <td style="padding: 20px 30px 0 30px;">
                                <div style="background-color: ${tipoInfo.color}; color: #ffffff; padding: 12px 20px; border-radius: 25px; text-align: center; font-weight: 700; font-size: 14px; display: inline-block; width: 100%; box-sizing: border-box;">
                                    ${tipoInfo.icono} ${tipoInfo.label}
                                </div>
                                <p style="color: #64748b; text-align: center; margin: 8px 0 0 0; font-size: 14px;">
                                    ${tipoInfo.descripcion}
                                </p>
                            </td>
                        </tr>

                        <!-- Información del Usuario -->
                        <tr>
                            <td style="padding: 30px;">
                                <div style="background-color: #f1f5f9; padding: 24px; border-radius: 10px; margin-bottom: 24px;">
                                    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        👤 Información de tu Cuenta
                                    </h2>
                                    <table role="presentation" cellspacing="0" cellpadding="8" border="0" width="100%">
                                        <tr>
                                            <td style="font-weight: 600; color: #475569; width: 140px;">Nombre:</td>
                                            <td style="color: #1e293b; font-weight: 700; font-size: 16px;">${nombre}</td>
                                        </tr>
                                        ${razonSocial ? `
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Empresa:</td>
                                            <td style="color: #1e293b;">${razonSocial}</td>
                                        </tr>
                                        ` : ''}
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Email:</td>
                                            <td style="color: #1e293b;">${email}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Tipo:</td>
                                            <td style="color: #1e293b;">${tipo || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 600; color: #475569;">Fecha de creación:</td>
                                            <td style="color: #1e293b;">${fechaCreacion || new Date().toLocaleString('es-CO')}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Credenciales de Acceso -->
                                <div style="background-color: #10b981; padding: 24px; border-radius: 10px; margin-bottom: 24px;">
                                    <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center; gap: 8px;">
                                        🔑 Tus Credenciales de Acceso
                                    </h2>
                                    <div style="background-color: rgba(255, 255, 255, 0.2); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                                        <div style="margin-bottom: 12px;">
                                            <span style="color: #d1fae5; font-weight: 600; display: block; margin-bottom: 4px;">Usuario:</span>
                                            <span style="color: #ffffff; font-weight: 700; font-size: 16px; background-color: rgba(255, 255, 255, 0.1); padding: 8px 12px; border-radius: 6px; display: inline-block;">${email}</span>
                                        </div>
                                        <div>
                                            <span style="color: #d1fae5; font-weight: 600; display: block; margin-bottom: 4px;">Contraseña:</span>
                                            <span style="color: #ffffff; font-weight: 700; font-size: 16px; background-color: rgba(255, 255, 255, 0.1); padding: 8px 12px; border-radius: 6px; display: inline-block;">${password}</span>
                                        </div>
                                    </div>
                                    <p style="color: #d1fae5; margin: 0; font-size: 14px; font-style: italic;">
                                        💡 Te recomendamos cambiar tu contraseña después del primer acceso
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
                                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                                        <strong>CodeGas Colombia</strong><br>
                                        Sistema de Gestión Integral<br>
                                        📧 app@codegascolombia.com | 📞 +57 (1) 234-5678
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

function cleanAndNormalizeString(input) {
  // Remover caracteres especiales y saltos de línea
  const cleanedString = input.replace(/[^\w\s]/gi, '');

  // Remover espacios repetidos
  const normalizedString = cleanedString.replace(/\s+/g, ' ');

  // Convertir a minúsculas
  const lowercaseString = normalizedString.toLowerCase();

  return lowercaseString;
}

/** update user info
 *  save user in the table
 * @param {string} razon_social - username user
 * @param {string} cedula - zona info user
 * @param {string} direccion_factura - zona info user
 * @param {string} email - zona info user
 * @param {string} nombre - zona info user
 * @param {string} celular - zona info user
 * @param {string} tipo - zona info user
 * @param {string} descuento - zona info user
 * @param {string} acceso - zona info user
 * @param {string} tokenPhone - zona info user
 * @param {string} token - zona info user
 * @param {string} codMagister - zona info user
 * @param {string} codt - zona info user
 * @param {string} codigoRegistro - zona info user
 * @param {string} valorUnitario - zona info user
 * @param {string} idPadre - zona info user
 * @param {string} uid - zona info user
 * @returns {response} Response contains the data
 */
module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const token = Math.floor(1000 + Math.random() * 9000);
  const {
    razon_social, uid, cedula, direccion_factura, email, nombre, celular, tipo, descuento, acceso, tokenPhone, codMagister, codt, codigoRegistro, valorUnitario, idPadre,
    pass
  } = body;

  const cleanRazonSocial = cleanAndNormalizeString(razon_social);
  const cleanNombre = cleanAndNormalizeString(nombre);
  const cleanEmail = email ? email.toLowerCase().trim() : email;

  // Datos para el template del email
  const userData = {
    nombre,
    email: cleanEmail,
    password: pass,
    razonSocial: razon_social,
    tipo,
    acceso,
    fechaCreacion: new Date().toLocaleString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  // Generar el HTML del email
  const emailHtml = generateWelcomeEmailTemplate(userData);

  try {
    const client = await poolConection.connect();
    //await client.query('BEGIN');
    const { rows } = await client.query(SAVE_USER, [cleanRazonSocial, uid, cedula, direccion_factura, cleanEmail, cleanNombre, celular, tipo, descuento, acceso, tokenPhone, token, codMagister, codt, codigoRegistro, valorUnitario, idPadre]);

    // Enviar email de bienvenida si el usuario se creó exitosamente
    if (rows[0].save_users) {
      const mailOptions = {
        from: EMAIL_USER,
        to: cleanEmail,
        subject: '🎉 ¡Bienvenido a CodeGas Colombia! - Tu cuenta ha sido creada',
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
Hola ${nombre}, 

¡Bienvenido a CodeGas Colombia!

Tu cuenta ha sido creada exitosamente. Aquí están tus datos de acceso:

Usuario: ${cleanEmail}
Contraseña: ${pass}

Tipo de cuenta: ${acceso}

Puedes acceder a la aplicación móvil o web con estas credenciales.

¡Gracias por confiar en nosotros!

CodeGas Colombia
Sistema de Gestión Integral
📧 app@codegascolombia.com | 📞 +57 (1) 234-5678
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email de bienvenida enviado a:', cleanEmail);
    }

    //await client.query('COMMIT');
    return {
      status: !!rows[0].save_users,
      user: rows[0].save_users ? {
        _id: rows[0].save_users,
        email: cleanEmail,
        nombre: nombre,
        acceso: acceso,
        avatar: null
      } : null,
      code: rows[0].save_users || "email exist"
    };
  } catch (error) {
    console.error(error);
    //await client.query('ROLLBACK');
    throw new DatabaseError(error);
  }
}