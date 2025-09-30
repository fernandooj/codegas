drop function if exists get_pedido_today;
CREATE OR REPLACE FUNCTION get_pedido_today(
    _usuarioId INT,
    _punto INT
)
RETURNS TABLE(
    _id INT,
    fechaSolicitud VARCHAR,
    creado TIMESTAMP,
    forma VARCHAR,
    cantidadKl INT,
    cantidadPrecio INT,
    usuarioCrea INT,
    nombre_usuario VARCHAR,
    razon_social_usuario VARCHAR
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT 
        p._id,
        p.fechaSolicitud,
        p.creado,
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.usuarioCrea,
        u.nombre as nombre_usuario,
        u.razon_social as razon_social_usuario
    FROM pedidos p
    LEFT JOIN users u ON p.usuarioCrea = u._id
    WHERE p.usuarioId = _usuarioId 
    AND p.puntoId = _punto
    AND p.eliminado = FALSE
    AND p.fechaSolicitud::DATE >= DATE_TRUNC('day', CURRENT_TIMESTAMP)::DATE
    ORDER BY p.fechaSolicitud ASC;
END
$func$;
