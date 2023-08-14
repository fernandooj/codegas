CREATE OR REPLACE FUNCTION get_todas_frecuencias()
RETURNS TABLE (
    dia INT,
    pedido_id INT,
    dia1 INT,
    dia2 INT,
    forma VARCHAR(255),
    frecuencia VARCHAR(255),
    cantidadKl INT,
    cantidadPrecio INT,
    usuarioId INT,
    puntoId INT,
    usuarioCrea INT,
    valorUnitario INT,
    nombre VARCHAR(255),
    razon_social VARCHAR(255),
    codt VARCHAR(255)
)
LANGUAGE plpgsql AS
$func$
DECLARE
    currentDayOfMonth INT;
BEGIN
    currentDayOfMonth := EXTRACT(DAY FROM current_date)+1;

    SET TIME ZONE 'America/Bogota';

    RETURN QUERY 
        SELECT currentDayOfMonth, p._id, p.dia1, p.dia2, p.forma, p.frecuencia, p.cantidadKl, p.cantidadPrecio, p.usuarioId, p.puntoId, p.usuarioCrea, u.valorUnitario, u.nombre, u.razon_social, u.codt
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioId
        WHERE p.frecuencia = 'semanal'
        OR p.frecuencia = 'quincenal'
        OR p.frecuencia = 'mensual';

    RETURN;
END
$func$;


-- DROP FUNCTION get_todas_frecuencias