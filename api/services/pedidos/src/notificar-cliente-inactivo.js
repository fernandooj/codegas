const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { sendClienteInactivoEmail } = require('../../../lib/email-cliente-inactivo.js');

const GET_CLIENTE_Y_PUNTOS = `
    SELECT
        COALESCE(NULLIF(TRIM(u.razon_social), ''), NULLIF(TRIM(u.nombre), ''), 'N/A') AS cliente_nombre,
        COALESCE(NULLIF(TRIM(u.codt), ''), 'N/A') AS cliente_codt,
        COALESCE(u.activo, false) AS cliente_activo,
        COALESCE(
            NULLIF(
                string_agg(
                    DISTINCT COALESCE(NULLIF(TRIM(pt.nombre), ''), NULLIF(TRIM(pt.direccion), '')),
                    ' | '
                ),
                ''
            ),
            'Sin puntos de consumo registrados'
        ) AS puntos_consumo
    FROM users u
    LEFT JOIN puntos pt
        ON pt.idCliente = u._id
        AND COALESCE(pt.eliminado, false) = false
    WHERE u._id = $1
    GROUP BY u._id, u.razon_social, u.nombre, u.codt, u.activo
`;

/**
 * Notifica a comercial cuando un usuario intenta crear pedido para un cliente inactivo.
 * Body: { clienteId, usuarioNombre, usuarioEmail }
 */
module.exports.main = async (event) => {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
    const {
        clienteId,
        usuarioNombre,
        usuarioEmail,
        clienteNombre: clienteNombreBody,
        clienteCodt: clienteCodtBody,
        puntoConsumo: puntoConsumoBody
    } = body;

    if (!clienteId) {
        return { status: false, message: 'clienteId es requerido' };
    }

    const client = await poolConection.connect();
    try {
        const { rows } = await client.query(GET_CLIENTE_Y_PUNTOS, [clienteId]);
        const row = rows[0];

        if (!row) {
            return { status: false, message: 'Cliente no encontrado' };
        }

        if (row.cliente_activo) {
            return {
                status: true,
                notified: false,
                message: 'El cliente está activo; no se envía notificación'
            };
        }

        const emailResult = await sendClienteInactivoEmail({
            usuarioNombre: usuarioNombre || 'Usuario desconocido',
            usuarioEmail: usuarioEmail || '',
            clienteNombre: row.cliente_nombre || clienteNombreBody || 'N/A',
            clienteCodt: row.cliente_codt || clienteCodtBody || 'N/A',
            puntoConsumo: row.puntos_consumo || puntoConsumoBody || 'N/A'
        });

        if (!emailResult.success) {
            console.error('❌ [NotificarClienteInactivo] Email falló:', emailResult.error);
            return {
                status: true,
                notified: false,
                warning: 'No se pudo enviar el correo',
                error: emailResult.error
            };
        }

        return {
            status: true,
            notified: true,
            message: 'Notificación enviada a coordinación comercial'
        };
    } catch (error) {
        console.error('❌ [NotificarClienteInactivo] Error:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};
