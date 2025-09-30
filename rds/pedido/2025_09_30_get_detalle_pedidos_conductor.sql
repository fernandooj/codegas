DROP FUNCTION IF EXISTS get_detalle_pedidos_conductor;
CREATE OR REPLACE FUNCTION get_detalle_pedidos_conductor(
    _conductorId INT,
    _periodo VARCHAR(10) -- 'dia', 'semana', 'mes', 'año'
)
RETURNS TABLE(
    remision INT,          -- ID del pedido
    pedido VARCHAR,        -- Número de pedido
    codt VARCHAR,          -- Código del punto
    total_kilos NUMERIC,   -- Total de kilos
    vlr_contado NUMERIC,   -- Valor en contado
    valor_total NUMERIC    -- Valor total
)
LANGUAGE plpgsql AS
$func$
DECLARE
    fecha_inicio TIMESTAMP;
BEGIN
    -- Definir el inicio del periodo según el parámetro
    CASE _periodo
        WHEN 'dia' THEN
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        WHEN 'semana' THEN
            fecha_inicio := DATE_TRUNC('week', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        WHEN 'mes' THEN
            fecha_inicio := DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        WHEN 'año' THEN
            fecha_inicio := DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        ELSE
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
    END CASE;

    RETURN QUERY
    SELECT * FROM (
        SELECT 
            p._id::INT as remision,
            COALESCE(p.factura, '')::VARCHAR as pedido,
            COALESCE(u.codt, '')::VARCHAR as codt,
            CASE 
                WHEN p.kilos IS NOT NULL AND TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                ELSE 0
            END as total_kilos,
            CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'contado' THEN
                    CASE 
                        WHEN p.valor_total IS NOT NULL AND TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE NULL
            END as vlr_contado,
            CASE 
                WHEN p.valor_total IS NOT NULL AND TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                ELSE 0
            END as valor_total
        FROM pedidos p
        LEFT JOIN users u ON p.usuarioId = u._id
        WHERE p.entregado = TRUE
        AND p.eliminado = FALSE
        AND p.fechaEntregado IS NOT NULL
        AND p.fechaEntregado != ''
        AND p.conductorId = _conductorId
        AND (
            CASE 
                -- Si contiene '/', es formato DD/MM/YYYY
                WHEN p.fechaEntregado LIKE '%/%' THEN 
                    TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')
                -- Si contiene '-', es formato ISO (YYYY-MM-DD)
                WHEN p.fechaEntregado LIKE '%-%' THEN 
                    p.fechaEntregado::TIMESTAMP
                ELSE NULL
            END
        ) >= fecha_inicio
        AND (
            CASE 
                WHEN p.fechaEntregado LIKE '%/%' THEN 
                    TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')
                WHEN p.fechaEntregado LIKE '%-%' THEN 
                    p.fechaEntregado::TIMESTAMP
                ELSE NULL
            END
        ) <= CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'
        
        UNION ALL
        
        -- Fila de TOTAL
        SELECT 
            NULL::INT as remision,
            'TOTAL'::VARCHAR as pedido,
            ''::VARCHAR as codt,
            SUM(CASE 
                WHEN p.kilos IS NOT NULL AND TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                ELSE 0
            END) as total_kilos,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'contado' THEN
                    CASE 
                        WHEN p.valor_total IS NOT NULL AND TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_contado,
            SUM(CASE 
                WHEN p.valor_total IS NOT NULL AND TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                ELSE 0
            END) as valor_total
        FROM pedidos p
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
                ELSE NULL
            END
        ) >= fecha_inicio
        AND (
            CASE 
                WHEN p.fechaEntregado LIKE '%/%' THEN 
                    TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')
                WHEN p.fechaEntregado LIKE '%-%' THEN 
                    p.fechaEntregado::TIMESTAMP
                ELSE NULL
            END
        ) <= CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'
    ) subquery
    ORDER BY 
        CASE WHEN subquery.remision IS NULL THEN 1 ELSE 0 END, -- TOTAL al final
        subquery.remision; -- Ordenar por remision
END
$func$;

-- Ejemplos de uso:
-- Para conductor (ver detalle de sus pedidos):
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'dia');
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'semana');
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'mes');
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'año');
