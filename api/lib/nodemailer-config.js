const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log('🔧 [NodemailerConfig] Configuración de email:');
console.log('📧 EMAIL_USER:', EMAIL_USER ? '✅ Configurado' : '❌ No configurado');
console.log('🔑 EMAIL_PASS:', EMAIL_PASS ? '✅ Configurado' : '❌ No configurado');

// Verificar que las credenciales estén disponibles
if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ [NodemailerConfig] Error: Credenciales de email no configuradas');
    throw new Error('Credenciales de email no configuradas');
}

// Configurar el transporter de Nodemailer
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

// Verificar la conexión
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ [NodemailerConfig] Error verificando conexión:', error);
    } else {
        console.log('✅ [NodemailerConfig] Conexión de email verificada correctamente');
    }
});

module.exports = {
    transporter,
    EMAIL_USER,
    EMAIL_PASS
};
