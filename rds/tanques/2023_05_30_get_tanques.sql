CREATE OR REPLACE FUNCTION get_tanques(
    _limit INT,
    _start INT,
    _busqueda VARCHAR(255)
)
RETURNS TABLE (
    _id INT,
    capacidad VARCHAR(255),
    placaText VARCHAR(255),
    razon_social VARCHAR(255),
    codigoActivo VARCHAR(255),
    fabricante VARCHAR(255),
    registroOnac VARCHAR(255),
    fechaUltimaRev VARCHAR(255),
    nPlaca VARCHAR(255),
    serie VARCHAR(255),
    anoFabricacion VARCHAR(255),
    existeTanque VARCHAR(255),
    ultimRevTotal VARCHAR(255),
    propiedad VARCHAR(255),
    direccion VARCHAR(255),
    data JSONB[],
    total BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY 
    SELECT
        t._id,
        t.capacidad,
        t.placaText,
        u.razon_social AS razon_social,
        t.codigoActivo AS codt,
        t.fabricante,
        t.registroOnac,
        t.fechaUltimaRev,
        t.nPlaca,
        t.serie,
        t.anoFabricacion,
        t.existeTanque,
        t.ultimRevTotal,
        t.propiedad,
        p.direccion AS direccion,
        CASE WHEN count(at._id) > 0 THEN array_agg(jsonb_build_object('texto', at.alertaText, 'activo', at.activo)) ELSE '{}' END AS data,
        count(at._id) AS total
    FROM
        tanques t
        LEFT JOIN users u ON t.usuarioId = u._id
        LEFT JOIN puntos p ON t.puntoId = p._id
        LEFT JOIN alertaTanques at ON t._id = at.tanqueId
    WHERE
        t.eliminado = false
        AND t.activo = true
        AND (
            CONCAT(
                t._id::VARCHAR,
                t.capacidad,
                t.placaText,
                u.nombre,
                t.codigoActivo,
                t.fabricante,
                t.registroOnac,
                t.fechaUltimaRev,
                t.nPlaca,
                t.serie,
                t.anoFabricacion,
                t.existeTanque,
                t.ultimRevTotal,
                t.propiedad,
                p.direccion
            ) ILIKE '%' || _busqueda || '%'
        )
    GROUP BY
        t._id,
        t.capacidad,
        t.placaText,
        u.razon_social,
        t.codigoActivo,
        t.fabricante,
        t.registroOnac,
        t.fechaUltimaRev,
        t.nPlaca,
        t.serie,
        t.anoFabricacion,
        t.existeTanque,
        t.ultimRevTotal,
        t.propiedad,
        p.direccion
    ORDER BY
        t._id DESC
    LIMIT _limit
    OFFSET _start;

    RETURN;
END
$func$;
