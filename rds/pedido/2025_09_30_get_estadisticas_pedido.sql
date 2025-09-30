DROP FUNCTION IF EXISTS get_estadisticas_pedido;
CREATE OR REPLACE FUNCTION get_estadisticas_pedido(
    _conductorId INT,
    _periodo VARCHAR(10) -- 'dia', 'semana', 'mes', 'año'
)
RETURNS TABLE(
    placa VARCHAR,
    total_kilos_credito NUMERIC,
    total_valor_credito NUMERIC,
    total_kilos_contado NUMERIC,
    total_valor_contado NUMERIC,
    total_kilos NUMERIC,
    total_valor NUMERIC,
    cantidad_pedidos INT
)
LANGUAGE plpgsql AS
$func$
DECLARE
    fecha_inicio TIMESTAMP;
BEGIN
    -- Definir el inicio del periodo según el parámetro
    CASE _periodo
        WHEN 'dia' THEN
            -- Desde hoy a las 00:00
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        WHEN 'semana' THEN
            -- Desde el lunes de esta semana a las 00:00
            fecha_inicio := DATE_TRUNC('week', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        WHEN 'mes' THEN
            -- Desde el día 1 del mes actual a las 00:00
            fecha_inicio := DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        WHEN 'año' THEN
            -- Desde el 1 de enero del año actual a las 00:00
            fecha_inicio := DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
        ELSE
            -- Por defecto, día actual
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
    END CASE;

    RETURN QUERY
    SELECT 
        COALESCE(c.placa, 'TOTAL') as placa,
        -- Crédito
        SUM(CASE 
            WHEN LOWER(p.forma_pago) = 'credito' THEN 
                CASE 
                    WHEN TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                    ELSE 0
                END
            ELSE 0 
        END) as total_kilos_credito,
        SUM(CASE 
            WHEN LOWER(p.forma_pago) = 'credito' THEN 
                CASE 
                    WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                    ELSE 0
                END
            ELSE 0 
        END) as total_valor_credito,
        -- Contado
        SUM(CASE 
            WHEN LOWER(p.forma_pago) = 'contado' THEN 
                CASE 
                    WHEN TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                    ELSE 0
                END
            ELSE 0 
        END) as total_kilos_contado,
        SUM(CASE 
            WHEN LOWER(p.forma_pago) = 'contado' THEN 
                CASE 
                    WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                    ELSE 0
                END
            ELSE 0 
        END) as total_valor_contado,
        -- Total
        SUM(CASE 
            WHEN TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
            ELSE 0
        END) as total_kilos,
        SUM(CASE 
            WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
            ELSE 0
        END) as total_valor,
        COUNT(p._id)::INT as cantidad_pedidos
    FROM pedidos p
    LEFT JOIN carros c ON p.carroId = c._id
    WHERE p.entregado = TRUE
    AND p.eliminado = FALSE
    AND p.fechaEntregado IS NOT NULL
    AND p.fechaEntregado != ''
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
    -- Si se proporciona un conductorId (conductor consultando), filtrar solo sus pedidos
    AND (_conductorId IS NULL OR p.conductorId = _conductorId)
    GROUP BY ROLLUP(c.placa)
    ORDER BY 
        CASE WHEN c.placa IS NULL THEN 1 ELSE 0 END, -- TOTAL al final
        c.placa;
END
$func$;

-- Ejemplos de uso:
-- Para admin (ver todos los conductores):
-- SELECT * FROM get_estadisticas_pedido(NULL, 'dia');
-- SELECT * FROM get_estadisticas_pedido(NULL, 'semana');
-- SELECT * FROM get_estadisticas_pedido(NULL, 'mes');
-- SELECT * FROM get_estadisticas_pedido(NULL, 'año');

-- Para conductor (ver solo sus estadísticas):
-- SELECT * FROM get_estadisticas_pedido(123, 'dia');
-- SELECT * FROM get_estadisticas_pedido(123, 'semana');
