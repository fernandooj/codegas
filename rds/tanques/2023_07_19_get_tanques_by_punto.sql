CREATE OR REPLACE FUNCTION get_tanque_by_punto(
    _puntoId INT
)
RETURNS TABLE (
    _id INT,
    capacidad VARCHAR(255),
    placaText VARCHAR(255),
    razon_social VARCHAR(255),
    codt VARCHAR(255),
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
    placa              character varying[],
	placaMantenimiento character varying[],
	placaFabricante    character varying[],
	dossier			   character varying[],
	cerFabricante	   character varying[],
	cerOnac	   		   character varying[],
	visual	   		   character varying[],

    data JSONB[],
    total INT
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
        u.codt,
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
        p.direccion AS direccion,
        COALESCE(t.placa, ARRAY[]::character varying[]) AS placa,
        COALESCE(t.placaMantenimiento, ARRAY[]::character varying[]) AS placaMantenimiento,
        COALESCE(t.placaFabricante, ARRAY[]::character varying[]) AS placaFabricante,
        COALESCE(t.dossier, ARRAY[]::character varying[]) AS dossier,
        COALESCE(t.cerFabricante, ARRAY[]::character varying[]) AS cerFabricante,
        COALESCE(t.cerOnac, ARRAY[]::character varying[]) AS cerOnac,
        COALESCE(t.visual, ARRAY[]::character varying[]) AS visual,
        CASE WHEN count(at._id) > 0 THEN array_agg(jsonb_build_object('texto', at.alertaText, 'activo', at.activo)) ELSE '{}' END AS data,
        (
            SELECT count(*)::INT
            FROM (
                SELECT DISTINCT t._id
                FROM tanques t
                LEFT JOIN users u ON t.usuarioId = u._id
                LEFT JOIN puntos p ON t.puntoId = p._id
                LEFT JOIN alertaTanques at ON t._id = at.tanqueId
                 
            ) AS subquery
        ) AS total
    FROM
        tanques t
        LEFT JOIN users u ON t.usuarioId = u._id
        LEFT JOIN puntos p ON t.puntoId = p._id
        LEFT JOIN alertaTanques at ON t._id = at.tanqueId
    WHERE
        t.eliminado = false
        AND t.activo = true
        AND t.puntoId = _puntoId
        
    GROUP BY
        t._id,
        t.capacidad,
        t.placaText,
        u.razon_social,
        u.codt,
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
        t._id DESC;

    RETURN;
END
$func$;
