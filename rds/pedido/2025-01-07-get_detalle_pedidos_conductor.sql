DROP FUNCTION IF EXISTS get_detalle_pedidos_conductor;
CREATE OR REPLACE FUNCTION get_detalle_pedidos_conductor(
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

    RETURN QUERY
    SELECT 
        resultados.fechaentrega,
        resultados.cantidad_pedidos,
        resultados.total_kilos,
        resultados.vlr_contado,
        resultados.vlr_credito,
        resultados.valor_total
    FROM (
        -- Datos por día (para dia, semana, mes) o por mes (para año)
        SELECT 
            CASE 
                WHEN _periodo = 'año' THEN
                    -- Convertir mes a español manualmente (solo mes, sin año)
                    CASE EXTRACT(MONTH FROM fecha_grupo)
                        WHEN 1 THEN 'ENE'
                        WHEN 2 THEN 'FEB'
                        WHEN 3 THEN 'MAR'
                        WHEN 4 THEN 'ABR'
                        WHEN 5 THEN 'MAY'
                        WHEN 6 THEN 'JUN'
                        WHEN 7 THEN 'JUL'
                        WHEN 8 THEN 'AGO'
                        WHEN 9 THEN 'SEP'
                        WHEN 10 THEN 'OCT'
                        WHEN 11 THEN 'NOV'
                        WHEN 12 THEN 'DIC'
                    END
                ELSE
                    TO_CHAR(fecha_grupo, 'DD/MM/YYYY')
            END as fechaentrega,
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
            fecha_grupo as fecha_ordenamiento,
            1 as orden -- Para ordenar antes del total
        FROM (
            SELECT 
                p.*,
                CASE 
                    WHEN _periodo = 'año' THEN
                        DATE_TRUNC('month', 
                            CASE 
                                WHEN p.fechaEntregado LIKE '%/%' THEN 
                                    TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')::DATE
                                WHEN p.fechaEntregado LIKE '%-%' THEN 
                                    p.fechaEntregado::DATE
                                ELSE CURRENT_DATE
                            END
                        )
                    ELSE
                        CASE 
                            WHEN p.fechaEntregado LIKE '%/%' THEN 
                                TO_TIMESTAMP(p.fechaEntregado, 'DD/MM/YYYY HH24:MI')::DATE
                            WHEN p.fechaEntregado LIKE '%-%' THEN 
                                p.fechaEntregado::DATE
                            ELSE CURRENT_DATE
                        END
                END as fecha_grupo
            FROM pedidos p
        ) p
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
        GROUP BY fecha_grupo
        
        UNION ALL
        
        -- Total general
        SELECT 
            'TOTAL ' || 
            CASE 
                WHEN _periodo = 'dia' THEN TO_CHAR(CURRENT_DATE, 'DD/MM/YYYY')
                WHEN _periodo = 'semana' THEN 'SEMANA'
                WHEN _periodo = 'mes' THEN 'MES'
                WHEN _periodo = 'año' THEN 'AÑO'
                ELSE 'PERIODO'
            END::TEXT as fechaentrega,
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
            CURRENT_DATE + INTERVAL '100 years' as fecha_ordenamiento, -- Para ordenar al final
            2 as orden -- Para ordenar al final
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
    ) resultados
    ORDER BY 
        resultados.orden,
        resultados.fecha_ordenamiento;
END
$func$;

-- Ejemplos de uso:
-- Para conductor (ver sus estadísticas por día):
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'dia');
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'semana');
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'mes');
-- SELECT * FROM get_detalle_pedidos_conductor(123, 'año');

