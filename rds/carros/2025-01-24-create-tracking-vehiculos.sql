-- CREATE TABLE TRACKING_VEHICULOS
-- Tabla para almacenar el tracking en tiempo real de los vehículos/conductores

CREATE TABLE IF NOT EXISTS tracking_vehiculos (
    _id SERIAL PRIMARY KEY,
    carro_id INT REFERENCES carros(_id),
    conductor_id INT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    velocidad DECIMAL(5, 2) DEFAULT 0, -- km/h
    precision_metros INT, -- Precisión de la ubicación en metros
    heading DECIMAL(5, 2), -- Dirección en grados (0-360)
    "timestamp" TIMESTAMP DEFAULT (NOW() - INTERVAL '5 hours'),
    activo BOOLEAN DEFAULT TRUE,
    en_pedido BOOLEAN DEFAULT FALSE -- Si está realizando un pedido
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_tracking_carro_timestamp 
    ON tracking_vehiculos(carro_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_tracking_conductor_timestamp 
    ON tracking_vehiculos(conductor_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_tracking_activo 
    ON tracking_vehiculos(activo) WHERE activo = TRUE;

-- Función para obtener última ubicación de un vehículo
CREATE OR REPLACE FUNCTION get_ultima_ubicacion_vehiculo(p_carro_id INT)
RETURNS TABLE (
    carro_id INT,
    conductor_id INT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    velocidad DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    "timestamp" TIMESTAMP,
    minutos_desde_actualizacion INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.carro_id,
        t.conductor_id,
        t.latitud,
        t.longitud,
        t.velocidad,
        t.heading,
        t."timestamp",
        EXTRACT(EPOCH FROM (NOW() - t."timestamp"))::INT / 60 as minutos_desde_actualizacion
    FROM tracking_vehiculos t
    WHERE t.carro_id = p_carro_id 
        AND t.activo = TRUE
    ORDER BY t."timestamp" DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener ubicación de todos los vehículos activos
DROP FUNCTION IF EXISTS get_ubicaciones_vehiculos_activos;
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
            t.en_pedido,
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

-- Función para limpiar registros antiguos (ejecutar diariamente)
CREATE OR REPLACE FUNCTION limpiar_tracking_antiguos()
RETURNS INT AS $$
DECLARE
    registros_eliminados INT;
BEGIN
    -- Eliminar registros de más de 7 días
    DELETE FROM tracking_vehiculos
    WHERE "timestamp" < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS registros_eliminados = ROW_COUNT;
    RETURN registros_eliminados;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE tracking_vehiculos IS 'Almacena el tracking GPS en tiempo real de los vehículos';
COMMENT ON FUNCTION get_ultima_ubicacion_vehiculo IS 'Obtiene la última ubicación conocida de un vehículo';
COMMENT ON FUNCTION get_ubicaciones_vehiculos_activos IS 'Obtiene las ubicaciones de todos los vehículos activos';
COMMENT ON FUNCTION limpiar_tracking_antiguos IS 'Limpia registros de tracking de más de 7 días';

