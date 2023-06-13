CREATE OR REPLACE FUNCTION create_frecuencias_semanal(
    _frecuencia VARCHAR(20)
)
RETURNS TABLE (
    dia INT,
    pedido_id INT,
    dia1 INT,
    forma VARCHAR(255),
    cantidadKl INT,
    cantidadPrecio INT,
    usuarioId INT,
    puntoId INT,
    usuarioCrea INT,
    valorUnitario INT
)
LANGUAGE plpgsql AS
$func$
DECLARE
    currentDayOfWeek INT;
BEGIN
    currentDayOfWeek := EXTRACT(ISODOW FROM current_date)+1;

    SET TIME ZONE 'America/Bogota';

    RETURN QUERY 
        SELECT currentDayOfWeek, p._id, p.dia1, p.forma, p.cantidadKl, p.cantidadPrecio, p.usuarioId, p.puntoId, p.usuarioCrea, u.valorUnitario
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioId
        WHERE p.frecuencia = _frecuencia
        AND p.dia1 = currentDayOfWeek;

    INSERT INTO pedidos (
        pedidoPadre,
        dia1, 
        forma,
        cantidadKl,
        cantidadPrecio,
        usuarioId,
        puntoId,
        usuarioCrea,
        valorUnitario,
        fechaSolicitud
    )
    SELECT 
        p._id, 
        p.dia1, 
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.usuarioId,
        p.puntoId,
        p.usuarioCrea,
        u.valorUnitario,
        TO_CHAR(current_date + INTERVAL '1 day', 'YYYY-MM-DD')
    FROM pedidos p
    JOIN users u ON u._id = p.usuarioId
    WHERE p.frecuencia = _frecuencia
    AND p.dia1 = currentDayOfWeek;

    RETURN;
END
$func$;
