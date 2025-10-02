DROP FUNCTION IF EXISTS get_estadisticas_por_dia;
CREATE OR REPLACE FUNCTION get_estadisticas_por_dia(
    _conductorId INT,
    _periodo VARCHAR(10) -- 'dia', 'semana', 'mes', 'año'
)
RETURNS TABLE(
    fechaentrega TEXT,
    cantidad_pedidos INT,
    total_kilos NUMERIC,
    vlr_contado NUMERIC,
    vlr_credito NUMERIC,
    valor_total NUMERIC
)
LANGUAGE plpgsql AS
$func$
DECLARE
    fecha_inicio TIMESTAMP;
    fecha_fin TIMESTAMP;
BEGIN
    -- Definir el inicio del periodo según el parámetro
    CASE _periodo
        WHEN 'dia' THEN
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := fecha_inicio + INTERVAL '1 day';
        WHEN 'semana' THEN
            fecha_inicio := DATE_TRUNC('week', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota';
        WHEN 'mes' THEN
            fecha_inicio := DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota';
        WHEN 'año' THEN
            fecha_inicio := DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota';
        ELSE
            fecha_inicio := DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota');
            fecha_fin := fecha_inicio + INTERVAL '1 day';
    END CASE;

    -- Solo para año: mostrar TOTAL GENERAL primero
    IF _periodo = 'año' THEN
        RETURN QUERY
        SELECT 
            'TOTAL GENERAL'::TEXT as fechaentrega,
            COUNT(p._id)::INT as cantidad_pedidos,
            SUM(CASE 
                WHEN TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                ELSE 0
            END) as total_kilos,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'contado' THEN
                    CASE 
                        WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_contado,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'credito' THEN
                    CASE 
                        WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_credito,
            SUM(CASE 
                WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                ELSE 0
            END) as valor_total
        FROM pedidos p
        WHERE p.entregado = TRUE
        AND p.eliminado = FALSE
        AND p.fechaEntregado IS NOT NULL
        AND p.fechaEntregado != ''
        AND (_conductorId IS NULL OR p.conductorId = _conductorId)
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
        ) < fecha_fin;
    END IF;

    -- Datos por día (para todos los períodos)
    RETURN QUERY
    SELECT 
        resultados.fechaentrega,
        resultados.cantidad_pedidos,
        resultados.total_kilos,
        resultados.vlr_contado,
        resultados.vlr_credito,
        resultados.valor_total
    FROM (
        -- Datos por día
        SELECT 
            'Total ' || TO_CHAR(
                CASE 
                    WHEN p.fechaEntregado LIKE '%/%' THEN 
                        TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')::DATE
                    WHEN p.fechaEntregado LIKE '%-%' THEN 
                        p.fechaEntregado::DATE
                    ELSE NULL
                END, 
                'DD/MM/YYYY'
            ) as fechaentrega,
            COUNT(p._id)::INT as cantidad_pedidos,
            SUM(CASE 
                WHEN TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                ELSE 0
            END) as total_kilos,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'contado' THEN
                    CASE 
                        WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_contado,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'credito' THEN
                    CASE 
                        WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_credito,
            SUM(CASE 
                WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                ELSE 0
            END) as valor_total,
            1 as orden -- Para ordenar después del total
        FROM pedidos p
        WHERE p.entregado = TRUE
        AND p.eliminado = FALSE
        AND p.fechaEntregado IS NOT NULL
        AND p.fechaEntregado != ''
        AND (_conductorId IS NULL OR p.conductorId = _conductorId)
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
        ) < fecha_fin
        GROUP BY 
            CASE 
                WHEN p.fechaEntregado LIKE '%/%' THEN 
                    TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')::DATE
                WHEN p.fechaEntregado LIKE '%-%' THEN 
                    p.fechaEntregado::DATE
                ELSE NULL
            END
        
        UNION ALL
        
        -- Para semana y mes, mostrar totales al final
        SELECT 
            'TOTAL PERIODO'::TEXT as fechaentrega,
            COUNT(p._id)::INT as cantidad_pedidos,
            SUM(CASE 
                WHEN TRIM(p.kilos) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.kilos)::NUMERIC
                ELSE 0
            END) as total_kilos,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'contado' THEN
                    CASE 
                        WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_contado,
            SUM(CASE 
                WHEN LOWER(COALESCE(p.forma_pago, '')) = 'credito' THEN
                    CASE 
                        WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                        ELSE 0
                    END
                ELSE 0
            END) as vlr_credito,
            SUM(CASE 
                WHEN TRIM(p.valor_total) ~ '^[0-9]+\.?[0-9]*$' THEN TRIM(p.valor_total)::NUMERIC
                ELSE 0
            END) as valor_total,
            2 as orden -- Para ordenar al final
        FROM pedidos p
        WHERE p.entregado = TRUE
        AND p.eliminado = FALSE
        AND p.fechaEntregado IS NOT NULL
        AND p.fechaEntregado != ''
        AND (_conductorId IS NULL OR p.conductorId = _conductorId)
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
        ) < fecha_fin
        AND _periodo IN ('semana', 'mes')
    ) resultados
    ORDER BY 
        resultados.orden,
        CASE 
            WHEN resultados.fechaentrega LIKE 'Total %' THEN 
                TO_DATE(SUBSTRING(resultados.fechaentrega FROM 'Total (.*)'), 'DD/MM/YYYY')
            ELSE NULL
        END;
END
$func$;

-- Ejemplos de uso:
-- Para admin (ver estadísticas por día):
-- SELECT * FROM get_estadisticas_por_dia(NULL, 'semana');
-- SELECT * FROM get_estadisticas_por_dia(NULL, 'mes');
-- SELECT * FROM get_estadisticas_por_dia(NULL, 'año');

-- Para conductor (ver sus estadísticas por día):
-- SELECT * FROM get_estadisticas_por_dia(123, 'semana');
-- SELECT * FROM get_estadisticas_por_dia(123, 'mes');
-- SELECT * FROM get_estadisticas_por_dia(123, 'año');
