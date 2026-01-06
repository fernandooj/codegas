-- Actualizar función para obtener ubicaciones de vehículos (menos restrictiva)
-- Ejecutar este script para actualizar la función en la base de datos

DROP FUNCTION IF EXISTS get_ubicaciones_vehiculos_activos();

CREATE OR REPLACE FUNCTION get_ubicaciones_vehiculos_activos()
RETURNS TABLE (
    carro_id INT,
    placa VARCHAR,
    conductor_id INT,
    nombre_conductor VARCHAR,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    velocidad DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    "timestamp" TIMESTAMP,
    minutos_desde_actualizacion INT,
    en_pedido BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH ultima_ubicacion AS (
        SELECT DISTINCT ON (t.carro_id)
            t.carro_id,
            t.conductor_id,
            t.latitud,
            t.longitud,
            t.velocidad,
            t.heading,
            t."timestamp",
            COALESCE(t.en_pedido, false) as en_pedido,
            EXTRACT(EPOCH FROM (NOW() - t."timestamp"))::INT / 60 as minutos
        FROM tracking_vehiculos t
        WHERE COALESCE(t.activo, TRUE) = TRUE  -- Considerar NULL como TRUE
        ORDER BY t.carro_id, t."timestamp" DESC
    )
    SELECT 
        u.carro_id,
        c.placa,
        u.conductor_id,
        COALESCE(us.nombre, us.email) as nombre_conductor,
        u.latitud,
        u.longitud,
        u.velocidad,
        u.heading,
        u."timestamp",
        u.minutos as minutos_desde_actualizacion,
        u.en_pedido
    FROM ultima_ubicacion u
    INNER JOIN carros c ON c._id = u.carro_id
    LEFT JOIN users us ON us._id = u.conductor_id
    WHERE u.minutos <= 1440  -- Últimas 24 horas (1440 minutos) - aumentado de 10 minutos
        AND COALESCE(c.activo, TRUE) = TRUE  -- Considerar NULL como activo
        AND COALESCE(c.eliminado, FALSE) = FALSE  -- Considerar NULL como no eliminado
    ORDER BY u."timestamp" DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_ubicaciones_vehiculos_activos IS 'Obtiene las ubicaciones de todos los vehículos activos (últimas 24 horas)';

