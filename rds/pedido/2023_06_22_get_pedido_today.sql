CREATE OR REPLACE FUNCTION get_pedido_today(
    _usuarioId INT,
    _punto INT
)
RETURNS INT
LANGUAGE plpgsql AS
$func$
DECLARE
    _total_pedidos INT;
BEGIN
    SELECT COUNT(*)
    INTO _total_pedidos
    FROM pedidos
    WHERE usuarioId = _usuarioId 
    AND puntoId = _punto
    AND eliminado = FALSE
    AND DATE_TRUNC('day', creado) = DATE_TRUNC('day', CURRENT_TIMESTAMP);

    RETURN _total_pedidos;
END
$func$;
