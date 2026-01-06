const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Updates an existing planilla
 * 
 * @param {object} event - Lambda event object with _id in path and update data in body
 * @returns {Promise<object>} - Promise that resolves with updated planilla
 * @throws {DatabaseError} - Throws DatabaseError if operation fails
 */
module.exports.main = async (event) => {
    const client = await poolConection.connect();

    try {
        const { _id } = event.pathParameters || {};
        const body = JSON.parse(event.body || '{}');

        if (!_id) {
            return {
                status: false,
                message: '_id es requerido'
            };
        }

        const {
            ruta,
            guia,
            no_planilla,
            placa_vehiculo,
            fecha,
            kilometraje_inicial,
            kilometraje_final,
            remision_inicial,
            remision_final,
            inventario_inicial_porcentaje,
            inventario_final_porcentaje,
            inventario_inicial_kl,
            inventario_final_kl,
            novedades,
            gastos,
            user_id
        } = body;

        const UPDATE_PLANILLA = `
            UPDATE planillas SET
                ruta = COALESCE($1, ruta),
                guia = COALESCE($2, guia),
                no_planilla = COALESCE($3, no_planilla),
                placa_vehiculo = COALESCE($4, placa_vehiculo),
                fecha = COALESCE($5, fecha),
                kilometraje_inicial = COALESCE($6, kilometraje_inicial),
                kilometraje_final = COALESCE($7, kilometraje_final),
                remision_inicial = COALESCE($8, remision_inicial),
                remision_final = COALESCE($9, remision_final),
                inventario_inicial_porcentaje = COALESCE($10, inventario_inicial_porcentaje),
                inventario_final_porcentaje = COALESCE($11, inventario_final_porcentaje),
                inventario_inicial_kl = COALESCE($12, inventario_inicial_kl),
                inventario_final_kl = COALESCE($13, inventario_final_kl),
                novedades = COALESCE($14, novedades),
                gastos = COALESCE($15::jsonb, gastos),
                user_id = COALESCE($16, user_id)
            WHERE _id = $17
            AND eliminado = FALSE
            RETURNING *
        `;

        const gastosJson = gastos !== undefined ? (Array.isArray(gastos) ? JSON.stringify(gastos) : '[]') : null;

        const { rows } = await client.query(UPDATE_PLANILLA, [
            ruta || null,
            guia || null,
            no_planilla || null,
            placa_vehiculo || null,
            fecha || null,
            kilometraje_inicial || null,
            kilometraje_final || null,
            remision_inicial || null,
            remision_final || null,
            inventario_inicial_porcentaje || null,
            inventario_final_porcentaje || null,
            inventario_inicial_kl || null,
            inventario_final_kl || null,
            novedades || null,
            gastosJson,
            user_id || null,
            _id
        ]);

        if (rows.length === 0) {
            return {
                status: false,
                message: 'Planilla no encontrada o ya eliminada'
            };
        }

        return {
            status: true,
            planilla: rows[0],
            message: 'Planilla actualizada exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

