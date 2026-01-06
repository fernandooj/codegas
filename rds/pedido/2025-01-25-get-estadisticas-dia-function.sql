-- Función auxiliar para parsear fecha de manera segura
-- Acepta TEXT (que puede venir de character varying o timestamp convertido)
DROP FUNCTION IF EXISTS safe_parse_fecha_entrega(TEXT);

CREATE OR REPLACE FUNCTION safe_parse_fecha_entrega(fecha_text TEXT)
RETURNS DATE
LANGUAGE plpgsql
AS $$
DECLARE
    fecha_result DATE;
    fecha_substring TEXT;
BEGIN
    -- Validar que la fecha no sea NULL o vacía
    IF fecha_text IS NULL OR fecha_text = '' OR TRIM(fecha_text) = '' THEN
        RETURN NULL;
    END IF;

    -- Intentar parsear formato DD/MM/YYYY
    IF fecha_text ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}' THEN
        BEGIN
            fecha_substring := SUBSTRING(fecha_text FROM '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}');
            IF fecha_substring IS NOT NULL AND fecha_substring != '' THEN
                fecha_result := TO_DATE(fecha_substring, 'DD/MM/YYYY');
                RETURN fecha_result;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RETURN NULL;
        END;
    END IF;

    -- Intentar parsear formato YYYY-MM-DD o timestamp
    IF fecha_text ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN
        BEGIN
            fecha_substring := SUBSTRING(fecha_text FROM '^[0-9]{4}-[0-9]{2}-[0-9]{2}');
            IF fecha_substring IS NOT NULL AND fecha_substring != '' THEN
                fecha_result := fecha_substring::DATE;
                RETURN fecha_result;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RETURN NULL;
        END;
    END IF;

    -- Si no coincide con ningún formato, retornar NULL
    RETURN NULL;
END;
$$;

-- Función principal para obtener estadísticas de pedidos del día actual
DROP FUNCTION IF EXISTS get_estadisticas_pedidos_dia();

CREATE OR REPLACE FUNCTION get_estadisticas_pedidos_dia()
RETURNS TABLE (
    total_pedidos BIGINT,
    entregados_activos BIGINT,
    entregados_noentregados BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    fecha_actual DATE;
BEGIN
    -- Obtener la fecha actual en la zona horaria de Colombia
    fecha_actual := (NOW() AT TIME ZONE 'America/Bogota')::DATE;
    
    RETURN QUERY
    WITH pedidos_del_dia AS (
        SELECT 
            p.*,
            safe_parse_fecha_entrega(p.fechaentregado::TEXT) as fecha_entregado_parseada
        FROM pedidos p
        WHERE p.eliminado = false
          AND p.fechaentregado IS NOT NULL
          AND TRIM(p.fechaentregado::TEXT) != ''
    )
    SELECT 
        -- Total de pedidos con fechaEntregado del día actual
        (SELECT COUNT(*)::BIGINT 
         FROM pedidos_del_dia 
         WHERE fecha_entregado_parseada = fecha_actual) as total_pedidos,
        -- Entregados activos: fechaEntregado del día actual, estado='activo'
        (SELECT COUNT(*)::BIGINT 
         FROM pedidos_del_dia 
         WHERE fecha_entregado_parseada = fecha_actual 
           AND LOWER(TRIM(COALESCE(estado, ''))) = 'activo') as entregados_activos,
        -- Entregados no entregados: fechaEntregado del día actual, estado='noentregado'
        (SELECT COUNT(*)::BIGINT 
         FROM pedidos_del_dia 
         WHERE fecha_entregado_parseada = fecha_actual 
           AND LOWER(TRIM(COALESCE(estado, ''))) = 'noentregado') as entregados_noentregados;
END;
$$;

