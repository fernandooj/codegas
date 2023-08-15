CREATE OR REPLACE FUNCTION get_pedidos_chart(
    _usuarioId INT
)
RETURNS TABLE (
    fechaEntrega TIMESTAMP,
    kilos VARCHAR(30),
    cantidadPrecio INT,
    entregado BOOLEAN,
    estado VARCHAR
)
LANGUAGE plpgsql AS
$func$
DECLARE
    _limit INT := 3000; -- Puedes ajustar el límite según tus necesidades
    _start_date TIMESTAMP := now() - interval '6 months';
BEGIN  
    RETURN QUERY 
    SELECT p.fechaEntrega, p.kilos, p.cantidadPrecio, p.entregado, p.estado
    FROM pedidos p
    WHERE p.fechaEntrega >= _start_date
    AND p.entregado = true
    AND p.eliminado = false
    AND p.estado = 'activo'
    AND p.usuarioId = _usuarioId
    ORDER BY p.fechaEntrega DESC
    LIMIT _limit;
END
$func$;


-- drop function get_pedidos_chart(INT)