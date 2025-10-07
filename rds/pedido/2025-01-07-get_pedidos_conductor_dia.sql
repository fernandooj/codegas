DROP FUNCTION IF EXISTS get_pedidos_conductor_dia;
CREATE OR REPLACE FUNCTION get_pedidos_conductor_dia(
    _conductorId INT,
    _periodo VARCHAR(10) -- 'dia', 'semana', 'mes', 'año'
)
RETURNS TABLE(
    _id INT,
    remision VARCHAR,
    numero_pedido VARCHAR,
    codt VARCHAR,
    cliente_nombre VARCHAR,
    punto_direccion VARCHAR,
    kilos VARCHAR,
    vlr_contado VARCHAR,
    vlr_credito VARCHAR,
    valor_total VARCHAR,
    forma_pago VARCHAR,
    fechaEntregado VARCHAR,
    placa VARCHAR
)
LANGUAGE plpgsql AS
$func$
DECLARE
    fecha_inicio TIMESTAMP;
    fecha_fin TIMESTAMP;
BEGIN
    -- Definir el inicio y fin del periodo según el parámetro
    CASE _periodo
        WHEN 'dia' THEN
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := fecha_inicio + INTERVAL '1 day';
        WHEN 'semana' THEN
            fecha_inicio := DATE_TRUNC('week', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota' + INTERVAL '1 day';
        WHEN 'mes' THEN
            fecha_inicio := DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota' + INTERVAL '1 day';
        WHEN 'año' THEN
            fecha_inicio := DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota' + INTERVAL '1 day';
        ELSE
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := fecha_inicio + INTERVAL '1 day';
    END CASE;

    RETURN QUERY
    SELECT 
        p._id,
        p.remision,
        CAST(p._id AS VARCHAR) as numero_pedido,
        u.codt as codt,
        u.nombre as cliente_nombre,
        pu.direccion as punto_direccion,
        p.kilos,
        CASE WHEN LOWER(p.forma_pago) = 'contado' THEN p.valor_total ELSE '' END as vlr_contado,
        CASE WHEN LOWER(p.forma_pago) = 'credito' THEN p.valor_total ELSE '' END as vlr_credito,
        p.valor_total,
        p.forma_pago,
        p.fechaEntregado,
        c.placa
    FROM pedidos p
    LEFT JOIN users u ON p.usuarioId = u._id
    LEFT JOIN puntos pu ON p.puntoId = pu._id
    LEFT JOIN carros c ON p.carroId = c._id
    WHERE p.entregado = TRUE
    AND p.eliminado = FALSE
    AND p.fechaEntregado IS NOT NULL
    AND p.fechaEntregado != ''
    AND p.conductorId = _conductorId
    AND (
        CASE 
            WHEN p.fechaEntregado LIKE '%/%' THEN 
                TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')
            WHEN p.fechaEntregado LIKE '%-%' THEN 
                p.fechaEntregado::TIMESTAMP
            WHEN p.fechaEntregado ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$' THEN 
                TO_TIMESTAMP(p.fechaEntregado || ' 00:00', 'DD/MM/YYYY HH24:MI')
            ELSE NULL
        END
    ) >= fecha_inicio
    AND (
        CASE 
            WHEN p.fechaEntregado LIKE '%/%' THEN 
                TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')
            WHEN p.fechaEntregado LIKE '%-%' THEN 
                p.fechaEntregado::TIMESTAMP
            WHEN p.fechaEntregado ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$' THEN 
                TO_TIMESTAMP(p.fechaEntregado || ' 23:59', 'DD/MM/YYYY HH24:MI')
            ELSE NULL
        END
    ) < fecha_fin
    ORDER BY 
        p.remision ASC;
END
$func$;

-- Ejemplo de uso:
-- SELECT * FROM get_pedidos_conductor_dia(123, 'dia');

