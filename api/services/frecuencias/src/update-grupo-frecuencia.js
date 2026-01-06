const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

module.exports.main = async (event) => {
    const client = await poolConection.connect();
    
    try {
        const { id } = event.pathParameters;
        const body = JSON.parse(event.body || '{}');
        const {
            nombre,
            tipo_frecuencia,
            dia_semana,
            intervalo_semanas,
            dia_mes,
            dia_semana_mensual
        } = body;

        const UPDATE_GRUPO = `
            UPDATE grupos_frecuencias
            SET 
                nombre = COALESCE($1, nombre),
                tipo_frecuencia = COALESCE($2, tipo_frecuencia),
                dia_semana = $3,
                intervalo_semanas = $4,
                dia_mes = $5,
                dia_semana_mensual = $6,
                actualizado = CURRENT_TIMESTAMP
            WHERE _id = $7 AND eliminado = FALSE
            RETURNING *
        `;

        const { rows } = await client.query(UPDATE_GRUPO, [
            nombre,
            tipo_frecuencia,
            tipo_frecuencia === 'semanal' ? dia_semana : null,
            tipo_frecuencia === 'semanal' ? intervalo_semanas : null,
            tipo_frecuencia === 'mensual' ? dia_mes : null,
            tipo_frecuencia === 'mensual' ? dia_semana_mensual : null,
            id
        ]);

        if (rows.length === 0) {
            return {
                status: false,
                message: 'Grupo de frecuencia no encontrado'
            };
        }

        return {
            status: true,
            grupo: rows[0],
            message: 'Grupo de frecuencia actualizado exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

