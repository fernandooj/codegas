const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

module.exports.main = async (event) => {
    const client = await poolConection.connect();
    
    try {
        const body = JSON.parse(event.body || '{}');
        const {
            nombre,
            tipo_frecuencia,
            dia_semana,
            intervalo_semanas,
            dia_mes,
            dia_semana_mensual
        } = body;

        // Validaciones
        if (!nombre || !tipo_frecuencia) {
            return {
                status: false,
                message: 'Nombre y tipo de frecuencia son requeridos'
            };
        }

        if (tipo_frecuencia === 'semanal') {
            if (!dia_semana || !intervalo_semanas) {
                return {
                    status: false,
                    message: 'Para frecuencia semanal se requiere dia_semana e intervalo_semanas'
                };
            }
        } else if (tipo_frecuencia === 'mensual') {
            if (!dia_mes || !dia_semana_mensual) {
                return {
                    status: false,
                    message: 'Para frecuencia mensual se requiere dia_mes y dia_semana_mensual'
                };
            }
        }

        const INSERT_GRUPO = `
            INSERT INTO grupos_frecuencias (
                nombre,
                tipo_frecuencia,
                dia_semana,
                intervalo_semanas,
                dia_mes,
                dia_semana_mensual
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const { rows } = await client.query(INSERT_GRUPO, [
            nombre,
            tipo_frecuencia,
            tipo_frecuencia === 'semanal' ? dia_semana : null,
            tipo_frecuencia === 'semanal' ? intervalo_semanas : null,
            tipo_frecuencia === 'mensual' ? dia_mes : null,
            tipo_frecuencia === 'mensual' ? dia_semana_mensual : null
        ]);

        return {
            status: true,
            grupo: rows[0],
            message: 'Grupo de frecuencia creado exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

