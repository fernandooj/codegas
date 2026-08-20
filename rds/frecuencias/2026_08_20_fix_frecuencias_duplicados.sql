-- Fix: evitar pedidos duplicados por frecuencia (especialmente miércoles).
-- Problemas previos:
-- 1) EXTRACT(...)+1 desplazaba el día (martes seleccionaba dia1=3 = miércoles)
-- 2) SET TIME ZONE iba DESPUÉS del EXTRACT
-- 3) fechaSolicitud usaba +1 día en lugar de +2 (alineado al job moderno)
-- 4) No había NOT EXISTS → reejecutar duplicaba

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

    -- Job moderno crea para CURRENT_DATE + 2 (día de entrega)
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

CREATE OR REPLACE FUNCTION create_frecuencias_quincenal(
    _frecuencia VARCHAR(20)
)
RETURNS TABLE (
    dia INT,
    pedido_id INT,
    dia1 INT,
    dia2 INT,
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
    currentDayOfMonth INT;
    fechaEntrega DATE;
BEGIN
    SET TIME ZONE 'America/Bogota';

    fechaEntrega := CURRENT_DATE + INTERVAL '2 days';
    currentDayOfMonth := EXTRACT(DAY FROM fechaEntrega)::INT;

    RETURN QUERY
        SELECT currentDayOfMonth, p._id, p.dia1, p.dia2, p.forma, p.cantidadKl, p.cantidadPrecio, p.usuarioId, p.puntoId, p.usuarioCrea, u.valorUnitario
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioId
        WHERE p.frecuencia = _frecuencia
          AND p.eliminado = FALSE
          AND p.pedidopadre IS NULL
          AND p.grupo_id IS NULL
          AND (p.dia1 = currentDayOfMonth OR p.dia2 = currentDayOfMonth);

    INSERT INTO pedidos (
        pedidoPadre,
        dia1,
        dia2,
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
        p.dia2,
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
      AND (p.dia1 = currentDayOfMonth OR p.dia2 = currentDayOfMonth)
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

CREATE OR REPLACE FUNCTION create_frecuencias_mensual(
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
    currentDayOfMonth INT;
    fechaEntrega DATE;
BEGIN
    SET TIME ZONE 'America/Bogota';

    fechaEntrega := CURRENT_DATE + INTERVAL '2 days';
    currentDayOfMonth := EXTRACT(DAY FROM fechaEntrega)::INT;

    RETURN QUERY
        SELECT currentDayOfMonth, p._id, p.dia1, p.forma, p.cantidadKl, p.cantidadPrecio, p.usuarioId, p.puntoId, p.usuarioCrea, u.valorUnitario
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioId
        WHERE p.frecuencia = _frecuencia
          AND p.eliminado = FALSE
          AND p.pedidopadre IS NULL
          AND p.grupo_id IS NULL
          AND p.dia1 = currentDayOfMonth;

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
      AND p.dia1 = currentDayOfMonth
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
