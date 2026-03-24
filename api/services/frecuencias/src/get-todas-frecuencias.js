const AWS = require('aws-sdk');
const ses = new AWS.SES();
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

const GET_FRECUENCIAS = 'SELECT * FROM get_todas_frecuencias()';

/**
 * Añade nombre del punto y zona (join puntos + zonas) para la app de frecuencias.
 */
const enrichFrecuenciasConPuntoYZona = async (client, frecuencias) => {
    if (!frecuencias || frecuencias.length === 0) {
        return frecuencias;
    }

    const ids = [
        ...new Set(
            frecuencias
                .map((r) => r.puntoid ?? r.puntoId)
                .filter((id) => id != null && id !== '' && !Number.isNaN(Number(id)))
                .map((id) => Number(id))
        )
    ];

    if (ids.length === 0) {
        return frecuencias;
    }

    const { rows: puntosRows } = await client.query(
        `
        SELECT
            pt._id AS puntoid,
            COALESCE(NULLIF(TRIM(pt.nombre), ''), NULLIF(TRIM(pt.place_name), ''), '') AS punto_nombre,
            COALESCE(z.nombre, '') AS zona_nombre
        FROM puntos pt
        LEFT JOIN zonas z ON z._id = pt.idzona
        WHERE pt._id = ANY($1::int[])
        `,
        [ids]
    );

    const map = new Map(puntosRows.map((p) => [Number(p.puntoid), p]));

    return frecuencias.map((r) => {
        const pid = Number(r.puntoid ?? r.puntoId);
        const extra = Number.isFinite(pid) ? map.get(pid) : null;
        if (!extra) {
            return {
                ...r,
                punto_nombre: r.punto_nombre || '',
                zona_nombre: r.zona_nombre || ''
            };
        }
        return {
            ...r,
            punto_nombre: extra.punto_nombre || '',
            zona_nombre: extra.zona_nombre || ''
        };
    });
};

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

/**
 * Obtiene todas las frecuencias y grupos de frecuencias
 * 
 * @returns {Promise<object>} - Promise that resolves with frecuencias and grupos
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

 
module.exports.main = async (event) => {  
  
  try {
    const client = await poolConection.connect();
    
    // Obtener frecuencias (pedidos con frecuencia asignada)
    const { rows: frecuenciasRaw } = await client.query(GET_FRECUENCIAS, []);
    const frecuencias = await enrichFrecuenciasConPuntoYZona(client, frecuenciasRaw);

    // Obtener grupos de frecuencias
    const { rows: grupos } = await client.query(GET_GRUPOS, []);

    return {
      status: true,
      frecuencias,
      grupos
    };
  } catch (error) {
    console.log(error)
    throw new DatabaseError(error);
  }
};
