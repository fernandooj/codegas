-- Función para obtener pedidos en gestión (fechaEntrega = hoy y carroId = NULL)
-- Estos son pedidos programados para hoy que aún no tienen vehículo asignado

DROP FUNCTION IF EXISTS get_pedidos_en_gestion();

CREATE OR REPLACE FUNCTION get_pedidos_en_gestion()
RETURNS TABLE (
    total_pedidos BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    fecha_actual DATE;
BEGIN
    -- Obtener la fecha actual en la zona horaria de Colombia
    fecha_actual := (NOW() AT TIME ZONE 'America/Bogota')::DATE;
    
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_pedidos
    FROM pedidos p
    WHERE p.eliminado = false
      AND p.carroId IS NULL
      AND (
          p.fechaentrega IS NOT NULL
          AND TRIM(p.fechaentrega::TEXT) != ''
          AND safe_parse_fecha_entrega(p.fechaentrega::TEXT) = fecha_actual
      );
END;
$$;

COMMENT ON FUNCTION get_pedidos_en_gestion IS 'Obtiene el total de pedidos en gestión (fechaEntrega = hoy y carroId = NULL)';

-- Ejemplo de uso:
-- SELECT * FROM get_pedidos_en_gestion();

