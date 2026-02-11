const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_GRUPOS = `
    SELECT 
        g._id,
        g.nombre,
        g.tipo_frecuencia,
        g.dia_semana,
        g.intervalo_semanas,
        g.dia_mes,
        g.dia_semana_mensual,
        g.creado,
        g.actualizado,
        COALESCE(COUNT(p._id), 0)::INTEGER as total_pedidos
    FROM grupos_frecuencias g
    LEFT JOIN pedidos p ON p.grupo_id = g._id AND p.eliminado = FALSE
    WHERE g.eliminado = FALSE
    GROUP BY g._id, g.nombre, g.tipo_frecuencia, g.dia_semana, g.intervalo_semanas, 
             g.dia_mes, g.dia_semana_mensual, g.creado, g.actualizado
    ORDER BY g.nombre ASC
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

