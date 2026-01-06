const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_GRUPOS = `
    SELECT 
        _id,
        nombre,
        tipo_frecuencia,
        dia_semana,
        intervalo_semanas,
        dia_mes,
        dia_semana_mensual,
        creado,
        actualizado
    FROM grupos_frecuencias
    WHERE eliminado = FALSE
    ORDER BY nombre ASC
`;

module.exports.main = async (event) => {
    try {
        const client = await poolConection.connect();
        
        const { rows: grupos } = await client.query(GET_GRUPOS, []);

        return {
            status: true,
            grupos
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    }
};

