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
    fechaEntrega DATE;
BEGIN
    SET TIME ZONE 'America/Bogota';

    -- Alineado al job diario: crea para CURRENT_DATE + 2 (día de entrega)
    fechaEntrega := CURRENT_DATE + INTERVAL '2 days';
    currentDayOfWeek := EXTRACT(ISODOW FROM fechaEntrega)::INT;

    RETURN QUERY
        SELECT currentDayOfWeek, p._id, p.dia1, p.forma, p.cantidadKl, p.cantidadPrecio, p.usuarioId, p.puntoId, p.usuarioCrea, u.valorUnitario
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioId
        WHERE p.frecuencia = _frecuencia
          AND p.eliminado = FALSE
          AND p.pedidopadre IS NULL
          AND p.grupo_id IS NULL
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
        fechaSolicitud,
        estado
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
        TO_CHAR(fechaEntrega, 'YYYY-MM-DD'),
        'espera'
    FROM pedidos p
    JOIN users u ON u._id = p.usuarioId
    WHERE p.frecuencia = _frecuencia
      AND p.eliminado = FALSE
      AND p.pedidopadre IS NULL
      AND p.grupo_id IS NULL
      AND p.dia1 = currentDayOfWeek
      AND NOT EXISTS (
          SELECT 1
          FROM pedidos h
          WHERE h.pedidopadre = p._id
            AND h.eliminado = FALSE
            AND h.fechasolicitud::date = fechaEntrega
      );

    RETURN;
END
$func$;
