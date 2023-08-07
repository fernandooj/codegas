CREATE OR REPLACE FUNCTION get_reporte_emergencia(
    _start INT,
    _limit INT,
    _busqueda VARCHAR(255)
)
RETURNS TABLE (
    _id INT, 
    creado TIMESTAMP,
    tanque BOOLEAN,
    red BOOLEAN,
    puntos BOOLEAN,
    fuga BOOLEAN,
    pqr BOOLEAN,
    otrosText VARCHAR,
    cerradoText VARCHAR,
    ruta CHARACTER VARYING[],
    documento CHARACTER VARYING[],
    rutaCerrar CHARACTER VARYING[],
    activo BOOLEAN,
    eliminado BOOLEAN,
    puntoId INT,
    puntoDireccion VARCHAR,
    usuarioId INT,
    usuarioNombre VARCHAR,
    usuarioCreaId INT,
    usuarioCreaNombre VARCHAR,
    usuarioCierraId INT,
    usuarioCierraNombre VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        rp._id, 
        rp.creado, 
        rp.tanque, 
        rp.red, 
        rp.puntos, 
        rp.fuga, 
        rp.pqr, 
        rp.otrosText, 
        rp.cerradoText, 
        ARRAY(SELECT DISTINCT unnest(rp.ruta)) AS ruta,
        ARRAY(SELECT DISTINCT unnest(rp.documento)) AS documento,
        ARRAY(SELECT DISTINCT unnest(rp.rutaCerrar)) AS rutaCerrar,
        rp.activo, 
        rp.eliminado, 
        rp.puntoId, 
        p.direccion, 
        rp.usuarioId, 
        u1.nombre as usuarioNombre, 
        rp.usuarioCrea, 
        u2.nombre as usuarioCreaNombre, 
        rp.usuarioCierra, 
        u3.nombre as usuarioCierraNombre
    FROM reporte_emergencia rp
    LEFT JOIN puntos p ON rp.puntoId = p._id
    LEFT JOIN users u1 ON rp.usuarioId = u1._id
    LEFT JOIN users u2 ON rp.usuarioCrea = u2._id
    LEFT JOIN users u3 ON rp.usuarioCierra = u3._id 
    WHERE p.activo = true
    AND (
        rp._id::text LIKE '%' || _busqueda || '%' OR
        rp.otrosText LIKE '%' || _busqueda || '%' OR
        rp.cerradoText LIKE '%' || _busqueda || '%' OR
        p.direccion LIKE '%' || _busqueda || '%' OR
        u1.nombre LIKE '%' || _busqueda || '%' OR
        u2.nombre LIKE '%' || _busqueda || '%' OR
        u3.nombre LIKE '%' || _busqueda || '%'
    )
    ORDER BY rp._id DESC
    LIMIT _limit
    OFFSET _start;
END;
$$ LANGUAGE plpgsql;




-- SELECT * FROM get_reporte_emergencia(0, 10, '');
 

 