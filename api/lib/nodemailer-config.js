const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

/** Correos que nunca deben recibir notificaciones del sistema. */
const BLOCKED_EMAILS = new Set([
    'fernandooj@ymail.com'
]);

console.log('🔧 [NodemailerConfig] Configuración de email:');
console.log('📧 EMAIL_USER:', EMAIL_USER ? '✅ Configurado' : '❌ No configurado');
console.log('🔑 EMAIL_PASS:', EMAIL_PASS ? '✅ Configurado' : '❌ No configurado');

// Verificar que las credenciales estén disponibles
if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ [NodemailerConfig] Error: Credenciales de email no configuradas');
    throw new Error('Credenciales de email no configuradas');
}

/**
 * Normaliza y elimina destinatarios bloqueados de to/cc/bcc.
 * Acepta string, array o lista separada por comas.
 * @returns {{ cleaned: string|string[]|undefined, removed: string[] }}
 */
const sanitizeMailAddresses = (value) => {
    if (value === undefined || value === null || value === '') {
        return { cleaned: value, removed: [] };
    }

    const asList = Array.isArray(value)
        ? value
        : String(value).split(/[,;]+/);

    const removed = [];
    const kept = [];

    for (const raw of asList) {
        const email = String(raw || '').trim();
        if (!email) continue;
        if (BLOCKED_EMAILS.has(email.toLowerCase())) {
            removed.push(email);
            continue;
        }
        kept.push(email);
    }

    if (Array.isArray(value)) {
        return { cleaned: kept, removed };
    }
    return { cleaned: kept.join(', '), removed };
};

const sanitizeMailOptions = (mailOptions = {}) => {
    const sanitized = { ...mailOptions };
    const allRemoved = [];

    for (const field of ['to', 'cc', 'bcc']) {
        if (sanitized[field] === undefined || sanitized[field] === null) continue;
        const { cleaned, removed } = sanitizeMailAddresses(sanitized[field]);
        sanitized[field] = cleaned;
        allRemoved.push(...removed);
    }

    if (allRemoved.length) {
        console.log('🚫 [NodemailerConfig] Destinatarios omitidos:', allRemoved.join(', '));
    }

    const hasRecipients = ['to', 'cc', 'bcc'].some((field) => {
        const v = sanitized[field];
        if (Array.isArray(v)) return v.length > 0;
        return typeof v === 'string' && v.trim().length > 0;
    });

    return { sanitized, removed: allRemoved, hasRecipients };
};

// Configurar el transporter de Nodemailer
// Usar SMTP de Gmail por puerto 587 (STARTTLS), que suele estar menos bloqueado que 465
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS en vez de SSL directo
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
});

const originalSendMail = transporter.sendMail.bind(transporter);
transporter.sendMail = (mailOptions, callback) => {
    const { sanitized, hasRecipients, removed } = sanitizeMailOptions(mailOptions);

    if (!hasRecipients) {
        const err = new Error(
            removed.length
                ? `No hay destinatarios válidos tras filtrar: ${removed.join(', ')}`
                : 'No hay destinatarios en el correo'
        );
        err.code = 'NO_RECIPIENTS';
        console.warn('⚠️ [NodemailerConfig] Envío omitido:', err.message);
        if (typeof callback === 'function') {
            callback(err);
            return Promise.resolve({ messageId: null, skipped: true, removed });
        }
        return Promise.reject(err);
    }

    return originalSendMail(sanitized, callback);
};

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
    EMAIL_PASS,
    BLOCKED_EMAILS,
    sanitizeMailAddresses,
    sanitizeMailOptions
};
