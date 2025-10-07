DROP FUNCTION IF EXISTS get_pedidos_chart(INT);
CREATE OR REPLACE FUNCTION get_pedidos_chart(
    _usuarioId INT
)
RETURNS TABLE (
    fechaentrega VARCHAR,
    kilos VARCHAR,
    cantidadPrecio INT,
    entregado BOOLEAN,
    estado VARCHAR
)
LANGUAGE plpgsql AS
$func$
BEGIN  
    RETURN QUERY 
    SELECT 
        p.fechaEntregado as fechaentrega,
        p.kilos,
        p.cantidadPrecio,
        p.entregado,
        p.estado
    FROM pedidos p
    WHERE p.entregado = TRUE
    AND p.eliminado = FALSE
    AND p.usuarioId = _usuarioId
    ORDER BY 
        CASE 
            WHEN p.fechaEntregado LIKE '%/%' THEN 
                TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')
            WHEN p.fechaEntregado LIKE '%-%' THEN 
                p.fechaEntregado::TIMESTAMP
            WHEN p.fechaEntregado ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$' THEN 
                TO_TIMESTAMP(p.fechaEntregado || ' 00:00', 'DD/MM/YYYY HH24:MI')
            ELSE NULL
        END DESC;
END
$func$;


-- drop function get_pedidos_chart(INT)