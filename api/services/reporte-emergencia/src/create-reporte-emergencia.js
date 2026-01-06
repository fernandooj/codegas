const { poolConection } = require('../../../lib/connection-pg.js')
const { sendReporteEmergenciaEmail } = require('../../../lib/email-reporte-emergencia.js');

const CREATE_REPORT = 'select * from save_reporte_emergencia($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
const GET_USER_BY_ID = 'SELECT * FROM users WHERE _id = $1';

/**
 * Inserts reporte emergencia into the database and sends styled notification email.
 */
module.exports.main = async (event) => {
    const body = JSON.parse(event.body);
    let {
        tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea, razonSocial, nombre: nombreCliente, codt: codtCliente, imgUrlsS3
    } = body;

    console.log('🔍 [ReporteEmergencia] Procesando reporte:', { tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea });

    try {
        const client = await poolConection.connect();

        const { rows: user } = await client.query(CREATE_REPORT, [tanque, red, puntos, fuga, pqr, otrosText, usuarioId, puntoId, usuarioCrea, imgUrlsS3 || []]);
        const _id = user[0].save_reporte_emergencia;

        console.log('✅ [ReporteEmergencia] Reporte guardado en base de datos con ID:', _id);

        const { rows: userReporta } = await client.query(GET_USER_BY_ID, [usuarioCrea]);
        const { nombre } = userReporta[0];

        // Datos para el template del email
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
            imgUrlsS3: imgUrlsS3 || [] // Incluir las URLs de S3
        };

        // Enviar email usando la función modularizada
        const emailResult = await sendReporteEmergenciaEmail(reporteData);

        if (!emailResult.success) {
            console.error('❌ [ReporteEmergencia] Error enviando email:', emailResult.error);

            // Si el email falla, pero la BD se actualizó correctamente, 
            // no fallar completamente la operación
            if (emailResult.code === 'EAUTH') {
                console.error('🔑 [ReporteEmergencia] Error de autenticación de email - verificar credenciales');
                return {
                    status: true,
                    reporte: _id,
                    warning: 'Email no enviado - error de autenticación'
                };
            }

            // Para otros errores de email, continuar pero registrar el error
            console.error('📧 [ReporteEmergencia] Error de email, pero continuando con la operación');
        } else {
            console.log('✅ [ReporteEmergencia] Email enviado exitosamente');
        }

        return {
            status: true,
            reporte: _id
        };
    } catch (error) {
        console.error('❌ [ReporteEmergencia] Error al procesar reporte:', error);
        throw JSON.stringify(error);
    }
};
