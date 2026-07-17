const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { sendNovedadPedidoEmail } = require('../../../lib/email-novedad-pedido.js');

const NOVEDAD_PEDIDO = 'SELECT * FROM novedad_pedidos($1, $2, $3, $4, $5)';

/** Cliente del pedido + punto + email del vendedor (users.idpadre del cliente). */
const GET_PEDIDO_EMAIL_CONTEXT = `
    SELECT
        COALESCE(NULLIF(TRIM(cli.razon_social), ''), NULLIF(TRIM(cli.nombre), ''), 'N/A') AS cliente_nombre,
        COALESCE(NULLIF(TRIM(cli.codt), ''), 'N/A') AS cliente_codt,
        COALESCE(
            NULLIF(TRIM(pt.nombre), ''),
            NULLIF(TRIM(pt.direccion), ''),
            'N/A'
        ) AS punto_consumo,
        NULLIF(TRIM(u_vendedor.email), '') AS vendedor_email,
        NULLIF(TRIM(u_vendedor.nombre), '') AS vendedor_nombre
    FROM pedidos p
    LEFT JOIN puntos pt ON pt._id = p.puntoId
    LEFT JOIN users cli ON cli._id = COALESCE(NULLIF(p.usuarioId, 0), NULLIF(pt.idCliente, 0))
    LEFT JOIN users u_vendedor ON u_vendedor._id = cli.idpadre
    WHERE p._id = $1
`;

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

module.exports.main = async (event) => {
    const body = JSON.parse(event.body);
    const {
        _id, novedad, perfil_novedad, motivo_key, fechaEntrega, conductorId
    } = body;

    console.log('🔍 [NovedadPedido] Procesando novedad:', { _id, novedad, perfil_novedad, motivo_key, fechaEntrega, conductorId });

    const client = await poolConection.connect();
    try {
        // Ejecutar la consulta a la base de datos
        await client.query(NOVEDAD_PEDIDO, [
            _id, novedad, motivo_key, fechaEntrega, conductorId
        ]);

        console.log('✅ [NovedadPedido] Novedad guardada en base de datos');

        let clienteNombre = 'N/A';
        let clienteCodt = 'N/A';
        let puntoConsumo = 'N/A';
        let vendedorEmail = null;
        let vendedorNombre = null;

        try {
            const { rows } = await client.query(GET_PEDIDO_EMAIL_CONTEXT, [_id]);
            if (rows[0]) {
                clienteNombre = rows[0].cliente_nombre || 'N/A';
                clienteCodt = rows[0].cliente_codt || 'N/A';
                puntoConsumo = rows[0].punto_consumo || 'N/A';
                vendedorEmail = rows[0].vendedor_email || null;
                vendedorNombre = rows[0].vendedor_nombre || null;
            }
        } catch (ctxError) {
            console.error('⚠️ [NovedadPedido] No se pudo obtener contexto del pedido para el email:', ctxError);
        }

        // Datos para el template del email
        const pedidoData = {
            pedidoId: _id,
            novedad,
            perfilNovedad: perfil_novedad,
            fechaEntrega,
            conductorId,
            clienteNombre,
            clienteCodt,
            puntoConsumo,
            vendedorEmail,
            vendedorNombre
        };

        // Enviar email usando la función modularizada
        const emailResult = await sendNovedadPedidoEmail(pedidoData);

        if (!emailResult.success) {
            console.error('❌ [NovedadPedido] Error enviando email:', emailResult.error);

            // Si el email falla, pero la BD se actualizó correctamente, 
            // no fallar completamente la operación
            if (emailResult.code === 'EAUTH') {
                console.error('🔑 [NovedadPedido] Error de autenticación de email - verificar credenciales');
                return {
                    status: true,
                    pedido: _id,
                    warning: 'Email no enviado - error de autenticación'
                };
            }

            // Para otros errores de email, continuar pero registrar el error
            console.error('📧 [NovedadPedido] Error de email, pero continuando con la operación');
        } else {
            console.log('✅ [NovedadPedido] Email enviado exitosamente');
        }

        return {
            status: true,
            pedido: _id
        };
    } catch (error) {
        console.error('❌ [NovedadPedido] Error al procesar novedad de pedido:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};
