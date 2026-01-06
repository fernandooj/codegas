const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

module.exports.main = async (event) => {
    const client = await poolConection.connect();
    
    try {
        const { id } = event.pathParameters;

        // Soft delete: marcar como eliminado
        const DELETE_GRUPO = `
            UPDATE grupos_frecuencias
            SET eliminado = TRUE, actualizado = CURRENT_TIMESTAMP
            WHERE _id = $1
            RETURNING *
        `;

        const { rows } = await client.query(DELETE_GRUPO, [id]);

        if (rows.length === 0) {
            return {
                status: false,
                message: 'Grupo de frecuencia no encontrado'
            };
        }

        return {
            status: true,
            message: 'Grupo de frecuencia eliminado exitosamente'
        };
    } catch (error) {
        console.log(error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

